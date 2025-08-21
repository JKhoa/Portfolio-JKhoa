# Hướng Dẫn Sửa Lỗi Font và Encoding Chatbot

## Vấn Đề Đã Gặp Phải

Chatbot AI assistant gặp các lỗi sau:
1. **Lỗi font**: Hiển thị ký tự lạ thay vì tiếng Việt
2. **Lỗi encoding**: Dịch thuật không hoàn chỉnh, có ký tự bị vỡ
3. **Lỗi Unicode**: Một số ký tự tiếng Việt không hiển thị đúng

## Các Thay Đổi Đã Thực Hiện

### 1. Cải Thiện Xử Lý Tin Nhắn (script_enhanced.js)

#### Thay đổi hàm `addMessage()`:
- Sử dụng `innerHTML` thay vì `textContent` để hỗ trợ Unicode tốt hơn
- Thêm hàm `sanitizeMessage()` để làm sạch và format tin nhắn
- Wrap tin nhắn trong `<span>` với font-family cụ thể

#### Thêm hàm `sanitizeMessage()`:
```javascript
sanitizeMessage(content) {
    // Loại bỏ control characters
    // Chỉ giữ lại các ký tự Unicode hợp lệ
    // Wrap trong span với font-family
}
```

### 2. Cải Thiện API Groq (script_enhanced.js)

#### Thay đổi hàm `getGroqResponse()`:
- Thêm `charset=utf-8` vào Content-Type header
- Cải thiện system prompt với hướng dẫn cụ thể về tiếng Việt
- Giảm `max_tokens` từ 500 xuống 300 để tránh lỗi
- Thêm các tham số `top_p`, `frequency_penalty`, `presence_penalty`

#### Thêm hàm `fixEncoding()`:
```javascript
fixEncoding(text) {
    // Sửa các ký tự tiếng Việt bị lỗi
    // Loại bỏ ký tự không hợp lệ
    // Đảm bảo encoding UTF-8
}
```

### 3. Cải Thiện Simple Response (script_enhanced.js)

#### Thêm responses cho các từ khóa mới:
- `nước hoa`, `perfume`: Trả lời về chủ đề không liên quan
- `mua`: Hướng dẫn về chủ đề AI
- `dịch`, `translate`: Giải thích về chuyên môn

#### Áp dụng `fixEncoding()` cho tất cả responses

### 4. Cải Thiện CSS (style.css)

#### Thêm font properties cho `.message` và `.message-content`:
```css
font-family: 'Open Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
text-rendering: optimizeLegibility;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### 5. Cải Thiện HTML (index.html)

#### Thêm meta tags:
- `<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">`
- `<meta name="language" content="vi">`
- `<meta name="content-language" content="vi">`

#### Thêm font Inter:
- `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">`

### 6. Thêm Font Fix Function (script_enhanced.js)

#### Hàm `fixChatbotFontIssues()`:
- Kiểm tra font loading
- Thêm CSS động để đảm bảo font hiển thị đúng
- Sử dụng `!important` để override các style khác

## Kết Quả Mong Đợi

Sau khi áp dụng các thay đổi:

1. ✅ **Font hiển thị đúng**: Tiếng Việt hiển thị rõ ràng, không có ký tự lạ
2. ✅ **Encoding UTF-8**: Tất cả ký tự Unicode được hỗ trợ
3. ✅ **Dịch thuật hoàn chỉnh**: API Groq trả lời bằng tiếng Việt đầy đủ
4. ✅ **Fallback tốt**: Khi không có API key, simple responses vẫn hoạt động tốt
5. ✅ **Responsive**: Font hiển thị đúng trên mọi thiết bị

## Cách Test

1. **Test Simple Responses**:
   - Gõ "yolo", "ngủ gật", "ai" → Kiểm tra font và encoding
   - Gõ "nước hoa", "mua" → Kiểm tra response redirect

2. **Test Groq API** (nếu có API key):
   - Gõ câu hỏi phức tạp → Kiểm tra dịch thuật hoàn chỉnh
   - Gõ tiếng Anh → Kiểm tra response tiếng Việt

3. **Test Font Rendering**:
   - Kiểm tra các ký tự đặc biệt: ă, â, ê, ô, ơ, ư, đ
   - Kiểm tra dấu thanh: á, à, ả, ã, ạ

## Lưu Ý

- Đảm bảo server hỗ trợ UTF-8 encoding
- Nếu vẫn có lỗi, kiểm tra browser console để debug
- Có thể cần clear browser cache sau khi thay đổi
