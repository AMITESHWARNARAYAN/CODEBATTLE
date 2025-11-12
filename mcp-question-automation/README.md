# MCP Question Automation Server

Automatically upload coding questions to CodeBattle backend with AI-generated test cases.

## Features

- 📁 **File Watching**: Monitors a desktop folder for new question files
- 🤖 **AI Test Generation**: Automatically generates comprehensive test cases using Gemini or Groq
- 📤 **Auto Upload**: Uploads questions to your CodeBattle backend via admin API
- 📝 **Multiple Formats**: Supports JSON, Markdown, and Plain Text formats
- ✅ **Smart Parsing**: Intelligently extracts question details from various formats

## Setup

### 1. Install Dependencies

```bash
cd mcp-question-automation
npm install
```

### 2. Configure Environment

Edit `.env` file:

```env
# Backend Configuration
BACKEND_URL=https://your-backend-url.com
ADMIN_TOKEN=your_admin_jwt_token_here

# AI API Keys
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Folder to watch
WATCH_FOLDER=C:/Users/amitu/Desktop/CodeBattle-Questions

# AI Provider (gemini or groq)
AI_PROVIDER=gemini
```

### 3. Get Admin Token

You need to get your admin JWT token:

**Option 1: Login via API**
```bash
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'
```

**Option 2: From Browser**
1. Login to your CodeBattle admin panel
2. Open browser DevTools (F12)
3. Go to Application/Storage → Local Storage
4. Copy the `token` value

### 4. Create Watch Folder

Create the folder that will be monitored:

```bash
mkdir "C:\Users\amitu\Desktop\CodeBattle-Questions"
```

### 5. Start the Server

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

## Usage

### Adding Questions

Simply add a question file to your watched folder in any supported format:

#### JSON Format (`.json`)

```json
{
  "title": "Two Sum",
  "description": "Given an array...",
  "difficulty": "Easy",
  "tags": ["Array", "Hash Table"],
  "constraints": "2 <= nums.length <= 10^4",
  "examples": [
    {
      "input": "[2,7,11,15], target = 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 9"
    }
  ],
  "functionSignature": {
    "javascript": "function twoSum(nums, target) { }",
    "python": "def twoSum(nums, target):",
    "java": "public int[] twoSum(int[] nums, int target) { }",
    "cpp": "vector<int> twoSum(vector<int>& nums, int target) { }"
  }
}
```

#### Markdown Format (`.md`)

```markdown
# Two Sum

## Difficulty: Easy

## Tags: Array, Hash Table

## Description

Given an array of integers nums and an integer target...

## Examples

Example 1:
Input: [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9

## Constraints

- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
```

#### Plain Text Format (`.txt`)

```
Title: Two Sum
Difficulty: Easy
Tags: Array, Hash Table

Description:
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

Constraints:
2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
```

### What Happens Next

1. ✅ MCP server detects the new file
2. 📝 Parses the question details
3. 🤖 AI generates 8-10 comprehensive test cases
4. 📤 Uploads to your backend automatically
5. ✨ Question is now live on CodeBattle!

## Test Case Generation

The AI generates test cases covering:

- **Basic Cases**: Simple, straightforward inputs (2-3 cases)
- **Edge Cases**: Empty inputs, single elements, boundaries (2-3 cases)
- **Complex Cases**: Large inputs, stress tests (2-3 cases)
- **Corner Cases**: Problem-specific edge scenarios (1-2 cases)

Some test cases are marked as `isHidden: true` for evaluation purposes.

## Troubleshooting

### "ADMIN_TOKEN not configured"
- Make sure you've added your admin JWT token to `.env`
- Token should start with `eyJ...`

### "Failed to generate test cases"
- Check your AI API keys in `.env`
- Verify you have credits/quota remaining
- Try switching AI provider (gemini ↔ groq)

### "Upload failed: 403 Forbidden"
- Your admin token may have expired
- Get a fresh token by logging in again

### File not detected
- Check the `WATCH_FOLDER` path in `.env`
- Ensure file extension is `.json`, `.md`, or `.txt`
- Wait 2-3 seconds after saving the file

## Examples

See the `examples/` folder for sample question files in all supported formats.

## Architecture

```
mcp-question-automation/
├── index.js              # Main server with file watcher
├── services/
│   ├── aiService.js      # AI test case generation
│   └── backendService.js # Backend API integration
├── utils/
│   └── parser.js         # Question file parsers
└── examples/             # Sample question files
```

## API Integration

The server uses your backend's admin API:

```
POST /api/admin/problems
Authorization: Bearer <ADMIN_TOKEN>

{
  "title": "...",
  "description": "...",
  "difficulty": "Easy|Medium|Hard",
  "tags": [...],
  "testCases": [...],
  "functionSignature": {...},
  ...
}
```

## License

MIT

