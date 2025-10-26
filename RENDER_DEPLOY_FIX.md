# 🚀 Render Deployment Fix

## ✅ What Was Fixed

The Render build was failing because:
- Build command output was being interpreted as shell commands
- Missing proper configuration file

## ✅ What's Been Added

1. **render.yaml** - Proper Render configuration file
2. **backend/package.json** - Added build script
3. **Updated documentation** - Clear Render setup instructions

---

## 🎯 Deploy Backend to Render (FIXED)

### Step 1: Go to Render
1. Visit: https://render.com
2. Sign in with GitHub (or create account)

### Step 2: Create Web Service
1. Click "New +" button
2. Select "Web Service"
3. Select `codebattle` repository
4. Click "Connect"

### Step 3: Configure Service
Render will auto-detect `render.yaml` configuration. If not:

- **Name**: `codebattle-api`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Root Directory**: Leave empty
- **Region**: Choose closest to you
- **Plan**: Free tier

### Step 4: Add Environment Variables
Click "Environment" and add these variables:

```
MONGODB_URI
mongodb+srv://username:password@cluster.mongodb.net/codebattle

JWT_SECRET
your-super-secret-jwt-key-minimum-32-characters-long

GROQ_API_KEY
gsk_your_groq_api_key_here

GEMINI_API_KEY
your_gemini_api_key_here

NODE_ENV
production
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (2-5 minutes)
3. Check logs for success
4. Copy the URL (e.g., `https://codebattle-api.onrender.com`)

---

## ✅ Verify Backend is Running

Test the health endpoint:

```bash
curl https://codebattle-api.onrender.com/api/health
```

Expected response:
```json
{ "status": "Server is running" }
```

---

## 🆘 If Deployment Fails

### Check Render Logs
1. Go to your Render dashboard
2. Click on `codebattle-api` service
3. Go to "Logs" tab
4. Look for error messages

### Common Issues

**Issue**: `bash: line 1: added: command not found`
- **Cause**: Build command output being interpreted as shell
- **Fix**: Already fixed in render.yaml ✅

**Issue**: `Cannot find module 'express'`
- **Cause**: Dependencies not installed
- **Fix**: Ensure `cd backend && npm install` runs first

**Issue**: `MongoDB connection error`
- **Cause**: MONGODB_URI not set or incorrect
- **Fix**: Verify environment variable in Render dashboard

**Issue**: `Port already in use`
- **Cause**: PORT environment variable conflict
- **Fix**: Render automatically assigns port, don't set PORT=5000

---

## 📊 What render.yaml Does

```yaml
services:
  - type: web                    # Web service (not worker)
    name: codebattle-api         # Service name
    env: node                    # Node.js environment
    plan: free                   # Free tier
    buildCommand: cd backend && npm install    # Build step
    startCommand: cd backend && npm start      # Start step
    envVars:                     # Environment variables
      - key: MONGODB_URI
        scope: run               # Available at runtime
      - key: JWT_SECRET
        scope: run
      - key: GROQ_API_KEY
        scope: run
      - key: GEMINI_API_KEY
        scope: run
      - key: NODE_ENV
        value: production        # Fixed value
      - key: PORT
        value: 5000              # Fixed port
```

---

## 🔄 Redeploy After Fix

If you already have a failed deployment:

1. Go to Render dashboard
2. Click on `codebattle-api` service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for build to complete

---

## ✨ Next Steps

1. ✅ Deploy backend to Render
2. Copy backend URL
3. Deploy frontend to Vercel with `VITE_API_URL=<backend-url>/api`
4. Setup MongoDB Atlas
5. Test the app

---

## 📞 Need Help?

- Check Render logs for specific errors
- Verify all environment variables are set
- Ensure MongoDB connection string is correct
- Test backend health endpoint

---

## 🎉 Success!

Once deployed, your backend will be live at:
```
https://codebattle-api.onrender.com
```

Use this URL in your frontend's `VITE_API_URL` environment variable!

