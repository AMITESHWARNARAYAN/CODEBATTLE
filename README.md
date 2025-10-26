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
- **AI Explanations**: Get AI-powered hints using Groq API
- **Dark/Light Theme**: Responsive design with theme support

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Groq API key
- Gemini API key

### Installation

**Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codebattle
JWT_SECRET=your_jwt_secret_min_32_chars
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

**Frontend Setup**
```bash
cd frontend
npm install
```

### Running Locally

**Start Backend**
```bash
cd backend
npm run dev
```

**Start Frontend**
```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Project Structure

```
codebattle/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── socket/          # WebSocket handlers
│   ├── utils/           # Helper functions
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── store/       # Zustand stores
│   │   ├── utils/       # Helper functions
│   │   └── App.jsx      # Main component
│   └── vite.config.js
└── vercel.json          # Vercel deployment config
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

- Email: `admin@codebattle.com`
- Password: `admin123456`

## 🌐 Deployment

Deploy to Vercel:
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Add environment variables
4. Deploy

See `vercel.json` for configuration.

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_min_32_chars
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 📄 License

MIT License - feel free to use this project for learning and development.

---

**Built with ❤️ using MERN Stack**
- Loss deducts points accordingly
- Draws split the difference

## 🔐 Authentication

- JWT-based authentication
- Passwords hashed with bcryptjs
- Token stored in localStorage
- Auto-logout on token expiration

## 🧪 Testing

### Test Accounts
```
Email: test@example.com
Password: password123
```

### Sample Problems
5 DSA problems pre-loaded:
- Two Sum (Easy)
- Reverse String (Easy)
- Palindrome Number (Easy)
- Valid Parentheses (Easy)
- Merge Sorted Array (Easy)

## 🚀 Deployment

### Backend (Heroku/Railway)
```bash
cd backend
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist folder
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/random` - Get random problem
- `GET /api/problems/:id` - Get problem by ID

### Matches
- `POST /api/matches/solo` - Start solo match
- `POST /api/matches/friend/create` - Create friend challenge
- `POST /api/matches/friend/join/:inviteCode` - Join friend challenge
- `POST /api/matches/:matchId/submit` - Submit code
- `GET /api/matches/:matchId` - Get match details
- `GET /api/matches/user/history` - Get match history

### Users
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/stats` - Get user stats
- `GET /api/users/search` - Search users
- `GET /api/users/:username` - Get user profile

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally OR
- Update `MONGODB_URI` in `.env` with Atlas connection string

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Change port in `vite.config.js`

### Socket Connection Issues
- Ensure backend is running
- Check CORS settings in `server.js`
- Verify `FRONTEND_URL` in `.env`

## 🎨 UI/UX Features

- Dark theme with gradient accents
- Responsive design (mobile, tablet, desktop)
- Real-time animations and transitions
- Toast notifications for user feedback
- Loading states and error handling
- Professional color scheme (Indigo, Purple, Pink)

## 🔮 Future Enhancements

- [ ] Support for more programming languages
- [ ] Video chat during matches
- [ ] Problem difficulty-based matchmaking
- [ ] Achievements and badges
- [ ] Team competitions
- [ ] Problem editorial and solutions
- [ ] Code replay and analysis
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Streaming integration

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using MERN Stack**

