import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { useMatchStore } from './store/matchStore';
import { initSocket, setUserOnline, setUserOffline, onChallengeReceived, onChallengeAccepted } from './utils/socket';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
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
import AdminProblemMetadata from './pages/AdminProblemMetadata';
import Problems from './pages/Problems';
import DailyChallenge from './pages/DailyChallenge';
import Submissions from './pages/Submissions';
import Discussions from './pages/Discussions';
import Challenges from './pages/Challenges';
import Contests from './pages/Contests';
import ContestDetail from './pages/ContestDetail';
import ContestLive from './pages/ContestLive';
import Notifications from './pages/Notifications';
import Stories from './pages/Stories';
import CodeEditorNew from './pages/CodeEditorNew';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};

// App Routes Component (has access to useNavigate)
function AppRoutes() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const getMe = useAuthStore((state) => state.getMe);
  const initTheme = useThemeStore((state) => state.initTheme);
  const acceptChallenge = useMatchStore((state) => state.acceptChallenge);
  const rejectChallenge = useMatchStore((state) => state.rejectChallenge);

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
    // Listen for incoming challenge and show premium interactive notification toast
    if (user) {
      const handleChallengeReceived = (data) => {
        // Play notification sound
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-600.wav');
          audio.volume = 0.4;
          audio.play().catch(() => {});
        } catch (e) {}

        // Custom premium toast
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            } fixed top-0 left-0 right-0 z-[9999] bg-[#7fa64c] text-white shadow-lg flex items-center justify-between px-6 py-3.5 transition-all duration-300 ease-in-out border-b border-[#6c903f]`}
          >
            {/* Left Section: Icon & Message */}
            <div className="flex items-center space-x-3">
              <span className="text-xl animate-pulse">⚔️</span>
              <span className="text-sm font-semibold tracking-wide font-sans">
                <span className="font-bold underline text-yellow-200">@{data.challenger}</span> challenged you to a DSA Coding Battle!
              </span>
            </div>

            {/* Right Section: Actions & Close */}
            <div className="flex items-center space-x-4">
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  try {
                    await acceptChallenge(data.matchId);
                    navigate(`/match/${data.matchId}`);
                  } catch (err) {
                    toast.error('Failed to accept challenge');
                  }
                }}
                className="bg-white text-[#7fa64c] hover:bg-gray-100 font-bold px-4 py-1.5 rounded-md text-xs uppercase tracking-wider shadow-sm transition-all duration-150"
              >
                Accept
              </button>
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  try {
                    await rejectChallenge(data.matchId);
                  } catch (err) {}
                }}
                className="bg-transparent border border-white hover:bg-white/10 text-white font-medium px-4 py-1.5 rounded-md text-xs uppercase tracking-wider transition-all duration-150"
              >
                Decline
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-white/80 hover:text-white transition-colors pl-2 text-xl font-bold font-sans focus:outline-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          </div>
        ), { duration: 15000 });
      };

      onChallengeReceived(handleChallengeReceived);

      return () => {
        import('./utils/socket').then(({ removeListener }) => {
          removeListener('challenge-received', handleChallengeReceived);
        });
      };
    }
  }, [user, acceptChallenge, rejectChallenge, navigate]);

  useEffect(() => {
    // Listen for challenge acceptance - redirect both players to match
    if (user) {
      const handleChallengeAccepted = (data) => {
        navigate(`/match/${data.matchId}`);
      };
      
      onChallengeAccepted(handleChallengeAccepted);
      
      return () => {
        import('./utils/socket').then(({ removeListener }) => {
          removeListener('challenge-accepted', handleChallengeAccepted);
        });
      };
    }
  }, [user, navigate]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        <Route path="/" element={token ? <ProtectedRoute><Dashboard /></ProtectedRoute> : <Landing />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/admin/problem-metadata" element={<ProtectedRoute><AdminProblemMetadata /></ProtectedRoute>} />
        <Route path="/problems" element={<ProtectedRoute><Problems /></ProtectedRoute>} />
        <Route path="/daily-challenge" element={<ProtectedRoute><DailyChallenge /></ProtectedRoute>} />
        <Route path="/submissions" element={<ProtectedRoute><Submissions /></ProtectedRoute>} />
        <Route path="/discussions" element={<ProtectedRoute><Discussions /></ProtectedRoute>} />
        <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
        <Route path="/contests" element={<ProtectedRoute><Contests /></ProtectedRoute>} />
        <Route path="/contests/:id" element={<ProtectedRoute><ContestDetail /></ProtectedRoute>} />
        <Route path="/contests/:id/live" element={<ProtectedRoute><ContestLive /></ProtectedRoute>} />
        <Route path="/matchmaking" element={<ProtectedRoute><Matchmaking /></ProtectedRoute>} />
        <Route path="/friend-challenge" element={<ProtectedRoute><FriendChallenge /></ProtectedRoute>} />
        <Route path="/match/solo" element={<ProtectedRoute><SoloPractice /></ProtectedRoute>} />
        <Route path="/match/join/:inviteCode" element={<ProtectedRoute><JoinChallenge /></ProtectedRoute>} />
        <Route path="/match/:matchId" element={<ProtectedRoute><CodeEditor /></ProtectedRoute>} />
        <Route path="/code-editor/:problemId" element={<ProtectedRoute><CodeEditorNew /></ProtectedRoute>} />
        <Route path="/problem/:problemId" element={<ProtectedRoute><CodeEditorNew /></ProtectedRoute>} />
        <Route path="/results/:matchId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/stories" element={<ProtectedRoute><Stories /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

