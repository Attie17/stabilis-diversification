# 📝 Making Changes to the Project

## YES! The project is fully editable at any stage.

---

## 🎯 Quick Commands (CLI)

### Mark Milestone Complete
```powershell
.\project.ps1 complete P1-M4 "Tariffs approved; deposit R3,000; pre-auth mandatory"
```

**What happens:**
- ✅ Milestone marked COMPLETE in phase document
- 📅 Completion date added
- 📝 Your note is saved
- 🔗 Dependency check runs automatically
- 🌐 Web app data updated

**Output:**
```
✅ Milestone P1-M4 marked COMPLETE
📝 Note: Tariffs approved; deposit R3,000; pre-auth mandatory
Checking dependencies...
⚠️  P2-M2 uses this policy from 01 Jan 2026
Suggest: send staff notice
```

---

### Reschedule Milestone
```powershell
.\project.ps1 reschedule P3-M5 2026-05-07
```

**What happens:**
- 📅 Due date changed in phase document
- 🌐 Web app calendar updated
- ⚠️ Collision check runs
- 🔗 Impact on dependent milestones shown

**Output:**
```
📅 Milestone P3-M5 rescheduled
   Old date: 30 Apr 2026
   New date: 07 May 2026
Checking for scheduling conflicts...
✓ Still precedes P3-M6 by 39 days
```

---

### View by Role
```powershell
.\project.ps1 by-role "Admissions Officer"
```

**Output:**
```
============================================================
 MILESTONES FOR: Admissions Officer
============================================================

  ⏳ P2-M2 - 28-Day Admissions Optimisation
     Due: 01 Jan 2026 | Status: PLANNED
     
Output by 16:00: occupancy %, denial log, unresolved docs
```

---

### Next Milestones
```powershell
.\project.ps1 next
```

Shows next 5 upcoming milestones with countdown

---

### Generate Meeting Agenda
```powershell
.\project.ps1 agenda "17 Nov 2025" 60
```

**Output:** Structured 60-min agenda with time allocations

---

## 📄 Direct File Editing

### Option 1: Use VS Code
```powershell
# Open specific phase
code phases\PHASE1-MOBILISATION.md

# Open milestone's phase
.\project.ps1 edit-milestone P2-M3

# Open entire project
code C:\Diversification
```

### Option 2: Edit Markdown Directly

All phase documents are in `phases/` folder:
- **PHASE1-MOBILISATION.md**
- **PHASE2-PILOT.md**
- **PHASE3-ROLLOUT.md**
- **PHASE4-OPTIMISATION.md**
- **PHASE5-CONSOLIDATION.md**

---

## 🔧 Common Changes

### 1. **Change a Due Date**

**In Phase Document:**
```markdown
### P3-M5: Financial Review #1
- **Owner:** Finance Officer
- **Due:** 30 Apr 2026  ← Change this
- **Status:** ⏳ PLANNED
```

**In Web App Data** (`web/js/data.js`):
```javascript
{
    id: "P3-M5",
    title: "Financial Review #1",
    owner: "Finance Officer",
    due: "2026-04-30",  ← Change this (YYYY-MM-DD format)
    status: "planned"
}
```

**Or use CLI:**
```powershell
.\project.ps1 reschedule P3-M5 2026-05-07
```

---

### 2. **Expand Checklist (Add Tasks)**

**In Phase Document**, find the milestone and add items:

```markdown
**Checklist:**
- [ ] Pull Jan–Apr actuals by service line
- [ ] Calculate monthly run-rate
- [ ] Compare to R2.104m annual target
- [ ] NEW TASK: Review competitor pricing  ← Add new tasks
- [ ] NEW TASK: Analyze market trends      ← Like this
```

---

### 3. **Add Output Metrics**

```markdown
**Expected Outcome:**  
Data-driven corrections for Q3.

**Output by 16:00:**  ← Add this section
- Revenue variance report
- Pricing recommendations
- Volume targets for Q3
- Excel dashboard updated
```

---

### 4. **Change Milestone Owner**

**In Phase Document:**
```markdown
- **Owner:** Finance Officer  ← Change role name
```

**In Web App Data:**
```javascript
owner: "Finance Officer",  ← Change here too
```

---

### 5. **Update Revenue Targets**

**In Phase Document:**
```markdown
| Phase 3 Total | - | **R1,877,000** | ⏳ |  ← Update amount
```

**In Web App Data:**
```javascript
revenue: 1877000,  ← Update number
```

**In PROJECT-DASHBOARD.md:**
Update the financial tables

---

### 6. **Add New Risk**

Edit `tracking/risks.md`:

```markdown
#### R-016: New Risk Title
- **Phase:** Phase X
- **Impact:** High/Medium/Low
- **Likelihood:** High/Medium/Low
- **Description:** What could go wrong
- **Mitigation:** How to prevent/reduce
- **Owner:** Role Name
- **Status:** Open
- **Review Date:** When to check
```

Then add to `web/js/data.js`:
```javascript
{
    id: "R-016",
    title: "New Risk Title",
    severity: "high",
    impact: "High",
    likelihood: "Medium",
    description: "Description text",
    owner: "Owner Name",
    status: "open"
}
```

---

### 7. **Add Team Member Names**

Edit `web/js/data.js`:

```javascript
{
    role: "CEO",
    name: "John Smith",  ← Change from "TBD"
    responsibilities: "Project sponsor, strategic decisions"
}
```

---

### 8. **Mark Milestone Complete**

**Option A - CLI (Recommended):**
```powershell
.\project.ps1 complete P1-M1 "Kick-off successful, 15 staff attended"
```

