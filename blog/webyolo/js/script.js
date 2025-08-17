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

// AI Chatbot Configuration
const AI_CONFIG = {
    // Sử dụng Hugging Face API (miễn phí)
    apiUrl: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
    // Hoặc có thể sử dụng OpenAI API nếu có key
    // apiUrl: 'https://api.openai.com/v1/chat/completions',
    headers: {
        'Content-Type': 'application/json',
    }
};

// Context cho chatbot về YOLO project
const CHATBOT_CONTEXT = `
Bạn là một AI assistant chuyên về dự án YOLO nhận diện sinh viên ngủ gật. 
Thông tin về dự án:
- Tên: YOLO AI - Nhận Diện Sinh Viên Ngủ Gật
- Tác giả: Nguyễn Hoàng Anh Khoa
- Email: nhakhoa1004@gmail.com
- Phone: 0395123864
- Kết quả: mAP 94.2%, Precision 96.8%, Recall 92.1%, Tốc độ 25 FPS
- Các phiên bản YOLO: v1(2016), v3(2018), v5(2020), v8(2023)
- Quy trình: Thu thập dữ liệu → Gán nhãn → Tiền xử lý → Huấn luyện → Đánh giá

Hãy trả lời một cách thân thiện và chuyên nghiệp bằng tiếng Việt.
`;

// Conversation history
let conversationHistory = [];

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
chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
});

closeChatbot.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
});

// AI Chatbot Configuration
const AI_CONFIG = {
    // Sử dụng Hugging Face API (miễn phí)
    apiUrl: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
    // Hoặc có thể sử dụng OpenAI API nếu có key
    // apiUrl: 'https://api.openai.com/v1/chat/completions',
    headers: {
        'Content-Type': 'application/json',
    }
};

// Context cho chatbot về YOLO project
const CHATBOT_CONTEXT = `
Bạn là một AI assistant chuyên về dự án YOLO nhận diện sinh viên ngủ gật. 
Thông tin về dự án:
- Tên: YOLO AI - Nhận Diện Sinh Viên Ngủ Gật
- Tác giả: Nguyễn Hoàng Anh Khoa
- Email: nhakhoa1004@gmail.com
- Phone: 0395123864
- Kết quả: mAP 94.2%, Precision 96.8%, Recall 92.1%, Tốc độ 25 FPS
- Các phiên bản YOLO: v1(2016), v3(2018), v5(2020), v8(2023)
- Quy trình: Thu thập dữ liệu → Gán nhãn → Tiền xử lý → Huấn luyện → Đánh giá

Hãy trả lời một cách thân thiện và chuyên nghiệp bằng tiếng Việt.
`;

// Conversation history
let conversationHistory = [];

// Send message function
async function sendChatbotMessage() {
    const message = chatbotInput.value.trim();
    if (message === '') return;

    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
        // Get AI response
        const response = await getAIResponse(message);
        hideTypingIndicator();
        addMessage(response, 'bot');

        // Add to conversation history
        conversationHistory.push({ role: 'user', content: message }, { role: 'assistant', content: response });

        // Keep only last 10 messages to avoid token limit
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
        }
    } catch (error) {
        hideTypingIndicator();
        console.error('Chatbot error:', error);
        addMessage('Xin lỗi, tôi gặp một chút vấn đề kỹ thuật. Hãy thử lại sau ít phút.', 'bot');
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

    return 'Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về YOLO, CNN, nhận diện đối tượng, ngủ gật, huấn luyện, mAP, precision, hoặc recall.';
}

// Event listeners for chatbot
sendMessage.addEventListener('click', sendChatbotMessage);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatbotMessage();
    }
});

// Back to Top functionality
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
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
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
            const text = metricValue.textContent;
            const number = parseFloat(text);

            if (!isNaN(number)) {
                animateCounter(metricValue, number);
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