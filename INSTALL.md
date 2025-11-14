# 📱 Stabilis Project - Installation Guide

## Prerequisites

- **Windows** PC with PowerShell
- **Node.js** installed (v14 or higher)
- **WiFi** network (for mobile access)

---

## 🚀 First-Time Setup

### 1. Install Node.js (if not installed)
Visit: https://nodejs.org  
Download and install the LTS version.

Verify installation:
```powershell
node --version
npm --version
```

### 2. Navigate to Project
```powershell
cd C:\Diversification
```

### 3. Install Dependencies
```powershell
npm install
```

This installs Express.js (web server).

---

## 🎯 Daily Usage

### Start the Web App
```powershell
cd C:\Diversification
npm start
```

You'll see:
```
============================================================
 🚀 Stabilis Diversification App
============================================================

 Local:    http://localhost:3000
 Network:  http://[your-ip]:3000
 
 📱 Access from your phone using the Network URL
 💡 Press Ctrl+C to stop

============================================================
```

### Access on Computer
Open browser: **http://localhost:3000**

### Access on Phone/Tablet

#### Step 1: Find Your Computer's IP
In PowerShell:
```powershell
ipconfig | Select-String "IPv4"
```

Look for something like: `192.168.1.100`

#### Step 2: Connect from Phone
1. Ensure phone is on **same WiFi** as computer
2. Open browser on phone
3. Go to: **http://192.168.1.100:3000** (use your IP)

#### Step 3: Add to Home Screen
- **iPhone:** Tap Share → Add to Home Screen
- **Android:** Tap Menu (⋮) → Add to Home Screen

Now you have a native-like app icon!

---

## 🔥 Windows Firewall

If your phone can't connect, allow the app through firewall:

```powershell
New-NetFirewallRule -DisplayName "Stabilis App" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
```

---

## 📊 Quick Commands

```powershell
npm start           # Launch web app
npm run status      # Show countdown & project status
npm run dashboard   # View full project plan
npm run phase1      # View Phase 1 details
# phase2, phase3, phase4, phase5 also available
```

---

## 🛠️ Troubleshooting

### "npm: command not found"
Node.js not installed. Download from https://nodejs.org

### "Cannot find module 'express'"
Run: `npm install`

### Phone can't connect
1. Check both on same WiFi
2. Verify firewall rule (see above)
3. Confirm IP address with `ipconfig`
4. Try different browser on phone

### Port 3000 already in use
Edit `server.js` line 4:
```javascript
const PORT = process.env.PORT || 3001; // Change to 3001 or any free port
```

### Changes not appearing
Hard refresh:
- **Desktop:** Ctrl+Shift+R
- **Mobile:** Clear browser cache

---

## 🎨 Features Overview

✅ **Dashboard** - Live progress, countdown, KPIs  
✅ **Phases** - 5 phases, 29 milestones, tap to complete  
✅ **Risks** - 15 risks with filters  
✅ **Team** - 8 roles with responsibilities  
✅ **Dark Mode** - Auto-detects system preference  
✅ **Mobile-First** - Optimized for touch  
✅ **Offline** - Works after first load  

---

## 📱 Mobile Tips

- **Landscape mode** works great on tablets
- **Swipe** to scroll through tabs
- **Tap milestones** to mark complete (saves locally)
- **Pull to refresh** to reload data
- **Share screen** in meetings via browser

---

## 🔒 Security Note

This app runs **locally on your network only**. It is:
- ✅ Not exposed to the internet
- ✅ Only accessible on your WiFi
- ✅ Data stays on your device (localStorage)

For internet access, you'd need:
- Cloud hosting (e.g., Azure, AWS)
- Database backend
- Authentication system

---

## 📞 Support

For issues or questions about the app, check:
1. `web/README.md` - Web app documentation
2. `README.md` - Main project docs
3. `PROJECT-DASHBOARD.md` - Full project plan

---

**Last Updated:** 12 Nov 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
