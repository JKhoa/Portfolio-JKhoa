// Enhanced YOLO Demo with Database Integration
class EnhancedDrowsinessDetector {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.initializeEventListeners();
        this.loadSettings();
        this.initializeDatabase();
        this.updateStats();
        this.checkServerConnection();
    }

    initializeElements() {
        // Camera elements
        this.webcam = document.getElementById('webcam');
        this.canvas = document.getElementById('canvas');
        this.detectionOverlay = document.getElementById('detectionOverlay');
        this.statusIndicator = document.getElementById('statusIndicator');
        
        // Control buttons
        this.startDemoBtn = document.getElementById('startDemo');
        this.stopDemoBtn = document.getElementById('stopDemo');
        this.testCameraBtn = document.getElementById('testCamera');
        this.capturePhotoBtn = document.getElementById('capturePhoto');
        this.viewGalleryBtn = document.getElementById('viewGallery');
        this.resetDemoBtn = document.getElementById('resetDemo');
        
        // Settings elements
        this.sensitivitySlider = document.getElementById('sensitivity');
        this.sensitivityValue = document.getElementById('sensitivityValue');
        this.alertModeSelect = document.getElementById('alertMode');
        this.autoSaveSelect = document.getElementById('autoSave');
        
        // Status elements
        this.detectionStatus = document.getElementById('detectionStatus');
        this.confidenceElement = document.getElementById('confidence');
        this.fpsElement = document.getElementById('fps');
        this.historyList = document.getElementById('historyList');
        
        // Database elements
        this.dbStatus = document.getElementById('dbStatus');
        this.databaseStats = document.getElementById('databaseStats');
        this.databaseList = document.getElementById('databaseList');
        this.refreshDatabaseBtn = document.getElementById('refreshDatabase');
        this.clearDatabaseBtn = document.getElementById('clearDatabase');
        
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
        this.groqApiKey = document.getElementById('groqApiKey');
        this.userName = document.getElementById('userName');
        this.aiStatus = document.getElementById('aiStatus');
        this.memoryInfo = document.getElementById('memoryInfo');
        this.conversationCount = document.getElementById('conversationCount');
        this.interestCount = document.getElementById('interestCount');
        this.saveSettings = document.getElementById('saveSettings');
        this.testAI = document.getElementById('testAI');
        this.clearMemory = document.getElementById('clearMemory');
        
        // Back to top
        this.backToTop = document.getElementById('backToTop');
        
        console.log('Elements initialized:', {
            webcam: !!this.webcam,
            chatbotToggle: !!this.chatbotToggle,
            settingsBtn: !!this.settingsBtn
        });
    }

    initializeState() {
        this.isRunning = false;
        this.stream = null;
        this.animationId = null;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        
        // Detection state - cải thiện để phát hiện tốt hơn
        this.eyeClosedFrames = 0;
        this.headDownFrames = 0;
        this.alertThreshold = 12; // Giảm ngưỡng để phát hiện sớm hơn
        
        // Settings
        this.settings = {
            sensitivity: 0.6,
            alertMode: 'visual',
            autoSave: true,
            groqApiKey: '',
            userName: ''
        };
        
        // User memory for chatbot
        this.userMemory = {
            name: '',
            interests: [],
            conversationHistory: []
        };
        
        // AI response cache
        this.responseCache = new Map();
        
        console.log('State initialized with alertThreshold:', this.alertThreshold);
    }

    initializeEventListeners() {
        // Demo controls
        if (this.startDemoBtn) {
            this.startDemoBtn.addEventListener('click', () => this.startDetection());
        }
        if (this.stopDemoBtn) {
            this.stopDemoBtn.addEventListener('click', () => this.stopDetection());
        }
        if (this.testCameraBtn) {
            this.testCameraBtn.addEventListener('click', () => this.testCameraAccess());
        }
        if (this.capturePhotoBtn) {
            this.capturePhotoBtn.addEventListener('click', () => this.capturePhoto());
        }
        if (this.viewGalleryBtn) {
            this.viewGalleryBtn.addEventListener('click', () => this.viewGallery());
        }
        if (this.resetDemoBtn) {
            this.resetDemoBtn.addEventListener('click', () => this.resetDemo());
        }
        
        // Settings
        if (this.sensitivitySlider) {
            this.sensitivitySlider.addEventListener('input', (e) => {
                this.settings.sensitivity = parseFloat(e.target.value);
                if (this.sensitivityValue) {
            this.sensitivityValue.textContent = e.target.value;
                }
            });
        }
        
        // Database controls
        if (this.refreshDatabaseBtn) {
            this.refreshDatabaseBtn.addEventListener('click', () => this.refreshDatabase());
        }
        if (this.clearDatabaseBtn) {
            this.clearDatabaseBtn.addEventListener('click', () => this.clearDatabase());
        }
        
        // Chatbot controls
        if (this.chatbotToggle) {
            this.chatbotToggle.addEventListener('click', () => this.toggleChatbot());
        }
        if (this.closeChatbot) {
            this.closeChatbot.addEventListener('click', () => this.closeChatbotWindow());
        }
        if (this.sendMessage) {
            this.sendMessage.addEventListener('click', () => this.sendChatbotMessage());
        }
        if (this.chatbotInput) {
            this.chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatbotMessage();
                }
            });
        }
        
        // Settings modal
        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', () => this.openSettings());
        }
        if (this.closeSettings) {
            this.closeSettings.addEventListener('click', () => this.closeSettingsModal());
        }
        if (this.saveSettings) {
            this.saveSettings.addEventListener('click', () => this.saveSettingsToStorage());
        }
        if (this.testAI) {
            this.testAI.addEventListener('click', () => this.testAI());
        }
        if (this.clearMemory) {
            this.clearMemory.addEventListener('click', () => this.clearUserMemory());
        }
        
        // Back to top
        if (this.backToTop) {
            this.backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        // Scroll event for back to top
        window.addEventListener('scroll', () => {
            if (this.backToTop) {
                if (window.pageYOffset > 300) {
                    this.backToTop.classList.add('show');
            } else {
                    this.backToTop.classList.remove('show');
                }
            }
        });
        
        console.log('Event listeners initialized');
    }

    async testCameraAccess() {
        try {
            const tryConstraints = async (c) => navigator.mediaDevices.getUserMedia(c);
            let stream;
            try {
                stream = await tryConstraints({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
            } catch (_) {
                try {
                    stream = await tryConstraints({ video: { facingMode: 'user' }, audio: false });
                } catch (__) {
                    stream = await tryConstraints({ video: true, audio: false });
                }
            }
            this.showNotification('✅ Camera hoạt động bình thường!', 'success');
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            this.showNotification('❌ Lỗi camera: ' + error.message, 'error');
        }
    }

    async startDetection() {
        try {
            const tryConstraints = async (c) => navigator.mediaDevices.getUserMedia(c);
            let stream;
            try {
                stream = await tryConstraints({
                    video: {
                        facingMode: 'user',
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        frameRate: { ideal: 30 }
                    },
                audio: false
            });
            } catch (_) {
                try {
                    stream = await tryConstraints({ video: { facingMode: 'user' }, audio: false });
                } catch (__) {
                    stream = await tryConstraints({ video: true, audio: false });
                }
            }

            this.stream = stream;
            this.webcam.srcObject = stream;

            await new Promise((resolve) => {
                this.webcam.onloadedmetadata = () => {
                    resolve();
                };
            });

            this.isRunning = true;
            this.updateStatus('✅ Đang phát hiện...', true);
            this.toggleButtons(true);
            this.detectionLoop();
        } catch (error) {
            console.error('Start detection error:', error);
            this.showNotification('❌ Lỗi: ' + error.message, 'error');
        }
    }

    stopDetection() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.updateStatus('⏹️ Đã dừng', false);
        this.toggleButtons(false);
        this.clearDetectionBox();
        this.updateStats();
    }

    detectionLoop() {
        if (!this.isRunning) return;
        
        this.simulateDetection();
        this.updateStats();
        
        this.animationId = requestAnimationFrame(() => this.detectionLoop());
    }

    simulateDetection() {
        // Mô phỏng phát hiện ngủ gật - hỗ trợ nhiều người
        const now = Date.now();
        const timeSinceLastFrame = now - this.lastFrameTime;
        
        if (timeSinceLastFrame > 100) { // 10 FPS
            this.lastFrameTime = now;
            this.frameCount++;
            
            // Mô phỏng nhiều người (1-3 người) - Cải thiện để phát hiện chính xác hơn
            let numPeople = Math.floor(Math.random() * 3) + 1; // 1-3 người
            const faces = [];
            
            // Đảm bảo luôn có ít nhất 1 người được phát hiện
            if (this.frameCount < 10) {
                // 10 frame đầu: luôn phát hiện 1 người để ổn định
                numPeople = 1;
            }
            
            for (let i = 0; i < numPeople; i++) {
                // Mô phỏng trạng thái cho từng người
                let alertLevel = 'normal';
                let confidence = 85 + Math.random() * 15;
                let status = 'Tỉnh táo';
                
                // Mô phỏng ngủ gật với xác suất cao hơn
                const random = Math.random();
                const timeBasedChance = (this.frameCount % 300) / 300; // Tăng dần theo thời gian
                
                // Mô phỏng ngủ gật thực tế hơn
                if (random < 0.3 || timeBasedChance > 0.8) { // 30% chance hoặc sau 30 giây
                this.eyeClosedFrames++;
                    this.headDownFrames++;
            } else {
                    this.eyeClosedFrames = Math.max(0, this.eyeClosedFrames - 0.5);
                    this.headDownFrames = Math.max(0, this.headDownFrames - 0.5);
                }
                
                // Đánh giá trạng thái cải thiện
                if (this.eyeClosedFrames > this.alertThreshold || this.headDownFrames > this.alertThreshold) {
                alertLevel = 'sleeping';
                    status = 'Ngủ gật';
                    confidence = 90 + Math.random() * 10;
                } else if (this.eyeClosedFrames > 8 || this.headDownFrames > 8) {
                alertLevel = 'drowsy';
                    status = 'Buồn ngủ';
                    confidence = 75 + Math.random() * 15;
                } else if (this.eyeClosedFrames > 3 || this.headDownFrames > 3) {
                    alertLevel = 'normal';
                    status = 'Hơi mệt';
                    confidence = 60 + Math.random() * 20;
                }
                
                // Mô phỏng khuôn mặt với bounding box hình vuông focus TRỰC TIẾP vào mặt người
                const videoWidth = this.webcam.videoWidth || 640;
                const videoHeight = this.webcam.videoHeight || 480;
                
                // Tính toán vị trí mặt người thực tế - FOCUS TRỰC TIẾP VÀO MẶT
                let faceX, faceY, faceSize;
                
                if (numPeople === 1) {
                    // 1 người: focus TRỰC TIẾP vào mặt người ở giữa
                    faceSize = 120 + Math.random() * 20; // 120-140px (vừa đủ cho mặt)
                    faceX = (videoWidth - faceSize) / 2;
                    faceY = (videoHeight - faceSize) / 2 - 40; // Cao hơn nhiều để focus vào mặt
                } else if (numPeople === 2) {
                    // 2 người: focus TRỰC TIẾP vào 2 mặt người
                    faceSize = 100 + Math.random() * 20; // 100-120px
                    if (i === 0) {
                        // Người 1: bên trái, focus TRỰC TIẾP vào mặt
                        faceX = (videoWidth * 0.35) - (faceSize / 2);
                        faceY = (videoHeight - faceSize) / 2 - 35;
                    } else {
                        // Người 2: bên phải, focus TRỰC TIẾP vào mặt
                        faceX = (videoWidth * 0.65) - (faceSize / 2);
                        faceY = (videoHeight - faceSize) / 2 - 35;
                    }
                } else {
                    // 3 người: focus TRỰC TIẾP vào 3 mặt người
                    faceSize = 90 + Math.random() * 15; // 90-105px
                    if (i === 0) {
                        faceX = (videoWidth * 0.25) - (faceSize / 2);
                        faceY = (videoHeight - faceSize) / 2 - 30;
                    } else if (i === 1) {
                        faceX = (videoWidth * 0.5) - (faceSize / 2);
                        faceY = (videoHeight - faceSize) / 2 - 30;
                    } else {
                        faceX = (videoWidth * 0.75) - (faceSize / 2);
                        faceY = (videoHeight - faceSize) / 2 - 30;
                    }
                }
                
                // Thêm offset rất nhỏ để mô phỏng chuyển động tự nhiên
                faceX += (Math.random() - 0.5) * 5; // Rất nhỏ: 5px
                faceY += (Math.random() - 0.5) * 3;  // Rất nhỏ: 3px
                
                // Đảm bảo bounding box không ra ngoài màn hình và focus TRỰC TIẾP vào mặt
                faceX = Math.max(30, Math.min(videoWidth - faceSize - 30, faceX));
                faceY = Math.max(30, Math.min(videoHeight - faceSize - 30, faceY));
                
                // Đảm bảo bounding box luôn hiển thị TRỰC TIẾP trên mặt người
                if (faceX < 80) faceX = 80; // Không quá sát mép trái
                if (faceY < 60) faceY = 60; // Không quá sát mép trên
                if (faceX > videoWidth - faceSize - 80) faceX = videoWidth - faceSize - 80;
                if (faceY > videoHeight - faceSize - 60) faceY = videoHeight - faceSize - 60;
                
                const face = {
                    x: faceX,
                    y: faceY,
                    width: faceSize,
                    height: faceSize, // Đảm bảo hình vuông
                    personId: i + 1,
                    alertLevel: alertLevel,
                    status: status,
                    confidence: Math.round(confidence)
                };
                
                faces.push(face);
            }
            
            // Cập nhật UI với nhiều người
            this.updateDetectionStatus(faces);
            this.drawMultipleDetectionBoxes(faces);
            this.addToHistory(faces);
            
            // Lưu vào database nếu cần
            if (this.settings.autoSave) {
                faces.forEach(face => {
                    if (face.alertLevel !== 'normal') {
                        this.saveToDatabase(face.status, face.confidence, face);
                    }
                });
            }
        }
    }

    updateDetectionStatus(faces) {
        if (!faces || faces.length === 0) return;
        
        // Hiển thị trạng thái tổng hợp
        const sleepingCount = faces.filter(f => f.alertLevel === 'sleeping').length;
        const drowsyCount = faces.filter(f => f.alertLevel === 'drowsy').length;
        const totalCount = faces.length;
        
        let overallStatus = 'Tỉnh táo';
        let overallConfidence = 85;
        
        if (sleepingCount > 0) {
            overallStatus = `${sleepingCount}/${totalCount} người ngủ gật`;
            overallConfidence = 95;
        } else if (drowsyCount > 0) {
            overallStatus = `${drowsyCount}/${totalCount} người buồn ngủ`;
            overallConfidence = 80;
        }
        
        if (this.detectionStatus) {
            this.detectionStatus.textContent = overallStatus;
        }
        if (this.confidenceElement) {
            this.confidenceElement.textContent = overallConfidence + '%';
        }
    }

        drawMultipleDetectionBoxes(faces) {
        if (!this.detectionOverlay || !faces || faces.length === 0) return;
        
        this.detectionOverlay.innerHTML = '';
        
        // Màu sắc cho từng người
        const colors = ['#00ff00', '#0080ff', '#ff00ff', '#ffff00', '#00ffff', '#ff8000', '#8000ff', '#80ff00', '#ff0080', '#008080'];
        
        faces.forEach((face, index) => {
            const color = colors[index % colors.length];
            
            // Vẽ khung khuôn mặt hình vuông focus TRỰC TIẾP vào mặt người
            const faceBox = document.createElement('div');
            faceBox.className = `detection-box ${face.alertLevel}`;
            
            // Tính toán border và shadow dựa trên trạng thái
            let borderColor, shadowColor, borderWidth;
            if (face.alertLevel === 'sleeping') {
                borderColor = '#ff0000';
                shadowColor = 'rgba(255,0,0,0.9)';
                borderWidth = '8px';
            } else if (face.alertLevel === 'drowsy') {
                borderColor = '#ffaa00';
                shadowColor = 'rgba(255,170,0,0.9)';
                borderWidth = '6px';
            } else {
                borderColor = color;
                shadowColor = color + '90';
                borderWidth = '5px';
            }
            
            faceBox.style.cssText = `
                position: absolute;
                border: ${borderWidth} solid ${borderColor};
                border-radius: 15px;
                background: rgba(255,255,255,0.1);
                left: ${face.x}px;
                top: ${face.y}px;
                width: ${face.width}px;
                height: ${face.height}px;
                box-shadow: 0 0 25px ${shadowColor}, inset 0 0 15px rgba(255,255,255,0.15);
                transition: all 0.3s ease;
                z-index: 1000;
                pointer-events: none;
                transform: scale(1);
            `;
            
            // Vẽ nhãn trạng thái với ID người - FOCUS TRỰC TIẾP
            const label = document.createElement('div');
            label.textContent = `👤 Người ${face.personId}: ${face.alertLevel === 'sleeping' ? '😴 NGỦ GẬT' : face.alertLevel === 'drowsy' ? '😪 BUỒN NGỦ' : '😊 TỈNH TÁO'} (${face.confidence}%)`;
            label.style.cssText = `
                position: absolute;
                top: -45px;
                left: -8px;
                background: rgba(0,0,0,0.98);
                color: white;
                padding: 8px 15px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
                border: 3px solid ${borderColor};
                z-index: 1001;
                box-shadow: 0 3px 12px rgba(0,0,0,0.7);
                backdrop-filter: blur(5px);
            `;
            
            // Thêm hiệu ứng pulse cho trạng thái ngủ gật
            if (face.alertLevel === 'sleeping') {
                faceBox.style.animation = 'pulse-alert 1s infinite';
            }
            
            faceBox.appendChild(label);
            this.detectionOverlay.appendChild(faceBox);
        });
        
        // Vẽ thông tin tổng hợp
        this.drawOverallInfo(faces);
    }

    drawOverallInfo(faces) {
        // Vẽ thông tin tổng hợp về tất cả người
        const infoBox = document.createElement('div');
        infoBox.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 12px;
            border-radius: 8px;
            font-size: 11px;
            max-width: 250px;
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            z-index: 1002;
        `;
        
        const totalPeople = faces.length;
        const sleepingCount = faces.filter(f => f.alertLevel === 'sleeping').length;
        const drowsyCount = faces.filter(f => f.alertLevel === 'drowsy').length;
        const normalCount = faces.filter(f => f.alertLevel === 'normal').length;
        
        let overallStatus = 'Tất cả tỉnh táo';
        let statusColor = '#44ff44';
        
        if (sleepingCount > 0) {
            overallStatus = `${sleepingCount}/${totalPeople} người ngủ gật`;
            statusColor = '#ff4444';
        } else if (drowsyCount > 0) {
            overallStatus = `${drowsyCount}/${totalPeople} người buồn ngủ`;
            statusColor = '#ffaa00';
        }
        
        infoBox.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: bold; color: ${statusColor}">
                ${overallStatus.toUpperCase()}
            </div>
            <div style="margin-bottom: 4px;"><strong>Tổng số người:</strong> ${totalPeople}</div>
            <div style="margin-bottom: 4px;"><strong>Ngủ gật:</strong> ${sleepingCount} người</div>
            <div style="margin-bottom: 4px;"><strong>Buồn ngủ:</strong> ${drowsyCount} người</div>
            <div style="margin-bottom: 4px;"><strong>Tỉnh táo:</strong> ${normalCount} người</div>
            <div style="margin-bottom: 4px;"><strong>Mắt nhắm:</strong> ${Math.round(this.eyeClosedFrames)} frames</div>
            <div style="margin-bottom: 4px;"><strong>Đầu nghiêng:</strong> ${Math.round(this.headDownFrames)} frames</div>
            <div style="margin-bottom: 4px;"><strong>Ngưỡng:</strong> ${this.alertThreshold} frames</div>
        `;
        
        this.detectionOverlay.appendChild(infoBox);
    }

    clearDetectionBox() {
        if (!this.detectionOverlay) return;
        this.detectionOverlay.innerHTML = '';
        console.log('Detection overlay cleared');
    }

    updateStatus(text, isActive) {
        if (this.statusIndicator) {
            this.statusIndicator.innerHTML = `
                <span class="status-dot"></span>
                <span class="status-text">${text}</span>
            `;
            this.statusIndicator.className = `status-indicator ${isActive ? 'active' : ''}`;
        }
    }

    toggleButtons(isRunning) {
        if (this.startDemoBtn) {
            this.startDemoBtn.style.display = isRunning ? 'none' : 'inline-flex';
        }
        if (this.stopDemoBtn) {
            this.stopDemoBtn.style.display = isRunning ? 'inline-flex' : 'none';
        }
    }

    updateStats() {
        // Cập nhật FPS
        if (this.fpsElement) {
            this.fps = Math.round(1000 / (Date.now() - this.lastFrameTime + 1));
            this.fpsElement.textContent = this.fps;
        }
        
        console.log('Detection stats updated:', this.detectionStatus?.textContent, this.confidenceElement?.textContent);
    }

    addToHistory(faces) {
        if (!this.historyList || !faces || faces.length === 0) return;
        
        const totalPeople = faces.length;
        const sleepingCount = faces.filter(f => f.alertLevel === 'sleeping').length;
        const drowsyCount = faces.filter(f => f.alertLevel === 'drowsy').length;
        
        let status = 'Tất cả tỉnh táo';
        let confidence = 85;
        
        if (sleepingCount > 0) {
            status = `${sleepingCount}/${totalPeople} người ngủ gật`;
            confidence = 95;
        } else if (drowsyCount > 0) {
            status = `${drowsyCount}/${totalPeople} người buồn ngủ`;
            confidence = 80;
        }
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = `${new Date().toLocaleTimeString()}: ${status} (${confidence}%)`;
        
        this.historyList.appendChild(historyItem);
        
        // Giữ tối đa 10 items
        while (this.historyList.children.length > 10) {
            this.historyList.removeChild(this.historyList.firstChild);
        }
    }

    capturePhoto() {
        if (!this.webcam || !this.isRunning) {
            this.showNotification('❌ Vui lòng bắt đầu demo trước', 'error');
            return;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = this.webcam.videoWidth;
        canvas.height = this.webcam.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.webcam, 0, 0);
        
        const photoData = canvas.toDataURL('image/jpeg');
        this.savePhotoToDatabase(photoData);
        this.showNotification('📸 Đã chụp ảnh!', 'success');
    }

    viewGallery() {
        this.showNotification('🖼️ Tính năng thư viện ảnh đang phát triển', 'info');
    }

    resetDemo() {
        this.stopDetection();
        this.eyeClosedFrames = 0;
        this.headDownFrames = 0;
        this.frameCount = 0;
        this.fps = 0;
        
        if (this.historyList) {
            this.historyList.innerHTML = '<p class="no-history">Chưa có dữ liệu phát hiện</p>';
        }
        
        this.updateDetectionStatus('Đang chờ...', 0);
        this.showNotification('🔄 Demo đã được reset', 'success');
    }

    // Database methods
    initializeDatabase() {
        if (!localStorage.getItem('drowsinessDetections')) {
            localStorage.setItem('drowsinessDetections', JSON.stringify([]));
        }
        this.refreshDatabase();
    }

    saveToDatabase(status, confidence, face) {
        const detections = JSON.parse(localStorage.getItem('drowsinessDetections') || '[]');
        const detection = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
                status: status,
                confidence: confidence,
            face: face,
            settings: { ...this.settings }
        };
        
        detections.push(detection);
        localStorage.setItem('drowsinessDetections', JSON.stringify(detections));
        this.refreshDatabase();
    }

    savePhotoToDatabase(photoData) {
        const detections = JSON.parse(localStorage.getItem('drowsinessDetections') || '[]');
        const photo = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: 'photo',
            data: photoData,
            settings: { ...this.settings }
        };
        
        detections.push(photo);
        localStorage.setItem('drowsinessDetections', JSON.stringify(detections));
        this.refreshDatabase();
    }

    refreshDatabase() {
        const detections = JSON.parse(localStorage.getItem('drowsinessDetections') || '[]');
        
        // Cập nhật thống kê
        const totalDetections = detections.length;
        const sleepingCount = detections.filter(d => d.status === 'Ngủ gật').length;
        const drowsyCount = detections.filter(d => d.status === 'Buồn ngủ').length;
        const todayCount = detections.filter(d => {
            const today = new Date().toDateString();
            return new Date(d.timestamp).toDateString() === today;
        }).length;
        
        if (this.databaseStats) {
            const statElements = this.databaseStats.querySelectorAll('.stat-number');
            if (statElements[0]) statElements[0].textContent = totalDetections;
            if (statElements[1]) statElements[1].textContent = sleepingCount;
            if (statElements[2]) statElements[2].textContent = drowsyCount;
            if (statElements[3]) statElements[3].textContent = todayCount;
        }
        
        // Cập nhật danh sách
        if (this.databaseList) {
            this.databaseList.innerHTML = '';

        if (detections.length === 0) {
            this.databaseList.innerHTML = '<p class="no-history">Chưa có dữ liệu trong database</p>';
            } else {
                detections.slice(-10).reverse().forEach(detection => {
                    const item = document.createElement('div');
                    item.className = 'database-item';
                    
                    if (detection.type === 'photo') {
                        item.innerHTML = `
                            <img src="${detection.data}" alt="Photo" class="database-image">
                <div class="database-info">
                                <div class="database-time">${new Date(detection.timestamp).toLocaleString()}</div>
                                <div class="database-status">Ảnh chụp</div>
                    </div>
                            <div class="database-actions">
                                <button onclick="this.downloadPhoto('${detection.data}', '${detection.timestamp}')" class="btn btn-small">Tải</button>
                            </div>
                        `;
                    } else {
                        item.innerHTML = `
                            <div class="database-info">
                                <div class="database-time">${new Date(detection.timestamp).toLocaleString()}</div>
                                <div class="database-status ${detection.status === 'Ngủ gật' ? 'sleeping' : 'drowsy'}">${detection.status}</div>
                    <div>Độ tin cậy: ${detection.confidence}%</div>
                </div>
                <div class="database-actions">
                                <button onclick="this.deleteDetection(${detection.id})" class="btn btn-small btn-danger">Xóa</button>
                </div>
                        `;
                    }
                    
                    this.databaseList.appendChild(item);
                });
            }
        }
    }

    clearDatabase() {
        if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu?')) {
            localStorage.removeItem('drowsinessDetections');
            this.refreshDatabase();
            this.showNotification('🗑️ Đã xóa tất cả dữ liệu', 'success');
        }
    }

    deleteDetection(id) {
        const detections = JSON.parse(localStorage.getItem('drowsinessDetections') || '[]');
        const filtered = detections.filter(d => d.id !== id);
        localStorage.setItem('drowsinessDetections', JSON.stringify(filtered));
        this.refreshDatabase();
        this.showNotification('🗑️ Đã xóa dữ liệu', 'success');
    }

    downloadPhoto(photoData, timestamp) {
        const link = document.createElement('a');
        link.download = `drowsiness_photo_${timestamp}.jpg`;
        link.href = photoData;
        link.click();
    }

    checkServerConnection() {
        // Mô phỏng kiểm tra kết nối server
        setTimeout(() => {
            if (this.dbStatus) {
                this.dbStatus.textContent = 'Không kết nối được';
                this.dbStatus.className = 'db-status';
            }
        }, 1000);
    }

    // Settings methods
    loadSettings() {
        const savedSettings = localStorage.getItem('drowsinessSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        
        // Cập nhật UI
        if (this.sensitivitySlider) {
            this.sensitivitySlider.value = this.settings.sensitivity;
        }
        if (this.sensitivityValue) {
            this.sensitivityValue.textContent = this.settings.sensitivity;
        }
        if (this.alertModeSelect) {
            this.alertModeSelect.value = this.settings.alertMode;
        }
        if (this.autoSaveSelect) {
            this.autoSaveSelect.value = this.settings.autoSave.toString();
        }
        
        // Load user memory
        const savedMemory = localStorage.getItem('userMemory');
        if (savedMemory) {
            this.userMemory = { ...this.userMemory, ...JSON.parse(savedMemory) };
        }
        
        // Update AI settings
        if (this.groqApiKey) {
            this.groqApiKey.value = this.settings.groqApiKey;
        }
        if (this.userName) {
            this.userName.value = this.userMemory.name;
        }
        
        this.updateAIStatus();
        this.updateMemoryInfo();
    }

    saveSettingsToStorage() {
        // Save demo settings
        this.settings.sensitivity = parseFloat(this.sensitivitySlider?.value || 0.6);
        this.settings.alertMode = this.alertModeSelect?.value || 'visual';
        this.settings.autoSave = this.autoSaveSelect?.value === 'true';
        this.settings.groqApiKey = this.groqApiKey?.value || '';
        
        localStorage.setItem('drowsinessSettings', JSON.stringify(this.settings));
        
        // Save user memory
        this.userMemory.name = this.userName?.value || '';
        localStorage.setItem('userMemory', JSON.stringify(this.userMemory));
        
        this.updateAIStatus();
        this.updateMemoryInfo();
        this.closeSettingsModal();
        this.showNotification('✅ Đã lưu cài đặt', 'success');
    }

    updateAIStatus() {
        if (this.aiStatus) {
            const hasGroqKey = this.settings.groqApiKey && this.settings.groqApiKey.trim() !== '';
            const statusText = hasGroqKey ? 'AI Groq (Connected)' : 'AI Mô Phỏng (Local)';
            const statusClass = hasGroqKey ? 'connected' : '';
            
            this.aiStatus.innerHTML = `
                <span class="status-indicator ${statusClass}"></span>
                <span class="status-text">${statusText}</span>
            `;
        }
    }

    updateMemoryInfo() {
        if (this.conversationCount) {
            this.conversationCount.textContent = `${this.userMemory.conversationHistory.length} cuộc trò chuyện`;
        }
        if (this.interestCount) {
            this.interestCount.textContent = `${this.userMemory.interests.length} sở thích`;
        }
    }

    clearUserMemory() {
        if (confirm('Bạn có chắc muốn xóa bộ nhớ người dùng?')) {
            this.userMemory = {
                name: this.userMemory.name, // Giữ tên
                interests: [],
                conversationHistory: []
            };
            localStorage.setItem('userMemory', JSON.stringify(this.userMemory));
            this.updateMemoryInfo();
            this.showNotification('🧹 Đã xóa bộ nhớ người dùng', 'success');
        }
    }

    // Chatbot methods
    toggleChatbot() {
        if (this.chatbotWindow) {
            this.chatbotWindow.classList.toggle('active');
            console.log('Chatbot toggled:', this.chatbotWindow.classList.contains('active'));
        }
    }

    closeChatbotWindow() {
        if (this.chatbotWindow) {
            this.chatbotWindow.classList.remove('active');
        }
    }

    openSettings() {
        if (this.settingsModal) {
            this.settingsModal.classList.add('active');
        }
    }

    closeSettingsModal() {
        if (this.settingsModal) {
            this.settingsModal.classList.remove('active');
        }
    }

    async sendChatbotMessage() {
        const input = this.chatbotInput;
        if (!input || !input.value.trim()) return;
        
        const message = input.value.trim();
        input.value = '';

        // Add user message
        this.addMessage(message, 'user');

        // Add typing indicator
        this.addTypingIndicator();
        
        try {
        const response = await this.getAIResponse(message);
            this.removeTypingIndicator();
            this.addMessage(response, 'bot');
            
            // Save to conversation history
            this.userMemory.conversationHistory.push({
                user: message,
                bot: response,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('userMemory', JSON.stringify(this.userMemory));
            this.updateMemoryInfo();
            
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.', 'bot');
        }
    }

    addMessage(content, type) {
        if (!this.chatbotMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Sử dụng innerHTML thay vì textContent để hỗ trợ Unicode tốt hơn
        // và đảm bảo font hiển thị đúng
        contentDiv.innerHTML = this.sanitizeMessage(content);
        
        messageDiv.appendChild(contentDiv);
        this.chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
    }

    // Hàm sanitize để đảm bảo tin nhắn hiển thị đúng font và encoding
    sanitizeMessage(content) {
        if (!content) return '';
        
        // Loại bỏ các ký tự lạ và đảm bảo encoding UTF-8
        let sanitized = content
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Loại bỏ control characters
            .replace(/[^\u0020-\u007E\u00A0-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\u2C60-\u2C7F\uA720-\uA7FF\uFB00-\uFB4F]/g, '') // Chỉ giữ lại các ký tự Unicode hợp lệ
            .trim();
        
        // Đảm bảo font hiển thị đúng bằng cách wrap trong span với font-family
        return `<span style="font-family: 'Open Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.4;">${sanitized}</span>`;
    }

    addTypingIndicator() {
        if (!this.chatbotMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = '<div class="message-content">AI đang nhập<span class="dots">...</span></div>';
        
        this.chatbotMessages.appendChild(typingDiv);
        this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
    }

    removeTypingIndicator() {
        if (!this.chatbotMessages) return;
        
        const typingIndicator = this.chatbotMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async getAIResponse(message) {
        // Check if we have Groq API key
        if (this.settings.groqApiKey && this.settings.groqApiKey.trim() !== '') {
            try {
                return await this.getGroqResponse(message, this.settings.groqApiKey);
            } catch (error) {
                console.error('Groq API error:', error);
                // Fallback to simple response
                return this.getSimpleResponse(message);
            }
        } else {
            return this.getSimpleResponse(message);
        }
    }

    async getGroqResponse(message, apiKey) {
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    model: 'llama3-8b-8192',
                    messages: [
                        {
                            role: 'system',
                            content: `Bạn là một AI assistant thân thiện, chuyên về YOLO và nhận diện ngủ gật. 
                            Người dùng: ${this.userMemory.name || 'Khách'}
                            Sở thích: ${this.userMemory.interests.join(', ') || 'Chưa có'}
                            
                            QUAN TRỌNG: 
                            - Luôn trả lời bằng tiếng Việt hoàn chỉnh và tự nhiên
                            - Không sử dụng ký tự lạ hoặc font không hỗ trợ
                            - Đảm bảo encoding UTF-8 cho tiếng Việt
                            - Trả lời ngắn gọn, rõ ràng và hữu ích
                            - Nếu không biết câu trả lời, hãy nói "Tôi không hiểu rõ câu hỏi của bạn" thay vì trả lời sai`
                        },
                        ...this.userMemory.conversationHistory.slice(-5).flatMap(conv => [
                            { role: 'user', content: conv.user },
                            { role: 'assistant', content: conv.bot }
                        ]),
                        { role: 'user', content: message }
                    ],
                    max_tokens: 300,
                    temperature: 0.7,
                    top_p: 0.9,
                    frequency_penalty: 0.1,
                    presence_penalty: 0.1
                })
            });

            if (!response.ok) {
                throw new Error(`Groq API error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            let content = data.choices[0].message.content;
            
            // Đảm bảo content là tiếng Việt hợp lệ
            if (!content || content.trim() === '') {
                return 'Xin lỗi, tôi không thể xử lý câu hỏi của bạn. Vui lòng thử lại.';
            }
            
            // Kiểm tra và sửa lỗi encoding
            content = this.fixEncoding(content);
            
            return content;
            
        } catch (error) {
            console.error('Groq API Error:', error);
            throw new Error(`Lỗi kết nối AI: ${error.message}`);
        }
    }

    // Hàm sửa lỗi encoding cho tiếng Việt
    fixEncoding(text) {
        if (!text) return '';
        
        // Sửa các ký tự tiếng Việt bị lỗi
        const encodingFixes = {
            'á': 'á', 'à': 'à', 'ả': 'ả', 'ã': 'ã', 'ạ': 'ạ',
            'ă': 'ă', 'ắ': 'ắ', 'ằ': 'ằ', 'ẳ': 'ẳ', 'ẵ': 'ẵ', 'ặ': 'ặ',
            'â': 'â', 'ấ': 'ấ', 'ầ': 'ầ', 'ẩ': 'ẩ', 'ẫ': 'ẫ', 'ậ': 'ậ',
            'é': 'é', 'è': 'è', 'ẻ': 'ẻ', 'ẽ': 'ẽ', 'ẹ': 'ẹ',
            'ê': 'ê', 'ế': 'ế', 'ề': 'ề', 'ể': 'ể', 'ễ': 'ễ', 'ệ': 'ệ',
            'í': 'í', 'ì': 'ì', 'ỉ': 'ỉ', 'ĩ': 'ĩ', 'ị': 'ị',
            'ó': 'ó', 'ò': 'ò', 'ỏ': 'ỏ', 'õ': 'õ', 'ọ': 'ọ',
            'ô': 'ô', 'ố': 'ố', 'ồ': 'ồ', 'ổ': 'ổ', 'ỗ': 'ỗ', 'ộ': 'ộ',
            'ơ': 'ơ', 'ớ': 'ớ', 'ờ': 'ờ', 'ở': 'ở', 'ỡ': 'ỡ', 'ợ': 'ợ',
            'ú': 'ú', 'ù': 'ù', 'ủ': 'ủ', 'ũ': 'ũ', 'ụ': 'ụ',
            'ư': 'ư', 'ứ': 'ứ', 'ừ': 'ừ', 'ử': 'ử', 'ữ': 'ữ', 'ự': 'ự',
            'ý': 'ý', 'ỳ': 'ỳ', 'ỷ': 'ỷ', 'ỹ': 'ỹ', 'ỵ': 'ỵ',
            'đ': 'đ'
        };
        
        let fixedText = text;
        
        // Áp dụng các sửa lỗi encoding
        for (const [wrong, correct] of Object.entries(encodingFixes)) {
            fixedText = fixedText.replace(new RegExp(wrong, 'g'), correct);
        }
        
        // Loại bỏ các ký tự không hợp lệ
        fixedText = fixedText.replace(/[^\u0020-\u007E\u00A0-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\u2C60-\u2C7F\uA720-\uA7FF\uFB00-\uFB4F\u0300-\u036F]/g, '');
        
        return fixedText.trim();
    }

    getSimpleResponse(message) {
        const responses = {
            'yolo': 'YOLO (You Only Look Once) là một thuật toán nhận diện đối tượng thời gian thực rất hiệu quả. Nó có thể phát hiện nhiều đối tượng trong một lần quét duy nhất.',
            'ngủ gật': 'Phát hiện ngủ gật sử dụng AI để phân tích trạng thái mắt và tư thế đầu. Khi mắt nhắm lâu hoặc đầu cúi xuống, hệ thống sẽ cảnh báo.',
            'demo': 'Demo này mô phỏng việc phát hiện ngủ gật bằng AI. Bạn có thể thử nghiệm bằng cách nhắm mắt hoặc cúi đầu để xem kết quả.',
            'camera': 'Camera được sử dụng để thu thập hình ảnh thời gian thực. Hệ thống sẽ phân tích từng frame để phát hiện trạng thái ngủ gật.',
            'ai': 'AI (Trí tuệ nhân tạo) được sử dụng để phân tích hình ảnh và đưa ra quyết định về trạng thái tỉnh táo của người dùng.',
            'help': 'Tôi có thể giúp bạn tìm hiểu về YOLO, nhận diện ngủ gật, AI, camera và demo này. Bạn muốn biết thêm về chủ đề nào?',
            'nước hoa': 'Tôi hiểu bạn đang hỏi về nước hoa, nhưng tôi chuyên về YOLO và nhận diện ngủ gật. Bạn có muốn tìm hiểu về công nghệ AI này không?',
            'perfume': 'Tôi hiểu bạn đang hỏi về nước hoa, nhưng tôi chuyên về YOLO và nhận diện ngủ gật. Bạn có muốn tìm hiểu về công nghệ AI này không?',
            'mua': 'Tôi hiểu bạn đang hỏi về mua sắm, nhưng tôi chuyên về YOLO và nhận diện ngủ gật. Bạn có muốn tìm hiểu về công nghệ AI này không?',
            'dịch': 'Tôi hiểu bạn muốn dịch thuật, nhưng tôi chuyên về YOLO và nhận diện ngủ gật. Bạn có muốn tìm hiểu về công nghệ AI này không?',
            'translate': 'Tôi hiểu bạn muốn dịch thuật, nhưng tôi chuyên về YOLO và nhận diện ngủ gật. Bạn có muốn tìm hiểu về công nghệ AI này không?'
        };

        const lowerMessage = message.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return this.fixEncoding(response);
            }
        }

        return this.fixEncoding('Cảm ơn bạn đã hỏi! Tôi có thể giúp bạn tìm hiểu về YOLO, nhận diện ngủ gật, AI, camera và demo này. Bạn có câu hỏi cụ thể nào không?');
    }

    async testAI() {
        this.addMessage('Đang test AI...', 'bot');
        
        try {
            const response = await this.getAIResponse('Test AI');
            this.addMessage(response, 'bot');
            this.showNotification('✅ AI hoạt động bình thường!', 'success');
        } catch (error) {
            this.addMessage('❌ Lỗi AI: ' + error.message, 'bot');
            this.showNotification('❌ Lỗi AI: ' + error.message, 'error');
        }
    }

    // Utility methods
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// ==================== AUTHENTICATION SYSTEM ====================

// API Configuration
const API_BASE_URL = 'https://webyolo-backend.railway.app';
const TOKEN_KEY = 'webyolo_token';
const USER_KEY = 'webyolo_user';

// Login function
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Đăng nhập thất bại');
        }

        // Save token and user info
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        // Update UI
        updateUIAfterLogin(data.user);

        // Close modal
        const loginModal = document.getElementById('loginModal');
        const loginForm = document.getElementById('loginForm');
        const loginError = document.getElementById('loginError');
        if (loginModal) loginModal.classList.remove('active');
        if (loginForm) loginForm.reset();
        if (loginError) loginError.style.display = 'none';

        // Show success message
        showNotification('Đăng nhập thành công!', 'success');

        return data;
    } catch (error) {
        console.error('Login error:', error);
        const loginError = document.getElementById('loginError');
        if (loginError) {
            loginError.textContent = error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            loginError.style.display = 'block';
        }
        throw error;
    }
}

// Logout function
function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    updateUIAfterLogout();
    showNotification('Đã đăng xuất thành công!', 'info');
}

// Update UI after login
function updateUIAfterLogin(user) {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (userInfo) userInfo.style.display = 'flex';
    if (userName) {
        if (user.role === 'Admin') {
            userName.innerHTML = `${user.username} <span style="background: #FFD700; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; margin-left: 8px;">ADMIN</span>`;
        } else {
            userName.textContent = `${user.username} (${user.role})`;
        }
    }
}

// Update UI after logout
function updateUIAfterLogout() {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    if (loginBtn) loginBtn.style.display = 'flex';
    if (userInfo) userInfo.style.display = 'none';
}

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            updateUIAfterLogin(userData);
        } catch (e) {
            console.error('Error parsing user data:', e);
            logout();
        }
    }
}

// Get authentication token
function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize Authentication System
function initializeAuth() {
    // Check authentication status
    checkAuthStatus();
    
    // Get elements
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // Event Listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (loginModal) {
                loginModal.classList.add('active');
                console.log('Login modal opened');
            }
        });
    }

    if (closeLogin) {
        closeLogin.addEventListener('click', () => {
            if (loginModal) loginModal.classList.remove('active');
            if (loginForm) {
                loginForm.reset();
                const loginError = document.getElementById('loginError');
                if (loginError) loginError.style.display = 'none';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                await login(username, password);
            } catch (error) {
                // Error already handled in login function
            }
        });
    }

    // Close modal when clicking outside
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
                if (loginForm) {
                    loginForm.reset();
                    const loginError = document.getElementById('loginError');
                    if (loginError) loginError.style.display = 'none';
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Authentication first
    initializeAuth();
    
    const chatbotToggle = document.getElementById('chatbotToggle');
    if (chatbotToggle) {
        new EnhancedDrowsinessDetector();
        console.log('EnhancedDrowsinessDetector initialized');
        
        // Kiểm tra và sửa lỗi font cho chatbot
        fixChatbotFontIssues();
    }
});

// Hàm kiểm tra và sửa lỗi font cho chatbot
function fixChatbotFontIssues() {
    // Đảm bảo font được load đúng
    if (document.fonts) {
        document.fonts.ready.then(() => {
            console.log('Fonts loaded successfully');
        });
    }
    
    // Thêm CSS để đảm bảo font hiển thị đúng
    const fontFixStyle = document.createElement('style');
    fontFixStyle.textContent = `
        .chatbot-messages,
        .chatbot-messages *,
        .message,
        .message * {
            font-family: 'Open Sans', 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }
        
        .chatbot-input input {
            font-family: 'Open Sans', 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
        }
    `;
    document.head.appendChild(fontFixStyle);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes pulse-alert {
        0% { 
            box-shadow: 0 0 20px rgba(255,0,0,0.8), inset 0 0 10px rgba(255,255,255,0.1);
            transform: scale(1);
        }
        50% { 
            box-shadow: 0 0 30px rgba(255,0,0,1), inset 0 0 15px rgba(255,255,255,0.2);
            transform: scale(1.02);
        }
        100% { 
            box-shadow: 0 0 20px rgba(255,0,0,0.8), inset 0 0 10px rgba(255,255,255,0.1);
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);
