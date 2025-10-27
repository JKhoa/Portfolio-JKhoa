-- Database Schema cho YOLO AI Project
-- Tác giả: Nguyễn Hoàng Anh Khoa
-- Email: nhakhoa1004@gmail.com

-- Tạo database
CREATE DATABASE IF NOT EXISTS yolo_ai_project;
USE yolo_ai_project;

-- Bảng lưu trữ thông tin phát hiện ngủ gật
CREATE TABLE IF NOT EXISTS detections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    image_data LONGTEXT NOT NULL,
    detection_status ENUM('awake', 'drowsy', 'sleeping') NOT NULL,
    confidence DECIMAL(5,2) NOT NULL,
    eye_closed_frames INT DEFAULT 0,
    head_down_frames INT DEFAULT 0,
    fps DECIMAL(5,2),
    notes TEXT,
    session_id VARCHAR(100),
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_status (detection_status),
    INDEX idx_session (session_id)
);

-- Bảng lưu trữ thông tin người dùng (nếu cần)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    full_name VARCHAR(100),
    role ENUM('admin', 'user', 'guest') DEFAULT 'guest',
    api_key VARCHAR(255),
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Bảng lưu trữ lịch sử chatbot
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id VARCHAR(100),
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    api_used ENUM('groq', 'local', 'fallback') DEFAULT 'local',
    response_time_ms INT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_session (session_id),
    INDEX idx_timestamp (timestamp)
);

-- Bảng lưu trữ cài đặt hệ thống
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng lưu trữ thống kê sử dụng
CREATE TABLE IF NOT EXISTS usage_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    total_detections INT DEFAULT 0,
    sleeping_detections INT DEFAULT 0,
    drowsy_detections INT DEFAULT 0,
    awake_detections INT DEFAULT 0,
    total_conversations INT DEFAULT 0,
    unique_users INT DEFAULT 0,
    avg_response_time DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date)
);

-- Bảng lưu trữ phiên làm việc
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(100) PRIMARY KEY,
    user_id INT,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    total_detections INT DEFAULT 0,
    total_conversations INT DEFAULT 0,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_start_time (start_time)
);

-- Insert dữ liệu mẫu cho system_settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('default_sensitivity', '0.6', 'Độ nhạy phát hiện mặc định'),
('alert_threshold', '15', 'Ngưỡng cảnh báo (số frame)'),
('max_detection_history', '100', 'Số lượng phát hiện tối đa lưu trữ'),
('auto_capture_enabled', 'true', 'Tự động chụp ảnh khi phát hiện ngủ gật'),
('chatbot_enabled', 'true', 'Bật/tắt chatbot'),
('api_rate_limit', '100', 'Giới hạn số request API mỗi giờ'),
('database_cleanup_days', '30', 'Số ngày tự động dọn dẹp database cũ');

-- Insert user mặc định
INSERT INTO users (username, email, full_name, role) VALUES
('admin', 'nhakhoa1004@gmail.com', 'Nguyễn Hoàng Anh Khoa', 'admin'),
('demo_user', 'demo@example.com', 'Demo User', 'user');

-- Tạo view để thống kê nhanh
CREATE VIEW detection_summary AS
SELECT 
    DATE(timestamp) as detection_date,
    COUNT(*) as total_detections,
    SUM(CASE WHEN detection_status = 'sleeping' THEN 1 ELSE 0 END) as sleeping_count,
    SUM(CASE WHEN detection_status = 'drowsy' THEN 1 ELSE 0 END) as drowsy_count,
    SUM(CASE WHEN detection_status = 'awake' THEN 1 ELSE 0 END) as awake_count,
    AVG(confidence) as avg_confidence,
    AVG(fps) as avg_fps
FROM detections 
GROUP BY DATE(timestamp)
ORDER BY detection_date DESC;

-- Tạo view cho chatbot stats
CREATE VIEW chatbot_summary AS
SELECT 
    DATE(timestamp) as conversation_date,
    COUNT(*) as total_conversations,
    COUNT(DISTINCT session_id) as unique_sessions,
    AVG(response_time_ms) as avg_response_time,
    SUM(CASE WHEN api_used = 'groq' THEN 1 ELSE 0 END) as groq_responses,
    SUM(CASE WHEN api_used = 'local' THEN 1 ELSE 0 END) as local_responses
