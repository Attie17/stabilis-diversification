// Budget Data API Endpoint
// Returns budget data from Supabase for specified period

const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { period } = req.query;
        
        if (!period) {
            return res.status(400).json({ error: 'Budget period required (e.g., ?period=Q1-2026)' });
        }
        
        // Initialize Supabase
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );
        
        // Fetch all budget data for the period
        const [summaryResult, monthlyResult, expenditureResult, revenueResult] = await Promise.all([
            supabase.from('budget_summary').select('*').eq('budget_period', period).single(),
            supabase.from('budget_monthly').select('*').eq('budget_period', period).order('month_order'),
            supabase.from('budget_expenditure').select('*').eq('budget_period', period),
            supabase.from('budget_revenue').select('*').eq('budget_period', period)
        ]);
        
        // Check for errors
        if (summaryResult.error) {
            if (summaryResult.error.code === 'PGRST116') {
                return res.status(404).json({ 
                    error: 'Budget period not found', 
                    period,
                    hint: 'Run npm run sync-budget to upload budget data'
                });
            }
            throw summaryResult.error;
        }
        
        if (monthlyResult.error) throw monthlyResult.error;
        if (expenditureResult.error) throw expenditureResult.error;
        if (revenueResult.error) throw revenueResult.error;
        
        // Return combined data
        return res.status(200).json({
            success: true,
            period,
            data: {
                summary: summaryResult.data,
                monthly: monthlyResult.data,
                expenditure: expenditureResult.data,
                revenue: revenueResult.data
            },
            meta: {
                lastUpdated: summaryResult.data.updated_at,
                monthCount: monthlyResult.data.length,
                expenditureCategories: expenditureResult.data.length,
                revenueProjects: revenueResult.data.length
            }
        });
        
    } catch (error) {
        console.error('Budget API error:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch budget data',
            message: error.message 
        });
    }
};
