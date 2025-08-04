# JKhoa Website - jkhoa.site

Website portfolio và blog cá nhân được xây dựng với HTML5, CSS3 và JavaScript.

## 🚀 Triển khai lên GitHub Pages

### Bước 1: Push code lên GitHub
```bash
# Thêm tất cả file vào git
git add .

# Commit thay đổi
git commit -m "Update website content for jkhoa.site"

# Push lên GitHub
git push origin main
```

### Bước 2: Cấu hình GitHub Pages
1. Vào repository trên GitHub
2. Vào Settings > Pages
3. Chọn Source: "Deploy from a branch"
4. Chọn Branch: "main"
5. Chọn Folder: "/ (root)"
6. Click "Save"

### Bước 3: Kiểm tra CNAME
File `CNAME` đã được cấu hình với `jkhoa.site`. Đảm bảo file này tồn tại trong thư mục gốc.

## 📝 Cách cập nhật nội dung

### 1. Thay đổi thông tin cá nhân
- Mở file `html5up-miniport/index.html`
- Tìm và thay đổi các thông tin:
  - Tên và mô tả trong phần "Home"
  - Dịch vụ trong phần "Work"
  - Dự án trong phần "Portfolio"
  - Thông tin liên hệ trong phần "Contact"

### 2. Thay đổi hình ảnh
- Thay thế các file trong thư mục `images/`
- Cập nhật đường dẫn trong HTML nếu cần

### 3. Thay đổi màu sắc và style
- Chỉnh sửa file `assets/css/main.css`
- Hoặc tạo file CSS mới và link vào HTML

### 4. Thêm trang mới
- Tạo file HTML mới
- Link từ navigation menu
- Cập nhật các link internal

## 🎨 Cấu trúc thư mục

```
LowLife-Website/
├── CNAME                    # Cấu hình tên miền
├── README.md               # Hướng dẫn này
├── html5up-miniport/       # Thư mục chính của website
│   ├── index.html          # Trang chủ
│   ├── assets/             # CSS, JS, fonts
│   │   ├── css/
│   │   ├── js/
│   │   └── webfonts/
│   └── images/             # Hình ảnh
└── .git/                   # Git repository
```

## 🔧 Công nghệ sử dụng

- **HTML5**: Cấu trúc website
- **CSS3**: Styling và responsive design
- **JavaScript**: Tương tác và animation
- **Font Awesome**: Icons
- **GitHub Pages**: Hosting

## 📱 Responsive Design

Website được thiết kế responsive và hoạt động tốt trên:
- Desktop
- Tablet
- Mobile

## 🚀 Triển khai nhanh

Sau khi cập nhật nội dung:

```bash
git add .
git commit -m "Update website content"
git push origin main
```

GitHub Pages sẽ tự động build và deploy website trong vài phút.

## 🔗 Liên kết

- **Website**: https://jkhoa.site
- **GitHub Repository**: [Link đến repo của bạn]

## 📞 Hỗ trợ

Nếu có vấn đề gì, hãy liên hệ qua:
- Email: [email của bạn]
- GitHub: [username GitHub của bạn]

---

© 2024 JKhoa. All rights reserved. 