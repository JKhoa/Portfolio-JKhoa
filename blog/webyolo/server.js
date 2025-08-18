const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for Groq (proxy to avoid CORS)
app.post('/api/chat', async(req, res) => {
    try {
        const { message, apiKey, conversationHistory } = req.body;

        if (!apiKey) {
            return res.status(400).json({ error: 'API key required' });
        }

        const fetch = (await
            import ('node-fetch')).default;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [{
                        role: 'system',
                        content: `Bạn là một AI assistant chuyên về dự án YOLO nhận diện sinh viên ngủ gật. 
                        Thông tin về dự án:
                        - Tên: YOLO AI - Nhận Diện Sinh Viên Ngủ Gật
                        - Tác giả: Nguyễn Hoàng Anh Khoa
                        - Email: nhakhoa1004@gmail.com
                        - Phone: 0395123864
                        - Kết quả: mAP 94.2%, Precision 96.8%, Recall 92.1%, Tốc độ 25 FPS
                        - Các phiên bản YOLO: v1(2016), v3(2018), v5(2020), v8(2023)
                        - Quy trình: Thu thập dữ liệu → Gán nhãn → Tiền xử lý → Huấn luyện → Đánh giá
                        
                        Hãy trả lời một cách thân thiện và chuyên nghiệp bằng tiếng Việt.`
                    },
                    ...conversationHistory.slice(-6),
                    { role: 'user', content: message }
                ],
                max_tokens: 256,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            res.json({ response: data.choices[0].message.content });
        } else {
            res.status(500).json({ error: 'Invalid response from Groq API' });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 YOLO AI Chatbot Server running at http://localhost:${PORT}`);
    console.log(`📱 Open your browser and navigate to http://localhost:${PORT}`);
});