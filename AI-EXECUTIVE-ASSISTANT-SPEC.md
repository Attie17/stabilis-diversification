# AI Executive Assistant - Technical Specification

**Project:** Stabilis Diversification  
**Purpose:** Personal AI assistant with deep knowledge of the entire project ecosystem  
**Access:** Private - Owner only  
**Date:** November 18, 2025

---

## 1. CURRENT STATE ANALYSIS

### Existing "AI Copilot"
**Location:** `web/js/ai-copilot.js`, `turnaround-copilot.js`, `wellness-copilot.js`
- **Reality:** Static contextual help, NOT real AI
- **Capabilities:**
  - Displays milestone-specific guidance (hardcoded)
  - Shows tips, common questions, what you need lists
  - Revenue calculator with preset scenarios
  - General help FAQ
- **Limitations:**
  - No understanding of context or state
  - Cannot answer dynamic questions
  - No memory of user actions or changes
  - Cannot research or verify implementations
  - Zero awareness of codebase

### Data Architecture
**Static JS Files:**
- `data.js` - Diversification project (76 milestones, 5 phases)
- `turnaround-data.js` - Turnaround crisis milestones
- `wellness-data.js` - Wellness Centre milestones

**LocalStorage Usage:**
- Notes per milestone (`notes-${milestoneId}`)
- Status changes (`status-${milestoneId}`)
- File attachments (metadata only)
- Theme preferences
- User authentication (basic)

**No Backend:**
- No database
- No API layer
- No server-side logic (Express only serves static files)
- No persistence across devices

---

## 2. REQUIRED CAPABILITIES

### Core Intelligence
1. **Deep Project Knowledge**
   - Understand all 76+ milestones across 3 initiatives
   - Know relationships between phases, dependencies, timelines
   - Access phase documentation (25+ markdown files)
   - Revenue projections, risk tracking, team structure

2. **Codebase Awareness**
   - Understand application architecture
   - Know which files control what features
   - Track when code changes were made
   - Verify if requested features were implemented

3. **Action Tracking**
   - Monitor milestone status changes
   - Detect when notes are added
   - Track completion patterns
   - Alert on missed deadlines or blocked tasks

4. **Dynamic Q&A**
   - "What's the status of Phase 2?"
   - "Which milestones are overdue?"
   - "Show me Adult OP revenue projections"
   - "Has the pricing policy been implemented?"
   - "What dependencies block P3-M4?"

5. **External Research**
   - Web search for context (e.g., medical aid policies, compliance requirements)
   - Fetch external documentation when needed
   - Stay updated on relevant industry changes

6. **Verification & Auditing**
   - Check if changes were actually implemented
   - Compare current state vs. requested changes
   - Validate data integrity
   - Detect configuration drift

---

## 3. ARCHITECTURE OPTIONS

### Option A: OpenAI Assistants API (Recommended)
**Pros:**
- Built-in conversation memory
- Code Interpreter for data analysis
- File Search across uploaded documents
- Function calling for custom actions
- Maintained by OpenAI (auto-updates)

**Cons:**
- Requires OpenAI API key (paid)
- Data sent to OpenAI servers
- Less control over prompt engineering

**Best For:** Quick deployment, rich out-of-box features

---

### Option B: Custom RAG + GPT-4
**Components:**
1. **Vector Database:** Supabase with pgvector
2. **Embeddings:** OpenAI text-embedding-3-small
3. **LLM:** GPT-4 or GPT-4-turbo
4. **Backend:** Node.js + Supabase Edge Functions

**Pros:**
- Full control over data flow
- Custom retrieval logic
- Can stay local or self-hosted
- Fine-tuned context injection

**Cons:**
- More development effort
- Need to manage embeddings pipeline
- Manual conversation history management

**Best For:** Maximum control, sensitive data handling

---

### Option C: Hybrid Approach (Optimal)
**Architecture:**
```
Frontend (Current HTML/JS)
    ↓
API Layer (Node.js Express + Supabase Edge Functions)
    ↓
Supabase Postgres (project data + embeddings)
    ↓
OpenAI Assistants API (with File Search)
    +
Custom Functions (codebase analysis, change detection)
```

**Why Hybrid:**
- Assistants API handles conversation + document search
- Supabase stores real-time project state
- Custom functions verify code changes
- External APIs for research (web search, GitHub, etc.)

---

## 4. DATA SOURCES TO INDEX

### Project Documentation (25+ files)
- Phase plans (PHASE1-5.md)
- Revenue projections
- Risk tracking
- Milestone ownership
- Deployment guides
- Security docs

