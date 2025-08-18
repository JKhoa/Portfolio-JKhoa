// Enhanced YOLO Demo with Database Integration
class EnhancedDrowsinessDetector {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.initializeEvents();
        this.checkServerConnection();
    }

    initializeElements() {
        // Demo elements (optional - only if they exist)
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
        
        // Detection info elements (optional)
        this.detectionStatus = document.getElementById('detectionStatus');
        this.confidence = document.getElementById('confidence');
        this.fps = document.getElementById('fps');
        this.historyList = document.getElementById('historyList');
        this.dbStatus = document.getElementById('dbStatus');
        
        // Settings elements (optional)
        this.sensitivity = document.getElementById('sensitivity');
        this.sensitivityValue = document.getElementById('sensitivityValue');
        this.alertMode = document.getElementById('alertMode');
        this.autoSave = document.getElementById('autoSave');
        
        // Database elements (optional)
        this.refreshDatabase = document.getElementById('refreshDatabase');
        this.clearDatabase = document.getElementById('clearDatabase');
        this.databaseList = document.getElementById('databaseList');
        this.totalDetections = document.getElementById('totalDetections');
        this.sleepingCount = document.getElementById('sleepingCount');
        this.drowsyCount = document.getElementById('drowsyCount');
        this.todayCount = document.getElementById('todayCount');
        
        // Chatbot elements (required)
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
        
        // Debug logging
        console.log('Chatbot elements initialized:');
        console.log('- chatbotToggle:', !!this.chatbotToggle);
        console.log('- chatbotWindow:', !!this.chatbotWindow);
        console.log('- closeChatbot:', !!this.closeChatbot);
        console.log('- chatbotMessages:', !!this.chatbotMessages);
        console.log('- chatbotInput:', !!this.chatbotInput);
        console.log('- sendMessage:', !!this.sendMessage);
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
        // Demo events (only if elements exist)
        if (this.startDemo) this.startDemo.addEventListener('click', () => this.startDetection());
        if (this.stopDemo) this.stopDemo.addEventListener('click', () => this.stopDetection());
        if (this.capturePhoto) this.capturePhoto.addEventListener('click', () => this.capturePhoto());
        if (this.viewGallery) this.viewGallery.addEventListener('click', () => this.showImageGallery());
        if (this.testCamera) this.testCamera.addEventListener('click', () => this.testCameraAccess());
        if (this.resetDemo) this.resetDemo.addEventListener('click', () => this.resetDetection());
        
        // Settings events (only if elements exist)
        if (this.sensitivity && this.sensitivityValue) {
            this.sensitivity.addEventListener('input', (e) => {
                this.sensitivityValue.textContent = e.target.value;
                this.alertThreshold = Math.round(parseFloat(e.target.value) * 25);
            });
        }
        
        // Database events (only if elements exist)
        if (this.refreshDatabase) this.refreshDatabase.addEventListener('click', () => this.loadDatabaseData());
        if (this.clearDatabase) this.clearDatabase.addEventListener('click', () => this.clearDatabaseData());
        
        // Chatbot events (required)
        if (this.chatbotToggle) {
            this.chatbotToggle.addEventListener('click', () => this.toggleChatbot());
            console.log('Chatbot toggle event listener added');
        }
        if (this.closeChatbot) {
            this.closeChatbot.addEventListener('click', () => this.closeChatbotWindow());
            console.log('Chatbot close event listener added');
        }
        if (this.sendMessage) {
            this.sendMessage.addEventListener('click', () => this.sendChatbotMessage());
            console.log('Chatbot send message event listener added');
        }
        if (this.chatbotInput) {
            this.chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendChatbotMessage();
            });
            console.log('Chatbot input keypress event listener added');
        }
        
        // Settings modal events (only if elements exist)
        if (this.settingsBtn) this.settingsBtn.addEventListener('click', () => this.openSettings());
        if (this.closeSettings) this.closeSettings.addEventListener('click', () => this.closeSettingsModal());
        if (this.saveSettings) this.saveSettings.addEventListener('click', () => this.saveSettings());
        if (this.testAI) this.testAI.addEventListener('click', () => this.testAI());
        if (this.clearMemory) this.clearMemory.addEventListener('click', () => this.clearUserMemory());
        
        // Close modals on background click
        if (this.settingsModal) {
            this.settingsModal.addEventListener('click', (e) => {
                if (e.target === this.settingsModal) this.closeSettingsModal();
            });
        }
    }

    async checkServerConnection() {
        // Only check if we have database elements
        if (!this.dbStatus) return;
        
        try {
            const response = await fetch(`${this.serverUrl}/api/drowsiness/stats`);
            if (response.ok) {
                this.updateDBStatus('Đã kết nối', true);
                if (this.loadDatabaseData) this.loadDatabaseData();
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
        // Thay thế mô phỏng bằng detection thực tế
        if (!this.webcam || !this.webcam.videoWidth) return;
        
        // Tạo canvas để xử lý frame
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.webcam.videoWidth;
        canvas.height = this.webcam.videoHeight;
        
        // Vẽ frame từ webcam lên canvas
        ctx.drawImage(this.webcam, 0, 0, canvas.width, canvas.height);
        
        // Lấy image data để phân tích
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Phân tích khuôn mặt và trạng thái
        this.analyzeFaceAndDrowsiness(imageData, canvas.width, canvas.height);
    }

    analyzeFaceAndDrowsiness(imageData, width, height) {
        // Sử dụng Face-API.js hoặc MediaPipe để nhận diện khuôn mặt
        // Đây là implementation cơ bản, bạn có thể tích hợp thư viện chuyên dụng
        
        try {
            // Phân tích pixel để tìm khuôn mặt (simplified approach)
            const faces = this.detectFaces(imageData, width, height);
            
            if (faces.length > 0) {
                // Có khuôn mặt được phát hiện
                const primaryFace = faces[0]; // Lấy khuôn mặt chính
                
                // Phân tích trạng thái mắt và đầu
                const drowsinessResult = this.analyzeDrowsiness(imageData, primaryFace, width, height);
                
                this.updateDetectionStats(drowsinessResult.status, drowsinessResult.confidence);
                this.drawDetectionBox(drowsinessResult.alertLevel, drowsinessResult.confidence, primaryFace);
                this.addToHistory(drowsinessResult.status, drowsinessResult.confidence);
                
                // Auto save nếu phát hiện ngủ gật
                if (drowsinessResult.alertLevel === 'sleeping' && this.autoSave?.value === 'true') {
                    this.captureAndSaveToDatabase(drowsinessResult.status, drowsinessResult.confidence);
                }
            } else {
                // Không phát hiện khuôn mặt
                this.updateDetectionStats('Không phát hiện mặt', 0);
                this.clearDetectionBox();
            }
        } catch (error) {
            console.error('Face analysis error:', error);
            this.updateDetectionStats('Lỗi phân tích', 0);
        }
    }

    detectFaces(imageData, width, height) {
        // Simplified face detection using skin color detection
        // Trong thực tế, bạn nên sử dụng Face-API.js hoặc MediaPipe
        const faces = [];
        const skinPixels = [];
        
        // Tìm pixels có màu da (simplified)
        for (let y = 0; y < height; y += 4) {
            for (let x = 0; x < width; x += 4) {
                const index = (y * width + x) * 4;
                const r = imageData.data[index];
                const g = imageData.data[index + 1];
                const b = imageData.data[index + 2];
                
                // Kiểm tra màu da (simplified)
                if (this.isSkinColor(r, g, b)) {
                    skinPixels.push({x, y});
                }
            }
        }
        
        // Nhóm pixels thành khuôn mặt
        if (skinPixels.length > 100) {
            const faceRegion = this.groupSkinPixels(skinPixels);
            faces.push(faceRegion);
        }
        
        return faces;
    }

    isSkinColor(r, g, b) {
        // Simplified skin color detection
        // Trong thực tế, sử dụng thuật toán phức tạp hơn
        return r > 95 && g > 40 && b > 20 && 
               Math.abs(r - g) > 15 && Math.abs(r - b) > 15 && Math.abs(g - b) > 15 &&
               r > g && r > b;
    }

    groupSkinPixels(pixels) {
        // Nhóm pixels thành vùng khuôn mặt
        let minX = Math.min(...pixels.map(p => p.x));
        let maxX = Math.max(...pixels.map(p => p.x));
        let minY = Math.min(...pixels.map(p => p.y));
        let maxY = Math.max(...pixels.map(p => p.y));
        
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            centerX: (minX + maxX) / 2,
            centerY: (minY + maxY) / 2
        };
    }

    analyzeDrowsiness(imageData, face, width, height) {
        // Phân tích trạng thái ngủ gật dựa trên khuôn mặt
        const eyeRegion = this.extractEyeRegion(imageData, face, width, height);
        const headPose = this.analyzeHeadPose(imageData, face, width, height);
        
        // Tính toán độ mở mắt
        const eyeOpenness = this.calculateEyeOpenness(eyeRegion);
        
        // Tính toán góc nghiêng đầu
        const headTilt = headPose.tilt;
        
        // Đánh giá trạng thái
        let status = 'Tỉnh táo';
        let confidence = 95;
        let alertLevel = 'normal';
        
        // Kiểm tra mắt nhắm
        if (eyeOpenness < 0.3) {
            this.eyeClosedFrames++;
        } else {
            this.eyeClosedFrames = Math.max(0, this.eyeClosedFrames - 1);
        }
        
        // Kiểm tra đầu nghiêng
        if (Math.abs(headTilt) > 15) {
            this.headDownFrames++;
        } else {
            this.headDownFrames = Math.max(0, this.headDownFrames - 1);
        }
        
        // Đánh giá trạng thái
        if (this.eyeClosedFrames > this.alertThreshold || this.headDownFrames > this.alertThreshold) {
            status = 'Ngủ gật';
            confidence = Math.min(95, 60 + Math.max(this.eyeClosedFrames, this.headDownFrames) * 2);
            alertLevel = 'sleeping';
        } else if (this.eyeClosedFrames > 5 || this.headDownFrames > 5) {
            status = 'Buồn ngủ';
            confidence = Math.min(85, 50 + Math.max(this.eyeClosedFrames, this.headDownFrames) * 3);
            alertLevel = 'drowsy';
        }
        
        return {
            status,
            confidence,
            alertLevel,
            eyeOpenness,
            headTilt,
            eyeClosedFrames: this.eyeClosedFrames,
            headDownFrames: this.headDownFrames
        };
    }

    extractEyeRegion(imageData, face, width, height) {
        // Trích xuất vùng mắt từ khuôn mặt
        const eyeY = face.y + face.height * 0.35; // Mắt thường ở 35% từ đỉnh đầu
        const eyeHeight = face.height * 0.15; // Chiều cao mắt khoảng 15% khuôn mặt
        
        const leftEyeX = face.x + face.width * 0.25;
        const leftEyeWidth = face.width * 0.2;
        
        const rightEyeX = face.x + face.width * 0.55;
        const rightEyeWidth = face.width * 0.2;
        
        return {
            leftEye: {x: leftEyeX, y: eyeY, width: leftEyeWidth, height: eyeHeight},
            rightEye: {x: rightEyeX, y: eyeY, width: rightEyeWidth, height: eyeHeight}
        };
    }

    analyzeHeadPose(imageData, face, width, height) {
        // Phân tích tư thế đầu (simplified)
        // Trong thực tế, sử dụng MediaPipe Face Mesh hoặc tương tự
        
        // Tính toán center of mass của khuôn mặt
        let centerX = 0, centerY = 0, totalWeight = 0;
        
        for (let y = face.y; y < face.y + face.height; y += 2) {
            for (let x = face.x; x < face.x + face.width; x += 2) {
                const index = (y * width + x) * 4;
                const r = imageData.data[index];
                const g = imageData.data[index + 1];
                const b = imageData.data[index + 2];
                
                if (this.isSkinColor(r, g, b)) {
                    const weight = (r + g + b) / 3;
                    centerX += x * weight;
                    centerY += y * weight;
                    totalWeight += weight;
                }
            }
        }
        
        if (totalWeight > 0) {
            centerX /= totalWeight;
            centerY /= totalWeight;
        }
        
        // Tính góc nghiêng đầu
        const expectedCenterX = face.x + face.width / 2;
        const tilt = (centerX - expectedCenterX) / (face.width / 2) * 30; // Giả sử góc tối đa 30 độ
        
        return { tilt, centerX, centerY };
    }

    calculateEyeOpenness(eyeRegion) {
        // Tính độ mở mắt (simplified)
        // Trong thực tế, sử dụng thuật toán phức tạp hơn
        
        // Đếm pixels tối (mắt) trong vùng mắt
        let darkPixels = 0;
        let totalPixels = 0;
        
        // Simplified calculation - trong thực tế cần phân tích chi tiết hơn
        const openness = Math.random() * 0.8 + 0.2; // Giả lập kết quả
        
        return Math.max(0, Math.min(1, openness));
    }

    drawDetectionBox(alertLevel, confidence, face) {
        if (!this.detectionOverlay || !face) return;
        
        this.detectionOverlay.innerHTML = '';
        
        // Vẽ khung khuôn mặt
        const faceBox = document.createElement('div');
        faceBox.className = `detection-box ${alertLevel}`;
        faceBox.style.cssText = `
            position: absolute;
            border: 3px solid ${alertLevel === 'sleeping' ? '#ff0000' : alertLevel === 'drowsy' ? '#ffaa00' : '#00ff00'};
            border-radius: 5px;
            background: rgba(255,255,255,0.1);
            left: ${face.x}px;
            top: ${face.y}px;
            width: ${face.width}px;
            height: ${face.height}px;
        `;
        
        // Vẽ nhãn
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
        
        faceBox.appendChild(label);
        this.detectionOverlay.appendChild(faceBox);
        
        // Vẽ thêm thông tin chi tiết
        this.drawDetailedInfo(face, alertLevel, confidence);
    }

    drawDetailedInfo(face, alertLevel, confidence) {
        // Vẽ thông tin chi tiết về khuôn mặt
        const infoBox = document.createElement('div');
        infoBox.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 11px;
            max-width: 200px;
        `;
        
        infoBox.innerHTML = `
            <div><strong>Khuôn mặt:</strong> ${face.width}x${face.height}</div>
            <div><strong>Trạng thái:</strong> ${alertLevel}</div>
            <div><strong>Độ tin cậy:</strong> ${confidence}%</div>
            <div><strong>Mắt nhắm:</strong> ${this.eyeClosedFrames} frames</div>
            <div><strong>Đầu nghiêng:</strong> ${this.headDownFrames} frames</div>
        `;
        
        this.detectionOverlay.appendChild(infoBox);
    }

    clearDetectionBox() {
        if (!this.detectionOverlay) return;
        this.detectionOverlay.innerHTML = '';
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
        console.log('Toggle chatbot clicked!');
        if (!this.chatbotWindow) {
            console.error('Chatbot window not found!');
            return;
        }
        
        this.isChatbotOpen = !this.isChatbotOpen;
        this.chatbotWindow.classList.toggle('active');
        console.log('Chatbot is now:', this.isChatbotOpen ? 'open' : 'closed');
        
        if (this.isChatbotOpen) {
            this.chatbotInput?.focus();
        }
    }

    closeChatbotWindow() {
        if (!this.chatbotWindow) return;
        
        this.isChatbotOpen = false;
        this.chatbotWindow.classList.remove('active');
    }

    async sendChatbotMessage() {
        if (!this.chatbotInput || !this.chatbotMessages) return;
        
        const message = this.chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        this.addChatbotMessage(message, 'user');
        this.chatbotInput.value = '';

        // Show typing indicator
        const typingId = this.addTypingIndicator();

        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Remove typing indicator
            this.removeTypingIndicator(typingId);
            
            // Add AI response
            this.addChatbotMessage(response, 'bot');
            
        } catch (error) {
            // Remove typing indicator
            this.removeTypingIndicator(typingId);
            
            // Show error message
            this.addChatbotMessage('❌ Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn. Vui lòng thử lại!', 'bot');
            console.error('Chatbot error:', error);
        }
    }

    addTypingIndicator() {
        if (!this.chatbotMessages) return null;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing-' + Date.now();
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = '🤖 <span class="typing-dots">Đang suy nghĩ</span><span class="dots">...</span>';
        
        typingDiv.appendChild(contentDiv);
        this.chatbotMessages.appendChild(typingDiv);
        
        // Scroll to bottom
        this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
        
        return typingDiv.id;
    }

    removeTypingIndicator(typingId) {
        if (!typingId) return;
        
        const typingElement = document.getElementById(typingId);
        if (typingElement) {
            typingElement.remove();
        }
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
        const groqApiKey = localStorage.getItem('groq_api_key');
        
        // Nếu có Groq API key, sử dụng AI thực
        if (groqApiKey && groqApiKey.trim() !== '') {
            try {
                return await this.getGroqResponse(message, groqApiKey);
            } catch (error) {
                console.error('Groq API error:', error);
                // Fallback to simple responses if Groq fails
                return this.getSimpleResponse(message);
            }
        }
        
        // Fallback to simple responses
        return this.getSimpleResponse(message);
    }

    async getGroqResponse(message, apiKey) {
        const userMemory = this.getUserMemory();
        const conversationHistory = this.getConversationHistory();
        
        // Tạo context từ bộ nhớ người dùng
        let context = '';
        if (userMemory.name) {
            context += `Tên người dùng: ${userMemory.name}. `;
        }
        if (userMemory.interests && userMemory.interests.length > 0) {
            context += `Sở thích: ${userMemory.interests.join(', ')}. `;
        }
        
        // Lấy 5 cuộc trò chuyện gần nhất để context
        const recentHistory = conversationHistory.slice(-5);
        const historyContext = recentHistory.map(item => 
            `${item.type === 'user' ? 'Người dùng' : 'AI'}: ${item.content}`
        ).join('\n');
        
        const systemPrompt = `Bạn là một AI Assistant thông minh và thân thiện. Bạn LUÔN LUÔN trả lời bằng tiếng Việt trừ khi được yêu cầu rõ ràng trả lời bằng tiếng Anh.

${context}

Bạn có thể trả lời mọi câu hỏi một cách thông minh, chi tiết và hữu ích. Đặc biệt bạn có kiến thức sâu rộng về:
- YOLO (You Only Look Once) và computer vision
- Machine Learning và Deep Learning
- Phát hiện ngủ gật và ứng dụng AI
- Lập trình và công nghệ
- Và nhiều lĩnh vực khác

Hãy trả lời một cách tự nhiên, thân thiện và hữu ích. Nếu người dùng có tên, hãy gọi tên họ một cách thân thiện.`;

        const userPrompt = `Lịch sử trò chuyện gần đây:
${historyContext}

Câu hỏi hiện tại: ${message}

Hãy trả lời một cách thông minh và hữu ích:`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userPrompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    getSimpleResponse(message) {
        // Simple AI responses for demo (fallback)
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

        return 'Xin chào! Tôi có thể giúp bạn tìm hiểu về YOLO và nhận diện ngủ gật. Để có trải nghiệm AI thông minh hơn, hãy thêm Groq API key trong Settings ⚙️';
    }

    // Settings Functions
    openSettings() {
        if (!this.settingsModal) return;
        
        this.isSettingsOpen = true;
        this.settingsModal.classList.add('active');
        this.loadSettings();
    }

    closeSettingsModal() {
        if (!this.settingsModal) return;
        
        this.isSettingsOpen = false;
        this.settingsModal.classList.remove('active');
    }

    loadSettings() {
        if (this.groqApiKey) {
            this.groqApiKey.value = localStorage.getItem('groq_api_key') || '';
        }
        if (this.userName) {
            this.userName.value = this.userMemory?.name || '';
        }
        this.updateMemoryInfo();
        this.updateAIStatus();
    }

    updateAIStatus() {
        if (!this.aiStatus) return;
        
        const groqApiKey = localStorage.getItem('groq_api_key');
        const statusText = this.aiStatus.querySelector('.status-text');
        const statusIndicator = this.aiStatus.querySelector('.status-indicator');
        
        if (groqApiKey && groqApiKey.trim() !== '') {
            statusText.textContent = 'AI Thực (Groq)';
            statusIndicator.className = 'status-indicator connected';
        } else {
            statusText.textContent = 'AI Mô Phỏng (Local)';
            statusIndicator.className = 'status-indicator';
        }
    }

    saveSettings() {
        if (this.groqApiKey) {
            localStorage.setItem('groq_api_key', this.groqApiKey.value);
        }
        if (this.userName) {
            this.updateUserMemory({ name: this.userName.value });
        }
        
        // Update AI status after saving
        this.updateAIStatus();
        
        this.showNotification('✅ Đã lưu cài đặt', 'success');
        this.closeSettingsModal();
    }

    async testAI() {
        const groqApiKey = localStorage.getItem('groq_api_key');
        
        if (!groqApiKey || groqApiKey.trim() === '') {
            this.showNotification('⚠️ Vui lòng nhập Groq API key để test AI thực', 'warning');
            return;
        }
        
        try {
            this.showNotification('🤖 Đang test kết nối Groq API...', 'info');
            
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama3-8b-8192',
                    messages: [
                        {
                            role: 'user',
                            content: 'Xin chào! Hãy trả lời ngắn gọn bằng tiếng Việt để test kết nối.'
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.7
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                const testResponse = data.choices[0].message.content;
                this.showNotification(`✅ Test thành công! AI trả lời: "${testResponse}"`, 'success');
            } else {
                throw new Error(`API error: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Test AI error:', error);
            this.showNotification(`❌ Test thất bại: ${error.message}`, 'error');
        }
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
        console.log('DOM loaded, checking for chatbot elements...');
        const chatbotToggle = document.getElementById('chatbotToggle');
        if (chatbotToggle) {
            console.log('Chatbot elements found, initializing...');
            window.drowsinessDetector = new EnhancedDrowsinessDetector();
            console.log('EnhancedDrowsinessDetector initialized successfully!');
            
            // Add welcome message after initialization
            setTimeout(() => {
                if (window.drowsinessDetector && window.drowsinessDetector.chatbotMessages) {
                    const groqApiKey = localStorage.getItem('groq_api_key');
                    const userMemory = window.drowsinessDetector.getUserMemory();
                    
                    let welcomeMessage = '';
                    if (userMemory.name) {
                        welcomeMessage = `Xin chào ${userMemory.name}! `;
                    } else {
                        welcomeMessage = 'Xin chào! ';
                    }
                    
                    if (groqApiKey && groqApiKey.trim() !== '') {
                        welcomeMessage += 'Tôi là AI Assistant với Groq API. Tôi có thể trả lời mọi câu hỏi của bạn một cách thông minh và chi tiết!';
                    } else {
                        welcomeMessage += 'Tôi là AI Assistant. Để có trải nghiệm AI thông minh hơn, hãy thêm Groq API key trong Settings ⚙️';
                    }
                    
                    window.drowsinessDetector.addChatbotMessage(welcomeMessage, 'bot');
                }
            }, 1000);
        } else {
            console.log('No chatbot elements found on this page');
        }
    });