**Option B - Manual Edit:**

In phase document:
```markdown
- **Status:** ✅ COMPLETE
**Note:** Completed 17 Nov 2025 - All staff attended
```

In web data:
```javascript
status: "complete",
```

---

## 🌐 Web App Updates

After editing files, **refresh the browser** to see changes:

**Desktop:** `Ctrl + Shift + R` (hard refresh)  
**Mobile:** Clear cache or close/reopen browser

The web app reads from `web/js/data.js` - this is the single source for:
- All milestones
- Phase dates
- Revenue targets
- Risks
- Team members

---

## 📊 Update Revenue

Track actual revenue by editing milestone notes:

```powershell
.\project.ps1 complete P2-M1 "Pilot complete. Revenue: R52,000 (9 participants)"
```

Or maintain a running log in `reports/monthly/`:

```markdown
# Monthly Financial Report - January 2026

## Revenue by Service Line
- Adult OP: R52,000 (target: R45,000) ✅
- 28-Day: R450,000 (target: R450,000) ✅
- Aftercare: R12,000 (target: R15,000) ⚠️

**Total:** R514,000 / R510,000 target ✅
```

---

## 🔄 Workflow Examples

### Scenario 1: "P1-M4 completed, pricing approved"

```powershell
# 1. Mark complete with note
.\project.ps1 complete P1-M4 "Board approved: Inpatient R30k, Adult OP R5k, Deposit R3k mandatory"

# 2. Check what depends on it
.\project.ps1 next

# 3. Notify relevant teams (P2-M2 needs this)
# Send email/message to Admissions Officer
```

---

### Scenario 2: "Need to reschedule Financial Review"

```powershell
# 1. Reschedule
.\project.ps1 reschedule P3-M5 2026-05-07

# 2. Check impact
.\project.ps1 next

# 3. Update meeting invites
# 4. Note reason in phase document
```

---

### Scenario 3: "Admissions Officer wants daily checklist"

**Edit** `phases/PHASE2-PILOT.md`:

```markdown
### P2-M2: 28-Day Admissions Optimisation

**Daily Checklist (by 16:00):**
- [ ] Update occupancy dashboard
- [ ] Log pre-auth denials
- [ ] Resolve missing documents (same day)
- [ ] Send stats email to Finance
- [ ] Flag escalations to Clinical Manager

**Weekly Output:**
- Occupancy trend graph
- Denial reason analysis
- Cash conversion cycle time
```

---

### Scenario 4: "Youth Lead expands adolescent programme metrics"

**Edit** `phases/PHASE3-ROLLOUT.md`:

```markdown
### P3-M1: Adolescent Outpatient Launch

**Expanded Metrics:**
- Pre/post clinical assessments
- Family satisfaction scores
- School feedback forms
- Attendance rate (target: ≥85%)
- Parent session engagement
- Referral conversion rate
- 30-day follow-up outcomes
- Cost per participant

**Weekly Report Format:**
- Cohort attendance: X of Y sessions
- Clinical progress notes
- Family engagement level
- Issues/escalations
```

---

## 📱 Mobile Updates

Changes to **markdown files** require file editing (desktop).

Changes to **web app** can be done mobile-friendly by:
1. Using GitHub/cloud editor on phone
2. Syncing files (Dropbox, OneDrive)
3. Remote desktop to your PC

**Best practice:** Desktop for major edits, mobile for viewing

---

## 🔐 Version Control (Recommended)

### Initialize Git
```powershell
cd C:\Diversification
git init
git add .
git commit -m "Initial project setup"
```

### Track Changes
```powershell
# After editing
git add .
git commit -m "Rescheduled P3-M5 to 07 May 2026"
```

### View History
```powershell
git log --oneline
git diff HEAD~1  # See last change
```

---

## 🎯 CLI Command Reference

| Command | Syntax | Purpose |
|---------|--------|---------|
| **complete** | `.\project.ps1 complete P1-M4 "note"` | Mark milestone done |
| **reschedule** | `.\project.ps1 reschedule P3-M5 2026-05-07` | Change due date |
| **by-role** | `.\project.ps1 by-role "Finance"` | View role's milestones |
| **next** | `.\project.ps1 next` | Show next 5 milestones |
| **agenda** | `.\project.ps1 agenda "17 Nov" 60` | Generate meeting agenda |
| **status** | `.\project.ps1 status` | Project overview |
| **edit-milestone** | `.\project.ps1 edit-milestone P2-M3` | Open in VS Code |
| **edit-phase** | `.\project.ps1 edit-phase 2` | Open phase file |

---

## 💡 Pro Tips

1. **Always update both places:**
   - Phase markdown document (documentation)
   - Web app data.js (app interface)

2. **Use CLI commands** - they update both automatically

3. **Test changes** - refresh web app to confirm

4. **Document reasons** - add notes when rescheduling

5. **Check dependencies** - CLI warns about impacts

6. **Backup regularly** - use git or copy folder

7. **Mobile editing** - View-only is fine, edit on desktop

---

## ❓ FAQ

**Q: Can I add custom fields to milestones?**  
A: Yes! Edit the markdown checklist section freely.

**Q: What if I break something?**  
A: Keep a backup copy or use git to revert changes.

**Q: Do web app changes persist?**  
A: Milestone completion saves to browser. Data changes need file edits.

**Q: Can multiple people edit simultaneously?**  
A: Not without git/cloud sync. Use version control.

**Q: How do I add a new milestone?**  
A: Edit phase markdown + web/js/data.js. Follow existing format.

---

**The project is YOUR tool. Adapt it as you work!** 🚀
