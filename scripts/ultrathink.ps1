# === ULTRATHINK PRE-BUILD SCRIPT (PowerShell) ===
$ULTRA_FILE = Join-Path (Get-Location) "ULTRATHINK.md"

if (Test-Path $ULTRA_FILE) {
    Clear-Host
    Write-Host "------------------------------------------------------------" -ForegroundColor Cyan
    Write-Host " 🧠  ENTERING ULTRATHINK MODE" -ForegroundColor Cyan
    Write-Host "------------------------------------------------------------" -ForegroundColor Cyan
    Get-Content $ULTRA_FILE | Write-Host
    Write-Host "`n>>> Mindset engaged. Building with precision, grace, and intent...`n" -ForegroundColor Green
} else {
    Write-Warning "⚠️  ULTRATHINK.md not found at repo root."
    exit 1
}
