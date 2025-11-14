# 🚀 VS Code Quick Reference for Stabilis Project

## 📌 Your New Features - What They Do

### 1. **Live Server** 🌐
- **What it does:** Opens your HTML files in a browser that auto-refreshes when you save
- **How to use:** Right-click any `.html` file → "Open with Live Server"
- **Port:** Runs on http://localhost:5500
- **Benefit:** Test your Turnaround/Diversification/Wellness pages instantly

### 2. **Git Version Control** 📦
- **What it does:** Tracks every change you make, creates restore points
- **Status:** ✅ Initialized in your project
- **Next step:** Make your first commit (save snapshot of current work)
- **Benefit:** Undo mistakes, see history, never lose work

### 3. **Auto-Save** 💾
- **What it does:** Saves files automatically 500ms after you stop typing
- **Status:** ✅ Enabled
- **Benefit:** Never lose work from forgetting to save

### 4. **Format on Save** ✨
- **What it does:** Automatically indents and cleans up code when you save
- **Status:** ✅ Enabled
- **Benefit:** Professional-looking code without manual cleanup

### 5. **Todo Tree** 🌲
- **What it does:** Finds all TODO/FIXME/NOTE comments and lists them in sidebar
- **How to use:** Click the tree icon in left sidebar
- **Benefit:** Track incomplete work across all files

### 6. **Material Icons** 🎨
- **What it does:** Shows colorful icons for different file types
- **Status:** ✅ Active
- **Benefit:** Quickly identify .html, .js, .md files visually

### 7. **Code Snippets** ⚡
- **What it does:** Type shortcuts to insert templates
- **Available snippets:**
  - `milestone` → Full milestone structure
  - `phase` → New phase with milestones array
  - `team` → Team member object
  - `copilot` → AI guidance structure
  - `revenue` → Revenue stream object
  - `todo` → TODO comment
  - `fix` → FIXME comment
- **How to use:** Type prefix (e.g., "milestone") then press **Tab**
- **Benefit:** Add milestones in 10 seconds instead of 5 minutes

---

## ⌨️ Essential Keyboard Shortcuts

### Multi-Cursor Editing (Edit Multiple Lines at Once)
- **Alt + Click** → Add cursor at each click position
- **Ctrl + Alt + ↓/↑** → Add cursor above/below current line
- **Ctrl + D** → Select next occurrence of current word
- **Ctrl + Shift + L** → Select all occurrences of current word
- **Example:** Change "owner: TBD" in 10 places at once

### Navigation
- **Ctrl + P** → Quick open file (type filename)
- **Ctrl + Shift + F** → Search across all files
- **Ctrl + G** → Go to line number
- **Alt + ← / →** → Navigate back/forward in edit history

### Code Editing
- **Alt + ↑/↓** → Move line up/down
- **Shift + Alt + ↓/↑** → Duplicate line above/below
- **Ctrl + /** → Toggle comment on/off
- **Ctrl + Shift + K** → Delete entire line
- **Ctrl + Enter** → Insert line below (without breaking current line)

### Selection
- **Ctrl + A** → Select all
- **Shift + Alt + →** → Expand selection to next logical block
- **Shift + Alt + ←** → Shrink selection

### Sidebar & Panels
- **Ctrl + B** → Toggle sidebar (hide/show file explorer)
- **Ctrl + `** → Toggle terminal panel
- **Ctrl + J** → Toggle bottom panel (problems, output, etc.)

### Save & Format
- **Ctrl + S** → Save file (also triggers auto-format)
- **Ctrl + K, S** → Save all open files
- **Shift + Alt + F** → Format document manually

### Search & Replace
- **Ctrl + F** → Find in current file
- **Ctrl + H** → Find and replace in current file
- **Ctrl + Shift + H** → Find and replace across all files
- **F3 / Shift + F3** → Next/previous search result

---

## 🎯 Common Tasks - How To

### **Task: Test Your Project in Browser**
1. Open `landing.html` in editor
2. Right-click anywhere in the file
3. Select "Open with Live Server"
4. Browser opens automatically at http://localhost:5500
5. Edit any file and save → browser refreshes automatically

### **Task: Add a New Milestone Quickly**
1. Open `wellness-data.js` (or any -data.js file)
2. Position cursor where you want new milestone
3. Type: `milestone`
4. Press **Tab**
5. Template appears with cursor at first field
6. Fill in details, press **Tab** to jump between fields

### **Task: Find All TODOs in Project**
1. Click the tree icon in left sidebar (Todo Tree)
2. See all TODO/FIXME comments across all files
3. Click any item to jump to that location

### **Task: Change Same Word in Multiple Places**
1. Select the word (double-click)
2. Press **Ctrl + D** repeatedly to select more occurrences
3. Type replacement → changes all at once

### **Task: Save Current Work as Restore Point (Git Commit)**
```powershell
# In terminal (Ctrl + `)
git add .
git commit -m "Describe what you changed"
```

### **Task: See What Changed Since Last Commit**
1. Click Source Control icon (3rd icon in left sidebar)
2. See list of changed files
3. Click any file to see red/green diff

### **Task: Undo a Mistake (Go Back to Last Commit)**
```powershell
# In terminal - discard all changes since last commit
git reset --hard HEAD
```

---

## 🔧 Customization Options

### Change Font Size
- Press **Ctrl + +** to zoom in
- Press **Ctrl + -** to zoom out
- Or: File → Preferences → Settings → search "font size"

### Change Color Theme
- Press **Ctrl + K, Ctrl + T**
- Browse themes, arrow keys to preview
- Enter to select

### Change Icon Theme
- File → Preferences → File Icon Theme
- Select "Material Icon Theme" (already installed)

---

## 💡 Pro Tips for Your Stabilis Project

1. **Use Multiple Editors Side-by-Side**
   - Drag a file tab to the right → splits editor
   - Example: View `wellness-data.js` and `wellness-copilot.js` together

2. **Quick File Switching**
   - **Ctrl + P** → type "weln" → opens wellness files
   - **Ctrl + Tab** → cycle through recently opened files

3. **Fold/Unfold Code Sections**
   - Click the `-` or `+` icons next to line numbers
   - Collapse phases you're not working on

4. **Markdown Preview**
   - Open any `.md` file (like revenue projections)
   - Press **Ctrl + Shift + V** → see formatted preview
   - Or click the preview icon (top-right)

5. **Problems Panel**
   - **Ctrl + Shift + M** → see syntax errors
   - Errors show before you test in browser

6. **Peek Definition**
   - **Alt + F12** on a function name → see definition in popup
   - Don't have to open the file

---

## 📚 Learning Resources

- **VS Code Docs:** https://code.visualstudio.com/docs
- **Keyboard Shortcuts PDF:** Help → Keyboard Shortcut Reference
- **Interactive Playground:** Help → Welcome → Interactive Playground

---

## 🆘 Need Help?

Ask me anytime! Example questions:
- "How do I change multiple milestone owners at once?"
- "How do I add a new revenue stream to all phases?"
- "How do I see what I changed yesterday?"
- "Can you show me how to use X feature?"

Just describe what you want to do, and I'll guide you step-by-step! 🚀
