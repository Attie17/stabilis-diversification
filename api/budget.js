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
        
        // Initialize Supabase
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );
        
        // Handle combined period mode (both Q1-2026 and FY-2026-27)
        if (period === 'combined') {
            const [monthlyResult, expenditureResult, revenueResult] = await Promise.all([
                supabase.from('budget_monthly').select('*').order('month_order'),
                supabase.from('budget_expenditure').select('*'),
                supabase.from('budget_revenue').select('*')
            ]);
            
            if (monthlyResult.error) throw monthlyResult.error;
            if (expenditureResult.error) throw expenditureResult.error;
            if (revenueResult.error) throw revenueResult.error;
            
            // Combine expenditure by category across both periods
            const expenditureByCategory = {};
            expenditureResult.data.forEach(item => {
                // Map category names to consistent keys
                let category = item.category;
                if (category === 'Existing Operations') {
                    category = 'Existing Operations';
                } else if (category.includes('Wellness')) {
                    category = 'Wellness Centre';
                } else if (category === 'Diversification') {
                    category = 'Diversification';
                } else if (category.includes('Turnaround')) {
                    category = 'Turnaround';
                } else if (category.includes('Corporate') || category === 'Contingency') {
                    category = 'Corporate & Overhead';
                }
                
                if (!expenditureByCategory[category]) {
                    expenditureByCategory[category] = {
                        category,
                        totalAmount: 0,
                        breakdown: []
                    };
                }
                
                expenditureByCategory[category].totalAmount += item.amount;
                expenditureByCategory[category].breakdown.push({
                    period: item.budget_period,
                    amount: item.amount,
                    percentage: item.percentage,
                    originalCategory: item.category
                });
            });
            
            // Calculate totals
            const totalInvestment = Object.values(expenditureByCategory).reduce(
                (sum, cat) => sum + cat.totalAmount, 0
            );
            const totalRevenue = monthlyResult.data.reduce(
                (sum, month) => sum + month.revenue, 0
            );
            const netPosition = totalRevenue - totalInvestment;
            
            return res.status(200).json({
                success: true,
                period: 'combined',
                data: {
                    summary: {
                        totalInvestment,
                        totalRevenue,
                        netPosition,
                        roi: ((totalRevenue / totalInvestment - 1) * 100).toFixed(1) + '%'
                    },
                    monthly: monthlyResult.data,
                    expenditureByCategory: Object.values(expenditureByCategory).sort(
                        (a, b) => b.totalAmount - a.totalAmount
                    ),
                    expenditureRaw: expenditureResult.data,
                    revenue: revenueResult.data
                },
                meta: {
                    monthCount: monthlyResult.data.length,
                    expenditureCategories: Object.keys(expenditureByCategory).length,
                    revenueProjects: revenueResult.data.length,
                    periods: ['Q1-2026', 'FY-2026-27']
                }
            });
        }
        
        // Handle single period mode
        if (!period) {
            return res.status(400).json({ 
                error: 'Budget period required', 
                hint: 'Use ?period=Q1-2026, ?period=FY-2026-27, or ?period=combined'
            });
        }
        
        // Fetch all budget data for the specific period
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
