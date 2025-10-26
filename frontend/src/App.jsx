import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { initSocket, setUserOnline, setUserOffline, onChallengeReceived } from './utils/socket';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CodeEditor from './pages/CodeEditor';
import SoloPractice from './pages/SoloPractice';
import Matchmaking from './pages/Matchmaking';
import FriendChallenge from './pages/FriendChallenge';
import JoinChallenge from './pages/JoinChallenge';
import Results from './pages/Results';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Problems from './pages/Problems';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const getMe = useAuthStore((state) => state.getMe);
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    // Initialize theme
    initTheme();

    // Initialize socket
    initSocket();

    // Get user info if token exists
    if (token && !user) {
      getMe().catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, [token, user, getMe, initTheme]);

  useEffect(() => {
    // Set user online/offline status
    if (user) {
      setUserOnline(user._id, user.email);

      const handleBeforeUnload = () => {
        setUserOffline(user._id);
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [user]);

  useEffect(() => {
    // Listen for incoming challenges
    if (user) {
      onChallengeReceived((data) => {
        toast.custom(() => (
          <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-lg max-w-md">
            <p className="font-bold mb-2">🎯 Challenge Received!</p>
            <p className="text-sm mb-3">{data.message}</p>
            <p className="text-xs text-indigo-200">From: {data.challenger}</p>
          </div>
        ), { duration: 5000 });
      });
    }
  }, [user]);

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={token ? <ProtectedRoute><Dashboard /></ProtectedRoute> : <Landing />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/problems" element={<ProtectedRoute><Problems /></ProtectedRoute>} />
        <Route path="/matchmaking" element={<ProtectedRoute><Matchmaking /></ProtectedRoute>} />
        <Route path="/friend-challenge" element={<ProtectedRoute><FriendChallenge /></ProtectedRoute>} />
        <Route path="/match/solo" element={<ProtectedRoute><SoloPractice /></ProtectedRoute>} />
        <Route path="/match/join/:inviteCode" element={<ProtectedRoute><JoinChallenge /></ProtectedRoute>} />
        <Route path="/match/:matchId" element={<ProtectedRoute><CodeEditor /></ProtectedRoute>} />
        <Route path="/results/:matchId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

