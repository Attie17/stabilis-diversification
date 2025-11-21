// Reusable AI Chat Component
// Can be embedded in any page for context-aware AI assistance

class AIChatComponent {
    constructor(containerId, context = {}) {
        this.container = document.getElementById(containerId);
        this.context = context; // Page-specific context (e.g., project name)
        this.threadId = null;
        this.messages = [];
        this.isTyping = false;

        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="ai-chat-widget">
                <div class="ai-chat-header">
                    <div class="ai-chat-title">
                        <span class="ai-icon">🤖</span>
                        <span>AI Executive Assistant</span>
                    </div>
                    <div class="ai-chat-actions">
                        <button class="ai-chat-minimize" onclick="this.closest('.ai-chat-widget').classList.toggle('minimized')" title="Minimize">−</button>
                    </div>
                </div>
                
                <div class="ai-chat-body">
                    <div class="ai-chat-messages" id="ai-messages-${this.container.id}">
                        <div class="ai-welcome-message">
                            <div class="ai-avatar">🤖</div>
                            <div class="ai-message-content">
                                <p>Hello! I'm your AI Executive Assistant. I can help you with:</p>
                                <ul>
                                    <li>📊 Critical alerts and risks</li>
                                    <li>💰 Revenue projections and variance</li>
                                    <li>📝 Recent project changes</li>
                                    <li>🎯 Milestone status and deadlines</li>
                                    <li>🔍 Research and business intelligence</li>
                                </ul>
                                <p>Ask me anything about your projects!</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ai-suggested-questions">
                        <button class="ai-suggestion-chip" data-question="What are my critical alerts?">
                            🚨 Critical alerts
                        </button>
                        <button class="ai-suggestion-chip" data-question="Show me the revenue projection">
                            💰 Revenue projection
                        </button>
                        <button class="ai-suggestion-chip" data-question="What changed recently?">
                            📝 Recent changes
                        </button>
                        <button class="ai-suggestion-chip" data-question="Which milestones are overdue?">
                            ⏰ Overdue milestones
                        </button>
                    </div>
                    
                    <div class="ai-chat-input-area">
                        <textarea 
                            id="ai-input-${this.container.id}" 
                            class="ai-chat-input" 
                            placeholder="Ask me anything about your projects..."
                            rows="2"
                        ></textarea>
                        <button id="ai-send-${this.container.id}" class="ai-send-btn" title="Send message">
                            <span class="send-icon">➤</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const input = document.getElementById(`ai-input-${this.container.id}`);
        const sendBtn = document.getElementById(`ai-send-${this.container.id}`);

        // Send on button click
        sendBtn.addEventListener('click', () => this.sendMessage());

        // Send on Enter (Shift+Enter for new line)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Suggested questions
        const suggestions = this.container.querySelectorAll('.ai-suggestion-chip');
        suggestions.forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.getAttribute('data-question');
                input.value = question;
                this.sendMessage();
            });
        });
    }

    async sendMessage() {
        const input = document.getElementById(`ai-input-${this.container.id}`);
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        // Clear input
        input.value = '';

        // Add user message to UI
        this.addMessage('user', message);

        // Show typing indicator
        this.showTyping();
        this.isTyping = true;

        try {
            // Add context to message if available
            let contextualMessage = message;
            if (this.context.project) {
                contextualMessage = `[Context: ${this.context.project} project] ${message}`;
            }

            // Always use full backend URL for API calls
            const backendUrl = 'https://stabilis-diversification.onrender.com';
            const apiEndpoint = `${backendUrl}/api/ai/chat`;

            // Send to AI
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: contextualMessage,
                    thread_id: this.threadId
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            this.handleAIResponse(data);
        } catch (error) {
            this.handleError(error);
        }

        this.isTyping = false;
    }

    addMessage(role, content) {
        const messagesContainer = document.getElementById(`ai-messages-${this.container.id}`);

        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-chat-message ai-${role}-message`;

        if (role === 'assistant') {
            messageDiv.innerHTML = `
                <div class="ai-avatar">🤖</div>
                <div class="ai-message-content">${this.formatMessage(content)}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-message-content">${this.escapeHtml(content)}</div>
                <div class="user-avatar">👤</div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.messages.push({ role, content });
    }

    showTyping() {
        const messagesContainer = document.getElementById(`ai-messages-${this.container.id}`);

        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-chat-message ai-assistant-message ai-typing-indicator';
        typingDiv.id = 'ai-typing';
        typingDiv.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div class="ai-message-content">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typingIndicator = document.getElementById('ai-typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    formatMessage(content) {
        // Convert markdown-like formatting to HTML
        let formatted = this.escapeHtml(content);

        // Bold
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Lists
        formatted = formatted.replace(/^- (.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public methods
    minimize() {
        this.container.querySelector('.ai-chat-widget').classList.add('minimized');
    }

    maximize() {
        this.container.querySelector('.ai-chat-widget').classList.remove('minimized');
    }

    clearChat() {
        const messagesContainer = document.getElementById(`ai-messages-${this.container.id}`);
        messagesContainer.innerHTML = '';
        this.messages = [];
        this.threadId = null;
        this.render();
        this.setupEventListeners();
    }
}
