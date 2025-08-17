# 🧠 Tính Năng Bộ Nhớ AI Chatbot

## 🚀 Tính năng mới đã được thêm:

### 1. **Bộ nhớ thông minh**
- ✅ Ghi nhớ tên người dùng 
- ✅ Lưu trữ sở thích và quan tâm
- ✅ Phân tích thói quen trò chuyện
- ✅ Nhớ nghề nghiệp và thông tin cá nhân
- ✅ Lưu 20 cuộc trò chuyện gần nhất

### 2. **Trả lời bằng tiếng Việt**
- ✅ **LUÔN LUÔN** trả lời bằng tiếng Việt 
- ✅ Chỉ trả lời tiếng Anh khi được yêu cầu rõ ràng: "answer in English" hoặc "trả lời bằng tiếng Anh"
- ✅ Nếu user hỏi bằng tiếng Anh nhưng không yêu cầu, vẫn trả lời bằng tiếng Việt

### 3. **Cá nhân hóa thông minh**
- ✅ Gọi tên người dùng trong câu trả lời
- ✅ Nhắc đến sở thích đã biết
- ✅ Điều chỉnh phong cách trả lời theo profile
- ✅ Nhớ context từ cuộc trò chuyện trước

## 🎯 Cách sử dụng:

### **Thiết lập tên:**
```
User: "Tôi là Khoa"
AI: "Xin chào Khoa! Tôi sẽ nhớ tên bạn..."
```

### **AI học sở thích:**
```
User: "Tôi thích machine learning"
AI: "Rất tuyệt! Tôi đã ghi nhớ bạn quan tâm đến machine learning..."
```

### **Trả lời cá nhân hóa:**
```
User: "YOLO là gì?"
AI: "Khoa ơi, YOLO là thuật toán mà bạn quan tâm đến machine learning chắc sẽ thích..."
```

### **Quản lý bộ nhớ:**
- Mở Settings ⚙️ 
- Xem số cuộc trò chuyện và sở thích đã lưu
- Nhập tên để AI gọi bạn
- Xóa bộ nhớ nếu muốn bắt đầu lại

## 🔍 Phân tích tự động:

### **Tên người dùng:**
- "Tôi là [tên]"
- "Tên tôi là [tên]" 
- "Mình là [tên]"

### **Sở thích:**
- Từ khóa: thích, yêu thích, quan tâm, đam mê
- Technical: AI, ML, computer vision, YOLO, programming

### **Nghề nghiệp:**
- sinh viên, học sinh, developer, lập trình viên
- researcher, nghiên cứu, giáo viên

### **Ngôn ngữ:**
- Mặc định: Tiếng Việt
- Chỉ chuyển sang English khi có yêu cầu rõ ràng

## 📊 Thống kê bộ nhớ:

```javascript
{
  name: "Khoa",
  interests: ["machine learning", "YOLO", "computer vision"],
  profession: "sinh viên", 
  conversation_patterns: {
    frequent_questions: [...],
    favorite_topics: [...],
    last_interaction: "2025-08-17T..."
  }
}
```

## 🛡️ Bảo mật:

- ✅ Tất cả dữ liệu lưu trong localStorage
- ✅ Không upload lên server
- ✅ Có thể xóa bộ nhớ bất cứ lúc nào
- ✅ API key vẫn được bảo vệ

## 🎨 Giao diện mới:

- **Settings mở rộng:** Thêm quản lý tên và bộ nhớ
- **Memory stats:** Hiển thị số cuộc trò chuyện và sở thích
- **Clear button:** Xóa bộ nhớ với xác nhận
- **Smart welcome:** Chào mừng cá nhân hóa khi load

## ✨ Kết quả:

Chatbot giờ đây:
- 🗣️ **Luôn trả lời tiếng Việt** trừ khi được yêu cầu khác
- 🧠 **Nhớ thông tin cá nhân** và cá nhân hóa câu trả lời  
- 💭 **Học thói quen** và điều chỉnh phong cách
- 🔄 **Nhớ context** từ cuộc trò chuyện trước
- 👋 **Chào mừng thân thiện** với tên và sở thích
