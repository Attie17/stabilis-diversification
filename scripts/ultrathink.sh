#!/bin/bash
# === ULTRATHINK PRE-BUILD SCRIPT ===
ULTRA_FILE="$(git rev-parse --show-toplevel 2>/dev/null || pwd)/ULTRATHINK.md"

if [ -f "$ULTRA_FILE" ]; then
  clear
  echo "------------------------------------------------------------"
  echo " 🧠  ENTERING ULTRATHINK MODE"
  echo "------------------------------------------------------------"
  cat "$ULTRA_FILE"
  echo -e "\n>>> Mindset engaged. Building with precision, grace, and intent...\n"
else
  echo "⚠️  ULTRATHINK.md not found at repo root."
  exit 1
fi
