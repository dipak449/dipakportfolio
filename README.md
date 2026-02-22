# Dipak Portfolio (MERN + Admin CMS)

Production-ready portfolio with:
- Public website (Home, About, Resume, Service, Project, Blog, Contact)
- Admin CMS for dynamic content updates
- Node/Express API + MongoDB + Cloudinary

## Project structure
- `frontend/` React app (CRA)
- `backend/` Express API
- `render.yaml` Render backend blueprint config

## Local setup

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
- Frontend: `http://localhost:3002`
- Backend: `http://localhost:8002`

## Environment variables

### Backend (`backend/.env`)
Required:
- `NODE_ENV=production`
- `PORT=8002`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `ADMIN_SETUP_KEY=...`
- `CORS_ORIGINS=https://your-frontend-domain.com,http://localhost:3002`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`

Optional:
- `DNS_SERVERS=1.1.1.1,8.8.8.8`
- `CORS_ALLOW_VERCEL_PREVIEWS=true`

### Frontend (`frontend/.env`)
- `REACT_APP_API_URL=https://your-backend-domain.com/api`
- `REACT_APP_SITE_URL=https://your-frontend-domain.com`

Note: `robots.txt` and `sitemap.xml` are generated during frontend build from `REACT_APP_SITE_URL`.

## Deployment

### Backend (Render)
1. Push repository to GitHub.
2. In Render, create Blueprint from this repo.
3. `render.yaml` will create backend service.
4. Set backend env vars in Render dashboard.
5. Verify health endpoint:
   - `https://your-backend-domain.com/api/health`

### Frontend (Vercel)
1. Import repo in Vercel.
2. Set root directory to `frontend`.
3. Build command: `npm run build`
4. Add frontend env vars:
   - `REACT_APP_SITE_URL=https://your-frontend-domain.com`
   - `REACT_APP_API_URL=https://your-backend-domain.com/api`
5. Deploy.

## Go-live checklist
- Backend CORS includes your production frontend domain.
- `JWT_SECRET` and `ADMIN_SETUP_KEY` are strong/random.
- MongoDB user has least privilege.
- Cloudinary credentials are production keys.
- Admin login, Resume, Contact form, and Project pages are tested.
- API health endpoint responds in production.
