// GET /api/milestones - Fetch all milestones from database
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-User-Name, Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Initialize Supabase
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
            return res.status(500).json({
                error: 'Database not configured',
                fallback: true
            });
        }

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        const { project } = req.query;

        let query = supabase.from('milestones').select('*');

        // Filter by project if specified
        if (project) {
            query = query.ilike('phase_id', `${project}%`);
        }

        const { data, error } = await query.order('phase_id', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.json({
            success: true,
            milestones: data || [],
            count: data?.length || 0,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({
            error: error.message,
            fallback: true
        });
    }
};
