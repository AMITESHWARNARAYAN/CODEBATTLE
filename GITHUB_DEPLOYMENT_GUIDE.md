# GitHub Deployment Guide for CodeBattle

## Step 1: Install Git (if not already installed)

### Windows:
1. Download Git from: https://git-scm.com/download/win
2. Run the installer and follow the default options
3. Restart your terminal/PowerShell after installation

### Verify Git Installation:
```powershell
git --version
```

---

## Step 2: Create a GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `codebattle` (or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license
4. Click "Create repository"
5. Copy the repository URL (HTTPS or SSH)

---

## Step 3: Initialize Git in Your Project

Open PowerShell and navigate to your project directory:

```powershell
cd "C:\Users\amitu\OneDrive\Desktop\Projects"
```

Initialize git repository:

```powershell
git init
```

---

## Step 4: Configure Git (First Time Only)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Step 5: Create .gitignore File

Create a `.gitignore` file in the root directory with:

```
# Dependencies
node_modules/
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
.next/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Misc
.cache/
.parcel-cache/
```

---

## Step 6: Add Files to Git

```powershell
git add .
```

---

## Step 7: Create Initial Commit

```powershell
git commit -m "Initial commit: CodeBattle MERN application with LeetCode-style problems page"
```

---

## Step 8: Add Remote Repository

Replace `YOUR_GITHUB_USERNAME` and `REPO_NAME` with your actual values:

```powershell
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/REPO_NAME.git
```

Example:
```powershell
git remote add origin https://github.com/amitu/codebattle.git
```

---

## Step 9: Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

If prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Your GitHub personal access token (not your password)

### Create Personal Access Token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token"
3. Select scopes: `repo`, `workflow`
4. Copy the token and use it as password

---

## Step 10: Verify Push

Check your GitHub repository to confirm all files are pushed.

---

## Step 11: Prepare for Vercel Deployment

### Create `vercel.json` in root directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/dist",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  },
  "functions": {
    "backend/server.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### Update `frontend/package.json`:

Ensure you have:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Create `backend/.env.production`:

```
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

---

## Step 12: Deploy to Vercel

### Option A: Using Vercel CLI

```powershell
npm install -g vercel
vercel
```

Follow the prompts to connect your GitHub repository.

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Select your `codebattle` repository
5. Configure environment variables
6. Click "Deploy"

---

## Step 13: Configure Environment Variables in Vercel

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `GROQ_API_KEY`: Your Groq API key
   - `GEMINI_API_KEY`: Your Gemini API key
   - `VITE_API_URL`: Your backend API URL

---

## Step 14: Future Updates

After making changes locally:

```powershell
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically redeploy on push.

---

## Troubleshooting

### Git not found:
- Reinstall Git from https://git-scm.com
- Restart PowerShell after installation

### Authentication failed:
- Use personal access token instead of password
- Generate at https://github.com/settings/tokens

### Vercel deployment fails:
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify MongoDB connection string is correct

---

## Important Notes

⚠️ **Before Deployment:**
- Remove all `.md` documentation files from root (optional)
- Ensure `.env` files are in `.gitignore`
- Test locally: `npm run dev` in both backend and frontend
- Verify all API endpoints work correctly

✅ **After Deployment:**
- Test all features on production
- Monitor Vercel logs for errors
- Set up error tracking (Sentry recommended)
- Configure custom domain (optional)

---

## Quick Reference Commands

```powershell
# Check git status
git status

# View commit history
git log

# View remote URL
git remote -v

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Create new branch
git checkout -b feature-name

# Switch branch
git checkout main

# Merge branch
git merge feature-name
```

---

Good luck with your deployment! 🚀

