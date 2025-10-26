# 🚀 Groq API Setup Guide

## Why Groq?

✅ **Completely Free** - No credit card required  
✅ **Super Fast** - Fastest LLM inference  
✅ **Generous Limits** - 14,400 requests/day  
✅ **No Rate Limiting** - Unlike other free APIs  
✅ **Multiple Models** - Llama, Mixtral, and more  

---

## Step 1: Create a Groq Account

1. Go to: **https://console.groq.com**
2. Click **"Sign Up"**
3. Create your account (email + password)
4. Verify your email

---

## Step 2: Generate API Key

1. After login, go to **API Keys** section
2. Click **"Create API Key"**
3. Give it a name (e.g., "CodeBattle")
4. **Copy the API key** (looks like: `gsk_...`)

---

## Step 3: Add to .env File

1. Open `backend/.env`
2. Add this line:
   ```
   GROQ_API_KEY=gsk_YOUR_API_KEY_HERE
   ```
3. Replace `gsk_YOUR_API_KEY_HERE` with your actual key
4. Save the file

---

## Step 4: Restart Backend

The backend will automatically detect the new API key and use Groq for AI explanations!

```bash
cd backend
npm run dev
```

---

## Available Models

Groq supports multiple models. We use **Mixtral 8x7B** by default:

- **mixtral-8x7b-32768** - Fast, balanced (default)
- **llama-3.1-8b-instant** - Smaller, faster
- **llama-3.3-70b-versatile** - Larger, more capable

---

## Rate Limits

- **14,400 requests/day** (plenty for testing!)
- **6,000 tokens/minute** (very generous)
- **No credit card required**

---

## Fallback System

If Groq API fails, the system automatically:
1. Tries Gemini API (if configured)
2. Falls back to mock explanations
3. Always returns a response (no errors!)

---

## Testing

1. Login to CodeBattle
2. Start Solo Practice
3. Click "Get Explanation" button
4. Check backend logs for "✅ Groq AI initialized successfully"

---

## Troubleshooting

**Issue**: "GROQ_API_KEY not found"
- Solution: Make sure you added it to `.env` and restarted the backend

**Issue**: "Groq API error"
- Solution: Check your API key is correct
- Try regenerating a new key from console.groq.com

**Issue**: Still getting fallback explanations
- Solution: Check backend logs to see which API is being used
- Make sure your API key is valid

---

## Support

- Groq Docs: https://console.groq.com/docs
- Community: https://community.groq.com
- Status: https://status.groq.com

