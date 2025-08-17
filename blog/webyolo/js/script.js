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
const userName = document.getElementById('userName');
const memoryInfo = document.getElementById('memoryInfo');
const conversationCount = document.getElementById('conversationCount');
const interestCount = document.getElementById('interestCount');
const clearMemory = document.getElementById('clearMemory');

// API Configuration - SỬ DỤNG localStorage cho bảo mật
const USE_LOCALSTORAGE_API = true; // Luôn dùng localStorage thay vì hardcode

// User Memory System - Lưu trữ thói quen và sở thích người dùng
const USER_MEMORY_KEY = 'chatbot_user_memory';
const CONVERSATION_HISTORY_KEY = 'chatbot_conversation_history';

// Initialize user memory
function initializeUserMemory() {
    if (!localStorage.getItem(USER_MEMORY_KEY)) {
        const defaultMemory = {
            name: '',
            interests: [],
            preferences: {
                language: 'vietnamese',
                topics: [],
                communication_style: 'friendly'
            },
            personal_info: {
                age_range: '',
                profession: '',
                experience_level: ''
            },
            conversation_patterns: {
                frequent_questions: [],
                favorite_topics: [],
                last_interaction: new Date().toISOString()
            }
        };
        localStorage.setItem(USER_MEMORY_KEY, JSON.stringify(defaultMemory));
    }
}

// Get user memory
function getUserMemory() {
    const memory = localStorage.getItem(USER_MEMORY_KEY);
    return memory ? JSON.parse(memory) : null;
}

// Update user memory
function updateUserMemory(updates) {
    const currentMemory = getUserMemory();
    const updatedMemory = {...currentMemory, ...updates };
    updatedMemory.conversation_patterns.last_interaction = new Date().toISOString();
    localStorage.setItem(USER_MEMORY_KEY, JSON.stringify(updatedMemory));
}

// Analyze user message for personal info extraction
function analyzeUserMessage(message) {
    const memory = getUserMemory();
    const updates = {};

    // Phân tích tên
    const namePatterns = [
        /tôi là ([^,.\s]+)/i,
        /tên tôi là ([^,.\s]+)/i,
        /mình là ([^,.\s]+)/i,
        /tôi tên ([^,.\s]+)/i
    ];

    for (const pattern of namePatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
            updates.name = match[1];
            break;
        }
    }

    // Phân tích sở thích
    const interestKeywords = [
        'thích', 'yêu thích', 'quan tâm', 'đam mê', 'sở thích',
        'computer vision', 'machine learning', 'AI', 'YOLO', 'deep learning',
        'programming', 'coding', 'python', 'javascript', 'web development'
    ];

    const newInterests = [];
    interestKeywords.forEach(keyword => {
        if (message.toLowerCase().includes(keyword.toLowerCase())) {
            newInterests.push(keyword);
        }
    });

    if (newInterests.length > 0) {
        updates.interests = [...new Set([...(memory.interests || []), ...newInterests])];
    }

    // Phân tích nghề nghiệp
    const professionKeywords = [
        'sinh viên', 'học sinh', 'developer', 'lập trình viên', 'kỹ sư',
        'researcher', 'nghiên cứu', 'giáo viên', 'giảng viên'
    ];

    professionKeywords.forEach(profession => {
        if (message.toLowerCase().includes(profession)) {
            updates.personal_info = {
                ...memory.personal_info,
                profession: profession
            };
        }
    });

    // Phân tích yêu cầu ngôn ngữ
    if (message.toLowerCase().includes('english') || message.toLowerCase().includes('tiếng anh')) {
        updates.preferences = {
            ...memory.preferences,
            language: 'english'
        };
    } else {
        updates.preferences = {
            ...memory.preferences,
            language: 'vietnamese'
        };
    }

    // Lưu câu hỏi thường gặp
    const questions = memory.conversation_patterns ? .frequent_questions || [];
    questions.push({
        question: message,
        timestamp: new Date().toISOString(),
        context: 'user_question'
    });

    // Giữ chỉ 10 câu hỏi gần nhất
    updates.conversation_patterns = {
        ...memory.conversation_patterns,
        frequent_questions: questions.slice(-10)
    };

    if (Object.keys(updates).length > 0) {
        updateUserMemory(updates);
    }
}

// Get conversation history
function getConversationHistory() {
    const history = localStorage.getItem(CONVERSATION_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

// Save conversation
function saveConversation(userMessage, botResponse) {
    const history = getConversationHistory();
    const conversation = {
        timestamp: new Date().toISOString(),
        user: userMessage,
        bot: botResponse
    };

    history.push(conversation);

    // Giữ chỉ 20 cuộc trò chuyện gần nhất
    const recentHistory = history.slice(-20);
    localStorage.setItem(CONVERSATION_HISTORY_KEY, JSON.stringify(recentHistory));
}

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

        // Save user name
        if (userName && userName.value.trim()) {
            const userMemory = getUserMemory();
            updateUserMemory({ name: userName.value.trim() });
            addMessage(`✅ Đã lưu tên: ${userName.value.trim()}! Tôi sẽ nhớ bạn.`, 'bot');
        }

        settingsModal.classList.remove('active');
        loadUserMemoryToUI(); // Refresh memory display
    });
}

