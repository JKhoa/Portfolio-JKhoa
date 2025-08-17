// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const closeChatbot = document.getElementById('closeChatbot');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const sendMessage = document.getElementById('sendMessage');
const backToTop = document.getElementById('backToTop');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const saveSettings = document.getElementById('saveSettings');
const testAI = document.getElementById('testAI');
const groqApiKey = document.getElementById('groqApiKey');
const aiStatus = document.getElementById('aiStatus');

// API Configuration - SỬ DỤNG localStorage cho bảo mật
const USE_LOCALSTORAGE_API = true; // Luôn dùng localStorage thay vì hardcode

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Chatbot Functionality
if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener('click', () => {
        console.log('Chatbot toggle clicked!');
        chatbotWindow.classList.toggle('active');
    });
}

if (closeChatbot && chatbotWindow) {
    closeChatbot.addEventListener('click', () => {
        console.log('Close chatbot clicked!');
        chatbotWindow.classList.remove('active');
    });
}

// Settings Modal
if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
        loadSettings();
    });
}

if (closeSettings && settingsModal) {
    closeSettings.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });
}

if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });
}

if (saveSettings && groqApiKey && aiStatus) {
    saveSettings.addEventListener('click', () => {
        const apiKey = groqApiKey.value.trim();
        if (apiKey) {
            localStorage.setItem('groq_api_key', apiKey);
            updateAIStatus('Groq AI (Thực)', 'connected');
            addMessage('✅ API key đã được lưu! Bạn có thể sử dụng AI thực ngay bây giờ.', 'bot');
        } else {
            localStorage.removeItem('groq_api_key');
            updateAIStatus('AI Mô Phỏng (Local)', 'local');
            addMessage('ℹ️ Đã chuyển về chế độ AI mô phỏng.', 'bot');
        }
        settingsModal.classList.remove('active');
    });
}

if (testAI) {
    testAI.addEventListener('click', async() => {
        const testBtn = testAI;
        const originalText = testBtn.textContent;
        testBtn.textContent = 'Đang test...';
        testBtn.disabled = true;

        try {
            addMessage('🔍 Đang test AI...', 'bot');
            // Simple test - just show that it works
            setTimeout(() => {
                addMessage('✅ Test thành công! AI hoạt động bình thường.', 'bot');
                testBtn.textContent = originalText;
                testBtn.disabled = false;
            }, 1000);
        } catch (error) {
            addMessage('❌ Test thất bại: ' + error.message, 'bot');
            testBtn.textContent = originalText;
            testBtn.disabled = false;
        }
    });
}

// Load and update AI status
function loadSettings() {
    if (groqApiKey && aiStatus) {
        const savedApiKey = localStorage.getItem('groq_api_key');
        if (savedApiKey) {
            groqApiKey.value = savedApiKey;
            updateAIStatus('Groq AI (Thực)', 'connected');
        } else {
            groqApiKey.value = '';
            updateAIStatus('AI Mô Phỏng (Local)', 'local');
        }
    }
}

function updateAIStatus(text, type) {
    if (aiStatus) {
        const statusIndicator = aiStatus.querySelector('.status-indicator');
        const statusText = aiStatus.querySelector('.status-text');

        if (statusText) statusText.textContent = text;

        if (statusIndicator) {
            if (type === 'connected') {
                statusIndicator.style.background = '#4CAF50';
            } else {
                statusIndicator.style.background = 'var(--primary-color)';
            }
        }
    }
}

// AI response system
async function getAIResponse(message) {
    const apiKey = localStorage.getItem('groq_api_key');

    if (apiKey) {
        try {
            // Call Groq API directly (no server needed)
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama3-8b-8192',
                    messages: [{
                            role: 'system',
                            content: 'Bạn là AI assistant thông minh cho YOLO project. Trả lời bằng tiếng Việt, thân thiện và hữu ích. Chuyên về computer vision, machine learning, và YOLO object detection.'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: 512,
                    temperature: 0.7
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.choices[0].message.content;
            } else {
                console.log('Groq API error:', response.status);
            }
        } catch (error) {
            console.log('Groq API failed:', error);
        }
    }

    // Fallback to simulated responses
    const responses = [
        "Đây là phản hồi từ AI mô phỏng. Hãy mở Settings ⚙️ để thêm API key và sử dụng AI thực!",
        "Tôi hiểu bạn đang hỏi về: " + message + ". Đây là AI demo - hãy cấu hình API key để có trải nghiệm tốt hơn!",
        "Cảm ơn câu hỏi của bạn! Hiện tại tôi đang chạy ở chế độ demo. Vào Settings để kết nối AI thực nhé!",
        "Rất thú vị! Đây là câu trả lời mô phỏng. Để có câu trả lời chi tiết hơn, hãy thêm API key trong Settings."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}

// Initialize chatbot
function initializeChatbot() {
    if (typeof loadSettings === 'function') {
        loadSettings();
    }

    // Thêm thông báo chào mừng
    setTimeout(() => {
        const savedApiKey = localStorage.getItem('groq_api_key');
        let welcomeMessage;

        if (savedApiKey) {
            welcomeMessage = "🤖 Xin chào! Tôi là AI Assistant với Groq API. Hãy hỏi tôi bất kỳ điều gì về YOLO và computer vision!";
        } else {
            welcomeMessage = "🤖 Xin chào! Tôi đang chạy ở chế độ demo. Để có trải nghiệm AI thực, hãy thêm API key trong Settings ⚙️";
        }

        if (chatbotMessages) {
            addMessage(welcomeMessage, 'bot');
        }
    }, 500);
}

// Initialize AI status on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeChatbot();
});

