// Sync Budget Data from Excel to Supabase
// Reads Excel workbook and uploads budget data to database

require('dotenv').config();
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const EXCEL_FILE = path.join(__dirname, '../data/stabilis-data.xlsx');

// Initialize Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

console.log('\n📊 Budget Sync: Excel → Supabase\n');

// Helper to get cell value
function getCellValue(sheet, cellAddress) {
    const cell = sheet[cellAddress];
    if (!cell) return 0;
    return cell.v !== undefined ? cell.v : 0;
}

// Parse Budget Q1 2026 worksheet
function parseBudgetQ1Sheet(sheet) {
    console.log('📖 Parsing Budget Q1 2026 worksheet...');
    
    // Executive Summary (rows 6-9)
    const summary = {
        budget_period: 'Q1-2026',
        total_budget: getCellValue(sheet, 'B6'),
        expected_revenue: getCellValue(sheet, 'B7'),
        net_deficit: getCellValue(sheet, 'B8'),
        funding_required: getCellValue(sheet, 'B9')
    };
    
    // Monthly Cash Flow (rows 13-16)
    const monthly = [
        {
            budget_period: 'Q1-2026',
            month: 'Dec 2025',
            month_order: 1,
            revenue: getCellValue(sheet, 'B13'),
            expenditure: getCellValue(sheet, 'C13'),
            net_cash_flow: getCellValue(sheet, 'D13'),
            cumulative: getCellValue(sheet, 'E13')
        },
        {
            budget_period: 'Q1-2026',
            month: 'Jan 2026',
            month_order: 2,
            revenue: getCellValue(sheet, 'B14'),
            expenditure: getCellValue(sheet, 'C14'),
            net_cash_flow: getCellValue(sheet, 'D14'),
            cumulative: getCellValue(sheet, 'E14')
        },
        {
            budget_period: 'Q1-2026',
            month: 'Feb 2026',
            month_order: 3,
            revenue: getCellValue(sheet, 'B15'),
            expenditure: getCellValue(sheet, 'C15'),
            net_cash_flow: getCellValue(sheet, 'D15'),
            cumulative: getCellValue(sheet, 'E15')
        },
        {
            budget_period: 'Q1-2026',
            month: 'Mar 2026',
            month_order: 4,
            revenue: getCellValue(sheet, 'B16'),
            expenditure: getCellValue(sheet, 'C16'),
            net_cash_flow: getCellValue(sheet, 'D16'),
            cumulative: getCellValue(sheet, 'E16')
        }
    ];
    
    // Expenditure Breakdown (rows 21-25)
    const expenditure = [
        {
            budget_period: 'Q1-2026',
            category: 'Existing Operations',
            amount: getCellValue(sheet, 'B21'),
            percentage: getCellValue(sheet, 'C21')
        },
        {
            budget_period: 'Q1-2026',
            category: 'Wellness Centre Setup',
            amount: getCellValue(sheet, 'B22'),
            percentage: getCellValue(sheet, 'C22')
        },
        {
            budget_period: 'Q1-2026',
            category: 'Diversification',
            amount: getCellValue(sheet, 'B23'),
            percentage: getCellValue(sheet, 'C23')
        },
        {
            budget_period: 'Q1-2026',
            category: 'Turnaround Project',
            amount: getCellValue(sheet, 'B24'),
            percentage: getCellValue(sheet, 'C24')
        },
        {
            budget_period: 'Q1-2026',
            category: 'Contingency',
            amount: getCellValue(sheet, 'B25'),
            percentage: getCellValue(sheet, 'C25')
        }
    ];
    
    // Revenue by Project (rows 30-32)
    const revenue = [
        {
            budget_period: 'Q1-2026',
            project: 'Diversification',
            total_revenue: getCellValue(sheet, 'B30'),
            monthly_avg: getCellValue(sheet, 'C30')
        },
        {
            budget_period: 'Q1-2026',
            project: 'Wellness Centre',
            total_revenue: getCellValue(sheet, 'B31'),
            monthly_avg: getCellValue(sheet, 'C31')
        },
        {
            budget_period: 'Q1-2026',
            project: 'Turnaround (Cost Avoidance)',
            total_revenue: getCellValue(sheet, 'B32'),
            monthly_avg: getCellValue(sheet, 'C32')
        }
    ];
    
    console.log('✅ Parsed data:', {
        summary: summary.total_budget,
        monthly: monthly.length + ' months',
        expenditure: expenditure.length + ' categories',
        revenue: revenue.length + ' projects'
    });
    
    return { summary, monthly, expenditure, revenue };
}

// Sync data to Supabase
async function syncToSupabase() {
    try {
        // Read Excel file
        console.log('📂 Reading Excel file...');
        const workbook = XLSX.readFile(EXCEL_FILE);
        
        if (!workbook.SheetNames.includes('Budget Q1 2026')) {
            throw new Error('Budget Q1 2026 worksheet not found in Excel file');
        }
        
        const sheet = workbook.Sheets['Budget Q1 2026'];
        const data = parseBudgetQ1Sheet(sheet);
        
        console.log('\n💾 Syncing to Supabase...\n');
        
        // 1. Upsert Summary
        console.log('1️⃣  Syncing budget summary...');
        const { data: summaryData, error: summaryError } = await supabase
            .from('budget_summary')
            .upsert(data.summary, { onConflict: 'budget_period' });
        
        if (summaryError) throw summaryError;
        console.log('   ✅ Summary synced');
        
        // 2. Upsert Monthly Data
        console.log('2️⃣  Syncing monthly cash flow...');
        const { data: monthlyData, error: monthlyError } = await supabase
            .from('budget_monthly')
            .upsert(data.monthly, { onConflict: 'budget_period,month' });
        
        if (monthlyError) throw monthlyError;
        console.log('   ✅ Monthly data synced (' + data.monthly.length + ' months)');
        
        // 3. Upsert Expenditure
        console.log('3️⃣  Syncing expenditure breakdown...');
        const { data: expData, error: expError } = await supabase
            .from('budget_expenditure')
            .upsert(data.expenditure, { onConflict: 'budget_period,category' });
        
        if (expError) throw expError;
        console.log('   ✅ Expenditure synced (' + data.expenditure.length + ' categories)');
        
        // 4. Upsert Revenue
        console.log('4️⃣  Syncing revenue by project...');
        const { data: revData, error: revError } = await supabase
            .from('budget_revenue')
            .upsert(data.revenue, { onConflict: 'budget_period,project' });
        
        if (revError) throw revError;
        console.log('   ✅ Revenue synced (' + data.revenue.length + ' projects)');
        
        console.log('\n✅ Budget sync complete!\n');
        console.log('📊 Summary:');
        console.log('   • Total Budget: R' + (data.summary.total_budget / 1000000).toFixed(2) + 'M');
        console.log('   • Expected Revenue: R' + (data.summary.expected_revenue / 1000).toFixed(0) + 'k');
        console.log('   • Net Deficit: R' + (data.summary.net_deficit / 1000000).toFixed(2) + 'M');
        console.log('\n💡 Reports will now show updated values from Supabase');
        
    } catch (error) {
        console.error('\n❌ Sync failed:', error.message);
        process.exit(1);
    }
}

// Run sync
syncToSupabase();
