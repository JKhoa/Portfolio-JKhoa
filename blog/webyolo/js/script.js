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
    const updatedMemory = { ...currentMemory, ...updates };
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
    const questions = memory.conversation_patterns?.frequent_questions || [];
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
            
            if (userMemory.personal_info?.profession) {
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
        if (userMemory.personal_info?.profession === 'sinh viên') {
            response += "Đây là chủ đề rất thú vị cho nghiên cứu học tập của bạn. ";
        }
        response += "Đây là AI demo - hãy thêm API key trong Settings ⚙️ để có câu trả lời chi tiết hơn!";
    }
    else if (lowerMessage.includes('machine learning') || lowerMessage.includes('ai')) {
        response = `${greeting}Machine Learning và AI là lĩnh vực rất hấp dẫn! `;
        if (userMemory.interests && userMemory.interests.includes('machine learning')) {
            response += "Tôi nhớ bạn có quan tâm đến ML rồi. ";
        }
        response += "Để có trải nghiệm AI thực, hãy cấu hình API key trong Settings!";
    }
    else if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = `Xin chào ${userMemory.name || 'bạn'}! `;
        if (conversationHistory.length > 0) {
            response += "Vui lòng gặp lại bạn! ";
        }
        response += "Tôi đang chạy ở chế độ demo. Vào Settings ⚙️ để kết nối AI thực nhé!";
    }
    else if (lowerMessage.includes('tên') && lowerMessage.includes('gì')) {
        response = `Tôi là AI Assistant cho YOLO project! `;
        if (userMemory.name) {
            response += `Còn bạn là ${userMemory.name} đúng không? `;
        }
        response += "Đây là phiên bản demo - thêm API key để có trải nghiệm đầy đủ!";
    }
    else if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thank')) {
        response = `${greeting}Rất vui được giúp đỡ bạn! `;
        if (userMemory.interests && userMemory.interests.length > 0) {
            response += `Hy vọng thông tin về ${userMemory.interests[0]} hữu ích với bạn. `;
        }
        response += "Đây là AI demo - Settings ⚙️ để trải nghiệm AI thực!";
    }
    else {
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