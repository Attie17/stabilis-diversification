// Vercel Serverless Function - Health Check
module.exports = async (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
            frontend: 'deployed',
            api: 'serverless',
            platform: 'vercel'
        },
        note: 'AI features require environment variables (OPENAI_API_KEY, etc.)'
    });
};
