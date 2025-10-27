# YOLO AI Project - Drowsiness Detection System

## 📋 Tổng Quan Dự Án

Dự án **YOLO AI** là một hệ thống nhận diện sinh viên ngủ gật trong lớp học sử dụng công nghệ Computer Vision và Machine Learning. Dự án được phát triển bởi **Nguyễn Hoàng Anh Khoa** - sinh viên năm cuối ngành Công nghệ thông tin tại Đại học Đà Lạt.

### 🎯 Mục Tiêu
- Phát hiện trạng thái ngủ gật của sinh viên trong thời gian thực
- Cải thiện chất lượng học tập và giúp giáo viên theo dõi tình trạng sinh viên
- Ứng dụng công nghệ AI tiên tiến vào giáo dục

### 📊 Kết Quả Đạt Được
- **mAP (Mean Average Precision)**: 94.2%
- **Precision**: 96.8%
- **Recall**: 92.1%
- **F1-Score**: 94.4%
- **Tốc độ xử lý**: 25 FPS

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **HTML5 & CSS3**: Giao diện responsive và hiện đại
- **JavaScript ES6+**: Logic xử lý và tương tác
- **WebRTC**: Truy cập camera thời gian thực
- **Canvas API**: Xử lý và hiển thị hình ảnh
- **LocalStorage**: Lưu trữ dữ liệu local

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MySQL**: Database management
- **RESTful API**: Giao tiếp giữa frontend và backend
- **CORS**: Hỗ trợ cross-origin requests

### AI & Machine Learning
- **YOLOv8**: Mô hình nhận diện đối tượng
- **Groq API**: AI chatbot với Llama3-8b model
- **Computer Vision**: Phát hiện khuôn mặt và trạng thái
- **Deep Learning**: CNN cho feature extraction

### Database
- **MySQL**: Hệ quản trị cơ sở dữ liệu
- **Connection Pooling**: Tối ưu hiệu suất
- **Automated Cleanup**: Tự động dọn dẹp dữ liệu cũ
- **Backup System**: Hệ thống sao lưu

## 📁 Cấu Trúc Dự Án

```
blog/webyolo/
├── index.html              # Trang chính
├── css/
│   └── style.css           # Stylesheet chính
├── js/
│   └── script.js           # JavaScript chính
├── server.js               # Backend server
├── package.json            # Dependencies
├── database_schema.sql     # Database schema
└── README.md              # Tài liệu này
```

## 🚀 Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống
- Node.js >= 14.0.0
- MySQL >= 5.7
- Modern web browser (Chrome, Firefox, Edge)

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd blog/webyolo
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

### Bước 3: Thiết Lập Database
```bash
# Tạo database và user
mysql -u root -p < database_schema.sql

# Hoặc chạy từng lệnh SQL trong file database_schema.sql
```

### Bước 4: Cấu Hình Environment Variables
Tạo file `.env`:
```env
DB_HOST=localhost
DB_USER=yolo_app
DB_PASSWORD=yolo_password_2024
DB_NAME=yolo_ai_project
PORT=3000
```

### Bước 5: Chạy Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Bước 6: Truy Cập Ứng Dụng
Mở trình duyệt và truy cập: `http://localhost:3000`

## 📖 Hướng Dẫn Sử Dụng

### Demo Phát Hiện Ngủ Gật
1. Click "Bắt Đầu Demo" để khởi động camera
2. Cho phép truy cập camera khi được yêu cầu
3. Ngồi thẳng trước camera để AI phát hiện khuôn mặt
4. Thử nghiệm bằng cách nhắm mắt hoặc cúi đầu
5. Quan sát kết quả phát hiện và độ tin cậy

### Chatbot AI
1. Click vào biểu tượng chat ở góc phải màn hình
2. Nhập câu hỏi về YOLO, Machine Learning, hoặc dự án
3. Để có trải nghiệm AI thực:
   - Click Settings ⚙️
   - Nhập Groq API key (miễn phí tại console.groq.com/keys)
   - Lưu cài đặt và thử lại