FROM chatbot_conversations 
GROUP BY DATE(timestamp)
ORDER BY conversation_date DESC;

-- Tạo stored procedure để dọn dẹp dữ liệu cũ
DELIMITER //
CREATE PROCEDURE CleanupOldData()
BEGIN
    DECLARE cleanup_days INT DEFAULT 30;
    
    -- Lấy số ngày từ settings
    SELECT CAST(setting_value AS UNSIGNED) INTO cleanup_days 
    FROM system_settings 
    WHERE setting_key = 'database_cleanup_days';
    
    -- Xóa detections cũ
    DELETE FROM detections 
    WHERE timestamp < DATE_SUB(NOW(), INTERVAL cleanup_days DAY);
    
    -- Xóa conversations cũ
    DELETE FROM chatbot_conversations 
    WHERE timestamp < DATE_SUB(NOW(), INTERVAL cleanup_days DAY);
    
    -- Xóa sessions cũ
    DELETE FROM sessions 
    WHERE start_time < DATE_SUB(NOW(), INTERVAL cleanup_days DAY);
    
    SELECT ROW_COUNT() as deleted_records;
END //
DELIMITER ;

-- Tạo stored procedure để lấy thống kê
DELIMITER //
CREATE PROCEDURE GetDetectionStats(IN days_back INT)
BEGIN
    SELECT 
        COUNT(*) as total_detections,
        SUM(CASE WHEN detection_status = 'sleeping' THEN 1 ELSE 0 END) as sleeping_count,
        SUM(CASE WHEN detection_status = 'drowsy' THEN 1 ELSE 0 END) as drowsy_count,
        SUM(CASE WHEN detection_status = 'awake' THEN 1 ELSE 0 END) as awake_count,
        AVG(confidence) as avg_confidence,
        AVG(fps) as avg_fps,
        MIN(timestamp) as first_detection,
        MAX(timestamp) as last_detection
    FROM detections 
    WHERE timestamp >= DATE_SUB(NOW(), INTERVAL days_back DAY);
END //
DELIMITER ;

-- Tạo trigger để tự động cập nhật usage_stats
DELIMITER //
CREATE TRIGGER update_usage_stats_after_detection
AFTER INSERT ON detections
FOR EACH ROW
BEGIN
    INSERT INTO usage_stats (date, total_detections, sleeping_detections, drowsy_detections, awake_detections)
    VALUES (DATE(NEW.timestamp), 1, 
            CASE WHEN NEW.detection_status = 'sleeping' THEN 1 ELSE 0 END,
            CASE WHEN NEW.detection_status = 'drowsy' THEN 1 ELSE 0 END,
            CASE WHEN NEW.detection_status = 'awake' THEN 1 ELSE 0 END)
    ON DUPLICATE KEY UPDATE
        total_detections = total_detections + 1,
        sleeping_detections = sleeping_detections + CASE WHEN NEW.detection_status = 'sleeping' THEN 1 ELSE 0 END,
        drowsy_detections = drowsy_detections + CASE WHEN NEW.detection_status = 'drowsy' THEN 1 ELSE 0 END,
        awake_detections = awake_detections + CASE WHEN NEW.detection_status = 'awake' THEN 1 ELSE 0 END;
END //
DELIMITER ;

-- Tạo trigger cho chatbot conversations
DELIMITER //
CREATE TRIGGER update_usage_stats_after_chat
AFTER INSERT ON chatbot_conversations
FOR EACH ROW
BEGIN
    INSERT INTO usage_stats (date, total_conversations)
    VALUES (DATE(NEW.timestamp), 1)
    ON DUPLICATE KEY UPDATE
        total_conversations = total_conversations + 1;
END //
DELIMITER ;

-- Tạo index để tối ưu hiệu suất
CREATE INDEX idx_detections_status_time ON detections(detection_status, timestamp);
CREATE INDEX idx_chatbot_session_time ON chatbot_conversations(session_id, timestamp);
CREATE INDEX idx_sessions_user_time ON sessions(user_id, start_time);

