# Excel Workbook Editing Guide

## Important: Localhost vs Web Deployment

The "Edit Workbook" feature has different behavior depending on where you access the dashboard:

### ✅ On Localhost (http://localhost:3000)
- **Feature Available**: Full Excel editing with live sync
- **How It Works**: 
  1. Click "Edit Workbook" button
  2. Excel opens with `stabilis-data.xlsx`
  3. Make your changes
  4. Save the file
  5. Changes automatically sync to dashboard

### ⚠️ On Web Deployment (Vercel/stabilisstrategy.app)
- **Feature NOT Available**: Button shows helpful error message
- **Why**: Web browsers cannot open local applications or access your file system for security reasons
- **What Happens**: Clear message explaining how to access locally

## How to Edit the Excel Workbook

### Step 1: Run Local Server
```bash
npm start
```

### Step 2: Access Dashboard Locally
Open in your browser:
```
http://localhost:3000/executive-dashboard.html
```

### Step 3: Click "Edit Workbook"
- Only available to **CEO (Attie Nel)** and **FM (Nastasha Jacobs)**
- Button will open Excel with the workbook

### Step 4: Edit and Save
- Make your changes in Excel
- Save the file (Ctrl+S)
- Changes automatically detected and synced

## Troubleshooting

### Button Not Responding on Web
**Symptom**: Clicking button shows error about localhost  
**Solution**: This is expected - Excel editing only works locally

### Server Not Starting
**Symptom**: Cannot access localhost:3000  
**Solution**: 
```bash
# Stop any running processes
Get-Process | Where-Object { $_.ProcessName -eq 'node' } | Stop-Process -Force

# Restart server
npm start
```

### Excel Not Opening
**Symptom**: Button clicked but Excel doesn't open  
**Solution**:
1. Check server terminal for error messages
2. Verify Excel is installed
3. Check file exists at: `C:\Diversification\data\stabilis-data.xlsx`

### Changes Not Syncing
**Symptom**: Edited Excel but dashboard doesn't update  
**Solution**: 
1. Check "Change Detection Service" is running in server terminal
2. Ensure you saved the Excel file
3. Refresh the dashboard (F5)

## Technical Details

### File Location
- **Source**: `C:\Diversification\data\stabilis-data.xlsx`
- **Web Copy**: `web/data/stabilis-data.xlsx`

### API Endpoint
- **URL**: `http://localhost:3000/api/open-excel`
- **Method**: GET
- **Response**: `{ success: true }` or `{ success: false, error: "..." }`

### Access Control
Only these users can edit:
- Attie Nel (CEO)
- Nastasha Jacobs (FM)
- Developer (testing)

### Sync Mechanism
The Change Detection Service watches the Excel file for modifications and automatically updates the dashboard when changes are saved.

## Budget Worksheets

The Excel workbook contains two budget worksheets:

### Budget Q1 2026 (Dec 2025 - Mar 2026)
- **Total Budget**: R2.46M
- **Expected Revenue**: R470k
- **Deficit**: -R1.99M (requires funding)
- **Period**: 4-month crisis turnaround phase

### Budget FY 2026-27 (Apr 2026 - Mar 2027)
- **Total Budget**: R7.35M
- **Expected Revenue**: R8.43M
- **Surplus**: +R495k
- **Breakeven**: December 2026
- **Period**: 12-month growth phase

Both worksheets have **live formulas** that auto-calculate totals, percentages, and variances.

## Security Note

The Excel editing feature is intentionally restricted to localhost for security:
- Prevents unauthorized file system access from the internet
- Ensures only local users with server access can edit
- Protects sensitive financial data

To edit the workbook, you must have:
1. Physical access to the computer running the server
2. Authorization (CEO or FM credentials)
3. Server running on localhost

---

**Last Updated**: November 21, 2025  
**Feature Status**: Working on localhost, appropriately restricted on web