### Application Code
- `data.js`, `turnaround-data.js`, `wellness-data.js`
- All copilot content
- UI components and routing
- Authentication logic

### Real-Time State
- Milestone completion status
- User notes and attachments
- Status change history
- Progress metrics

### External Context
- Medical aid policies (via web search)
- Compliance requirements
- Industry best practices

---

## 5. IMPLEMENTATION PLAN

### Phase 1: Backend Setup (Week 1)
**Tasks:**
1. Create Supabase project
2. Design database schema:
   - `milestones` table (synced from static JS)
   - `milestone_updates` (status changes, notes)
   - `conversations` (chat history)
   - `documents` (embeddings for search)
3. Set up Supabase Auth (restrict to owner only)
4. Create API routes:
   - `POST /api/chat` - Send messages to AI
   - `GET /api/milestones` - Fetch live data
   - `POST /api/milestones/:id/update` - Log changes
   - `GET /api/verify-change` - Check if code changed

**Deliverable:** Working API with database

---

### Phase 2: AI Integration (Week 1-2)
**Tasks:**
1. Set up OpenAI Assistants API
2. Upload project documentation to Assistant's file store
3. Define custom functions:
   ```javascript
   {
     name: "get_milestone_status",
     description: "Get current status of a specific milestone",
     parameters: { milestone_id: "string" }
   }
   {
     name: "search_codebase",
     description: "Search for code patterns or file contents",
     parameters: { query: "string", file_pattern: "string" }
   }
   {
     name: "verify_implementation",
     description: "Check if a requested change was actually made",
     parameters: { change_description: "string", files_to_check: "array" }
   }
   {
     name: "web_search",
     description: "Search the web for external information",
     parameters: { query: "string" }
   }
   ```
4. Configure system prompt:
   ```
   You are the AI Executive Assistant for Stabilis Diversification.
   You have deep knowledge of:
   - 3 strategic initiatives (Turnaround, Diversification, Wellness)
   - 76 milestones across 5 phases
   - R6.2M revenue targets
   - Project codebase and architecture
   
   Your owner is [Name]. You help them:
   - Answer any question about the project
   - Track if changes were implemented
   - Monitor progress and deadlines
   - Research external information when needed
   - Verify data accuracy
   
   Always be concise, factual, and proactive.
   If you don't know something, say so and offer to research it.
   ```

**Deliverable:** AI that can answer basic questions

---

### Phase 3: Change Detection (Week 2)
**Tasks:**
1. Implement file system monitoring:
   - Watch `web/js/data.js` for milestone changes
   - Watch `web/js/*.js` for code changes
   - Use Node.js `fs.watch()` or `chokidar` library
2. Create change log in database:
   ```sql
   CREATE TABLE change_log (
     id SERIAL PRIMARY KEY,
     timestamp TIMESTAMPTZ DEFAULT NOW(),
     file_path TEXT,
     change_type TEXT, -- 'milestone_update', 'code_change', 'note_added'
     old_value JSONB,
     new_value JSONB,
     verified BOOLEAN DEFAULT FALSE
   );
   ```
3. Build verification endpoint:
   - Compare current file state with change log
   - Use simple diff algorithm
   - Return verification status to AI

**Deliverable:** AI can verify if changes were made

---

### Phase 4: External Research (Week 2-3)
**Tasks:**
1. Integrate web search API (Tavily, Serper, or Brave Search)
2. Add function to AI:
   ```javascript
   async function webSearch(query) {
     const results = await fetch('https://api.tavily.com/search', {
       method: 'POST',
       body: JSON.stringify({ query, max_results: 5 })
     });
     return results.json();
   }
   ```
3. Configure AI to decide when to search externally
4. Cache research results in database

**Deliverable:** AI can research external topics

---

### Phase 5: Frontend Integration (Week 3)
**Tasks:**
1. Update `web/js/ai-copilot.js`:
   - Replace static content with API calls
   - Add chat interface (similar to ChatGPT)
   - Show loading states
   - Display sources/citations
2. Add chat UI component:
   ```html
   <div id="ai-assistant-panel">
     <div id="chat-history"></div>
     <input id="chat-input" placeholder="Ask me anything..." />
     <button onclick="sendMessage()">Send</button>
   </div>
   ```
3. Implement authentication check (owner only)
4. Add keyboard shortcuts (Ctrl+K to open assistant)

**Deliverable:** Fully functional AI assistant in the app

