# CodeBattle Deployment Guide

## 🎯 Deployment Architecture

CodeBattle is a MERN application with separate frontend and backend:

- **Frontend**: React + Vite → Deploy to **Vercel**
- **Backend**: Express + Node.js → Deploy to **Render.com** (or Railway)
- **Database**: MongoDB Atlas (Cloud)

---

## 📋 Prerequisites

Before deploying, you need:

1. **GitHub Repository** ✅ (Already done)
2. **MongoDB Atlas Account** (Free tier available)
3. **Render.com Account** (Free tier available)
4. **Vercel Account** (Free tier available)
5. **API Keys**:
   - Groq API Key
   - Gemini API Key

---

## 🚀 Step 1: Deploy Backend to Render.com

### 1.1 Create Render Account
1. Go to: https://render.com
2. Sign up with GitHub
3. Authorize Render

### 1.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Select your `codebattle` GitHub repository
3. Click "Connect"

### 1.3 Configure Service
- **Name**: `codebattle-api`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Root Directory**: Leave empty (Render will auto-detect from render.yaml)
- **Region**: Choose closest to you
- **Plan**: Free tier is fine for testing

### 1.4 Add Environment Variables
Click "Environment" and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codebattle
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
GROQ_API_KEY=gsk_your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
PORT=5000
```

### 1.5 Deploy
- Click "Create Web Service"
- Wait for deployment (2-5 minutes)
- Copy the URL (e.g., `https://codebattle-api.onrender.com`)

---

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Go to Vercel
1. Go to: https://vercel.com
2. Sign in with GitHub

### 2.2 Import Project
1. Click "New Project"
2. Select `codebattle` repository
3. Click "Import"

### 2.3 Configure Build Settings
- **Framework**: Other
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`

### 2.4 Add Environment Variables
Click "Environment Variables" and add:

```
VITE_API_URL=https://codebattle-api.onrender.com/api
```

(Replace with your actual Render backend URL)

### 2.5 Deploy
- Click "Deploy"
- Wait for build (2-5 minutes)
- Your app is live! 🎉

---

## 🗄️ Step 3: Setup MongoDB Atlas

### 3.1 Create Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up with email or Google
3. Create organization

### 3.2 Create Cluster
1. Click "Create" → "Cluster"
2. Choose "M0 Free" tier
3. Select region closest to you
4. Click "Create Cluster"
5. Wait for deployment (5-10 minutes)

### 3.3 Get Connection String
1. Click "Connect"
2. Choose "Drivers"
3. Copy connection string
4. Replace `<password>` with your password
5. Replace `myFirstDatabase` with `codebattle`

Example:
```
mongodb+srv://admin:password123@cluster0.mongodb.net/codebattle
```

---

## 🔑 Step 4: Get API Keys

### Groq API Key
1. Go to: https://console.groq.com
2. Sign up or login
3. Go to "API Keys"
4. Click "Create New API Key"
5. Copy the key (starts with `gsk_`)

### Gemini API Key
1. Go to: https://aistudio.google.com/app/apikeys
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (starts with `AIza`)

---

## ✅ Verify Deployment

### Test Backend
```
https://codebattle-api.onrender.com/api/health
```

Should return:
```json
{ "status": "Server is running" }
```

### Test Frontend
```
https://codebattle.vercel.app
```

Should load the app. Try logging in with:
- Email: `admin@codebattle.com`
- Password: `admin123456`

---

## 🆘 Troubleshooting

### Backend Not Starting
- Check Render logs
- Verify environment variables
- Ensure MongoDB connection string is correct

### Frontend Build Fails
- Check Vercel build logs
- Verify VITE_API_URL is set
- Ensure frontend dependencies are installed

### API Calls Failing
- Verify VITE_API_URL points to correct backend
- Check CORS settings in backend
- Verify MongoDB connection

### Login Not Working
- Check JWT_SECRET is set
- Verify MongoDB connection
- Clear browser cache

---

## 📊 Final URLs

After deployment, you'll have:

- **Frontend**: https://codebattle.vercel.app
- **Backend API**: https://codebattle-api.onrender.com/api
- **Database**: MongoDB Atlas (Cloud)

---

## 🎉 Done!

Your CodeBattle app is now fully deployed and live! 🚀

**Repository**: https://github.com/AMITESHWARNARAYAN/codebattle
**Frontend**: https://codebattle.vercel.app
**Backend**: https://codebattle-api.onrender.com

Enjoy! 🎊

