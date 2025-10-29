# CodeBattle - LeetCode Style DSA Competition Platform

A real-time DSA (Data Structures & Algorithms) coding competition platform built with MERN stack, featuring LeetCode-style problems, real-time matchmaking, and AI-powered explanations.

## 🎯 Features

- **Problem Categories**: Browse problems organized by categories
- **LeetCode-Style Interface**: Modern UI with problem search, filtering, and acceptance rates
- **Real-Time Matchmaking**: Find opponents and compete in real-time
- **Code Editor**: Multi-language support with syntax highlighting
- **Timer Toggle**: Control timer for solo practice mode
- **Admin Panel**: Create categories and problems
- **User Authentication**: Secure login and registration
- **Leaderboard**: Track user rankings and statistics
- **AI Explanations**: Get AI-powered hints using Groq & Gemini APIs
- **Dark Theme**: Responsive design with modern UI

## 📦 Repository Structure

This project is organized as a monorepo with separate frontend and backend directories. For deployment, you should push them to separate GitHub repositories:

- **Frontend** → Deploy to **Vercel**
- **Backend** → Deploy to **Render**

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Groq API key
- Gemini API key

### Local Development

**1. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

**2. Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend URL
npm run dev
```

**3. Access the Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Project Structure

```
codebattle/
├── backend/             # Backend API (Deploy to Render)
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── socket/          # WebSocket handlers
│   ├── utils/           # Helper functions
│   ├── seeds/           # Database seeders
│   ├── server.js        # Express server
│   ├── .env.example     # Environment template
│   └── README.md        # Backend deployment guide
│
└── frontend/            # Frontend App (Deploy to Vercel)
    ├── src/
    │   ├── pages/       # React pages
    │   ├── store/       # Zustand stores
    │   ├── utils/       # Helper functions
    │   └── App.jsx      # Main component
    ├── vite.config.js   # Vite configuration
    ├── vercel.json      # Vercel configuration
    ├── .env.example     # Environment template
    └── README.md        # Frontend deployment guide
```

## 🔑 Tech Stack

### Backend
- Node.js & Express.js
- MongoDB
- Socket.io
- JWT Authentication
- Groq API (AI)
- Gemini API (AI)

### Frontend
- React 18
- Vite
- Tailwind CSS
- Zustand (State Management)
- Axios
- Socket.io Client

## 👤 Default Admin Account

After seeding the database:
- Email: `admin@codebattle.com`
- Password: `admin123456`

## 🌐 Deployment

### Deploy Frontend to Vercel

1. **Create a new GitHub repository for frontend**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial frontend commit"
   git remote add origin https://github.com/YOUR_USERNAME/codebattle-frontend.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your frontend repository
   - Add environment variable: `VITE_API_URL` = Your backend URL
   - Deploy!

See `frontend/README.md` for detailed instructions.

### Deploy Backend to Render

1. **Create a new GitHub repository for backend**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin https://github.com/YOUR_USERNAME/codebattle-backend.git
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to [Render](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your backend repository
   - Add environment variables (MongoDB URI, JWT Secret, API Keys, etc.)
   - Deploy!

See `backend/README.md` for detailed instructions.

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codebattle
JWT_SECRET=your_jwt_secret_key_minimum_32_characters_long
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

For production, update `VITE_API_URL` to your deployed backend URL.

## 🎨 Key Features

### For Users
- ✅ Browse problems by category (Arrays, Strings, Trees, etc.)
- ✅ Solo practice mode with optional timer
- ✅ Real-time 1v1 matchmaking
- ✅ Friend challenge system with invite codes
- ✅ AI-powered code explanations
- ✅ Leaderboard and user rankings
- ✅ Profile statistics and match history

### For Admins
- ✅ Create and manage problem categories
- ✅ Add/edit/delete coding problems
- ✅ View platform statistics
- ✅ Manage users

## 🔮 Future Enhancements

- [ ] Support for more programming languages
- [ ] Video chat during matches
- [ ] Problem difficulty-based matchmaking
- [ ] Achievements and badges
- [ ] Team competitions
- [ ] Problem editorial and solutions
- [ ] Code replay and analysis
- [ ] Mobile app (React Native)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB Atlas connection string is correct
- Whitelist your IP address in MongoDB Atlas

### CORS Issues
- Update `CORS_ORIGIN` in backend `.env` with your frontend URL
- For local development: `http://localhost:5173`
- For production: Your Vercel URL

### Socket Connection Issues
- Ensure backend is running and accessible
- Check that frontend `VITE_API_URL` points to correct backend URL

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using MERN Stack**

