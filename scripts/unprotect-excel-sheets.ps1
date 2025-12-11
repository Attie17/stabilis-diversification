# Unprotect Excel Sheets Script
# This script removes protection from all sheets in the stabilis-data.xlsx workbook

$excelPath = Join-Path $PSScriptRoot "..\data\stabilis-data.xlsx"

Write-Host "`n📊 Unprotecting Excel Sheets" -ForegroundColor Cyan
Write-Host "=" * 60

# Check if file exists
if (-not (Test-Path $excelPath)) {
    Write-Host "❌ Excel file not found: $excelPath" -ForegroundColor Red
    exit 1
}

Write-Host "📂 Opening: $excelPath"

try {
    # Create Excel COM object
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    # Open workbook
    $workbook = $excel.Workbooks.Open($excelPath)
    
    Write-Host "`n🔍 Checking sheets..." -ForegroundColor Yellow
    
    $protectedCount = 0
    $unprotectedCount = 0
    
    foreach ($sheet in $workbook.Worksheets) {
        if ($sheet.ProtectContents) {
            $protectedCount++
            Write-Host "  🔒 $($sheet.Name) - Protected"
            
            try {
                # Try to unprotect without password first
                $sheet.Unprotect()
                Write-Host "    ✅ Unprotected successfully" -ForegroundColor Green
                $unprotectedCount++
            }
            catch {
                Write-Host "    ⚠️  Password required - attempting with blank password..." -ForegroundColor Yellow
                try {
                    $sheet.Unprotect("")
                    Write-Host "    ✅ Unprotected successfully" -ForegroundColor Green
                    $unprotectedCount++
                }
                catch {
                    Write-Host "    ❌ Failed to unprotect (password protected)" -ForegroundColor Red
                }
            }
        }
        else {
            Write-Host "  🔓 $($sheet.Name) - Already unprotected" -ForegroundColor Gray
        }
    }
    
    if ($unprotectedCount -gt 0) {
        # Save workbook
        $workbook.Save()
        Write-Host "`n✅ Workbook saved with $unprotectedCount sheet(s) unprotected" -ForegroundColor Green
    }
    else {
        Write-Host "`n✅ No changes needed" -ForegroundColor Green
    }
    
    # Close workbook
    $workbook.Close()
    $excel.Quit()
    
    # Release COM objects
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($workbook) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Host "`n📊 Summary:" -ForegroundColor Cyan
    Write-Host "  Protected sheets found: $protectedCount"
    Write-Host "  Successfully unprotected: $unprotectedCount"
    Write-Host "=" * 60
    Write-Host ""
}
catch {
    Write-Host "`n❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Cleanup on error
    if ($workbook) { $workbook.Close($false) }
    if ($excel) { $excel.Quit() }
    
    exit 1
}
