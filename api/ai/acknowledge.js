const AlertService = require('../../services/alert-service');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id } = req.query; // From rewrite

        if (!id) {
            return res.status(400).json({ error: 'Alert ID is required' });
        }

        const alertService = new AlertService();
        await alertService.acknowledgeAlert(id);

        res.json({
            success: true,
            message: 'Alert acknowledged',
            id
        });
    } catch (error) {
        console.error('❌ Acknowledge error:', error);
        res.status(500).json({ error: error.message });
    }
};
