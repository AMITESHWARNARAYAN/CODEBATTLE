# CodeBattle Frontend

React + Vite frontend for the CodeBattle DSA coding platform.

## 🚀 Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **React Router** - Routing
- **Socket.io Client** - Real-time Communication
- **Monaco Editor** - Code Editor
- **Axios** - HTTP Client

## 📦 Installation

```bash
npm install
```

## 🔧 Environment Setup

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, use your backend URL:
```env
VITE_API_URL=https://your-backend-app.onrender.com/api
```

## 🏃 Development

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## 🏗️ Build

```bash
npm run build
```

Build output will be in the `dist` folder.

## 📤 Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Using Vercel Dashboard

1. Push this frontend folder to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (if frontend is root) or `frontend` (if in monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variable:
   - `VITE_API_URL` = Your backend URL (e.g., `https://your-backend.onrender.com/api`)

7. Click "Deploy"

## 🌐 Features

- ✅ User Authentication (Login/Register)
- ✅ Dashboard with Problem Categories
- ✅ Solo Practice Mode
- ✅ Real-time Matchmaking
- ✅ Friend Challenge System
- ✅ Live Code Editor with Monaco
- ✅ AI-Powered Explanations
- ✅ Leaderboard & Rankings
- ✅ Admin Panel
- ✅ Dark Theme UI

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/          # React pages/routes
│   ├── store/          # Zustand state management
│   ├── utils/          # Helper functions
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── package.json        # Dependencies
```

## 🔗 Backend Repository

Make sure to deploy the backend separately. See the backend README for deployment instructions.

## 📝 License

MIT

