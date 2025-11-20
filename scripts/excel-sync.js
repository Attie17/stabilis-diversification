// Excel to Dashboard Sync Script
// Watches Excel file for changes and updates JavaScript data files

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const EXCEL_FILE = path.join(__dirname, '../data/stabilis-data.xlsx');
const DATA_DIR = path.join(__dirname, '../web/js');

console.log('📊 Excel Sync Service Starting...\n');

// Parse Excel and update data files
function syncExcelToJS() {
    if (!fs.existsSync(EXCEL_FILE)) {
        console.log('⚠️  Excel file not found. Please create:', EXCEL_FILE);
        console.log('   Run: node scripts/create-excel-template.js');
        return;
    }

    try {
        console.log('📖 Reading Excel file...');
        const workbook = XLSX.readFile(EXCEL_FILE);

        // Process each sheet
        const sheets = {
            'Diversification': 'data.js',
            'Turnaround': 'turnaround-data.js',
            'Wellness': 'wellness-data.js'
        };

        for (const [sheetName, dataFile] of Object.entries(sheets)) {
            if (!workbook.SheetNames.includes(sheetName)) {
                console.log(`⚠️  Sheet "${sheetName}" not found in Excel`);
                continue;
            }

            console.log(`\n🔄 Processing ${sheetName}...`);
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Extract revenue data
            const revenueData = extractRevenueData(jsonData, sheetName);

            // Update JavaScript file
            updateDataFile(dataFile, revenueData, sheetName);
        }

        console.log('\n✅ Sync complete! Dashboard data updated.');
        console.log('💡 Refresh your browser to see changes.\n');

    } catch (error) {
        console.error('❌ Error syncing Excel:', error.message);
    }
}

// Extract revenue data from Excel rows
function extractRevenueData(data, projectName) {
    const revenue = {
        totalInvestment: 0,
        projectedRevenue: 0,
        roi: 0,
        paybackMonths: 0,
        breakdown: []
    };

    // Look for key data rows (customize based on your Excel structure)
    for (let i = 0; i < data.length; i++) {
        const row = data[i];

        // Total Investment row
        if (row[0] && row[0].toString().includes('Total Investment')) {
            revenue.totalInvestment = parseFloat(row[1]) || 0;
        }

        // Projected Revenue row
        if (row[0] && row[0].toString().includes('Projected Revenue')) {
            revenue.projectedRevenue = parseFloat(row[1]) || 0;
        }

        // ROI row
        if (row[0] && row[0].toString().includes('ROI')) {
            revenue.roi = parseFloat(row[1]) || 0;
        }

        // Payback Period row
        if (row[0] && row[0].toString().includes('Payback')) {
            revenue.paybackMonths = parseFloat(row[1]) || 0;
        }
    }

    // Calculate ROI if not provided
    if (revenue.roi === 0 && revenue.totalInvestment > 0) {
        const netGain = revenue.projectedRevenue - revenue.totalInvestment;
        revenue.roi = ((netGain / revenue.totalInvestment) * 100).toFixed(1);
    }

    console.log(`   💰 Investment: R${revenue.totalInvestment.toLocaleString()}`);
    console.log(`   📈 Revenue: R${revenue.projectedRevenue.toLocaleString()}`);
    console.log(`   📊 ROI: ${revenue.roi}%`);

    return revenue;
}

// Update JavaScript data file
function updateDataFile(fileName, revenueData, projectName) {
    const filePath = path.join(DATA_DIR, fileName);

    if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️  File not found: ${fileName}`);
        return;
    }

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Update revenue section (customize regex based on your data structure)
        const revenueRegex = /revenue:\s*{[^}]*}/s;
        const newRevenue = `revenue: {
        total: ${revenueData.projectedRevenue},
        investment: ${revenueData.totalInvestment},
        roi: ${revenueData.roi},
        paybackMonths: ${revenueData.paybackMonths}
    }`;

        if (revenueRegex.test(content)) {
            content = content.replace(revenueRegex, newRevenue);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`   ✅ Updated ${fileName}`);
        } else {
            console.log(`   ⚠️  Revenue section not found in ${fileName}`);
        }

    } catch (error) {
        console.log(`   ❌ Error updating ${fileName}:`, error.message);
    }
}

// Watch Excel file for changes
function watchExcelFile() {
    if (!fs.existsSync(EXCEL_FILE)) {
        console.log('⚠️  Excel file not created yet. Run initial sync when ready.\n');
        return;
    }

    const watcher = chokidar.watch(EXCEL_FILE, {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100
        }
    });

    watcher.on('change', (path) => {
        console.log('\n📝 Excel file changed!');
        setTimeout(() => syncExcelToJS(), 500);
    });

    console.log('👀 Watching Excel file for changes...');
    console.log('   File:', EXCEL_FILE);
    console.log('   Press Ctrl+C to stop\n');
}

// Run sync immediately and then watch for changes
syncExcelToJS();
watchExcelFile();