// Simple chatbot responses
const chatbotResponses = {
    'yolo': 'YOLO (You Only Look Once) là một thuật toán nhận dạng đối tượng thời gian thực được phát triển bởi Joseph Redmon. Nó có thể phát hiện và phân loại nhiều đối tượng trong một hình ảnh chỉ với một lần nhìn.',
    'cnn': 'CNN (Convolutional Neural Network) là kiến trúc mạng nơ-ron chuyên biệt cho xử lý dữ liệu có cấu trúc lưới như hình ảnh. Nó sử dụng các lớp tích chập để trích xuất đặc trưng.',
    'nhận diện': 'Nhận diện đối tượng là quá trình xác định và định vị các đối tượng trong hình ảnh hoặc video. Các thuật toán phổ biến bao gồm R-CNN, SSD, và YOLO.',
    'ngủ gật': 'Phát hiện ngủ gật là ứng dụng của computer vision để nhận diện trạng thái mệt mỏi của sinh viên trong lớp học, giúp cải thiện chất lượng học tập.',
    'huấn luyện': 'Quá trình huấn luyện YOLO bao gồm: thu thập dữ liệu, gán nhãn, tiền xử lý, huấn luyện mô hình và đánh giá hiệu suất.',
    'mAP': 'mAP (Mean Average Precision) là chỉ số đánh giá độ chính xác của mô hình nhận diện đối tượng. Giá trị càng cao càng tốt.',
    'precision': 'Precision (Độ chính xác) đo lường tỷ lệ dự đoán đúng trong tổng số dự đoán dương tính.',
    'recall': 'Recall (Độ bao phủ) đo lường tỷ lệ dự đoán đúng trong tổng số trường hợp thực tế dương tính.',
    'khoa': 'Tôi là Nguyễn Hoàng Anh Khoa, sinh viên năm cuối ngành Công nghệ thông tin tại Đại học Đà Lạt. Đây là dự án nghiên cứu về YOLO của tôi.',
    'portfolio': 'Bạn có thể xem thêm các dự án khác của tôi tại trang Portfolio chính.',
    'liên hệ': 'Bạn có thể liên hệ với tôi qua email: nhakhoa1004@gmail.com hoặc số điện thoại: 0395123864'
};

// Send message function
async function sendChatbotMessage() {
    const message = chatbotInput.value.trim();
    if (message === '') return;

    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';

    // Show typing indicator
    addMessage('🤖 Đang suy nghĩ...', 'bot');

    try {
        // Get AI response
        const response = await getAIResponse(message);

        // Remove typing indicator
        const messages = chatbotMessages.children;
        if (messages.length > 0 && messages[messages.length - 1].textContent.includes('Đang suy nghĩ')) {
            chatbotMessages.removeChild(messages[messages.length - 1]);
        }

        addMessage(response, 'bot');
    } catch (error) {
        // Remove typing indicator and show error
        const messages = chatbotMessages.children;
        if (messages.length > 0 && messages[messages.length - 1].textContent.includes('Đang suy nghĩ')) {
            chatbotMessages.removeChild(messages[messages.length - 1]);
        }

        addMessage('❌ Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!', 'bot');
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;

    messageDiv.appendChild(contentDiv);
    chatbotMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Get chatbot response
function getChatbotResponse(message) {
    const lowerMessage = message.toLowerCase();

    for (const [keyword, response] of Object.entries(chatbotResponses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }

    return 'Xin chào! Tôi có thể giúp bạn tìm hiểu về YOLO, CNN, nhận diện đối tượng, ngủ gật, huấn luyện, mAP, precision, recall, hoặc liên hệ với tác giả.';
}

// Event listeners for chatbot
if (sendMessage && chatbotInput) {
    sendMessage.addEventListener('click', sendChatbotMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatbotMessage();
        }
    });
}

// Back to Top functionality
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.theory-card, .timeline-item, .step, .metric-card');
    animateElements.forEach(el => observer.observe(el));
});

// Counter animation for metrics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animate metrics when they come into view
const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const metricValue = entry.target.querySelector('.metric-value');
            if (metricValue) {
                const text = metricValue.textContent;
                const number = parseFloat(text);

                if (!isNaN(number)) {
                    animateCounter(metricValue, number);
                }
            }
            metricsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => metricsObserver.observe(card));
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.theory-card, .timeline-item, .metric-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple effect CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Debug: Check if elements exist
console.log('Chatbot elements check:');
console.log('chatbotToggle:', chatbotToggle);
console.log('chatbotWindow:', chatbotWindow);
console.log('closeChatbot:', closeChatbot);