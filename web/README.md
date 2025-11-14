# Stabilis Mobile Web App

## 🚀 Quick Start

### Launch the App
```powershell
cd C:\Diversification
npm start
```

The app will be available at:
- **Computer:** http://localhost:3000
- **Phone/Tablet:** http://[your-computer-ip]:3000

### Find Your Computer's IP Address
```powershell
ipconfig | Select-String "IPv4"
```

---

## 📱 Features

### Dashboard View
- **Live countdown** to project launch or current day
- **Progress tracking** across all 29 milestones
- **Financial overview** (R6.169m target)
- **Current phase** status with progress bar
- **Next 5 milestones** with due dates and owners

### Phases View
- All 5 project phases in accordion format
- Expand to see detailed milestones
- Revenue targets per phase
- Tap milestones to mark complete (saved locally)

### Risks View
- 15 active risks with severity indicators
- Filter by: All, 🔴 High, 🟡 Medium, 🟢 Low
- Impact/likelihood scoring
- Assigned owners

### Team View
- 8 key roles
- Responsibilities per role
- Ready to update with names

---

## 💡 Usage

### Mark Milestone Complete
Tap any milestone checkbox to toggle complete/planned status. Changes save automatically to browser localStorage.

### Navigate
Use the top tabs to switch between Dashboard, Phases, Risks, and Team views.

### Mobile Access
1. Ensure your phone is on the same WiFi as your computer
2. Find your computer's IP: `ipconfig` (look for IPv4)
3. Open browser on phone: `http://[your-ip]:3000`
4. Add to home screen for quick access

---

## 🎨 Design Features

- **Mobile-first** responsive design
- **Touch-optimized** interactions
- **Dark mode** support (auto-detects system preference)
- **Smooth animations** and transitions
- **PWA-ready** (add to home screen)
- **No internet required** after first load

---

## 🔧 Technical Stack

- **Pure HTML/CSS/JavaScript** - No frameworks needed
- **Express.js** - Simple web server
- **LocalStorage** - Data persistence
- **Responsive Grid** - Works on any screen size

---

## 📊 Data Source

All project data is loaded from `web/js/data.js` including:
- 5 phases with 29 milestones
- Revenue targets per phase
- 15 identified risks
- 8 team roles

To update data, edit `data.js` and refresh the browser.

---

## 🌐 Network Access

### Windows Firewall
If your phone can't connect, allow Node.js through firewall:
```powershell
New-NetFirewallRule -DisplayName "Stabilis App" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
```

### Change Port
Edit `server.js` and change:
```javascript
const PORT = process.env.PORT || 3000; // Change 3000 to your preferred port
```

---

## 📦 Files Structure

```
web/
├── index.html          # Main app structure
├── css/
│   └── style.css      # All styling (mobile-optimized)
├── js/
│   ├── data.js        # Project data source
│   └── app.js         # App logic & interactions
├── manifest.json      # PWA configuration
└── data/              # Future: JSON data files
```

---

## 🎯 Future Enhancements

- [ ] Backend API for multi-device sync
- [ ] File upload for weekly reports
- [ ] Export reports to PDF
- [ ] Push notifications for due milestones
- [ ] Offline mode with service worker
- [ ] Real-time collaboration
- [ ] Chart visualizations

---

## 🐛 Troubleshooting

**App won't start:**
```powershell
cd C:\Diversification
npm install
npm start
```

**Phone can't connect:**
- Check both devices on same WiFi
- Verify firewall allows port 3000
- Use `ipconfig` to confirm IP address

**Changes not showing:**
- Hard refresh browser: `Ctrl+Shift+R` (desktop) or clear cache (mobile)

---

## 📄 License

**PRIVATE & CONFIDENTIAL**  
Stabilis Internal Use Only

---

**Last Updated:** 11 Nov 2025  
**Version:** 1.0.0
