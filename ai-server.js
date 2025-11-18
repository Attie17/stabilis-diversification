// Main Express Server - API Endpoints for AI Assistant
// Integrates all services and provides HTTP API

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Services
const AlertService = require('./services/alert-service');
const RevenueService = require('./services/revenue-service');
const ChangeDetectionService = require('./services/change-detection-service');
const OpenAIAssistantService = require('./services/openai-assistant-service');
const CronScheduler = require('./services/cron-scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('web'));

// Initialize Supabase (optional)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );
    console.log('✅ Supabase connected');
}

// Initialize services
const alertService = new AlertService(supabase);
const revenueService = new RevenueService();
const changeService = new ChangeDetectionService(supabase);
const aiService = new OpenAIAssistantService();
const scheduler = new CronScheduler(supabase);

// Store active threads per user/session (in-memory for now)
const activeThreads = new Map();

// ===== API ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        services: {
            database: supabase ? 'connected' : 'in-memory',
            openai: aiService.assistantId ? 'ready' : 'pending',
            alerts: 'ok',
            revenue: 'ok',
            changes: changeService.watcher ? 'watching' : 'stopped'
        },
        timestamp: new Date().toISOString()
    });
});

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message, thread_id } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log(`\n💬 Chat request: "${message.substring(0, 50)}..."`);

        // Get or create thread for this session
        let threadId = thread_id;
        if (!threadId) {
            const thread = await aiService.createThread();
            threadId = thread.id;
            activeThreads.set('default', threadId); // Simple single-user for now
        }

        // Get response from AI
        const response = await aiService.chat(message, threadId);

        res.json({
            response: response.response,
            thread_id: response.thread_id,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Chat error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get active alerts
app.get('/api/ai/alerts', async (req, res) => {
    try {
        const { severity } = req.query;

        console.log(`\n🔔 Alerts request (severity: ${severity || 'all'})`);

        const result = await alertService.generateAlerts();

        let alerts = result.alerts;
        if (severity) {
            alerts = alerts.filter(a => a.severity === severity);
        }

        res.json({
            alerts,
            summary: result.summary,
            generated_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Alerts error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Acknowledge alert
app.post('/api/ai/alerts/:id/acknowledge', async (req, res) => {
    try {
        const { id } = req.params;
        await alertService.acknowledgeAlert(id);

        res.json({
            success: true,
            message: 'Alert acknowledged'
        });
    } catch (error) {
        console.error('❌ Acknowledge error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get revenue projection
app.get('/api/ai/revenue', async (req, res) => {
    try {
        const { scenario } = req.query;

        console.log(`\n💰 Revenue request (scenario: ${scenario || 'all'})`);

        const projection = await revenueService.getProjection();

        if (scenario && scenario !== 'all') {
            res.json({
                scenario,
                data: projection.scenarios[scenario],
                service_lines: projection.service_lines,
                generated_at: projection.generated_at
            });
        } else {
            res.json(projection);
        }
    } catch (error) {
        console.error('❌ Revenue error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get revenue variance
app.get('/api/ai/revenue/variance', async (req, res) => {
    try {
        console.log(`\n📉 Variance request`);

        const variance = await revenueService.getVarianceAnalysis();
        res.json(variance);
    } catch (error) {
        console.error('❌ Variance error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get recent changes
app.get('/api/ai/changes', async (req, res) => {
    try {
        const { limit, file_path } = req.query;

        console.log(`\n📝 Changes request (limit: ${limit || 50}, file: ${file_path || 'all'})`);

        let changes = await changeService.getRecentChanges(parseInt(limit) || 50);

        if (file_path) {
            changes = changes.filter(c => c.file_path === file_path);
        }

        res.json({
            changes,
            total: changes.length,
            generated_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Changes error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get changes by file
app.get('/api/ai/changes/:file_path', async (req, res) => {
    try {
        const filePath = req.params.file_path;

        console.log(`\n📝 File changes request: ${filePath}`);

        const changes = await changeService.getChangesByFile(filePath);

        res.json({
            file_path: filePath,
            changes,
            total: changes.length,
            generated_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ File changes error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Dashboard summary
app.get('/api/ai/dashboard', async (req, res) => {
    try {
        console.log(`\n📊 Dashboard request`);

        // Get all data in parallel
        const [alerts, revenue, changes] = await Promise.all([
            alertService.generateAlerts(),
            revenueService.getProjection(),
            changeService.getRecentChanges(10)
        ]);

        res.json({
            alerts: {
                total: alerts.summary.total,
                critical: alerts.summary.critical,
                warning: alerts.summary.warning,
                recent: alerts.alerts.slice(0, 5)
            },
            revenue: {
                optimistic: revenue.summary.optimistic,
                realistic: revenue.summary.realistic,
                conservative: revenue.summary.conservative,
                service_lines: Object.keys(revenue.service_lines).length
            },
            changes: {
                recent: changes.slice(0, 5),
                total: changes.length
            },
            generated_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Dashboard error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===== INITIALIZATION =====

async function initialize() {
    console.log('\n🚀 Starting AI Executive Assistant Server...\n');

    try {
        // Initialize OpenAI Assistant
        await aiService.initialize();

        // Start file watching
        await changeService.start();

        // Start cron scheduler
        scheduler.start();

        // Start server
        app.listen(PORT, () => {
            console.log(`\n✅ Server running on http://localhost:${PORT}`);
            console.log(`   - Chat: POST http://localhost:${PORT}/api/ai/chat`);
            console.log(`   - Alerts: GET http://localhost:${PORT}/api/ai/alerts`);
            console.log(`   - Revenue: GET http://localhost:${PORT}/api/ai/revenue`);
            console.log(`   - Changes: GET http://localhost:${PORT}/api/ai/changes`);
            console.log(`   - Dashboard: GET http://localhost:${PORT}/api/ai/dashboard`);
            console.log(`\n⏳ Ready for requests!\n`);
        });
    } catch (error) {
        console.error('❌ Initialization error:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down...');
    await changeService.stop();
    scheduler.stop();
    process.exit(0);
});

// Start
initialize();

module.exports = app;