// Clear memory button
if (clearMemory) {
    clearMemory.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa toàn bộ bộ nhớ cuộc trò chuyện? Điều này không thể hoàn tác.')) {
            localStorage.removeItem(USER_MEMORY_KEY);
            localStorage.removeItem(CONVERSATION_HISTORY_KEY);
            initializeUserMemory();
            loadUserMemoryToUI();
            addMessage('🗑️ Đã xóa toàn bộ bộ nhớ. Tôi sẽ bắt đầu lại từ đầu!', 'bot');
        }
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

    // Load user memory data
    loadUserMemoryToUI();
}

// Load user memory to UI
function loadUserMemoryToUI() {
    const userMemory = getUserMemory();
    const conversationHistory = getConversationHistory();

    // Load user name
    if (userName && userMemory.name) {
        userName.value = userMemory.name;
    }

    // Update memory stats
    if (conversationCount) {
        conversationCount.textContent = `${conversationHistory.length} cuộc trò chuyện`;
    }

    if (interestCount) {
        const interests = userMemory.interests || [];
        interestCount.textContent = `${interests.length} sở thích`;
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
    // Phân tích tin nhắn để cập nhật bộ nhớ người dùng
    analyzeUserMessage(message);

    const apiKey = localStorage.getItem('groq_api_key');
    const userMemory = getUserMemory();
    const conversationHistory = getConversationHistory().slice(-5); // 5 cuộc trò chuyện gần nhất

    if (apiKey) {
        try {
            // Tạo context từ bộ nhớ người dùng
            let systemPrompt = `Bạn là AI assistant thông minh cho YOLO project. 

QUAN TRỌNG - NGÔN NGỮ:
- LUÔN LUÔN trả lời bằng tiếng Việt trừ khi được yêu cầu rõ ràng "answer in English" hoặc "trả lời bằng tiếng Anh"
- Nếu user hỏi bằng tiếng Anh nhưng KHÔNG yêu cầu trả lời bằng tiếng Anh, vẫn trả lời bằng tiếng Việt
- Chỉ trả lời bằng tiếng Anh khi có yêu cầu cụ thể

THÔNG TIN NGƯỜI DÙNG:`;

            if (userMemory.name) {
                systemPrompt += `\n- Tên: ${userMemory.name}`;
            }

            if (userMemory.interests && userMemory.interests.length > 0) {
                systemPrompt += `\n- Sở thích: ${userMemory.interests.join(', ')}`;
            }

            if (userMemory.personal_info ? .profession) {
                systemPrompt += `\n- Nghề nghiệp: ${userMemory.personal_info.profession}`;
            }

            systemPrompt += `\n\nHÃY:
- Sử dụng thông tin cá nhân để đưa ra câu trả lời phù hợp
- Thân thiện và cá nhân hóa
- Chuyên về computer vision, machine learning, YOLO object detection
- Nhớ các cuộc trò chuyện trước đó
- Luôn trả lời bằng tiếng Việt trừ khi được yêu cầu rõ ràng khác`;

            // Thêm lịch sử trò chuyện vào context
            const messages = [{ role: 'system', content: systemPrompt }];

            // Thêm 3 cuộc trò chuyện gần nhất để AI nhớ context
            conversationHistory.slice(-3).forEach(conv => {
                messages.push({ role: 'user', content: conv.user });
                messages.push({ role: 'assistant', content: conv.bot });
            });

            // Thêm tin nhắn hiện tại
            messages.push({ role: 'user', content: message });

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama3-8b-8192',
                    messages: messages,
                    max_tokens: 512,
                    temperature: 0.7
                })
            });

            if (response.ok) {
                const data = await response.json();
                const botResponse = data.choices[0].message.content;

                // Lưu cuộc trò chuyện
                saveConversation(message, botResponse);

                return botResponse;
            } else {
                console.log('Groq API error:', response.status);
            }
        } catch (error) {
            console.log('Groq API failed:', error);
        }
    }

    // Fallback to intelligent simulated responses using user memory
    return getIntelligentFallbackResponse(message);
}

