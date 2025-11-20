/**
 * Serverless function to open Excel file in Windows
 * Uses PowerShell to launch the default application for .xlsx files
 */

const { exec } = require('child_process');
const path = require('path');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Excel file path
        const excelPath = path.join(process.cwd(), 'data', 'stabilis-data.xlsx');

        // PowerShell command to open Excel file with default application
        const command = `powershell -Command "Start-Process '${excelPath}'"`;

        // Execute command
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error opening Excel:', error);
                return res.status(500).json({
                    success: false,
                    error: error.message,
                    message: 'Failed to open Excel file'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Excel file opened successfully',
                path: excelPath
            });
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Server error opening Excel file'
        });
    }
};
