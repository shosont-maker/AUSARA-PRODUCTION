
# AUSARA PRODUCTION (Full)

Production planner (vanilla JS + Tailwind) with Firebase Firestore persistence.

## Deploy (GitHub Pages)
1. Push the folder contents to a repo named `AUSARA-PRODUCTION`.
2. In GitHub: **Settings → Pages** → Source: `main` and Folder: `/ (root)` → Save.
3. Open `https://USERNAME.github.io/AUSARA-PRODUCTION/`

## Firebase
- Config is in `scripts/firebase.js` (already filled).
- Data stored at Firestore doc: `ausara_planner/state_default`.
- The app mirrors data to localStorage for offline use.
- On first load (if Firestore empty), it seeds from any existing localStorage data.

## Local dev
Open `index.html` directly in a browser. Without Firebase present, it will still render and use localStorage only.
