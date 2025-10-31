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
            addMessage('🔍 Đang test AI với Groq API...', 'bot');
            
            const apiKey = localStorage.getItem('groq_api_key');
            if (!apiKey) {
                addMessage('❌ Chưa có API key. Vui lòng nhập Groq API key trước.', 'bot');
                testBtn.textContent = originalText;
                testBtn.disabled = false;
                return;
            }

            // Test thực sự với API
            const testResponse = await getAIResponse('Xin chào! Bạn có thể giới thiệu về mình không?');
            
            if (testResponse && !testResponse.includes('❌')) {
                addMessage('✅ Test thành công! AI Groq hoạt động bình thường.', 'bot');
                addMessage('🤖 ' + testResponse, 'bot');
            } else {
                addMessage('❌ Test thất bại: ' + testResponse, 'bot');
                console.error('Test failed with response:', testResponse);
            }
            
            testBtn.textContent = originalText;
            testBtn.disabled = false;
        } catch (error) {
            addMessage('❌ Test thất bại: ' + error.message, 'bot');
            testBtn.textContent = originalText;
            testBtn.disabled = false;
        }
    });
}

// Load and update AI status
function loadSettings() {
    console.log('loadSettings called');
    if (groqApiKey && aiStatus) {
        const savedApiKey = localStorage.getItem('groq_api_key');
        console.log('Saved API key exists:', !!savedApiKey);
        console.log('API key length:', savedApiKey ? savedApiKey.length : 0);
        
        if (savedApiKey) {
            groqApiKey.value = savedApiKey;
            updateAIStatus('Groq AI (Thực)', 'connected');
            console.log('AI status updated to Groq AI (Thực)');
        } else {
            groqApiKey.value = '';
            updateAIStatus('AI Mô Phỏng (Local)', 'local');
            console.log('AI status updated to AI Mô Phỏng (Local)');
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
    console.log('getAIResponse called with message:', message);
    
    // Phân tích tin nhắn để cập nhật bộ nhớ người dùng
    analyzeUserMessage(message);

    const apiKey = localStorage.getItem('groq_api_key');
    console.log('API key from localStorage:', !!apiKey);
    console.log('API key length:', apiKey ? apiKey.length : 0);
    
    const userMemory = getUserMemory();
    const conversationHistory = getConversationHistory().slice(-5); // 5 cuộc trò chuyện gần nhất

    if (apiKey) {
        console.log('API key found, attempting Groq API call');
        try {
            console.log('Attempting to connect to Groq API...');
            
            // Tạo context từ bộ nhớ người dùng
            let systemPrompt = `Bạn là AI assistant thông minh và hữu ích, tương tự như ChatGPT. Bạn có thể trả lời mọi câu hỏi về bất kỳ chủ đề nào một cách chi tiết và chính xác.

QUAN TRỌNG - NGÔN NGỮ:
- LUÔN LUÔN trả lời bằng tiếng Việt trừ khi được yêu cầu rõ ràng "answer in English" hoặc "trả lời bằng tiếng Anh"
- Nếu user hỏi bằng tiếng Anh nhưng KHÔNG yêu cầu trả lời bằng tiếng Anh, vẫn trả lời bằng tiếng Việt
- Chỉ trả lời bằng tiếng Anh khi có yêu cầu cụ thể

CHUYÊN MÔN CHÍNH:
- Computer Vision và Machine Learning
- YOLO Object Detection
- Drowsiness Detection
- Web Development (Frontend/Backend)
- AI và Deep Learning
- Lập trình và công nghệ
- Học tập và giáo dục
- Cuộc sống hàng ngày

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
- Trả lời mọi câu hỏi một cách chi tiết, hữu ích và chính xác như ChatGPT
- Nếu câu hỏi không liên quan đến chuyên môn chính, vẫn trả lời đầy đủ và hữu ích
- Sử dụng thông tin cá nhân để đưa ra câu trả lời phù hợp và cá nhân hóa
- Thân thiện, nhiệt tình và sẵn sàng giúp đỡ
- Nhớ các cuộc trò chuyện trước đó để tạo context liên tục
- Luôn trả lời bằng tiếng Việt trừ khi được yêu cầu rõ ràng khác
- Nếu không biết câu trả lời, hãy thành thật và đề xuất cách tìm hiểu thêm
- Đưa ra ví dụ cụ thể khi có thể để giải thích rõ hơn
- Sử dụng emoji phù hợp để làm câu trả lời sinh động hơn`;

            // Thêm lịch sử trò chuyện vào context
            const messages = [{ role: 'system', content: systemPrompt }];

            // Thêm 3 cuộc trò chuyện gần nhất để AI nhớ context
            conversationHistory.slice(-3).forEach(conv => {
                messages.push({ role: 'user', content: conv.user });
                messages.push({ role: 'assistant', content: conv.bot });
            });

            // Thêm tin nhắn hiện tại
            messages.push({ role: 'user', content: message });

            console.log('Sending request to Groq API with', messages.length, 'messages');
            console.log('API Key present:', !!apiKey);
            console.log('Model: llama3-8b-8192');

            // Tạo AbortController để timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 giây timeout

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama3-8b-8192',
                    messages: messages,
                    max_tokens: 1000,
                    temperature: 0.7,
                    stream: false
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            console.log('Groq API response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Groq API response data:', data);
                
                if (data.choices && data.choices[0] && data.choices[0].message) {
                const botResponse = data.choices[0].message.content;

                // Lưu cuộc trò chuyện
                saveConversation(message, botResponse);

                    console.log('Successfully got AI response from Groq');
                return botResponse;
            } else {
                    console.error('Invalid response structure from Groq API:', data);
                    throw new Error('Invalid response from Groq API');
                }
            } else {
                const errorData = await response.text();
                console.error('Groq API error:', response.status, errorData);
                
                if (response.status === 401) {
                    throw new Error('API key không hợp lệ. Vui lòng kiểm tra lại API key.');
                } else if (response.status === 429) {
                    throw new Error('Quá nhiều request. Vui lòng thử lại sau.');
                } else if (response.status >= 500) {
                    throw new Error('Lỗi server từ Groq API. Vui lòng thử lại sau.');
                } else {
                    throw new Error(`Lỗi API: ${response.status}`);
                }
            }
        } catch (error) {
            console.error('Groq API failed:', error);
            
            // Hiển thị lỗi cụ thể cho user và KHÔNG fallback về simulated AI
            if (error.name === 'AbortError') {
                addMessage('❌ Request timeout. API không phản hồi trong 30 giây.', 'bot');
                return '❌ Request timeout. API không phản hồi trong 30 giây. Vui lòng thử lại.';
            } else if (error.message.includes('API key')) {
                addMessage('❌ ' + error.message + ' Vui lòng kiểm tra Settings ⚙️', 'bot');
                return '❌ API key không hợp lệ. Vui lòng kiểm tra lại API key trong Settings ⚙️';
            } else if (error.message.includes('fetch') || error.message.includes('network')) {
                addMessage('❌ Không thể kết nối đến Groq API. Kiểm tra kết nối internet.', 'bot');
                return '❌ Không thể kết nối đến Groq API. Vui lòng kiểm tra kết nối internet và thử lại.';
            } else if (error.message.includes('429')) {
                addMessage('❌ Quá nhiều request. Vui lòng đợi và thử lại sau.', 'bot');
                return '❌ Quá nhiều request. Vui lòng đợi và thử lại sau.';
            } else {
                addMessage('❌ Lỗi kết nối API: ' + error.message, 'bot');
                return '❌ Lỗi kết nối API: ' + error.message + '. Vui lòng thử lại sau.';
            }
        }
    } else {
        console.log('No API key found, using fallback response');
        console.log('Falling back to getIntelligentFallbackResponse');
    // Fallback to intelligent simulated responses using user memory
    return getIntelligentFallbackResponse(message);
    }
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

    // Lưu trữ lịch sử responses để tránh lặp lại
    const lastResponses = JSON.parse(localStorage.getItem('last_ai_responses') || '[]');
    
    // Database các phản hồi thông minh
    const responseDatabase = {
        yolo: [
            `${greeting}YOLO (You Only Look Once) là thuật toán nhận dạng đối tượng thời gian thực được phát triển bởi Joseph Redmon vào năm 2016. Nó có thể phát hiện và phân loại nhiều đối tượng trong một hình ảnh chỉ với một lần nhìn, rất hiệu quả cho ứng dụng thời gian thực!`,
            `${greeting}YOLO là một breakthrough trong computer vision! Khác với R-CNN hay SSD, YOLO xử lý toàn bộ hình ảnh trong một lần forward pass, giúp đạt tốc độ cao hơn nhiều. Trong dự án này, chúng ta sử dụng YOLO để phát hiện trạng thái ngủ gật của sinh viên.`,
            `${greeting}YOLO có nhiều phiên bản từ v1 (2016) đến v8 (2023). Mỗi phiên bản đều có cải tiến về độ chính xác và tốc độ. Dự án này đạt được mAP 94.2% và chạy với tốc độ 25 FPS!`,
            `${greeting}YOLO sử dụng kiến trúc CNN để trích xuất đặc trưng từ hình ảnh, sau đó dự đoán bounding boxes và class probabilities trong một lần forward pass duy nhất.`,
            `${greeting}Ưu điểm của YOLO so với các phương pháp khác là tốc độ xử lý nhanh và có thể phát hiện nhiều đối tượng cùng lúc với độ chính xác cao.`
        ],
        detection: [
            `${greeting}Nhận diện đối tượng (Object Detection) là quá trình xác định và định vị các đối tượng trong hình ảnh hoặc video. Các thuật toán phổ biến bao gồm R-CNN, SSD, và YOLO.`,
            `${greeting}Trong dự án này, chúng ta sử dụng computer vision để phát hiện các dấu hiệu ngủ gật như nhắm mắt, cúi đầu, hoặc giảm hoạt động của mắt.`,
            `${greeting}Quá trình nhận diện bao gồm: thu thập dữ liệu → gán nhãn → huấn luyện mô hình → đánh giá hiệu suất.`,
            `${greeting}Object Detection khác với Image Classification ở chỗ nó không chỉ phân loại mà còn định vị chính xác vị trí của đối tượng trong hình ảnh.`,
            `${greeting}Để phát hiện ngủ gật, chúng ta cần train model với dataset chứa các hình ảnh sinh viên trong các trạng thái khác nhau: tỉnh táo, buồn ngủ, và ngủ gật.`
        ],
        machine_learning: [
            `${greeting}Machine Learning là lĩnh vực nghiên cứu các thuật toán và mô hình thống kê cho phép máy tính học từ dữ liệu mà không cần được lập trình rõ ràng.`,
            `${greeting}Deep Learning là một nhánh của ML sử dụng mạng nơ-ron nhân tạo với nhiều lớp để học các đặc trưng phức tạp từ dữ liệu.`,
            `${greeting}CNN (Convolutional Neural Network) là kiến trúc mạng nơ-ron chuyên biệt cho xử lý dữ liệu có cấu trúc lưới như hình ảnh.`,
            `${greeting}Supervised Learning là phương pháp học có giám sát, sử dụng dữ liệu đã được gán nhãn để train model. YOLO sử dụng phương pháp này.`,
            `${greeting}Transfer Learning là kỹ thuật sử dụng pre-trained model để cải thiện hiệu suất trên task mới, giúp tiết kiệm thời gian và tài nguyên.`
        ],
        project: [
            `${greeting}Đây là dự án nghiên cứu về ứng dụng YOLO trong phát hiện sinh viên ngủ gật trong lớp học. Mục tiêu là cải thiện chất lượng học tập và giúp giáo viên theo dõi tình trạng sinh viên.`,
            `${greeting}Dự án được thực hiện bởi Nguyễn Hoàng Anh Khoa, sinh viên năm cuối ngành Công nghệ thông tin tại Đại học Đà Lạt.`,
            `${greeting}Kết quả đạt được: mAP 94.2%, Precision 96.8%, Recall 92.1%, tốc độ xử lý 25 FPS.`,
            `${greeting}Dự án sử dụng dataset gồm 5000+ hình ảnh sinh viên được gán nhãn cẩn thận để train YOLO model.`,
            `${greeting}Ứng dụng thực tế của dự án có thể giúp giáo viên phát hiện sinh viên ngủ gật và có biện pháp can thiệp kịp thời.`
        ],
        greeting: [
            `Xin chào ${userMemory.name || 'bạn'}! Tôi là AI Assistant cho dự án YOLO nhận diện ngủ gật. Tôi có thể giúp bạn tìm hiểu về computer vision, machine learning, và các thuật toán YOLO.`,
            `Chào ${userMemory.name || 'bạn'}! Rất vui được gặp bạn. Tôi đang chạy ở chế độ demo - hãy thêm API key trong Settings ⚙️ để có trải nghiệm AI thực!`,
            `Hello ${userMemory.name || 'bạn'}! Tôi có thể trả lời các câu hỏi về YOLO, object detection, và dự án nghiên cứu này.`,
            `Hi ${userMemory.name || 'bạn'}! 👋 Tôi đây để hỗ trợ bạn tìm hiểu về YOLO và computer vision. Có gì thắc mắc cứ hỏi nhé!`,
            `Chào mừng ${userMemory.name || 'bạn'} đến với YOLO AI! 🤖 Tôi sẵn sàng giải đáp mọi thắc mắc về dự án này.`
        ],
        contact: [
            `${greeting}Bạn có thể liên hệ với tác giả qua email: nhakhoa1004@gmail.com hoặc số điện thoại: 0395123864`,
            `${greeting}Để biết thêm chi tiết về dự án, hãy liên hệ Nguyễn Hoàng Anh Khoa qua email nhakhoa1004@gmail.com`,
            `${greeting}Thông tin liên hệ: Email nhakhoa1004@gmail.com, Phone 0395123864`,
            `${greeting}📧 Email: nhakhoa1004@gmail.com | 📱 Phone: 0395123864 | 👨‍💻 GitHub: github.com/jkhoa`,
            `${greeting}Liên hệ tác giả: nhakhoa1004@gmail.com hoặc 0395123864 để được hỗ trợ chi tiết về dự án.`
        ],
        thanks: [
            `${greeting}Rất vui được giúp đỡ bạn! Hy vọng thông tin hữu ích cho việc nghiên cứu của bạn.`,
            `${greeting}Cảm ơn bạn đã quan tâm đến dự án! Chúc bạn học tập và nghiên cứu thành công.`,
            `${greeting}Không có gì! Nếu có câu hỏi gì khác về YOLO hoặc computer vision, cứ hỏi nhé!`,
            `${greeting}Rất vui được hỗ trợ! 🎉 Chúc bạn thành công với việc nghiên cứu AI và computer vision!`,
            `${greeting}Cảm ơn bạn! 🙏 Hy vọng dự án YOLO này sẽ hữu ích cho việc học tập của bạn.`
        ],
        general: [
            `${greeting}Cảm ơn bạn đã hỏi! Tôi có thể giúp bạn tìm hiểu về YOLO, nhận diện ngủ gật, AI, camera và demo này. Bạn có câu hỏi cụ thể nào không?`,
            `${greeting}Tôi có thể hỗ trợ bạn về nhiều chủ đề: YOLO algorithm, computer vision, machine learning, hoặc cách sử dụng demo này. Bạn muốn tìm hiểu gì?`,
            `${greeting}Hãy cho tôi biết bạn quan tâm đến khía cạnh nào của dự án: lý thuyết YOLO, cách hoạt động của camera demo, hay kỹ thuật implementation?`,
            `${greeting}🤔 Bạn có thể hỏi tôi về: YOLO algorithm, object detection, computer vision, hoặc cách sử dụng các tính năng của website này.`,
            `${greeting}💡 Tôi sẵn sàng giải thích về YOLO, machine learning, hoặc hướng dẫn sử dụng camera demo. Bạn muốn biết gì?`,
            `${greeting}Đây là một câu hỏi thú vị! Tôi có thể giúp bạn với nhiều chủ đề khác nhau. Bạn có muốn hỏi về công nghệ, học tập, hay điều gì khác không?`,
            `${greeting}Tôi là AI assistant đa năng! Có thể trả lời về YOLO, computer vision, hoặc bất kỳ chủ đề nào bạn quan tâm. Hãy hỏi tôi!`,
            `${greeting}🎯 Tôi có thể giúp bạn với nhiều câu hỏi khác nhau. Từ công nghệ AI đến cuộc sống hàng ngày, cứ hỏi thoải mái!`
        ]
    };

    // Logic phân tích và phản hồi thông minh với tránh lặp lại
    let selectedCategory = 'general';
    let responses = [];

    if (lowerMessage.includes('yolo') || lowerMessage.includes('object detection')) {
        selectedCategory = 'yolo';
        responses = responseDatabase.yolo;
    } else if (lowerMessage.includes('machine learning') || lowerMessage.includes('ai') || lowerMessage.includes('deep learning')) {
        selectedCategory = 'machine_learning';
        responses = responseDatabase.machine_learning;
    } else if (lowerMessage.includes('nhận diện') || lowerMessage.includes('detection')) {
        selectedCategory = 'detection';
        responses = responseDatabase.detection;
    } else if (lowerMessage.includes('dự án') || lowerMessage.includes('project') || lowerMessage.includes('khoa')) {
        selectedCategory = 'project';
        responses = responseDatabase.project;
    } else if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('chào')) {
        selectedCategory = 'greeting';
        responses = responseDatabase.greeting;
    } else if (lowerMessage.includes('liên hệ') || lowerMessage.includes('contact') || lowerMessage.includes('email')) {
        selectedCategory = 'contact';
        responses = responseDatabase.contact;
    } else if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thanks') || lowerMessage.includes('thank')) {
        selectedCategory = 'thanks';
        responses = responseDatabase.thanks;
    } else {
        selectedCategory = 'general';
        responses = responseDatabase.general;
    }

    // Tránh lặp lại response gần đây
    let availableResponses = responses.filter(resp => !lastResponses.includes(resp));
    if (availableResponses.length === 0) {
        // Nếu tất cả responses đã được dùng, reset và dùng lại
        availableResponses = responses;
        localStorage.setItem('last_ai_responses', JSON.stringify([]));
    }

    // Chọn response ngẫu nhiên từ danh sách có sẵn
    response = availableResponses[Math.floor(Math.random() * availableResponses.length)];
    
    // Lưu response này vào lịch sử (giữ tối đa 3 responses gần nhất)
    lastResponses.push(response);
    if (lastResponses.length > 3) {
        lastResponses.shift();
    }
    localStorage.setItem('last_ai_responses', JSON.stringify(lastResponses));

    // Thêm thông tin cá nhân hóa
    if (selectedCategory === 'yolo') {
        if (userMemory.personal_info?.profession === 'sinh viên') {
            response += " Đây là chủ đề rất thú vị cho nghiên cứu học tập của bạn!";
        }
        response += " Đây là AI demo - hãy thêm API key trong Settings ⚙️ để có câu trả lời chi tiết hơn!";
    } else if (selectedCategory === 'machine_learning') {
        if (userMemory.interests && userMemory.interests.includes('machine learning')) {
            response += " Tôi nhớ bạn có quan tâm đến ML rồi!";
        }
        response += " Để có trải nghiệm AI thực, hãy cấu hình API key trong Settings!";
    } else if (selectedCategory === 'greeting') {
        if (conversationHistory.length > 0) {
            response += " Vui lòng gặp lại bạn!";
        }
    } else if (selectedCategory === 'general') {
        response += " Để có trải nghiệm AI thực, hãy thêm Groq API key trong Settings ⚙️!";
    }

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

