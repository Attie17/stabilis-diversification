# Hybrid Deployment Guide

## Architecture Overview

This project uses a **hybrid deployment model** similar to your mediation app:

```
┌─────────────────────────────────────────────────────────────┐
│                    HYBRID ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐          ┌──────────────────┐        │
│  │   Vercel (CDN)   │          │  Render (Server) │        │
│  │                  │          │                  │        │
│  │  • Static HTML   │◄────────►│  • Express.js    │        │
│  │  • JavaScript    │  API     │  • Excel files   │        │
│  │  • CSS           │  Calls   │  • AI services   │        │
│  │  • Fast delivery │          │  • Database      │        │
│  │                  │          │  • File uploads  │        │
│  └──────────────────┘          └──────────────────┘        │
│         ▲                               ▲                   │
│         │                               │                   │
│         │ HTTPS                         │ HTTPS             │
│         │                               │                   │
│    ┌────┴────┐                    ┌────┴────┐              │
│    │  Users  │                    │ CEO/FM  │              │
│    │ (View)  │                    │ (Edit)  │              │
│    └─────────┘                    └─────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Why Hybrid?

1. **Performance**: Static files on Vercel CDN = blazing fast for all users
2. **No Downtime**: Backend on Render = 24/7 availability (not dependent on your PC)
3. **Excel Editing**: Cloud-based download/upload flow = works from anywhere
4. **Cost**: Both platforms have generous free tiers

---

## Deployment Steps

### Step 1: Deploy Backend to Render (10 minutes)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub (easiest)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Attie17/stabilis-diversification`
   - Render will detect `render.yaml` automatically

3. **Configure Service**
   - **Name**: `stabilis-backend` (or your choice)
   - **Branch**: `master`
   - **Build Command**: `npm install` (auto-detected)
   - **Start Command**: `npm start` (auto-detected)

4. **Add Environment Variables**
   - Click "Environment" tab
   - Add these variables:
     ```
     OPENAI_API_KEY=sk-proj-your-key-here
     SUPABASE_URL=https://hqwanqvblpidlkmipoum.supabase.co
     SUPABASE_SERVICE_KEY=your-key-here
     TAVILY_API_KEY=tvly-your-key-here (optional)
     FRONTEND_URL=https://stabilisstrategy.app
     NODE_ENV=production
     ```

5. **Enable Persistent Disk** (Important!)
   - Click "Disks" tab
   - Click "Add Disk"
   - **Name**: `excel-data`
   - **Mount Path**: `/opt/render/project/data`
   - **Size**: 1 GB (free tier)
   - This keeps your Excel file across deployments

6. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - Note your backend URL (e.g., `https://stabilis-backend.onrender.com`)

7. **Upload Initial Excel File**
   - Once deployed, visit `https://stabilis-backend.onrender.com/api/health`
   - Should see: `{"status":"ok",...}`
   - Upload your Excel file:
     ```powershell
     # From your project directory
     curl -X POST https://stabilis-backend.onrender.com/api/excel/upload `
          -F "excel=@data/stabilis-data.xlsx"
     ```

---

### Step 2: Update Frontend for Render Backend (2 minutes)

1. **Update Backend URL in Frontend**
   - Open `web/executive-dashboard.html`
   - Find line with `https://stabilis-backend.onrender.com`
   - Replace with your actual Render URL (if different)

2. **Commit Changes**
   ```powershell
   git add web/executive-dashboard.html
   git commit -m "Update backend URL for Render deployment"
   git push origin master
   ```

---

### Step 3: Deploy Frontend to Vercel (Already Done!)

Your Vercel deployment is already configured. It will:
- Automatically deploy on every `git push`
- Serve static files from `web/` directory
- Use serverless functions in `api/` for basic endpoints

**Vercel handles**:
- HTML, CSS, JavaScript delivery
- Basic API endpoints (health, chat, dashboard)

**Render handles**:
- Excel file management
- AI services with persistent state
- File uploads/downloads
- Change detection
- Cron jobs

---

## How Excel Editing Works

### For CEO/FM Users:

1. **Access Dashboard**
   - Go to `https://stabilisstrategy.app/executive-dashboard.html`
   - Login as Attie Nel or Nastasha Jacobs

2. **Click "Edit Workbook"**
   - Modal appears with instructions

3. **Download Excel File**
   - Click "📥 Download Excel" button
   - File downloads to your computer
   - Open in Microsoft Excel

4. **Edit Budget Data**
   - Make your changes
   - Formulas auto-calculate
   - Save the file

5. **Upload Updated File**
   - Click "📤 Upload Excel" button
   - Select the file you just edited
   - Upload completes
   - Dashboard refreshes with new data

### Technical Flow:

```
User clicks "Edit Workbook"
     ↓
Frontend calls: GET /api/open-excel
     ↓
Server detects cloud deployment (RENDER=true)
     ↓
Returns: { cloudDeployment: true, downloadUrl: '/api/excel/download' }
     ↓
Frontend shows modal with Download + Upload buttons
     ↓
User downloads: GET /api/excel/download
     ↓
Server sends file from /data/stabilis-data.xlsx
     ↓
User edits locally in Excel
     ↓
User uploads: POST /api/excel/upload (multipart form-data)
     ↓
Server saves to /data/stabilis-data.xlsx (on persistent disk)
     ↓
Dashboard reloads and displays updated data
```

---

## Environment Variables Reference

### Render Backend (.env)
```bash
# Required
OPENAI_API_KEY=sk-proj-your-key-here
SUPABASE_URL=https://hqwanqvblpidlkmipoum.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here
NODE_ENV=production

# Optional
TAVILY_API_KEY=tvly-your-key-here
FRONTEND_URL=https://stabilisstrategy.app
PORT=3000  # Render sets this automatically
```

