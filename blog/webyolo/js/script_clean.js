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
function sendChatbotMessage() {
    const message = chatbotInput.value.trim();
    if (message === '') return;

    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';

    // Simulate typing delay
    setTimeout(() => {
        const response = getChatbotResponse(message);
        addMessage(response, 'bot');
    }, 1000);
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
