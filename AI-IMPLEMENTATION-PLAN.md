# AI Executive Assistant - Implementation Plan

**Project:** Stabilis Diversification AI Assistant  
**Start Date:** November 18, 2025  
**Target Completion:** December 9, 2025 (3 weeks)  
**Access:** Device-only (localhost)  
**Architecture:** Hybrid (Supabase + OpenAI Assistants API)

---

## CONFIRMED REQUIREMENTS

✅ **Privacy:** OpenAI API acceptable  
✅ **Scope:** Device-only (localhost:3000)  
✅ **Budget:** ~$50/month approved  
✅ **Priority Order:**
1. Proactive alerts
2. Revenue analysis
3. Change detection
4. Code verification
5. External research

---

## SIMPLIFIED ARCHITECTURE (Device-Only)

```
┌─────────────────────────────────────────┐
│   Browser (localhost:3000)              │
│   - Chat UI in existing app             │
│   - No login required (device-local)    │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│   Express Server (server.js)            │
│   + New AI endpoints                    │
│   - POST /api/ai/chat                   │
│   - GET /api/ai/alerts                  │
│   - GET /api/ai/status                  │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼──────────┐  ┌────▼──────────────┐
│  Supabase    │  │ OpenAI Assistants │
│  (Database)  │  │ API + Functions   │
│              │  │                   │
│ - Milestones │  │ - Conversation    │
│ - Changes    │  │ - Doc search      │
│ - Alerts     │  │ - Analysis        │
└──────────────┘  └───────────────────┘
```

**Simplifications for Device-Only:**
- No Supabase Auth (localhost trust model)
- API key stored in `.env` file locally
- All requests from `localhost:3000` trusted
- No session management needed
- Direct file system access for monitoring

---

## IMPLEMENTATION ROADMAP

### WEEK 1: Foundation (Nov 18-24)

