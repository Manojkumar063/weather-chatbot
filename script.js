// Replace with your OpenAI API key
const OPENAI_API_KEY = 'your-api-key-here';

// Chat context to maintain conversation history
let chatHistory = [
    {
        role: "system",
        content: `You are a friendly and knowledgeable weather assistant. You help users with:
        1. Weather-related questions and explanations
        2. Weather forecasts and predictions
        3. Weather phenomena understanding
        4. Weather safety tips
        Keep responses concise and friendly. If asked about real-time weather, explain that you don't have access to current weather data but can explain weather concepts and provide general guidance.`
    }
];

function addMessage(message, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function getAIResponse(userMessage) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: chatHistory,
                temperature: 0.7,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
        return "I'm having trouble connecting to my brain right now. Please try again later.";
    }
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const message = userInput.value.trim();
    
    if (message) {
        // Disable input and button while processing
        userInput.disabled = true;
        sendButton.disabled = true;
        
        // Add user message to chat
        addMessage(message, true);
        userInput.value = '';
        
        // Add user message to chat history
        chatHistory.push({
            role: "user",
            content: message
        });

        // Show typing indicator
        showTypingIndicator();
        
        // Get AI response
        const response = await getAIResponse(message);
        
        // Remove typing indicator and add AI response
        removeTypingIndicator();
        addMessage(response);
        
        // Add AI response to chat history
        chatHistory.push({
            role: "assistant",
            content: response
        });
        
        // Re-enable input and button
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}

// Handle Enter key press
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Start the conversation
window.onload = () => {
    addMessage("Hello! I'm your AI Weather Assistant. I can help you understand weather patterns, phenomena, and provide general weather-related information. What would you like to know about the weather?");
}; 