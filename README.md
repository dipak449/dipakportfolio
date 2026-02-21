# Rabina Portfolio (MERN + Admin CMS)

Production portfolio with:
- Public website (Home, About, Service, Project, Blog, Contact, Certifications)
- Admin CMS for dynamic content management
- Node/Express API + MongoDB + Cloudinary

## 1) Project Structure

- `frontend/` React app (CRA)
- `backend/` Express API
- `render.yaml` Render deployment config for backend

## 2) Local Setup

### Backend

```powershell
cd backend
npm install
copy .env.example .env
npm run dev
```

### Frontend

```powershell
cd frontend
npm install
copy .env.example .env
npm start
```

Default local URLs:
- Frontend: `http://localhost:3001`
- Backend: `http://localhost:8001`

## 3) Required Environment Variables

### Backend (`backend/.env`)

- `NODE_ENV=production`
- `PORT=8001`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `CORS_ORIGINS=https://dynamic-portfolio-website-with-cms.vercel.app`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`
- Optional: `DNS_SERVERS=1.1.1.1,8.8.8.8`

### Frontend (`frontend/.env`)

- `REACT_APP_API_URL=https://rabina-portfolio-api.onrender.com/api`
- `REACT_APP_SITE_URL=https://dynamic-portfolio-website-with-cms.vercel.app`

`robots.txt` and `sitemap.xml` are auto-generated at build time from `REACT_APP_SITE_URL`.

## 4) Hosting (Your Setup)

## Backend on Render

1. Push repo to GitHub.
2. In Render: New + Blueprint, select this repo.
3. `render.yaml` will create backend service automatically.
4. Set backend environment variables from section 3.
5. Deploy and verify:
   - `https://rabina-portfolio-api.onrender.com/api/health`

## Frontend on Vercel

1. Import project from GitHub.
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Add frontend environment variables:
   - `REACT_APP_SITE_URL=https://dynamic-portfolio-website-with-cms.vercel.app` (or your custom domain)
   - `REACT_APP_API_URL=https://rabina-portfolio-api.onrender.com/api`
5. Deploy.

`frontend/vercel.json` already includes SPA rewrite + security headers.
`npm run build` auto-generates `robots.txt` and `sitemap.xml` from `REACT_APP_SITE_URL`.

Important:
- Keep frontend root directory as `frontend` in Vercel.
- If `/admin/login` shows Vercel 404, confirm `frontend/vercel.json` exists and redeploy.

## 5) Pre-Go-Live Checklist

- Backend `CORS_ORIGINS` includes your Vercel production domain.
- If you want preview deployments to work, set:
  - `CORS_ALLOW_VERCEL_PREVIEWS=true`
- `JWT_SECRET` is long/random.
- MongoDB user is least-privilege.
- Cloudinary credentials are production keys.
- `REACT_APP_API_URL` points to production backend `/api`.
- `REACT_APP_SITE_URL` matches frontend production domain.
- Verify admin login and all CMS sections.
- Verify resume download and certification pages.
- Verify contact form message submission.
- Verify API health endpoint:
  - `https://rabina-portfolio-api.onrender.com/api/health`

## 6) Security and Performance Notes

- Backend already includes:
  - security headers
  - request body limits
  - auth/contact route limits
  - global API rate limit
  - no-store cache policy on sensitive admin/auth endpoints
- Frontend build is optimized via `react-scripts build`.

Note: `npm audit` issues in frontend are mainly from CRA (`react-scripts`) transitive dependencies. Full elimination typically requires migration from CRA to Vite/Next.
