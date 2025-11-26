// POST /api/milestones/sync - Sync localStorage milestones to database (migration helper)
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-User-Name, Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { milestones } = req.body;

        if (!Array.isArray(milestones) || milestones.length === 0) {
            return res.status(400).json({ error: 'milestones array is required' });
        }

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

        // Upsert milestones (insert or update)
        const milestonesToSync = milestones.map(m => ({
            id: m.id,
            title: m.title || m.name,
            phase_id: m.phase_id,
            phase_name: m.phase_name,
            owner: m.owner,
            due_date: m.due || m.dueDate,
            status: m.status === 'complete' ? 'completed' : m.status,
            description: m.description,
            revenue: m.revenue || 0
        }));

        const { data, error } = await supabase
            .from('milestones')
            .upsert(milestonesToSync, { onConflict: 'id' })
            .select();

        if (error) {
            console.error('Sync error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.json({
            success: true,
            synced: data?.length || 0,
            milestones: data,
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
