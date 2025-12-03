const AlertService = require('../../services/alert-service');
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { severity } = req.query;
        const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
            ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
            : null;
        const alertService = new AlertService(supabase);

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
};
