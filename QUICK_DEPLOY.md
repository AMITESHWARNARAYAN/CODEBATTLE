# 🚀 Quick Deploy Checklist

## ✅ What's Ready

- ✅ Code pushed to GitHub
- ✅ Frontend configured for Vercel
- ✅ Backend configured for Render
- ✅ vercel.json updated
- ✅ DEPLOYMENT_GUIDE.md created

---

## 📋 Deploy in 3 Steps

### Step 1: Deploy Backend to Render (5 minutes)

1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select `codebattle` repository
5. Configure:
   - **Name**: `codebattle-api`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
6. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key
   GROQ_API_KEY=gsk_...
   GEMINI_API_KEY=AIza...
   NODE_ENV=production
   ```
7. Click "Create Web Service"
8. **Copy the URL** (e.g., `https://codebattle-api.onrender.com`)

### Step 2: Deploy Frontend to Vercel (5 minutes)

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Select `codebattle` repository
5. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
6. Add Environment Variable:
   ```
   VITE_API_URL=https://codebattle-api.onrender.com/api
   ```
   (Use your Render backend URL)
7. Click "Deploy"
8. Wait for build to complete

### Step 3: Setup MongoDB Atlas (5 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up with email
3. Create cluster (M0 Free tier)
4. Click "Connect" → "Drivers"
5. Copy connection string
6. Replace `<password>` and database name
7. Use in both Render and local development

---

## 🔑 Get API Keys (5 minutes)

### Groq API Key
- Go to: https://console.groq.com
- Sign up
- Go to "API Keys"
- Create new key

### Gemini API Key
- Go to: https://aistudio.google.com/app/apikeys
- Sign in with Google
- Create API key

---

## ✅ Verify Deployment

### Test Backend
```
https://codebattle-api.onrender.com/api/health
```

Should return: `{ "status": "Server is running" }`

### Test Frontend
```
https://codebattle.vercel.app
```

Should load the app. Login with:
- Email: `admin@codebattle.com`
- Password: `admin123456`

---

## 📊 Final URLs

- **Frontend**: https://codebattle.vercel.app
- **Backend**: https://codebattle-api.onrender.com/api
- **GitHub**: https://github.com/AMITESHWARNARAYAN/codebattle

---

## 🆘 If Something Goes Wrong

### Backend Not Starting
- Check Render logs
- Verify environment variables
- Ensure MongoDB connection string is correct

### Frontend Build Fails
- Check Vercel build logs
- Verify VITE_API_URL is set correctly
- Ensure all dependencies are installed

### API Calls Failing
- Verify VITE_API_URL points to correct backend
- Check CORS is enabled in backend
- Verify MongoDB connection

---

## 📖 Full Guide

For detailed instructions, see: `DEPLOYMENT_GUIDE.md`

---

## 🎉 You're Done!

Your CodeBattle app is now live! 🚀

Total time: ~15 minutes

