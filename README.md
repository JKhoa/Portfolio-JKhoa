# Nguyễn Hoàng Anh Khoa - Portfolio Website

Website portfolio chuyên nghiệp được xây dựng với HTML5, CSS3, JavaScript và các thư viện animation hiện đại.

## 🚀 Triển khai lên GitHub Pages

### Bước 1: Push code lên GitHub
```bash
# Thêm tất cả file vào git
git add .

# Commit thay đổi
git commit -m "Update portfolio website for Nguyễn Hoàng Anh Khoa"

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
File `CNAME` đã được cấu hình với `jkhoa.dev`. Đảm bảo file này tồn tại trong thư mục gốc.

## 👤 Thông tin cá nhân

- **Tên đầy đủ:** Nguyễn Hoàng Anh Khoa
- **Nghề nghiệp:** Sinh viên năm cuối ngành Công nghệ thông tin
- **Trường:** Đại học Đà Lạt
- **Email:** nhakhoa1004@gmail.com
- **GitHub:** https://github.com/jkhoa
- **Facebook:** https://www.facebook.com/nguyen.khoa.319536

## 🎨 Tính năng website

### ✨ **Animation & UX**
- **AOS (Animate On Scroll):** Animation mượt mà khi cuộn
- **GSAP-like effects:** Hiệu ứng chuyển động chuyên nghiệp
- **Responsive Design:** Tối ưu cho mọi thiết bị
- **Modern UI/UX:** Thiết kế hiện đại với gradient và shadow

### 📱 **Responsive Navigation**
- **Mobile-friendly:** Menu hamburger cho mobile
- **Smooth scrolling:** Cuộn mượt đến các section
- **Active state:** Highlight menu item hiện tại

### 🎯 **Sections chính**
1. **Home:** Ảnh đại diện, thông tin cá nhân, stats
2. **About:** Tiểu sử và thành tích học tập
3. **Skills:** Kỹ năng lập trình với progress bars
4. **Projects:** Portfolio dự án với hover effects
5. **Contact:** Form liên hệ tích hợp EmailJS

### 📧 **Form liên hệ**
- **EmailJS integration:** Gửi email trực tiếp
- **Validation:** Kiểm tra dữ liệu đầu vào
- **Loading states:** Hiển thị trạng thái gửi
- **Success/Error notifications:** Thông báo kết quả

## 🛠️ Công nghệ sử dụng

### **Frontend**
- **HTML5:** Semantic markup
- **CSS3:** Flexbox, Grid, Animations
- **JavaScript (ES6+):** Modern JavaScript features
- **Font Awesome:** Icons
- **Google Fonts:** Poppins font family

### **Libraries**
- **AOS:** Animate On Scroll library
- **EmailJS:** Email service integration
- **Intersection Observer API:** Performance optimization

### **Hosting**
- **GitHub Pages:** Static site hosting
- **Custom Domain:** jkhoa.dev

## 📁 Cấu trúc thư mục

```
LowLife-Website/
├── index.html              # Trang chủ (chính)
├── styles.css              # CSS tùy chỉnh
├── script.js               # JavaScript functionality
├── CNAME                   # Cấu hình tên miền
├── deploy.ps1             # Script triển khai
├── README.md              # Hướng dẫn này
├── UPDATE_GUIDE.md        # Hướng dẫn cập nhật
└── html5up-miniport/      # Thư mục assets gốc
    ├── assets/
    │   ├── css/main.css   # CSS gốc (backup)
    │   └── js/            # JavaScript gốc
    └── images/            # Hình ảnh
```

## 🎨 Customization

### **Thay đổi thông tin cá nhân**
Chỉnh sửa trong `index.html`:
- Tên và thông tin cá nhân (dòng 25-35)
- Skills và percentages (dòng 80-150)
- Projects và descriptions (dòng 160-220)
- Contact information (dòng 240-260)

### **Thay đổi màu sắc**
Chỉnh sửa CSS variables trong `styles.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    /* Thêm màu mới tại đây */
}
```

### **Thêm dự án mới**
1. Copy project card structure trong HTML
2. Thay đổi hình ảnh, tên, mô tả
3. Cập nhật tech stack tags
4. Thêm link GitHub

## 📧 EmailJS Setup

### **Bước 1: Tạo tài khoản EmailJS**
1. Đăng ký tại https://www.emailjs.com/
2. Tạo Email Service (Gmail, Outlook, etc.)
3. Tạo Email Template

### **Bước 2: Cập nhật JavaScript**
Trong `script.js`, thay thế:
```javascript
emailjs.init("YOUR_EMAILJS_USER_ID");
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {...})
```

## 🚀 Triển khai nhanh

```powershell
# Chạy script tự động
.\deploy.ps1
```

## 📱 Responsive Breakpoints

- **Desktop:** > 1024px
- **Tablet:** 768px - 1024px
- **Mobile:** < 768px

## 🎯 Performance Tips

- **Image optimization:** Nén hình ảnh trước khi upload
- **Lazy loading:** Đã tích hợp cho images
- **Minification:** Có thể minify CSS/JS cho production
- **CDN:** Sử dụng CDN cho libraries

## 🔧 Troubleshooting

### **EmailJS không hoạt động**
1. Kiểm tra User ID, Service ID, Template ID
2. Đảm bảo template có đúng variables
3. Kiểm tra console cho errors

### **Animation không chạy**
1. Kiểm tra AOS library đã load
2. Đảm bảo elements có `data-aos` attributes
3. Kiểm tra CSS không bị conflict

### **Mobile menu không hoạt động**
1. Kiểm tra JavaScript console
2. Đảm bảo hamburger button có đúng class
3. Kiểm tra CSS cho mobile styles

## 🔗 Liên kết

- **Website:** https://jkhoa.dev
- **GitHub Repository:** [Link đến repo của bạn]
- **EmailJS:** https://www.emailjs.com/

## 📞 Hỗ trợ

Nếu có vấn đề gì, hãy liên hệ:
- **Email:** nhakhoa1004@gmail.com
- **GitHub:** https://github.com/jkhoa

---

© 2024 Nguyễn Hoàng Anh Khoa. All rights reserved. 