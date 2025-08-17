# 🚀 YOLO Demo Enhanced - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

Phiên bản Enhanced của YOLO Demo đã được tích hợp đầy đủ chức năng database và sửa lỗi chatbot. Demo này kết hợp giữa giao diện cũ của `blog/webyolo` với chức năng database từ `yolo-demo`.

## ✨ Tính Năng Mới

### 🔄 **Tích Hợp Database Hoàn Chỉnh**
- **Lưu trữ tự động** khi phát hiện ngủ gật
- **Thống kê real-time** (tổng số, ngủ gật, buồn ngủ, hôm nay)
- **Quản lý dữ liệu** với khả năng xem, xóa records
- **Kết nối server** với API endpoints

### 🤖 **Chatbot Đã Sửa Lỗi**
- **Tương tác mượt mà** - không còn lỗi không nhấn được
- **AI responses** thông minh về YOLO và demo
- **Bộ nhớ người dùng** - lưu trữ thông tin cá nhân
- **Cài đặt AI** - tùy chỉnh Groq API key

### 🎯 **Chức Năng Demo Nâng Cao**
- **Phát hiện ngủ gật** mô phỏng với độ chính xác cao
- **Lưu ảnh tự động** vào database khi phát hiện
- **Lịch sử phát hiện** real-time
- **Cài đặt độ nhạy** tùy chỉnh

## 🛠️ Cài Đặt và Chạy

### 1. Khởi động Server
```bash
# Chạy server backend
node server.js
```

### 2. Truy cập Demo
Mở file `blog/webyolo/index.html` trong trình duyệt

## 🎮 Cách Sử Dụng

### **Demo Phát Hiện**
1. **Nhấn "Bắt Đầu Demo"** - cho phép truy cập camera
2. **Ngồi trước camera** - AI sẽ phát hiện khuôn mặt
3. **Thử nghiệm** - nhắm mắt hoặc cúi đầu để test
4. **Quan sát kết quả** - trạng thái và độ tin cậy

### **Database Management**
- **Làm Mới** - cập nhật dữ liệu từ server
- **Xóa Tất Cả** - xóa toàn bộ dữ liệu (cẩn thận!)
- **Thống kê** - xem số liệu tổng quan
- **Danh sách** - xem chi tiết từng detection

### **Chatbot AI**
- **Nhấn icon chat** - mở chatbot
- **Hỏi về YOLO** - "yolo", "demo", "camera", "database"
- **Cài đặt AI** - nhấn icon cài đặt trong chatbot
- **Lưu thông tin** - chatbot nhớ tên và sở thích

## 🔧 Cài Đặt Nâng Cao

### **Độ Nhạy Phát Hiện**
- Điều chỉnh thanh trượt "Độ nhạy phát hiện"
- Giá trị cao = phát hiện nhanh hơn
- Giá trị thấp = chính xác hơn

### **Tự Động Lưu**
- **Bật** - tự động lưu khi phát hiện ngủ gật
- **Tắt** - chỉ lưu khi nhấn "Chụp Ảnh"

### **Chế Độ Cảnh Báo**
- **Hiển thị trực quan** - box màu trên video
- **Âm thanh** - cảnh báo bằng âm thanh
- **Cả hai** - kết hợp cả hai chế độ

## 📊 Database Schema

### **Detection Record**
```json
{
  "id": "timestamp",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "status": "Ngủ gật",
  "confidence": 85,
  "eyeClosedFrames": 20,
  "headDownFrames": 5,
  "imageFile": "detection_1234567890.jpg",
  "formattedTime": "01/01/2024 19:00:00"
}
```

### **Statistics**
```json
{
  "total": 150,
  "sleeping": 45,
  "drowsy": 30,
  "today": 12,
  "average_confidence": 78.5
}
```

## 🔗 API Endpoints

### **Lưu Detection**
```
POST /api/drowsiness/save
Content-Type: application/json

{
  "imageData": "base64_image_data",
  "status": "Ngủ gật",
  "confidence": 85,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "eyeClosedFrames": 20,
  "headDownFrames": 5
}
```

### **Lấy Danh Sách**
```
GET /api/drowsiness/list?limit=20
```

### **Thống Kê**
```
GET /api/drowsiness/stats
```

### **Xóa Detection**
```
DELETE /api/drowsiness/{id}
```

## 🎨 Giao Diện

### **Màu Sắc**
- **Xanh lá** - Tỉnh táo
- **Vàng** - Buồn ngủ  
- **Đỏ** - Ngủ gật

### **Thông Báo**
- **Xanh** - Thành công
- **Đỏ** - Lỗi
- **Vàng** - Cảnh báo
- **Xanh dương** - Thông tin

## 🐛 Xử Lý Lỗi

### **Không Kết Nối Server**
- Kiểm tra server đã chạy chưa
- Đảm bảo port 3001 không bị block
- Kiểm tra firewall

### **Lỗi Camera**
- Cho phép quyền truy cập camera
- Kiểm tra camera có hoạt động không
- Thử refresh trang

### **Chatbot Không Hoạt Động**
- Kiểm tra JavaScript console
- Đảm bảo tất cả elements đã load
- Thử refresh trang

## 📝 Ghi Chú

- **Demo sử dụng mô phỏng** - không phải YOLO thực
- **Database local** - dữ liệu lưu trên máy local
- **Chrome/Firefox** - khuyến nghị sử dụng
- **HTTPS** - cần thiết cho camera trên production

## 🔄 Cập Nhật

### **Từ phiên bản cũ:**
- ✅ Giữ nguyên giao diện `blog/webyolo`
- ✅ Thêm chức năng database hoàn chỉnh
- ✅ Sửa lỗi chatbot không nhấn được
- ✅ Cải thiện UX/UI

### **So với `yolo-demo`:**
- ✅ Giao diện đẹp hơn với theme cũ
- ✅ Tích hợp chatbot AI
- ✅ Thêm lịch sử phát hiện real-time
- ✅ Cài đặt nâng cao

---

**🎯 Kết quả:** Demo hoàn chỉnh với database + chatbot AI + giao diện đẹp!
