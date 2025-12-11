// Unified Stabilis Server - Frontend + Backend API
// Combines static file serving with AI Executive Assistant APIs

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// AI Services
const AlertService = require('./services/alert-service');
const RevenueService = require('./services/revenue-service');
const ChangeDetectionService = require('./services/change-detection-service');
const OpenAIAssistantService = require('./services/openai-assistant-service');
const CronScheduler = require('./services/cron-scheduler');

const app = express();
const PORT = process.env.PORT || 3000;
const CEO_USER_NAME = (process.env.CEO_USER_NAME || 'Attie Nel').toLowerCase();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase (optional)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );
    console.log('✅ Supabase connected');
}

// Initialize AI services
const alertService = new AlertService(supabase);
const revenueService = new RevenueService();
const changeService = new ChangeDetectionService(supabase);
const aiService = new OpenAIAssistantService();
const scheduler = new CronScheduler(supabase);

// Store active threads per user/session (in-memory for now)
const activeThreads = new Map();

function getRequestingUser(req) {
    const headerName = req.headers['x-user-name'];
    if (typeof headerName === 'string') {
        return headerName.trim();
    }
    if (Array.isArray(headerName)) {
        return headerName[0].trim();
    }
    return null;
}

function requireCEOAccess(req, res, next) {
    const userName = getRequestingUser(req);
    if (userName && userName.toLowerCase() === CEO_USER_NAME) {
        return next();
    }
    console.warn('🚫 AI endpoint blocked for user:', userName || 'unknown');
    return res.status(403).json({ error: 'AI Executive Assistant access is limited to the CEO.' });
}

// ===== BACKEND API ROUTES =====

app.use('/api/ai', requireCEOAccess);

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

