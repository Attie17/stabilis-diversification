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
    
    const summary = {
        budget_period: 'Q1-2026',
        total_budget: getCellValue(sheet, 'B6'),
        expected_revenue: getCellValue(sheet, 'B7'),
        net_deficit: getCellValue(sheet, 'B8'),
        funding_required: getCellValue(sheet, 'B9')
    };
    
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
    
    console.log('✅ Parsed Q1 data:', {
        summary: summary.total_budget,
        monthly: monthly.length + ' months',
        expenditure: expenditure.length + ' categories',
        revenue: revenue.length + ' projects'
    });
    
    return { summary, monthly, expenditure, revenue };
}

// Parse Budget FY 2026-27 worksheet
function parseBudgetFYSheet(sheet) {
    console.log('📖 Parsing Budget FY 2026-27 worksheet...');
    
    const summary = {
        budget_period: 'FY-2026-27',
        total_budget: getCellValue(sheet, 'B6'),
        expected_revenue: getCellValue(sheet, 'B7'),
        net_deficit: getCellValue(sheet, 'B8'),
        funding_required: 0 // Not applicable for FY (has surplus)
    };
    
    // FY has 12 months (Apr 2026 - Mar 2027) - Revenue data in rows 21-32
    const months = [
        'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026',
        'Oct 2026', 'Nov 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027', 'Mar 2027'
    ];
    
    const monthly = months.map((month, index) => {
        const row = 21 + index;
        const divRevenue = getCellValue(sheet, 'B' + row);
        const wellRevenue = getCellValue(sheet, 'C' + row);
        const totalRevenue = divRevenue + wellRevenue;
        
        return {
            budget_period: 'FY-2026-27',
            month: month,
            month_order: index + 1,
            revenue: totalRevenue,
            expenditure: 0, // Not provided per month in FY budget
            net_cash_flow: totalRevenue, // Simplified
            cumulative: 0 // Will be calculated
        };
    });
    
    const expenditure = [
        {
            budget_period: 'FY-2026-27',
            category: 'Existing Operations',
            amount: getCellValue(sheet, 'B37'),
            percentage: getCellValue(sheet, 'C37')
        },
        {
            budget_period: 'FY-2026-27',
            category: 'Wellness Centre',
            amount: getCellValue(sheet, 'B38'),
            percentage: getCellValue(sheet, 'C38')
        },
        {
            budget_period: 'FY-2026-27',
            category: 'Diversification',
            amount: getCellValue(sheet, 'B39'),
            percentage: getCellValue(sheet, 'C39')
        },
        {
            budget_period: 'FY-2026-27',
            category: 'Corporate & Overhead',
            amount: getCellValue(sheet, 'B40'),
            percentage: getCellValue(sheet, 'C40')
        },
        {
            budget_period: 'FY-2026-27',
            category: 'Turnaround Maintenance',
            amount: getCellValue(sheet, 'B41'),
            percentage: getCellValue(sheet, 'C41')
        }
    ];
    
    // Revenue by Project - calculated from monthly data in rows 13-24
    // Using totals from row 33: B33 = Diversification, C33 = Wellness
    const revenue = [
        {
            budget_period: 'FY-2026-27',
            project: 'Diversification',
            total_revenue: getCellValue(sheet, 'B33'),
            monthly_avg: Math.round(getCellValue(sheet, 'B33') / 12)
        },
        {
            budget_period: 'FY-2026-27',
            project: 'Wellness Centre',
            total_revenue: getCellValue(sheet, 'C33'),
            monthly_avg: Math.round(getCellValue(sheet, 'C33') / 12)
        },
        {
            budget_period: 'FY-2026-27',
            project: 'Turnaround (Cost Avoidance)',
            total_revenue: 0, // Not applicable for FY
            monthly_avg: 0
        }
    ];
    
    console.log('✅ Parsed FY data:', {
        summary: summary.total_budget,
        monthly: monthly.length + ' months',
        expenditure: expenditure.length + ' categories',
        revenue: revenue.length + ' projects'
    });
    
    return { summary, monthly, expenditure, revenue };
}

