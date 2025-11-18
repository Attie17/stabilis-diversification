# AI-Powered Milestone Management Guide

## Overview
You can now use the AI Executive Assistant (the floating chat widget) to add, edit, and delete milestones using natural language. No need to manually edit files or use complex interfaces - just ask the AI!

## What You Can Do

### 1. Add New Milestones

**Example Requests:**
```
"Add a new milestone to Phase 1 called 'Staff Training' owned by HR Lead, due December 20th"

"Create a milestone P2-M7 in the diversification project for 'Quality Audit' assigned to Clinical Manager, due on 2026-01-15"

"Add a turnaround milestone T3-M5 for 'Cash Flow Review' owned by Finance Officer, due next month"
```

**What the AI Needs:**
- **Project** - Which project (diversification, turnaround, or wellness)
- **Phase ID** - Which phase to add to (e.g., P1, P2, T1, W2)
- **Milestone Details:**
  - ID (e.g., P1-M7, T2-M5)
  - Title
  - Owner/Person responsible
  - Due date
  - Description (optional)
  - Status (optional - defaults to "planned")

**The AI Will:**
- ✅ Validate the phase exists
- ✅ Check the milestone ID is unique
- ✅ Add the milestone to the data file
- ✅ Confirm the addition
- ❌ Prevent duplicate IDs
- ❌ Reject invalid phase IDs

---

### 2. Edit Existing Milestones

**Example Requests:**
```
"Change the due date of milestone P1-M3 to November 30th"

"Update P2-M1 to change the owner to Clinical Manager"

"Edit milestone T1-M2 - change the title to 'SARS Payment Agreement Signed' and status to 'in_progress'"

"Move the deadline for W1-M4 to January 10, 2026"
```

**What You Can Edit:**
- Title
- Description
- Owner
- Due date (format: YYYY-MM-DD)
- Status (planned, in_progress, complete, blocked)

**The AI Will:**
- ✅ Find the milestone across all phases
- ✅ Apply only the changes you specify
- ✅ Keep other fields unchanged
- ✅ Validate the updates
- ❌ Prevent editing non-existent milestones

---

### 3. Delete Milestones

**Example Requests:**
```
"Delete milestone P1-M7 from the diversification project"

"Remove T2-M3 from the turnaround project"

"Delete the milestone W3-M2 - it's no longer needed"
```

**The AI Will:**
- ✅ Find and remove the milestone
- ✅ Confirm which phase it was removed from
- ✅ Provide details of what was deleted
- ⚠️ **Warning:** This is permanent! The milestone will be removed from the data file

---

## How to Use

### Step 1: Open the AI Chat Widget
- Go to any project page (Executive Dashboard, Turnaround, or Wellness)
- Look for the floating **🤖 AI chat widget** in the bottom-right corner
- If minimized, click to expand it

### Step 2: Ask in Natural Language
You don't need to use exact commands. The AI understands context. Just explain what you want:

**Casual way:**
> "Hey, can you add a new milestone to Phase 2? It should be called Equipment Check, assigned to Operations Lead, and due on December 5th"

**Formal way:**
> "Add milestone P2-M7 titled 'Equipment Compliance Check' to the diversification project, owned by Operations Lead, due date 2025-12-05"

**Both work!** The AI will ask for clarification if it needs more details.

### Step 3: Confirm the Action
The AI will:
1. Process your request
2. Call the appropriate function (add/edit/delete)
3. Show you what was done
4. Confirm success or explain any errors

---

## Best Practices

### ✅ DO:
- **Be specific** about which project (diversification, turnaround, wellness)
- **Include milestone ID** when editing or deleting (e.g., P1-M3, T2-M1)
- **Use YYYY-MM-DD format** for dates (e.g., 2025-12-15)
- **Ask follow-up questions** if you're unsure about something
- **Check the result** - the AI will confirm what was changed

### ❌ DON'T:
- Don't create duplicate milestone IDs
- Don't delete milestones without checking if they're still needed
- Don't forget which project you're working on
- Don't use ambiguous references like "that milestone" without context

---

## Examples of Complete Conversations

### Example 1: Adding a Milestone
**You:**
> "I need to add a compliance milestone to Phase 1 of the diversification project"

**AI:**
> "I can help you add a compliance milestone to Phase 1. I'll need a few details:
> - Milestone ID (e.g., P1-M7)
> - Title
> - Who should own it?
> - When is it due?"

**You:**
> "ID should be P1-M7, title is Annual Compliance Review, owned by Compliance Officer, due December 20, 2025"

**AI:**
> "✅ Successfully added milestone P1-M7 to Phase 1 (P1) in diversification project:
> - Title: Annual Compliance Review
> - Owner: Compliance Officer
> - Due: 2025-12-20
> - Status: planned"

---

### Example 2: Editing a Milestone
**You:**
> "Can you change the due date of P2-M3 to January 5th?"

**AI:**
> "✅ Successfully updated milestone P2-M3 in diversification project:
> - Changed due date to: 2026-01-05
> All other fields remain unchanged."

---

