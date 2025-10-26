# Exact Commands to Deploy CodeBattle

## Copy & Paste These Commands

### Step 1: Install Git (Windows)
1. Download: https://git-scm.com/download/win
2. Run installer with default options
3. **Restart PowerShell**

### Step 2: Configure Git (One Time)

```powershell
git config --global user.name "Your Full Name"
git config --global user.email "your.email@gmail.com"
```

### Step 3: Navigate to Project

```powershell
cd "C:\Users\amitu\OneDrive\Desktop\Projects"
```

### Step 4: Initialize Git Repository

```powershell
git init
```

### Step 5: Add Remote Repository

Replace `YOUR_USERNAME` with your GitHub username:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/codebattle.git
```

Example:
```powershell
git remote add origin https://github.com/amitu/codebattle.git
```

### Step 6: Verify Remote

```powershell
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/codebattle.git (fetch)
origin  https://github.com/YOUR_USERNAME/codebattle.git (push)
```

### Step 7: Stage All Files

```powershell
git add .
```

### Step 8: Create Initial Commit

```powershell
git commit -m "Initial commit: CodeBattle MERN application with LeetCode-style problems page"
```

### Step 9: Rename Branch to Main

```powershell
git branch -M main
```

### Step 10: Push to GitHub

```powershell
git push -u origin main
```

**When prompted:**
- Username: Your GitHub username
- Password: Your Personal Access Token (NOT your password)

### Step 11: Verify on GitHub

1. Go to: https://github.com/YOUR_USERNAME/codebattle
2. You should see all your files
3. Verify `.env` files are NOT visible

---

## Vercel Deployment

### Step 1: Create Vercel Account
- Go to: https://vercel.com
- Click "Sign Up"
- Choose "Continue with GitHub"
- Authorize Vercel

### Step 2: Create New Project
1. Click "New Project"
2. Select your `codebattle` repository
3. Click "Import"

### Step 3: Configure Build Settings

When prompted, set:
- **Framework**: Other
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" and add each one:

```
MONGODB_URI
mongodb+srv://username:password@cluster.mongodb.net/codebattle

JWT_SECRET
your-super-secret-key-minimum-32-characters-long-1234567890

GROQ_API_KEY
gsk_your_groq_api_key_here

GEMINI_API_KEY
your_gemini_api_key_here

VITE_API_URL
https://your-backend-url.vercel.app/api

NODE_ENV
production
```

### Step 5: Deploy

Click "Deploy" and wait 5-10 minutes.

---

## Getting API Keys

### MongoDB URI

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Click "Connect"
5. Choose "Drivers"
6. Copy connection string
7. Replace `<password>` with your password
8. Replace `myFirstDatabase` with `codebattle`

Example:
```
mongodb+srv://admin:password123@cluster0.mongodb.net/codebattle
```

### Groq API Key

1. Go to: https://console.groq.com
2. Sign in or create account
3. Go to "API Keys"
4. Click "Create New API Key"
5. Copy the key

### Gemini API Key

1. Go to: https://aistudio.google.com/app/apikeys
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

### JWT Secret

Generate a random string (min 32 characters):

Option 1 - Use online generator:
```
https://www.random.org/strings/
```

Option 2 - Use this template:
```
your-super-secret-jwt-key-minimum-32-characters-long-1234567890
```

---

## Testing After Deployment

### Test Login
- Email: `admin@codebattle.com`
- Password: `admin123456`

### Test Features
1. ✅ Login to admin panel
2. ✅ Create a category
3. ✅ Create a problem
4. ✅ Go to Problems page
5. ✅ Browse categories
6. ✅ Search problems
7. ✅ Filter by difficulty
8. ✅ Click problem to open editor
9. ✅ Test timer toggle
10. ✅ Test code execution

---

## Future Updates

After making changes locally:

```powershell
cd "C:\Users\amitu\OneDrive\Desktop\Projects"
git add .
git commit -m "Your change description"
git push origin main
```

Vercel will automatically redeploy!

---

## Troubleshooting Commands

### Check Git Status
```powershell
git status
```

### View Commit History
```powershell
git log
```

### View Remote URL
```powershell
git remote -v
```

### Undo Last Commit (keep changes)
```powershell
git reset --soft HEAD~1
```

### Undo Last Commit (discard changes)
```powershell
git reset --hard HEAD~1
```

### Create Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token"
3. Select scopes: `repo`, `workflow`
4. Click "Generate token"
5. Copy and save (you won't see it again!)

---

## Important Notes

⚠️ **Critical:**
- Never commit `.env` files
- Use strong JWT_SECRET (min 32 chars)
- Keep API keys secret
- Test locally before pushing
- Monitor Vercel logs

✅ **Best Practices:**
- Use semantic commit messages
- Deploy to staging first
- Keep dependencies updated
- Regular database backups
- Monitor error rates

---

## Quick Reference

| Task | Command |
|------|---------|
| Check git version | `git --version` |
| Initialize repo | `git init` |
| Add files | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push origin main` |
| Check status | `git status` |
| View history | `git log` |
| View remotes | `git remote -v` |

---

**You're ready to deploy! 🚀**

Follow these commands step by step and your app will be live on Vercel!

