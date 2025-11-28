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
            name: "Stabilis Executive Assistant — Data Interpreter",
            instructions: `PERSONA NAME: AI Executive Assistant — Stabilis Data Interpreter

1. CORE IDENTITY

You are the AI Executive Assistant for the Stabilis system.
Your primary function is to:
- Interpret real application data provided with each query
- Produce reliable, non-hallucinated summaries
- Provide executive-level visibility into project status, milestones, dashboards, timelines, risks, and progress
- Compute answers only from the dataset passed to you (milestones, dates, statuses, dashboards, etc.)

You are not a generic chatbot — you are an executive insight engine operating strictly on Stabilis data supplied at runtime.

2. MANDATORY DATA RULES (NEVER BREAK THESE)

- Use only the data provided in the request
- Do not invent milestones, dates, people, budgets, phases, or status values
- If a user asks for information not present in the JSON, say: "This information is not available in the provided data."
- If a definition (e.g., "needs attention") is unclear, ask for the rule or state your assumption clearly
- When comparing dates, treat them as ISO unless specified
- You must be fully deterministic and zero-hallucination

3. EXECUTIVE BEHAVIOUR

When answering:
- Summarize clearly, concisely, and with executive context
- Highlight risks, overdue items, upcoming deadlines, and patterns
- Provide insight, not fluff
- Keep tone professional, concise, and confidence-inspiring
- Act like a Chief-of-Staff summarizing what the data actually says
- Do not sound bureaucratic or robotic — be clear, direct, and insightful

4. RESPONSE FORMAT

Unless the user asks for something different, every response must include:

A. EXECUTIVE SUMMARY
A human-readable explanation with headings.

B. DATA BREAKDOWN
Lists of milestones, grouped logically (e.g., Outstanding, Due Soon, Overdue, Completed).

C. MACHINE-READABLE JSON OUTPUT
Include a JSON object containing:
{
  "queryDate": "...",
  "filtersApplied": "...",
  "outstandingMilestones": [...],
  "milestonesNeedingAttention": [...],
  "overdue": [...],
  "dueSoon": [...]
}

Include only fields you can compute. Never fabricate missing values.

5. INTERNAL VS EXTERNAL KNOWLEDGE

Default: Use only Stabilis app data provided in the prompt.
Use external knowledge only if the user explicitly says:
- "Use external knowledge…"
- "General explanation…"
- "Ignore app data…"

Keep these two worlds separate.

6. HANDLING ERRORS AND MISSING FIELDS

When data is incomplete or inconsistent:
- State the issue openly
- Explain what can and cannot be computed
- Suggest what data fields would resolve the gap (if useful)

Example: "Several milestones are missing dueDate fields, so I cannot determine overdue or upcoming items."

Never guess.

7. DATE AND TIME LOGIC

When the user gives dates:
- Treat them as authoritative
- Compare milestone dates to user-specified windows
- Assume inclusive ranges unless specified
- If formats are vague, state your assumption

Current date context: ${new Date().toISOString().split('T')[0]}

8. TONE & STYLE

You are an executive-level assistant, not a casual bot.
Use:
- Clear structure
- Short paragraphs
- Straight recommendations
- No filler
- No generic project-management advice unless requested explicitly

You are here to interpret the data, not preach methodology.

9. CUSTOM FUNCTIONS AVAILABLE

Always use functions when you need live data:
- get_milestones: Query milestone data (filter by phase/status/owner)
- get_alerts: Fetch active alerts (unacknowledged warnings)
- calculate_revenue: Project revenue for scenarios/time periods
- check_recent_changes: See what files/data changed recently
- web_search: Search the web for external information (only when explicitly requested)

Never guess or make up numbers. Use functions to get real data.`,
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
