# 🚀 Hướng dẫn Deploy Tự Động trên Netlify

## 📋 Bước 1: Kết nối GitHub Repository với Netlify

1. **Đăng nhập Netlify Dashboard**
2. **Chọn "Add new project"**
3. **Chọn "Import an existing project"**
4. **Chọn "Deploy with GitHub"**
5. **Chọn repository: `JKhoa/Portfolio-JKhoa`**

## 📋 Bước 2: Cấu hình Deploy Settings

### Build Settings:
- **Build command**: Để trống (không cần build)
- **Publish directory**: `.` (thư mục gốc)
- **Base directory**: Để trống

### Deploy Settings:
- **Branch to deploy**: `main`
- **Auto deploy**: ✅ Bật
- **Deploy previews**: ✅ Bật

## 📋 Bước 3: Thiết lập Custom Domain

1. **Vào Site settings > Domain management**
2. **Thêm custom domain: `jkhoa.site`**
3. **Cập nhật DNS records:**
   ```
   Type: CNAME
   Name: jkhoa.site
   Value: imaginative-daffodil-6a3a60.netlify.app
   ```

## 📋 Bước 4: Kích hoạt SSL Certificate

1. **Vào Site settings > Domain management**
2. **Chọn domain `jkhoa.site`**
3. **Kích hoạt "HTTPS"**
4. **Chọn "Force HTTPS"**

## 📋 Bước 5: Chạy Script Deploy Tự Động

```powershell
# Chạy script để deploy tự động
.\deploy-netlify.ps1
```

## 🔄 Cách Hoạt Động Deploy Tự Động

### ✅ **Tự động khi có thay đổi:**
1. Bạn thay đổi code
2. Chạy script `deploy-netlify.ps1`
3. Script tự động commit và push lên GitHub
4. Netlify nhận webhook từ GitHub
5. Netlify tự động deploy website mới
6. Website hoạt động ngay lập tức

### ✅ **Website hoạt động 24/7:**
- ✅ Không cần máy tính của bạn bật
- ✅ Không cần server riêng
- ✅ CDN toàn cầu cho tốc độ nhanh
- ✅ SSL certificate tự động
- ✅ Backup và recovery tự động

## 📊 Monitoring và Analytics

### Netlify Analytics:
- **Page views**: Theo dõi lượt truy cập
- **Bandwidth**: Theo dõi băng thông sử dụng
- **Build time**: Thời gian deploy
- **Deploy frequency**: Tần suất cập nhật

### Performance:
- **CDN**: Tốc độ tải nhanh toàn cầu
- **Caching**: Cache thông minh
- **Compression**: Nén file tự động
- **Minification**: Tối ưu hóa code

## 🔧 Troubleshooting

### ❌ Deploy thất bại:
- Kiểm tra log build trong Netlify
- Đảm bảo file `index.html` tồn tại
- Kiểm tra cấu hình trong `netlify.toml`

### ❌ Domain không hoạt động:
- Kiểm tra DNS records
- Chờ DNS propagation (24-48 giờ)
- Kiểm tra SSL certificate

### ❌ Website không cập nhật:
- Chạy lại script `deploy-netlify.ps1`
- Kiểm tra GitHub repository
- Kiểm tra Netlify build logs

## 🎯 Lợi ích của Netlify

### ✅ **Tự động hóa:**
- Deploy tự động khi push code
- SSL certificate tự động
- CDN tự động

### ✅ **Hiệu suất:**
- Tốc độ tải nhanh toàn cầu
- Cache thông minh
- Tối ưu hóa tự động

### ✅ **Bảo mật:**
- HTTPS bắt buộc
- DDoS protection
- Security headers

### ✅ **Monitoring:**
- Analytics chi tiết
- Build logs
- Performance metrics

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra Netlify documentation
2. Xem build logs trong Netlify dashboard
3. Liên hệ Netlify support 