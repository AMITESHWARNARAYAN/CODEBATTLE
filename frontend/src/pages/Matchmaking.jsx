import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  joinMatchmakingQueue,
  leaveMatchmakingQueue,
  onQueueJoined,
  onQueueUpdate,
  onMatchFound,
  removeListener
} from '../utils/socket';
import { ArrowLeft, Swords, Users, Clock, X } from 'lucide-react';

export default function Matchmaking() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searching, setSearching] = useState(false);
  const [waitTime, setWaitTime] = useState(0);
  const [queueSize, setQueueSize] = useState(0);
  const timerRef = useRef(null);

  // Local timer for smooth second-by-second updates
  useEffect(() => {
    if (searching) {
      timerRef.current = setInterval(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [searching]);

  useEffect(() => {
    onQueueJoined(() => {
      setSearching(true);
      setWaitTime(0);
    });

    onQueueUpdate((data) => {
      setQueueSize(data.queueSize);
    });

    onMatchFound((match) => {
      setSearching(false);
      navigate(`/match/${match._id}`);
    });

    return () => {
      removeListener('queue-joined');
      removeListener('queue-update');
      removeListener('match-found');
    };
  }, [navigate]);

  const handleStartSearch = () => {
    if (!user) return;
    joinMatchmakingQueue(user._id, user.rating);
  };

  const handleCancelSearch = () => {
    if (!user) return;
    leaveMatchmakingQueue(user._id);
    setSearching(false);
    setWaitTime(0);
    setQueueSize(0);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Ranked Matchmaking</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Find an Opponent</h2>
            <p className="text-slate-400">
              Get matched with another player and compete in a real-time DSA battle.
            </p>
          </div>

          {!searching ? (
            <>
              {/* Rating Display */}
              <div className="mb-6 p-4 bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Your Battle Rating</p>
                <p className="text-4xl font-bold text-orange-500">{user?.rating || 0}</p>
              </div>

              <button
                onClick={handleStartSearch}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                <Swords className="w-4 h-4" />
                Start Matchmaking
              </button>
            </>
          ) : (
            <>
              {/* Searching Animation */}
              <div className="mb-6 flex flex-col items-center">
                <div className="relative w-20 h-20 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-dark-700"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 border-r-transparent border-b-orange-500 border-l-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Swords className="w-7 h-7 text-orange-500" />
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Searching for opponent...</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">You'll be matched with the next available player</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    Search Time
                  </div>
                  <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{formatTime(waitTime)}</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                    <Users className="w-3.5 h-3.5" />
                    In Queue
                  </div>
                  <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{queueSize}</p>
                </div>
              </div>

              <button
                onClick={handleCancelSearch}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel Search
              </button>
            </>
          )}

          {/* Info Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-bold mb-3">Match Rules</h3>
              <ul className="text-gray-500 dark:text-gray-400 space-y-2 text-sm">
                <li>• Same DSA problem for both</li>
                <li>• 30-minute time limit</li>
                <li>• Fastest correct solution wins</li>
                <li>• ELO rating changes apply</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold mb-3">How It Works</h3>
              <ul className="text-gray-500 dark:text-gray-400 space-y-2 text-sm">
                <li>1. Click Start Matchmaking</li>
                <li>2. Wait for another player</li>
                <li>3. Solve the problem faster</li>
                <li>4. Win and climb the leaderboard!</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
