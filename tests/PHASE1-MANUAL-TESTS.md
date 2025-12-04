# Phase 1 Manual Test Checklist
## Post-Deployment Validation

**Date:** December 4, 2025  
**Tester:** _______________  
**Environment:** [ ] Localhost [ ] Vercel Production

---

## Automated Tests
- [x] **11/11 tests PASSED** ✅
  - Excel file exists and valid size
  - budget-data-loader.js removed
  - Download button present in HTML
  - No SheetJS CDN references
  - Static values preserved
  - Other reports unchanged
  - Access control initialized
  - No async DOMContentLoaded
  - Static files served
  - Excel has Budget Q1 2026 sheet
  - Dashboard links to report

---

## Localhost Tests (http://localhost:3000)

### Setup
1. [ ] Server running: `npm start`
2. [ ] No console errors on startup
3. [ ] Port 3000 accessible

### Report Access
4. [ ] Open http://localhost:3000/executive
5. [ ] Executive Dashboard loads without errors
6. [ ] "Budget Q1 2026" card visible in Reports section
7. [ ] Click "Budget Q1 2026" card
8. [ ] Report loads in <2 seconds
9. [ ] No console errors (F12 → Console tab)

### Visual Verification
10. [ ] Report header displays: "Budget: December 2025 - March 2026"
11. [ ] Blue download section visible below header
12. [ ] Download button reads "📥 Download Excel Workbook"
13. [ ] Button has green background
14. [ ] Button hover changes to darker green
15. [ ] All tables render correctly
16. [ ] Executive summary shows: R2.46M, R470k, -R1.99M, R1.99M
17. [ ] Monthly cash flow table has 4 months + totals row
18. [ ] Expenditure breakdown table visible
19. [ ] No "undefined" or "NaN" values anywhere

### Functionality
20. [ ] Click download button
21. [ ] Excel file downloads (check Downloads folder)
22. [ ] File name: `stabilis-budget.xlsx`
23. [ ] File size >50KB
24. [ ] Open Excel file in Excel/Calc
25. [ ] Workbook has multiple sheets
26. [ ] "Budget Q1 2026" sheet exists
27. [ ] Sheet contains data (not empty)
28. [ ] Values in Excel match HTML report

### Navigation
29. [ ] Click browser back button → returns to Executive Dashboard
30. [ ] Click Budget Q1 2026 again → report reloads without errors
31. [ ] Refresh page (F5) → report loads from scratch
32. [ ] Hard refresh (Ctrl+Shift+R) → clears cache, still works

### Other Reports (Regression)
33. [ ] Click "Revenue Projection" → loads correctly
34. [ ] Click "Cost Analysis" → loads correctly
35. [ ] Click "Cashflow Projection" → loads correctly
36. [ ] Back to Executive Dashboard → no errors

### AI Assistant
37. [ ] AI chat widget visible (bottom right)
38. [ ] AI widget is collapsed (56px circle with "AI")
39. [ ] Click AI header → expands widget
40. [ ] Click minimize → returns to collapsed state

---

## Vercel Production Tests

**Vercel URL:** https://diversification-8qpqtk5qc-attie17s-projects.vercel.app

### Deployment
41. [ ] Code pushed to GitHub master branch
42. [ ] Vercel deployment triggered automatically
43. [ ] Deployment status: Success
44. [ ] No build errors in Vercel dashboard

### Report Access
45. [ ] Open Vercel URL + `/executive`
46. [ ] Executive Dashboard loads
47. [ ] Click "Budget Q1 2026"
48. [ ] Report loads without 404 errors
49. [ ] No CORS errors in console

### Download Functionality
50. [ ] Download button visible on Vercel
51. [ ] Click download button
52. [ ] Excel file downloads from Vercel URL
53. [ ] File downloads successfully (not 404/403)
54. [ ] Open downloaded file → Budget Q1 2026 sheet present

### Performance
55. [ ] Report loads in <5 seconds (Vercel)
56. [ ] No JavaScript errors in console
57. [ ] No missing resources (check Network tab)
58. [ ] Excel file accessible: `/data/stabilis-data.xlsx`

---

## Mobile Tests

### Mobile Safari (iOS)
59. [ ] Open report on iPhone/iPad
60. [ ] Sidebar closes when tapping off-canvas
61. [ ] Download button taps correctly
62. [ ] Excel downloads on mobile
63. [ ] Tables scroll horizontally if needed
64. [ ] Text readable (not too small)

### Mobile Chrome (Android)
65. [ ] Open report on Android device
66. [ ] Download button works
67. [ ] File downloads to device
68. [ ] Layout responsive (no horizontal scroll)

---

## Cross-Browser Tests

### Chrome/Edge
69. [ ] Report loads correctly
70. [ ] Download works

### Firefox
71. [ ] Report loads correctly
72. [ ] Download works

### Safari (Desktop)
73. [ ] Report loads correctly
74. [ ] Download works

---

## Error Scenarios

### Network Issues
75. [ ] Disconnect internet → Report still loads (static values)
76. [ ] Reconnect internet → Download button works again

### File Missing (Test Only)
77. [ ] Temporarily rename `data/stabilis-data.xlsx`
78. [ ] Click download button → Shows 404 or browser error (expected)
79. [ ] Report still displays static values (doesn't break)
80. [ ] Restore file name → download works again

---

## Sign-Off

**Automated Tests:** 11/11 PASSED ✅  
**Manual Tests Passed:** _____ / 80  
**Critical Issues Found:** _____  
**Minor Issues Found:** _____

**Recommendation:**
- [ ] **APPROVE** - Deploy to production
- [ ] **HOLD** - Fix issues first
- [ ] **ROLLBACK** - Revert changes

**Tester Signature:** _______________  
**Date:** _______________  
**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
