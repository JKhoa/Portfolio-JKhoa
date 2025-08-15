# YOLO Project Integration Guide

## 📋 Tổng quan

Dự án YOLO về "Nhận diện sinh viên ngủ gật" đã được tích hợp vào Portfolio chính và có thể truy cập qua:
- **URL trực tiếp:** `https://jkhoa.dev/blog/webyolo`
- **Từ Portfolio:** Nhấn vào dự án "Website giới thiệu về Yolo" trong section Projects

## 📁 Cấu trúc thư mục

```
Portfolio-JKhoa/
├── blog/
│   └── webyolo/
│       ├── index.html          # Trang chính YOLO project  
│       ├── css/
│       │   └── style.css       # Styles cho YOLO project
│       └── js/
│           └── script.js       # JavaScript cho YOLO project
├── sync-yolo-project.ps1       # Script đồng bộ files
└── index.html                  # Portfolio chính
```

## 🔄 Cách đồng bộ files từ DoAnCuoiKi

### Phương pháp 1: Sử dụng PowerShell Script (Khuyến nghị)

1. Mở PowerShell với quyền Administrator
2. Chuyển đến thư mục Portfolio:
   ```powershell
   cd "d:\Study\Web_Nang_Cao\Portfolio-JKhoa"
   ```
3. Chạy script đồng bộ:
   ```powershell
   .\sync-yolo-project.ps1
   ```
4. Chọn option phù hợp:
   - **Option 1:** Đồng bộ files cơ bản
   - **Option 2:** Tạo backup trước khi đồng bộ
   - **Option 3:** Kiểm tra tính toàn vẹn files
   - **Option 4:** Đồng bộ đầy đủ (backup + sync + validate)

### Phương pháp 2: Copy thủ công

1. Copy files từ `DoAnCuoiKi/` sang `Portfolio-JKhoa/blog/webyolo/`
2. Sửa các đường dẫn trong HTML:
   - Thêm link "← Về Portfolio" vào navigation
   - Cập nhật thông tin liên hệ cá nhân
3. Cập nhật JavaScript với các response chatbot mới

## 🌐 Triển khai lên hosting

### Đối với Hostinger (jkhoa.dev)

1. Upload toàn bộ thư mục `Portfolio-JKhoa` lên public_html
2. Cấu trúc trên server sẽ là:
   ```
   public_html/
   ├── blog/
   │   └── webyolo/
   │       ├── index.html
   │       ├── css/style.css
   │       └── js/script.js
   └── index.html (portfolio chính)
   ```
3. Website YOLO sẽ accessible tại: `https://jkhoa.dev/blog/webyolo`

### Đối với Netlify/Vercel

1. Deploy toàn bộ thư mục `Portfolio-JKhoa`
2. Cấu hình rewrites nếu cần thiết
3. Đảm bảo đường dẫn tương đối hoạt động đúng

## ✅ Những gì đã được cập nhật

### Portfolio chính (index.html)
- ✅ Thêm project card "Website giới thiệu về Yolo"
- ✅ Link trỏ đến `https://jkhoa.dev/blog/webyolo`
- ✅ Loại bỏ thanh tiến trình trong phần Skills
- ✅ Thiết kế responsive và animation mượt mà

### YOLO Project (blog/webyolo/)
- ✅ Copy toàn bộ code từ DoAnCuoiKi
- ✅ Thêm navigation link về Portfolio chính
- ✅ Cập nhật thông tin liên hệ cá nhân
- ✅ Enhanced chatbot với responses về tác giả
- ✅ Tối ưu hóa cho production

## 🛠️ Tính năng đặc biệt

### Chatbot AI Assistant
- Trả lời questions về YOLO, machine learning
- Thông tin về tác giả và portfolio
- Interactive và user-friendly

### Responsive Design
- Mobile-first approach
- Smooth animations và transitions
- Modern UI/UX với dark theme

### Performance Optimized
- Fast loading với optimized assets
- Smooth scrolling và navigation
- Progressive enhancement

## 🔧 Troubleshooting

### Lỗi thường gặp:

1. **404 Not Found khi truy cập /blog/webyolo**
   - Kiểm tra cấu trúc thư mục trên server
   - Đảm bảo có file index.html trong thư mục webyolo

2. **CSS/JS không load**
   - Kiểm tra đường dẫn relative paths
   - Verify file permissions trên server

3. **Navigation link không hoạt động**
   - Kiểm tra đường dẫn "../../index.html"
   - Đảm bảo portfolio chính có đúng path

### Debug commands:
```powershell
# Test file existence
Test-Path "d:\Study\Web_Nang_Cao\Portfolio-JKhoa\blog\webyolo\index.html"

# Validate HTML structure
Get-Content "d:\Study\Web_Nang_Cao\Portfolio-JKhoa\blog\webyolo\index.html" | Select-String "Portfolio"

# Check file sizes
Get-ChildItem "d:\Study\Web_Nang_Cao\Portfolio-JKhoa\blog\webyolo" -Recurse | Measure-Object -Property Length -Sum
```

## 📞 Hỗ trợ

Nếu gặp vấn đề trong quá trình setup hoặc deployment:
- Email: nhakhoa1004@gmail.com  
- Phone: 0395123864
- GitHub: https://github.com/JKhoa

---

**Tác giả:** Nguyễn Hoàng Anh Khoa  
**Ngày cập nhật:** August 14, 2025  
**Version:** 1.0.0
