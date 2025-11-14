const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Landing page as root (BEFORE static middleware)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'landing.html'));
});

// Serve static files from web directory
app.use(express.static('web'));

// Diversification project route
app.get('/diversification', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

// Turnaround project route
app.get('/turnaround', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'turnaround.html'));
});

// Handle all other routes - send landing page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'landing.html'));
});

app.listen(PORT, () => {
    console.log(`
    ============================================================
     🚀 Stabilis Project Hub
    ============================================================
    
     Landing:  http://localhost:${PORT}
     Network:  http://[your-ip]:${PORT}
     
     Projects:
     • Turnaround:       http://localhost:${PORT}/turnaround.html
     • Diversification:  http://localhost:${PORT}/index.html
     • Wellness Centre:  http://localhost:${PORT}/wellness.html
     
     📱 Access from your phone using the Network URL
     💡 Press Ctrl+C to stop
     
    ============================================================
    `);
});
