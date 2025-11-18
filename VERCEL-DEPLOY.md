# Vercel Deployment Guide

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```powershell
   vercel login
   ```

3. **Deploy**
   ```powershell
   vercel
   ```
   - Follow the prompts
   - Accept defaults or customize settings
   - Get your live URL instantly!

4. **Deploy to Production**
   ```powershell
   vercel --prod
   ```

### Option 2: Deploy via GitHub (Automatic)

1. **Push your code to GitHub**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects settings
   - Click "Deploy"

3. **Automatic Updates**
   - Every push to `main` branch auto-deploys!

## What's Configured

- ✅ Node.js Express server ready
- ✅ Static files properly served
- ✅ All routes configured
- ✅ Environment variables supported

## Custom Domain (Optional)

After deployment, add a custom domain:
1. Go to your project in Vercel dashboard
2. Settings → Domains
3. Add your domain and follow DNS instructions

## Environment Variables

If you need environment variables:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables (e.g., `NODE_ENV=production`)

## Your Routes Will Be:

- Landing: `https://your-app.vercel.app/`
- Executive: `https://your-app.vercel.app/executive`
- Diversification: `https://your-app.vercel.app/diversification`
- Turnaround: `https://your-app.vercel.app/turnaround`
- Wellness: `https://your-app.vercel.app/wellness.html`

## Troubleshooting

**Issue**: 404 errors
- Check `vercel.json` routes configuration
- Ensure all files are in `web/` directory

**Issue**: Build fails
- Check Node.js version in `package.json` (18.x)
- Ensure all dependencies are in `package.json`

## Local Testing

Before deploying, test locally:
```powershell
npm install
npm start
```

Visit `http://localhost:3000` to verify everything works.

---

**Ready to deploy?** Just run `vercel` in your terminal!
