// Vercel Serverless Function - AI Chat Endpoint
const { Configuration, OpenAIApi } = require('openai');

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
                message: 'Please add OPENAI_API_KEY to Vercel environment variables'
            });
        }

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        // Simple chat completion (non-streaming)
        const completion = await openai.createChatCompletion({
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

Always be professional, data-driven, and actionable.`
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        const reply = completion.data.choices[0].message.content;

        res.status(200).json({
            success: true,
            message: reply,
            context: context,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('OpenAI Error:', error.message);
        res.status(500).json({
            error: 'Failed to get AI response',
            details: error.message
        });
    }
};
