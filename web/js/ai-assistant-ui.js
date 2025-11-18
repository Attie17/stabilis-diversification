// AI Assistant UI Controller
// Manages the AI dashboard interface

document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    checkSystemHealth();
    loadDashboard();
    setupEventListeners();
});

// Initialize UI
function initializeUI() {
    console.log('🤖 AI Assistant UI initialized');
}

// Check system health
async function checkSystemHealth() {
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');

    const health = await aiAssistant.getHealth();

    if (health && health.status === 'ok') {
        statusIndicator.className = 'status-dot status-online';
        statusText.textContent = 'System Online';
    } else {
        statusIndicator.className = 'status-dot status-offline';
        statusText.textContent = 'System Offline';
    }
}

// Load full dashboard
async function loadDashboard() {
    loadAlerts();
    loadRevenue();
    loadChanges();
    loadDashboardSummary();
}

// Load alerts
async function loadAlerts() {
    const container = document.getElementById('alerts-summary');
    container.innerHTML = '<div class="loading">Loading...</div>';

    const data = await aiAssistant.getAlerts();

    if (!data) {
        container.innerHTML = '<div class="error">Failed to load alerts</div>';
        return;
    }

    const { alerts, summary } = data;

    let html = `
        <div class="alert-counts">
            <div class="count-item critical">
                <span class="count-number">${summary.critical}</span>
                <span class="count-label">Critical</span>
            </div>
            <div class="count-item warning">
                <span class="count-number">${summary.warning}</span>
                <span class="count-label">Warning</span>
            </div>
            <div class="count-item info">
                <span class="count-number">${summary.info}</span>
                <span class="count-label">Info</span>
            </div>
        </div>
    `;

    // Show top 5 alerts
    const topAlerts = alerts.slice(0, 5);
    if (topAlerts.length > 0) {
        html += '<div class="alert-list">';
        topAlerts.forEach(alert => {
            const icon = alert.severity === 'critical' ? '🔴' :
                        alert.severity === 'warning' ? '🟡' : 'ℹ️';
            
            html += `
                <div class="alert-item ${alert.severity}">
                    <span class="alert-icon">${icon}</span>
                    <span class="alert-message">${alert.message}</span>
                </div>
            `;
        });
        html += '</div>';
    }

    container.innerHTML = html;
}

// Load revenue
async function loadRevenue() {
    const container = document.getElementById('revenue-summary');
    const selector = document.getElementById('scenario-selector');
    
    container.innerHTML = '<div class="loading">Loading...</div>';

    const scenario = selector.value;
    const data = await aiAssistant.getRevenue(scenario);

    if (!data) {
        container.innerHTML = '<div class="error">Failed to load revenue</div>';
        return;
    }

    if (scenario === 'all') {
        const { summary } = data;
        container.innerHTML = `
            <div class="revenue-scenarios">
                <div class="scenario-item">
                    <strong>Optimistic:</strong> ${formatCurrency(summary.optimistic)}
                </div>
                <div class="scenario-item highlighted">
                    <strong>Realistic:</strong> ${formatCurrency(summary.realistic)}
                </div>
                <div class="scenario-item">
                    <strong>Conservative:</strong> ${formatCurrency(summary.conservative)}
                </div>
                <div class="scenario-item">
                    <strong>Minimum:</strong> ${formatCurrency(summary.minimum)}
                </div>
            </div>
        `;
    } else {
        const { data: scenarioData } = data;
        container.innerHTML = `
            <div class="revenue-detail">
                <h4>${scenario.toUpperCase()} Scenario (${scenarioData.percentage})</h4>
                <div class="revenue-total">${formatCurrency(scenarioData.total_revenue)}</div>
                <div class="phase-count">${scenarioData.phases.length} phases tracked</div>
            </div>
        `;
    }
}

// Load changes
async function loadChanges() {
    const container = document.getElementById('changes-summary');
    container.innerHTML = '<div class="loading">Loading...</div>';

    const data = await aiAssistant.getChanges(10);

    if (!data) {
        container.innerHTML = '<div class="error">Failed to load changes</div>';
        return;
    }

    const { changes } = data;

    if (changes.length === 0) {
        container.innerHTML = '<div class="no-data">No recent changes</div>';
        return;
    }

    let html = '<div class="changes-list">';
    changes.forEach(change => {
        const icon = change.type === 'added' ? '📄' :
                    change.type === 'modified' ? '✏️' : '🗑️';
        const time = new Date(change.timestamp).toLocaleTimeString();
        
        html += `
            <div class="change-item">
                <span class="change-icon">${icon}</span>
                <div class="change-details">
                    <div class="change-file">${change.file_path}</div>
                    <div class="change-time">${time}</div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

// Load dashboard summary
async function loadDashboardSummary() {
    const container = document.getElementById('dashboard-summary');
    container.innerHTML = '<div class="loading">Loading...</div>';

    const data = await aiAssistant.getDashboard();

    if (!data) {
        container.innerHTML = '<div class="error">Failed to load dashboard</div>';
        return;
    }

    const { alerts, revenue, changes } = data;

    container.innerHTML = `
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-label">Critical Alerts</div>
                <div class="summary-value critical">${alerts.critical}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Realistic Revenue</div>
                <div class="summary-value">${formatCurrency(revenue.realistic)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Recent Changes</div>
                <div class="summary-value">${changes.total}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Service Lines</div>
                <div class="summary-value">${revenue.service_lines}</div>
            </div>
        </div>
    `;
}

// Chat functionality
function setupEventListeners() {
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    // Send message
    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addChatMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        const typingId = addChatMessage('Thinking...', 'assistant', true);

        // Get AI response
        const response = await aiAssistant.chat(message);

        // Remove typing indicator
        document.getElementById(typingId)?.remove();

        // Add AI response
        addChatMessage(response, 'assistant');
    };

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Suggested questions
    document.querySelectorAll('.question-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            chatInput.value = chip.dataset.question;
            sendMessage();
        });
    });

    // Refresh buttons
    document.getElementById('refresh-alerts').addEventListener('click', loadAlerts);
    document.getElementById('refresh-changes').addEventListener('click', loadChanges);

    // Scenario selector
    document.getElementById('scenario-selector').addEventListener('change', loadRevenue);

    // Auto-refresh every 5 minutes
    setInterval(loadDashboard, 5 * 60 * 1000);
}

// Add message to chat
function addChatMessage(text, role, isTyping = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageId = `msg-${Date.now()}`;

    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;
    messageDiv.className = `chat-message ${role}`;
    
    const icon = role === 'user' ? '👤' : '🤖';
    messageDiv.innerHTML = `
        <span class="message-icon">${icon}</span>
        <div class="message-content">${text}</div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageId;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
