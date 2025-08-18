# 👁️ Hướng Dẫn Tích Hợp Face Detection Thực Sự

## 🎯 **Vấn Đề Hiện Tại:**

Từ ảnh chụp màn hình, hệ thống hiện tại chỉ là **mô phỏng** và chưa thực sự:
- ❌ Nhận diện khuôn mặt thực tế
- ❌ Phân tích trạng thái mắt (mở/đóng)
- ❌ Phát hiện tư thế đầu (nghiêng/cúi)
- ❌ Đánh giá chính xác trạng thái tỉnh táo/ngủ gật

## 🚀 **Giải Pháp: Tích Hợp Thư Viện Face Detection**

### **1. MediaPipe Face Mesh (Khuyến Nghị)**

MediaPipe là thư viện của Google, miễn phí và chính xác cao:

```html
<!-- Thêm vào index.html -->
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils"></script>
```

**Ưu điểm:**
- ✅ Nhận diện 468 điểm trên khuôn mặt
- ✅ Phân tích tư thế đầu chính xác
- ✅ Phát hiện mắt, mũi, miệng
- ✅ Hoạt động real-time
- ✅ Miễn phí và open source

### **2. Face-API.js**

Thư viện dựa trên TensorFlow.js:

```html
<!-- Thêm vào index.html -->
<script src="https://cdn.jsdelivr.net/npm/face-api.js"></script>
```

**Ưu điểm:**
- ✅ Nhận diện khuôn mặt và landmarks
- ✅ Phân tích biểu cảm
- ✅ Tuổi và giới tính
- ✅ Hoạt động offline

### **3. OpenCV.js**

Thư viện computer vision mạnh mẽ:

```html
<!-- Thêm vào index.html -->
<script src="https://docs.opencv.org/4.5.4/opencv.js"></script>
```

## 🔧 **Implementation với MediaPipe**

### **Bước 1: Cài Đặt Dependencies**

```html
<!-- Trong index.html -->
<head>
    <!-- Existing code -->
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils"></script>
</head>
```

### **Bước 2: Tích Hợp Vào JavaScript**

