# ⚠️ CẢNH BÁO BẢO MẬT - API KEY

## ❌ KHÔNG BAO GIỜ làm:
- Hardcode API key trực tiếp vào source code
- Commit API key lên Git/GitHub  
- Share API key công khai

## ✅ Cách ĐÚNG để sử dụng API:

### 1. Sử dụng localStorage (Client-side):
1. Mở website → Chatbot → Settings ⚙️
2. Nhập API key vào form
3. API key được lưu trong browser localStorage (an toàn)

### 2. Setup API key:
1. Truy cập: https://console.groq.com/
2. Tạo tài khoản miễn phí
3. Generate API key
4. Copy và paste vào chatbot settings

### 3. Chatbot sẽ:
- ✅ Tự động sử dụng API key từ localStorage  
- ✅ Gọi Groq AI trực tiếp
- ✅ Fallback về AI mô phỏng nếu không có key

## 🛡️ Tính năng bảo mật:
- API key không bao giờ xuất hiện trong source code
- Lưu trữ local trong browser
- Không upload lên server
- GitHub push protection sẽ chặn nếu có API key trong code

## 🚀 Đã sửa lỗi GitHub push:
- Đã xóa hardcoded API key
- Đã cấu hình về localStorage
- Có thể push an toàn bây giờ

## 📝 Lưu ý:
- API key Groq miễn phí có limit requests
- Chatbot hoạt động offline với AI mô phỏng
- Chỉ cần API key để có trải nghiệm AI thực
