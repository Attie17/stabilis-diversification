# Data Persistence Solution

## Problem
Milestone completions, notes, and activities are lost when code changes are deployed because they're stored in browser localStorage.

## Root Cause
- `saveToLocalStorage()` in app.js stores data in browser memory
- localStorage is tied to the domain but NOT synced across deployments
- Code changes don't affect localStorage, but cache clears and different deployment URLs do

## Solution Options

### Option 1: Excel Sync (RECOMMENDED)
**Sync milestone status back to Excel file**

Advantages:
- ✅ Single source of truth
- ✅ CEO & FM can see changes in Excel
- ✅ Survives all deployments
- ✅ Can be backed up easily

Implementation:
1. Add API endpoint `/api/milestone/update` in server.js
2. When milestone status changes, POST to server
3. Server updates Excel file using exceljs
4. Dashboard reads from Excel on load

**Files to modify:**
- `server.js` - Add milestone update endpoint
- `web/js/app.js` - Add `syncToExcel()` function after status change
- `web/js/data.js` - Load status from Excel data

### Option 2: Database (COMPLEX)
Use PostgreSQL or SQLite to store milestone updates

Advantages:
- ✅ Fast queries
- ✅ Multiple users simultaneously

Disadvantages:
- ❌ Adds complexity
- ❌ Need to maintain DB schema
- ❌ Excel becomes secondary

### Option 3: Version-Aware LocalStorage (PARTIAL FIX)
Add version number to localStorage keys

Advantages:
- ✅ Quick fix
- ✅ No backend changes

Disadvantages:
- ❌ Still loses data on cache clear
- ❌ Not shared across devices
- ❌ Not visible in Excel

## Recommended Implementation

### Phase 1: Excel Sync (Priority 1)
Add these fields to Excel worksheets:
- Status (Complete/In Progress/Planned)
- Completion Date
- Notes
- Last Updated By

### Phase 2: Hybrid Approach
- Read from Excel on page load (source of truth)
- Save to localStorage for fast access
- Sync back to Excel every 30 seconds
- Show "Syncing..." indicator

### Code Example

```javascript
// In app.js
async function syncMilestoneToExcel(milestoneId, updates) {
    try {
        const response = await fetch('/api/milestone/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                milestoneId,
                updates,
                user: currentUser.name
            })
        });
        
        if (!response.ok) {
            console.error('Failed to sync to Excel');
            // Still save to localStorage as backup
        }
    } catch (error) {
        console.error('Sync error:', error);
    }
}

// Modify toggleMilestoneStatus
function toggleMilestoneStatus(milestoneId, refreshUI = true) {
    let found = false;
    let updatedMilestone = null;
    
    projectData.phases.forEach(phase => {
        const milestone = phase.milestones.find(m => m.id === milestoneId);
        if (milestone) {
            milestone.status = milestone.status === 'complete' ? 'planned' : 'complete';
            milestone.completedDate = milestone.status === 'complete' ? new Date().toISOString() : null;
            milestone.completedBy = milestone.status === 'complete' ? currentUser.name : null;
            updatedMilestone = milestone;
            found = true;
        }
    });
    
    if (!found) return;

    // Sync to Excel immediately
    syncMilestoneToExcel(milestoneId, {
        status: updatedMilestone.status,
        completedDate: updatedMilestone.completedDate,
        completedBy: updatedMilestone.completedBy
    });

    // Also save to localStorage as backup
    saveMilestoneStatus();
    
    if (refreshUI) {
        updateDashboard();
        schedulePhaseRender();
        saveToLocalStorage();
    }
}
```

## Next Steps

1. **Immediate**: Add Excel columns for milestone status
2. **Week 1**: Implement Excel sync endpoint
3. **Week 2**: Add sync to all milestone updates
4. **Week 3**: Add sync status indicator in UI
5. **Week 4**: Add conflict resolution (Excel vs localStorage)

## Rollback Plan
If Excel sync fails, system falls back to localStorage (current behavior).
