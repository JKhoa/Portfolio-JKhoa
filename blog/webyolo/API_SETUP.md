# Hướng dẫn cấu hình API Key trực tiếp trong code

## Cách 1: Hardcode API Key (Khuyến nghị cho development)

1. **Lấy Groq API Key:**
   - Truy cập: https://console.groq.com/
   - Đăng ký/Đăng nhập
   - Tạo API key mới
   - Copy API key

2. **Thêm vào code:**
   - Mở file `js/script.js`
   - Tìm dòng: `const GROQ_API_KEY = 'YOUR_API_KEY_HERE';`
   - Thay thế `YOUR_API_KEY_HERE` bằng API key thực của bạn
   - Ví dụ: `const GROQ_API_KEY = 'gsk_abc123xyz789...';`

3. **Kiểm tra cấu hình:**
   - `USE_HARDCODED_API = true` (để sử dụng API hardcoded)
   - `USE_HARDCODED_API = false` (để sử dụng settings modal)

## Cách 2: Sử dụng Settings Modal

- Đặt `USE_HARDCODED_API = false`
- Mở chatbot → Click ⚙️ Settings
- Nhập API key vào form
- Click "Lưu Settings"

## Tính năng mới:

✅ **API trực tiếp:** Gọi Groq API trực tiếp từ frontend
✅ **Không cần server:** Không cần Node.js server nữa  
✅ **Auto-detect:** Tự động phát hiện API key hardcoded
✅ **Fallback:** Tự động chuyển về AI mô phỏng nếu API fail
✅ **Status indicator:** Hiển thị trạng thái AI trong settings
✅ **Welcome message:** Thông báo trạng thái khi mở chatbot

## Bảo mật:

⚠️ **Lưu ý:** Hardcode API key chỉ nên dùng cho development
📝 **Production:** Nên sử dụng environment variables hoặc server proxy
🔒 **Git:** Đảm bảo không commit API key lên GitHub

## Test:

1. Mở website
2. Click chatbot
3. Nên thấy message chào mừng với trạng thái API
4. Gửi tin nhắn test
5. Nếu có API key → AI thực sẽ trả lời
6. Nếu không có → AI mô phỏng sẽ trả lời