---

## 6. SPECIFIC CAPABILITIES BREAKDOWN

### A. Project Status Queries
**Examples:**
- "What's the overall progress?" → Calculate completed vs. total milestones
- "Show me Phase 2 status" → Filter by phase, show milestone breakdown
- "Which milestones are overdue?" → Compare due dates with current date
- "What's blocking P3-M4?" → Check dependencies, notes, risks

**Implementation:**
- Query Supabase milestones table
- Apply filters and calculations
- Return formatted summary

---

### B. Revenue Analysis
**Examples:**
- "What's our projected revenue for Q1 2026?" → Sum phase revenues
- "Compare optimistic vs. conservative scenarios" → Use copilot calculator data
- "Which service line generates most revenue?" → Break down by programme type

**Implementation:**
- Access static revenue data
- Perform calculations
- Generate visualizations (optional)

---

### C. Code Verification
**Examples:**
- "Did you implement the service worker fix?" → Check `web/service-worker.js`
- "Was the manifest.json updated?" → Verify file contents
- "Show me recent changes to data.js" → Query change log

**Implementation:**
```javascript
async function verifyChange(description, files) {
  const recentChanges = await db
    .from('change_log')
    .select('*')
    .in('file_path', files)
    .gte('timestamp', Date.now() - 86400000) // Last 24h
    .order('timestamp', { ascending: false });
  
  // Use GPT to compare description with actual changes
  const verification = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Verify if the requested change matches the actual changes.' },
      { role: 'user', content: `Requested: ${description}\nActual changes: ${JSON.stringify(recentChanges)}` }
    ]
  });
  
  return verification.choices[0].message.content;
}
```

---

### D. External Research
**Examples:**
- "What are the latest HPCSA regulations?" → Web search + summarize
- "Find best practices for medical aid billing" → Search + extract key points
- "Check if Vercel has new DNS IP ranges" → Fetch Vercel docs

**Implementation:**
```javascript
async function researchTopic(query) {
  const searchResults = await tavilySearch(query);
  const summary = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Summarize these search results concisely.' },
      { role: 'user', content: JSON.stringify(searchResults) }
    ]
  });
  return summary.choices[0].message.content;
}
```

---

### E. Proactive Alerts
**Examples:**
- "P2-M1 is due tomorrow but still marked 'planned'"
- "No activity on Turnaround project for 5 days"
- "Revenue projection falling behind by 15%"

**Implementation:**
- Background job (cron) runs daily
- Checks for risk conditions
- Stores alerts in database
- AI mentions them in next conversation

---

## 7. SECURITY & ACCESS CONTROL

### Owner-Only Access
```javascript
// Middleware for all AI endpoints
async function requireOwner(req, res, next) {
  const user = await supabase.auth.getUser(req.headers.authorization);
  if (user.email !== 'owner@stabilis.co.za') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
```