#### Day 1-2: Supabase Setup
**Tasks:**
1. Create free Supabase project
2. Design & create tables:
   ```sql
   -- Milestones (synced from data.js)
   CREATE TABLE milestones (
     id TEXT PRIMARY KEY,
     title TEXT NOT NULL,
     phase_id TEXT NOT NULL,
     owner TEXT,
     due_date DATE,
     status TEXT DEFAULT 'planned',
     description TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Milestone updates (history)
   CREATE TABLE milestone_updates (
     id SERIAL PRIMARY KEY,
     milestone_id TEXT REFERENCES milestones(id),
     field_changed TEXT, -- 'status', 'notes', 'owner', etc.
     old_value TEXT,
     new_value TEXT,
     timestamp TIMESTAMPTZ DEFAULT NOW()
   );

   -- Alerts (proactive notifications)
   CREATE TABLE alerts (
     id SERIAL PRIMARY KEY,
     type TEXT NOT NULL, -- 'deadline', 'no_activity', 'risk', 'revenue'
     severity TEXT DEFAULT 'info', -- 'info', 'warning', 'critical'
     milestone_id TEXT,
     message TEXT NOT NULL,
     acknowledged BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- AI conversations (chat history)
   CREATE TABLE conversations (
     id SERIAL PRIMARY KEY,
     user_message TEXT NOT NULL,
     ai_response TEXT NOT NULL,
     tokens_used INTEGER,
     timestamp TIMESTAMPTZ DEFAULT NOW()
   );

   -- Change log (file system changes)
   CREATE TABLE change_log (
     id SERIAL PRIMARY KEY,
     file_path TEXT NOT NULL,
     change_type TEXT, -- 'milestone_data', 'code', 'config'
     diff_summary TEXT,
     timestamp TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. Create initial data sync script:
   ```javascript
   // scripts/sync-milestones.js
   const { createClient } = require('@supabase/supabase-js');
   const projectData = require('../web/js/data.js');
   
   async function syncMilestones() {
     // Extract all milestones from static data
     // Insert into Supabase
     // Report sync status
   }
   ```

**Deliverable:** Database ready, initial data loaded

---

#### Day 3-4: OpenAI Assistant Setup
**Tasks:**
1. Get OpenAI API key (store in `.env`)
2. Install dependencies:
   ```bash
   npm install openai @supabase/supabase-js dotenv chokidar
   ```

3. Create Assistant via OpenAI API:
   ```javascript
   const assistant = await openai.beta.assistants.create({
     name: "Stabilis Executive Assistant",
     instructions: `You are the AI Executive Assistant for Stabilis Diversification project.
     
     Your owner relies on you to:
     - Monitor all 76 milestones across 3 initiatives (Turnaround, Diversification, Wellness)
     - Provide proactive alerts about deadlines, risks, and blockers
     - Analyze revenue projections and financial performance
     - Track changes in project data and code
     - Verify implementations
     - Research external information when needed
     
     Current date: ${new Date().toISOString().split('T')[0]}
     
     Always:
     - Be concise and factual
     - Prioritize alerts and time-sensitive info
     - Show data/evidence for claims
     - Offer actionable next steps
     - Ask clarifying questions when needed
     
     You have access to custom functions to:
     - Query live milestone data
     - Generate alerts
     - Calculate revenue projections
     - Check file changes
     - Search the web`,
     model: "gpt-4-turbo-preview",
     tools: [
       { type: "file_search" },
       { type: "function", function: {
         name: "get_milestones",
         description: "Get current milestone data, optionally filtered by phase, status, or owner",
         parameters: {
           type: "object",
           properties: {
             phase_id: { type: "string", enum: ["P1", "P2", "P3", "P4", "P5", "T1", "T2", "T3", "W1", "W2", "W3", "W4"] },
             status: { type: "string", enum: ["planned", "in_progress", "completed", "blocked"] },
             owner: { type: "string" }
           }
         }
       }},
       { type: "function", function: {
         name: "get_alerts",
         description: "Get active alerts (unacknowledged warnings about deadlines, risks, etc.)",
         parameters: {
           type: "object",
           properties: {
             severity: { type: "string", enum: ["info", "warning", "critical"] }
           }
         }
       }},
       { type: "function", function: {
         name: "calculate_revenue",
         description: "Calculate revenue projections for given time period or scenario",
         parameters: {
           type: "object",
           properties: {
             scenario: { type: "string", enum: ["optimistic", "realistic", "conservative", "minimum"] },
             phase_id: { type: "string" },
             start_date: { type: "string", format: "date" },
             end_date: { type: "string", format: "date" }
           }
         }
       }},
       { type: "function", function: {
         name: "check_recent_changes",
         description: "Check what files or data changed recently",
         parameters: {
           type: "object",
           properties: {
             file_pattern: { type: "string" },
             hours_ago: { type: "number", default: 24 }
           }
         }
       }},
       { type: "function", function: {
         name: "web_search",
         description: "Search the web for external information",
         parameters: {
           type: "object",
           properties: {
             query: { type: "string" }
           },
           required: ["query"]
         }
       }}
     ]
   });
   ```

4. Upload project documentation to Assistant's vector store:
   ```javascript
   // Upload all .md files from /phases, /tracking, /docs
   const vectorStore = await openai.beta.vectorStores.create({
     name: "Stabilis Project Documentation"
   });
   
   const files = [
     'phases/PHASE1-MOBILISATION.md',
     'phases/PHASE2-PILOT.md',
     // ... all docs
   ];
   
   await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, files);
   ```

**Deliverable:** AI Assistant configured and ready

---

#### Day 5: Alert System Implementation
**Tasks:**
1. Create alert generation service:
   ```javascript
   // services/alert-service.js
   class AlertService {
     async generateAlerts() {
       const alerts = [];
       
       // Check 1: Upcoming deadlines
       const dueSoon = await this.checkUpcomingDeadlines();
       alerts.push(...dueSoon);
       
       // Check 2: Overdue milestones
       const overdue = await this.checkOverdueMilestones();
       alerts.push(...overdue);
       
       // Check 3: Inactive projects
       const inactive = await this.checkInactivity();
       alerts.push(...inactive);
       
       // Check 4: Revenue variance
       const revenue = await this.checkRevenueVariance();
       alerts.push(...revenue);
       
       // Check 5: Risk escalations
       const risks = await this.checkRiskFile();
       alerts.push(...risks);
       
       return alerts;
     }
     
     async checkUpcomingDeadlines() {
       const threeDaysFromNow = new Date(Date.now() + 3*24*60*60*1000);
       const milestones = await db
         .from('milestones')
         .select('*')
         .lte('due_date', threeDaysFromNow.toISOString())
         .eq('status', 'planned');
       
       return milestones.map(m => ({
         type: 'deadline',
         severity: 'warning',
         milestone_id: m.id,
         message: `${m.title} (${m.id}) is due in ${daysUntil(m.due_date)} days but still in 'planned' status`
       }));
     }
     
     // ... other check methods
   }
   ```

2. Set up cron job (runs every 6 hours):
   ```javascript
   // services/cron-jobs.js
   const cron = require('node-cron');
   
   // Run alert generation every 6 hours
   cron.schedule('0 */6 * * *', async () => {
     console.log('Running alert generation...');
     const alertService = new AlertService();
     const newAlerts = await alertService.generateAlerts();
     await db.from('alerts').insert(newAlerts);
     console.log(`Generated ${newAlerts.length} new alerts`);
   });
   ```

3. Create `/api/ai/alerts` endpoint:
   ```javascript
   app.get('/api/ai/alerts', async (req, res) => {
     const alerts = await db
       .from('alerts')
       .select('*')
       .eq('acknowledged', false)
       .order('created_at', { ascending: false });
     
     res.json({ alerts, count: alerts.length });
   });
   ```

**Deliverable:** Proactive alert system operational

---

### WEEK 2: Core Features (Nov 25 - Dec 1)

#### Day 6-7: Revenue Analysis Functions
**Tasks:**
1. Implement revenue calculation logic:
   ```javascript
   // services/revenue-service.js
   class RevenueService {
     async calculateProjection(scenario, phaseId, startDate, endDate) {
       // Load phase revenue data
       const phases = this.getAllPhases();
       
       // Apply scenario multiplier
       const multipliers = {
         optimistic: 1.0,
         realistic: 0.85,
         conservative: 0.60,
         minimum: 0.40
       };
       
       // Calculate for date range
       const projection = phases
         .filter(p => phaseId ? p.id === phaseId : true)
         .filter(p => this.inDateRange(p, startDate, endDate))
         .reduce((sum, p) => sum + (p.revenue * multipliers[scenario]), 0);
       
       return {
         scenario,
         amount: projection,
         currency: 'ZAR',
         period: { start: startDate, end: endDate }
       };
     }
     
     async getRevenueByServiceLine() {
       // Break down by Adult OP, Adolescent, Aftercare, etc.
     }
     
     async compareActualVsProjected() {
       // Pull completed milestones
       // Sum actual revenue
       // Compare with projection
     }
   }
   ```

2. Add revenue endpoint:
   ```javascript
   app.get('/api/ai/revenue', async (req, res) => {
     const { scenario, phase, start, end } = req.query;
     const revenueService = new RevenueService();
     const projection = await revenueService.calculateProjection(
       scenario || 'realistic',
       phase,
       start,
       end
     );
     res.json(projection);
   });
   ```

**Deliverable:** Revenue analysis capability

---

#### Day 8-9: Change Detection System
**Tasks:**
1. Implement file watcher:
   ```javascript
   // services/file-watcher.js
   const chokidar = require('chokidar');
   const fs = require('fs').promises;
   const diff = require('diff');
   
   class FileWatcher {
     constructor() {
       this.previousState = new Map();
     }
     
     async start() {
       const watcher = chokidar.watch([
         'web/js/data.js',
         'web/js/turnaround-data.js',
         'web/js/wellness-data.js',
         'web/js/*.js',
         'phases/*.md',
         'tracking/*.md'
       ], {
         persistent: true,
         ignoreInitial: false
       });
       
       watcher.on('change', async (path) => {
         await this.handleChange(path);
       });
     }
     
     async handleChange(filePath) {
       const currentContent = await fs.readFile(filePath, 'utf-8');
       const previousContent = this.previousState.get(filePath);
       
       if (previousContent) {
         const changes = diff.diffLines(previousContent, currentContent);
         const summary = this.summarizeChanges(changes);
         
         await db.from('change_log').insert({
           file_path: filePath,
           change_type: this.detectChangeType(filePath),
           diff_summary: summary
         });
         
         console.log(`Change detected in ${filePath}: ${summary}`);
       }
       
       this.previousState.set(filePath, currentContent);
     }
     
     summarizeChanges(diffResult) {
       const added = diffResult.filter(d => d.added).length;
       const removed = diffResult.filter(d => d.removed).length;
       return `+${added} lines, -${removed} lines`;
     }
   }
   
   const watcher = new FileWatcher();
   watcher.start();
   ```

2. Create change verification endpoint:
   ```javascript
   app.get('/api/ai/changes', async (req, res) => {
     const { file_pattern, hours } = req.query;
     const since = new Date(Date.now() - (hours || 24) * 60 * 60 * 1000);
     
     let query = db
       .from('change_log')
       .select('*')
       .gte('timestamp', since.toISOString())
       .order('timestamp', { ascending: false });
     
     if (file_pattern) {
       query = query.ilike('file_path', `%${file_pattern}%`);
     }
     
     const changes = await query;
     res.json({ changes, count: changes.length });
   });
   ```

**Deliverable:** Change tracking operational

---

#### Day 10-11: Chat Endpoint & Function Handlers
**Tasks:**
1. Implement main chat endpoint:
   ```javascript
   // routes/ai-chat.js
   app.post('/api/ai/chat', async (req, res) => {
     const { message, thread_id } = req.body;
     
     // Create or use existing thread
     const threadId = thread_id || await openai.beta.threads.create().then(t => t.id);
     
     // Add user message
     await openai.beta.threads.messages.create(threadId, {
       role: "user",
       content: message
     });
     
     // Run assistant
     const run = await openai.beta.threads.runs.create(threadId, {
       assistant_id: process.env.ASSISTANT_ID
     });
     
     // Poll for completion & handle function calls
     let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
     
     while (runStatus.status !== 'completed') {
       if (runStatus.status === 'requires_action') {
         // Handle function calls
         const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
         const toolOutputs = await Promise.all(
           toolCalls.map(call => handleFunctionCall(call))
         );
         
         await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
           tool_outputs: toolOutputs
         });
       }
       
       await new Promise(resolve => setTimeout(resolve, 1000));
       runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
     }
     
     // Get assistant response
     const messages = await openai.beta.threads.messages.list(threadId);
     const response = messages.data[0].content[0].text.value;
     
     // Save conversation
     await db.from('conversations').insert({
       user_message: message,
       ai_response: response,
       tokens_used: runStatus.usage.total_tokens
     });
     
     res.json({ response, thread_id: threadId });
   });
   ```

2. Implement function handlers:
   ```javascript
   // services/function-handlers.js
   async function handleFunctionCall(toolCall) {
     const { name, arguments: args } = toolCall.function;
     const params = JSON.parse(args);
     
     let result;
     switch (name) {
       case 'get_milestones':
         result = await getMilestones(params);
         break;
       case 'get_alerts':
         result = await getAlerts(params);
         break;
       case 'calculate_revenue':
         result = await calculateRevenue(params);
         break;
       case 'check_recent_changes':
         result = await checkRecentChanges(params);
         break;
       case 'web_search':
         result = await webSearch(params);
         break;
       default:
         result = { error: 'Unknown function' };
     }
     
     return {
       tool_call_id: toolCall.id,
       output: JSON.stringify(result)
     };
   }
   
   async function getMilestones({ phase_id, status, owner }) {
     let query = db.from('milestones').select('*');
     if (phase_id) query = query.eq('phase_id', phase_id);
     if (status) query = query.eq('status', status);
     if (owner) query = query.eq('owner', owner);
     return await query;
   }
   
   // ... other handlers
   ```

**Deliverable:** AI can answer questions with live data

---

### WEEK 3: Frontend & Polish (Dec 2-9)

#### Day 12-13: Chat UI Implementation
**Tasks:**
1. Create chat interface in `web/js/ai-copilot.js`:
   ```javascript
   // Replace static copilot with chat interface
   function initAIChat() {
     const chatContainer = document.createElement('div');
     chatContainer.id = 'ai-chat-panel';
     chatContainer.className = 'ai-chat-panel';
     chatContainer.innerHTML = `
       <div class="ai-chat-header">
         <span class="ai-icon">🤖</span>
         <h3>AI Executive Assistant</h3>
         <button class="ai-close" onclick="closeAIChat()">✕</button>
       </div>
       <div class="ai-chat-messages" id="chat-messages">
         <div class="ai-message">
           <strong>Assistant:</strong> Hi! I'm your AI assistant. I can help you with:
           <ul>
             <li>Checking milestone status and progress</li>
             <li>Reviewing revenue projections</li>
             <li>Monitoring alerts and deadlines</li>
             <li>Tracking recent changes</li>
             <li>Researching external information</li>
           </ul>
           What would you like to know?
         </div>
       </div>
       <div class="ai-chat-input-area">
         <textarea 
           id="ai-chat-input" 
           placeholder="Ask me anything..."
           rows="2"
         ></textarea>
         <button id="ai-send-btn" onclick="sendAIMessage()">
           Send
         </button>
       </div>
     `;
     
     document.body.appendChild(chatContainer);
     
     // Keyboard shortcut: Ctrl+K
     document.addEventListener('keydown', (e) => {
       if (e.ctrlKey && e.key === 'k') {
         e.preventDefault();
         toggleAIChat();
       }
     });
   }
   
   async function sendAIMessage() {
     const input = document.getElementById('ai-chat-input');
     const message = input.value.trim();
     if (!message) return;
     
     // Add user message to UI
     appendMessage('user', message);
     input.value = '';
     
     // Show loading
     const loadingId = showLoading();
     
     try {
       const response = await fetch('/api/ai/chat', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           message,
           thread_id: window.aiThreadId
         })
       });
       
       const data = await response.json();
       window.aiThreadId = data.thread_id;
       
       removeLoading(loadingId);
       appendMessage('assistant', data.response);
       
     } catch (error) {
       removeLoading(loadingId);
       appendMessage('error', 'Sorry, I encountered an error. Please try again.');
       console.error(error);
     }
   }
   
   function appendMessage(role, content) {
     const messagesDiv = document.getElementById('chat-messages');
     const messageDiv = document.createElement('div');
     messageDiv.className = `ai-message ai-${role}`;
     
     if (role === 'user') {
       messageDiv.innerHTML = `<strong>You:</strong> ${content}`;
     } else if (role === 'assistant') {
       messageDiv.innerHTML = `<strong>Assistant:</strong> ${markdownToHtml(content)}`;
     } else {
       messageDiv.innerHTML = content;
     }
     
     messagesDiv.appendChild(messageDiv);
     messagesDiv.scrollTop = messagesDiv.scrollHeight;
   }
   ```

2. Add CSS styling:
   ```css
   /* web/css/style.css */
   .ai-chat-panel {
     position: fixed;
     right: 20px;
     bottom: 20px;
     width: 400px;
     max-height: 600px;
     background: var(--card-bg);
     border-radius: 12px;
     box-shadow: 0 8px 32px rgba(0,0,0,0.3);
     display: flex;
     flex-direction: column;
     z-index: 1000;
   }
   
   .ai-chat-header {
     padding: 16px;
     border-bottom: 1px solid var(--border-color);
     display: flex;
     align-items: center;
     gap: 12px;
   }
   
   .ai-chat-messages {
     flex: 1;
     overflow-y: auto;
     padding: 16px;
     max-height: 400px;
   }
   
   .ai-message {
     margin-bottom: 12px;
     padding: 12px;
     border-radius: 8px;
     background: var(--hover-bg);
   }
   
   .ai-message.ai-user {
     background: var(--primary-color);
     color: white;
     margin-left: 40px;
   }
   
   .ai-chat-input-area {
     padding: 16px;
     border-top: 1px solid var(--border-color);
     display: flex;
     gap: 8px;
   }
   
   #ai-chat-input {
     flex: 1;
     padding: 8px 12px;
     border: 1px solid var(--border-color);
     border-radius: 6px;
     resize: none;
   }
   ```

**Deliverable:** Working chat UI in app

---

#### Day 14: Code Verification Implementation
**Tasks:**
1. Create verification service:
   ```javascript
   // services/verification-service.js
   class VerificationService {
     async verifyImplementation(description, filesToCheck) {
       // Get recent changes
       const changes = await db
         .from('change_log')
         .select('*')
         .in('file_path', filesToCheck)
         .gte('timestamp', new Date(Date.now() - 7*24*60*60*1000))
         .order('timestamp', { ascending: false });
       
       if (changes.length === 0) {
         return {
           verified: false,
           message: `No recent changes found in ${filesToCheck.join(', ')}`
         };
       }
       
       // Use GPT to compare
       const verification = await openai.chat.completions.create({
         model: 'gpt-4-turbo-preview',
         messages: [
           {
             role: 'system',
             content: 'You are verifying if a requested code change was implemented. Compare the description with actual changes and determine if they match.'
           },
           {
             role: 'user',
             content: `Requested change: ${description}\n\nActual changes:\n${JSON.stringify(changes, null, 2)}\n\nDid the implementation match the request? Respond with YES or NO, then explain.`
           }
         ]
       });
       
       const response = verification.choices[0].message.content;
       const verified = response.toLowerCase().startsWith('yes');
       
       return {
         verified,
         message: response,
         changes_found: changes.length
       };
     }
   }
   ```

2. Add to function handlers:
   ```javascript
   case 'verify_implementation':
     const verifier = new VerificationService();
     result = await verifier.verifyImplementation(
       params.change_description,
       params.files_to_check
     );
     break;
   ```

**Deliverable:** Code verification capability

---

#### Day 15: External Research Integration
**Tasks:**
1. Set up web search (using Tavily or Brave):
   ```javascript
   // services/web-search.js
   const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
   
   async function webSearch(query) {
     const response = await fetch('https://api.tavily.com/search', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         api_key: TAVILY_API_KEY,
         query,
         max_results: 5,
         search_depth: 'advanced'
       })
     });
     
     const data = await response.json();
     
     // Format results
     return {
       query,
       results: data.results.map(r => ({
         title: r.title,
         url: r.url,
         content: r.content.substring(0, 500)
       }))
     };
   }
   ```

2. Add to function handlers:
   ```javascript
   case 'web_search':
     result = await webSearch(params.query);
     break;
   ```

**Deliverable:** Web research capability

---

#### Day 16-17: Testing & Refinement
**Tasks:**
1. Test all features end-to-end:
   - Ask about milestone status
   - Request revenue analysis
   - Check for alerts
   - Verify a code change
   - Search external info

2. Performance optimization:
   - Cache frequently accessed data
   - Optimize database queries
   - Reduce API calls where possible

3. Error handling:
   - Network failures
   - API rate limits
   - Invalid queries

4. Documentation:
   - Update README with AI features
   - Add keyboard shortcuts guide
   - Document function capabilities

**Deliverable:** Production-ready AI assistant

---

## DEPLOYMENT CHECKLIST

### Environment Setup
```bash
# .env file (DO NOT COMMIT)
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://....supabase.co
SUPABASE_ANON_KEY=eyJ...
ASSISTANT_ID=asst_...
TAVILY_API_KEY=tvly-... (optional)
```

### Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "openai": "^4.20.0",
    "@supabase/supabase-js": "^2.38.0",
    "dotenv": "^16.3.1",
    "chokidar": "^3.5.3",
    "node-cron": "^3.0.3",
    "diff": "^5.1.0"
  }
}
```