```javascript
// Trong script_enhanced.js
class EnhancedDrowsinessDetector {
    constructor() {
        // Existing code...
        this.initializeFaceMesh();
    }

    async initializeFaceMesh() {
        this.faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            }
        });

        this.faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.faceMesh.onResults((results) => {
            this.onFaceMeshResults(results);
        });
    }

    onFaceMeshResults(results) {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            this.analyzeDrowsinessWithLandmarks(landmarks);
        } else {
            this.updateDetectionStats('Không phát hiện mặt', 0);
            this.clearDetectionBox();
        }
    }

    analyzeDrowsinessWithLandmarks(landmarks) {
        // Phân tích mắt
        const leftEyeOpenness = this.calculateEyeOpenness(landmarks, 'left');
        const rightEyeOpenness = this.calculateEyeOpenness(landmarks, 'right');
        const avgEyeOpenness = (leftEyeOpenness + rightEyeOpenness) / 2;

        // Phân tích tư thế đầu
        const headPose = this.calculateHeadPose(landmarks);

        // Đánh giá trạng thái
        let status = 'Tỉnh táo';
        let confidence = 95;
        let alertLevel = 'normal';

        // Kiểm tra mắt nhắm
        if (avgEyeOpenness < 0.3) {
            this.eyeClosedFrames++;
        } else {
            this.eyeClosedFrames = Math.max(0, this.eyeClosedFrames - 1);
        }

        // Kiểm tra đầu nghiêng/cúi
        if (Math.abs(headPose.tilt) > 15 || Math.abs(headPose.pitch) > 15) {
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

        // Cập nhật UI
        this.updateDetectionStats(status, confidence);
        this.drawDetectionBoxWithLandmarks(landmarks, alertLevel, confidence);
        this.addToHistory(status, confidence);
    }

    calculateEyeOpenness(landmarks, eye) {
        // MediaPipe landmarks cho mắt
        const eyeIndices = eye === 'left' ? 
            [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398] :
            [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];

        // Tính tỷ lệ mở mắt (EAR - Eye Aspect Ratio)
        const ear = this.calculateEAR(landmarks, eyeIndices);
        return ear;
    }

    calculateEAR(landmarks, eyeIndices) {
        // Tính khoảng cách giữa các điểm mắt
        const A = this.distance(landmarks[eyeIndices[1]], landmarks[eyeIndices[5]]);
        const B = this.distance(landmarks[eyeIndices[2]], landmarks[eyeIndices[4]]);
        const C = this.distance(landmarks[eyeIndices[0]], landmarks[eyeIndices[3]]);

        // EAR = (A + B) / (2.0 * C)
        return (A + B) / (2.0 * C);
    }

    calculateHeadPose(landmarks) {
        // Tính tư thế đầu dựa trên landmarks
        const nose = landmarks[1];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];

        // Tính góc nghiêng (roll)
        const eyeCenter = {
            x: (leftEye.x + rightEye.x) / 2,
            y: (leftEye.y + rightEye.y) / 2
        };
        const tilt = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * 180 / Math.PI;

        // Tính góc cúi (pitch) - simplified
        const pitch = (nose.y - eyeCenter.y) * 100;

        return { tilt, pitch, roll: 0 };
    }

    distance(point1, point2) {
        return Math.sqrt(
            Math.pow(point1.x - point2.x, 2) + 
            Math.pow(point1.y - point2.y, 2)
        );
    }

    drawDetectionBoxWithLandmarks(landmarks, alertLevel, confidence) {
        if (!this.detectionOverlay) return;

        this.detectionOverlay.innerHTML = '';

        // Vẽ khung khuôn mặt
        const faceBox = this.createFaceBox(landmarks, alertLevel, confidence);
        this.detectionOverlay.appendChild(faceBox);

        // Vẽ landmarks
        this.drawLandmarks(landmarks);

        // Vẽ thông tin chi tiết
        this.drawDetailedInfoWithLandmarks(landmarks, alertLevel, confidence);
    }

    createFaceBox(landmarks, alertLevel, confidence) {
        // Tính bounding box từ landmarks
        const xs = landmarks.map(p => p.x);
        const ys = landmarks.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const faceBox = document.createElement('div');
        faceBox.className = `detection-box ${alertLevel}`;
        faceBox.style.cssText = `
            position: absolute;
            border: 3px solid ${alertLevel === 'sleeping' ? '#ff0000' : alertLevel === 'drowsy' ? '#ffaa00' : '#00ff00'};
            border-radius: 5px;
            background: rgba(255,255,255,0.1);
            left: ${minX * 100}%;
            top: ${minY * 100}%;
            width: ${(maxX - minX) * 100}%;
            height: ${(maxY - minY) * 100}%;
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

        faceBox.appendChild(label);
        return faceBox;
    }

    drawLandmarks(landmarks) {
        // Vẽ các điểm landmarks quan trọng
        const importantLandmarks = [1, 33, 133, 362, 263, 61, 291]; // Nose, eyes, mouth
        importantLandmarks.forEach(index => {
            const point = landmarks[index];
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: absolute;
                left: ${point.x * 100}%;
                top: ${point.y * 100}%;
                width: 4px;
                height: 4px;
                background: #00ff00;
                border-radius: 50%;
                transform: translate(-50%, -50%);
            `;
            this.detectionOverlay.appendChild(dot);
        });
    }

    drawDetailedInfoWithLandmarks(landmarks, alertLevel, confidence) {
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

        const leftEyeOpenness = this.calculateEyeOpenness(landmarks, 'left');
        const rightEyeOpenness = this.calculateEyeOpenness(landmarks, 'right');
        const headPose = this.calculateHeadPose(landmarks);

        infoBox.innerHTML = `
            <div><strong>Trạng thái:</strong> ${alertLevel}</div>
            <div><strong>Độ tin cậy:</strong> ${confidence}%</div>
            <div><strong>Mắt trái:</strong> ${(leftEyeOpenness * 100).toFixed(1)}%</div>
            <div><strong>Mắt phải:</strong> ${(rightEyeOpenness * 100).toFixed(1)}%</div>
            <div><strong>Đầu nghiêng:</strong> ${headPose.tilt.toFixed(1)}°</div>
            <div><strong>Mắt nhắm:</strong> ${this.eyeClosedFrames} frames</div>
            <div><strong>Đầu nghiêng:</strong> ${this.headDownFrames} frames</div>
        `;

        this.detectionOverlay.appendChild(infoBox);
    }
}
```

### **Bước 3: Cập Nhật Detection Loop**

```javascript
detectionLoop() {
    if (!this.isRunning) return;
    
    this.frameCount++;
    this.updateFPS();
    
    // Sử dụng MediaPipe thay vì mô phỏng
    if (this.webcam && this.webcam.videoWidth > 0) {
        this.faceMesh.send({image: this.webcam});
    }
    
    requestAnimationFrame(() => this.detectionLoop());
}
```

## 📊 **So Sánh Hiệu Suất:**

| Tính Năng | Mô Phỏng | MediaPipe | Face-API.js |
|-----------|----------|-----------|-------------|
| **Độ Chính Xác** | ❌ 0% | ✅ 95%+ | ✅ 90%+ |
| **Real-time** | ✅ Có | ✅ Có | ⚠️ Chậm hơn |
| **Face Detection** | ❌ Không | ✅ Có | ✅ Có |
| **Eye Tracking** | ❌ Không | ✅ Có | ✅ Có |
| **Head Pose** | ❌ Không | ✅ Có | ⚠️ Hạn chế |
| **Setup** | ✅ Dễ | ⚠️ Trung bình | ⚠️ Phức tạp |

## 🎯 **Kết Quả Mong Đợi:**

### **Trước khi tích hợp:**
- ❌ "NORMAL (95%)" dù có 2 người trong khung hình
- ❌ Không nhận diện được khuôn mặt thực tế
- ❌ Phân tích giả lập

### **Sau khi tích hợp MediaPipe:**
- ✅ Nhận diện chính xác khuôn mặt
- ✅ Phân tích độ mở mắt thực tế
- ✅ Phát hiện tư thế đầu
- ✅ Đánh giá trạng thái chính xác
- ✅ Hiển thị landmarks và thông tin chi tiết

## 🚀 **Cách Triển Khai:**

1. **Thêm MediaPipe scripts vào `index.html`**
2. **Thay thế `simulateDetection()` bằng MediaPipe implementation**
3. **Test với webcam thực tế**
4. **Điều chỉnh ngưỡng phát hiện**

## 💡 **Lưu Ý:**

- **Performance**: MediaPipe yêu cầu GPU để hoạt động tốt nhất
- **Lighting**: Ánh sáng tốt giúp tăng độ chính xác
- **Distance**: Khoảng cách 50-100cm từ camera là tối ưu
- **Training**: Có thể fine-tune cho điều kiện cụ thể

---

**Kết luận**: Để có hệ thống phát hiện ngủ gật thực sự, cần tích hợp MediaPipe hoặc Face-API.js thay vì chỉ mô phỏng! 🎯
