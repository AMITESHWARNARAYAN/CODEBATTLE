# CodeBattle Backend

Node.js + Express backend API for the CodeBattle DSA coding platform.

## 🚀 Tech Stack

- **Node.js & Express** - Server Framework
- **MongoDB & Mongoose** - Database
- **Socket.io** - Real-time Communication
- **JWT** - Authentication
- **Groq API** - AI Code Explanations
- **Gemini API** - AI Code Explanations
- **bcryptjs** - Password Hashing

## 📦 Installation

```bash
npm install
```

## 🔧 Environment Setup

Create a `.env` file in the backend directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codebattle

# JWT Secret (minimum 32 characters)
JWT_SECRET=your_jwt_secret_key_minimum_32_characters_long

# AI API Keys
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Origin (Frontend URL)
CORS_ORIGIN=http://localhost:5173
```

### Getting API Keys

**MongoDB Atlas:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string from "Connect" → "Drivers"

**Groq API:**
1. Go to [Groq Console](https://console.groq.com)
2. Sign up and generate API key

**Gemini API:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Create API key

## 🏃 Development

```bash
npm run dev
```

The server will run on `http://localhost:5000`

## 🌱 Seed Database

Seed admin user:
```bash
npm run seed:admin
```

Seed problems:
```bash
npm run seed:problems
```

## 📤 Deploy to Render

### Option 1: Using Render Dashboard

1. Push this backend folder to a GitHub repository
2. Go to [Render](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: `codebattle-backend` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add Environment Variables:
   - `MONGODB_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Your secret key (min 32 chars)
   - `GROQ_API_KEY` = Your Groq API key
   - `GEMINI_API_KEY` = Your Gemini API key
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `CORS_ORIGIN` = Your frontend URL (e.g., `https://your-app.vercel.app`)

7. Click "Create Web Service"

### Option 2: Using render.yaml

Create a `render.yaml` file in the backend directory:

```yaml
services:
  - type: web
    name: codebattle-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: GROQ_API_KEY
        sync: false
      - key: GEMINI_API_KEY
        sync: false
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: CORS_ORIGIN
        sync: false
```

Then use Render's Blueprint feature to deploy.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get problem by ID
- `POST /api/problems` - Create problem (Admin)
- `PUT /api/problems/:id` - Update problem (Admin)
- `DELETE /api/problems/:id` - Delete problem (Admin)

### Matches
- `POST /api/matches` - Create match
- `GET /api/matches/:id` - Get match details
- `POST /api/matches/:id/submit` - Submit solution

### Users
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user (Admin)

### Categories
- `GET /api/categories` - Get all categories

### Explanations
- `POST /api/explanations` - Get AI explanation

## 📁 Project Structure

```
backend/
├── models/             # MongoDB schemas
│   ├── User.js
│   ├── Problem.js
│   ├── Match.js
│   └── Category.js
├── routes/             # API routes
│   ├── auth.js
│   ├── problems.js
│   ├── matches.js
│   ├── users.js
│   ├── admin.js
│   ├── categories.js
│   └── explanations.js
├── middleware/         # Custom middleware
│   └── auth.js
├── socket/             # Socket.io handlers
│   └── matchmaking.js
├── utils/              # Helper functions
│   └── codeExecutor.js
├── seeds/              # Database seeders
│   ├── admin.js
│   └── problems.js
├── server.js           # Entry point
└── package.json        # Dependencies
```

## 👤 Default Admin Account

After seeding:
- **Email**: `admin@codebattle.com`
- **Password**: `admin123456`

## 🔗 Frontend Repository

Make sure to deploy the frontend separately. See the frontend README for deployment instructions.

## 📝 License

MIT