### Startup Sequence
```javascript
// server.js additions
require('dotenv').config();
require('./services/file-watcher').start();
require('./services/cron-jobs'); // Auto-starts
require('./routes/ai-chat')(app);
```

---

## USAGE EXAMPLES

### Example 1: Morning Check-in
**You open the app, AI greets you:**

> "Good morning! Here's your daily briefing:
> 
> **Alerts (3):**
> 1. 🔴 P2-M3 (Adolescent OP Prep) is due today but still in 'planned' status
> 2. 🟡 Turnaround project has had no updates for 6 days
> 3. 🟡 Revenue is 12% behind realistic projection for Q4 2025
> 
> Would you like details on any of these?"

---

### Example 2: Status Check
**You:** "What's the status of Phase 2?"

**AI:** "Phase 2 (Pilot Launch) breakdown:
- **Progress:** 2/6 milestones completed (33%)
- **On Track:** P2-M1, P2-M2 ✅
- **Due Soon:** P2-M3 (today), P2-M4 (in 2 days)
- **Blocked:** P2-M5 waiting on billing system access
- **Revenue:** R180,000 / R510,000 target (35%)

The phase is slightly behind schedule. P2-M3 needs immediate attention."

---

### Example 3: Revenue Analysis
**You:** "Compare revenue scenarios for Q1 2026"