### Data Privacy
- All conversations stored in Supabase (owner's instance)
- OpenAI API set to `store: false` (no training on data)
- No PII in prompts (use IDs, not names)
- HTTPS only, secure API keys

---

## 8. COST ESTIMATION

### OpenAI Assistants API
- **GPT-4-turbo:** $0.01/1K input tokens, $0.03/1K output
- **Embeddings:** $0.00002/1K tokens (one-time for documents)
- **File Search:** $0.20/GB/day (for assistant's file storage)
- **Estimated monthly cost:** $20-50 (for moderate usage)

### Supabase
- **Free tier:** 500MB database, 2GB bandwidth, 50K auth users
- **Pro:** $25/month (if needed for more storage)

### Web Search API
- **Tavily:** $0.005/search, 1000 free searches/month
- **Estimated monthly cost:** $5-10

**Total: ~$30-85/month**

---

## 9. DEVELOPMENT TIMELINE

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Backend Setup | 3 days | Supabase + API routes |
| AI Integration | 4 days | OpenAI Assistant with functions |
| Change Detection | 3 days | File monitoring + verification |
| External Research | 2 days | Web search integration |
| Frontend UI | 3 days | Chat interface in app |
| Testing & Polish | 2 days | Bug fixes, performance |
| **Total** | **17 days** | **Fully functional AI assistant** |

---

## 10. EXAMPLE INTERACTIONS

### Interaction 1: Status Check
**You:** "What's the status of Phase 2?"

**AI:** "Phase 2 (Pilot Launch) is currently in progress. Here's the breakdown:
- **Completed:** 2/6 milestones (33%)
- **In Progress:** P2-M3 (Adolescent OP Prep) - due in 3 days
- **Blocked:** P2-M5 (Data Tracking Setup) - waiting on billing system access
- **Revenue Generated:** R180,000 / R510,000 target (35%)

Would you like details on any specific milestone?"

---

### Interaction 2: Code Verification
**You:** "Did you update the manifest.json start_url like I asked?"

**AI:** "Let me check... Yes, confirmed! On November 17, 2025 at 14:32, I updated `web/manifest.json`:
- Changed `start_url` from `/` to `/diversification/`
- Also updated `scope` to match

The change is live and was deployed to Vercel. Would you like me to verify the deployed version as well?"

---

### Interaction 3: Research
**You:** "What's the current Vercel A record IP for custom domains?"

**AI:** "Searching Vercel's documentation... According to their latest docs (updated Nov 2025), the current A record IP is:
- **216.198.79.1** (new as of October 2025)
- Previous IP (76.76.21.21) is deprecated

Your domain `stabiliswellness.pro` still points to the old NS1 nameservers. Should I draft the DNS update steps for you?"

---

### Interaction 4: Proactive Alert
**AI:** "Good morning! I noticed 3 items that need attention:
1. **P2-M3** is due today but still in 'planned' status
2. **Turnaround project** has had no milestone updates for 6 days
3. **Risk R-003** (staffing shortage) was flagged yesterday in risks.md

Would you like to address any of these now?"

---

## 11. FUTURE ENHANCEMENTS

### Phase 2 Features (Post-Launch)
1. **Voice Interface:** Integrate speech-to-text for hands-free queries
2. **Mobile App:** Dedicated iOS/Android app with push notifications
3. **Advanced Analytics:** Predictive modeling for revenue, completion rates
4. **Team Insights:** (If expanded) anonymous team sentiment analysis
5. **Integration Hub:** Connect to Google Calendar, Slack, email for unified view
6. **Custom Reports:** AI generates executive summaries, board reports on demand
7. **Version Control Integration:** Monitor GitHub commits, link to milestones
8. **Financial Modeling:** What-if scenarios, sensitivity analysis

---

## 12. NEXT STEPS

### Immediate Actions (This Week)
1. **Decision:** Confirm architecture choice (Hybrid recommended)
2. **Setup:** Create Supabase project, get OpenAI API key
3. **Prototype:** Build minimal chat endpoint + simple AI response
4. **Test:** Verify you can ask a question and get an answer

### Week 2-3
1. Implement full backend
2. Integrate all data sources
3. Add verification functions
4. Deploy to Vercel/Render

### Week 4
1. Build frontend chat UI
2. Connect to backend
3. User testing (you)
4. Iterate based on feedback

---

## 13. QUESTIONS FOR YOU

Before starting implementation, please confirm:

1. **Privacy:** Are you comfortable with project data being sent to OpenAI's API? (They don't train on it, but it leaves your infrastructure)
   - ✅ **YES** - Comfortable with OpenAI API

2. **Scope:** Do you want this accessible ONLY on your devices, or from anywhere?
   - ✅ **DEVICE-ONLY** - Simplified auth, localhost only

3. **Budget:** Is ~$50/month acceptable for OpenAI + Supabase costs?
   - ✅ **YES** - Budget approved

4. **Features Priority:** Rank these by importance:
   - [1] **Proactive alerts** - Highest priority
   - [2] **Revenue analysis** - Second
   - [3] **Change detection** - Third
   - [4] **Code verification** - Fourth
   - [5] **External research** - Fifth

5. **Timeline:** Do you want a working prototype this week, or prefer thorough planning first?
   - ✅ **PLAN FIRST** - Detailed implementation roadmap requested

---

## 14. CONCLUSION

This AI Executive Assistant will transform how you interact with your project. Instead of manually checking files, spreadsheets, and docs, you'll have a conversational interface that understands the entire ecosystem.

**Key Benefits:**
- ✅ Save hours per week on status updates
- ✅ Never miss a deadline or dependency
- ✅ Verify changes instantly
- ✅ Research external info without leaving the app
- ✅ Get proactive insights, not just reactive answers

**Recommendation:** Start with Hybrid Architecture (Supabase + OpenAI Assistants API) for optimal balance of power, control, and development speed.

Ready to proceed? Let me know your answers to the questions above and I'll start building immediately.

---

**Document Version:** 1.0  
**Last Updated:** November 18, 2025  
**Author:** GitHub Copilot (Claude Sonnet 4.5)