### Example 3: Deleting a Milestone
**You:**
> "Delete milestone P1-M7 - we don't need it anymore"

**AI:**
> "✅ Successfully deleted milestone P1-M7 from Phase 1 (P1) in diversification project:
> - Title: Annual Compliance Review
> - Owner: Compliance Officer
> The milestone has been permanently removed from the project data."

---

## Milestone ID Conventions

### Diversification Project
- **Phase 1 (Mobilisation):** P1-M1, P1-M2, P1-M3...
- **Phase 2 (Pilot):** P2-M1, P2-M2, P2-M3...
- **Phase 3 (Rollout):** P3-M1, P3-M2, P3-M3...
- **Phase 4 (Optimisation):** P4-M1, P4-M2, P4-M3...
- **Phase 5 (Consolidation):** P5-M1, P5-M2, P5-M3...

### Turnaround Project
- **Phase 1:** T1-M1, T1-M2, T1-M3...
- **Phase 2:** T2-M1, T2-M2, T2-M3...
- Etc.

### Wellness Centre
- **Phase 1:** W1-M1, W1-M2, W1-M3...
- **Phase 2:** W2-M1, W2-M2, W2-M3...
- Etc.

---

## Status Values
When setting or updating milestone status, use these exact values:
- **planned** - Not yet started
- **in_progress** - Currently being worked on
- **complete** - Finished successfully
- **blocked** - Waiting on something/someone

---

## Troubleshooting

### "Milestone not found"
- Check you're using the correct milestone ID (e.g., P1-M3, not P1M3)
- Verify you specified the right project
- Make sure the milestone actually exists (ask AI to list milestones)

### "Milestone ID already exists"
- When adding, you're trying to use an ID that's already taken
- Check existing milestones in that phase
- Use the next available number (e.g., if P1-M6 exists, use P1-M7)

### "Phase not found"
- Double-check the phase ID (P1, P2, T1, W1, etc.)
- Make sure it exists in that project
- Ask the AI "What phases are in the [project] project?"

### Changes not appearing immediately
- **Refresh the browser page** after AI makes changes
- The data file is updated, but the frontend needs to reload
- If using the floating chat widget, refresh the page you're on

---

## Security & Permissions

### Who Can Make Changes?
The AI milestone management functions are available to all users with chat access, but consider:
- Only **trusted team members** should make structural changes
- **Project Managers** should approve major additions/deletions
- Keep a **backup** of your data files before bulk changes
- Use **git commits** to track who changed what

### Data Safety
- All changes are written to the actual data files
- Files are backed up by git (commit history)
- Changes are immediate and permanent
- No "undo" button - but you can manually revert via git

---

## Advanced Usage

### Add Multiple Milestones at Once
> "Add three milestones to Phase 3:
> 1. P3-M7 - Marketing Campaign, owned by Marketing Lead, due Feb 1st
> 2. P3-M8 - Partner Outreach, owned by Business Dev, due Feb 10th
> 3. P3-M9 - Revenue Review, owned by Finance Officer, due Feb 15th"

The AI will process each one sequentially.

### Bulk Status Update
> "Change all Phase 2 milestones to 'complete' status"

The AI can update multiple milestones in one request.

### Query Before Changing
> "Show me all milestones in Phase 1 that are overdue, then let me decide which ones to delete"

The AI will first list them, then wait for your decision.

---

## Tips for Success

1. **Always specify the project** - Don't assume the AI knows which project
2. **Use milestone IDs when editing/deleting** - More precise than titles
3. **Ask for confirmation** - "Can you show me milestone P2-M3 before I delete it?"
4. **Check your changes** - Refresh the page to see updates
5. **Commit often** - Use git to save snapshots after important changes
6. **Keep backups** - The data files are in `web/js/` - back them up regularly

---

## Quick Reference

| Action | Example Command |
|--------|-----------------|
| **Add** | "Add milestone P1-M7 for Training, owned by HR, due Dec 20" |
| **Edit Title** | "Change P2-M3 title to 'Updated Process Review'" |
| **Edit Owner** | "Change owner of T1-M2 to Finance Officer" |
| **Edit Date** | "Move P3-M1 deadline to January 15, 2026" |
| **Edit Status** | "Mark W2-M4 as complete" |
| **Delete** | "Delete milestone P1-M7" |
| **List** | "Show me all milestones in Phase 2" |
| **Check** | "What's the status of milestone P2-M3?" |

---

## Need Help?

If you're stuck or unsure:
- **Ask the AI:** "How do I add a milestone to Phase 2?"
- **Be specific:** Include project name, phase, and what you want to change
- **Check docs:** See `ARCHITECTURE.md` for system details
- **Contact support:** Ask your Project Manager or Technical Lead

---

## Summary

**You can now manage milestones by simply talking to the AI!** No more manual file editing, no complex interfaces - just describe what you need in plain English, and the AI Executive Assistant will handle the technical details.

**Remember:**
- 🤖 Use the floating chat widget
- 💬 Ask in natural language
- ✅ Check the confirmation message
- 🔄 Refresh your browser to see changes
- 📝 Keep your data backed up

Happy milestone managing! 🎯