// Intelligent fallback response system
function getIntelligentFallbackResponse(message) {
    const userMemory = getUserMemory();
    const conversationHistory = getConversationHistory();

    // Tạo phản hồi thông minh dựa trên bộ nhớ
    let response = "";

    // Cá nhân hóa phản hồi nếu có tên
    const greeting = userMemory.name ? `${userMemory.name}, ` : "";

    // Phân tích câu hỏi để đưa ra phản hồi phù hợp
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('yolo') || lowerMessage.includes('object detection')) {
        response = `${greeting}YOLO (You Only Look Once) là một thuật toán nhận dạng đối tượng thời gian thực rất mạnh mẽ! `;
        if (userMemory.personal_info ? .profession === 'sinh viên') {
            response += "Đây là chủ đề rất thú vị cho nghiên cứu học tập của bạn. ";
        }
        response += "Đây là AI demo - hãy thêm API key trong Settings ⚙️ để có câu trả lời chi tiết hơn!";
    } else if (lowerMessage.includes('machine learning') || lowerMessage.includes('ai')) {
        response = `${greeting}Machine Learning và AI là lĩnh vực rất hấp dẫn! `;
        if (userMemory.interests && userMemory.interests.includes('machine learning')) {
            response += "Tôi nhớ bạn có quan tâm đến ML rồi. ";
        }
        response += "Để có trải nghiệm AI thực, hãy cấu hình API key trong Settings!";
    } else if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = `Xin chào ${userMemory.name || 'bạn'}! `;
        if (conversationHistory.length > 0) {
            response += "Vui lòng gặp lại bạn! ";
        }
        response += "Tôi đang chạy ở chế độ demo. Vào Settings ⚙️ để kết nối AI thực nhé!";
    } else if (lowerMessage.includes('tên') && lowerMessage.includes('gì')) {
        response = `Tôi là AI Assistant cho YOLO project! `;
        if (userMemory.name) {
            response += `Còn bạn là ${userMemory.name} đúng không? `;
        }
        response += "Đây là phiên bản demo - thêm API key để có trải nghiệm đầy đủ!";
    } else if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thank')) {
        response = `${greeting}Rất vui được giúp đỡ bạn! `;
        if (userMemory.interests && userMemory.interests.length > 0) {
            response += `Hy vọng thông tin về ${userMemory.interests[0]} hữu ích với bạn. `;
        }
        response += "Đây là AI demo - Settings ⚙️ để trải nghiệm AI thực!";
    } else {
        // Phản hồi chung thông minh
        const responses = [
            `${greeting}Đây là phản hồi từ AI mô phỏng về: "${message}". Hãy mở Settings ⚙️ để thêm API key và có câu trả lời chi tiết!`,
            `${greeting}Tôi hiểu bạn quan tâm đến điều này. Đây là AI demo - cấu hình API key để có trải nghiệm tốt hơn!`,
            `${greeting}Câu hỏi thú vị! Để có phản hồi chuyên sâu, hãy thêm API key trong Settings.`,
            `${greeting}Rất vui được trao đổi với bạn! Đây là chế độ demo - Settings ⚙️ để kết nối AI thực.`
        ];

        response = responses[Math.floor(Math.random() * responses.length)];
    }

    // Lưu cuộc trò chuyện
    saveConversation(message, response);

    return response;
}

