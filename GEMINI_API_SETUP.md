# Google Gemini API Setup Guide

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click on "Create API Key"
3. Select "Create API key in new project" or use an existing project
4. Copy the generated API key

## Step 2: Add API Key to Environment

1. Open `backend/.env`
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Step 3: Restart Backend Server

```bash
cd backend
npm run dev
```

## Features Enabled

Once you add the API key, the following features will be available in Solo Practice mode:

### 1. **Get Explanation** 
- Generates a comprehensive explanation of the problem
- Includes:
  - Problem overview
  - Key concepts needed
  - Step-by-step approach
  - Common pitfalls
  - Time and space complexity

### 2. **Get Guidance**
- Analyzes your current code
- Provides hints without giving away the solution
- Suggests next steps
- Encourages learning

### 3. **View Full Solution**
- Generates a complete solution with explanation
- Includes algorithm walkthrough
- Code examples
- Complexity analysis
- Alternative approaches

## API Pricing

Google Gemini API has a **free tier** with:
- 15 requests per minute
- 1,500 requests per day
- Sufficient for learning and development

For production use, check [Google AI Pricing](https://ai.google.dev/pricing)

## Troubleshooting

### "API Key not found" error
- Make sure you added the key to `backend/.env`
- Restart the backend server after adding the key

### "Rate limit exceeded" error
- You've exceeded the free tier limits
- Wait a few minutes before trying again
- Consider upgrading to a paid plan for production

### "Invalid API Key" error
- Double-check your API key is correct
- Make sure there are no extra spaces or characters
- Generate a new key if needed

## Testing

To test if everything is working:

1. Start a solo practice match
2. Click "Get Explanation" button
3. Wait for the AI to generate the explanation
4. You should see the explanation appear in the problem panel

Enjoy learning with AI-powered explanations! 🚀