// Milestone API endpoints (no CEO restriction - all authenticated users)
// GET /api/milestones - Fetch all milestones
app.get('/api/milestones', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(500).json({ error: 'Database not configured', fallback: true });
        }

        const { project } = req.query;
        let query = supabase.from('milestones').select('*');

        if (project) {
            query = query.ilike('phase_id', `${project}%`);
        }

        const { data, error } = await query.order('phase_id', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.json({ success: true, milestones: data || [] });
    } catch (error) {
        console.error('❌ Milestones fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/milestones/statuses - Fetch latest status per milestone
app.get('/api/milestones/statuses', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(500).json({ error: 'Database not configured', fallback: true });
        }

        const { project } = req.query;

        let query = supabase
            .from('milestones')
            .select('id, status, updated_at');

        if (project) {
            query = query.ilike('phase_id', `${project}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase status fetch error:', error);
            return res.status(500).json({ error: error.message });
        }

        const statuses = {};
        (data || []).forEach(row => {
            statuses[row.id] = {
                status: row.status,
                updated_at: row.updated_at
            };
        });

        res.json({ success: true, statuses });
    } catch (error) {
        console.error('❌ Milestone status fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/milestones/update - Update milestone status
app.post('/api/milestones/update', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(500).json({ error: 'Database not configured' });
        }

        const { milestone_id, field, old_value, new_value, changed_by } = req.body;

        if (!milestone_id || !field || !changed_by) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Update milestone in database
        const { data: milestone, error: milestoneError } = await supabase
            .from('milestones')
            .update({ [field]: new_value, updated_at: new Date().toISOString() })
            .eq('id', milestone_id)
            .select();

        if (milestoneError) {
            console.error('Milestone update error:', milestoneError);
            return res.status(500).json({ error: milestoneError.message });
        }

        // If no rows matched, the milestone doesn't exist yet - treat as success but log
        if (!milestone || milestone.length === 0) {
            console.warn(`⚠️  Milestone ${milestone_id} not found in DB - status saved to localStorage only`);
            return res.json({ success: true, fallback: 'localStorage' });
        }

        // Log to audit trail
        const { error: auditError } = await supabase
            .from('milestone_updates')
            .insert({
                milestone_id,
                field_changed: field,
                old_value: String(old_value),
                new_value: String(new_value),
                changed_by,
                timestamp: new Date().toISOString()
            });

        if (auditError) {
            console.warn('Audit trail error:', auditError);
        }

        res.json({ success: true, milestone });
    } catch (error) {
        console.error('❌ Milestone update error:', error);
        res.status(500).json({ error: error.message });
    }
});

// AI Chat endpoint (both /api/chat and /api/ai/chat for compatibility)
const handleChat = async (req, res) => {
    try {
        const { message, thread_id, session_id } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log(`\n💬 Chat request: "${message.substring(0, 50)}..."`);

        const sessionKey = session_id || req.headers['x-session-id'] || req.ip;

        // Get or create thread for this session
        let threadId = thread_id;
        if (!threadId && sessionKey && activeThreads.has(sessionKey)) {
            threadId = activeThreads.get(sessionKey);
        }

        if (!threadId) {
            const thread = await aiService.createThread();
            threadId = thread.id;
        }

        // Get response from AI
        const response = await aiService.chat(message, threadId);

        if (sessionKey) {
            activeThreads.set(sessionKey, response.thread_id);
        }

        res.json({
            response: response.response,
            thread_id: response.thread_id,
            run_id: response.run_id,
            latency_ms: response.latency_ms,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Chat error:', error);
        res.status(500).json({ error: error.message });
    }
};

app.post('/api/chat', handleChat);
app.post('/api/ai/chat', handleChat);

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

// ===== UTILITY API ROUTES =====

// Excel file management endpoints
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Download Excel file (for web deployment)
app.get('/api/excel/download', (req, res) => {
    const fs = require('fs');
    const excelPath = path.join(__dirname, 'data', 'stabilis-data.xlsx');

    console.log('📥 Excel download request received');

    if (!fs.existsSync(excelPath)) {
        console.error('❌ Excel file not found at:', excelPath);
        return res.status(404).json({
            success: false,
            error: 'Excel file not found'
        });
    }

    console.log('✅ Sending Excel file for download');
    res.download(excelPath, 'stabilis-data.xlsx', (err) => {
        if (err) {
            console.error('❌ Download error:', err);
            res.status(500).json({ success: false, error: 'Download failed' });
        } else {
            console.log('✅ Excel file downloaded successfully');
        }
    });
});

// Upload Excel file (for web deployment)
app.post('/api/excel/upload', upload.single('excel'), (req, res) => {
    const fs = require('fs');
    const excelPath = path.join(__dirname, 'data', 'stabilis-data.xlsx');

    console.log('📤 Excel upload request received');

    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: 'No file uploaded'
        });
    }

    try {
        // Move uploaded file to data directory
        fs.renameSync(req.file.path, excelPath);
        console.log('✅ Excel file uploaded successfully');

        res.json({
            success: true,
            message: 'Excel file updated successfully'
        });
    } catch (error) {
        console.error('❌ Upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Open Excel file endpoint (for local development only)
app.get('/api/open-excel', (req, res) => {
    const { exec } = require('child_process');
    const fs = require('fs');
    const excelPath = path.join(__dirname, 'data', 'stabilis-data.xlsx');

    console.log('📊 Excel open request received');

    // Check if running on cloud (Render/Heroku) - don't try to open Excel
    if (process.env.RENDER || process.env.HEROKU || process.env.NODE_ENV === 'production') {
        console.log('🌐 Running on cloud - redirecting to download/upload flow');
        return res.json({
            success: true,
            cloudDeployment: true,
            message: 'Excel file management available via download/upload',
            downloadUrl: '/api/excel/download'
        });
    }

    // First verify file exists
    if (!fs.existsSync(excelPath)) {
        console.error('❌ Excel file not found at:', excelPath);
        return res.status(404).json({
            success: false,
            error: 'Excel file not found',
            path: excelPath
        });
    }

    console.log('✅ File exists, attempting to open:', excelPath);

    // Use simpler command without complex PowerShell syntax (Windows only)
    const command = process.platform === 'win32'
        ? `start "" "${excelPath}"`
        : `open "${excelPath}"`; // Mac

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Error opening Excel:', error.message);
            if (stderr) console.error('stderr:', stderr);
            return res.status(500).json({
                success: false,
                error: error.message,
                details: 'Failed to open Excel file'
            });
        }

        console.log('✅ Excel file opened successfully');
        res.json({
            success: true,
            message: 'Excel file opened successfully',
            path: excelPath
        });
    });
});

// Budget API endpoint
app.get('/api/budget', async (req, res) => {
    try {
        const budgetHandler = require('./api/budget');
        await budgetHandler(req, res);
    } catch (error) {
        console.error('Budget API error:', error);
        res.status(500).json({ error: 'Budget API failed' });
    }
});

// User Passwords API endpoint
app.get('/api/user-passwords', async (req, res) => {
    try {
        const userPasswordsHandler = require('./api/user-passwords');
        await userPasswordsHandler(req, res);
    } catch (error) {
        console.error('User passwords API error:', error);
        res.status(500).json({ error: 'User passwords API failed' });
    }
});

app.post('/api/user-passwords', async (req, res) => {
    try {
        const userPasswordsHandler = require('./api/user-passwords');
        await userPasswordsHandler(req, res);
    } catch (error) {
        console.error('User passwords API error:', error);
        res.status(500).json({ error: 'User passwords API failed' });
    }
});

// ===== FRONTEND ROUTES =====

// Landing page as root (must come BEFORE static middleware)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'landing.html'));
});

// Executive dashboard route
app.get('/executive', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'executive-dashboard.html'));
});

// Diversification project route
app.get('/diversification', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

// Turnaround project route
app.get('/turnaround', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'turnaround.html'));
});

// Serve static files from web directory (AFTER specific routes)
// Disable index.html auto-serving to prevent conflicts with root route
app.use(express.static('web', { index: false }));

// ===== INITIALIZATION =====

async function initialize() {
    console.log('\n🚀 Starting Unified Stabilis Server...\n');

    try {
        // Initialize OpenAI Assistant
        await aiService.initialize();

        // Start file watching
        await changeService.start();

        // Start cron scheduler
        scheduler.start();

        // Start server
        app.listen(PORT, () => {
            console.log(`
    ============================================================
     🚀 Stabilis Project Hub - Unified Backend + Frontend
    ============================================================
    
     Frontend:
     • Landing:          http://localhost:${PORT}
     • Executive:        http://localhost:${PORT}/executive
     • Turnaround:       http://localhost:${PORT}/turnaround.html
     • Diversification:  http://localhost:${PORT}/index.html
     • Wellness Centre:  http://localhost:${PORT}/wellness.html
     
     Backend API:
     • Health:           GET  http://localhost:${PORT}/api/health
     • Chat:             POST http://localhost:${PORT}/api/ai/chat
     • Alerts:           GET  http://localhost:${PORT}/api/ai/alerts
     • Revenue:          GET  http://localhost:${PORT}/api/ai/revenue
     • Changes:          GET  http://localhost:${PORT}/api/ai/changes
     • Dashboard:        GET  http://localhost:${PORT}/api/ai/dashboard
     
     📱 Network:  http://[your-ip]:${PORT}
     💡 Press Ctrl+C to stop
     
    ============================================================
            `);
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
