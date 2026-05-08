# PlayArena.fun (Vercel Ready)

This project is configured to deploy on **Vercel** as:
- **React (Vite) frontend**
- **Vercel Serverless Functions backend** under `/api`

## What was fixed
- ✅ **Refresh 404 fixed** for routes like `/games`, `/profile`, etc. (SPA rewrites)
- ✅ Switched routing to **history mode** (no `#` in URL)
- ✅ Fixed asset loading on deep routes by using an **absolute Vite base**
- ✅ Removed lockfile conflict (kept `package-lock.json`, removed `pnpm-lock.yaml`)
- ✅ Added a sample backend endpoint: `GET /api/health`

## Local run

### Frontend dev
```bash
npm install
npm run dev
```

### Production build
```bash
npm run build
npm run preview
```

## Deploy to Vercel
1. Push to GitHub
2. Import the repo in Vercel
3. Build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

After deploy:
- Website: `/`
- API health check: `/api/health`
