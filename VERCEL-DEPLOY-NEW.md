# Vercel Deployment Guide (Updated for Serverless)

## 🚨 Important: Serverless Architecture

Vercel uses **serverless functions**, not traditional Node.js servers. This project has been configured for Vercel deployment with these considerations:

### Architecture Overview

✅ **Frontend**: Static HTML/CSS/JS files served from `web/` directory  
✅ **API**: Serverless functions in `api/` directory (health, chat, dashboard)  
⚠️ **Limitations**: No long-running processes (cron, file watchers, persistent threads)

### What Works on Vercel

- ✅ All frontend pages (landing, executive, turnaround, wellness)
- ✅ Static file serving
- ✅ Basic API endpoints
- ✅ Simple AI chat (with OPENAI_API_KEY env var)
- ✅ Auto-deployment from GitHub
- ✅ Custom domains
- ✅ SSL certificates (automatic)

### What Doesn't Work on Vercel

- ❌ OpenAI Assistant with persistent threads (serverless has no state)
- ❌ Cron jobs for scheduled tasks (use Vercel Cron instead)
- ❌ File change detection/watching (no file system access)
- ❌ Long-running background processes (10-second timeout)
- ❌ In-memory session storage (use external database)

### For Full AI Features

If you need the complete AI Executive Assistant with all features, use:
- **Render** (recommended): Full Node.js support, persistent processes
- **Railway**: Good for Node.js apps with background jobs
- **Digital Ocean**: VPS with full control
- **AWS EC2/ECS**: Enterprise-grade hosting

---

## Quick Deploy to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```powershell
   git add .
   git commit -m "Vercel-ready deployment"
   git push origin master
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Select your repository: `stabilis-diversification`
   - Vercel detects `vercel.json` automatically
   - Click "Deploy"

3. **Add Environment Variables** (Optional for AI features)
   - Go to Project Settings → Environment Variables
   - Add `OPENAI_API_KEY` for AI chat functionality
   - Add `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` if using database

4. **Done!**
   - Your site is live at `https://your-project.vercel.app`
   - Auto-deploys on every push to `master`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Login**
   ```powershell
   vercel login
   ```

3. **Deploy**
   ```powershell
   vercel
   ```
   
   Follow prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (first time)
   - Project name? `stabilis-diversification`
   - Directory? `./` (current)
   - Override settings? **N**

4. **Deploy to Production**
   ```powershell
   vercel --prod
   ```

---

## Configuration Details

### vercel.json Structure

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "web" }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1.js" },
    { "src": "/", "dest": "/web/landing.html" },
    { "src": "/(.*)", "dest": "/web/$1" }
  ]
}
```

### API Functions

Located in `/api/` directory:
- `health.js` - Health check endpoint
- `chat.js` - Simple AI chat (OpenAI API)
- `dashboard.js` - Static project data

Each function is a serverless function with 10-second timeout.

---

## Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Optional | For AI chat functionality |
| `SUPABASE_URL` | Optional | For database features |
| `SUPABASE_SERVICE_KEY` | Optional | For database authentication |
| `NODE_ENV` | Auto | Set to `production` automatically |

---

## Custom Domain Setup

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `stabilis.yourdomain.com`)
4. Add DNS records to your domain provider:
   - **A Record**: `76.76.21.21` (Vercel's IP)
   - **CNAME**: `cname.vercel-dns.com`
5. Wait for DNS propagation (5-30 minutes)
6. SSL certificate issued automatically

---

## Your Live URLs

After deployment:

- **Landing**: `https://your-project.vercel.app/`
- **Executive Dashboard**: `https://your-project.vercel.app/executive`
- **Turnaround**: `https://your-project.vercel.app/turnaround`
- **Diversification**: `https://your-project.vercel.app/diversification`
- **Wellness**: `https://your-project.vercel.app/wellness`

API Endpoints:
- **Health**: `https://your-project.vercel.app/api/health`
- **Chat**: `https://your-project.vercel.app/api/chat` (POST)
- **Dashboard**: `https://your-project.vercel.app/api/dashboard`

---

## Troubleshooting

### 404 Errors

**Problem**: Pages return 404  
**Solution**: Check `vercel.json` routes match your file structure in `web/`

### API Function Timeout

**Problem**: "Function execution timed out"  
**Solution**: Serverless functions have 10-second limit. Optimize API calls or upgrade plan.

### Missing Environment Variables

**Problem**: "OpenAI API key not configured"  
**Solution**: Add `OPENAI_API_KEY` in Vercel Dashboard → Environment Variables → Redeploy

### Build Fails

**Problem**: Deployment fails during build  
**Solution**: 
- Check `package.json` has correct Node.js version (22.x)
- Ensure all dependencies are listed
- Check build logs in Vercel Dashboard

### Static Files Not Loading

**Problem**: CSS/JS files return 404  
**Solution**: Ensure files are in `web/` directory and routes in `vercel.json` catch-all is correct

---

## Local Testing Before Deploy

Test the frontend locally:

```powershell
# Install dependencies
npm install

# Serve static files (Python - quick method)
cd web
python -m http.server 8000

# Or use VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

Visit `http://localhost:8000` to test.

---

## Deployment Checklist

Before deploying:

- [ ] All files committed to Git
- [ ] Pushed to GitHub `master` branch
- [ ] `vercel.json` configured correctly
- [ ] Environment variables prepared (if needed)
- [ ] Custom domain DNS records ready (if using)
- [ ] Tested locally
- [ ] Reviewed `.vercelignore` exclusions

---

## Alternative: Full-Stack Hosting (Render)

For complete AI features (persistent threads, cron jobs, file watching), use **Render** instead:

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: stabilis-diversification
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: OPENAI_API_KEY
        sync: false
      - key: SUPABASE_URL
        sync: false
```

2. Deploy to Render:
   - Visit [render.com](https://render.com)
   - Connect GitHub repository
   - Select Web Service
   - Auto-deploys with full Node.js support

---

## Summary

**Vercel Deployment:**
- ✅ Fast, free, automatic
- ✅ Perfect for static sites + basic APIs
- ⚠️ Limited for complex backend features

**Full Feature Deployment:**
- Use Render, Railway, or VPS
- See `DEPLOYMENT-READY.md` for alternatives

**Questions?**
Check logs in Vercel Dashboard or contact support.

---

**Ready to deploy?** Just run `vercel` or connect GitHub! 🚀
