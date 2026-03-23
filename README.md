# Train — 8-Week Training App

A full PWA training tracker. Deploy free to Netlify → add to iPhone home screen → works fully offline.

---

## Deploy to iPhone (15 min, one-time setup)

### 1 — Install Node.js
Download from https://nodejs.org (LTS). Install it.

### 2 — Install & build
```bash
cd path/to/training-app
npm install
npm run build
```
Creates a `build/` folder — that's your app ready to go.

### 3 — Deploy to Netlify (free)
1. Go to https://netlify.com → sign up free
2. Drag and drop the `build/` folder onto the Netlify dashboard
3. Get a live URL like `https://amazing-app-123.netlify.app`
4. Optional: rename it in Domain settings

### 4 — Add to iPhone home screen
1. Open **Safari** on iPhone (must be Safari)
2. Go to your Netlify URL
3. Tap Share (box with arrow) → "Add to Home Screen"
4. Name it **Train** → Add

Lives on your home screen, works offline, saves data locally. Done.

---

## Updating the plan
1. Get updated `src/planData.js`
2. Replace the file
3. `npm run build`
4. Drag new `build/` folder to Netlify

Your logged data is never affected by updates.

---

## Features
- Home: today's session, progress ring, streak counter
- Plan: all 8 weeks, full session details
- Edit: tap any stat to adjust distances/pace for friend runs
- Log: mark complete, log actual pace + HR
- Progress: PBs, logged runs, 8-week projections
- Offline: works with no internet after first load
