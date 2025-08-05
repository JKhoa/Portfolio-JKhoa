# 🚀 Hướng dẫn Upload Website lên Hostinger

## 📋 Bước 1: Mua Hosting từ Hostinger

1. **Đăng nhập Hostinger Control Panel**
2. **Chọn "Buy website hosting"**
3. **Chọn gói hosting phù hợp:**
   - **Premium**: Phù hợp cho website portfolio
   - **Business**: Nếu cần nhiều tài nguyên hơn
4. **Liên kết domain `jkhoa.site` với hosting plan**

## 📋 Bước 2: Lấy thông tin FTP

1. **Vào Hostinger Control Panel**
2. **Chọn Hosting > Manage > Files > FTP Accounts**
3. **Tạo FTP account mới hoặc sử dụng account có sẵn**
4. **Ghi lại thông tin:**
   - FTP Server (ví dụ: `ftp.jkhoa.site`)
   - FTP Username
   - FTP Password

## 📋 Bước 3: Cập nhật cấu hình

1. **Mở file `ftp-config.json`**
2. **Thay thế thông tin mẫu bằng thông tin thực:**

```json
{
  "ftp_server": "ftp.jkhoa.site",
  "ftp_username": "your-actual-username",
  "ftp_password": "your-actual-password",
  "ftp_path": "/public_html/"
}
```

## 📋 Bước 4: Chạy script upload

```powershell
# Mở PowerShell trong thư mục dự án
.\upload-hostinger.ps1
```

## 📋 Bước 5: Kiểm tra website

1. **Chờ 5-10 phút để DNS cập nhật**
2. **Truy cập: https://jkhoa.site**
3. **Kiểm tra tất cả chức năng website**

## 🔧 Troubleshooting

### ❌ Lỗi "Connection refused"
- Kiểm tra thông tin FTP server
- Đảm bảo hosting đã được kích hoạt

### ❌ Lỗi "Authentication failed"
- Kiểm tra username/password FTP
- Đảm bảo FTP account đã được tạo

### ❌ Website không hiển thị
- Kiểm tra file `index.html` đã được upload
- Đảm bảo domain đã được liên kết với hosting
- Chờ DNS cập nhật (có thể mất 24-48 giờ)

## 📁 Cấu trúc file sau khi upload

```
public_html/
├── index.html          # Trang chính
├── styles.css          # CSS tùy chỉnh
├── script.js           # JavaScript
├── CNAME               # Cấu hình domain
└── html5up-miniport/   # Assets và images
    ├── assets/
    │   ├── css/
    │   ├── js/
    │   └── images/
    └── images/
```

## 🎯 Lưu ý quan trọng

- **Bảo mật**: Không chia sẻ file `ftp-config.json` chứa mật khẩu
- **Backup**: Luôn backup website trước khi upload
- **SSL**: Kích hoạt SSL certificate cho HTTPS
- **Performance**: Tối ưu hóa images và CSS để tăng tốc độ tải

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra log lỗi trong PowerShell
2. Xem hướng dẫn Hostinger
3. Liên hệ Hostinger support 