**AI:** "Q1 2026 (Jan-Mar) revenue projections:

| Scenario | Amount | Notes |
|----------|--------|-------|
| Optimistic | R1,240,000 | 100% target achievement |
| Realistic | R1,054,000 | 85% target (recommended planning basis) |
| Conservative | R744,000 | 60% target (worst case with delays) |
| Minimum | R496,000 | 40% break-even threshold |

Based on current progress (33% of Phase 2 complete), we're tracking toward the **conservative** scenario. To reach realistic, we need to complete P2-M3 and P2-M4 on time."

---

### Example 4: Change Verification
**You:** "Did you update the service worker yesterday?"

**AI:** "Checking... Yes, confirmed! On November 17, 2025 at 14:23, `web/service-worker.js` was modified:
- Added caching for `/diversification/index.html`
- Updated asset list to include new icons
- Changed cache version to `v2`

Total changes: +12 lines, -3 lines. The service worker is now functional for PWA offline mode."

---

### Example 5: External Research
**You:** "What's the latest HPCSA regulation on telehealth?"

**AI:** "Searching... According to recent HPCSA guidelines (updated September 2025):

**Key Points:**
1. Telehealth consultations now fully recognized for psychology/psychiatry
2. Practitioners must obtain written informed consent before first session
3. Platform must be POPIA-compliant with end-to-end encryption
4. Physical consultations required at least every 6 months for ongoing therapy
5. Documentation standards same as in-person sessions

