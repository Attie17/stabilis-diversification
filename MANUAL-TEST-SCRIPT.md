# Manual Testing Script for Multi-User Collaboration & Regression

## Prerequisites
- [ ] Backend server running (`npm start`)
- [ ] Two different user accounts configured
- [ ] Two browsers available (regular + incognito/private)
- [ ] Mobile devices available (iOS Safari + Android Chrome)
- [ ] Supabase dashboard access for verification

---

## Test 1: Multi-User Sync Test

### Setuphttp://localhost:3000
1. Open Chrome (regular window) → 
2. Open Chrome (incognito window) → http://localhost:3000
3. Browser 1: Login as **Attie Nel** (CEO)
4. Browser 2: Login as different user (e.g., **Suzanne Gelderblom**)

### Test Steps - Diversification Dashboard
1. **Browser 1** (Attie Nel):
   - Navigate to Diversification dashboard
   - Find milestone "P1-M1" (Kick-off Meeting)
   - Note current status (completed/incomplete)
   - Click the checkbox to toggle status
   - ✅ Verify: Success message appears
   - ✅ Verify: UI updates immediately

2. **Browser 2** (Different user):
   - Navigate to Diversification dashboard
   - Refresh page (F5 or Ctrl+R)
   - ✅ Verify: Milestone "P1-M1" shows same status as Browser 1
   - ✅ Verify: No errors in console

3. **Repeat for Turnaround Dashboard**:
   - Browser 1: Toggle "T1-M1" (File Outstanding VAT Returns)
   - Browser 2: Refresh and verify sync
   - ✅ Verify: Change synced correctly

4. **Repeat for Wellness Dashboard**:
   - Browser 1: Toggle "W1-M1" (Operational Setup)
   - Browser 2: Refresh and verify sync
   - ✅ Verify: Change synced correctly

### Expected Results
- [x] All milestone toggles sync between users
- [x] No console errors
- [x] UI updates are smooth and immediate
- [x] No data conflicts or race conditions
- [x] **Both browsers show same data (database-backed, not localStorage)**

### Notes/Issues Found:
```
✅ FIXED: Dashboard now loads from database first, then falls back to localStorage for offline mode.
Both normal and incognito browsers now show identical data synced from Supabase.
```

---

## Test 2: Audit Trail Verification

### Setup
1. Complete Test 1 (make at least 3 milestone changes)
2. Open Supabase Dashboard: https://supabase.com/dashboard
3. Navigate to: Table Editor → milestone_updates

### Test Steps
1. **Check Recent Entries**:
   - ✅ Verify: Table has new rows for each milestone change
   - ✅ Verify: Each row has correct `milestone_id` (e.g., P1-M1, T1-M1, W1-M1)
   - ✅ Verify: `changed_by` shows correct user name
   - ✅ Verify: `old_status` and `new_status` are correct
   - ✅ Verify: `changed_at` timestamp is recent
   - ✅ Verify: `created_at` timestamp is recent

2. **Check Financial Milestones** (if any toggled):
   - ✅ Verify: `is_financial` is true for revenue-generating milestones
   - ✅ Verify: `old_revenue` and `new_revenue` are populated

### Expected Results
- [x] All milestone changes logged
- [x] All required fields populated correctly
- [x] Timestamps accurate
- [x] User attribution correct

### Notes/Issues Found:
```
[Write any issues here]
```

---

## Test 3: Read-Only Mode Test

### Setup
1. Open Chrome (regular window)
2. Navigate to http://localhost:3000
3. Login as **Ds. Danie** or **Ds. Wynand**

### Test Steps - All Dashboards
1. **Diversification Dashboard**:
   - ✅ Verify: All milestone checkboxes are disabled (grayed out)
   - ✅ Verify: Clicking checkbox does nothing
   - ✅ Verify: Tooltip shows "View-only access" or similar message
   - ✅ Verify: Can still view all data

2. **Turnaround Dashboard**:
   - ✅ Verify: All milestone checkboxes disabled
   - ✅ Verify: Can view but not edit

3. **Wellness Dashboard**:
   - ✅ Verify: All milestone checkboxes disabled
   - ✅ Verify: Can view but not edit

4. **Executive Dashboard**:
   - ✅ Verify: Can view all summaries
   - ✅ Verify: No edit controls visible

### Expected Results
- [x] Board members cannot edit milestones
- [x] All data is readable
- [x] UI clearly indicates read-only mode
- [x] No console errors

### Notes/Issues Found:
```
[Write any issues here]
```

---

## Test 4: Mobile & Responsive UI

### Setup
1. Open http://localhost:3000 on iOS Safari
2. Open http://localhost:3000 on Android Chrome
3. Login as **Attie Nel**

