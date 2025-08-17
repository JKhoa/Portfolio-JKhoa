# 🎥 Hướng Dẫn Xử Lý Sự Cố Camera

## 🔧 Các Bước Kiểm Tra Cơ Bản

### 1. **Test Camera** 
```
1. Nhấn nút "Test Camera" màu vàng
2. Quan sát thông báo kết quả
3. Nếu thành công → tiếp tục "Bắt Đầu Demo"
4. Nếu thất bại → làm theo hướng dẫn bên dưới
```

### 2. **Kiểm Tra Browser Console**
```
1. Nhấn F12 để mở Developer Tools
2. Chuyển sang tab "Console"
3. Tìm các lỗi màu đỏ
4. Gửi screenshot cho developer nếu cần
```

## 🚨 Các Lỗi Thường Gặp

### ❌ **"Quyền truy cập camera bị từ chối"**
**Nguyên nhân**: Browser chặn quyền camera

**Giải pháp**:
1. **Chrome**: 
   - Nhấn vào icon 🔒 bên trái URL
   - Chọn "Camera" → "Allow"
   - Reload trang (F5)

2. **Firefox**:
   - Nhấn vào icon camera trên address bar
   - Chọn "Allow"
   - Reload trang

3. **Edge**:
   - Settings → Privacy & Security → Camera
   - Cho phép website truy cập camera

### ❌ **"Không tìm thấy camera"**
**Nguyên nhân**: Camera không được kết nối hoặc không hoạt động

**Giải pháp**:
1. Kiểm tra camera có được cắm đúng cách
2. Restart camera driver:
   - Windows: Device Manager → Camera → Disable/Enable
   - Mac: System Preferences → Security & Privacy → Camera
3. Thử với ứng dụng camera khác (Camera app trên Windows)
4. Restart trình duyệt

### ❌ **"Camera đang được sử dụng bởi ứng dụng khác"**
**Nguyên nhân**: Camera đang được dùng bởi app khác

**Giải pháp**:
1. Đóng tất cả ứng dụng video call (Zoom, Teams, Skype)
2. Đóng tất cả tab browser khác có sử dụng camera
3. Restart trình duyệt
4. Nếu vẫn lỗi, restart máy tính

### ❌ **"Trình duyệt không hỗ trợ camera"**
**Nguyên nhân**: Browser quá cũ hoặc không hỗ trợ WebRTC

**Giải pháp**:
1. **Update browser** lên phiên bản mới nhất:
   - Chrome: Settings → About Chrome
   - Firefox: Help → About Firefox
   - Edge: Settings → About Microsoft Edge

2. **Browsers được hỗ trợ**:
   - ✅ Chrome 53+
   - ✅ Firefox 50+
   - ✅ Edge 79+
   - ✅ Safari 11+
   - ❌ Internet Explorer (không hỗ trợ)

### ❌ **"Quá thời gian chờ kết nối camera"**
**Nguyên nhân**: Camera phản hồi chậm hoặc bị conflict

**Giải pháp**:
1. Đợi 30 giây rồi thử lại
2. Thử camera với ứng dụng khác trước
3. Restart USB camera (rút ra cắm lại)
4. Thử với camera khác nếu có

## 🛠️ Các Bước Debug Nâng Cao

### 1. **Kiểm Tra JavaScript Console**
```javascript
// Kiểm tra getUserMedia có hỗ trợ không
console.log(navigator.mediaDevices);

// Test camera trực tiếp
navigator.mediaDevices.getUserMedia({video: true})
  .then(stream => {
    console.log('Camera OK:', stream);
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => console.error('Camera Error:', err));
```

### 2. **Kiểm Tra Permissions**
```javascript
// Kiểm tra quyền camera
navigator.permissions.query({name: 'camera'})
  .then(result => console.log('Camera permission:', result.state));
```

### 3. **Kiểm Tra Camera List**
```javascript
// Liệt kê tất cả camera
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    const cameras = devices.filter(d => d.kind === 'videoinput');
    console.log('Available cameras:', cameras);
  });
```

## 🎯 Browser-Specific Solutions

### **Chrome Issues**
```
1. chrome://settings/content/camera
2. Add exception cho jkhoa.dev
3. Clear browser data if needed
4. Disable extensions that might interfere
```

### **Firefox Issues**
```
1. about:preferences#privacy
2. Permissions → Camera → Settings
3. Remove và add lại permission
4. Disable tracking protection for site
```

### **Safari Issues**
```
1. Safari → Preferences → Websites → Camera
2. Set to "Allow" for jkhoa.dev
3. Clear website data
4. Check system camera permissions
```

## 📱 Mobile Browsers

### **Chrome Mobile**
```
1. Settings → Site Settings → Camera
2. Add jkhoa.dev to allowed sites
3. Use rear camera if front doesn't work
```

### **Safari iOS**
```
1. Settings → Safari → Camera
2. Allow camera access
3. Make sure iOS 14.3+ for better WebRTC support
```

## ⚡ Quick Fixes

### **Reload Methods**
```
1. Normal: F5 hoặc Ctrl+R
2. Hard reload: Ctrl+Shift+R  
3. Clear cache: Ctrl+Shift+Delete
4. Private/Incognito mode test
```

### **Alternative Testing**
```
1. Test trên jkhoa.dev/blog/webyolo/
2. Test trên localhost nếu có
3. Test với device khác
4. Test với browser khác
```

## 🆘 Khi Mọi Thứ Đều Thất Bại

### **Hardware Issues**
```
1. Camera driver outdated → Update từ Device Manager
2. USB port issue → Thử port khác
3. Camera defective → Test với app khác
4. Privacy settings → Check Windows/Mac camera permissions
```

### **Network Issues**
```
1. Corporate firewall → Contact IT
2. VPN interference → Disconnect VPN
3. Ad blockers → Disable temporarily
4. Antivirus blocking → Add exception
```

### **System Issues**
```
1. Windows Camera service stopped → Services.msc → start Camera service
2. Mac camera permission → System Preferences → Security → Camera
3. Low system resources → Close other apps
4. Driver conflicts → Update all drivers
```

## 📞 Contact Support

Nếu vẫn không giải quyết được:

1. **Prepare info**:
   - OS: Windows/Mac/Linux version
   - Browser: Name và version
   - Camera: Model/brand
   - Error message: Screenshot console

2. **Send to**: jkhoa.dev support
   - Include all debugging info
   - Screenshots of errors
   - Steps you've tried

## ✅ Prevention Tips

1. **Regular updates**: Browser và OS
2. **Permission management**: Regularly check camera permissions
3. **Extension conflicts**: Disable unnecessary extensions
4. **Clean browser**: Clear cache/cookies monthly
5. **Hardware care**: Keep camera clean và properly connected

---

**Lưu ý**: Hầu hết vấn đề camera đều liên quan đến permissions và browser compatibility. Luôn thử "Test Camera" trước khi bắt đầu demo chính thức!
