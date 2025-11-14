# === STABILIS PROJECT STATUS CHECK ===
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " PROJECT STATUS - STABILIS DIVERSIFICATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Project dates
$projectStart = Get-Date "2025-11-17"
$projectEnd = Get-Date "2027-03-30"
$today = Get-Date

# Calculate days
$daysUntilStart = ($projectStart - $today).Days
$totalDays = ($projectEnd - $projectStart).Days
$daysElapsed = ($today - $projectStart).Days

if ($daysUntilStart -gt 0) {
    Write-Host "Project starts in: $daysUntilStart days" -ForegroundColor Yellow
    Write-Host "Launch date: 17 November 2025" -ForegroundColor Green
} elseif ($daysElapsed -ge 0 -and $daysElapsed -le $totalDays) {
    $percentComplete = [math]::Round(($daysElapsed / $totalDays) * 100, 1)
    Write-Host "Project in progress: Day $daysElapsed of $totalDays" -ForegroundColor Green
    Write-Host "Timeline: $percentComplete% complete" -ForegroundColor Green
} else {
    Write-Host "Project completed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "------------------------------------------------------------" -ForegroundColor Gray

# Check for phase files
$phases = @(
    "phases\PHASE1-MOBILISATION.md",
    "phases\PHASE2-PILOT.md",
    "phases\PHASE3-ROLLOUT.md",
    "phases\PHASE4-OPTIMISATION.md",
    "phases\PHASE5-CONSOLIDATION.md"
)

Write-Host "Phase Documents:" -ForegroundColor Cyan
foreach ($phase in $phases) {
    if (Test-Path $phase) {
        Write-Host "   [OK] $phase" -ForegroundColor Green
    } else {
        Write-Host "   [MISSING] $phase" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "------------------------------------------------------------" -ForegroundColor Gray
Write-Host "Financial Targets:" -ForegroundColor Cyan
Write-Host "   Annual Run-Rate Target: R2.104m" -ForegroundColor White
Write-Host "   16-Month Project Target: R6.169m" -ForegroundColor White
Write-Host "   Target Monthly Run-Rate: R374,000" -ForegroundColor White

Write-Host ""
Write-Host "------------------------------------------------------------" -ForegroundColor Gray
Write-Host "Quick Commands:" -ForegroundColor Cyan
Write-Host "   npm run dashboard   - View full project dashboard" -ForegroundColor White
Write-Host "   npm run phase1      - View Phase 1 details" -ForegroundColor White
Write-Host "   npm run phase2      - View Phase 2 details" -ForegroundColor White
Write-Host "   npm run status      - Show this status" -ForegroundColor White

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
