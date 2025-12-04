// API: /api/user-passwords
// GET: Fetch user's password hash
// POST: Save/update user's password hash

const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Initialize Supabase
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
            return res.status(500).json({
                error: 'Database not configured'
            });
        }

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        // GET: Fetch user's password
        if (req.method === 'GET') {
            const { user_name } = req.query;

            if (!user_name) {
                return res.status(400).json({ error: 'user_name required' });
            }

            const { data, error } = await supabase
                .from('user_passwords')
                .select('password_hash')
                .eq('user_name', user_name)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
                console.error('Supabase error fetching password:', error);
                return res.status(500).json({ error: 'Database query failed' });
            }

            if (!data) {
                return res.status(404).json({ error: 'Password not found' });
            }

            return res.status(200).json({ password_hash: data.password_hash });
        }

        // POST: Save/update password
        if (req.method === 'POST') {
            const { user_name, password_hash } = req.body;

            if (!user_name || !password_hash) {
                return res.status(400).json({ error: 'user_name and password_hash required' });
            }

            // Upsert (insert or update if exists)
            const { data, error } = await supabase
                .from('user_passwords')
                .upsert(
                    { user_name, password_hash },
                    { onConflict: 'user_name' }
                )
                .select();

            if (error) {
                console.error('Supabase error saving password:', error);
                return res.status(500).json({ error: 'Failed to save password' });
            }

            return res.status(200).json({ success: true, data });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Password API error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};
