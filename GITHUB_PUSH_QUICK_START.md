# Quick Start: Push to GitHub & Deploy to Vercel

## 🚀 5-Minute Quick Start

### Step 1: Install Git (2 minutes)
1. Download: https://git-scm.com/download/win
2. Run installer with default options
3. **Restart PowerShell**

### Step 2: Create GitHub Repository (1 minute)
1. Go to https://github.com/new
2. Name: `codebattle`
3. Click "Create repository"
4. **Copy the HTTPS URL** (looks like: `https://github.com/YOUR_USERNAME/codebattle.git`)

### Step 3: Push Code to GitHub (2 minutes)

Open PowerShell and run these commands:

```powershell
# Navigate to project
cd "C:\Users\amitu\OneDrive\Desktop\Projects"

# Initialize git (one time only)
git init

# Configure git (one time only)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/codebattle.git

# Stage all files
git add .

# Create commit
git commit -m "Initial commit: CodeBattle MERN application"

# Push to GitHub
git branch -M main
git push -u origin main
```

**When prompted for password:** Use your GitHub Personal Access Token (not your password)
- Create token: https://github.com/settings/tokens
- Select: `repo` and `workflow` scopes
- Copy and paste as password

---

## ✅ Verify Push Success

1. Go to https://github.com/YOUR_USERNAME/codebattle
2. You should see all your files
3. Check that `.env` files are NOT visible (they should be in .gitignore)

---

## 🌐 Deploy to Vercel (5 minutes)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

### Step 2: Create New Project
1. Click "New Project"
2. Select your `codebattle` repository
3. Click "Import"

### Step 3: Configure Build
- **Framework**: Other
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```
MONGODB_URI = your_mongodb_connection_string
JWT_SECRET = your_secure_random_string_min_32_chars
GROQ_API_KEY = your_groq_api_key
GEMINI_API_KEY = your_gemini_api_key
VITE_API_URL = https://your-backend-url/api
NODE_ENV = production
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait 5-10 minutes
3. You'll get a URL like: `https://codebattle-xyz.vercel.app`

---

## 🔑 Getting Your API Keys

### MongoDB URI
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### JWT Secret
Generate a random string (min 32 characters):
```
openssl rand -base64 32
```
Or use: `your-super-secret-key-min-32-characters-long-12345`

### Groq API Key
1. Go to https://console.groq.com
2. Create account
3. Generate API key
4. Copy and save

### Gemini API Key
1. Go to https://aistudio.google.com/app/apikeys
2. Create API key
3. Copy and save

---

## 🧪 Test Your Deployment

After Vercel deployment completes:

1. Visit your Vercel URL
2. Test login (admin@codebattle.com / admin123456)
3. Go to Admin Panel
4. Create a test category
5. Create a test problem
6. Go to Problems page
7. Browse categories
8. Search and filter problems
9. Click a problem to open editor
10. Test timer toggle

---

## 📝 Future Updates

After making changes locally:

```powershell
cd "C:\Users\amitu\OneDrive\Desktop\Projects"
git add .
git commit -m "Your change description"
git push origin main
```

Vercel will automatically redeploy! ✨

---

## ⚠️ Important Notes

1. **Never commit `.env` files** - they're in .gitignore
2. **Use strong JWT_SECRET** - minimum 32 characters
3. **Keep API keys secret** - don't share them
4. **Test locally first** - before pushing
5. **Monitor Vercel logs** - check for errors after deploy

---

## 🆘 Troubleshooting

### Git command not found
- Restart PowerShell after installing Git
- Or use full path: `C:\Program Files\Git\bin\git.exe`

### Authentication failed
- Use Personal Access Token, not password
- Create at: https://github.com/settings/tokens

### Vercel build fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

### API not working
- Check backend logs in Vercel
- Verify VITE_API_URL is correct
- Check MongoDB connection

---

## 📚 Full Documentation

For detailed information, see:
- `GITHUB_DEPLOYMENT_GUIDE.md` - Complete guide
- `DEPLOYMENT_CHECKLIST_VERCEL.md` - Full checklist
- `README.md` - Project overview

---

**You're all set! 🎉**

Your CodeBattle app will be live on Vercel in minutes!

