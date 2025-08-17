# 📸 Hướng Dẫn Database Lưu Ảnh Tự Động

## 🎯 Tính Năng Mới
Hệ thống phát hiện ngủ gật đã được nâng cấp với khả năng:
- **Tự động chụp ảnh** khi phát hiện ngủ gật
- **Lưu trữ local** với timestamp chi tiết
- **Thư viện ảnh** để xem lại các lần phát hiện
- **Xuất dữ liệu** và quản lý bộ nhớ thông minh

## 🚀 Cách Sử Dụng

### 1. Bắt Đầu Demo
```
1. Nhấn "Bắt Đầu Demo"
2. Cho phép truy cập camera khi được yêu cầu
3. Hệ thống sẽ tự động bắt đầu phát hiện
```

### 2. Chụp Ảnh Tự Động
- ⚡ **Tự động**: Khi phát hiện trạng thái "Ngủ gật", hệ thống sẽ tự động chụp ảnh
- 📱 **Thủ công**: Nhấn nút "Chụp Ảnh" bất cứ lúc nào
- 💾 **Lưu trữ**: Mỗi ảnh được lưu với thời gian, trạng thái, và độ tin cậy

### 3. Xem Thư Viện Ảnh
```
1. Nhấn nút "Thư Viện Ảnh" 
2. Xem tất cả ảnh đã chụp với thông tin chi tiết
3. Sắp xếp theo thời gian (mới nhất trước)
```

## 📊 Thông Tin Lưu Trữ

### Mỗi ảnh bao gồm:
- **🕒 Timestamp**: Thời gian chụp chính xác
- **📍 Trạng thái**: "Ngủ gật", "Buồn ngủ", hoặc "Chụp thủ công"  
- **🎯 Độ tin cậy**: Phần trăm chính xác của phát hiện
- **🖼️ Ảnh**: Snapshot từ camera tại thời điểm phát hiện

### Ví dụ dữ liệu:
```json
{
  "id": "1703123456789",
  "timestamp": "2024-12-21T10:30:45.123Z",
  "timeString": "21/12/2024 17:30:45",
  "status": "Ngủ gật",
  "confidence": 85,
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "size": 245760
}
```

## 🛠️ Tính Năng Quản Lý

### 📁 Xuất Dữ Liệu
- Xuất tất cả ảnh và metadata thành file JSON
- Tên file: `drowsiness_images_YYYY-MM-DD.json`
- Có thể import lại hoặc phân tích bằng công cụ khác

### 🗑️ Xóa Dữ Liệu
- Xóa toàn bộ thư viện ảnh một cách an toàn
- Có xác nhận trước khi xóa
- Giải phóng bộ nhớ trình duyệt

### 💾 Quản Lý Bộ Nhớ Thông Minh
- Tự động giữ tối đa 50 ảnh gần nhất
- Khi đầy, xóa ảnh cũ để lưu ảnh mới
- Thông báo khi bộ nhớ gần đầy

## 🔧 Cài Đặt Nâng Cao

### Auto Capture (Tự động chụp)
```javascript
// Trong constructor DrowsinessDetector
this.autoCapture = true; // Bật/tắt tự động chụp
```

### Giới hạn lưu trữ
```javascript
// Trong saveToDatabase()
if (database.length > 50) {
    database = database.slice(-50); // Giữ 50 ảnh gần nhất
}
```

### Threshold phát hiện
```javascript
// Trong simulateDetection()
if (alertLevel === 'sleeping' && this.autoCapture) {
    this.captureAndSaveImage(new Date(), status, confidence);
}
```

## 📱 Giao Diện Thư Viện

### Layout Responsive
- **Desktop**: Grid 4-5 cột
- **Tablet**: Grid 2-3 cột  
- **Mobile**: Grid 1-2 cột

### Thông Tin Hiển Thị
```
┌─────────────────┐
│  [Ảnh Preview]  │
├─────────────────┤
│ 🕒 21/12 17:30  │
│ ⚠️ Ngủ gật      │  
│ 🎯 85%          │
└─────────────────┘
```

## 🚨 Lưu Ý Bảo Mật

### LocalStorage
- ✅ Dữ liệu chỉ lưu trên máy tính cá nhân
- ✅ Không gửi lên server nào
- ✅ Tự xóa khi clear browser data

### Privacy
- 🔒 Ảnh không được chia sẻ
- 🔒 Chỉ accessible từ domain hiện tại
- 🔒 Tự động hết hạn khi xóa browser cache

## 🐛 Xử Lý Lỗi

### Camera không hoạt động
```
❌ Lỗi: "Không thể truy cập camera"
✅ Giải pháp: Kiểm tra quyền camera trong browser
```

### Bộ nhớ đầy
```
❌ Lỗi: "QuotaExceededError"  
✅ Giải pháp: Tự động xóa ảnh cũ và thử lại
```

### Không thể chụp ảnh
```
❌ Lỗi: "Camera or canvas not available"
✅ Giải pháp: Khởi động lại demo
```

## 📈 Performance

### Tối ưu hóa
- Ảnh được nén JPEG quality 80%
- Tự động resize về 640x480 max
- Lazy loading cho thư viện ảnh lớn

### Giới hạn
- **Max ảnh**: 50 ảnh (tự động cleanup)
- **Max size/ảnh**: ~250KB 
- **Total storage**: ~12.5MB
- **Browser limit**: 5-10MB per domain

## 🎉 Kết Luận

Hệ thống database ảnh mới cung cấp:
- 📸 **Tự động capture** khi ngủ gật
- 💾 **Local storage** an toàn
- 📊 **Data management** thông minh  
- 🖼️ **Visual gallery** dễ sử dụng
- 📁 **Export/import** linh hoạt

**Lưu ý**: Hệ thống hoạt động hoàn toàn offline và không cần internet!
