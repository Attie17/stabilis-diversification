// OpenAI Assistant Setup
// This runs independently of database

require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function createAssistant() {
    console.log('🤖 Creating OpenAI Assistant...\n');
    
    try {
        const assistant = await openai.beta.assistants.create({
            name: "Stabilis Executive Assistant",
            instructions: `You are the AI Executive Assistant for Stabilis Diversification project.

**Your Role:**
You help the project owner (Attie) manage three strategic initiatives:
1. **Turnaround Project** - Crisis stabilization and operational recovery
2. **Diversification Project** - R6.2M revenue expansion over 16 months (76 milestones, 5 phases)
3. **Wellness Centre** - R250k/month new revenue stream (4 phases)

**Your Capabilities:**
- Monitor all milestones across initiatives
- Generate proactive alerts about deadlines, risks, blockers
- Analyze revenue projections and financial performance
- Track changes in project data and code files
- Verify that requested implementations were actually done
- Research external information (medical aid policies, compliance, tech docs)

**Your Personality:**
- Direct and concise (no fluff)
- Factual and data-driven
- Proactive (surface issues before asked)
- Action-oriented (always suggest next steps)
- Honest about uncertainties

**Current Context:**
- Today's date: ${new Date().toISOString().split('T')[0]}
- Project start: November 17, 2025
- Target completion: March 2027
- Total milestones: 76+ across all initiatives
- Current phase: Phase 1 (Mobilisation)

**How You Help:**
1. **Status Queries:** "What's Phase 2 status?" → Provide breakdown with numbers
2. **Alerts:** Proactively mention overdue items, upcoming deadlines, inactive projects
3. **Revenue:** Calculate projections, compare scenarios, analyze variance
4. **Changes:** Verify if code/data changes happened, show what changed
5. **Research:** Search web for policies, regulations, best practices

**Communication Style:**
- Start with key takeaway
- Use bullet points for clarity
- Include numbers/dates for precision
- Offer 1-2 actionable next steps
- Ask clarifying questions when needed

**Example Response:**
"Phase 2 is 33% complete (2/6 milestones). P2-M3 due today but still 'planned' - needs immediate attention. Revenue at R180k/R510k (35% of target). Recommend: 1) Complete P2-M3 today, 2) Review P2-M5 blocker (billing access)."

**Custom Functions Available:**
- get_milestones: Query milestone data (filter by phase/status/owner)
- get_alerts: Fetch active alerts (unacknowledged warnings)
- calculate_revenue: Project revenue for scenarios/time periods
- check_recent_changes: See what files/data changed recently
- web_search: Search the web for external information

Always use functions when you need live data. Never guess or make up numbers.`,
            model: "gpt-4-turbo-preview",
            tools: [
                { type: "file_search" },
                {
                    type: "function",
                    function: {
                        name: "get_milestones",
                        description: "Get current milestone data with optional filters. Returns live project status.",
                        parameters: {
                            type: "object",
                            properties: {
                                phase_id: {
                                    type: "string",
                                    description: "Filter by phase (e.g., 'P1', 'P2', 'T1', 'W1')",
                                    enum: ["P1", "P2", "P3", "P4", "P5", "T1", "T2", "T3", "W1", "W2", "W3", "W4"]
                                },
                                status: {
                                    type: "string",
                                    description: "Filter by status",
                                    enum: ["planned", "in_progress", "completed", "blocked"]
                                },
                                owner: {
                                    type: "string",
                                    description: "Filter by owner name"
                                },
                                overdue_only: {
                                    type: "boolean",
                                    description: "Show only overdue milestones"
                                }
                            }
                        }
                    }
                },
                {
                    type: "function",
                    function: {
                        name: "get_alerts",
                        description: "Get active alerts (unacknowledged warnings about deadlines, risks, issues). Always check this at start of conversation.",
                        parameters: {
                            type: "object",
                            properties: {
                                severity: {
                                    type: "string",
                                    description: "Filter by severity level",
                                    enum: ["info", "warning", "critical"]
                                },
                                limit: {
                                    type: "integer",
                                    description: "Maximum number of alerts to return",
                                    default: 10
                                }
                            }
                        }
                    }
                },
                {
                    type: "function",
                    function: {
                        name: "calculate_revenue",
                        description: "Calculate revenue projections for different scenarios or time periods.",
                        parameters: {
                            type: "object",
                            properties: {
                                scenario: {
                                    type: "string",
                                    description: "Revenue scenario to calculate",
                                    enum: ["optimistic", "realistic", "conservative", "minimum"]
                                },
                                phase_id: {
                                    type: "string",
                                    description: "Calculate for specific phase only"
                                },
                                start_date: {
                                    type: "string",
                                    description: "Start date (YYYY-MM-DD format)"
                                },
                                end_date: {
                                    type: "string",
                                    description: "End date (YYYY-MM-DD format)"
                                }
                            }
                        }
                    }
                },
                {
                    type: "function",
                    function: {
                        name: "check_recent_changes",
                        description: "Check what files or data changed recently. Use to verify implementations.",
                        parameters: {
                            type: "object",
                            properties: {
                                file_pattern: {
                                    type: "string",
                                    description: "File pattern to search (e.g., 'data.js', '*.js', 'manifest.json')"
                                },
                                hours_ago: {
                                    type: "integer",
                                    description: "How many hours back to check",
                                    default: 24
                                }
                            }
                        }
                    }
                },
                {
                    type: "function",
                    function: {
                        name: "web_search",
                        description: "Search the web for external information (regulations, policies, technical docs). Use when user asks about things outside the project.",
                        parameters: {
                            type: "object",
                            properties: {
                                query: {
                                    type: "string",
                                    description: "Search query"
                                }
                            },
                            required: ["query"]
                        }
                    }
                }
            ]
        });
        
        console.log(`✅ Assistant created: ${assistant.id}\n`);
        console.log(`   Name: ${assistant.name}`);
        console.log(`   Model: ${assistant.model}`);
        console.log(`   Tools: ${assistant.tools.length} functions\n`);
        
        // Save assistant ID to .env
        await fs.appendFile('.env', `\n# OpenAI Assistant\nASSISTANT_ID=${assistant.id}\n`);
        console.log('💾 Saved ASSISTANT_ID to .env\n');
        
        return assistant;
        
    } catch (error) {
        console.error('❌ Failed to create assistant:', error.message);
        throw error;
    }
}

