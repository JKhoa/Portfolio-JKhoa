# 🚀 Hướng Dẫn Setup YOLO AI Project

## 📋 Checklist Setup

### ✅ Bước 1: Chuẩn Bị Môi Trường
- [ ] Cài đặt Node.js (phiên bản >= 14.0.0)
- [ ] Cài đặt MySQL (phiên bản >= 5.7)
- [ ] Cài đặt Git
- [ ] Trình duyệt hiện đại (Chrome, Firefox, Edge)

### ✅ Bước 2: Clone và Cài Đặt
```bash
# Clone repository
git clone <repository-url>
cd blog/webyolo

# Cài đặt dependencies
npm install
```

### ✅ Bước 3: Thiết Lập Database
```bash
# Đăng nhập MySQL
mysql -u root -p

# Chạy script tạo database
source database_schema.sql

# Hoặc import trực tiếp
mysql -u root -p < database_schema.sql
```

### ✅ Bước 4: Cấu Hình Environment
Tạo file `.env` trong thư mục `blog/webyolo/`:
```env
DB_HOST=localhost
DB_USER=yolo_app
DB_PASSWORD=yolo_password_2024
DB_NAME=yolo_ai_project
PORT=3000
```

### ✅ Bước 5: Chạy Server
```bash
# Development mode (với auto-reload)
npm run dev

# Production mode
npm start
```

### ✅ Bước 6: Kiểm Tra
- [ ] Server chạy thành công tại `http://localhost:3000`
- [ ] Database kết nối thành công
- [ ] Camera hoạt động bình thường
- [ ] Chatbot phản hồi

## 🔧 Troubleshooting

### ❌ Lỗi Database Connection
```bash
# Kiểm tra MySQL đang chạy
sudo service mysql status

# Khởi động MySQL
sudo service mysql start

# Kiểm tra user và database
mysql -u root -p
SHOW DATABASES;
SELECT User FROM mysql.user;
```

### ❌ Lỗi Dependencies
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install

# Hoặc dùng yarn
yarn install
```

### ❌ Lỗi Camera Permission
- Kiểm tra quyền truy cập camera trong browser
- Đảm bảo không có ứng dụng khác đang sử dụng camera
- Thử refresh trang và cho phép lại

### ❌ Lỗi API Key
- Lấy Groq API key miễn phí tại: https://console.groq.com/keys
- Paste key vào Settings ⚙️ trong chatbot
- Lưu cài đặt và thử lại

## 📊 Kiểm Tra Database

### Xem Tables
```sql
USE yolo_ai_project;
SHOW TABLES;
```

### Kiểm tra dữ liệu mẫu
```sql
SELECT COUNT(*) FROM detections;
SELECT COUNT(*) FROM chatbot_conversations;
SELECT COUNT(*) FROM users;
```

### Xem thống kê
```sql
SELECT * FROM dashboard_stats;
```

## 🧪 Test API Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Get Detections
```bash
curl http://localhost:3000/api/detections
```

### Get Stats
```bash
curl http://localhost:3000/api/stats
```

### Test Chatbot
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Xin chào",
    "apiKey": "your-groq-api-key",
    "sessionId": "test-session"
  }'
```

## 🔍 Debug Mode

### Enable Debug Logging
Thêm vào `server.js`:
```javascript
// Enable debug mode
process.env.DEBUG = 'yolo:*';
```

### Console Logs
Kiểm tra console trong browser (F12) để xem:
- Camera access logs
- API request/response logs
- Error messages

### Server Logs
Server sẽ hiển thị:
- Database connection status
- API request logs
- Error details

## 📱 Mobile Testing

### Responsive Design
- Test trên các kích thước màn hình khác nhau
- Kiểm tra touch interactions
- Đảm bảo camera hoạt động trên mobile

### Performance
- Kiểm tra tốc độ load
- Monitor memory usage
- Test với camera resolution khác nhau

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_USER=your-production-user
DB_PASSWORD=your-secure-password
DB_NAME=yolo_ai_project
PORT=3000
```

### Security Checklist
- [ ] Đổi password database mặc định
- [ ] Cấu hình firewall
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Backup database

### Performance Optimization
- [ ] Enable gzip compression
- [ ] Set up CDN
- [ ] Optimize images
- [ ] Enable caching

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong console
2. Xem troubleshooting section
3. Liên hệ: nhakhoa1004@gmail.com

---

**Chúc bạn setup thành công! 🎉**
