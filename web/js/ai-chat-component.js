// Reusable AI Chat Component
// Can be embedded in any page for context-aware AI assistance

const CEO_USER_NAME = 'Attie Nel';

function getStoredUserProfile() {
    try {
        return window.currentUser || JSON.parse(localStorage.getItem('stabilis-user') || 'null');
    } catch (error) {
        console.warn('Unable to read stored user profile for AI assistant', error);
        return null;
    }
}

function isCEOUser(user = getStoredUserProfile()) {
    return Boolean(user && user.name === CEO_USER_NAME);
}

class AIChatComponent {
    constructor(containerId, context = {}) {
        this.container = document.getElementById(containerId);
        this.context = context; // Page-specific context (e.g., project name)
        this.threadStorageKey = `ai-thread-${containerId}`;
        this.sessionStorageKey = `ai-session-${containerId}`;
        this.user = getStoredUserProfile();
        this.threadId = this.restorePersistedThread();
        this.sessionId = this.getOrCreateSessionId();
        this.messages = [];
        this.isTyping = false;
        this.slowResponseTimer = null;
        this.timeoutTimer = null;

        if (!isCEOUser(this.user)) {
            if (this.container) {
                // CEO-only policy: remove the widget so other roles never see it.
                this.container.remove();
            }
            return;
        }

        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="ai-chat-widget collapsed">
                <div class="ai-chat-header">
                    <div class="ai-chat-title">
                        <span class="ai-icon">🤖</span>
                        <span>AI</span>
                    </div>
                    <div class="ai-chat-actions">
                        <button class="ai-chat-minimize" onclick="this.closest('.ai-chat-widget').classList.toggle('minimized')" title="Minimize">−</button>
                    </div>
                </div>
                
                <div class="ai-chat-body">
                    <div class="ai-chat-messages" id="ai-messages-${this.container.id}"></div>
                    
                    <div class="ai-chat-status" id="ai-status-${this.container.id}" aria-live="polite"></div>
                    
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
        this.inputEl = document.getElementById(`ai-input-${this.container.id}`);
        this.sendBtn = document.getElementById(`ai-send-${this.container.id}`);
        this.statusEl = document.getElementById(`ai-status-${this.container.id}`);
        this.setStatus('');

        // Toggle collapsed state on header click
        const widget = this.container.querySelector('.ai-chat-widget');
        const header = widget.querySelector('.ai-chat-header');
        header.addEventListener('click', (e) => {
            // Don't toggle if clicking minimize button
            if (e.target.closest('.ai-chat-minimize')) return;
            widget.classList.toggle('collapsed');
        });

        // Send on button click
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        // Send on Enter (Shift+Enter for new line)
        this.inputEl.addEventListener('keydown', (e) => {
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
        const message = this.inputEl.value.trim();

        if (!message || this.isTyping) return;

        // Clear input
        this.inputEl.value = '';

        // Add user message to UI
        this.addMessage('user', message);

        // Show typing indicator
        this.showTyping();
        this.isTyping = true;
        this.setSendingState(true);
        this.setStatus('Connecting to assistant…');
        this.startThinkingTimer();

        try {
            // Add context to message if available
            let contextualMessage = message;
            if (this.context.project) {
                contextualMessage = `[Context: ${this.context.project} project] ${message}`;
            }

            const apiEndpoint = `${this.getBackendBaseUrl()}/api/chat`;

            // Send to AI
            let data;
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: this.buildAuthorizedHeaders(),
                    body: JSON.stringify({
                        message: contextualMessage,
                        thread_id: this.threadId,
                        session_id: this.sessionId
                    })
                });
                if (!response.ok) {
                    let details = response.statusText || 'Unknown error';
                    try {
                        const errorBody = await response.json();
                        details = errorBody.error || errorBody.message || details;
                    } catch (err) {
                        // Ignore JSON parse errors for non-JSON responses
                    }
                    console.error('[AI Chat] Failed to fetch:', details);
                    throw new Error(`API error ${response.status}: ${details}`);
                } else {
                    data = await response.json();
                }
            } catch (fetchError) {
                console.error('[AI Chat] Network or fetch error:', fetchError);
                this.handleError(fetchError);
                return;
            }
            this.handleAIResponse(data);
        } catch (error) {
            this.handleError(error);
        } finally {
            this.isTyping = false;
            this.clearThinkingTimer();
        }
    }

    buildAuthorizedHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        if (this.user?.name) {
            headers['X-User-Name'] = this.user.name;
        }
        return headers;
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

    handleAIResponse(data) {
        this.hideTyping();
        this.setSendingState(false);

        if (data.thread_id) {
            this.persistThreadId(data.thread_id);
        }

        const reply = data.response || 'No response received.';
        this.addMessage('assistant', reply);

        if (typeof data.latency_ms === 'number') {
            const seconds = (data.latency_ms / 1000).toFixed(1);
            this.setStatus(`Answered in ${seconds}s`, 'success');
        } else {
            this.setStatus('');
        }
    }

    handleError(error) {
        console.error('AI chat error:', error);
        this.hideTyping();
        this.setSendingState(false);
        const message = error?.message || 'Something went wrong. Please try again.';
        this.setStatus(message, 'error');
        this.addMessage('assistant', `⚠️ ${message}`);
    }

    setSendingState(isSending) {
        if (!this.sendBtn) return;
        this.sendBtn.disabled = isSending;
        if (isSending) {
            this.sendBtn.classList.add('loading');
        } else {
            this.sendBtn.classList.remove('loading');
        }
    }

    startThinkingTimer() {
        this.clearThinkingTimer();
        this.slowResponseTimer = setTimeout(() => {
            this.setStatus('Still thinking…', 'pending');
        }, 6000);

        this.timeoutTimer = setTimeout(() => {
            this.setStatus('Taking longer than usual. Hang tight…', 'pending');
        }, 12000);
    }

    clearThinkingTimer() {
        if (this.slowResponseTimer) {
            clearTimeout(this.slowResponseTimer);
            this.slowResponseTimer = null;
        }

        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;
        }
    }

    setStatus(message, state = 'info') {
        if (!this.statusEl) return;
        this.statusEl.textContent = message || '';
        this.statusEl.dataset.state = state;
    }

    getBackendBaseUrl() {
        // For Vercel deployments, API endpoints are relative to the same domain
        const host = window.location.hostname;
        const isLocal = host === 'localhost' || host === '127.0.0.1';

        if (isLocal) {
            return 'http://localhost:3000';
        }

        // Use current origin for Vercel serverless functions
        return window.location.origin;
    }

    persistThreadId(threadId) {
        this.threadId = threadId;
        try {
            if (!threadId) {
                window.localStorage.removeItem(this.threadStorageKey);
            } else {
                window.localStorage.setItem(this.threadStorageKey, threadId);
            }
        } catch (error) {
            console.warn('Unable to persist thread ID:', error);
        }
    }

    restorePersistedThread() {
        try {
            return window.localStorage.getItem(this.threadStorageKey);
        } catch (error) {
            return null;
        }
    }

    getOrCreateSessionId() {
        try {
            const existing = window.localStorage.getItem(this.sessionStorageKey);
            if (existing) return existing;

            const newId = (window.crypto?.randomUUID?.() || `session-${Date.now()}-${Math.random().toString(16).slice(2)}`);
            window.localStorage.setItem(this.sessionStorageKey, newId);
            return newId;
        } catch (error) {
            return `session-${Date.now()}`;
        }
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
        this.persistThreadId(null);
        this.render();
        this.setupEventListeners();
    }
}
