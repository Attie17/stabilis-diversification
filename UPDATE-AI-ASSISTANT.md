# 🔄 Update OpenAI Assistant with New Persona

**Purpose:** Apply the new "Data Interpreter" persona to your OpenAI Assistant

---

## Quick Update (5 Minutes)

### Step 1: Run Setup Script
```powershell
node scripts/setup-openai.js
```

**What this does:**
- Creates a new OpenAI Assistant with updated persona
- Saves assistant ID to `config/assistant-config.json`
- Uploads project documentation for file search
- Tests the assistant with sample queries

### Step 2: Verify Configuration
Check that `config/assistant-config.json` was created:
```powershell
Get-Content config/assistant-config.json
```

Should show:
```json
{
  "assistantId": "asst_xxxxxxxxxxxxxxxxxxxxx"
}
```

### Step 3: Test in App
1. Open https://diversification-j8i5ov91r-attie17s-projects.vercel.app
2. Click AI chat button (bottom right)
3. Ask: "What milestones are due this week?"
4. Verify response uses real data (not hallucinated)

---

## What Changed in the Persona

### Before (Generic Assistant):
- Generic project management advice
- Could hallucinate data
- Mixed external knowledge with app data
- Casual, conversational tone

### After (Data Interpreter):
- ✅ **Zero hallucination** - only uses provided data
- ✅ **Executive summaries** - clear, concise, actionable
- ✅ **Structured output** - always includes JSON
- ✅ **Explicit about missing data** - never guesses
- ✅ **Professional tone** - Chief-of-Staff style

---

## Key Behavior Changes

### 1. Data-Only Responses
**Old:** "Based on typical timelines, Phase 3 should take 6 months."
**New:** "Phase 3 duration not specified in provided data."

### 2. Structured Format
**Old:** Free-form text responses
**New:** 
- Executive Summary
- Data Breakdown (tables/lists)
- Machine-readable JSON

### 3. Missing Data Handling
**Old:** Makes assumptions or guesses
**New:** Explicitly states: "This information is not available in the provided data."

### 4. External Knowledge
**Old:** Mixes general advice with app data
**New:** Only uses external knowledge when explicitly asked: "Use external knowledge to explain medical aid compliance"

---

## Testing Checklist

After updating, test these scenarios:

### ✅ Test 1: Real Data Query
```
You: "What's Phase 2 status?"
Expected: Uses get_milestones() function, returns real milestone data
```

### ✅ Test 2: Missing Data
```
You: "How many team members do we have?"
Expected: "This information is not available in the provided data."
```

### ✅ Test 3: Overdue Detection
```
You: "What milestones are overdue?"
Expected: Specific list with dates, owners, days overdue (from real data)
```

### ✅ Test 4: JSON Output
```
You: "Show Phase 1 progress"
Expected: Response includes JSON block with computed metrics
```

### ✅ Test 5: Date Logic
```
You: "What's due in December?"
Expected: States assumption ("December 1-31, 2025 inclusive"), lists real milestones
```

---

## Troubleshooting

### Issue: "Assistant not found" error
**Solution:** Re-run `node scripts/setup-openai.js`

### Issue: Old responses still appearing
**Solution:** 
1. Check `config/assistant-config.json` has new ID
2. Restart Vercel deployment: `vercel --prod --yes`
3. Hard refresh browser (Ctrl+Shift+R)

### Issue: "This information is not available" too often
**Cause:** Data quality - milestones missing fields
**Solution:** Check `web/js/data.js` - ensure all milestones have:
- `id`
- `title`
- `dueDate` (or `due`)
- `status`
- `owner`

---

## Environment Variables Required

Ensure `.env` has:
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

Get key from: https://platform.openai.com/api-keys

---

## Files Modified

| File | Change |
|------|--------|
| `scripts/setup-openai.js` | Updated assistant instructions (lines 16-135) |
| `AI-EXECUTIVE-ASSISTANT-PERSONA.md` | New reference documentation |

---

## Next Steps

After updating:
1. ✅ Test with real queries
2. ✅ Monitor for hallucinations (should be zero)
3. ✅ Verify JSON outputs are valid
4. ✅ Check that missing data is handled gracefully

If the assistant ever invents data, report as critical bug.

---

**Updated:** November 26, 2025  
**Version:** 1.0
