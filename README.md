# CodeBattle - DSA Coding Platform

A professional, real-time DSA coding competition platform built with MERN stack, featuring ELO-based matchmaking, friend challenges, and solo practice modes.

## 🎯 Features

### Game Modes
- **Matchmaking**: Get matched with players of similar skill level in real-time
- **Challenge Friend**: Send invitation links to friends for private matches
- **Solo Practice**: Practice DSA problems at your own pace

### Rating System
- ELO-based rating system (like Chess.com)
- Dynamic rating changes based on opponent strength
- Track highest and lowest ratings
- Win/loss/draw statistics

### Code Execution
- Real-time code execution with test cases
- Time and space complexity analysis
- Support for multiple languages (JavaScript, Python, Java, C++)
- Detailed execution results and error handling

### Social Features
- Global leaderboard
- Player profiles with statistics
- Online/offline status
- Match history

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and setup**
```bash
cd c:\Users\amitu\Desktop\Projects
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Setup MongoDB**
   - Install MongoDB locally OR
   - Create a MongoDB Atlas cluster and get connection string

4. **Configure environment**
   - Backend: Create `backend/.env` (already created with defaults)
   - Update `MONGODB_URI` if using MongoDB Atlas

5. **Seed sample problems**
```bash
cd backend
node seeds/problems.js
```

6. **Start the application**
```bash
npm run dev
```

This will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## 📁 Project Structure

```
codebattle-platform/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & validation
│   ├── utils/            # ELO, code execution
│   ├── socket/           # WebSocket handlers
│   ├── seeds/            # Database seeding
│   └── server.js         # Main server
├── frontend/
│   ├── src/
│   │   ├── pages/        # React pages
│   │   ├── store/        # Zustand stores
│   │   ├── utils/        # Socket & API
│   │   ├── App.jsx       # Main app
│   │   └── index.css     # Tailwind styles
│   └── vite.config.js
└── package.json
```

## 🔑 Key Technologies

### Backend
- **Express.js**: Web framework
- **MongoDB**: Database
- **Socket.io**: Real-time communication
- **JWT**: Authentication
- **vm2**: Secure code execution
- **bcryptjs**: Password hashing

### Frontend
- **React 18**: UI library
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Monaco Editor**: Code editor
- **Zustand**: State management
- **Socket.io Client**: Real-time updates
- **Axios**: HTTP client

## 🎮 How to Use

### Register & Login
1. Go to http://localhost:5173
2. Create an account or login
3. You'll start with 1200 ELO rating

### Matchmaking
1. Click "Matchmaking" on dashboard
2. Click "Start Searching"
3. Wait for opponent (rating-based matching)
4. Solve the DSA problem
5. Submit code and see results

### Challenge Friend
1. Click "Challenge Friend"
2. Click "Create Challenge"
3. Copy the invitation link
4. Send to friend
5. Friend clicks link to join
6. Both solve the same problem

### Solo Practice
1. Click "Solo Practice"
2. Solve the problem at your own pace
3. No rating changes, just practice

### Leaderboard
- View global rankings
- Click on player to see their profile
- Track your position

## 📊 ELO Rating System

The platform uses Chess.com-style ELO rating:

- **Starting Rating**: 1200
- **K-Factor**: 32 (determines rating change magnitude)
- **Formula**: `newRating = currentRating + K * (actualScore - expectedScore)`

### Winning Scenarios
- Win against higher-rated player: +more points
- Win against lower-rated player: +fewer points
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

