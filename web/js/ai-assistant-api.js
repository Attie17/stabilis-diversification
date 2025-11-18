// AI Executive Assistant - Frontend Integration
// Connects existing UI to new backend API

const API_BASE = 'http://localhost:3000/api/ai';

class AIExecutiveAssistant {
    constructor() {
        this.threadId = null;
        this.isLoading = false;
    }

    // Chat with AI
    async chat(message) {
        if (this.isLoading) return null;
        
        this.isLoading = true;
        try {
            const response = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    thread_id: this.threadId
                })
            });

            const data = await response.json();
            
            if (data.thread_id) {
                this.threadId = data.thread_id;
            }

            this.isLoading = false;
            return data.response;
        } catch (error) {
            this.isLoading = false;
            console.error('Chat error:', error);
            return `Error: ${error.message}`;
        }
    }

    // Get active alerts
    async getAlerts(severity = null) {
        try {
            const url = severity 
                ? `${API_BASE}/alerts?severity=${severity}`
                : `${API_BASE}/alerts`;
            
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Alerts error:', error);
            return null;
        }
    }

    // Acknowledge alert
    async acknowledgeAlert(alertId) {
        try {
            const response = await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, {
                method: 'POST'
            });
            return await response.json();
        } catch (error) {
            console.error('Acknowledge error:', error);
            return null;
        }
    }

    // Get revenue projection
    async getRevenue(scenario = 'all') {
        try {
            const url = scenario !== 'all'
                ? `${API_BASE}/revenue?scenario=${scenario}`
                : `${API_BASE}/revenue`;
            
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Revenue error:', error);
            return null;
        }
    }

    // Get revenue variance
    async getVariance() {
        try {
            const response = await fetch(`${API_BASE}/revenue/variance`);
            return await response.json();
        } catch (error) {
            console.error('Variance error:', error);
            return null;
        }
    }

    // Get recent changes
    async getChanges(limit = 50, filePath = null) {
        try {
            let url = `${API_BASE}/changes?limit=${limit}`;
            if (filePath) {
                url += `&file_path=${encodeURIComponent(filePath)}`;
            }
            
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Changes error:', error);
            return null;
        }
    }

    // Get dashboard summary
    async getDashboard() {
        try {
            const response = await fetch(`${API_BASE}/dashboard`);
            return await response.json();
        } catch (error) {
            console.error('Dashboard error:', error);
            return null;
        }
    }

    // Check system health
    async getHealth() {
        try {
            const response = await fetch('http://localhost:3000/api/health');
            return await response.json();
        } catch (error) {
            console.error('Health check error:', error);
            return null;
        }
    }
}

// Initialize global instance
const aiAssistant = new AIExecutiveAssistant();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIExecutiveAssistant;
}
