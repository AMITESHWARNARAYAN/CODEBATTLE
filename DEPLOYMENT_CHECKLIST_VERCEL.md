# CodeBattle Vercel Deployment Checklist

## Pre-Deployment Steps

### 1. Git Setup ✅
- [ ] Install Git from https://git-scm.com
- [ ] Configure git user: `git config --global user.name "Your Name"`
- [ ] Configure git email: `git config --global user.email "your@email.com"`
- [ ] Verify: `git --version`

### 2. GitHub Repository ✅
- [ ] Create new repository on GitHub
- [ ] Copy repository URL (HTTPS)
- [ ] Do NOT initialize with README/gitignore

### 3. Local Git Setup ✅
- [ ] Navigate to project: `cd C:\Users\amitu\OneDrive\Desktop\Projects`
- [ ] Initialize git: `git init`
- [ ] Add remote: `git remote add origin https://github.com/USERNAME/REPO.git`
- [ ] Verify: `git remote -v`

### 4. Code Preparation ✅
- [ ] Ensure `.gitignore` exists and is correct
- [ ] Remove sensitive files from git tracking
- [ ] Verify `vercel.json` exists
- [ ] Check `frontend/package.json` has build script
- [ ] Check `backend/package.json` has all dependencies

### 5. Environment Variables ✅
- [ ] Create `.env.production` in backend folder
- [ ] Add `MONGODB_URI` (production MongoDB)
- [ ] Add `JWT_SECRET` (secure random string)
- [ ] Add `GROQ_API_KEY` (from Groq console)
- [ ] Add `GEMINI_API_KEY` (from Google AI Studio)
- [ ] Ensure `.env` files are in `.gitignore`

### 6. Code Quality ✅
- [ ] Run `npm run dev` in backend - no errors
- [ ] Run `npm run dev` in frontend - no errors
- [ ] Test all features locally
- [ ] Check console for warnings/errors
- [ ] Verify API endpoints work

### 7. Git Commit ✅
- [ ] Stage all files: `git add .`
- [ ] Create commit: `git commit -m "Initial commit: CodeBattle MERN app"`
- [ ] Verify: `git log` shows your commit

### 8. Push to GitHub ✅
- [ ] Push to main: `git push -u origin main`
- [ ] Verify files on GitHub.com
- [ ] Check all code is visible

---

## Vercel Deployment Steps

### 1. Vercel Account ✅
- [ ] Create account at https://vercel.com
- [ ] Sign in with GitHub
- [ ] Authorize Vercel to access GitHub

### 2. Create Vercel Project ✅
- [ ] Click "New Project"
- [ ] Select your `codebattle` repository
- [ ] Click "Import"

### 3. Configure Build Settings ✅
- [ ] Framework: Select "Other"
- [ ] Build Command: `cd frontend && npm run build`
- [ ] Output Directory: `frontend/dist`
- [ ] Install Command: `npm install`

### 4. Environment Variables ✅
- [ ] Add `MONGODB_URI`: Your production MongoDB connection string
- [ ] Add `JWT_SECRET`: Secure random string (min 32 chars)
- [ ] Add `GROQ_API_KEY`: Your Groq API key
- [ ] Add `GEMINI_API_KEY`: Your Gemini API key
- [ ] Add `VITE_API_URL`: Your backend API URL (e.g., https://your-backend.vercel.app/api)
- [ ] Add `NODE_ENV`: `production`

### 5. Deploy ✅
- [ ] Click "Deploy"
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Check deployment logs for errors
- [ ] Verify deployment URL works

### 6. Post-Deployment Testing ✅
- [ ] Visit your Vercel URL
- [ ] Test login functionality
- [ ] Test admin panel
- [ ] Create a test category
- [ ] Create a test problem
- [ ] Browse problems page
- [ ] Test problem search/filter
- [ ] Test code editor
- [ ] Test timer toggle
- [ ] Check console for errors

---

## Backend Deployment (Optional - for API)

### Option 1: Deploy Backend Separately
- [ ] Create new Vercel project for backend
- [ ] Set root directory to `backend`
- [ ] Add environment variables
- [ ] Deploy
- [ ] Update `VITE_API_URL` in frontend

### Option 2: Use MongoDB Atlas + Vercel Functions
- [ ] Set up MongoDB Atlas (free tier available)
- [ ] Create database and user
- [ ] Copy connection string
- [ ] Add to Vercel environment variables

---

## Troubleshooting

### Build Fails
- [ ] Check build logs in Vercel dashboard
- [ ] Verify all dependencies are in package.json
- [ ] Ensure no hardcoded paths
- [ ] Check for missing environment variables

### API Errors
- [ ] Verify MongoDB connection string
- [ ] Check API endpoints in browser console
- [ ] Verify CORS settings
- [ ] Check backend logs

### Frontend Not Loading
- [ ] Clear browser cache
- [ ] Check Vercel deployment logs
- [ ] Verify build output directory
- [ ] Check for 404 errors

### Authentication Issues
- [ ] Verify JWT_SECRET is set
- [ ] Check token expiration
- [ ] Verify CORS headers
- [ ] Check localStorage in browser

---

## Post-Deployment

### 1. Monitor Performance ✅
- [ ] Check Vercel Analytics
- [ ] Monitor error rates
- [ ] Check response times

### 2. Set Up Custom Domain (Optional) ✅
- [ ] Go to Vercel Project Settings
- [ ] Add custom domain
- [ ] Update DNS records
- [ ] Verify SSL certificate

### 3. Enable Auto-Deployments ✅
- [ ] Vercel auto-deploys on push to main
- [ ] Verify in Project Settings
- [ ] Test by pushing a small change

### 4. Backup & Security ✅
- [ ] Backup MongoDB data regularly
- [ ] Rotate API keys periodically
- [ ] Enable 2FA on GitHub
- [ ] Enable 2FA on Vercel

---

## Quick Commands Reference

```powershell
# Git commands
git init
git add .
git commit -m "message"
git push origin main
git log
git status

# Check if everything is ready
git remote -v
npm run build
npm run dev
```

---

## Important Notes

⚠️ **Critical:**
- Never commit `.env` files
- Use strong JWT_SECRET (min 32 characters)
- Keep API keys secure
- Use production MongoDB URI
- Test thoroughly before deploying

✅ **Best Practices:**
- Use semantic commit messages
- Deploy to staging first
- Monitor logs after deployment
- Keep dependencies updated
- Regular backups of database

---

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Git Docs: https://git-scm.com/doc
- GitHub Docs: https://docs.github.com
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Groq API: https://console.groq.com

---

**Status: Ready for Deployment** ✅

