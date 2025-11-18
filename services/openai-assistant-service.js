// OpenAI Assistant Service - Core AI Integration
// Creates and manages OpenAI Assistant with custom functions

require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

class OpenAIAssistantService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.assistantId = null;
        this.threadId = null;
    }

    // Create or retrieve assistant
    async initialize() {
        console.log('🤖 Initializing OpenAI Assistant...\n');

        try {
            // Check if assistant already exists (stored in local config)
            const configPath = path.join(__dirname, '../config/assistant-config.json');
            let existingAssistant = null;

            try {
                const config = await fs.readFile(configPath, 'utf-8');
                const data = JSON.parse(config);
                existingAssistant = data.assistant_id;
            } catch (error) {
                // No existing assistant
            }

            if (existingAssistant) {
                // Verify it exists
                try {
                    const assistant = await this.openai.beta.assistants.retrieve(existingAssistant);
                    this.assistantId = assistant.id;
                    console.log(`✅ Retrieved existing assistant: ${assistant.name} (${assistant.id})`);
                    return assistant;
                } catch (error) {
                    console.log('⚠️  Stored assistant not found, creating new one...');
                }
            }

            // Create new assistant
            const assistant = await this.openai.beta.assistants.create({
                name: "Diversification Executive Assistant",
                instructions: `You are an expert project management and financial analysis assistant for Stabilisation Diversification projects.

Your capabilities:
1. **Proactive Alerts**: Monitor milestones, deadlines, revenue variance, risks, and project inactivity
2. **Revenue Analysis**: Calculate projections across 4 scenarios (optimistic, realistic, conservative, minimum)
3. **Change Detection**: Track file changes, milestone updates, and data modifications
4. **Code Verification**: Analyze code structure, detect issues, suggest improvements
5. **External Research**: Search web for relevant business intelligence, competitor analysis, industry trends

Your data sources:
- Diversification project (phases, milestones, revenue targets)
- Turnaround programmes (corporate restructuring services)
- Wellness initiatives (wellbeing programmes)
- Risk tracking, budget analysis, resource utilization

Always provide:
- Data-driven insights with specific numbers
- Actionable recommendations
- Clear explanations of variances
- Proactive warnings for risks
- Context-aware responses based on project phase and timeline

When asked about project status, revenue, or risks, use the custom functions to fetch real-time data.`,
                model: "gpt-4-turbo-preview",
                tools: [
                    { type: "code_interpreter" },
                    { type: "file_search" },
                    {
                        type: "function",
                        function: {
                            name: "get_active_alerts",
                            description: "Get current active alerts (deadlines, overdue tasks, revenue variance, risks, inactivity)",
                            parameters: {
                                type: "object",
                                properties: {
                                    severity: {
                                        type: "string",
                                        enum: ["critical", "warning", "info"],
                                        description: "Filter by severity level (optional)"
                                    }
                                }
                            }
                        }
                    },
                    {
                        type: "function",
                        function: {
                            name: "get_revenue_projection",
                            description: "Get comprehensive revenue projection across all scenarios and service lines",
                            parameters: {
                                type: "object",
                                properties: {
                                    scenario: {
                                        type: "string",
                                        enum: ["optimistic", "realistic", "conservative", "minimum", "all"],
                                        description: "Which scenario to return (default: all)"
                                    }
                                }
                            }
                        }
                    },
                    {
                        type: "function",
                        function: {
                            name: "get_milestone_status",
                            description: "Get detailed status of milestones, including completion rates and phase progress",
                            parameters: {
                                type: "object",
                                properties: {
                                    phase_id: {
                                        type: "string",
                                        description: "Filter by specific phase (optional)"
                                    },
                                    status: {
                                        type: "string",
                                        enum: ["not_started", "in_progress", "completed", "blocked"],
                                        description: "Filter by status (optional)"
                                    }
                                }
                            }
                        }
                    },
                    {
                        type: "function",
                        function: {
                            name: "get_recent_changes",
                            description: "Get recent file changes, modifications, and milestone updates",
                            parameters: {
                                type: "object",
                                properties: {
                                    limit: {
                                        type: "number",
                                        description: "Number of recent changes to return (default: 20)"
                                    },
                                    file_path: {
                                        type: "string",
                                        description: "Filter by specific file path (optional)"
                                    }
                                }
                            }
                        }
                    },
                    {
                        type: "function",
                        function: {
                            name: "search_web",
                            description: "Search the web for external information, competitor analysis, industry trends, or business intelligence",
                            parameters: {
                                type: "object",
                                properties: {
                                    query: {
                                        type: "string",
                                        description: "Search query"
                                    },
                                    max_results: {
                                        type: "number",
                                        description: "Maximum number of results (default: 5)"
                                    }
                                },
                                required: ["query"]
                            }
                        }
                    }
                ]
            });

            this.assistantId = assistant.id;

            // Save to config
            await fs.mkdir(path.dirname(configPath), { recursive: true });
            await fs.writeFile(configPath, JSON.stringify({
                assistant_id: assistant.id,
                created_at: new Date().toISOString()
            }, null, 2));

            console.log(`✅ Created new assistant: ${assistant.name} (${assistant.id})\n`);
            return assistant;
        } catch (error) {
            console.error('❌ Error initializing assistant:', error.message);
            throw error;
        }
    }

    // Create conversation thread
    async createThread() {
        try {
            const thread = await this.openai.beta.threads.create();
            this.threadId = thread.id;
            console.log(`✅ Created thread: ${thread.id}`);
            return thread;
        } catch (error) {
            console.error('❌ Error creating thread:', error.message);
            throw error;
        }
    }

    // Send message and get response
    async chat(message, threadId = null) {
        try {
            // Use existing thread or create new one
            if (!threadId && !this.threadId) {
                await this.createThread();
            }
            const activeThreadId = threadId || this.threadId;

            console.log(`   📝 Thread ID: ${activeThreadId}`);
            console.log(`   📝 Assistant ID: ${this.assistantId}`);

            // Add user message
            await this.openai.beta.threads.messages.create(activeThreadId, {
                role: "user",
                content: message
            });

            // Run assistant
            const run = await this.openai.beta.threads.runs.create(activeThreadId, {
                assistant_id: this.assistantId
            });

            console.log(`   📝 Run ID: ${run.id}`);
            console.log(`   📝 Run status: ${run.status}`);

            // Poll for completion
            let runStatus = await this.openai.beta.threads.runs.retrieve(run.id, { thread_id: activeThreadId });

            while (runStatus.status !== 'completed' && runStatus.status !== 'failed' && runStatus.status !== 'requires_action') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                runStatus = await this.openai.beta.threads.runs.retrieve(run.id, { thread_id: activeThreadId });
            }

            // Handle function calls
            if (runStatus.status === 'requires_action') {
                const toolOutputs = await this.handleFunctionCalls(runStatus.required_action.submit_tool_outputs.tool_calls);

                // Submit function outputs
                await this.openai.beta.threads.runs.submitToolOutputs(run.id, {
                    thread_id: activeThreadId,
                    tool_outputs: toolOutputs
                });

                // Wait for completion
                runStatus = await this.openai.beta.threads.runs.retrieve(run.id, { thread_id: activeThreadId });
                while (runStatus.status !== 'completed' && runStatus.status !== 'failed') {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    runStatus = await this.openai.beta.threads.runs.retrieve(run.id, { thread_id: activeThreadId });
                }
            }

            if (runStatus.status === 'failed') {
                throw new Error('Assistant run failed: ' + runStatus.last_error?.message);
            }

            // Get messages
            const messages = await this.openai.beta.threads.messages.list(activeThreadId);
            const lastMessage = messages.data[0];

            return {
                response: lastMessage.content[0].text.value,
                thread_id: activeThreadId,
                run_id: run.id
            };
        } catch (error) {
            console.error('❌ Error in chat:', error.message);
            throw error;
        }
    }

    // Handle function calls from assistant
    async handleFunctionCalls(toolCalls) {
        const AlertService = require('./alert-service');
        const RevenueService = require('./revenue-service');
        const ChangeDetectionService = require('./change-detection-service');

        const alertService = new AlertService();
        const revenueService = new RevenueService();
        const changeService = new ChangeDetectionService();

        const outputs = [];

        for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);

            console.log(`   🔧 Function call: ${functionName}`, args);

            let result;

            try {
                switch (functionName) {
                    case 'get_active_alerts':
                        const alertData = await alertService.generateAlerts();
                        result = {
                            alerts: args.severity
                                ? alertData.alerts.filter(a => a.severity === args.severity)
                                : alertData.alerts,
                            summary: alertData.summary
                        };
                        break;

                    case 'get_revenue_projection':
                        const projection = await revenueService.getProjection();
                        result = args.scenario && args.scenario !== 'all'
                            ? { scenario: args.scenario, data: projection.scenarios[args.scenario] }
                            : projection;
                        break;

                    case 'get_milestone_status':
                        await alertService.loadMilestones();
                        let milestones = alertService.milestones;
                        if (args.phase_id) milestones = milestones.filter(m => m.phase_id === args.phase_id);
                        if (args.status) milestones = milestones.filter(m => m.status === args.status);
                        result = { milestones, total: milestones.length };
                        break;

                    case 'get_recent_changes':
                        result = await changeService.getRecentChanges(args.limit || 20);
                        if (args.file_path) {
                            result = result.filter(c => c.file_path === args.file_path);
                        }
                        break;

                    case 'search_web':
                        // Implement Tavily search if needed
                        result = { message: 'Web search not yet implemented' };
                        break;

                    default:
                        result = { error: 'Unknown function' };
                }

                outputs.push({
                    tool_call_id: toolCall.id,
                    output: JSON.stringify(result)
                });
            } catch (error) {
                outputs.push({
                    tool_call_id: toolCall.id,
                    output: JSON.stringify({ error: error.message })
                });
            }
        }

        return outputs;
    }

    // Delete assistant (cleanup)
    async delete() {
        if (this.assistantId) {
            await this.openai.beta.assistants.del(this.assistantId);
            console.log(`🗑️  Deleted assistant: ${this.assistantId}`);
        }
    }
}

// Test if run directly
if (require.main === module) {
    (async () => {
        const assistant = new OpenAIAssistantService();
        await assistant.initialize();

        // Test conversation
        console.log('\n💬 Testing conversation...\n');
        const response = await assistant.chat('What are the current active alerts? Give me a summary.');
        console.log('\n🤖 Assistant:', response.response);
    })();
}

module.exports = OpenAIAssistantService;
