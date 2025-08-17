const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Tăng limit cho base64 images
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Tạo thư mục data nếu chưa có
const dataDir = path.join(__dirname, 'data');
const drowsinessDir = path.join(dataDir, 'drowsiness');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
if (!fs.existsSync(drowsinessDir)) {
    fs.mkdirSync(drowsinessDir);
}

// Database file path
const drowsinessDBPath = path.join(drowsinessDir, 'drowsiness_data.json');

// Khởi tạo database nếu chưa có
function initializeDatabase() {
    if (!fs.existsSync(drowsinessDBPath)) {
        const initialData = {
            detections: [],
            lastUpdate: new Date().toISOString()
        };
        fs.writeFileSync(drowsinessDBPath, JSON.stringify(initialData, null, 2));
    }
}

// Đọc database
function readDatabase() {
    try {
        if (fs.existsSync(drowsinessDBPath)) {
            const data = fs.readFileSync(drowsinessDBPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading database:', error);
    }
    return { detections: [], lastUpdate: new Date().toISOString() };
}

// Lưu database
function saveDatabase(data) {
    try {
        data.lastUpdate = new Date().toISOString();
        fs.writeFileSync(drowsinessDBPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving database:', error);
        return false;
    }
}

// Lưu hình ảnh
function saveImage(imageData, detectionId) {
    try {
        // Tách base64 data
        const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        // Tạo tên file
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `drowsiness_${detectionId}_${timestamp}.jpg`;
        const imagePath = path.join(drowsinessDir, filename);
        
        // Lưu file
        fs.writeFileSync(imagePath, imageBuffer);
        return filename;
    } catch (error) {
        console.error('Error saving image:', error);
        return null;
    }
}

// Khởi tạo database
initializeDatabase();

// Cấu hình transporter cho Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nhakhoa1004@gmail.com', // Gmail của bạn
    pass: '1104' // App password, không phải mật khẩu Gmail thông thường
  }
});

// API Contact form
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'nhakhoa1004@gmail.com',
    subject: `Liên hệ từ ${name}`,
    text: `Tên: ${name}\nEmail: ${email}\nSố điện thoại: ${phone}\nNội dung: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Gửi email thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gửi email thất bại!', error });
  }
});

// API Lưu dữ liệu ngủ gật
app.post('/api/drowsiness/save', (req, res) => {
  try {
    const { imageData, status, confidence, timestamp, eyeClosedFrames, headDownFrames } = req.body;
    
    if (!imageData || !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu dữ liệu bắt buộc' 
      });
    }

    const detectionId = Date.now().toString();
    const filename = saveImage(imageData, detectionId);
    
    if (!filename) {
      return res.status(500).json({ 
        success: false, 
        message: 'Lỗi lưu hình ảnh' 
      });
    }

    // Đọc database hiện tại
    const db = readDatabase();
    
    // Tạo record mới
    const detection = {
      id: detectionId,
      timestamp: timestamp || new Date().toISOString(),
      status: status,
      confidence: confidence || 0,
      eyeClosedFrames: eyeClosedFrames || 0,
      headDownFrames: headDownFrames || 0,
      imageFile: filename,
      formattedTime: new Date(timestamp || Date.now()).toLocaleString('vi-VN')
    };

    // Thêm vào database
    db.detections.unshift(detection);
    
    // Giữ chỉ 100 records gần nhất
    if (db.detections.length > 100) {
      db.detections = db.detections.slice(0, 100);
    }

    // Lưu database
    if (saveDatabase(db)) {
      console.log(`Đã lưu detection: ${detectionId} - ${status}`);
      res.status(200).json({ 
        success: true, 
        message: 'Lưu dữ liệu thành công',
        detection: detection
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi lưu database' 
      });
    }

  } catch (error) {
    console.error('Error saving drowsiness data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

// API Lấy danh sách detections
app.get('/api/drowsiness/list', (req, res) => {
  try {
    const db = readDatabase();
    const { page = 1, limit = 20 } = req.query;
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const detections = db.detections.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      data: detections,
      total: db.detections.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(db.detections.length / limit)
    });
  } catch (error) {
    console.error('Error getting drowsiness list:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

// API Lấy hình ảnh
app.get('/api/drowsiness/image/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join(drowsinessDir, filename);
    
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy hình ảnh' 
      });
    }
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
  }
});

// API Xóa detection
app.delete('/api/drowsiness/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();
    
    const detectionIndex = db.detections.findIndex(d => d.id === id);
    if (detectionIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy detection' 
      });
    }

    const detection = db.detections[detectionIndex];
    
    // Xóa file hình ảnh
    if (detection.imageFile) {
      const imagePath = path.join(drowsinessDir, detection.imageFile);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Xóa khỏi database
    db.detections.splice(detectionIndex, 1);
    saveDatabase(db);

    res.status(200).json({ 
      success: true, 
      message: 'Đã xóa detection thành công' 
    });

  } catch (error) {
    console.error('Error deleting detection:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

// API Thống kê
app.get('/api/drowsiness/stats', (req, res) => {
  try {
    const db = readDatabase();
    const detections = db.detections;
    
    const stats = {
      total: detections.length,
      sleeping: detections.filter(d => d.status === 'Ngủ gật').length,
      drowsy: detections.filter(d => d.status === 'Buồn ngủ').length,
      alert: detections.filter(d => d.status === 'Ngủ gật' || d.status === 'Buồn ngủ').length,
      today: detections.filter(d => {
        const today = new Date().toDateString();
        const detectionDate = new Date(d.timestamp).toDateString();
        return today === detectionDate;
      }).length,
      averageConfidence: detections.length > 0 
        ? Math.round(detections.reduce((sum, d) => sum + (d.confidence || 0), 0) / detections.length)
        : 0
    };

    res.status(200).json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log(`Database path: ${drowsinessDBPath}`);
});