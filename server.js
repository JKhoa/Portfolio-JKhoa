const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Cấu hình transporter cho Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nhakhoa1004@gmail.com', // Gmail của bạn
    pass: '1104' // App password, không phải mật khẩu Gmail thông thường
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'nhakhoa1004@gmail.com',
    subject: `Liên hệ từ ${name}`,
    text: `Tên: ${name}\nEmail: ${email}\nSố điện thoại: ${phone}\nNội dung: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Gửi email thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gửi email thất bại!', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});