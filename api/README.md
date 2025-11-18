# API Directory - Vercel Serverless Functions

This directory contains serverless functions for Vercel deployment.

## Available Endpoints

### GET /api/health
Returns server health status and configuration.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-18T10:30:00.000Z",
  "services": {
    "frontend": "deployed",
    "api": "serverless",
    "platform": "vercel"
  },
  "note": "AI features require environment variables"
}
```

### POST /api/chat
Simple AI chat endpoint using OpenAI API.

**Request:**
```json
{
  "message": "What are the critical milestones?",
  "context": "Executive Dashboard"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Based on the diversification project...",
  "context": "Executive Dashboard",
  "timestamp": "2025-11-18T10:30:00.000Z"
}
```

**Requires:** `OPENAI_API_KEY` environment variable

### GET /api/dashboard
Returns static project data and statistics.

**Response:**
```json
{
  "success": true,
  "summary": {
    "diversification": {
      "status": "Active",
      "phases": 5,
      "milestones": "Available"
    },
    "turnaround": { ... },
    "wellness": { ... }
  },
  "timestamp": "2025-11-18T10:30:00.000Z"
}
```

## Limitations

Vercel serverless functions have:
- **10-second timeout** (Hobby plan) or 60 seconds (Pro)
- **No persistent storage** between invocations
- **Cold starts** (first request may be slow)
- **No file system writes** (read-only)

## Environment Variables

Add these in Vercel Dashboard:

- `OPENAI_API_KEY` - For AI chat functionality
- `SUPABASE_URL` - For database features (optional)
- `SUPABASE_SERVICE_KEY` - For database auth (optional)

## Local Testing

Vercel CLI can run functions locally:

```powershell
vercel dev
```

This starts a local server at `http://localhost:3000` with serverless function simulation.

## Deployment

Functions are automatically deployed when you deploy to Vercel. No additional configuration needed - Vercel detects `.js` files in `/api/` and converts them to serverless functions.

## Full Feature Alternative

For advanced AI features (persistent threads, cron jobs, file watching), use the full `server.js` on traditional hosting (Render, Railway, etc.). See `VERCEL-DEPLOY-NEW.md` for details.
