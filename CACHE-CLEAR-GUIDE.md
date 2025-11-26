# Cache Clear Guide - AI Assistant Fix

## Problem
AI Assistant is trying to reach `stabilis-diversification.onrender.com/api/chat` instead of the correct Vercel endpoint. This is because your browser has cached an old version of `ai-chat-component.js`.

## Solution: Clear Browser Cache

### **Method 1: Hard Refresh (Recommended)**
1. Open the dashboard in your regular browser
2. Press **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
3. This force-reloads the page and bypasses cache

### **Method 2: Clear Site Data (Most Thorough)**
1. Open the dashboard
2. Press **F12** to open Developer Tools
3. Go to **Application** tab (Chrome/Edge) or **Storage** tab (Firefox)
4. In the left sidebar, under "Storage", right-click on the domain
5. Select **"Clear site data"** or **"Clear all"**
6. Refresh the page with **Ctrl + Shift + R**

### **Method 3: Manual Cache Clear**
#### Chrome/Edge:
1. Press **Ctrl + Shift + Delete**
2. Select **"Cached images and files"**
3. Time range: **"Last hour"** or **"All time"**
4. Click **"Clear data"**
5. Reload the page

#### Firefox:
1. Press **Ctrl + Shift + Delete**
2. Select **"Cache"**
3. Time range: **"Everything"**
4. Click **"Clear Now"**
5. Reload the page

### **Method 4: Incognito/Private Window (Temporary Test)**
Since it works in incognito, you can:
1. Open an incognito window (Ctrl + Shift + N)
2. Test the dashboard
3. Then clear cache in regular window using methods above

## Why Incognito Works
Incognito mode doesn't use cached files, so it always loads the latest JavaScript from Vercel. Your regular browser had cached the old `ai-chat-component.js` file that pointed to Render.

## Verify Fix
After clearing cache:
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Filter by **JS**
4. Look for `ai-chat-component.js`
5. Check the **Status** column - should show `200` not `(disk cache)`
6. Click the file and check the **Headers** tab
7. Should show `cache-control: public, max-age=0, must-revalidate` from Vercel

## Production URL
**Current deployment:** https://web-7pnj8r4m4-attie17s-projects.vercel.app

The correct API endpoint is:
- Production: `https://web-7pnj8r4m4-attie17s-projects.vercel.app/api/chat`
- Local: `http://localhost:3000/api/chat`

## Check Current Code
To verify you have the latest code, open Developer Tools → Console and run:
```javascript
// Check getBackendBaseUrl function
console.log(window.location.origin); // Should match current domain
```

## Still Not Working?
If clearing cache doesn't work:

1. **Check Service Worker:**
   - F12 → Application → Service Workers
   - Click "Unregister" next to any service workers
   - Refresh page

2. **Disable Cache in DevTools:**
   - F12 → Network tab
   - Check "Disable cache" checkbox
   - Keep DevTools open and refresh

3. **Nuclear Option - Full Browser Reset:**
   - Close ALL browser windows
   - Clear all browsing data (Ctrl + Shift + Delete → Everything)
   - Restart browser
   - Visit dashboard in fresh session

## Prevention
To avoid this in future:
- Always use **Ctrl + Shift + R** after deployments
- Keep Developer Tools open with "Disable cache" checked during testing
- Use incognito mode for critical testing after deployments
