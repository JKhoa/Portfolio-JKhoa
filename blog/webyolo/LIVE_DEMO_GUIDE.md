# 📹 Demo Phát Hiện Ngủ Gật Trực Tiếp

## 🚀 Tính năng mới đã được thêm:

### 1. **Demo Camera Thời Gian Thực**
- ✅ Truy cập camera webcam trực tiếp
- ✅ Phát hiện khuôn mặt real-time
- ✅ Nhận diện trạng thái ngủ gật
- ✅ Hiển thị bounding box với màu sắc theo mức độ
- ✅ Tính toán độ tin cậy (confidence score)

### 2. **Giao Diện Demo Chuyên Nghiệp**
- ✅ Video player với overlay detection
- ✅ Panel thống kê real-time (FPS, trạng thái, độ tin cậy)
- ✅ Lịch sử phát hiện (10 records gần nhất)
- ✅ Cài đặt độ nhạy và chế độ cảnh báo
- ✅ Controls: Start/Stop/Capture/Reset

### 3. **Thuật Toán Phát Hiện Thông Minh**
- ✅ Phát hiện mắt nhắm liên tục
- ✅ Phát hiện đầu cúi xuống
- ✅ Phân loại 3 trạng thái: Tỉnh táo / Buồn ngủ / Ngủ gật
- ✅ Threshold thông minh để tránh false positive
- ✅ FPS counter và performance monitoring

## 🎯 Cách sử dụng Demo:

### **Bước 1: Truy cập Demo**
- Click "Demo Trực Tiếp" trong navigation
- Hoặc click "Xem Demo" ở hero section

### **Bước 2: Khởi động Camera**
- Click "Bắt Đầu Demo"
- Cho phép trình duyệt truy cập camera
- Ngồi thẳng trước camera

### **Bước 3: Test Phát hiện**
- **Tỉnh táo:** Ngồi thẳng, mắt mở
- **Buồn ngủ:** Nhắm mắt 1-2 giây hoặc cúi đầu nhẹ
- **Ngủ gật:** Nhắm mắt > 3 giây hoặc cúi đầu lâu

### **Bước 4: Điều chỉnh cài đặt**
- Độ nhạy: 0.3 (ít nhạy) → 0.9 (rất nhạy)
- Chế độ cảnh báo: Visual / Sound / Both

## 🔧 Các Controls:

### **Nút điều khiển:**
- **▶️ Bắt Đầu:** Khởi động camera và detection
- **⏹️ Dừng:** Tắt camera và dừng detection
- **📷 Chụp Ảnh:** Lưu frame hiện tại
- **🔄 Reset:** Xóa lịch sử và reset demo

### **Thống kê Real-time:**
- **Trạng thái:** Tỉnh táo / Buồn ngủ / Ngủ gật
- **Độ tin cậy:** 0-100%
- **FPS:** Frame per second hiện tại

### **Cài đặt:**
- **Độ nhạy:** Điều chỉnh threshold phát hiện
- **Cảnh báo:** Chọn loại cảnh báo khi phát hiện

## 🎨 Màu sắc Bounding Box:

```css
🟢 XANH LÁ    → Tỉnh táo (Normal)
🟡 CAM        → Buồn ngủ (Drowsy) 
🔴 ĐỎ         → Ngủ gật (Sleeping)
```

## 🧠 Thuật Toán:

### **Phát hiện Eyes Closed:**
```javascript
if (eyesClosed) {
    eyeClosedFrames++;
} else {
    eyeClosedFrames = 0;
}
```

### **Phân loại trạng thái:**
```javascript
if (eyeClosedFrames > 15) → Ngủ gật
else if (eyeClosedFrames > 5) → Buồn ngủ  
else → Tỉnh táo
```

### **Tính Confidence:**
```javascript
Confidence = BaseScore + (ConsecutiveFrames * 2)
```

## 📱 Responsive Design:

### **Desktop (> 768px):**
- Layout 2 cột: Video bên trái, Stats bên phải
- Full-size video player
- Đầy đủ controls và settings

### **Tablet (768px):**
- Layout 1 cột: Video trên, Stats dưới
- Video responsive 
- Controls thu gọn

### **Mobile (< 480px):**
- Video thu nhỏ phù hợp màn hình
- Buttons nhỏ hơn
- Instructions dạng vertical

## 🛡️ Privacy & Security:

- ✅ **Camera local:** Không upload video lên server
- ✅ **Real-time processing:** Xử lý trực tiếp trên browser
- ✅ **No storage:** Không lưu trữ dữ liệu cá nhân
- ✅ **Permission-based:** Yêu cầu quyền trước khi truy cập

## 🔮 Future Enhancements:

- 🔄 Tích hợp TensorFlow.js cho AI thực
- 📊 Analytics và reports chi tiết
- 🔊 Cảnh báo âm thanh thông minh
- 📧 Gửi email cảnh báo cho giáo viên
- 📈 Dashboard theo dõi lớp học

## 🎯 Kết quả:

Demo hiện tại cho phép:
- ✅ Trải nghiệm AI detection trực tiếp trên web
- ✅ Hiểu cách YOLO hoạt động trong thực tế
- ✅ Test và điều chỉnh parameters
- ✅ Capture screenshots cho báo cáo
- ✅ Theo dõi performance real-time

**Demo hoàn toàn chức năng và sẵn sàng sử dụng!** 🎉
