// Budget Sync API Endpoint
// Triggers Excel workbook sync to Supabase

const { spawn } = require('child_process');
const path = require('path');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        console.log('📊 Budget sync triggered via API...');
        
        // Run the sync script
        const scriptPath = path.join(process.cwd(), 'scripts', 'sync-budget-to-supabase.js');
        
        return new Promise((resolve) => {
            const syncProcess = spawn('node', [scriptPath], {
                cwd: process.cwd(),
                env: process.env
            });
            
            let output = '';
            let errorOutput = '';
            
            syncProcess.stdout.on('data', (data) => {
                const text = data.toString();
                output += text;
                console.log(text);
            });
            
            syncProcess.stderr.on('data', (data) => {
                const text = data.toString();
                errorOutput += text;
                console.error(text);
            });
            
            syncProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('✅ Budget sync completed successfully');
                    resolve(res.status(200).json({
                        success: true,
                        message: 'Budget data synced successfully',
                        output: output,
                        timestamp: new Date().toISOString()
                    }));
                } else {
                    console.error('❌ Budget sync failed with code:', code);
                    resolve(res.status(500).json({
                        success: false,
                        error: 'Budget sync failed',
                        output: output,
                        errorOutput: errorOutput,
                        exitCode: code
                    }));
                }
            });
            
            // Timeout after 30 seconds
            setTimeout(() => {
                syncProcess.kill();
                resolve(res.status(408).json({
                    success: false,
                    error: 'Budget sync timeout (30s)',
                    output: output
                }));
            }, 30000);
        });
        
    } catch (error) {
        console.error('❌ Budget sync API error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to trigger budget sync',
            message: error.message
        });
    }
};
