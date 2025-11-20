// Add Budget Worksheets to Excel and Create Report Pages
// Converts the two budget markdown files into Excel worksheets

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_FILE = path.join(__dirname, '../data/stabilis-data.xlsx');
const BUDGET_Q1_MD = path.join(__dirname, '../BUDGET-DEC2025-MAR2026.md');
const BUDGET_FY_MD = path.join(__dirname, '../BUDGET-APR2026-MAR2027.md');

console.log('📊 Adding Budget Worksheets to Excel...\n');

// Helper function to create a cell with formula
function makeFormula(formula) {
    return { t: 'n', f: formula };
}

// Read existing workbook
let workbook;
if (fs.existsSync(EXCEL_FILE)) {
    console.log('📖 Reading existing Excel file...');
    workbook = XLSX.readFile(EXCEL_FILE);
} else {
    console.log('⚠️  Excel file not found. Creating new workbook...');
    workbook = XLSX.utils.book_new();
}

// Budget Q1 2026 (Dec 2025 - Mar 2026)
console.log('\n📝 Creating Budget Q1 2026 worksheet...');
const budgetQ1Data = [
    ['BUDGET: DECEMBER 2025 - MARCH 2026'],
    ['4-Month Period: Crisis Turnaround & Launch'],
    [''],
    ['EXECUTIVE SUMMARY'],
    ['Item', 'Amount (R)'],
    ['Total Budget', 2457000],
    ['Expected Revenue', 469800],
    ['Net Deficit', -1987200],
    ['Funding Required', 1987200],
    [''],
    ['MONTHLY CASH FLOW'],
    ['Month', 'Revenue', 'Expenditure', 'Net Cash Flow', 'Cumulative'],
    ['Dec 2025', 0, 895000, -895000, -895000],
    ['Jan 2026', 96400, 505000, -408600, -1303600],
    ['Feb 2026', 147200, 527000, -379800, -1683400],
    ['Mar 2026', 226200, 530000, -303800, -1987200],
    ['TOTAL', 0, 0, 0, 0],
    [''],
    ['EXPENDITURE BREAKDOWN'],
    ['Category', 'Amount (R)', '% of Total'],
    ['Existing Operations', 1400000, 0],
    ['Wellness Centre Setup', 675000, 0],
    ['Diversification', 180000, 0],
    ['Turnaround Project', 85000, 0],
    ['Contingency', 117000, 0],
    ['TOTAL', 0, 0],
    [''],
    ['REVENUE BY PROJECT'],
    ['Project', 'Total Revenue', 'Monthly Avg'],
    ['Diversification', 183600, 0],
    ['Wellness Centre', 262400, 0],
    ['Turnaround (Cost Avoidance)', 245000, 0],
    ['TOTAL', 0, 0],
    [''],
    ['EXISTING OPERATIONS DETAIL'],
    ['Category', 'Monthly', '4-Month Total'],
    ['Staff Salaries', 180000, 0],
    ['Facility Rent', 35000, 0],
    ['Utilities', 25000, 0],
    ['Insurance', 15000, 0],
    ['Security & Cleaning', 12000, 0],
    ['IT & Telecom', 8000, 0],
    ['Compliance & Licensing', 15000, 0],
    ['Medical Supplies', 20000, 0],
    ['Food & Catering', 18000, 0],
    ['Maintenance', 10000, 0],
    ['Office Supplies', 5000, 0],
    ['Transport', 4000, 0],
    ['Bank Fees', 3000, 0],
    ['TOTAL', 0, 0],
    [''],
    ['WELLNESS CENTRE COSTS'],
    ['Category', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Total'],
    ['Facility Lease Deposit', 150000, 0, 0, 0, 0],
    ['Renovations & Fit-Out', 180000, 0, 0, 0, 0],
    ['Furniture & Equipment', 80000, 0, 0, 0, 0],
    ['IT Infrastructure', 35000, 0, 0, 0, 0],
    ['Marketing Launch', 25000, 12000, 10000, 15000, 0],
    ['Legal & Setup', 15000, 0, 0, 0, 0],
    ['Recruitment', 10000, 0, 0, 0, 0],
    ['Facility Rent', 0, 50000, 50000, 50000, 0],
    ['Staff Salaries', 0, 75000, 100000, 125000, 0],
    ['Utilities & Operations', 0, 15000, 18000, 20000, 0],
    ['Supplies & Materials', 0, 8000, 10000, 12000, 0],
    ['Admin & Support', 0, 10000, 12000, 15000, 0],
    ['Technology', 0, 0, 0, 8000, 0],
    ['TOTAL', 0, 0, 0, 0, 0],
    [''],
    ['DIVERSIFICATION COSTS'],
    ['Category', 'Dec 2025', 'Jan-Mar (Monthly)', '3-Month Total', 'Total'],
    ['Staff Training', 25000, 0, 0, 0],
    ['Program Development', 15000, 0, 0, 0],
    ['Marketing', 10000, 8000, 0, 0],
    ['Legal & Compliance', 8000, 0, 0, 0],
    ['Equipment', 12000, 0, 0, 0],
    ['Clinical Staff (Part-time)', 0, 15000, 0, 0],
    ['Program Materials', 0, 5000, 0, 0],
    ['Data Tracking', 0, 2000, 0, 0],
    ['Quality Assurance', 0, 3000, 0, 0],
    ['Training & Development', 0, 4000, 0, 0],
    ['TOTAL', 0, 0, 0, 0],
    [''],
    ['TURNAROUND PROJECT COSTS'],
    ['Phase', 'Amount (R)', 'Notes'],
    ['Phase 1: Crisis Response (Dec)', 60000, 'SARS, audit, cash forecast, AR blitz, legal'],
    ['Phase 2: Stabilization (Jan-Mar)', 25000, 'KPI dashboard, billing, monitoring'],
    ['TOTAL', 0, ''],
    [''],
    ['KEY PERFORMANCE INDICATORS'],
    ['Metric', 'Target', 'Measurement'],
    ['Monthly Operating Margin', '-45% → -15%', 'Improving trend'],
    ['Days Sales Outstanding (DSO)', '≤30 days', 'Cash collection'],
    ['Cost per Patient/Client', 'Decrease 20%', 'Efficiency'],
    ['Revenue per Staff Hour', 'Increase 25%', 'Productivity'],
    ['Cash Runway', 'Maintain 6+ months', 'Survival buffer'],
    ['SARS Payment Plan', 'Signed', 'Dec 2025'],
    ['Maintenance Cost Reduction', '-65%', 'R84k → R30k/month'],
    ['AR Collections', '50% of R956k', 'R478k collected'],
    [''],
    ['FUNDING SOURCES'],
    ['Source', 'Amount (R)', '% of Total'],
    ['Investment Reserve Draw-down', 1400000, 0],
    ['Working Capital Facility', 350000, 0],
    ['Grant Funding (Lotto - Capex)', 200000, 0],
    ['Operational Cash Flow', 37200, 0],
    ['TOTAL FUNDING', 0, 0],
    [''],
    ['CRITICAL SUCCESS FACTORS'],
    ['Factor', 'Status', 'Priority'],
    ['SARS Payment Plan Signed', 'PENDING', 'CRITICAL'],
    ['Wellness Centre Launch Jan 2026', 'ON TRACK', 'HIGH'],
    ['Reserve Protection (>R2M)', 'AT RISK', 'HIGH'],
    ['Staff Retention', 'MONITORING', 'HIGH'],
    ['Turnaround 75% Complete', 'PENDING', 'MEDIUM'],
];

const budgetQ1Sheet = XLSX.utils.aoa_to_sheet(budgetQ1Data, { cellFormula: true, sheetStubs: true });

// Apply formulas after sheet creation
budgetQ1Sheet['B17'] = { t: 'n', f: 'SUM(B13:B16)' };
budgetQ1Sheet['C17'] = { t: 'n', f: 'SUM(C13:C16)' };
budgetQ1Sheet['D17'] = { t: 'n', f: 'SUM(D13:D16)' };
budgetQ1Sheet['E17'] = { t: 'n', f: 'E16' };

budgetQ1Sheet['C21'] = { t: 'n', f: 'B21/B6' };
budgetQ1Sheet['C22'] = { t: 'n', f: 'B22/B6' };
budgetQ1Sheet['C23'] = { t: 'n', f: 'B23/B6' };
budgetQ1Sheet['C24'] = { t: 'n', f: 'B24/B6' };
budgetQ1Sheet['C25'] = { t: 'n', f: 'B25/B6' };
budgetQ1Sheet['B26'] = { t: 'n', f: 'SUM(B21:B25)' };
budgetQ1Sheet['C26'] = { t: 'n', f: 'SUM(C21:C25)' };

budgetQ1Sheet['C30'] = { t: 'n', f: 'B30/4' };
budgetQ1Sheet['C31'] = { t: 'n', f: 'B31/4' };
budgetQ1Sheet['C32'] = { t: 'n', f: 'B32/4' };
budgetQ1Sheet['B33'] = { t: 'n', f: 'SUM(B30:B32)' };
budgetQ1Sheet['C33'] = { t: 'n', f: 'SUM(C30:C32)' };

budgetQ1Sheet['C37'] = { t: 'n', f: 'B37*4' };
budgetQ1Sheet['C38'] = { t: 'n', f: 'B38*4' };
budgetQ1Sheet['C39'] = { t: 'n', f: 'B39*4' };
budgetQ1Sheet['C40'] = { t: 'n', f: 'B40*4' };
budgetQ1Sheet['C41'] = { t: 'n', f: 'B41*4' };
budgetQ1Sheet['C42'] = { t: 'n', f: 'B42*4' };
budgetQ1Sheet['C43'] = { t: 'n', f: 'B43*4' };
budgetQ1Sheet['C44'] = { t: 'n', f: 'B44*4' };
budgetQ1Sheet['C45'] = { t: 'n', f: 'B45*4' };
budgetQ1Sheet['C46'] = { t: 'n', f: 'B46*4' };
budgetQ1Sheet['C47'] = { t: 'n', f: 'B47*4' };
budgetQ1Sheet['C48'] = { t: 'n', f: 'B48*4' };
budgetQ1Sheet['C49'] = { t: 'n', f: 'B49*4' };
budgetQ1Sheet['B50'] = { t: 'n', f: 'SUM(B37:B49)' };
budgetQ1Sheet['C50'] = { t: 'n', f: 'SUM(C37:C49)' };

budgetQ1Sheet['F53'] = { t: 'n', f: 'SUM(B53:E53)' };
budgetQ1Sheet['F54'] = { t: 'n', f: 'SUM(B54:E54)' };
budgetQ1Sheet['F55'] = { t: 'n', f: 'SUM(B55:E55)' };
budgetQ1Sheet['F56'] = { t: 'n', f: 'SUM(B56:E56)' };
budgetQ1Sheet['F57'] = { t: 'n', f: 'SUM(B57:E57)' };
budgetQ1Sheet['F58'] = { t: 'n', f: 'SUM(B58:E58)' };
budgetQ1Sheet['F59'] = { t: 'n', f: 'SUM(B59:E59)' };
budgetQ1Sheet['F60'] = { t: 'n', f: 'SUM(B60:E60)' };
budgetQ1Sheet['F61'] = { t: 'n', f: 'SUM(B61:E61)' };
budgetQ1Sheet['F62'] = { t: 'n', f: 'SUM(B62:E62)' };
budgetQ1Sheet['F63'] = { t: 'n', f: 'SUM(B63:E63)' };
budgetQ1Sheet['F64'] = { t: 'n', f: 'SUM(B64:E64)' };
budgetQ1Sheet['F65'] = { t: 'n', f: 'SUM(B65:E65)' };
budgetQ1Sheet['B66'] = { t: 'n', f: 'SUM(B53:B65)' };
budgetQ1Sheet['C66'] = { t: 'n', f: 'SUM(C53:C65)' };
budgetQ1Sheet['D66'] = { t: 'n', f: 'SUM(D53:D65)' };
budgetQ1Sheet['E66'] = { t: 'n', f: 'SUM(E53:E65)' };
budgetQ1Sheet['F66'] = { t: 'n', f: 'SUM(F53:F65)' };

budgetQ1Sheet['E69'] = { t: 'n', f: 'B69+D69' };
budgetQ1Sheet['E70'] = { t: 'n', f: 'B70+D70' };
budgetQ1Sheet['D71'] = { t: 'n', f: 'C71*3' };
budgetQ1Sheet['E71'] = { t: 'n', f: 'B71+D71' };
budgetQ1Sheet['E72'] = { t: 'n', f: 'B72+D72' };
budgetQ1Sheet['E73'] = { t: 'n', f: 'B73+D73' };
budgetQ1Sheet['D74'] = { t: 'n', f: 'C74*3' };
budgetQ1Sheet['E74'] = { t: 'n', f: 'B74+D74' };
budgetQ1Sheet['D75'] = { t: 'n', f: 'C75*3' };
budgetQ1Sheet['E75'] = { t: 'n', f: 'B75+D75' };
budgetQ1Sheet['D76'] = { t: 'n', f: 'C76*3' };
budgetQ1Sheet['E76'] = { t: 'n', f: 'B76+D76' };
budgetQ1Sheet['D77'] = { t: 'n', f: 'C77*3' };
budgetQ1Sheet['E77'] = { t: 'n', f: 'B77+D77' };
budgetQ1Sheet['D78'] = { t: 'n', f: 'C78*3' };
budgetQ1Sheet['E78'] = { t: 'n', f: 'B78+D78' };
budgetQ1Sheet['B79'] = { t: 'n', f: 'SUM(B69:B78)' };
budgetQ1Sheet['C79'] = { t: 'n', f: 'SUM(C69:C78)' };
budgetQ1Sheet['D79'] = { t: 'n', f: 'SUM(D69:D78)' };
budgetQ1Sheet['E79'] = { t: 'n', f: 'SUM(E69:E78)' };

budgetQ1Sheet['B84'] = { t: 'n', f: 'SUM(B82:B83)' };

budgetQ1Sheet['C98'] = { t: 'n', f: 'B98/$B$102' };
budgetQ1Sheet['C99'] = { t: 'n', f: 'B99/$B$102' };
budgetQ1Sheet['C100'] = { t: 'n', f: 'B100/$B$102' };
budgetQ1Sheet['C101'] = { t: 'n', f: 'B101/$B$102' };
budgetQ1Sheet['B102'] = { t: 'n', f: 'SUM(B98:B101)' };
budgetQ1Sheet['C102'] = { t: 'n', f: 'SUM(C98:C101)' };

// Set column widths
budgetQ1Sheet['!cols'] = [
    { wch: 30 }, // Column A
    { wch: 15 }, // Column B
    { wch: 15 }, // Column C
    { wch: 15 }, // Column D
    { wch: 15 }, // Column E
    { wch: 15 }  // Column F
];

// Add or replace sheet
const q1SheetName = 'Budget Q1 2026';
if (workbook.SheetNames.includes(q1SheetName)) {
    console.log(`   Replacing existing "${q1SheetName}" sheet...`);
    const sheetIndex = workbook.SheetNames.indexOf(q1SheetName);
    workbook.SheetNames.splice(sheetIndex, 1);
    delete workbook.Sheets[q1SheetName];
}
XLSX.utils.book_append_sheet(workbook, budgetQ1Sheet, q1SheetName);

// Budget FY 2026-2027 (Apr 2026 - Mar 2027)
console.log('📝 Creating Budget FY 2026-2027 worksheet...');
const budgetFYData = [
    ['BUDGET: APRIL 2026 - MARCH 2027'],
    ['12-Month Period: Growth & Profitability Year'],
    [''],
    ['EXECUTIVE SUMMARY'],
    ['Item', 'Amount (R)'],
    ['Total Operating Budget', 7350000],
    ['Expected Revenue', 8430075],
    ['Net Operating Surplus', 1080075],
    ['Operating Margin', '6.6%'],
    [''],
    ['QUARTERLY SUMMARY'],
    ['Quarter', 'Revenue', 'Expenses', 'Net', 'Cumulative'],
    ['Q2 2026 (Apr-Jun)', 1124350, 1969000, -844650, -2831500],
    ['Q3 2026 (Jul-Sep)', 1698925, 2130000, -431075, -3262575],
    ['Q4 2026 (Oct-Dec)', 2406750, 2289000, 117750, -3144825],
    ['Q1 2027 (Jan-Mar)', 2762400, 2607000, 155400, -2989425],
    ['TOTAL FY', 0, 0, 0, 0],
    [''],
    ['MONTHLY REVENUE DETAIL'],
    ['Month', 'Diversification', 'Wellness', 'Total'],
    ['Apr 2026', 61200, 202200, 0],
    ['May 2026', 140775, 266600, 0],
    ['Jun 2026', 140775, 312800, 0],
    ['Jul 2026', 140775, 378000, 0],
    ['Aug 2026', 140775, 423200, 0],
    ['Sep 2026', 140775, 475400, 0],
    ['Oct 2026', 140775, 509600, 0],
    ['Nov 2026', 140775, 541400, 0],
    ['Dec 2026', 500200, 574000, 0],
    ['Jan 2027', 500200, 580200, 0],
    ['Feb 2027', 256300, 583200, 0],
    ['Mar 2027', 256300, 586200, 0],
    ['TOTAL', 0, 0, 0],
    [''],
    ['EXPENDITURE BY CATEGORY'],
    ['Category', 'Annual Amount', '% of Total', 'Monthly Avg'],
    ['Existing Operations', 3360000, 0, 0],
    ['Wellness Centre', 2730000, 0, 0],
    ['Diversification', 1260000, 0, 0],
    ['Corporate & Overhead', 470000, 0, 0],
    ['Turnaround Maintenance', 60000, 0, 0],
    ['TOTAL OPERATING', 0, 0, 0],
    [''],
    ['CAPITAL EXPENDITURE (CAPEX)'],
    ['Quarter', 'Amount (R)', 'Key Items'],
    ['Q2 2026', 155000, 'IT upgrade, medical equipment, furniture'],
    ['Q3 2026', 210000, 'Vehicle, facility improvements, digital platform'],
    ['Q4 2026', 30000, 'Equipment replacement (R262k solar grant-funded)'],
    ['Q1 2027', 40000, 'Technology upgrades, office equipment'],
    ['TOTAL CAPEX', 0, ''],
    ['Less: Grant Funding', -262000, 'Lotto grant for solar'],
    ['NET CAPEX', 0, ''],
    [''],
    ['EXISTING OPERATIONS (POST-TURNAROUND)'],
    ['Category', 'Monthly', 'Annual'],
    ['Staff Salaries', 140000, 0],
    ['Facility Rent', 35000, 0],
    ['Utilities', 22000, 0],
    ['Insurance', 15000, 0],
    ['Security & Cleaning', 10000, 0],
    ['IT & Telecom', 8000, 0],
    ['Compliance & Licensing', 15000, 0],
    ['Medical Supplies', 18000, 0],
    ['Food & Catering', 15000, 0],
    ['Maintenance (Capped)', 10000, 0],
    ['Office Supplies', 4000, 0],
    ['Transport', 3000, 0],
    ['TOTAL', 0, 0],
    [''],
    ['WELLNESS CENTRE COSTS BY QUARTER'],
    ['Quarter', 'Rent', 'Salaries', 'Operations', 'Marketing', 'Other', 'Total'],
    ['Q2 2026', 150000, 465000, 75000, 53000, 146000, 0],
    ['Q3 2026', 150000, 540000, 90000, 66000, 204000, 0],
    ['Q4 2026', 150000, 585000, 96000, 60000, 225000, 0],
    ['Q1 2027', 150000, 585000, 96000, 54000, 234000, 0],
    ['TOTAL', 0, 0, 0, 0, 0, 0],
    [''],
    ['DIVERSIFICATION COSTS BY QUARTER'],
    ['Quarter', 'Staff', 'Training', 'Marketing', 'Materials', 'Other', 'Total'],
    ['Q2 2026 (Phase 3)', 120000, 30000, 36000, 24000, 30000, 0],
    ['Q3 2026 (Maintain)', 135000, 18000, 30000, 24000, 33000, 0],
    ['Q4 2026 (Phase 4)', 165000, 36000, 45000, 30000, 57000, 0],
    ['Q1 2027 (Phase 5)', 165000, 24000, 54000, 30000, 72000, 0],
    ['TOTAL', 0, 0, 0, 0, 0, 0],
    [''],
    ['KEY PERFORMANCE INDICATORS'],
    ['Metric', 'Target', 'Frequency'],
    ['Monthly Operating Margin', '5-8%', 'Monthly'],
    ['Revenue Growth (MoM)', '5-15%', 'Monthly'],
    ['Days Sales Outstanding', '≤28 days', 'Weekly'],
    ['Cash Runway', '≥90 days', 'Weekly'],
    ['Total Client Sessions', '3,600+', 'Annual'],
    ['Client Satisfaction', '≥4.5/5.0', 'Quarterly'],
    ['Staff Retention Rate', '≥85%', 'Annual'],
    ['Service Line Profitability', '100% (all)', 'Quarterly'],
    [''],
    ['FINANCING STRATEGY'],
    ['Option', 'Amount (R)', 'Status'],
    ['Opening Reserves (Apr 1)', 2000000, 'Available'],
    ['Credit Facility', 350000, 'Pre-approved'],
    ['Option 1: Reserve Draw-down', 1641000, 'Conservative'],
    ['Option 2: Reserves + Credit (Recommended)', 1000000, 'Balanced'],
    ['Option 3: Investor/Grant Funding', 1500000, 'Optimal'],
    [''],
    ['BREAKEVEN ANALYSIS'],
    ['Milestone', 'Month', 'Amount (R)'],
    ['First Positive Month', 'Dec 2026', 306200],
    ['Peak Deficit', 'Sep 2026', -3627925],
    ['Q4 Net Positive', 'Oct-Dec 2026', 117750],
    ['Full Payback Expected', 'Dec 2027-Apr 2028', 0],
    [''],
    ['RISK MITIGATION'],
    ['Risk', 'Probability', 'Impact', 'Mitigation Budget'],
    ['Revenue Shortfall', 'HIGH', 'HIGH', 200000],
    ['Cost Overruns', 'MEDIUM', 'MEDIUM', 150000],
    ['Cash Flow Crisis', 'HIGH', 'SEVERE', 350000],
    ['Staff Turnover', 'MEDIUM', 'HIGH', 100000],
    ['Regulatory Changes', 'MEDIUM', 'MEDIUM', 50000],
    ['TOTAL CONTINGENCY', '', '', 0],
];

const budgetFYSheet = XLSX.utils.aoa_to_sheet(budgetFYData, { cellFormula: true, sheetStubs: true });

// Apply formulas after sheet creation
budgetFYSheet['B17'] = { t: 'n', f: 'SUM(B13:B16)' };
budgetFYSheet['C17'] = { t: 'n', f: 'SUM(C13:C16)' };
budgetFYSheet['D17'] = { t: 'n', f: 'SUM(D13:D16)' };
budgetFYSheet['E17'] = { t: 'n', f: 'E16' };

budgetFYSheet['D21'] = { t: 'n', f: 'B21+C21' };
budgetFYSheet['D22'] = { t: 'n', f: 'B22+C22' };
budgetFYSheet['D23'] = { t: 'n', f: 'B23+C23' };
budgetFYSheet['D24'] = { t: 'n', f: 'B24+C24' };
budgetFYSheet['D25'] = { t: 'n', f: 'B25+C25' };
budgetFYSheet['D26'] = { t: 'n', f: 'B26+C26' };
budgetFYSheet['D27'] = { t: 'n', f: 'B27+C27' };
budgetFYSheet['D28'] = { t: 'n', f: 'B28+C28' };
budgetFYSheet['D29'] = { t: 'n', f: 'B29+C29' };
budgetFYSheet['D30'] = { t: 'n', f: 'B30+C30' };
budgetFYSheet['D31'] = { t: 'n', f: 'B31+C31' };
budgetFYSheet['D32'] = { t: 'n', f: 'B32+C32' };
budgetFYSheet['B33'] = { t: 'n', f: 'SUM(B21:B32)' };
budgetFYSheet['C33'] = { t: 'n', f: 'SUM(C21:C32)' };
budgetFYSheet['D33'] = { t: 'n', f: 'SUM(D21:D32)' };

budgetFYSheet['C37'] = { t: 'n', f: 'B37/$B$42' };
budgetFYSheet['D37'] = { t: 'n', f: 'B37/12' };
budgetFYSheet['C38'] = { t: 'n', f: 'B38/$B$42' };
budgetFYSheet['D38'] = { t: 'n', f: 'B38/12' };
budgetFYSheet['C39'] = { t: 'n', f: 'B39/$B$42' };
budgetFYSheet['D39'] = { t: 'n', f: 'B39/12' };
budgetFYSheet['C40'] = { t: 'n', f: 'B40/$B$42' };
budgetFYSheet['D40'] = { t: 'n', f: 'B40/12' };
budgetFYSheet['C41'] = { t: 'n', f: 'B41/$B$42' };
budgetFYSheet['D41'] = { t: 'n', f: 'B41/12' };
budgetFYSheet['B42'] = { t: 'n', f: 'SUM(B37:B41)' };
budgetFYSheet['C42'] = { t: 'n', f: 'SUM(C37:C41)' };
budgetFYSheet['D42'] = { t: 'n', f: 'SUM(D37:D41)' };

budgetFYSheet['B49'] = { t: 'n', f: 'SUM(B45:B48)' };
budgetFYSheet['B51'] = { t: 'n', f: 'B49+B50' };

budgetFYSheet['C55'] = { t: 'n', f: 'B55*12' };
budgetFYSheet['C56'] = { t: 'n', f: 'B56*12' };
budgetFYSheet['C57'] = { t: 'n', f: 'B57*12' };
budgetFYSheet['C58'] = { t: 'n', f: 'B58*12' };
budgetFYSheet['C59'] = { t: 'n', f: 'B59*12' };
budgetFYSheet['C60'] = { t: 'n', f: 'B60*12' };
budgetFYSheet['C61'] = { t: 'n', f: 'B61*12' };
budgetFYSheet['C62'] = { t: 'n', f: 'B62*12' };
budgetFYSheet['C63'] = { t: 'n', f: 'B63*12' };
budgetFYSheet['C64'] = { t: 'n', f: 'B64*12' };
budgetFYSheet['C65'] = { t: 'n', f: 'B65*12' };
budgetFYSheet['C66'] = { t: 'n', f: 'B66*12' };
budgetFYSheet['B67'] = { t: 'n', f: 'SUM(B55:B66)' };
budgetFYSheet['C67'] = { t: 'n', f: 'SUM(C55:C66)' };

budgetFYSheet['G71'] = { t: 'n', f: 'SUM(B71:F71)' };
budgetFYSheet['G72'] = { t: 'n', f: 'SUM(B72:F72)' };
budgetFYSheet['G73'] = { t: 'n', f: 'SUM(B73:F73)' };
budgetFYSheet['G74'] = { t: 'n', f: 'SUM(B74:F74)' };
budgetFYSheet['B75'] = { t: 'n', f: 'SUM(B71:B74)' };
budgetFYSheet['C75'] = { t: 'n', f: 'SUM(C71:C74)' };
budgetFYSheet['D75'] = { t: 'n', f: 'SUM(D71:D74)' };
budgetFYSheet['E75'] = { t: 'n', f: 'SUM(E71:E74)' };
budgetFYSheet['F75'] = { t: 'n', f: 'SUM(F71:F74)' };
budgetFYSheet['G75'] = { t: 'n', f: 'SUM(G71:G74)' };

budgetFYSheet['G79'] = { t: 'n', f: 'SUM(B79:F79)' };
budgetFYSheet['G80'] = { t: 'n', f: 'SUM(B80:F80)' };
budgetFYSheet['G81'] = { t: 'n', f: 'SUM(B81:F81)' };
budgetFYSheet['G82'] = { t: 'n', f: 'SUM(B82:F82)' };
budgetFYSheet['B83'] = { t: 'n', f: 'SUM(B79:B82)' };
budgetFYSheet['C83'] = { t: 'n', f: 'SUM(C79:C82)' };
budgetFYSheet['D83'] = { t: 'n', f: 'SUM(D79:D82)' };
budgetFYSheet['E83'] = { t: 'n', f: 'SUM(E79:E82)' };
budgetFYSheet['F83'] = { t: 'n', f: 'SUM(F79:F82)' };
budgetFYSheet['G83'] = { t: 'n', f: 'SUM(G79:G82)' };

budgetFYSheet['D115'] = { t: 'n', f: 'SUM(D110:D114)' };

// Set column widths
budgetFYSheet['!cols'] = [
    { wch: 30 }, // Column A
    { wch: 15 }, // Column B
    { wch: 15 }, // Column C
    { wch: 15 }, // Column D
    { wch: 15 }, // Column E
    { wch: 15 }, // Column F
    { wch: 15 }  // Column G
];

// Add or replace sheet
const fySheetName = 'Budget FY 2026-27';
if (workbook.SheetNames.includes(fySheetName)) {
    console.log(`   Replacing existing "${fySheetName}" sheet...`);
    const sheetIndex = workbook.SheetNames.indexOf(fySheetName);
    workbook.SheetNames.splice(sheetIndex, 1);
    delete workbook.Sheets[fySheetName];
}
XLSX.utils.book_append_sheet(workbook, budgetFYSheet, fySheetName);

// Save workbook
XLSX.writeFile(workbook, EXCEL_FILE);

console.log('\n✅ Budget worksheets added successfully!');
console.log('📁 Location:', EXCEL_FILE);
console.log('\n📊 New sheets added:');
console.log('   1. Budget Q1 2026 - Dec 2025 to Mar 2026 (4 months)');
console.log('   2. Budget FY 2026-27 - Apr 2026 to Mar 2027 (12 months)');
console.log('\n💡 Next steps:');
console.log('   1. Open Excel and review the budget worksheets');
console.log('   2. All formulas are live and will auto-calculate');
console.log('   3. Edit values as needed');
console.log('   4. Run: node scripts/add-budget-reports.js to create HTML reports\n');