### Database Management
- **Xem thống kê**: Dashboard hiển thị số liệu real-time
- **Export dữ liệu**: Chức năng xuất dữ liệu phát hiện
- **Clear database**: Xóa toàn bộ dữ liệu (cẩn thận!)

## 🔧 API Endpoints

### Detections
- `GET /api/detections` - Lấy danh sách phát hiện
- `POST /api/detections` - Lưu phát hiện mới
- `DELETE /api/detections` - Xóa tất cả phát hiện

### Chatbot
- `POST /api/chat` - Chat với AI

### Statistics
- `GET /api/stats` - Thống kê tổng quan
- `GET /api/dashboard` - Dữ liệu dashboard
- `GET /api/health` - Kiểm tra trạng thái hệ thống

## 📊 Database Schema

### Bảng chính:
- **detections**: Lưu kết quả phát hiện ngủ gật
- **users**: Quản lý thông tin người dùng
- **chatbot_conversations**: Lịch sử cuộc trò chuyện
- **system_settings**: Cài đặt hệ thống
- **usage_stats**: Thống kê sử dụng
- **sessions**: Quản lý phiên làm việc

## 🎓 Kiến Thức Kỹ Thuật

### Machine Learning Pipeline
1. **Data Collection**: Thu thập 10,000+ hình ảnh sinh viên
2. **Data Labeling**: Gán nhãn với LabelImg
3. **Data Preprocessing**: Augmentation và normalization
4. **Model Training**: YOLOv8 với transfer learning
5. **Evaluation**: Testing với các chỉ số chuẩn

### Computer Vision Techniques
- **Face Detection**: Phát hiện khuôn mặt trong video
- **Eye Tracking**: Theo dõi chuyển động mắt
- **Head Pose Estimation**: Ước tính góc nghiêng đầu
- **Feature Extraction**: CNN cho đặc trưng

### YOLO Architecture
- **YOLOv1 (2016)**: Phiên bản đầu tiên
- **YOLOv3 (2018)**: Cải thiện đáng kể
- **YOLOv5 (2020)**: Tối ưu cho production
- **YOLOv8 (2023)**: Phiên bản mới nhất

## 🔒 Bảo Mật và Privacy

- **Local Processing**: Xử lý hình ảnh trên client
- **Data Encryption**: Mã hóa dữ liệu nhạy cảm
- **API Key Security**: Bảo mật API keys
- **User Consent**: Yêu cầu đồng ý truy cập camera

## 🐛 Troubleshooting

### Lỗi Camera
- Kiểm tra quyền truy cập camera
- Đảm bảo không có ứng dụng khác đang sử dụng camera
- Thử refresh trang và cho phép lại

### Lỗi Database
- Kiểm tra MySQL đang chạy
- Xác nhận thông tin kết nối database
- Chạy lại database schema

### Lỗi API
- Kiểm tra Groq API key
- Xác nhận kết nối internet
- Kiểm tra console để xem lỗi chi tiết

## 📈 Performance Optimization

- **Connection Pooling**: Tối ưu kết nối database
- **Image Compression**: Nén hình ảnh trước khi lưu
- **Caching**: Cache dữ liệu thường dùng
- **Lazy Loading**: Tải dữ liệu theo yêu cầu

## 🔮 Tính Năng Tương Lai

- [ ] Multi-user support
- [ ] Real-time notifications
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Integration with LMS
- [ ] Multi-language support

## 📞 Liên Hệ

**Tác giả**: Nguyễn Hoàng Anh Khoa  
**Email**: nhakhoa1004@gmail.com  
**Phone**: 0395123864  
**Trường**: Đại học Đà Lạt  
**Ngành**: Công nghệ thông tin  

## 📄 License

Dự án này được phát hành dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 🙏 Acknowledgments

- YOLO team cho thuật toán tuyệt vời
- Groq cho API miễn phí
- Cộng đồng open source
- Giảng viên và bạn bè đã hỗ trợ

---

**© 2024 YOLO AI Project by Nguyễn Hoàng Anh Khoa. All rights reserved.**