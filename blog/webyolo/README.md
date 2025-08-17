# YOLO AI Chatbot - Dynamic AI Assistant

## 🚀 Tính năng

- **AI Chatbot thực sự** với khả năng trò chuyện tự nhiên
- **Hỗ trợ đa dạng AI APIs**: Groq (miễn phí), Hugging Face, Local AI
- **Giao diện hiện đại** với hiệu ứng typing animation
- **Responsive design** tương thích mọi thiết bị
- **Cài đặt linh hoạt** để tùy chỉnh AI backend

## 🛠️ Cài đặt và Chạy

### Phương pháp 1: Chạy trực tiếp (AI mô phỏng)
```bash
# Mở trực tiếp file index.html trong trình duyệt
# Chatbot sẽ sử dụng AI mô phỏng với context understanding
```

### Phương pháp 2: Chạy với Server (AI thực)
```bash
# Cài đặt dependencies
npm install

# Chạy server
npm start

# Mở http://localhost:3000 trong trình duyệt
```

## 🔧 Cấu hình AI

### 1. Groq AI (Miễn phí - Khuyến nghị)
1. Đăng ký tài khoản tại [console.groq.com](https://console.groq.com)
2. Tạo API key miễn phí
3. Click vào icon ⚙️ trong chatbot
4. Nhập API key và lưu

### 2. OpenAI (Có phí)
- Có thể tích hợp thêm bằng cách cập nhật code

## 💬 Sử dụng Chatbot

### Các tính năng chính:
- **Trò chuyện tự nhiên** về YOLO và Machine Learning
- **Context understanding** - hiểu ngữ cảnh cuộc trò chuyện
- **Typing animation** - hiệu ứng gõ phím như con người
- **Responsive** - hoạt động mượt mà trên mobile

### Ví dụ câu hỏi:
- "YOLO hoạt động như thế nào?"
- "Kết quả huấn luyện mô hình ra sao?"
- "Làm sao để cải thiện độ chính xác?"
- "Giải thích về CNN và Deep Learning"

## 🎨 Giao diện

- **Modern Design**: Gradient colors, animations, glassmorphism
- **Font chữ**: Open Sans (clean và dễ đọc)
- **Responsive**: Tương thích mobile, tablet, desktop
- **Dark theme**: Dễ nhìn, chuyên nghiệp

## 📁 Cấu trúc File

```
blog/webyolo/
├── index.html          # Trang chính
├── css/style.css       # Styling chính
├── js/script.js        # JavaScript logic
├── server.js           # Express server (optional)
├── package.json        # Dependencies
└── README.md          # Hướng dẫn này
```

## 🔒 Bảo mật

- **API keys được lưu trữ local** (localStorage) - KHÔNG BAO GIỜ commit vào Git
- **Server proxy** để tránh CORS issues
- **Không log sensitive data**
- **Environment variables** cho server configuration
- **.gitignore** bảo vệ khỏi commit nhầm API keys

### ⚠️ LƯU Ý QUAN TRỌNG:
- **KHÔNG BAO GIỜ** commit API keys vào Git
- Sử dụng `.env.example` làm template
- API keys chỉ nên lưu trong localStorage của browser

## 🐛 Xử lý lỗi

- **Fallback system**: Nếu AI API thất bại, tự động chuyển sang AI local
- **Error handling**: Thông báo lỗi thân thiện cho user
- **Retry mechanism**: Tự động thử lại với các API khác nhau

## 🚀 Tính năng nâng cao

- **Conversation history**: Nhớ ngữ cảnh cuộc trò chuyện
- **Intelligent responses**: AI hiểu context và đưa ra câu trả lời phù hợp
- **Multiple AI backends**: Hỗ trợ nhiều loại AI khác nhau
- **Real-time typing**: Hiệu ứng gõ phím thời gian thực

## 📞 Liên hệ

- **Email**: nhakhoa1004@gmail.com
- **Phone**: 0395123864
- **GitHub**: Portfolio-JKhoa

---

## 🎯 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **AI**: Groq API, Hugging Face
- **Design**: Modern gradient design, animations
- **Font**: Open Sans

Enjoy chatting with your AI assistant! 🤖✨
