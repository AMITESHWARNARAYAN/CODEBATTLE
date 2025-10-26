# AI-Powered Problem Explanations Feature

## Overview

CodeBattle now integrates **Google Gemini AI** to provide intelligent, personalized explanations for coding problems. This feature is available exclusively in **Solo Practice Mode**.

## Features

### 1. **Get Explanation** 🧠
Generates a comprehensive explanation of the problem including:
- Problem overview and what it's asking
- Key concepts and algorithms needed
- Step-by-step approach to solve it
- Common pitfalls to avoid
- Time and space complexity considerations

### 2. **Get Guidance** 📚
Analyzes your current code and provides:
- Analysis of your approach
- What you're doing right
- Areas for improvement
- Hints to guide you (without spoiling the solution)
- Suggested next steps

### 3. **View Full Solution** 💡
Generates a complete solution with:
- Full algorithm explanation
- Code solution in JavaScript
- Detailed walkthrough
- Time and space complexity analysis
- Alternative approaches

## Architecture

### Backend Components

#### 1. **Gemini Explainer Utility** (`backend/utils/geminiExplainer.js`)
- `generateProblemExplanation()` - Creates problem explanations
- `generateSolutionApproach()` - Analyzes user code and provides guidance
- `generateDetailedSolution()` - Generates complete solutions

#### 2. **Explanations API Route** (`backend/routes/explanations.js`)
- `POST /api/explanations/problem/:problemId/explanation` - Get explanation
- `POST /api/explanations/problem/:problemId/guidance` - Get guidance
- `POST /api/explanations/problem/:problemId/solution` - Get solution

### Frontend Components

#### 1. **Explanation Store** (`frontend/src/store/explanationStore.js`)
Zustand store managing:
- `explanation` - Current explanation text
- `guidance` - Current guidance text
- `solution` - Current solution text
- `loading` - Loading state
- `error` - Error messages
- Methods: `generateExplanation()`, `generateGuidance()`, `generateSolution()`, `clearExplanations()`

#### 2. **Code Editor Updates** (`frontend/src/pages/CodeEditor.jsx`)
Added UI elements:
- **AI-Powered Help Section** with three buttons
- **Explanation Display** - Shows generated explanations
- **Guidance Display** - Shows AI guidance
- **Solution Display** - Shows full solutions
- All displays are collapsible with close buttons

## User Interface

### Solo Practice Mode - Help Section

```
┌─────────────────────────────────────┐
│ ⚡ AI-Powered Help                  │
├─────────────────────────────────────┤
│ [💡 Get Explanation]                │
│ [📖 Get Guidance]                   │
│ [🔗 View Full Solution]             │
└─────────────────────────────────────┘
```

### Explanation Display
- Shows generated content in a collapsible panel
- Scrollable for long explanations
- Close button to dismiss
- Theme-aware styling (dark/light mode)

## Setup Instructions

### 1. Get Gemini API Key
- Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a new API key
- Copy the key

### 2. Configure Backend
- Open `backend/.env`
- Add: `GEMINI_API_KEY=your_api_key_here`
- Restart backend server

### 3. Test the Feature
- Start a solo practice match
- Click "Get Explanation" button
- Wait for AI to generate explanation
- View the generated content

## API Endpoints

### Get Problem Explanation
```
POST /api/explanations/problem/:problemId/explanation
Headers: Authorization: Bearer {token}
Response: { success: true, explanation: "...", generatedAt: "..." }
```

### Get Guidance for User Code
```
POST /api/explanations/problem/:problemId/guidance
Headers: Authorization: Bearer {token}
Body: { userCode: "..." }
Response: { success: true, guidance: "...", generatedAt: "..." }
```

### Get Full Solution
```
POST /api/explanations/problem/:problemId/solution
Headers: Authorization: Bearer {token}
Response: { success: true, solution: "...", generatedAt: "..." }
```

## Pricing & Limits

### Free Tier (Default)
- 15 requests per minute
- 1,500 requests per day
- Perfect for learning and development

### Paid Tier
- Higher rate limits
- More requests per day
- See [Google AI Pricing](https://ai.google.dev/pricing)

## Error Handling

The system gracefully handles:
- Missing API key - Shows error message
- Rate limit exceeded - Informs user to wait
- Network errors - Displays error toast
- Invalid problem ID - Returns 404

## Security

- All requests require authentication (JWT token)
- API key stored securely in environment variables
- User code is only sent to Gemini for guidance generation
- No data is stored permanently

## Performance

- Explanations generated on-demand
- Async operations prevent UI blocking
- Loading states provide user feedback
- Collapsible panels save screen space

## Future Enhancements

Potential improvements:
1. Cache generated explanations
2. Add video explanation generation
3. Support for multiple languages
4. Difficulty-based explanation depth
5. User feedback on explanation quality
6. Integration with problem difficulty levels

## Troubleshooting

### "API Key not found"
- Verify key is in `backend/.env`
- Restart backend server

### "Rate limit exceeded"
- Wait a few minutes
- Consider upgrading to paid tier

### "Invalid API Key"
- Generate a new key from Google AI Studio
- Check for extra spaces in .env file

## Files Modified/Created

### Created:
- `backend/utils/geminiExplainer.js`
- `backend/routes/explanations.js`
- `frontend/src/store/explanationStore.js`
- `GEMINI_API_SETUP.md`
- `AI_EXPLANATION_FEATURE.md`

### Modified:
- `backend/server.js` - Added explanations route
- `backend/.env` - Added GEMINI_API_KEY
- `backend/package.json` - Added @google/generative-ai
- `frontend/src/pages/CodeEditor.jsx` - Added UI and handlers

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Gemini API key is configured
- [ ] Solo practice mode loads
- [ ] "Get Explanation" button works
- [ ] "Get Guidance" button works (with code)
- [ ] "View Full Solution" button works
- [ ] Explanations display correctly
- [ ] Close buttons work
- [ ] Theme switching works with explanations
- [ ] Error messages display properly

Enjoy learning with AI-powered explanations! 🚀