**Source:** HPCSA Guidelines on Telemedicine Practice (2025)

Would you like the full document URL or specific compliance steps?"

---

## SUCCESS METRICS

### Week 1
- ✅ Database operational with live data
- ✅ OpenAI Assistant responding to basic queries
- ✅ Alert system generating notifications

### Week 2
- ✅ Revenue calculations accurate
- ✅ File watcher detecting changes
- ✅ Chat endpoint functional

### Week 3
- ✅ UI polished and intuitive
- ✅ All 5 priority features working
- ✅ Response time < 3 seconds for most queries
- ✅ Zero data loss or corruption

---

## MAINTENANCE PLAN

### Daily
- Check alert system logs
- Review AI conversation quality

### Weekly
- Sync static data.js changes to database
- Review token usage costs
- Update documentation if needed

### Monthly
- Upload new project documents to vector store
- Optimize database (vacuum, reindex)
- Review and acknowledge old alerts

---

## COST BREAKDOWN (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| OpenAI API | $20-40 | ~50 queries/day, avg 2K tokens each |
| Supabase | $0 | Free tier sufficient for single user |
| Tavily Search | $0-5 | 1000 free searches, then $0.005/search |
| **Total** | **$20-45** | Well within $50 budget |

---

## RISK MITIGATION

### Risk 1: OpenAI API Downtime
**Mitigation:** 
- Cache common responses
- Graceful degradation (show static help if API fails)
- Retry logic with exponential backoff

### Risk 2: Data Sync Issues
**Mitigation:**
- Automated daily sync from data.js to Supabase
- Manual sync button in UI
- Change log provides audit trail

### Risk 3: Cost Overrun
**Mitigation:**
- Set OpenAI usage limits ($50/month hard cap)
- Monitor token usage per query
- Alert if approaching limit

---

## NEXT STEPS (Week 1 Kickoff)

### Immediate Actions (Today)
1. Create Supabase account and project
2. Get OpenAI API key
3. Install dependencies: `npm install openai @supabase/supabase-js dotenv chokidar node-cron diff`
4. Create `.env` file with keys

### Tomorrow (Day 2)
1. Run database schema setup script
2. Sync initial milestone data
3. Create OpenAI Assistant

### Day 3-5
1. Build alert system
2. Test first chat interaction
3. Deploy locally and verify

---

**Ready to start? Confirm and I'll begin with Day 1 tasks immediately.**

---

**Document Version:** 1.0  
**Created:** November 18, 2025  
**Author:** GitHub Copilot (Claude Sonnet 4.5)  
**Status:** APPROVED - Ready for Implementation
