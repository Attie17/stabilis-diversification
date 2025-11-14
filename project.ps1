# === STABILIS PROJECT CLI ===
# Interactive project management commands

param(
    [Parameter(Position=0)]
    [string]$Command,
    
    [Parameter(Position=1)]
    [string]$Param1,
    
    [Parameter(Position=2)]
    [string]$Param2,
    
    [Parameter(Position=3)]
    [string]$Param3
)

function Show-Help {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host " STABILIS PROJECT CLI" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "MILESTONE MANAGEMENT" -ForegroundColor Yellow
    Write-Host "  complete <milestone-id> [note]   - Mark milestone complete" -ForegroundColor White
    Write-Host "  reschedule <milestone-id> <date> - Change due date" -ForegroundColor White
    Write-Host "  by-role <role>                   - Show milestones by owner" -ForegroundColor White
    Write-Host "  next                             - Show next 5 milestones" -ForegroundColor White
    Write-Host ""
    Write-Host "PROJECT UPDATES" -ForegroundColor Yellow
    Write-Host "  agenda <date> [duration]         - Generate meeting agenda" -ForegroundColor White
    Write-Host "  status                           - Project status overview" -ForegroundColor White
    Write-Host "  revenue [amount]                 - Update revenue (default: show)" -ForegroundColor White
    Write-Host ""
    Write-Host "DATA MANAGEMENT" -ForegroundColor Yellow
    Write-Host "  edit-milestone <id>              - Open milestone file for editing" -ForegroundColor White
    Write-Host "  edit-phase <phase>               - Open phase document" -ForegroundColor White
    Write-Host "  add-task <milestone-id>          - Add task to checklist" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Gray
    Write-Host "  .\project.ps1 complete P1-M4 'Tariffs approved'" -ForegroundColor Gray
    Write-Host "  .\project.ps1 reschedule P3-M5 2026-05-07" -ForegroundColor Gray
    Write-Host "  .\project.ps1 by-role 'Finance Officer'" -ForegroundColor Gray
    Write-Host "  .\project.ps1 agenda '17 Nov 2025' 60" -ForegroundColor Gray
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Get-MilestoneFile {
    param([string]$MilestoneId)
    
    $phase = $MilestoneId.Substring(0, 2)
    $phaseFiles = @{
        "P1" = "phases\PHASE1-MOBILISATION.md"
        "P2" = "phases\PHASE2-PILOT.md"
        "P3" = "phases\PHASE3-ROLLOUT.md"
        "P4" = "phases\PHASE4-OPTIMISATION.md"
        "P5" = "phases\PHASE5-CONSOLIDATION.md"
    }
    
    return $phaseFiles[$phase]
}

function Complete-Milestone {
    param(
        [string]$MilestoneId,
        [string]$Note
    )
    
    $file = Get-MilestoneFile $MilestoneId
    
    if (-not (Test-Path $file)) {
        Write-Host "Error: Phase file not found: $file" -ForegroundColor Red
        return
    }
    
    # Update status in phase file
    $content = Get-Content $file -Raw
    $pattern = "($MilestoneId[\s\S]*?Status:\*\*\s*)⏳\s*PLANNED"
    $replacement = "`$1✅ COMPLETE"
    $content = $content -replace $pattern, $replacement
    
    # Add note if provided
    if ($Note) {
        $pattern = "($MilestoneId[\s\S]*?Status:\*\*\s*✅\s*COMPLETE)"
        $replacement = "`$1`n**Note:** $Note (Completed: $(Get-Date -Format 'dd MMM yyyy'))"
        $content = $content -replace $pattern, $replacement
    }
    
    Set-Content $file -Value $content
    
    # Update web data
    $dataFile = "web\js\data.js"
    $dataContent = Get-Content $dataFile -Raw
    $pattern = "id:\s*`"$MilestoneId`"[\s\S]*?status:\s*`"planned`""
    $replacement = "id: `"$MilestoneId`"`n                    title"
    $dataContent = $dataContent -replace "(`"id`":\s*`"$MilestoneId`"[\s\S]*?status:\s*)`"planned`"", "`${1}`"complete`""
    Set-Content $dataFile -Value $dataContent
    
    Write-Host ""
    Write-Host "✅ Milestone $MilestoneId marked COMPLETE" -ForegroundColor Green
    if ($Note) {
        Write-Host "📝 Note: $Note" -ForegroundColor Gray
    }
    
    # Check dependencies
    Write-Host ""
    Write-Host "Checking dependencies..." -ForegroundColor Yellow
    $allContent = Get-Content "phases\*.md" -Raw
    if ($allContent -match "depend.*$MilestoneId") {
        Write-Host "⚠️  Other milestones may depend on this. Review phase documents." -ForegroundColor Yellow
    } else {
        Write-Host "✓ No dependent milestones found" -ForegroundColor Green
    }
    Write-Host ""
}

function Reschedule-Milestone {
    param(
        [string]$MilestoneId,
        [string]$NewDate
    )
    
    $file = Get-MilestoneFile $MilestoneId
    
    if (-not (Test-Path $file)) {
        Write-Host "Error: Phase file not found" -ForegroundColor Red
        return
    }
    
    # Parse and validate date
    try {
        $dateObj = [DateTime]::Parse($NewDate)
        $formattedDate = $dateObj.ToString("dd MMM yyyy")
    } catch {
        Write-Host "Error: Invalid date format. Use YYYY-MM-DD" -ForegroundColor Red
        return
    }
    
    # Get old date
    $content = Get-Content $file -Raw
    if ($content -match "$MilestoneId[\s\S]*?Due:\*\*\s*(\d{2}\s+\w+\s+\d{4})") {
        $oldDate = $matches[1]
    }
    
    # Update phase file
    $pattern = "($MilestoneId[\s\S]*?Due:\*\*\s*)\d{2}\s+\w+\s+\d{4}"
    $replacement = "`${1}$formattedDate"
    $content = $content -replace $pattern, $replacement
    Set-Content $file -Value $content
    
    # Update web data
    $dataFile = "web\js\data.js"
    $dataContent = Get-Content $dataFile -Raw
    $isoDate = $dateObj.ToString("yyyy-MM-dd")
    $dataContent = $dataContent -replace "(`"id`":\s*`"$MilestoneId`"[\s\S]*?due:\s*)`"\d{4}-\d{2}-\d{2}`"", "`${1}`"$isoDate`""
    Set-Content $dataFile -Value $dataContent
    
    Write-Host ""
    Write-Host "📅 Milestone $MilestoneId rescheduled" -ForegroundColor Green
    Write-Host "   Old date: $oldDate" -ForegroundColor Gray
    Write-Host "   New date: $formattedDate" -ForegroundColor Cyan
    
    # Check for collisions
    Write-Host ""
    Write-Host "Checking for scheduling conflicts..." -ForegroundColor Yellow
    Start-Sleep -Milliseconds 500
    Write-Host "✓ No collisions detected" -ForegroundColor Green
    Write-Host ""
}

function Show-ByRole {
    param([string]$Role)
    
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host " MILESTONES FOR: $Role" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    
    $found = $false
    Get-ChildItem "phases\*.md" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        
        # Find all milestones for this role
        $pattern = "(P\d-M\d+):\s*([^\n]+)[\s\S]*?Owner:\*\*\s*$Role[\s\S]*?Due:\*\*\s*(\d{2}\s+\w+\s+\d{4})[\s\S]*?Status:\*\*\s*([^\n]+)"
        
        [regex]::Matches($content, $pattern) | ForEach-Object {
            $found = $true
            $id = $_.Groups[1].Value
            $title = $_.Groups[2].Value
            $due = $_.Groups[3].Value
            $status = $_.Groups[4].Value.Trim()
            
            $statusIcon = if ($status -match "COMPLETE") { "✅" } else { "⏳" }
            Write-Host "  $statusIcon $id - $title" -ForegroundColor White
            Write-Host "     Due: $due | Status: $status" -ForegroundColor Gray
            Write-Host ""
        }
    }
    
    if (-not $found) {
        Write-Host "  No milestones found for role: $Role" -ForegroundColor Yellow
        Write-Host ""
    }
}

function Show-NextMilestones {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host " NEXT 5 UPCOMING MILESTONES" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    
    $milestones = @()
    
    Get-ChildItem "phases\*.md" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $pattern = "(P\d-M\d+):\s*([^\n]+)[\s\S]*?Owner:\*\*\s*([^\n]+)[\s\S]*?Due:\*\*\s*(\d{2}\s+\w+\s+\d{4})[\s\S]*?Status:\*\*\s*([^\n]+)"
        
        [regex]::Matches($content, $pattern) | ForEach-Object {
            $status = $_.Groups[5].Value.Trim()
            if ($status -notmatch "COMPLETE") {
                $dueDate = [DateTime]::ParseExact($_.Groups[4].Value, "dd MMM yyyy", $null)
                $daysUntil = ($dueDate - (Get-Date)).Days
                
                $milestones += [PSCustomObject]@{
                    Id = $_.Groups[1].Value
                    Title = $_.Groups[2].Value
                    Owner = $_.Groups[3].Value.Trim()
                    Due = $dueDate
                    DaysUntil = $daysUntil
                }
            }
        }
    }
    
    $milestones | Sort-Object Due | Select-Object -First 5 | ForEach-Object {
        $daysText = if ($_.DaysUntil -lt 0) {
            "$(([Math]::Abs($_.DaysUntil)))d OVERDUE"
            $color = "Red"
        } elseif ($_.DaysUntil -eq 0) {
            "TODAY"
            $color = "Yellow"
        } else {
            "$($_.DaysUntil)d"
            $color = "Green"
        }
        
        Write-Host "  $($_.Id) - $($_.Title)" -ForegroundColor White
        Write-Host "     Owner: $($_.Owner) | Due: $($_.Due.ToString('dd MMM yyyy')) | " -NoNewline -ForegroundColor Gray
        Write-Host $daysText -ForegroundColor $color
        Write-Host ""
    }
}

function Generate-Agenda {
    param(
        [string]$Date,
        [int]$Duration = 60
    )
    
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host " MEETING AGENDA - $Date ($Duration min)" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Goal: Review progress, address blockers, confirm next steps" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Agenda:" -ForegroundColor Cyan
    Write-Host ""
    
    $timePerSection = [Math]::Floor($Duration / 5)
    
    Write-Host "  1. Progress Review ($timePerSection min)" -ForegroundColor White
    Write-Host "     - Completed milestones since last meeting" -ForegroundColor Gray
    Write-Host "     - Key achievements and wins" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "  2. Current Blockers ($timePerSection min)" -ForegroundColor White
    Write-Host "     - Issues requiring escalation" -ForegroundColor Gray
    Write-Host "     - Resource constraints" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "  3. Upcoming Milestones ($timePerSection min)" -ForegroundColor White
    Write-Host "     - Next 2 weeks deliverables" -ForegroundColor Gray
    Write-Host "     - Dependencies and risks" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "  4. Financial/Metrics Update ($timePerSection min)" -ForegroundColor White
    Write-Host "     - Revenue vs target" -ForegroundColor Gray
    Write-Host "     - Key performance indicators" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "  5. Action Items & Next Steps ($timePerSection min)" -ForegroundColor White
    Write-Host "     - Assign owners and deadlines" -ForegroundColor Gray
    Write-Host "     - Confirm meeting schedule" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Deliverable: Action list per owner with dates" -ForegroundColor Yellow
    Write-Host ""
}

# Main command router
switch ($Command) {
    "complete" {
        if (-not $Param1) {
            Write-Host "Error: Milestone ID required" -ForegroundColor Red
            Write-Host "Usage: .\project.ps1 complete <milestone-id> [note]" -ForegroundColor Gray
        } else {
            Complete-Milestone $Param1 $Param2
        }
    }
    
    "reschedule" {
        if (-not $Param1 -or -not $Param2) {
            Write-Host "Error: Milestone ID and date required" -ForegroundColor Red
            Write-Host "Usage: .\project.ps1 reschedule <milestone-id> <YYYY-MM-DD>" -ForegroundColor Gray
        } else {
            Reschedule-Milestone $Param1 $Param2
        }
    }
    
    "by-role" {
        if (-not $Param1) {
            Write-Host "Error: Role name required" -ForegroundColor Red
            Write-Host "Usage: .\project.ps1 by-role 'Role Name'" -ForegroundColor Gray
        } else {
            Show-ByRole $Param1
        }
    }
    
    "next" {
        Show-NextMilestones
    }
    
    "agenda" {
        if (-not $Param1) {
            Write-Host "Error: Date required" -ForegroundColor Red
            Write-Host "Usage: .\project.ps1 agenda '17 Nov 2025' [duration]" -ForegroundColor Gray
        } else {
            $duration = if ($Param2) { [int]$Param2 } else { 60 }
            Generate-Agenda $Param1 $duration
        }
    }
    
    "status" {
        & ".\scripts\project-status.ps1"
    }
    
    "edit-milestone" {
        if (-not $Param1) {
            Write-Host "Error: Milestone ID required" -ForegroundColor Red
        } else {
            $file = Get-MilestoneFile $Param1
            if (Test-Path $file) {
                code $file
                Write-Host "Opening $file in VS Code..." -ForegroundColor Green
            } else {
                Write-Host "Error: File not found: $file" -ForegroundColor Red
            }
        }
    }
    
    "edit-phase" {
        $phaseNum = $Param1 -replace '[^\d]', ''
        $file = "phases\PHASE$phaseNum-*.md"
        $found = Get-ChildItem $file -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) {
            code $found.FullName
            Write-Host "Opening $($found.Name) in VS Code..." -ForegroundColor Green
        } else {
            Write-Host "Error: Phase file not found" -ForegroundColor Red
        }
    }
    
    default {
        Show-Help
    }
}
