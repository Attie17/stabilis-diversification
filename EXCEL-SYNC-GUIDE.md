# Excel-to-Dashboard Sync System

## Overview

Edit your project data in Excel with full formula support, then automatically sync changes to your web dashboard.

## Quick Start

### 1. Excel File Already Created ✅

Location: `C:\Diversification\data\stabilis-data.xlsx`

The file contains 4 sheets:
- **Diversification** - Investment breakdown, revenue projections, ROI
- **Turnaround** - Investment breakdown, revenue projections, ROI  
- **Wellness** - Investment breakdown, revenue projections, ROI
- **Monthly Income** - Track actual monthly income for all projects

### 2. Edit Data in Excel

**From Dashboard:**
1. Go to Executive Dashboard
2. Click **"📊 Edit Data in Excel"** button in header
3. Excel file opens automatically
4. Edit values (formulas auto-calculate)
5. Save file (Ctrl+S)
6. Close Excel

**Or open manually:**
- Navigate to `C:\Diversification\data\`
- Open `stabilis-data.xlsx`

### 3. Sync Changes to Dashboard

**Option A: Automatic Watch Mode (Recommended)**
```bash
npm run excel-sync
```
This watches the Excel file and auto-syncs on save. Leave it running while you work.

**Option B: Manual Sync**
```bash
node scripts/excel-sync.js
```
Run this once after saving Excel to sync changes.

### 4. View Updated Dashboard

Refresh your browser to see the updated numbers!

## Excel Structure

### Investment Breakdown Sheets

Each project sheet has:

```
INVESTMENT BREAKDOWN
Item                    Amount (R)
Setup Costs            150,000
Equipment              200,000
Staffing               300,000
Marketing               50,000
Contingency            100,000
Total Investment       =SUM(B5:B9)

REVENUE PROJECTIONS
Source                  Year 1      Year 2      Year 3
New Programs           500,000     750,000   1,000,000
Expanded Services      300,000     450,000     600,000
Partnerships           200,000     300,000     400,000
Projected Revenue      =SUM(B14:B16) =SUM(C14:C16) =SUM(D14:D16)

RETURN ON INVESTMENT
Total Investment       =B10
Total 3-Year Revenue   =B17+C17+D17
Net Gain              =B21-B20
ROI %                 =(B22/B20)*100
Payback (months)      =(B20/(B17/12))
```

### Monthly Income Sheet

Track actual income vs projections:

```
MONTHLY INCOME TRACKING - 2025
Month          Diversification  Turnaround  Wellness    Total
January                 0            0           0      =SUM()
February                0            0           0      =SUM()
...
TOTALS             =SUM()       =SUM()      =SUM()   =SUM()
```

## How It Works

1. **Edit Excel** → Change any cell value
2. **Formulas Calculate** → Excel automatically updates dependent cells
3. **Save File** → Excel writes changes to disk
4. **Sync Script** → Reads Excel, extracts data
5. **Update JavaScript** → Modifies `data.js`, `turnaround-data.js`, `wellness-data.js`
6. **Dashboard Updates** → Refresh browser to see changes

## Commands

| Command | Purpose |
|---------|---------|
| `npm run excel-create` | Create new Excel template |
| `npm run excel-sync` | Watch Excel file and auto-sync changes |
| `node scripts/excel-sync.js` | One-time sync |

## Tips

### ✅ Best Practices

- **Always save Excel before closing** - Unsaved changes won't sync
- **Use formulas** - Excel calculates ROI, totals, etc. automatically
- **Keep sync running** - Leave `npm run excel-sync` running while editing
- **Refresh browser** - Press F5 after sync completes

### ⚠️ Important Notes

- Excel file must be at: `C:\Diversification\data\stabilis-data.xlsx`
- Don't rename sheets (Diversification, Turnaround, Wellness, Monthly Income)
- Sync script reads specific cell ranges - don't move key data rows
- Changes sync to local dashboard only - commit to Git for production

## Monthly Workflow

1. **Beginning of Month**
   - Open Excel
   - Enter actual income in "Monthly Income" sheet
   - Save file
   
2. **Adjust Projections**
   - Update investment amounts if changed
   - Modify revenue forecasts based on actuals
   - Formulas recalculate ROI automatically
   
3. **Sync to Dashboard**
   - Run `npm run excel-sync`
   - View updated metrics on Executive Dashboard
   
4. **Commit Changes**
   ```bash
   git add data/stabilis-data.xlsx
   git add web/js/*-data.js
   git commit -m "Update financial data for [Month]"
   git push
   ```

## Troubleshooting

**Excel file won't open from dashboard?**
- File path is hardcoded to `C:\Diversification\data\`
- If your project is elsewhere, update path in `executive-dashboard.html`

**Changes not showing in dashboard?**
- Did you run `npm run excel-sync`?
- Did you refresh browser (F5)?
- Check terminal for sync errors

**Formulas not calculating?**
- Excel may be in manual calc mode
- Press F9 to recalculate
- Or: File → Options → Formulas → Automatic

**Sync script errors?**
- Ensure Excel file is closed before syncing
- Check file isn't corrupted
- Verify `xlsx` package is installed: `npm install`

## Future Enhancements

Potential additions:
- Real-time browser refresh (no F5 needed)
- Backup/version history of Excel file
- Multi-user conflict resolution
- Direct Supabase integration
- Mobile Excel editing via OneDrive/Google Sheets

---

**You now have Excel-powered data management with instant dashboard updates!** 🎉