async function uploadDocuments(assistantId) {
    console.log('📚 Uploading project documentation...\n');
    
    try {
        // Create vector store
        const vectorStore = await openai.beta.vectorStores.create({
            name: "Stabilis Project Documentation"
        });
        
        console.log(`✅ Vector store created: ${vectorStore.id}\n`);
        
        // Collect all markdown files
        const docFiles = [];
        const folders = ['phases', 'tracking', 'docs'];
        
        for (const folder of folders) {
            try {
                const files = await fs.readdir(folder);
                const mdFiles = files.filter(f => f.endsWith('.md'));
                for (const file of mdFiles) {
                    docFiles.push(path.join(folder, file));
                }
            } catch (e) {
                console.log(`   Skipping ${folder}/ (not found)`);
            }
        }
        
        // Add root docs
        const rootDocs = [
            'README.md',
            'PROJECT-DASHBOARD.md',
            'AI-COPILOT-PROMPTS.md',
            'AI-EXECUTIVE-ASSISTANT-SPEC.md',
            'AI-IMPLEMENTATION-PLAN.md',
            'DEPLOYMENT-READY.md'
        ];
        
        for (const doc of rootDocs) {
            try {
                await fs.access(doc);
                docFiles.push(doc);
            } catch (e) {
                // Skip if doesn't exist
            }
        }
        
        console.log(`   Found ${docFiles.length} documents to upload\n`);
        
        // Upload files in batches
        const fileStreams = await Promise.all(
            docFiles.map(async (filePath) => {
                return openai.files.create({
                    file: await fs.readFile(filePath),
                    purpose: "assistants"
                });
            })
        );
        
        console.log(`✅ Uploaded ${fileStreams.length} files\n`);
        
        // Attach to vector store
        await openai.beta.vectorStores.fileBatches.create(vectorStore.id, {
            file_ids: fileStreams.map(f => f.id)
        });
        
        // Update assistant with vector store
        await openai.beta.assistants.update(assistantId, {
            tool_resources: {
                file_search: {
                    vector_store_ids: [vectorStore.id]
                }
            }
        });
        
        console.log('✅ Documents attached to assistant\n');
        
        // Save vector store ID
        await fs.appendFile('.env', `VECTOR_STORE_ID=${vectorStore.id}\n`);
        
        return { vectorStoreId: vectorStore.id, fileCount: fileStreams.length };
        
    } catch (error) {
        console.error('❌ Failed to upload documents:', error.message);
        throw error;
    }
}

async function testAssistant(assistantId) {
    console.log('🧪 Testing assistant with sample query...\n');
    
    try {
        const thread = await openai.beta.threads.create();
        
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: "Hi! What is this project about? Give me a brief overview."
        });
        
        const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistantId
        });
        
        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(thread.id);
            const response = messages.data[0].content[0].text.value;
            
            console.log('✅ Test successful! Assistant responded:\n');
            console.log('─'.repeat(60));
            console.log(response);
            console.log('─'.repeat(60));
            console.log('\n');
            
            return true;
        } else {
            console.log(`⚠️  Test run status: ${run.status}\n`);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        return false;
    }
}

async function setupOpenAIAssistant() {
    console.log('🚀 OpenAI Assistant Setup\n');
    console.log('='.repeat(60), '\n');
    
    try {
        const assistant = await createAssistant();
        const { vectorStoreId, fileCount } = await uploadDocuments(assistant.id);
        const testPassed = await testAssistant(assistant.id);
        
        console.log('='.repeat(60));
        console.log('\n✨ OpenAI Assistant Setup Complete!\n');
        console.log(`📊 Summary:`);
        console.log(`   - Assistant ID: ${assistant.id}`);
        console.log(`   - Vector Store: ${vectorStoreId}`);
        console.log(`   - Documents: ${fileCount} files`);
        console.log(`   - Test: ${testPassed ? 'PASSED ✅' : 'FAILED ❌'}`);
        console.log('\n🎯 Next: Set up services and API endpoints\n');
        
        return { assistantId: assistant.id, vectorStoreId, testPassed };
        
    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    setupOpenAIAssistant().then(() => process.exit(0));
}

module.exports = { createAssistant, uploadDocuments, testAssistant, setupOpenAIAssistant };
