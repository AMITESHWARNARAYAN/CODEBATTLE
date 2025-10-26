# 🤖 AI Explanation Feature - Multiple API Support

## Overview

CodeBattle now supports **multiple free AI APIs** for generating problem explanations, guidance, and solutions!

---

## Supported APIs

### 1. **Groq API** ⭐ (Recommended - Completely Free)

**Why Groq?**
- ✅ Completely free (no credit card)
- ✅ Super fast inference
- ✅ 14,400 requests/day limit
- ✅ No rate limiting issues
- ✅ Multiple models available

**Setup:**
1. Go to https://console.groq.com
2. Sign up (free account)
3. Generate API key
4. Add to `backend/.env`: `GROQ_API_KEY=gsk_...`
5. Restart backend

**Models:**
- `mixtral-8x7b-32768` (default - balanced)
- `llama-3.1-8b-instant` (faster)
- `llama-3.3-70b-versatile` (more capable)

---

### 2. **Google Gemini API** (Free Tier Available)

**Why Gemini?**
- ✅ Free tier available
- ✅ Powerful models
- ✅ Good for learning
- ⚠️ May have API key issues

**Setup:**
1. Go to https://aistudio.google.com/app/apikey
2. Create API key
3. Add to `backend/.env`: `GEMINI_API_KEY=AIza...`
4. Restart backend

**Limits:**
- 250,000 tokens/minute
- 250 requests/day
- 10 requests/minute

---

### 3. **Fallback System** (Always Works)

If both APIs fail, the system uses **pre-built educational explanations**:
- Problem overview
- Key concepts
- Step-by-step approach
- Common pitfalls
- Complexity analysis

---

## How It Works

The system tries APIs in this order:

```
1. Groq API (if GROQ_API_KEY is set)
   ↓ (if fails)
2. Gemini API (if GEMINI_API_KEY is set)
   ↓ (if fails)
3. Fallback Explanations (always works)
```

---

## Configuration

### Option A: Use Groq (Recommended)

```env
GROQ_API_KEY=gsk_YOUR_KEY_HERE
```

### Option B: Use Gemini

```env
GEMINI_API_KEY=AIza_YOUR_KEY_HERE
```

### Option C: Use Both (Groq as primary, Gemini as backup)

```env
GROQ_API_KEY=gsk_YOUR_KEY_HERE
GEMINI_API_KEY=AIza_YOUR_KEY_HERE
```

### Option D: Use Fallback Only (No API key needed)

Leave both empty - system will use fallback explanations.

---

## Features

### 💡 Get Explanation
- Problem overview
- Key concepts
- Solution approach
- Common pitfalls
- Complexity analysis

### 📖 Get Guidance
- Code analysis
- What you're doing right
- Areas for improvement
- Helpful hints
- Next steps

### 🔗 View Full Solution
- Complete algorithm explanation
- Code solution
- Detailed walkthrough
- Complexity analysis
- Alternative approaches

---

## Backend Logs

Check logs to see which API is being used:

```
✅ Groq AI initialized successfully
✅ Gemini AI initialized successfully
📚 Using fallback explanation for problem: Two Sum
```

---

## Other Free API Alternatives

If you want to try other free APIs:

1. **OpenRouter** - 20 requests/day free
2. **HuggingFace** - $0.10/month credits
3. **Cohere** - 1,000 requests/month free
4. **Cerebras** - 30 requests/minute free
5. **Cloudflare Workers AI** - 10,000 neurons/day

See `GROQ_API_SETUP.md` for detailed setup instructions.

---

## Testing

1. Login to CodeBattle
2. Start Solo Practice
3. Click "Get Explanation" button
4. Check backend logs for which API was used
5. Verify explanation appears in UI

---

## Troubleshooting

**Q: Getting fallback explanations?**
A: Check backend logs to see if API keys are loaded. Make sure you added them to `.env` and restarted.

**Q: API key not working?**
A: Try regenerating a new key from the provider's console.

**Q: Want to switch APIs?**
A: Just update `.env` and restart backend. System will automatically use the new API.

**Q: Can I use multiple APIs?**
A: Yes! Set both GROQ_API_KEY and GEMINI_API_KEY. Groq will be tried first.

---

## Performance

- **Groq**: ~100-500ms response time
- **Gemini**: ~500-2000ms response time
- **Fallback**: Instant (pre-built)

---

## Cost

- **Groq**: FREE ✅
- **Gemini**: FREE (with limits) ✅
- **Fallback**: FREE ✅

**Total Cost: $0** 🎉