-- Tạo event để tự động dọn dẹp hàng ngày
CREATE EVENT IF NOT EXISTS daily_cleanup
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
  CALL CleanupOldData();

-- Bật event scheduler
SET GLOBAL event_scheduler = ON;

-- Tạo backup table cho detections
CREATE TABLE detections_backup LIKE detections;

-- Tạo function để export data
DELIMITER //
CREATE FUNCTION ExportDetectionData(start_date DATE, end_date DATE)
RETURNS TEXT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE result TEXT DEFAULT '';
    DECLARE done INT DEFAULT FALSE;
    DECLARE detection_record TEXT;
    
    DECLARE cur CURSOR FOR
        SELECT CONCAT(
            id, ',',
            timestamp, ',',
            detection_status, ',',
            confidence, ',',
            fps, ',',
            session_id
        ) as record
        FROM detections 
        WHERE DATE(timestamp) BETWEEN start_date AND end_date
        ORDER BY timestamp;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO detection_record;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        SET result = CONCAT(result, detection_record, '\n');
    END LOOP;
    
    CLOSE cur;
    RETURN result;
END //
DELIMITER ;

-- Tạo view cho dashboard
CREATE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM detections WHERE DATE(timestamp) = CURDATE()) as today_detections,
    (SELECT COUNT(*) FROM detections WHERE detection_status = 'sleeping' AND DATE(timestamp) = CURDATE()) as today_sleeping,
    (SELECT COUNT(*) FROM detections WHERE detection_status = 'drowsy' AND DATE(timestamp) = CURDATE()) as today_drowsy,
    (SELECT COUNT(*) FROM chatbot_conversations WHERE DATE(timestamp) = CURDATE()) as today_conversations,
    (SELECT AVG(confidence) FROM detections WHERE DATE(timestamp) = CURDATE()) as today_avg_confidence,
    (SELECT AVG(fps) FROM detections WHERE DATE(timestamp) = CURDATE()) as today_avg_fps,
    (SELECT COUNT(*) FROM detections) as total_detections,
    (SELECT COUNT(*) FROM chatbot_conversations) as total_conversations,
    (SELECT COUNT(DISTINCT session_id) FROM sessions WHERE DATE(start_time) = CURDATE()) as active_sessions_today;

-- Insert dữ liệu mẫu để test
INSERT INTO detections (image_data, detection_status, confidence, fps, session_id, notes) VALUES
('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...', 'awake', 95.5, 24.8, 'session_001', 'Test detection 1'),
('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...', 'drowsy', 78.2, 23.1, 'session_001', 'Test detection 2'),
('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...', 'sleeping', 89.7, 25.2, 'session_002', 'Test detection 3');

INSERT INTO chatbot_conversations (session_id, user_message, bot_response, api_used, response_time_ms) VALUES
('session_001', 'Xin chào', 'Xin chào! Tôi có thể giúp bạn tìm hiểu về YOLO và nhận diện ngủ gật.', 'local', 150),
('session_001', 'YOLO là gì?', 'YOLO (You Only Look Once) là thuật toán nhận dạng đối tượng thời gian thực.', 'groq', 1200),
('session_002', 'Cảm ơn', 'Rất vui được giúp đỡ bạn!', 'local', 100);

-- Tạo user cho ứng dụng (không phải root)
CREATE USER IF NOT EXISTS 'yolo_app'@'localhost' IDENTIFIED BY 'yolo_password_2024';
GRANT SELECT, INSERT, UPDATE, DELETE ON yolo_ai_project.* TO 'yolo_app'@'localhost';
GRANT EXECUTE ON PROCEDURE yolo_ai_project.CleanupOldData TO 'yolo_app'@'localhost';
GRANT EXECUTE ON PROCEDURE yolo_ai_project.GetDetectionStats TO 'yolo_app'@'localhost';
FLUSH PRIVILEGES;

-- Hiển thị thông tin database
SELECT 'Database schema created successfully!' as status;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'yolo_ai_project';
SELECT table_name, table_rows FROM information_schema.tables WHERE table_schema = 'yolo_ai_project' AND table_type = 'BASE TABLE';
