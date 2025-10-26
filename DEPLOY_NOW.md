# 🚀 DEPLOY NOW - Step by Step

## ✅ What's Fixed

- ✅ Render build issue resolved
- ✅ render.yaml configuration added
- ✅ Backend build script added
- ✅ All documentation updated

---

## 📋 DEPLOYMENT CHECKLIST

### ✅ BEFORE YOU START

Get these ready:

1. **MongoDB Connection String**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/codebattle`

2. **API Keys**
   - Groq: https://console.groq.com (starts with `gsk_`)
   - Gemini: https://aistudio.google.com/app/apikeys (starts with `AIza`)

3. **JWT Secret**
   - Generate random string (min 32 characters)
   - Example: `your-super-secret-jwt-key-minimum-32-characters-long-1234567890`

---

## 🚀 STEP 1: Deploy Backend to Render (15 minutes)

### 1.1 Go to Render
- Visit: https://render.com
- Sign in with GitHub

### 1.2 Create Web Service
1. Click "New +" → "Web Service"
2. Select `codebattle` repository
3. Click "Connect"

### 1.3 Configure (Auto-detected from render.yaml)
- **Name**: `codebattle-api`
- **Environment**: Node
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Region**: Choose closest to you

### 1.4 Add Environment Variables
```
MONGODB_URI = mongodb+srv://...
JWT_SECRET = your-secret-key
GROQ_API_KEY = gsk_...
GEMINI_API_KEY = AIza...
NODE_ENV = production
```

### 1.5 Deploy
- Click "Create Web Service"
- Wait 2-5 minutes
- **Copy the URL** (e.g., `https://codebattle-api.onrender.com`)

### 1.6 Verify
```
https://codebattle-api.onrender.com/api/health
```
Should return: `{ "status": "Server is running" }`

---

## 🌐 STEP 2: Deploy Frontend to Vercel (15 minutes)

### 2.1 Go to Vercel
- Visit: https://vercel.com
- Sign in with GitHub

### 2.2 Import Project
1. Click "New Project"
2. Select `codebattle` repository
3. Click "Import"

### 2.3 Configure Build
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`

### 2.4 Add Environment Variable
```
VITE_API_URL = https://codebattle-api.onrender.com/api
```
(Use your Render backend URL from Step 1)

### 2.5 Deploy
- Click "Deploy"
- Wait 2-5 minutes
- Your app is live! 🎉

---

## ✅ STEP 3: Verify Everything Works

### 3.1 Test Backend
```
https://codebattle-api.onrender.com/api/health
```

### 3.2 Test Frontend
- Visit: https://codebattle.vercel.app
- Login with:
  - Email: `admin@codebattle.com`
  - Password: `admin123456`

### 3.3 Test Features
- [ ] Login works
- [ ] Can browse problems
- [ ] Can search problems
- [ ] Can open code editor
- [ ] Timer works

---

## 📊 FINAL URLS

After deployment:

| Service | URL |
|---------|-----|
| Frontend | https://codebattle.vercel.app |
| Backend | https://codebattle-api.onrender.com/api |
| GitHub | https://github.com/AMITESHWARNARAYAN/codebattle |

---

## 🆘 TROUBLESHOOTING

### Render Build Fails
- Check Render logs
- Verify environment variables
- Ensure MongoDB connection string is correct

### Vercel Build Fails
- Check Vercel logs
- Verify VITE_API_URL is set
- Ensure frontend dependencies are correct

### API Calls Failing
- Verify VITE_API_URL points to correct backend
- Check CORS is enabled
- Verify MongoDB connection

### Login Not Working
- Check JWT_SECRET is set
- Verify MongoDB connection
- Clear browser cache

---

## 📖 DETAILED GUIDES

- `RENDER_DEPLOY_FIX.md` - Render deployment details
- `DEPLOYMENT_GUIDE.md` - Complete step-by-step guide
- `QUICK_DEPLOY.md` - Quick checklist

---

## ⏱️ TOTAL TIME: ~40 minutes

- Backend deployment: 15 min
- Frontend deployment: 15 min
- Verification: 10 min

---

## 🎉 YOU'RE READY!

Your CodeBattle app is ready to deploy!

**Start with Step 1 above** ⬆️

Good luck! 🚀

