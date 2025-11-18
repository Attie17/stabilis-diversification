// Vercel Serverless Function - Dashboard Data
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    try {
        // Read project data files
        const dataPath = path.join(process.cwd(), 'web', 'js', 'data.js');
        const turnaroundPath = path.join(process.cwd(), 'web', 'js', 'turnaround-data.js');
        const wellnessPath = path.join(process.cwd(), 'web', 'js', 'wellness-data.js');

        // Simple data extraction (for static data)
        const diversificationData = fs.existsSync(dataPath) 
            ? extractDataFromFile(dataPath) 
            : null;
        
        const turnaroundData = fs.existsSync(turnaroundPath) 
            ? extractDataFromFile(turnaroundPath) 
            : null;
        
        const wellnessData = fs.existsSync(wellnessPath) 
            ? extractDataFromFile(wellnessPath) 
            : null;

        // Calculate summary statistics
        const summary = {
            diversification: calculateProjectStats(diversificationData),
            turnaround: calculateProjectStats(turnaroundData),
            wellness: calculateProjectStats(wellnessData),
            timestamp: new Date().toISOString()
        };

        res.status(200).json({
            success: true,
            summary,
            note: 'Static data - real-time updates require database connection'
        });

    } catch (error) {
        console.error('Dashboard Error:', error.message);
        res.status(500).json({
            error: 'Failed to load dashboard data',
            details: error.message
        });
    }
};

// Helper to extract data from JS files
function extractDataFromFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Basic parsing - extract phases
        const phasesMatch = content.match(/phases:\s*\[([\s\S]*?)\],?\s*current/);
        if (phasesMatch) {
            // Return indicator that data exists
            return { exists: true, source: filePath };
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

// Calculate basic project statistics
function calculateProjectStats(data) {
    if (!data || !data.exists) {
        return {
            status: 'No data',
            phases: 0,
            milestones: 0
        };
    }

    return {
        status: 'Active',
        phases: 5, // Default for stabilis projects
        milestones: 'Available',
        note: 'View detailed data in project pages'
    };
}
