const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'yolo_app',
    password: process.env.DB_PASSWORD || 'yolo_password_2024',
    database: process.env.DB_NAME || 'yolo_ai_project',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('.'));

// Test database connection
async function testDatabaseConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('💡 Make sure MySQL is running and database exists');
    }
}

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for detections
app.get('/api/detections', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, timestamp, detection_status, confidence, fps, session_id, notes FROM detections ORDER BY timestamp DESC LIMIT 100'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching detections:', error);
        res.status(500).json({ error: 'Failed to fetch detections' });
    }
});

app.post('/api/detections', async (req, res) => {
    try {
        const { imageData, detectionStatus, confidence, fps, sessionId, notes } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO detections (image_data, detection_status, confidence, fps, session_id, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [imageData, detectionStatus || 'awake', confidence || 0, fps || 0, sessionId || 'unknown', notes || '']
        );
        
        res.json({ 
            success: true, 
            id: result.insertId,
            message: 'Detection saved successfully' 
        });
    } catch (error) {
        console.error('Error saving detection:', error);
        res.status(500).json({ error: 'Failed to save detection' });
    }
});

app.delete('/api/detections', async (req, res) => {
    try {
        await pool.execute('DELETE FROM detections');
        res.json({ success: true, message: 'All detections cleared' });
    } catch (error) {
        console.error('Error clearing detections:', error);
        res.status(500).json({ error: 'Failed to clear detections' });
    }
});

// API endpoint for chatbot conversations
app.post('/api/chat', async (req, res) => {
    try {
        const { message, apiKey, conversationHistory, sessionId } = req.body;

        if (!apiKey) {
            return res.status(400).json({ error: 'API key required' });
        }

        const fetch = (await import('node-fetch')).default;

        // Create system prompt
        const systemPrompt = `Bạn là một AI assistant chuyên về dự án YOLO nhận diện sinh viên ngủ gật. 
        Thông tin về dự án:
        - Tên: YOLO AI - Nhận Diện Sinh Viên Ngủ Gật
        - Tác giả: Nguyễn Hoàng Anh Khoa
        - Email: nhakhoa1004@gmail.com
        - Phone: 0395123864
        - Kết quả: mAP 94.2%, Precision 96.8%, Recall 92.1%, Tốc độ 25 FPS
        - Các phiên bản YOLO: v1(2016), v3(2018), v5(2020), v8(2023)
        - Quy trình: Thu thập dữ liệu → Gán nhãn → Tiền xử lý → Huấn luyện → Đánh giá
        
        Hãy trả lời một cách thân thiện và chuyên nghiệp bằng tiếng Việt.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-6),
            { role: 'user', content: message }
        ];

        const startTime = Date.now();
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: messages,
                max_tokens: 512,
                temperature: 0.7
            })
        });

        const responseTime = Date.now() - startTime;

        if (response.ok) {
            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                const botResponse = data.choices[0].message.content;
                
                // Save conversation to database
                try {
                    await pool.execute(
                        'INSERT INTO chatbot_conversations (session_id, user_message, bot_response, api_used, response_time_ms) VALUES (?, ?, ?, ?, ?)',
                        [sessionId || 'unknown', message, botResponse, 'groq', responseTime]
                    );
                } catch (dbError) {
                    console.error('Error saving conversation:', dbError);
                }
                
                res.json({ response: botResponse });
            } else {
                res.status(500).json({ error: 'Invalid response from Groq API' });
            }
        } else {
            const errorData = await response.text();
            console.error('Groq API error:', response.status, errorData);
            res.status(response.status).json({ error: 'Groq API error' });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});

// API endpoint for statistics
app.get('/api/stats', async (req, res) => {
    try {
        const [detectionStats] = await pool.execute(`
            SELECT 
                COUNT(*) as total_detections,
                SUM(CASE WHEN detection_status = 'sleeping' THEN 1 ELSE 0 END) as sleeping_count,
                SUM(CASE WHEN detection_status = 'drowsy' THEN 1 ELSE 0 END) as drowsy_count,
                SUM(CASE WHEN detection_status = 'awake' THEN 1 ELSE 0 END) as awake_count,
                AVG(confidence) as avg_confidence,
                AVG(fps) as avg_fps
            FROM detections 
            WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        `);
        
        const [conversationStats] = await pool.execute(`
            SELECT 
                COUNT(*) as total_conversations,
                COUNT(DISTINCT session_id) as unique_sessions,
                AVG(response_time_ms) as avg_response_time
            FROM chatbot_conversations 
            WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        `);
        
        res.json({
            detections: detectionStats[0],
            conversations: conversationStats[0]
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// API endpoint for dashboard data
app.get('/api/dashboard', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                (SELECT COUNT(*) FROM detections WHERE DATE(timestamp) = CURDATE()) as today_detections,
                (SELECT COUNT(*) FROM detections WHERE detection_status = 'sleeping' AND DATE(timestamp) = CURDATE()) as today_sleeping,
                (SELECT COUNT(*) FROM detections WHERE detection_status = 'drowsy' AND DATE(timestamp) = CURDATE()) as today_drowsy,
                (SELECT COUNT(*) FROM chatbot_conversations WHERE DATE(timestamp) = CURDATE()) as today_conversations,
                (SELECT AVG(confidence) FROM detections WHERE DATE(timestamp) = CURDATE()) as today_avg_confidence,
                (SELECT AVG(fps) FROM detections WHERE DATE(timestamp) = CURDATE()) as today_avg_fps,
                (SELECT COUNT(*) FROM detections) as total_detections,
                (SELECT COUNT(*) FROM chatbot_conversations) as total_conversations,
                (SELECT COUNT(DISTINCT session_id) FROM sessions WHERE DATE(start_time) = CURDATE()) as active_sessions_today
        `);
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT 1 as status');
        res.json({ 
            status: 'healthy', 
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'unhealthy', 
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 YOLO AI Server running at http://localhost:${PORT}`);
    console.log(`📱 Open your browser and navigate to http://localhost:${PORT}`);
    console.log(`🔗 API endpoints available at http://localhost:${PORT}/api/`);
    
    // Test database connection
    await testDatabaseConnection();
    
    console.log(`\n📊 Available API endpoints:`);
    console.log(`   GET  /api/detections     - Get all detections`);
    console.log(`   POST /api/detections     - Save new detection`);
    console.log(`   DELETE /api/detections   - Clear all detections`);
    console.log(`   POST /api/chat          - Chat with AI`);
    console.log(`   GET  /api/stats         - Get statistics`);
    console.log(`   GET  /api/dashboard     - Get dashboard data`);
    console.log(`   GET  /api/health       - Health check`);
});