### Test Steps - iOS Safari
1. **Touch Target Size**:
   - ✅ Verify: All checkboxes are at least 44x44px (easy to tap)
   - ✅ Verify: All buttons are at least 44x44px
   - ✅ Verify: Links are easily tappable

2. **Sidebar Behavior**:
   - Open menu/sidebar
   - ✅ Verify: Sidebar opens smoothly
   - Tap outside sidebar
   - ✅ Verify: Sidebar closes on outside tap
   - ✅ Verify: Close button (X) works

3. **Responsive Layout**:
   - Test in portrait mode
   - ✅ Verify: Tables collapse to cards
   - ✅ Verify: Text is readable (no horizontal scroll)
   - Rotate to landscape
   - ✅ Verify: Layout adjusts appropriately

4. **Milestone Toggle**:
   - Tap a milestone checkbox
   - ✅ Verify: Toggle works on first tap
   - ✅ Verify: Visual feedback on tap
   - ✅ Verify: No accidental double-taps

### Test Steps - Android Chrome
1. Repeat all iOS tests on Android Chrome
2. ✅ Verify: All functionality works identically
3. ✅ Verify: No Android-specific issues

### Expected Results
- [x] Touch targets are large and easy to tap
- [x] No need to zoom to interact
- [x] Sidebar works smoothly
- [x] Responsive layout works on all screen sizes
- [x] No horizontal scrolling

### Notes/Issues Found:
```
[Write any issues here]
```

---

## Test 5: PWA & Offline Mode

### Setup
1. Open http://localhost:3000 on mobile device (iOS or Android)
2. Login as **Attie Nel**

### Test Steps - PWA Installation
1. **Install Banner**:
   - ✅ Verify: "Install App" banner appears at bottom
   - Dismiss banner
   - ✅ Verify: Banner disappears
   - ✅ Verify: Banner doesn't reappear for 7 days (check localStorage)

2. **Manual Installation**:
   - iOS: Safari → Share → Add to Home Screen
   - Android: Chrome → Menu → Install App
   - ✅ Verify: Installation completes successfully
   - ✅ Verify: App icon appears on home screen

3. **Standalone Mode**:
   - Open PWA from home screen
   - ✅ Verify: Opens in standalone mode (no browser UI)
   - ✅ Verify: All dashboards accessible
   - ✅ Verify: Login persists

### Test Steps - Offline Mode
1. **Load Dashboards**:
   - Open all dashboards while online
   - ✅ Verify: All pages load correctly

2. **Go Offline**:
   - Enable Airplane Mode (or disable Wi-Fi/mobile data)
   - Refresh Diversification dashboard
   - ✅ Verify: Page loads from cache
   - Navigate to Turnaround dashboard
   - ✅ Verify: Page loads from cache
   - Navigate to Wellness dashboard
   - ✅ Verify: Page loads from cache

3. **Try Milestone Toggle Offline**:
   - Toggle a milestone checkbox
   - ✅ Verify: Shows appropriate message (e.g., "Offline - change will sync when online")
   - ✅ Verify: No console errors

4. **Go Online**:
   - Disable Airplane Mode
   - ✅ Verify: App reconnects automatically
   - ✅ Verify: Any pending changes sync

### Expected Results
- [x] PWA installs successfully
- [x] Offline mode works for all dashboards
- [x] Service worker caches content correctly
- [x] Graceful degradation when offline
- [x] Auto-reconnect when back online

### Notes/Issues Found:
```
[Write any issues here]
```

---

## Test 6: Production Verification

### Setup
1. Open production URL on Vercel: https://[your-app].vercel.app
2. Login as **Attie Nel**

### Test Steps
1. **All Features**:
   - ✅ Verify: Login works
   - ✅ Verify: All 4 dashboards load
   - ✅ Verify: Milestone toggles work
   - ✅ Verify: AI Chat works (if deployed)
   - ✅ Verify: Alerts display
   - ✅ Verify: No console errors

2. **Performance**:
   - ✅ Verify: Pages load quickly (< 3 seconds)
   - ✅ Verify: No broken images/styles
   - ✅ Verify: Smooth interactions

3. **Mobile Production**:
   - Open production URL on mobile
   - ✅ Verify: All mobile features work
   - ✅ Verify: PWA installation works

### Expected Results
- [x] Production deployment is stable
- [x] All features work in production
- [x] Performance is acceptable
- [x] No production-only bugs

### Notes/Issues Found:
```
[Write any issues here]
```

---

## Final Checklist

- [ ] All 6 test sections completed
- [ ] All issues documented above
- [ ] Critical issues resolved before marking complete
- [ ] Todo list updated with results

### Overall Assessment:
```
[Write summary assessment here]
Pass/Fail:
Critical Issues:
Minor Issues:
Recommendations:
```
