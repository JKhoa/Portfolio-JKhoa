# 🧠 YOLO Demo với Database - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

Dự án YOLO Demo với Database là một ứng dụng web thời gian thực phát hiện ngủ gật sử dụng công nghệ YOLO AI, tích hợp với hệ thống lưu trữ database để ghi lại các sự kiện phát hiện ngủ gật.

## 🚀 Tính Năng Chính

- **Phát hiện ngủ gật thời gian thực** qua camera
- **Lưu trữ database** tự động khi phát hiện ngủ gật
- **Giao diện trực quan** với thống kê real-time
- **Quản lý dữ liệu** với khả năng xem, xóa records
- **Responsive design** hoạt động trên mọi thiết bị

## 🛠️ Cài Đặt và Chạy

### 1. Cài đặt Dependencies

```bash
npm install express nodemailer body-parser cors
```

### 2. Khởi động Server

```bash
node server.js
```

Server sẽ chạy tại: `http://localhost:3001`

### 3. Truy cập Demo

Mở file `yolo-demo.html` trong trình duyệt hoặc truy cập qua portfolio:
- Portfolio chính: `index.html`
- Demo YOLO: `yolo-demo.html`

## 📁 Cấu Trúc Dự Án

```
Portfolio-JKhoa/
├── server.js                 # Backend server với API endpoints
├── yolo-demo.html           # Frontend demo YOLO
├── index.html               # Portfolio chính
├── data/                    # Thư mục lưu trữ dữ liệu
│   └── drowsiness/
│       ├── drowsiness_data.json  # Database file
│       └── *.jpg                  # Hình ảnh được lưu
└── blog/webyolo/           # Dự án YOLO gốc
```

## 🔧 API Endpoints

### 1. Lưu dữ liệu ngủ gật
```
POST /api/drowsiness/save
```
**Body:**
```json
{
  "imageData": "base64_image_data",
  "status": "Ngủ gật",
  "confidence": 85,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "eyeClosedFrames": 20,
  "headDownFrames": 15
}
```

### 2. Lấy danh sách detections
```
GET /api/drowsiness/list?page=1&limit=20
```

### 3. Lấy thống kê
```
GET /api/drowsiness/stats
```

### 4. Lấy hình ảnh
```
GET /api/drowsiness/image/:filename
```

### 5. Xóa detection
```
DELETE /api/drowsiness/:id
```

## 🎯 Cách Sử Dụng Demo

### 1. Khởi động Demo
1. Mở file `yolo-demo.html` trong trình duyệt
2. Click "Test Camera" để kiểm tra camera
3. Click "Bắt Đầu Demo" để bắt đầu phát hiện

### 2. Cài đặt
- **Tự động lưu**: Bật/tắt tính năng tự động lưu khi phát hiện ngủ gật
- **Reset Demo**: Khởi động lại demo

### 3. Quản lý Database
- **Làm Mới**: Cập nhật dữ liệu từ database
- **Xóa Tất Cả**: Xóa toàn bộ dữ liệu (cẩn thận!)
- **Xóa từng record**: Click nút 🗑️ bên cạnh mỗi record

## 📊 Thống Kê Hiển Thị

- **Tổng số phát hiện**: Tất cả records trong database
- **Ngủ gật**: Số lần phát hiện ngủ gật
- **Buồn ngủ**: Số lần phát hiện buồn ngủ
- **Hôm nay**: Số phát hiện trong ngày hôm nay

## 🔍 Cách Hoạt Động

### 1. Phát Hiện Ngủ Gật
- Sử dụng thuật toán mô phỏng (có thể thay thế bằng YOLO thực)
- Phát hiện dựa trên:
  - Số frame nhắm mắt liên tiếp
  - Số frame cúi đầu liên tiếp
  - Ngưỡng cảnh báo có thể điều chỉnh

### 2. Lưu Trữ Database
- Tự động chụp ảnh khi phát hiện ngủ gật
- Lưu thông tin: thời gian, trạng thái, độ tin cậy
- Hình ảnh được lưu dưới dạng file JPG
- Metadata được lưu trong JSON

### 3. Giao Diện Real-time
- Hiển thị trạng thái phát hiện
- FPS counter
- Detection box với màu sắc tương ứng
- Thông báo real-time

## 🎨 Giao Diện

### Màu Sắc Detection Box
- **Xanh lá** (`normal`): Tỉnh táo
- **Cam** (`drowsy`): Buồn ngủ
- **Đỏ** (`sleeping`): Ngủ gật

### Responsive Design
- Hoạt động trên desktop, tablet, mobile
- Grid layout tự động điều chỉnh
- Touch-friendly controls

## 🔧 Tùy Chỉnh

### 1. Thay đổi Server URL
Trong file `yolo-demo.html`, tìm dòng:
```javascript
this.serverUrl = 'http://localhost:3001';
```

### 2. Điều chỉnh Ngưỡng Phát Hiện
```javascript
this.alertThreshold = 15; // Số frame để trigger cảnh báo
```

### 3. Thay đổi YOLO Model
Thay thế hàm `simulateDetection()` bằng YOLO model thực:
```javascript
// Thay thế bằng YOLO model thực
async detectWithYOLO(imageData) {
    // Gọi YOLO API hoặc model local
}
```

## 🚨 Lưu Ý Bảo Mật

1. **Camera Permission**: Cần quyền truy cập camera
2. **HTTPS**: Nên chạy trên HTTPS để truy cập camera
3. **Database Security**: Dữ liệu được lưu local, không gửi lên cloud
4. **Image Storage**: Hình ảnh được lưu local, có thể xóa khi cần

## 🐛 Xử Lý Lỗi

### Lỗi Camera
- Kiểm tra quyền truy cập camera
- Đảm bảo camera không bị sử dụng bởi ứng dụng khác
- Thử refresh trang và cấp quyền lại

### Lỗi Database
- Kiểm tra quyền ghi file trong thư mục `data/`
- Đảm bảo đủ dung lượng ổ cứng
- Restart server nếu cần

### Lỗi Kết Nối Server
- Kiểm tra server có đang chạy không
- Kiểm tra port 3001 có bị block không
- Thử thay đổi port trong `server.js`

## 📈 Phát Triển Tiếp

### 1. Tích hợp YOLO Model Thực
- Sử dụng TensorFlow.js hoặc ONNX.js
- Load pre-trained YOLO model
- Thay thế simulation bằng detection thực

### 2. Thêm Tính Năng
- Email notification khi phát hiện ngủ gật
- Dashboard analytics chi tiết
- Export dữ liệu ra Excel/CSV
- Real-time alert system

### 3. Cải Thiện UI/UX
- Dark/Light theme
- Customizable detection parameters
- Video recording feature
- Advanced filtering options

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console browser (F12)
2. Kiểm tra terminal server
3. Đảm bảo tất cả dependencies đã cài đặt
4. Thử restart server và refresh trang

---

**Tác giả**: Nguyễn Hoàng Anh Khoa  
**Email**: nhakhoa1004@gmail.com  
**GitHub**: https://github.com/jkhoa
