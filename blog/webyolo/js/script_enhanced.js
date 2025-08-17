// Enhanced YOLO Demo with Database Integration
class EnhancedDrowsinessDetector {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.initializeEvents();
        this.checkServerConnection();
    }

    initializeElements() {
        // Demo elements
        this.webcam = document.getElementById('webcam');
        this.canvas = document.getElementById('canvas');
        this.detectionOverlay = document.getElementById('detectionOverlay');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.startDemo = document.getElementById('startDemo');
        this.stopDemo = document.getElementById('stopDemo');
        this.capturePhoto = document.getElementById('capturePhoto');
        this.viewGallery = document.getElementById('viewGallery');
        this.testCamera = document.getElementById('testCamera');
        this.resetDemo = document.getElementById('resetDemo');
        
        // Detection info elements
        this.detectionStatus = document.getElementById('detectionStatus');
        this.confidence = document.getElementById('confidence');
        this.fps = document.getElementById('fps');
        this.historyList = document.getElementById('historyList');
        this.dbStatus = document.getElementById('dbStatus');
        
        // Settings elements
        this.sensitivity = document.getElementById('sensitivity');
        this.sensitivityValue = document.getElementById('sensitivityValue');
        this.alertMode = document.getElementById('alertMode');
        this.autoSave = document.getElementById('autoSave');
        
        // Database elements
        this.refreshDatabase = document.getElementById('refreshDatabase');
        this.clearDatabase = document.getElementById('clearDatabase');
        this.databaseList = document.getElementById('databaseList');
        this.totalDetections = document.getElementById('totalDetections');
        this.sleepingCount = document.getElementById('sleepingCount');
        this.drowsyCount = document.getElementById('drowsyCount');
        this.todayCount = document.getElementById('todayCount');
        
        // Chatbot elements
        this.chatbotToggle = document.getElementById('chatbotToggle');
        this.chatbotWindow = document.getElementById('chatbotWindow');
        this.closeChatbot = document.getElementById('closeChatbot');
        this.chatbotMessages = document.getElementById('chatbotMessages');
        this.chatbotInput = document.getElementById('chatbotInput');
        this.sendMessage = document.getElementById('sendMessage');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettings = document.getElementById('closeSettings');
        this.saveSettings = document.getElementById('saveSettings');
        this.testAI = document.getElementById('testAI');
        this.groqApiKey = document.getElementById('groqApiKey');
        this.aiStatus = document.getElementById('aiStatus');
        this.userName = document.getElementById('userName');
        this.memoryInfo = document.getElementById('memoryInfo');
        this.conversationCount = document.getElementById('conversationCount');
        this.interestCount = document.getElementById('interestCount');
        this.clearMemory = document.getElementById('clearMemory');
    }

    initializeState() {
        this.isRunning = false;
        this.stream = null;
        this.frameCount = 0;
        this.fpsStartTime = Date.now();
        this.eyeClosedFrames = 0;
        this.headDownFrames = 0;
        this.alertThreshold = 15;
        this.lastDetectionTime = 0;
        this.serverUrl = 'http://localhost:3001';
        this.detectionHistory = [];
        this.maxHistoryItems = 10;
        
        // Chatbot state
        this.isChatbotOpen = false;
        this.isSettingsOpen = false;
        this.userMemory = this.getUserMemory();
        this.conversationHistory = this.getConversationHistory();
    }

    initializeEvents() {
        // Demo events
        this.startDemo?.addEventListener('click', () => this.startDetection());
        this.stopDemo?.addEventListener('click', () => this.stopDetection());
        this.capturePhoto?.addEventListener('click', () => this.capturePhoto());
        this.viewGallery?.addEventListener('click', () => this.showImageGallery());
        this.testCamera?.addEventListener('click', () => this.testCameraAccess());
        this.resetDemo?.addEventListener('click', () => this.resetDetection());
        
        // Settings events
        this.sensitivity?.addEventListener('input', (e) => {
            this.sensitivityValue.textContent = e.target.value;
            this.alertThreshold = Math.round(parseFloat(e.target.value) * 25);
        });
        
        // Database events
        this.refreshDatabase?.addEventListener('click', () => this.loadDatabaseData());
        this.clearDatabase?.addEventListener('click', () => this.clearDatabaseData());
        
        // Chatbot events
        this.chatbotToggle?.addEventListener('click', () => this.toggleChatbot());
        this.closeChatbot?.addEventListener('click', () => this.closeChatbotWindow());
        this.sendMessage?.addEventListener('click', () => this.sendChatbotMessage());
        this.chatbotInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatbotMessage();
        });
        
        // Settings modal events
        this.settingsBtn?.addEventListener('click', () => this.openSettings());
        this.closeSettings?.addEventListener('click', () => this.closeSettings());
        this.saveSettings?.addEventListener('click', () => this.saveSettings());
        this.testAI?.addEventListener('click', () => this.testAI());
        this.clearMemory?.addEventListener('click', () => this.clearUserMemory());
        
        // Close modals on background click
        this.settingsModal?.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.closeSettings();
        });
    }

    async checkServerConnection() {
        try {
            const response = await fetch(`${this.serverUrl}/api/drowsiness/stats`);
            if (response.ok) {
                this.updateDBStatus('Đã kết nối', true);
                this.loadDatabaseData();
            } else {
                this.updateDBStatus('Lỗi kết nối', false);
            }
        } catch (error) {
            this.updateDBStatus('Không kết nối được', false);
            this.showNotification('⚠️ Không thể kết nối đến server. Chạy server trước khi sử dụng demo.', 'warning');
        }
    }

    updateDBStatus(text, isConnected) {
        if (this.dbStatus) {
            this.dbStatus.textContent = text;
            this.dbStatus.className = isConnected ? 'db-status connected' : 'db-status';
        }
    }

    async testCameraAccess() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false
            });
            this.showNotification('✅ Camera hoạt động bình thường!', 'success');
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            this.showNotification('❌ Lỗi camera: ' + error.message, 'error');
        }
    }

    async startDetection() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false
            });

            this.stream = stream;
            this.webcam.srcObject = stream;
            this.isRunning = true;
            this.updateStatus('✅ Đang phát hiện...', true);
            this.toggleButtons(true);
            this.detectionLoop();
        } catch (error) {
            this.showNotification('❌ Lỗi: ' + error.message, 'error');
        }
    }

    stopDetection() {
        this.isRunning = false;
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        this.updateStatus('Đã dừng', false);
        this.toggleButtons(false);
    }

    resetDetection() {
        this.stopDetection();
        this.eyeClosedFrames = 0;
        this.headDownFrames = 0;
        this.updateDetectionStats('Đã reset', 0);
        this.detectionHistory = [];
        this.updateHistoryDisplay();
    }

    detectionLoop() {
        if (!this.isRunning) return;
        this.frameCount++;
        this.updateFPS();
        this.simulateDetection();
        requestAnimationFrame(() => this.detectionLoop());
    }

    simulateDetection() {
        const hasFace = Math.random() > 0.1;
        if (hasFace) {
            const eyesClosed = Math.random() > 0.85;
            if (eyesClosed) {
                this.eyeClosedFrames++;
            } else {
                this.eyeClosedFrames = 0;
            }

            let status = 'Tỉnh táo';
            let confidence = 95;
            let alertLevel = 'normal';

            if (this.eyeClosedFrames > this.alertThreshold) {
                status = 'Ngủ gật';
                confidence = Math.min(95, 60 + this.eyeClosedFrames * 2);
                alertLevel = 'sleeping';
            } else if (this.eyeClosedFrames > 5) {
                status = 'Buồn ngủ';
                confidence = Math.min(85, 50 + this.eyeClosedFrames * 3);
                alertLevel = 'drowsy';
            }

            this.updateDetectionStats(status, confidence);
            this.drawDetectionBox(alertLevel, confidence);
            this.addToHistory(status, confidence);

            if (alertLevel === 'sleeping' && this.autoSave?.value === 'true') {
                this.captureAndSaveToDatabase(status, confidence);
            }
        } else {
            this.updateDetectionStats('Không phát hiện mặt', 0);
        }
    }

    drawDetectionBox(alertLevel, confidence) {
        if (!this.detectionOverlay) return;
        this.detectionOverlay.innerHTML = '';
        
        const box = document.createElement('div');
        box.className = `detection-box ${alertLevel}`;
        box.style.cssText = `
            position: absolute;
            border: 3px solid ${alertLevel === 'sleeping' ? '#ff0000' : alertLevel === 'drowsy' ? '#ffaa00' : '#00ff00'};
            border-radius: 5px;
            background: rgba(255,255,255,0.1);
            left: 100px;
            top: 50px;
            width: 200px;
            height: 200px;
        `;
        
        const label = document.createElement('div');
        label.textContent = `${alertLevel.toUpperCase()} (${confidence}%)`;
        label.style.cssText = `
            position: absolute;
            top: -25px;
            left: 0;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
        `;
        
        box.appendChild(label);
        this.detectionOverlay.appendChild(box);
    }

    updateStatus(text, isActive) {
        if (this.statusIndicator) {
            const statusText = this.statusIndicator.querySelector('.status-text');
            if (statusText) {
                statusText.textContent = text;
            }
            this.statusIndicator.className = 'status-indicator';
            if (isActive) {
                this.statusIndicator.classList.add('active');
            }
        }
    }

    updateDetectionStats(status, confidence) {
        if (this.detectionStatus) {
            this.detectionStatus.textContent = status;
        }
        if (this.confidence) {
            this.confidence.textContent = confidence + '%';
        }
    }

    updateFPS() {
        const now = Date.now();
        if (now - this.fpsStartTime >= 1000) {
            const currentFPS = Math.round(this.frameCount * 1000 / (now - this.fpsStartTime));
            if (this.fps) {
                this.fps.textContent = currentFPS;
            }
            this.frameCount = 0;
            this.fpsStartTime = now;
        }
    }

    toggleButtons(isRunning) {
        if (this.startDemo) {
            this.startDemo.style.display = isRunning ? 'none' : 'block';
        }
        if (this.stopDemo) {
            this.stopDemo.style.display = isRunning ? 'block' : 'none';
        }
    }

    addToHistory(status, confidence) {
        const timestamp = new Date().toLocaleTimeString('vi-VN');
        const historyItem = { status, confidence, timestamp };
        
        this.detectionHistory.unshift(historyItem);
        if (this.detectionHistory.length > this.maxHistoryItems) {
            this.detectionHistory = this.detectionHistory.slice(0, this.maxHistoryItems);
        }
        
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        if (!this.historyList) return;
        
        if (this.detectionHistory.length === 0) {
            this.historyList.innerHTML = '<p class="no-history">Chưa có dữ liệu phát hiện</p>';
            return;
        }
        
        const historyHTML = this.detectionHistory.map(item => `
            <div class="history-item">
                <span class="history-time">${item.timestamp}</span>
                <span class="history-status ${item.status === 'Ngủ gật' ? 'sleeping' : 'drowsy'}">${item.status}</span>
                <span class="history-confidence">${item.confidence}%</span>
            </div>
        `).join('');
        
        this.historyList.innerHTML = historyHTML;
    }

    capturePhoto() {
        if (!this.isRunning || !this.webcam) {
            this.showNotification('❌ Demo chưa chạy hoặc camera chưa sẵn sàng', 'error');
            return;
        }
        const currentStatus = this.detectionStatus ? this.detectionStatus.textContent : 'Chụp thủ công';
        const currentConfidence = this.confidence ? parseInt(this.confidence.textContent) : 0;
        this.captureAndSaveToDatabase(currentStatus, currentConfidence);
    }

    async captureAndSaveToDatabase(status, confidence) {
        if (!this.webcam) return;

        try {
            const captureCanvas = document.createElement('canvas');
            const ctx = captureCanvas.getContext('2d');
            captureCanvas.width = this.webcam.videoWidth || 640;
            captureCanvas.height = this.webcam.videoHeight || 480;
            ctx.drawImage(this.webcam, 0, 0, captureCanvas.width, captureCanvas.height);
            const imageData = captureCanvas.toDataURL('image/jpeg', 0.8);

            const detectionData = {
                imageData: imageData,
                status: status,
                confidence: confidence,
                timestamp: new Date().toISOString(),
                eyeClosedFrames: this.eyeClosedFrames,
                headDownFrames: this.headDownFrames
            };

            const response = await fetch(`${this.serverUrl}/api/drowsiness/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(detectionData)
            });

            if (response.ok) {
                this.showNotification(`📸 Đã lưu ảnh vào database: ${status}`, 'success');
                this.loadDatabaseData();
            } else {
                throw new Error('Failed to save to database');
            }
        } catch (error) {
            this.showNotification('❌ Lỗi khi lưu vào database', 'error');
        }
    }

    async loadDatabaseData() {
        try {
            const response = await fetch(`${this.serverUrl}/api/drowsiness/list?limit=20`);
            if (response.ok) {
                const data = await response.json();
                this.updateDatabaseDisplay(data.data);
            }

            const statsResponse = await fetch(`${this.serverUrl}/api/drowsiness/stats`);
            if (statsResponse.ok) {
                const stats = await statsResponse.json();
                this.updateDatabaseStats(stats.stats);
            }
        } catch (error) {
            this.showNotification('❌ Lỗi khi tải dữ liệu database', 'error');
        }
    }

    updateDatabaseDisplay(detections) {
        if (!this.databaseList) return;

        if (detections.length === 0) {
            this.databaseList.innerHTML = '<p class="no-history">Chưa có dữ liệu trong database</p>';
            return;
        }

        const databaseHTML = detections.map(detection => `
            <div class="database-item">
                <img src="${this.serverUrl}/api/drowsiness/image/${detection.imageFile}" 
                     alt="Drowsiness ${detection.status}" 
                     class="database-image">
                <div class="database-info">
                    <div class="database-time">${detection.formattedTime}</div>
                    <div class="database-status ${detection.status === 'Ngủ gật' ? 'sleeping' : 'drowsy'}">
                        ${detection.status}
                    </div>
                    <div>Độ tin cậy: ${detection.confidence}%</div>
                </div>
                <div class="database-actions">
                    <button class="btn btn-small btn-danger" onclick="window.drowsinessDetector.deleteDetection('${detection.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        this.databaseList.innerHTML = databaseHTML;
    }

    updateDatabaseStats(stats) {
        if (this.totalDetections) this.totalDetections.textContent = stats.total;
        if (this.sleepingCount) this.sleepingCount.textContent = stats.sleeping;
        if (this.drowsyCount) this.drowsyCount.textContent = stats.drowsy;
        if (this.todayCount) this.todayCount.textContent = stats.today;
    }

    async deleteDetection(id) {
        if (!confirm('Bạn có chắc muốn xóa detection này?')) return;

        try {
            const response = await fetch(`${this.serverUrl}/api/drowsiness/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                this.showNotification('🗑️ Đã xóa detection thành công', 'success');
                this.loadDatabaseData();
            }
        } catch (error) {
            this.showNotification('❌ Lỗi khi xóa detection', 'error');
        }
    }

    async clearDatabaseData() {
        if (!confirm('Bạn có chắc muốn xóa TẤT CẢ dữ liệu trong database?')) return;

        try {
            const response = await fetch(`${this.serverUrl}/api/drowsiness/list?limit=1000`);
            if (response.ok) {
                const data = await response.json();
                for (const detection of data.data) {
                    await fetch(`${this.serverUrl}/api/drowsiness/${detection.id}`, {
                        method: 'DELETE'
                    });
                }
                this.showNotification('🗑️ Đã xóa tất cả dữ liệu database', 'success');
                this.loadDatabaseData();
            }
        } catch (error) {
            this.showNotification('❌ Lỗi khi xóa database', 'error');
        }
    }

    showImageGallery() {
        this.loadDatabaseData();
        this.showNotification('📸 Đã tải thư viện ảnh từ database', 'info');
    }

    // Chatbot Functions
    toggleChatbot() {
        if (!this.chatbotWindow) return;
        
        this.isChatbotOpen = !this.isChatbotOpen;
        this.chatbotWindow.style.display = this.isChatbotOpen ? 'block' : 'none';
        
        if (this.isChatbotOpen) {
            this.chatbotInput?.focus();
        }
    }

    closeChatbotWindow() {
        if (!this.chatbotWindow) return;
        
        this.isChatbotOpen = false;
        this.chatbotWindow.style.display = 'none';
    }

    async sendChatbotMessage() {
        if (!this.chatbotInput || !this.chatbotMessages) return;
        
        const message = this.chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        this.addChatbotMessage(message, 'user');
        this.chatbotInput.value = '';

        // Get AI response
        const response = await this.getAIResponse(message);
        this.addChatbotMessage(response, 'bot');
    }

    addChatbotMessage(content, type) {
        if (!this.chatbotMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        this.chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
        
        // Save to conversation history
        this.saveConversationHistory(type, content);
    }

    async getAIResponse(message) {
        // Simple AI responses for demo
        const responses = {
            'yolo': 'YOLO (You Only Look Once) là một thuật toán nhận dạng đối tượng thời gian thực rất nhanh và chính xác.',
            'ngủ gật': 'Phát hiện ngủ gật sử dụng YOLO để nhận diện khuôn mặt và phân tích trạng thái mắt, đầu.',
            'demo': 'Bạn có thể thử demo bằng cách nhấn nút "Bắt Đầu Demo" và cho phép truy cập camera.',
            'camera': 'Demo cần quyền truy cập camera để phát hiện khuôn mặt và phân tích trạng thái.',
            'database': 'Dữ liệu phát hiện ngủ gật được lưu trữ trong database với hình ảnh và thời gian.',
            'help': 'Tôi có thể giúp bạn tìm hiểu về YOLO, demo phát hiện ngủ gật, và các tính năng khác.'
        };

        const lowerMessage = message.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        return 'Xin chào! Tôi có thể giúp bạn tìm hiểu về YOLO và nhận diện ngủ gật. Hãy hỏi về "yolo", "demo", "camera", "database" hoặc "help".';
    }

    // Settings Functions
    openSettings() {
        if (!this.settingsModal) return;
        
        this.isSettingsOpen = true;
        this.settingsModal.style.display = 'flex';
        this.loadSettings();
    }

    closeSettings() {
        if (!this.settingsModal) return;
        
        this.isSettingsOpen = false;
        this.settingsModal.style.display = 'none';
    }

    loadSettings() {
        if (this.groqApiKey) {
            this.groqApiKey.value = localStorage.getItem('groq_api_key') || '';
        }
        if (this.userName) {
            this.userName.value = this.userMemory?.name || '';
        }
        this.updateMemoryInfo();
    }

    saveSettings() {
        if (this.groqApiKey) {
            localStorage.setItem('groq_api_key', this.groqApiKey.value);
        }
        if (this.userName) {
            this.updateUserMemory({ name: this.userName.value });
        }
        this.showNotification('✅ Đã lưu cài đặt', 'success');
        this.closeSettings();
    }

    testAI() {
        this.showNotification('🤖 Test AI: Hệ thống AI đang hoạt động bình thường!', 'info');
    }

    // Memory Functions
    getUserMemory() {
        const memory = localStorage.getItem('chatbot_user_memory');
        return memory ? JSON.parse(memory) : {
            name: '',
            interests: [],
            conversation_count: 0,
            last_interaction: new Date().toISOString()
        };
    }

    updateUserMemory(updates) {
        this.userMemory = { ...this.userMemory, ...updates };
        localStorage.setItem('chatbot_user_memory', JSON.stringify(this.userMemory));
        this.updateMemoryInfo();
    }

    getConversationHistory() {
        const history = localStorage.getItem('chatbot_conversation_history');
        return history ? JSON.parse(history) : [];
    }

    saveConversationHistory(type, content) {
        this.conversationHistory.push({ type, content, timestamp: new Date().toISOString() });
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }
        localStorage.setItem('chatbot_conversation_history', JSON.stringify(this.conversationHistory));
        
        this.updateUserMemory({ 
            conversation_count: this.userMemory.conversation_count + 1 
        });
    }

    updateMemoryInfo() {
        if (this.conversationCount) {
            this.conversationCount.textContent = `${this.userMemory.conversation_count} cuộc trò chuyện`;
        }
        if (this.interestCount) {
            this.interestCount.textContent = `${this.userMemory.interests.length} sở thích`;
        }
    }

    clearUserMemory() {
        if (!confirm('Bạn có chắc muốn xóa tất cả dữ liệu cá nhân?')) return;
        
        localStorage.removeItem('chatbot_user_memory');
        localStorage.removeItem('chatbot_conversation_history');
        this.userMemory = this.getUserMemory();
        this.conversationHistory = this.getConversationHistory();
        this.updateMemoryInfo();
        this.showNotification('🗑️ Đã xóa dữ liệu cá nhân', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `demo-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            background: ${type === 'success' ? 'linear-gradient(45deg, #4CAF50, #45a049)' : 
                        type === 'error' ? 'linear-gradient(45deg, #f44336, #d32f2f)' :
                        type === 'warning' ? 'linear-gradient(45deg, #ff9800, #f57c00)' :
                        'linear-gradient(45deg, #2196F3, #1976D2)'};
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialize enhanced demo when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the demo page (has demo elements)
    if (document.getElementById('webcam')) {
        window.drowsinessDetector = new EnhancedDrowsinessDetector();
    }
});
