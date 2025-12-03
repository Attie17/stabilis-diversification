// POST /api/milestones/update - Update milestone status with audit trail
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
        const { milestoneId, status, changedBy, notes } = req.body;

        if (!milestoneId || !status) {
            return res.status(400).json({ error: 'milestoneId and status are required' });
        }

        if (!changedBy) {
            return res.status(400).json({ error: 'changedBy (user name) is required' });
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

        // Get current milestone state
        const { data: currentMilestone, error: fetchError } = await supabase
            .from('milestones')
            .select('*')
            .eq('id', milestoneId)
            .single();

        if (fetchError) {
            console.error('Failed to fetch milestone:', fetchError);
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const oldStatus = currentMilestone.status;

        // Update milestone
        const { data: updatedMilestone, error: updateError } = await supabase
            .from('milestones')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', milestoneId)
            .select()
            .single();

        if (updateError) {
            console.error('Update error:', updateError);
            return res.status(500).json({ error: updateError.message });
        }

        // Log audit trail
        const isFinancial = currentMilestone.revenue > 0 || status === 'completed';

        const { error: auditError } = await supabase
            .from('milestone_updates')
            .insert({
                milestone_id: milestoneId,
                field_changed: 'status',
                old_value: oldStatus,
                new_value: status,
                changed_by: changedBy,
                notes: notes || null,
                is_financial: isFinancial
            });

        if (auditError) {
            console.warn('Failed to log audit trail:', auditError);
            // Don't fail the request if audit logging fails
        }

        res.json({
            success: true,
            milestone: updatedMilestone,
            audit_logged: !auditError,
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
