# 📝 Hướng dẫn cập nhật nội dung website

## 🚀 Triển khai nhanh

```powershell
# Chạy script tự động
.\deploy.ps1
```

## 📋 Các phần cần cập nhật

### 1. Thông tin cá nhân (Dòng 25-30)
```html
<h1>Xin chào! Tôi là <strong>JKhoa</strong>.</h1>
<p>Chào mừng bạn đến với <strong>jkhoa.site</strong>, nơi tôi chia sẻ kiến thức về lập trình, công nghệ và các dự án cá nhân. Tôi là một developer đam mê với công nghệ web và luôn tìm hiểu những điều mới mẻ.</p>
```

### 2. Dịch vụ (Dòng 45-75)
Thay đổi 3 box dịch vụ:
- **Web Development**: Dòng 50-54
- **Mobile Apps**: Dòng 60-64  
- **Backend Development**: Dòng 70-74

### 3. Dự án Portfolio (Dòng 85-140)
Thay đổi 6 dự án:
- Website Thương mại điện tử (Dòng 90-94)
- Ứng dụng Di động (Dòng 100-104)
- Nền tảng Blog (Dòng 110-114)
- Dashboard Analytics (Dòng 120-124)
- API Service (Dòng 130-134)
- Nền tảng Học tập (Dòng 140-144)

### 4. Thông tin liên hệ (Dòng 150-180)
- Tiêu đề form (Dòng 152)
- Mô tả (Dòng 153)
- Social media links (Dòng 175-180)

### 5. Hình ảnh
Thay thế các file trong `html5up-miniport/images/`:
- `pic00.jpg` - Ảnh đại diện
- `pic01.jpg` đến `pic06.jpg` - Ảnh dự án

## 🎨 Tùy chỉnh style

### Thay đổi màu sắc
Chỉnh sửa file `html5up-miniport/assets/css/main.css`:
```css
/* Màu chủ đạo */
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
}
```

### Thay đổi font
```css
body {
    font-family: 'Your Font', sans-serif;
}
```

## 📱 Thêm trang mới

1. Tạo file HTML mới trong thư mục gốc
2. Thêm link vào navigation menu
3. Cập nhật các internal links

## 🔧 Cấu trúc file quan trọng

```
LowLife-Website/
├── index.html              # Trang chủ (chính)
├── CNAME                   # Cấu hình tên miền
├── deploy.ps1             # Script triển khai
├── README.md              # Hướng dẫn chi tiết
├── UPDATE_GUIDE.md        # Hướng dẫn này
└── html5up-miniport/      # Thư mục assets
    ├── assets/
    │   ├── css/main.css   # Style chính
    │   └── js/            # JavaScript
    └── images/            # Hình ảnh
```

## ⚡ Lệnh nhanh

```bash
# Commit và push
git add .
git commit -m "Update content"
git push origin main

# Hoặc dùng script
.\deploy.ps1
```

## 🎯 Tips

- Luôn backup trước khi thay đổi lớn
- Test trên local trước khi deploy
- Kiểm tra responsive trên mobile
- Tối ưu hình ảnh để load nhanh hơn
- Cập nhật meta tags cho SEO

---

**Lưu ý**: Sau khi thay đổi, chạy `.\deploy.ps1` để triển khai ngay lập tức! 