### Vercel Frontend
No environment variables needed - all API calls go to Render backend.

---

## Testing the Deployment

### 1. Test Backend Health
```powershell
curl https://stabilis-backend.onrender.com/api/health
```
Expected response:
```json
{
  "status": "ok",
  "services": {
    "database": "connected",
    "openai": "ready",
    "alerts": "ok",
    "revenue": "ok",
    "changes": "watching"
  },
  "timestamp": "2025-11-21T..."
}
```

### 2. Test Excel Download
```powershell
curl https://stabilis-backend.onrender.com/api/excel/download -o test-download.xlsx
```
Should download the Excel file.

### 3. Test Excel Upload
```powershell
curl -X POST https://stabilis-backend.onrender.com/api/excel/upload `
     -F "excel=@test-download.xlsx"
```
Expected response:
```json
{
  "success": true,
  "message": "Excel file updated successfully"
}
```

### 4. Test Frontend
- Visit `https://stabilisstrategy.app/executive-dashboard.html`
- Login as Attie Nel
- Click "Edit Workbook"
- Should see modal with Download/Upload buttons

---

## Maintenance & Updates

### Deploying Code Changes

**Backend (Render):**
```powershell
git add .
git commit -m "Update backend"
git push origin master
```
Render auto-deploys in ~3 minutes.

**Frontend (Vercel):**
```powershell
git add web/
git commit -m "Update frontend"
git push origin master
```
Vercel auto-deploys in ~30 seconds.

### Monitoring

**Render Dashboard:**
- View logs: https://dashboard.render.com → Your Service → Logs
- Check disk usage: Disks tab
- Monitor uptime: Metrics tab

**Vercel Dashboard:**
- View deployments: https://vercel.com/dashboard
- Check analytics: Analytics tab
- View errors: Error logs

### Backup Excel File

**Manual Backup:**
```powershell
# Download current version
curl https://stabilis-backend.onrender.com/api/excel/download -o backup-$(Get-Date -Format "yyyy-MM-dd").xlsx
```

**Automated Backup** (optional):
Set up a scheduled task to run daily:
```powershell
# Windows Task Scheduler: Run daily at 2 AM
$action = New-ScheduledTaskAction -Execute 'curl' -Argument 'https://stabilis-backend.onrender.com/api/excel/download -o C:\Backups\stabilis-data-$(Get-Date -Format "yyyy-MM-dd").xlsx'
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -TaskName "Backup Stabilis Excel" -Action $action -Trigger $trigger
```

---

## Troubleshooting

### Excel File Not Found on Render

**Problem**: 404 error when downloading Excel  
**Solution**: Upload the initial file
```powershell
curl -X POST https://stabilis-backend.onrender.com/api/excel/upload `
     -F "excel=@data/stabilis-data.xlsx"
```

### Upload Fails

**Problem**: Upload returns error  
**Check**:
1. File size < 10MB (Render limit)
2. File extension is `.xlsx` or `.xls`
3. User is authorized (CEO/FM only)

### Backend URL Wrong

**Problem**: Frontend can't connect to backend  
**Solution**: Update URL in `executive-dashboard.html`:
```javascript
const backendUrl = window.location.hostname.includes('localhost') 
    ? 'http://localhost:3000'
    : 'https://your-actual-render-url.onrender.com'; // Update this
```

### Render Service Sleeping

**Problem**: First request takes 30+ seconds  
**Explanation**: Render free tier services sleep after 15 minutes of inactivity  
**Solutions**:
1. Upgrade to paid plan ($7/month for always-on)
2. Accept the delay on first request
3. Set up a cron job to ping every 10 minutes:
   ```javascript
   // In server.js cron scheduler
   cron.schedule('*/10 * * * *', async () => {
       console.log('Keep-alive ping');
   });
   ```

---

## Cost Breakdown

### Free Tier (Current Setup)
- **Render**: FREE
  - 750 hours/month free compute
  - 1 GB persistent disk
  - Sleeps after 15 min inactivity
  
- **Vercel**: FREE
  - 100 GB bandwidth
  - Unlimited deployments
  - Global CDN
  
- **Total**: $0/month

### Paid Tier (Optional)
- **Render Starter**: $7/month
  - Always-on (no sleep)
  - 10 GB disk
  - Better performance
  
- **Vercel Pro**: $20/month
  - Advanced analytics
  - Password protection
  - Team collaboration
  
- **Total**: $7-27/month (only upgrade if needed)

---

## Security Notes

1. **CORS**: Backend accepts requests from `stabilisstrategy.app` only (set in FRONTEND_URL)
2. **Access Control**: Excel editing restricted to CEO/FM usernames (checked in frontend AND backend)
3. **File Validation**: Only `.xlsx`/`.xls` files accepted
4. **Size Limits**: 10 MB max upload (configurable)
5. **HTTPS**: All traffic encrypted (automatic on Render + Vercel)

---

## Next Steps

1. ✅ **Deploy to Render** (follow Step 1 above)
2. ✅ **Upload initial Excel file**
3. ✅ **Test download/upload flow**
4. ✅ **Update frontend URL if needed**
5. ✅ **Git push to deploy**
6. ✅ **Test from stabilisstrategy.app**
7. ✅ **Train CEO/FM on new workflow**

---

## Support

**Render Issues**: https://render.com/docs  
**Vercel Issues**: https://vercel.com/docs  
**Project Issues**: Check server logs in Render dashboard

---

**Last Updated**: November 21, 2025  
**Status**: Ready for deployment  
**Deployment Model**: Hybrid (Vercel + Render)
