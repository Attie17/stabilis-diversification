// Vercel Serverless Function - AI Chat Endpoint
const OpenAI = require('openai');

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, context } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Check for OpenAI API key
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ 
                error: 'OpenAI API key not configured',
                response: '⚠️ AI features are not configured. Please add OPENAI_API_KEY to environment variables in Vercel dashboard.'
            });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Simple chat completion (non-streaming)
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert project management assistant for Stabilis Diversification projects.
                    
Context: ${context || 'General project assistance'}

Provide helpful, concise answers about:
- Project phases and milestones
- Timeline and scheduling
- Budget and resource allocation
- Risk management
- Revenue projections

Always be professional, data-driven, and actionable. Format responses with markdown for better readability.`
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        const reply = completion.choices[0].message.content;

        res.status(200).json({
            success: true,
            response: reply,
            message: reply,  // Backward compatibility
            context: context,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('OpenAI Error:', error.message);
        res.status(500).json({
            error: 'Failed to get AI response',
            response: `❌ Error: ${error.message}. Please check your OpenAI API configuration.`,
            details: error.message
        });
    }
};
