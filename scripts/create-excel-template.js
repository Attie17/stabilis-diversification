// Create Excel Template with all project data and formulas
const XLSX = require('xlsx');
const path = require('path');

console.log('📊 Creating Stabilis Data Excel Template...\n');

// Create workbook
const workbook = XLSX.utils.book_new();

// Diversification Sheet
const diversificationData = [
    ['STABILIS DIVERSIFICATION PROJECT'],
    [''],
    ['INVESTMENT BREAKDOWN'],
    ['Item', 'Amount (R)'],
    ['Setup Costs', 150000],
    ['Equipment', 200000],
    ['Staffing (6 months)', 300000],
    ['Marketing', 50000],
    ['Contingency', 100000],
    ['Total Investment', '=SUM(B5:B9)'],
    [''],
    ['REVENUE PROJECTIONS'],
    ['Source', 'Year 1 (R)', 'Year 2 (R)', 'Year 3 (R)'],
    ['New Programs', 500000, 750000, 1000000],
    ['Expanded Services', 300000, 450000, 600000],
    ['Partnerships', 200000, 300000, 400000],
    ['Projected Revenue', '=SUM(B14:B16)', '=SUM(C14:C16)', '=SUM(D14:D16)'],
    [''],
    ['RETURN ON INVESTMENT'],
    ['Total Investment', '=B10'],
    ['Total 3-Year Revenue', '=B17+C17+D17'],
    ['Net Gain', '=B21-B20'],
    ['ROI %', '=(B22/B20)*100'],
    ['Payback Period (months)', '=(B20/(B17/12))'],
];

const diversSheet = XLSX.utils.aoa_to_sheet(diversificationData);
XLSX.utils.book_append_sheet(workbook, diversSheet, 'Diversification');

// Turnaround Sheet
const turnaroundData = [
    ['STABILIS TURNAROUND PROJECT'],
    [''],
    ['INVESTMENT BREAKDOWN'],
    ['Item', 'Amount (R)'],
    ['Consultant Fees', 500000],
    ['Process Restructuring', 300000],
    ['Technology Upgrade', 400000],
    ['Staff Training', 200000],
    ['Contingency', 150000],
    ['Total Investment', '=SUM(B5:B9)'],
    [''],
    ['REVENUE PROJECTIONS'],
    ['Source', 'Year 1 (R)', 'Year 2 (R)', 'Year 3 (R)'],
    ['Cost Savings', 800000, 1000000, 1200000],
    ['Efficiency Gains', 600000, 750000, 900000],
    ['New Revenue Streams', 400000, 600000, 800000],
    ['Projected Revenue', '=SUM(B14:B16)', '=SUM(C14:C16)', '=SUM(D14:D16)'],
    [''],
    ['RETURN ON INVESTMENT'],
    ['Total Investment', '=B10'],
    ['Total 3-Year Revenue', '=B17+C17+D17'],
    ['Net Gain', '=B21-B20'],
    ['ROI %', '=(B22/B20)*100'],
    ['Payback Period (months)', '=(B20/(B17/12))'],
];

const turnaroundSheet = XLSX.utils.aoa_to_sheet(turnaroundData);
XLSX.utils.book_append_sheet(workbook, turnaroundSheet, 'Turnaround');

// Wellness Centre Sheet
const wellnessData = [
    ['STABILIS WELLNESS CENTRE PROJECT'],
    [''],
    ['INVESTMENT BREAKDOWN'],
    ['Item', 'Amount (R)'],
    ['Facility Setup', 1000000],
    ['Medical Equipment', 800000],
    ['Staffing (First Year)', 1200000],
    ['Marketing & Launch', 300000],
    ['Contingency', 500000],
    ['Total Investment', '=SUM(B5:B9)'],
    [''],
    ['REVENUE PROJECTIONS'],
    ['Source', 'Year 1 (R)', 'Year 2 (R)', 'Year 3 (R)'],
    ['Clinical Services', 1500000, 2000000, 2500000],
    ['Wellness Programs', 800000, 1200000, 1600000],
    ['Corporate Contracts', 1000000, 1500000, 2000000],
    ['Projected Revenue', '=SUM(B14:B16)', '=SUM(C14:C16)', '=SUM(D14:D16)'],
    [''],
    ['RETURN ON INVESTMENT'],
    ['Total Investment', '=B10'],
    ['Total 3-Year Revenue', '=B17+C17+D17'],
    ['Net Gain', '=B21-B20'],
    ['ROI %', '=(B22/B20)*100'],
    ['Payback Period (months)', '=(B20/(B17/12))'],
];

const wellnessSheet = XLSX.utils.aoa_to_sheet(wellnessData);
XLSX.utils.book_append_sheet(workbook, wellnessSheet, 'Wellness');

// Monthly Income Tracking Sheet
const monthlyData = [
    ['MONTHLY INCOME TRACKING - 2025'],
    [''],
    ['Month', 'Diversification', 'Turnaround', 'Wellness', 'Total'],
    ['January', 0, 0, 0, '=SUM(B4:D4)'],
    ['February', 0, 0, 0, '=SUM(B5:D5)'],
    ['March', 0, 0, 0, '=SUM(B6:D6)'],
    ['April', 0, 0, 0, '=SUM(B7:D7)'],
    ['May', 0, 0, 0, '=SUM(B8:D8)'],
    ['June', 0, 0, 0, '=SUM(B9:D9)'],
    ['July', 0, 0, 0, '=SUM(B10:D10)'],
    ['August', 0, 0, 0, '=SUM(B11:D11)'],
    ['September', 0, 0, 0, '=SUM(B12:D12)'],
    ['October', 0, 0, 0, '=SUM(B13:D13)'],
    ['November', 0, 0, 0, '=SUM(B14:D14)'],
    ['December', 0, 0, 0, '=SUM(B15:D15)'],
    [''],
    ['TOTALS', '=SUM(B4:B15)', '=SUM(C4:C15)', '=SUM(D4:D15)', '=SUM(E4:E15)'],
];

const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Income');

// Save workbook
const outputPath = path.join(__dirname, '../data/stabilis-data.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log('✅ Excel template created successfully!');
console.log('📁 Location:', outputPath);
console.log('\n📊 The file contains 4 sheets:');
console.log('   1. Diversification - Project investment and revenue');
console.log('   2. Turnaround - Project investment and revenue');
console.log('   3. Wellness - Project investment and revenue');
console.log('   4. Monthly Income - Track actual monthly income');
console.log('\n💡 Next steps:');
console.log('   1. Open the Excel file and review the structure');
console.log('   2. Edit values as needed (formulas will auto-calculate)');
console.log('   3. Save the file');
console.log('   4. Run: node scripts/excel-sync.js');
console.log('   5. Your dashboard will update automatically!\n');