// Sync one budget period
async function syncBudgetPeriod(data, periodName) {
    console.log(`\n💾 Syncing ${periodName}...\n`);
    
    // 1. Sync budget summary
    console.log('1️⃣  Syncing budget summary...');
    const { error: summaryError } = await supabase
        .from('budget_summary')
        .upsert(data.summary, { onConflict: 'budget_period' });
    
    if (summaryError) throw summaryError;
    console.log('   ✅ Summary synced');
    
    // 2. Sync monthly cash flow
    console.log('2️⃣  Syncing monthly cash flow...');
    for (const row of data.monthly) {
        const { error } = await supabase
            .from('budget_monthly')
            .upsert(row, { onConflict: 'budget_period,month' });
        if (error) throw error;
    }
    console.log(`   ✅ Monthly data synced (${data.monthly.length} months)`);
    
    // 3. Sync expenditure breakdown
    console.log('3️⃣  Syncing expenditure breakdown...');
    for (const row of data.expenditure) {
        const { error } = await supabase
            .from('budget_expenditure')
            .upsert(row, { onConflict: 'budget_period,category' });
        if (error) throw error;
    }
    console.log(`   ✅ Expenditure synced (${data.expenditure.length} categories)`);
    
    // 4. Sync revenue by project
    console.log('4️⃣  Syncing revenue by project...');
    for (const row of data.revenue) {
        const { error } = await supabase
            .from('budget_revenue')
            .upsert(row, { onConflict: 'budget_period,project' });
        if (error) throw error;
    }
    console.log(`   ✅ Revenue synced (${data.revenue.length} projects)`);
}

// Main sync function
async function syncToSupabase() {
    try {
        // Read Excel file
        console.log('📂 Reading Excel file...');
        const workbook = XLSX.readFile(EXCEL_FILE);
        
        // Sync Q1 2026
        if (workbook.SheetNames.includes('Budget Q1 2026')) {
            const sheetQ1 = workbook.Sheets['Budget Q1 2026'];
            const dataQ1 = parseBudgetQ1Sheet(sheetQ1);
            await syncBudgetPeriod(dataQ1, 'Q1 2026');
            
            console.log('\n✅ Q1 2026 sync complete!');
            console.log(`\n📊 Q1 Summary:`);
            console.log(`   • Total Budget: R${(dataQ1.summary.total_budget / 1000000).toFixed(2)}M`);
            console.log(`   • Expected Revenue: R${(dataQ1.summary.expected_revenue / 1000)}k`);
            console.log(`   • Net Deficit: R${(dataQ1.summary.net_deficit / 1000000).toFixed(2)}M`);
        } else {
            console.log('⚠️  Budget Q1 2026 sheet not found, skipping...');
        }
        
        // Sync FY 2026-27
        if (workbook.SheetNames.includes('Budget FY 2026-27')) {
            const sheetFY = workbook.Sheets['Budget FY 2026-27'];
            const dataFY = parseBudgetFYSheet(sheetFY);
            await syncBudgetPeriod(dataFY, 'FY 2026-27');
            
            console.log('\n✅ FY 2026-27 sync complete!');
            console.log(`\n📊 FY Summary:`);
            console.log(`   • Total Budget: R${(dataFY.summary.total_budget / 1000000).toFixed(2)}M`);
            console.log(`   • Expected Revenue: R${(dataFY.summary.expected_revenue / 1000000).toFixed(2)}M`);
            console.log(`   • Net Surplus: R${(dataFY.summary.net_deficit / 1000000).toFixed(2)}M`);
        } else {
            console.log('⚠️  Budget FY 2026-27 sheet not found, skipping...');
        }
        
        console.log('\n💡 Reports will now show updated values from Supabase');
        
    } catch (error) {
        console.error('\n❌ Sync failed:', error.message);
        process.exit(1);
    }
}

// Run sync
syncToSupabase();
