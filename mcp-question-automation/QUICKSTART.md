# Quick Start Guide

Get your MCP Question Automation server running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd mcp-question-automation
npm install
```

## Step 2: Get Your Admin Token

You need an admin JWT token to upload questions.

### Method 1: From Browser (Easiest)

1. Open your CodeBattle website: https://codebattle-khaki.vercel.app
2. Login with your admin account
3. Press `F12` to open DevTools
4. Go to **Application** tab → **Local Storage** → Select your domain
5. Find the `token` key and copy its value
6. Paste it in `.env` file as `ADMIN_TOKEN`

### Method 2: Using API

```bash
# Replace with your admin credentials
curl -X POST https://codebattle-backend-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-admin@email.com","password":"your-password"}'
```

Copy the token from the response.

## Step 3: Configure .env

Edit the `.env` file:

```env
BACKEND_URL=https://codebattle-backend-production.up.railway.app
ADMIN_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Paste your token here
WATCH_FOLDER=C:/Users/amitu/Desktop/CodeBattle-Questions
AI_PROVIDER=gemini
```

The AI keys are already configured!

## Step 4: Run Setup

```bash
npm run setup
```

This will:
- ✅ Create the watch folder
- ✅ Verify your configuration
- ✅ Test backend connection

## Step 5: Start the Server

```bash
npm start
```

You should see:
```
🚀 MCP Question Automation Server Starting...
📁 Watching folder: C:/Users/amitu/Desktop/CodeBattle-Questions
✅ MCP Server is ready and watching for new questions!
```

## Step 6: Test It!

### Option A: Use Test Script

```bash
npm test
```

This will upload a test question to verify everything works.

### Option B: Add a Real Question

1. Copy one of the example files from `examples/` folder
2. Paste it into your watch folder: `C:/Users/amitu/Desktop/CodeBattle-Questions`
3. Watch the magic happen! 🎉

Example:
```bash
# Copy example to watch folder
copy examples\example-question.json "C:\Users\amitu\Desktop\CodeBattle-Questions\my-question.json"
```

## What You'll See

When you add a question file:

```
📄 New file detected: my-question.json
📝 Parsing question...
✅ Parsed: Two Sum
   Difficulty: Easy
   Tags: Array, Hash Table
🤖 Generating test cases with AI...
✅ Generated 10 test cases
📤 Uploading to backend...
✅ Successfully uploaded: Two Sum
   Problem ID: 507f1f77bcf86cd799439011
   Created at: 11/1/2025, 10:30:45 AM
```

## Verify Upload

1. Go to your admin panel: https://codebattle-khaki.vercel.app/admin
2. Click on "Problems" tab
3. You should see your newly uploaded question!

## Supported File Formats

### JSON (.json)
```json
{
  "title": "Problem Title",
  "description": "Problem description...",
  "difficulty": "Easy",
  "tags": ["Array", "String"]
}
```

### Markdown (.md)
```markdown
# Problem Title

## Difficulty: Easy

## Tags: Array, String

## Description
Problem description...
```

### Plain Text (.txt)
```
Title: Problem Title
Difficulty: Easy
Tags: Array, String

Description:
Problem description...
```

See `examples/` folder for complete examples!

## Troubleshooting

### "ADMIN_TOKEN not configured"
- Make sure you copied the full token (starts with `eyJ`)
- No spaces or quotes around the token in `.env`

### "Failed to connect to backend"
- Check your `BACKEND_URL` is correct
- Verify your backend is running
- Test manually: `curl https://your-backend-url.com/api/problems`

### "Failed to generate test cases"
- AI keys are already configured, but check if they're still valid
- Try switching AI provider: Change `AI_PROVIDER=groq` in `.env`

### File not detected
- Make sure file extension is `.json`, `.md`, or `.txt`
- Wait 2-3 seconds after saving the file
- Check the `WATCH_FOLDER` path is correct

## Tips

1. **Keep the server running** - It will automatically process any new files
2. **Use JSON format** for most control over the question structure
3. **Use Markdown** for easier writing and formatting
4. **Check examples/** folder for templates
5. **Test with `npm test`** before adding real questions

## Next Steps

- Read the full [README.md](README.md) for advanced features
- Check out [examples/](examples/) for more question templates
- Customize the AI prompt in `services/aiService.js` for better test cases

---

**Need help?** Check the logs when the server is running - they're very detailed!

Happy automating! 🚀