// Send message function
async function sendChatbotMessage() {
    const message = chatbotInput.value.trim();
    console.log('sendChatbotMessage called with message:', message);
    
    if (message === '') return;

    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';

    // Show typing indicator
    addMessage('🤖 Đang suy nghĩ...', 'bot');

    try {
        console.log('Calling getAIResponse...');
        // Get AI response
        const response = await getAIResponse(message);
        console.log('Got response from getAIResponse:', response);

        // Remove typing indicator
        const messages = chatbotMessages.children;
        if (messages.length > 0 && messages[messages.length - 1].textContent.includes('Đang suy nghĩ')) {
            chatbotMessages.removeChild(messages[messages.length - 1]);
        }

        addMessage(response, 'bot');
    } catch (error) {
        console.error('Error in sendChatbotMessage:', error);
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

        // Simplified settings (removed complex settings)
        this.sensitivity = null; // Removed for simplicity
        this.sensitivityValue = null;
        this.alertMode = null;

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
        console.log('loadDatabase called');
        try {
            const stored = localStorage.getItem(this.DATABASE_KEY);
            this.imageDatabase = stored ? JSON.parse(stored) : [];
            
            console.log('Loaded from localStorage:', this.imageDatabase.length, 'items');
            
            // Nếu không có dữ liệu, tạo dữ liệu mẫu
            if (this.imageDatabase.length === 0) {
                console.log('No data found, creating sample data');
                this.createSampleData();
            }
            
            console.log(`Loaded ${this.imageDatabase.length} images from database`);
            this.updateImageGallery();
            this.updateDatabaseStats();
        } catch (error) {
            console.error('Error loading database:', error);
            this.imageDatabase = [];
            // Tạo sample data ngay cả khi có lỗi
            this.createSampleData();
            this.updateDatabaseStats();
        }
    }

    // Tạo dữ liệu mẫu để demo
    createSampleData() {
        console.log('createSampleData called');
        const sampleData = [
            {
                id: 1,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 giờ trước
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkF3YWtlPC90ZXh0Pjwvc3ZnPg==',
                detection: {
                    status: 'awake',
                    confidence: 95.2,
                    eyeClosedFrames: 0,
                    headDownFrames: 0
                },
                formatted_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('vi-VN')
            },
            {
                id: 2,
                timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 giờ trước
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZlYWE1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRyb3dzeTwvdGV4dD48L3N2Zz4=',
                detection: {
                    status: 'drowsy',
                    confidence: 78.5,
                    eyeClosedFrames: 8,
                    headDownFrames: 5
                },
                formatted_time: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toLocaleString('vi-VN')
            },
            {
                id: 3,
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 giờ trước
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2YjYxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNsZWVwaW5nPC90ZXh0Pjwvc3ZnPg==',
                detection: {
                    status: 'sleeping',
                    confidence: 89.7,
                    eyeClosedFrames: 20,
                    headDownFrames: 15
                },
                formatted_time: new Date(Date.now() - 1 * 60 * 60 * 1000).toLocaleString('vi-VN')
            },
            {
                id: 4,
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 phút trước
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkF3YWtlPC90ZXh0Pjwvc3ZnPg==',
                detection: {
                    status: 'awake',
                    confidence: 96.1,
                    eyeClosedFrames: 0,
                    headDownFrames: 0
                },
                formatted_time: new Date(Date.now() - 30 * 60 * 1000).toLocaleString('vi-VN')
            },
            {
                id: 5,
                timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 phút trước
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZlYWE1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRyb3dzeTwvdGV4dD48L3N2Zz4=',
                detection: {
                    status: 'drowsy',
                    confidence: 82.3,
                    eyeClosedFrames: 6,
                    headDownFrames: 4
                },
                formatted_time: new Date(Date.now() - 15 * 60 * 1000).toLocaleString('vi-VN')
            }
        ];

        this.imageDatabase = sampleData;
        localStorage.setItem(this.DATABASE_KEY, JSON.stringify(this.imageDatabase));
        console.log('Created sample data for demo');
    }

    // Cập nhật thống kê database
    updateDatabaseStats() {
        console.log('updateDatabaseStats called, imageDatabase length:', this.imageDatabase.length);
        
        const totalDetections = this.imageDatabase.length;
        const sleepingCount = this.imageDatabase.filter(item => item.detection.status === 'sleeping').length;
        const drowsyCount = this.imageDatabase.filter(item => item.detection.status === 'drowsy').length;
        const awakeCount = this.imageDatabase.filter(item => item.detection.status === 'awake').length;
        
        console.log('Stats:', { totalDetections, sleepingCount, drowsyCount, awakeCount });
        
        // Cập nhật UI
        const totalDetectionsEl = document.getElementById('totalDetections');
        const sleepingCountEl = document.getElementById('sleepingCount');
        const drowsyCountEl = document.getElementById('drowsyCount');
        const todayCountEl = document.getElementById('todayCount');

        console.log('Elements found:', { 
            totalDetectionsEl: !!totalDetectionsEl, 
            sleepingCountEl: !!sleepingCountEl, 
            drowsyCountEl: !!drowsyCountEl, 
            todayCountEl: !!todayCountEl 
        });

        if (totalDetectionsEl) totalDetectionsEl.textContent = totalDetections;
        if (sleepingCountEl) sleepingCountEl.textContent = sleepingCount;
        if (drowsyCountEl) drowsyCountEl.textContent = drowsyCount;
        if (todayCountEl) todayCountEl.textContent = totalDetections; // Giả sử tất cả là hôm nay

        // Cập nhật database status
        const dbStatusEl = document.getElementById('dbStatus');
        console.log('dbStatusEl found:', !!dbStatusEl);
        
        if (dbStatusEl) {
            if (totalDetections > 0) {
                dbStatusEl.textContent = `Đã kết nối (${totalDetections} records)`;
                dbStatusEl.style.color = '#4CAF50'; // Màu xanh
                console.log('Database status updated to connected');
            } else {
                dbStatusEl.textContent = 'Chưa có dữ liệu';
                dbStatusEl.style.color = '#FF9800'; // Màu cam
                console.log('Database status updated to no data');
            }
        }
    }

    // Cập nhật gallery hiển thị
    updateImageGallery() {
        const galleryList = document.getElementById('databaseList');
        if (!galleryList) return;

        if (this.imageDatabase.length === 0) {
            galleryList.innerHTML = '<p class="no-history">Chưa có dữ liệu trong database</p>';
            return;
        }

        const galleryHTML = this.imageDatabase.map(item => {
            const statusClass = item.detection.status === 'sleeping' ? 'status-sleeping' : 
                               item.detection.status === 'drowsy' ? 'status-drowsy' : 'status-awake';
            const statusText = item.detection.status === 'sleeping' ? 'Ngủ gật' : 
                              item.detection.status === 'drowsy' ? 'Buồn ngủ' : 'Tỉnh táo';
            
            return `
                <div class="gallery-item">
                    <div class="gallery-image">
                        <img src="${item.image}" alt="Detection ${item.id}" />
                        <div class="status-badge ${statusClass}">${statusText}</div>
                    </div>
                    <div class="gallery-info">
                        <h4>Phát hiện #${item.id}</h4>
                        <p><strong>Thời gian:</strong> ${item.formatted_time}</p>
                        <p><strong>Trạng thái:</strong> <span class="${statusClass}">${statusText}</span></p>
                        <p><strong>Độ tin cậy:</strong> ${item.detection.confidence}%</p>
                        <p><strong>Eye Closed Frames:</strong> ${item.detection.eyeClosedFrames}</p>
                        <p><strong>Head Down Frames:</strong> ${item.detection.headDownFrames}</p>
                    </div>
                </div>
            `;
        }).join('');

        galleryList.innerHTML = galleryHTML;
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

    async clearDatabase() {
        this.log("Attempting to clear database on server...");
        try {
            const response = await fetch('http://localhost:3000/api/detections', {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.log("Successfully cleared database on server.");
            this.database = [];
            this.renderDatabase();
        } catch (error) {
            console.error("Failed to clear database:", error);
            this.log(`Error: Could not clear database on server. Details: ${error.message}`);
        }
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

            // Simple status styling
            this.statusIndicator.style.background = isActive ?
                'rgba(40, 167, 69, 0.2)' :
                'rgba(255, 255, 255, 0.1)';
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
            this.historyList.innerHTML = 'Chưa có dữ liệu phát hiện';
            return;
        }

        const historyHTML = this.detectionHistory.map(item =>
            `<div class="history-item">${item.time} - ${item.status} (${item.confidence}%)</div>`
        ).join('');

        this.historyList.innerHTML = historyHTML;
    }
    toggleButtons(isRunning) {
        if (this.startDemo) {
            this.startDemo.style.display = isRunning ? 'none' : 'inline-flex';
        }
        if (this.stopDemo) {
            this.stopDemo.style.display = isRunning ? 'inline-flex' : 'none';
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
    async captureAndSaveImage() {
        if (!this.videoElement || this.videoElement.readyState < 2) {
            this.log("Video not ready for capture.");
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = this.videoElement.videoWidth;
        canvas.height = this.videoElement.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg');
        const notesInput = document.getElementById('notesInput');
        const notes = notesInput ? notesInput.value : null;

        this.log("Attempting to save detection to server...");

        try {
            const response = await fetch('http://localhost:3000/api/detections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageData, notes }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.log("Successfully saved detection to the database via server.");
            if (notesInput) {
                notesInput.value = ''; // Clear the notes input after saving
            }
            await this.loadDatabase();
        } catch (error) {
            console.error("Failed to save image:", error);
            this.log(`Error: Could not save detection to server. Details: ${error.message}`);
        }
    }

    async loadDatabase() {
        try {
            const response = await fetch('http://localhost:3000/api/detections', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.database = data.map(item => ({
                id: item.ID,
                timestamp: item.Timestamp,
                image: item.ImageData,
                notes: item.Notes
            }));
            this.log(`Successfully loaded ${this.database.length} records from the database.`);
            this.renderDatabase();
        } catch (error) {
            console.error('Failed to load database:', error);
            this.log(`Error: Could not load database from server. Details: ${error.message}`);
        }
    }

    renderDatabase() {
            if (!this.dbList) return;

            if (this.database.length === 0) {
                this.dbList.innerHTML = '<li>Chưa có dữ liệu.</li>';
                return;
            }

            const listItems = this.database.map(item => `
            <li>
                <strong>STT:</strong> ${item.id}<br>
                <strong>Thời gian:</strong> ${new Date(item.timestamp).toLocaleString()}<br>
                ${item.notes ? `<strong>Ghi chú:</strong> ${this.escapeHTML(item.notes)}<br>` : ''}
                <img src="${item.image}" alt="Detection Image" width="200">
            </li>
        `).join('');

        this.dbList.innerHTML = `<ul>${listItems}</ul>`;
    }

    escapeHTML(str) {
        return str.replace(/[&<>"']/g, (match) => {
            const escape = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return escape[match];
        });
    }
}

// ==================== AUTHENTICATION SYSTEM ====================

// API Configuration
const API_BASE_URL = 'https://webyolo-backend.railway.app';
const TOKEN_KEY = 'webyolo_token';
const USER_KEY = 'webyolo_user';

// Login Modal Elements
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeLogin = document.getElementById('closeLogin');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

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
        loginModal.classList.remove('active');
        loginForm.reset();
        loginError.style.display = 'none';

        // Show success message
        showNotification('Đăng nhập thành công!', 'success');

        return data;
    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
        loginError.style.display = 'block';
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
    loginBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    userName.textContent = `${user.username} (${user.role})`;
    
    // Add badge for admin
    if (user.role === 'Admin') {
        userName.innerHTML = `${user.username} <span style="background: #FFD700; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; margin-left: 8px;">ADMIN</span>`;
    }
}

// Update UI after logout
function updateUIAfterLogout() {
    loginBtn.style.display = 'flex';
    userInfo.style.display = 'none';
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
    // Simple notification (can be enhanced)
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

// Event Listeners
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
    });
}

if (closeLogin) {
    closeLogin.addEventListener('click', () => {
        loginModal.classList.remove('active');
        loginForm.reset();
        loginError.style.display = 'none';
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
            loginForm.reset();
            loginError.style.display = 'none';
        }
    });
}

// Initialize demo when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status
    checkAuthStatus();
    
    // Check if we're on the demo page (has demo elements)
    if (document.getElementById('webcam')) {
        window.drowsinessDetector = new DrowsinessDetector();
    }
});