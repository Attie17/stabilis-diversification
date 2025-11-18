// Code Verification Service - GPT-Powered Code Review
// Priority #4: Verify changes match requests, detect issues, suggest improvements

require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');
const { diffLines } = require('diff');

class CodeVerificationService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    // Verify code change matches request
    async verifyChange(changeDescription, filePath, oldCode, newCode) {
        console.log(`🔍 Verifying change: ${filePath}`);

        try {
            // Calculate diff
            const diff = diffLines(oldCode || '', newCode || '');
            const additions = diff.filter(d => d.added).map(d => d.value).join('\n');
            const deletions = diff.filter(d => d.removed).map(d => d.value).join('\n');

            // Use GPT to verify
            const prompt = `You are a code reviewer. Verify if the code changes match the requested change.

**Request:** ${changeDescription}

**File:** ${filePath}

**Added Lines:**
\`\`\`
${additions || '(none)'}
\`\`\`

**Removed Lines:**
\`\`\`
${deletions || '(none)'}
\`\`\`

**Analysis Required:**
1. Does the change match the request?
2. Are there any obvious bugs or issues?
3. Are there any security concerns?
4. Could this break existing functionality?
5. Are there better approaches?

Respond in JSON format:
{
    "matches_request": true/false,
    "confidence": 0-100,
    "issues": ["issue1", "issue2"],
    "security_concerns": ["concern1"],
    "breaking_changes": ["change1"],
    "suggestions": ["suggestion1"],
    "overall_assessment": "brief summary"
}`;

            const response = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert code reviewer specializing in JavaScript, Node.js, and web development. You provide thorough, actionable feedback.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.3
            });

            const analysis = JSON.parse(response.choices[0].message.content);

            console.log(`   ✅ Verification complete (${analysis.confidence}% confidence)`);

            return {
                file_path: filePath,
                request: changeDescription,
                analysis,
                verified_at: new Date().toISOString()
            };
        } catch (error) {
            console.error(`   ❌ Verification error: ${error.message}`);
            return {
                file_path: filePath,
                request: changeDescription,
                error: error.message
            };
        }
    }

    // Analyze code quality
    async analyzeQuality(filePath, code) {
        console.log(`📊 Analyzing code quality: ${filePath}`);

        try {
            const prompt = `Analyze the code quality of this file.

**File:** ${filePath}

**Code:**
\`\`\`javascript
${code.substring(0, 5000)} ${code.length > 5000 ? '\n... (truncated)' : ''}
\`\`\`

**Analysis Required:**
1. Code organization and structure
2. Naming conventions
3. Error handling
4. Performance considerations
5. Security best practices
6. Maintainability
7. Documentation quality

Rate each category 1-10 and provide specific improvements.

Respond in JSON format:
{
    "scores": {
        "organization": 0-10,
        "naming": 0-10,
        "error_handling": 0-10,
        "performance": 0-10,
        "security": 0-10,
        "maintainability": 0-10,
        "documentation": 0-10
    },
    "overall_score": 0-10,
    "strengths": ["strength1"],
    "weaknesses": ["weakness1"],
    "improvements": [
        {
            "category": "...",
            "issue": "...",
            "suggestion": "...",
            "priority": "high/medium/low"
        }
    ],
    "summary": "brief assessment"
}`;

            const response = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a senior software architect conducting code reviews. You are thorough but constructive.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.3
            });

            const analysis = JSON.parse(response.choices[0].message.content);

            console.log(`   ✅ Quality score: ${analysis.overall_score}/10`);

            return {
                file_path: filePath,
                analysis,
                analyzed_at: new Date().toISOString()
            };
        } catch (error) {
            console.error(`   ❌ Analysis error: ${error.message}`);
            return {
                file_path: filePath,
                error: error.message
            };
        }
    }

    // Suggest improvements
    async suggestImprovements(filePath, code, context = '') {
        console.log(`💡 Suggesting improvements: ${filePath}`);

        try {
            const prompt = `Suggest improvements for this code.

**File:** ${filePath}

${context ? `**Context:** ${context}\n\n` : ''}**Code:**
\`\`\`javascript
${code.substring(0, 5000)} ${code.length > 5000 ? '\n... (truncated)' : ''}
\`\`\`

**Provide:**
1. Specific code improvements with examples
2. Performance optimizations
3. Better error handling
4. Security enhancements
5. Refactoring opportunities

Respond in JSON format:
{
    "improvements": [
        {
            "title": "...",
            "description": "...",
            "code_example": "...",
            "impact": "high/medium/low",
            "effort": "easy/medium/hard"
        }
    ],
    "quick_wins": ["easy improvement with high impact"],
    "long_term": ["harder improvements worth doing"],
    "priority_order": ["improvement1", "improvement2"]
}`;

            const response = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful coding assistant providing practical, actionable improvements.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.5
            });

            const suggestions = JSON.parse(response.choices[0].message.content);

            console.log(`   ✅ Found ${suggestions.improvements?.length || 0} improvements`);

            return {
                file_path: filePath,
                suggestions,
                suggested_at: new Date().toISOString()
            };
        } catch (error) {
            console.error(`   ❌ Suggestion error: ${error.message}`);
            return {
                file_path: filePath,
                error: error.message
            };
        }
    }

    // Detect potential bugs
    async detectBugs(filePath, code) {
        console.log(`🐛 Detecting bugs: ${filePath}`);

        try {
            const prompt = `Analyze this code for potential bugs, errors, and edge cases.

**File:** ${filePath}

**Code:**
\`\`\`javascript
${code.substring(0, 5000)} ${code.length > 5000 ? '\n... (truncated)' : ''}
\`\`\`

**Look for:**
1. Logic errors
2. Null/undefined handling issues
3. Type mismatches
4. Race conditions
5. Memory leaks
6. Infinite loops
7. Off-by-one errors
8. Edge cases not handled

Respond in JSON format:
{
    "bugs": [
        {
            "severity": "critical/high/medium/low",
            "type": "...",
            "description": "...",
            "location": "line or function",
            "fix": "how to fix it"
        }
    ],
    "edge_cases": ["edge case 1"],
    "risk_assessment": "overall risk level"
}`;

            const response = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a QA engineer specializing in finding bugs and edge cases.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.2
            });

            const analysis = JSON.parse(response.choices[0].message.content);

            console.log(`   ✅ Found ${analysis.bugs?.length || 0} potential bugs`);

            return {
                file_path: filePath,
                analysis,
                analyzed_at: new Date().toISOString()
            };
        } catch (error) {
            console.error(`   ❌ Bug detection error: ${error.message}`);
            return {
                file_path: filePath,
                error: error.message
            };
        }
    }
}

// Test if run directly
if (require.main === module) {
    (async () => {
        const verifier = new CodeVerificationService();

        console.log('\n🔍 Testing Code Verification Service...\n');

        // Example: Verify a simple change
        const request = 'Add error handling to database connection';
        const oldCode = `
async function connectDB() {
    const conn = await database.connect();
    return conn;
}`;
        const newCode = `
async function connectDB() {
    try {
        const conn = await database.connect();
        return conn;
    } catch (error) {
        console.error('DB connection failed:', error);
        throw error;
    }
}`;

        const verification = await verifier.verifyChange(
            request,
            'services/database.js',
            oldCode,
            newCode
        );

        console.log('\n✅ Verification Result:');
        console.log(JSON.stringify(verification.analysis, null, 2));
    })();
}

module.exports = CodeVerificationService;