// Initialize chatbot
function initializeChatbot() {
    // Khởi tạo bộ nhớ người dùng
    initializeUserMemory();

    if (typeof loadSettings === 'function') {
        loadSettings();
    }

    // Thêm thông báo chào mừng cá nhân hóa
    setTimeout(() => {
        const savedApiKey = localStorage.getItem('groq_api_key');
        const userMemory = getUserMemory();
        let welcomeMessage;

        const greeting = userMemory.name ? `Chào ${userMemory.name}! ` : "🤖 Xin chào! ";

        if (savedApiKey) {
            welcomeMessage = `${greeting}Tôi là AI Assistant với Groq API. `;
            if (userMemory.interests && userMemory.interests.length > 0) {
                welcomeMessage += `Tôi nhớ bạn quan tâm đến ${userMemory.interests.slice(0, 2).join(' và ')}. `;
            }
            welcomeMessage += "Hãy hỏi tôi bất kỳ điều gì!";
        } else {
            welcomeMessage = `${greeting}Tôi đang chạy ở chế độ demo. `;
            if (getConversationHistory().length > 0) {
                welcomeMessage += "Vui lòng gặp lại bạn! ";
            }
            welcomeMessage += "Để có trải nghiệm AI thực, hãy thêm API key trong Settings ⚙️";
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

// ===========================
// LIVE DEMO: Drowsiness Detection
// ===========================

class DrowsinessDetector {
    constructor() {
        // DOM Elements
        this.webcam = document.getElementById('webcam');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.detectionOverlay = document.getElementById('detectionOverlay');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.startDemo = document.getElementById('startDemo');
        this.stopDemo = document.getElementById('stopDemo');
        this.capturePhoto = document.getElementById('capturePhoto');
        this.viewGallery = document.getElementById('viewGallery');
        this.resetDemo = document.getElementById('resetDemo');
        this.testCamera = document.getElementById('testCamera');

        // Status elements
        this.detectionStatus = document.getElementById('detectionStatus');
        this.confidence = document.getElementById('confidence');
        this.fps = document.getElementById('fps');
        this.historyList = document.getElementById('historyList');

        // Settings
        this.sensitivity = document.getElementById('sensitivity');
        this.sensitivityValue = document.getElementById('sensitivityValue');
        this.alertMode = document.getElementById('alertMode');

        // Detection state
        this.isRunning = false;
        this.stream = null;
        this.lastDetectionTime = 0;
        this.frameCount = 0;
        this.fpsStartTime = Date.now();
        this.detectionHistory = [];

        // Face detection parameters
        this.eyeClosedFrames = 0;
        this.headDownFrames = 0;
        this.alertThreshold = 15; // frames

        // Database for storing captured images
        this.imageDatabase = [];
        this.DATABASE_KEY = 'drowsiness_detection_images';

        // Auto-capture settings
        this.autoCapture = true;
        this.lastCaptureTime = 0;
        this.captureInterval = 3000; // 3 seconds between captures

        console.log('DrowsinessDetector initialized');
        console.log('Elements check:', {
            webcam: !!this.webcam,
            canvas: !!this.canvas,
            startDemo: !!this.startDemo,
            stopDemo: !!this.stopDemo,
            capturePhoto: !!this.capturePhoto,
            testCamera: !!this.testCamera
        });

        // Check browser compatibility
        console.log('Browser compatibility:', {
            getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
            webRTC: !!(window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection),
            canvas: !!document.createElement('canvas').getContext,
            video: !!document.createElement('video').canPlayType
        });

        this.initializeEvents();
        this.initializeDetection();
        this.loadDatabase();
    }

    initializeEvents() {
        console.log('Initializing events...');

        if (this.startDemo) {
            console.log('Adding startDemo listener');
            this.startDemo.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Start demo clicked');
                this.startDetection();
            });
        } else {
            console.error('startDemo element not found');
        }

        if (this.stopDemo) {
            this.stopDemo.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Stop demo clicked');
                this.stopDetection();
            });
        }

        if (this.capturePhoto) {
            this.capturePhoto.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Capture photo clicked');
                this.capturePhoto();
            });
        }

        if (this.viewGallery) {
            this.viewGallery.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('View gallery clicked');
                this.showImageGallery();
            });
        }

        if (this.testCamera) {
            this.testCamera.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Test camera clicked');
                this.testCameraAccess();
            });
        }

        if (this.resetDemo) {
            this.resetDemo.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Reset demo clicked');
                this.resetDetection();
            });
        }

        if (this.sensitivity) {
            this.sensitivity.addEventListener('input', (e) => {
                if (this.sensitivityValue) {
                    this.sensitivityValue.textContent = e.target.value;
                }
            });
        }
    }

    // Database management methods
    loadDatabase() {
        try {
            const stored = localStorage.getItem(this.DATABASE_KEY);
            this.imageDatabase = stored ? JSON.parse(stored) : [];
            console.log(`Loaded ${this.imageDatabase.length} images from database`);
            this.updateImageGallery();
        } catch (error) {
            console.error('Error loading database:', error);
            this.imageDatabase = [];
        }
    }

    saveToDatabase(imageData, detectionInfo) {
        const record = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            image: imageData,
            detection: {
                status: detectionInfo.status,
                confidence: detectionInfo.confidence,
                eyeClosedFrames: detectionInfo.eyeClosedFrames,
                headDownFrames: detectionInfo.headDownFrames
            },
            formatted_time: new Date().toLocaleString('vi-VN')
        };

        this.imageDatabase.unshift(record); // Add to beginning

        // Keep only last 50 images to avoid storage overflow
        if (this.imageDatabase.length > 50) {
            this.imageDatabase = this.imageDatabase.slice(0, 50);
        }

        try {
            localStorage.setItem(this.DATABASE_KEY, JSON.stringify(this.imageDatabase));
            console.log('Saved detection to database:', record.formatted_time);
            this.updateImageGallery();
            this.showCaptureNotification(record);
        } catch (error) {
            console.error('Error saving to database:', error);
            if (error.name === 'QuotaExceededError') {
                // Storage full, remove old entries
                this.imageDatabase = this.imageDatabase.slice(0, 20);
                localStorage.setItem(this.DATABASE_KEY, JSON.stringify(this.imageDatabase));
            }
        }
    }

    clearDatabase() {
        this.imageDatabase = [];
        localStorage.removeItem(this.DATABASE_KEY);
        this.updateImageGallery();
        console.log('Database cleared');
    }

    exportDatabase() {
        const dataStr = JSON.stringify(this.imageDatabase, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `drowsiness_detection_data_${new Date().toISOString().slice(0,10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    initializeDetection() {
        // Khởi tạo face detection (sử dụng một thuật toán đơn giản)
        this.updateStatus('Sẵn sàng bắt đầu', false);
    }

    async testCameraAccess() {
        try {
            console.log('Testing camera access...');
            this.updateStatus('Đang kiểm tra camera...', false);

            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('getUserMedia not supported');
            }

            // Test basic camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false
            });

            console.log('Camera test successful');
            this.showNotification('✅ Camera hoạt động bình thường! Bạn có thể bắt đầu demo.', 'success');
            this.updateStatus('Camera đã sẵn sàng', false);

            // Stop test stream
            stream.getTracks().forEach(track => track.stop());

            // Also test video element
            if (this.webcam) {
                this.showNotification('📹 Video element đã sẵn sàng', 'info');
            } else {
                this.showNotification('⚠️ Không tìm thấy video element', 'warning');
            }

        } catch (error) {
            console.error('Camera test failed:', error);
            let errorMessage = 'Camera test failed';

            if (error.name === 'NotAllowedError') {
                errorMessage = '❌ Quyền truy cập camera bị từ chối. Vui lòng cho phép trong browser settings.';
            } else if (error.name === 'NotFoundError') {
                errorMessage = '❌ Không tìm thấy camera. Vui lòng kết nối camera và thử lại.';
            } else if (error.name === 'NotReadableError') {
                errorMessage = '❌ Camera đang được sử dụng bởi ứng dụng khác.';
            } else if (error.message.includes('getUserMedia not supported')) {
                errorMessage = '❌ Trình duyệt không hỗ trợ camera. Vui lòng dùng Chrome, Firefox, hoặc Edge.';
            } else {
                errorMessage = `❌ Lỗi camera: ${error.message}`;
            }

            this.updateStatus('Lỗi camera', false);
            this.showNotification(errorMessage, 'error');
        }
    }

    async startDetection() {
        try {
            console.log('Starting detection...');

            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('getUserMedia not supported in this browser');
            }

            // Show camera permission request
            this.updateStatus('Đang yêu cầu quyền truy cập camera...', false);

            // Request camera access with error handling
            const constraints = {
                video: {
                    width: { ideal: 640, max: 1280 },
                    height: { ideal: 480, max: 720 },
                    facingMode: 'user'
                },
                audio: false
            };

            console.log('Requesting camera access with constraints:', constraints);
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('Camera access granted, stream:', this.stream);

            if (!this.webcam) {
                throw new Error('Webcam element not found');
            }

            // Set up video element
            this.webcam.srcObject = this.stream;
            this.webcam.muted = true;
            this.webcam.playsInline = true;

            // Wait for video to be ready
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Video loading timeout'));
                }, 10000);

                this.webcam.onloadedmetadata = () => {
                    clearTimeout(timeout);
                    console.log('Video metadata loaded, dimensions:', this.webcam.videoWidth, 'x', this.webcam.videoHeight);
                    
                    this.webcam.play()
                        .then(() => {
                            console.log('Video playing successfully');
                            resolve();
                        })
                        .catch(reject);
                };

                this.webcam.onerror = (error) => {
                    clearTimeout(timeout);
                    reject(error);
                };
            });

            // Setup canvas
            if (this.canvas && this.webcam) {
                this.canvas.width = this.webcam.videoWidth || 640;
                this.canvas.height = this.webcam.videoHeight || 480;
                console.log('Canvas setup:', this.canvas.width, 'x', this.canvas.height);
            }

            this.isRunning = true;
            this.updateStatus('✅ Đang phát hiện...', true);
            this.toggleButtons(true);

            // Show success notification
            this.showNotification('🎥 Camera đã kết nối thành công! Bắt đầu phát hiện ngủ gật...', 'success');

            // Start detection loop
            this.detectionLoop();

        } catch (error) {
            console.error('Error starting detection:', error);
            let errorMessage = 'Lỗi không xác định';

            if (error.name === 'NotAllowedError') {
                errorMessage = 'Bạn đã từ chối quyền truy cập camera. Vui lòng cho phép và thử lại.';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'Không tìm thấy camera. Vui lòng kiểm tra kết nối camera.';
            } else if (error.name === 'NotReadableError') {
                errorMessage = 'Camera đang được sử dụng bởi ứng dụng khác.';
            } else if (error.name === 'OverconstrainedError') {
                errorMessage = 'Camera không hỗ trợ độ phân giải yêu cầu.';
            } else if (error.message.includes('getUserMedia not supported')) {
                errorMessage = 'Trình duyệt không hỗ trợ truy cập camera. Vui lòng sử dụng Chrome, Firefox hoặc Edge.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Quá thời gian chờ kết nối camera. Vui lòng thử lại.';
            } else {
                errorMessage = `Lỗi truy cập camera: ${error.message}`;
            }

            this.updateStatus('❌ ' + errorMessage, false);
            this.showNotification(errorMessage, 'error');
            
            // Clean up on error
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }
        }
    }

    stopDetection() {
        this.isRunning = false;

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        this.updateStatus('Đã dừng', false);
        this.toggleButtons(false);
        this.clearOverlay();
    }

    resetDetection() {
        this.stopDetection();
        this.detectionHistory = [];
        this.eyeClosedFrames = 0;
        this.headDownFrames = 0;
        this.updateHistoryDisplay();
        this.updateDetectionStats('Đã reset', 0);
    }

    detectionLoop() {
        if (!this.isRunning) return;

        this.frameCount++;
        this.updateFPS();

        // Simulate face detection (thay thế bằng AI model thực)
        this.simulateDetection();

        // Continue loop
        requestAnimationFrame(() => this.detectionLoop());
    }

    simulateDetection() {
        // Mô phỏng phát hiện khuôn mặt và trạng thái ngủ gật
        const currentTime = Date.now();

        // Random simulation cho demo
        const hasFace = Math.random() > 0.1; // 90% có mặt

        if (hasFace) {
            const eyesClosed = Math.random() > 0.85; // 15% nhắm mắt
            const headDown = Math.random() > 0.9; // 10% cúi đầu

            // Update counters
            if (eyesClosed) {
                this.eyeClosedFrames++;
            } else {
                this.eyeClosedFrames = 0;
            }

            if (headDown) {
                this.headDownFrames++;
            } else {
                this.headDownFrames = 0;
            }

            // Determine status
            let status = 'Tỉnh táo';
            let confidence = 95;
            let alertLevel = 'normal';

            if (this.eyeClosedFrames > this.alertThreshold) {
                status = 'Ngủ gật';
                confidence = Math.min(95, 60 + this.eyeClosedFrames * 2);
                alertLevel = 'sleeping';
            } else if (this.eyeClosedFrames > 5 || this.headDownFrames > 8) {
                status = 'Buồn ngủ';
                confidence = Math.min(85, 50 + Math.max(this.eyeClosedFrames, this.headDownFrames) * 3);
                alertLevel = 'drowsy';
            }

            this.updateDetectionStats(status, confidence);
            this.drawDetectionBox(alertLevel, confidence);

            // Add to history if significant
            if (alertLevel !== 'normal') {
                this.addToHistory(status, confidence);
            }

            // Alert if needed
            if (alertLevel === 'sleeping' && this.alertMode.value !== 'visual') {
                this.triggerAlert();
            }

            // Auto capture image when drowsiness detected
            if (alertLevel === 'sleeping' && this.autoCapture) {
                this.captureAndSaveImage(new Date(), status, confidence);
            }

        } else {
            this.updateDetectionStats('Không phát hiện mặt', 0);
            this.clearOverlay();
        }
    }

    drawDetectionBox(alertLevel, confidence) {
        if (!this.detectionOverlay) return;

        // Clear previous
        this.detectionOverlay.innerHTML = '';

        // Simulate face box position
        const box = document.createElement('div');
        box.className = `detection-box ${alertLevel}`;

        // Random position for demo
        const x = 100 + Math.random() * 200;
        const y = 50 + Math.random() * 150;
        const width = 150 + Math.random() * 50;
        const height = 180 + Math.random() * 40;

        box.style.left = x + 'px';
        box.style.top = y + 'px';
        box.style.width = width + 'px';
        box.style.height = height + 'px';

        // Add label
        const label = document.createElement('div');
        label.className = 'detection-label';
        label.textContent = `${alertLevel.toUpperCase()} (${confidence}%)`;
        box.appendChild(label);

        this.detectionOverlay.appendChild(box);
    }

    clearOverlay() {
        if (this.detectionOverlay) {
            this.detectionOverlay.innerHTML = '';
        }
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

    addToHistory(status, confidence) {
        const timestamp = new Date().toLocaleTimeString();
        const historyItem = {
            time: timestamp,
            status: status,
            confidence: confidence
        };

        this.detectionHistory.unshift(historyItem);

        // Keep only last 10 items
        if (this.detectionHistory.length > 10) {
            this.detectionHistory.pop();
        }

        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        if (!this.historyList) return;

        if (this.detectionHistory.length === 0) {
            this.historyList.innerHTML = '<p class="no-history">Chưa có dữ liệu phát hiện</p>';
            return;
        }

        const historyHTML = this.detectionHistory.map(item =>
            `<div class="history-item">
                ${item.time} - ${item.status} (${item.confidence}%)
            </div>`
        ).join('');

        this.historyList.innerHTML = historyHTML;
    }

    toggleButtons(isRunning) {
        if (this.startDemo) {
            this.startDemo.style.display = isRunning ? 'none' : 'block';
        }
        if (this.stopDemo) {
            this.stopDemo.style.display = isRunning ? 'block' : 'none';
        }
    }

    capturePhoto() {
        if (!this.isRunning || !this.webcam || !this.canvas) {
            this.showNotification('❌ Demo chưa chạy hoặc camera chưa sẵn sàng', 'error');
            return;
        }

        try {
            // Manual capture with current status
            const currentTime = new Date();
            const currentStatus = this.detectionStatus ? this.detectionStatus.textContent : 'Chụp thủ công';
            const currentConfidence = this.confidence ? parseInt(this.confidence.textContent) : 0;

            this.captureAndSaveImage(currentTime, currentStatus, currentConfidence);

        } catch (error) {
            console.error('Error in manual capture:', error);
            this.showNotification('❌ Lỗi khi chụp ảnh', 'error');
        }
    }

    // Image capture and database methods
    captureAndSaveImage(timestamp, status = 'Ngủ gật', confidence = 0) {
        if (!this.webcam || !this.canvas) {
            console.error('Camera or canvas not available for capture');
            return;
        }

        try {
            const captureCanvas = document.createElement('canvas');
            const ctx = captureCanvas.getContext('2d');

            // Set canvas size to match video
            captureCanvas.width = this.webcam.videoWidth || 640;
            captureCanvas.height = this.webcam.videoHeight || 480;

            // Draw current video frame
            ctx.drawImage(this.webcam, 0, 0, captureCanvas.width, captureCanvas.height);

            // Convert to base64 image
            const imageData = captureCanvas.toDataURL('image/jpeg', 0.8);

            // Create image record
            const imageRecord = {
                id: Date.now().toString(),
                timestamp: timestamp.toISOString(),
                timeString: timestamp.toLocaleString('vi-VN'),
                status: status,
                confidence: confidence,
                imageData: imageData,
                size: Math.round(imageData.length * 0.75) // Approximate size in bytes
            };

            // Save to database
            this.saveToDatabase(imageRecord);

            // Show notification
            this.showNotification(`📸 Đã chụp ảnh tự động lúc ${imageRecord.timeString}`, 'info');

            console.log('Image captured and saved:', imageRecord.id);

        } catch (error) {
            console.error('Error capturing image:', error);
            this.showNotification('❌ Lỗi khi chụp ảnh tự động', 'error');
        }
    }

    loadDatabase() {
        try {
            const saved = localStorage.getItem(this.DATABASE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading database:', error);
            return [];
        }
    }

    saveToDatabase(imageRecord) {
        try {
            let database = this.loadDatabase();
            database.push(imageRecord);

            // Keep only last 50 images to prevent storage overflow
            if (database.length > 50) {
                database = database.slice(-50);
            }

            localStorage.setItem(this.DATABASE_KEY, JSON.stringify(database));
            this.imageDatabase = database;

            console.log('Image saved to database. Total images:', database.length);

        } catch (error) {
            console.error('Error saving to database:', error);

            // If storage is full, try to clear old data
            if (error.name === 'QuotaExceededError') {
                this.clearOldImages();
                // Try saving again
                try {
                    let database = this.loadDatabase();
                    database.push(imageRecord);
                    localStorage.setItem(this.DATABASE_KEY, JSON.stringify(database));
                    this.imageDatabase = database;
                } catch (retryError) {
                    console.error('Failed to save even after clearing:', retryError);
                }
            }
        }
    }

    clearDatabase() {
        try {
            localStorage.removeItem(this.DATABASE_KEY);
            this.imageDatabase = [];
            this.showNotification('🗑️ Đã xóa tất cả ảnh đã lưu', 'info');
            console.log('Database cleared');
        } catch (error) {
            console.error('Error clearing database:', error);
        }
    }

    clearOldImages() {
        try {
            let database = this.loadDatabase();
            // Keep only the last 20 images
            database = database.slice(-20);
            localStorage.setItem(this.DATABASE_KEY, JSON.stringify(database));
            this.imageDatabase = database;
            console.log('Cleared old images, kept last 20');
        } catch (error) {
            console.error('Error clearing old images:', error);
        }
    }

    exportDatabase() {
        try {
            const database = this.loadDatabase();
            const dataStr = JSON.stringify(database, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `drowsiness_images_${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            this.showNotification(`📁 Đã xuất ${database.length} ảnh`, 'success');

        } catch (error) {
            console.error('Error exporting database:', error);
            this.showNotification('❌ Lỗi khi xuất dữ liệu', 'error');
        }
    }

    showImageGallery() {
            const database = this.loadDatabase();

            if (database.length === 0) {
                this.showNotification('📷 Chưa có ảnh nào được chụp', 'info');
                return;
            }

            // Create gallery modal
            const modal = document.createElement('div');
            modal.className = 'image-gallery-modal';
            modal.innerHTML = `
            <div class="gallery-content">
                <div class="gallery-header">
                    <h3>📷 Thư viện ảnh (${database.length} ảnh)</h3>
                    <button class="close-gallery">×</button>
                </div>
                <div class="gallery-grid">
                    ${database.map(img => `
                        <div class="gallery-item">
                            <img src="${img.imageData}" alt="Drowsiness ${img.status}">
                            <div class="image-info">
                                <div class="time">${img.timeString}</div>
                                <div class="status ${img.status === 'Ngủ gật' ? 'sleeping' : 'drowsy'}">${img.status}</div>
                                <div class="confidence">${img.confidence}%</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="gallery-actions">
                    <button class="export-btn">📁 Xuất dữ liệu</button>
                    <button class="clear-btn">🗑️ Xóa tất cả</button>
                </div>
            </div>
        `;
        
        // Add gallery styles
        if (!document.getElementById('gallery-styles')) {
            const styles = document.createElement('style');
            styles.id = 'gallery-styles';
            styles.textContent = `
                .image-gallery-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.9);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    box-sizing: border-box;
                }
                .gallery-content {
                    background: white;
                    border-radius: 10px;
                    max-width: 90vw;
                    max-height: 90vh;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .gallery-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                }
                .close-gallery {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                }
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 15px;
                    padding: 20px;
                    overflow-y: auto;
                    max-height: 60vh;
                }
                .gallery-item {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                    background: white;
                }
                .gallery-item img {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                }
                .image-info {
                    padding: 10px;
                    font-size: 12px;
                }
                .image-info .time {
                    color: #666;
                    margin-bottom: 5px;
                }
                .image-info .status {
                    font-weight: bold;
                    margin-bottom: 3px;
                }
                .image-info .status.sleeping {
                    color: #ff4444;
                }
                .image-info .status.drowsy {
                    color: #ff8800;
                }
                .image-info .confidence {
                    color: #888;
                    font-size: 11px;
                }
                .gallery-actions {
                    display: flex;
                    gap: 10px;
                    padding: 20px;
                    border-top: 1px solid #eee;
                }
                .gallery-actions button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                }
                .export-btn {
                    background: #007bff;
                    color: white;
                }
                .clear-btn {
                    background: #dc3545;
                    color: white;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add event listeners
        modal.querySelector('.close-gallery').onclick = () => modal.remove();
        modal.querySelector('.export-btn').onclick = () => {
            this.exportDatabase();
            modal.remove();
        };
        modal.querySelector('.clear-btn').onclick = () => {
            if (confirm('Bạn có chắc muốn xóa tất cả ảnh?')) {
                this.clearDatabase();
                modal.remove();
            }
        };
        
        // Close on background click
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        
        document.body.appendChild(modal);
    }
    
    showNotification(message, type = 'info') {
        try {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `demo-notification ${type}`;
            notification.textContent = message;

            // Add notification styles if not exists
            if (!document.getElementById('notification-styles')) {
                const styles = document.createElement('style');
                styles.id = 'notification-styles';
                styles.textContent = `
                    .demo-notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 15px 20px;
                        border-radius: 5px;
                        font-weight: bold;
                        z-index: 9999;
                        max-width: 300px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        animation: slideIn 0.3s ease-out;
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        line-height: 1.4;
                    }
                    .demo-notification.success {
                        background: #d4edda;
                        color: #155724;
                        border-left: 4px solid #28a745;
                    }
                    .demo-notification.error {
                        background: #f8d7da;
                        color: #721c24;
                        border-left: 4px solid #dc3545;
                    }
                    .demo-notification.warning {
                        background: #fff3cd;
                        color: #856404;
                        border-left: 4px solid #ffc107;
                    }
                    .demo-notification.info {
                        background: #d1ecf1;
                        color: #0c5460;
                        border-left: 4px solid #17a2b8;
                    }
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(styles);
            }

            // Add to page
            document.body.appendChild(notification);

            // Auto remove after 4 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.animation = 'slideIn 0.3s ease-out reverse';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 4000);

        } catch (error) {
            // Fallback to console and alert
            console.log(`${type.toUpperCase()}: ${message}`);
            if (type === 'error') {
                alert(`❌ ${message}`);
            }
        }
    }
    
    triggerAlert() {
        // Simple alert for demo
        if (Date.now() - this.lastDetectionTime > 3000) { // Throttle alerts
            console.log('🚨 CẢNH BÁO: Phát hiện ngủ gật!');
            this.lastDetectionTime = Date.now();
        }
    }
}

// Initialize demo when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the demo page (has demo elements)
    if (document.getElementById('webcam')) {
        window.drowsinessDetector = new DrowsinessDetector();
    }
});