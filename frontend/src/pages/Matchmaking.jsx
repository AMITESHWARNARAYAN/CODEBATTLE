import { useEffect, useState } from 'react';
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
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function Matchmaking() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searching, setSearching] = useState(false);
  const [queuePosition, setQueuePosition] = useState(null);
  const [waitTime, setWaitTime] = useState(0);
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    // Listen for queue joined
    onQueueJoined((data) => {
      setSearching(true);
      setQueuePosition(data.position);
      toast.success('Joined matchmaking queue!');
    });

    // Listen for queue updates
    onQueueUpdate((data) => {
      setQueuePosition(data.position);
      setWaitTime(data.waitTime);
      setQueueSize(data.queueSize);
    });

    // Listen for match found
    onMatchFound((match) => {
      setSearching(false);
      toast.success('Match found! Starting game...');
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
    setQueuePosition(null);
    setWaitTime(0);
    toast.info('Left matchmaking queue');
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
          <h1 className="text-2xl font-bold">Matchmaking</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="card text-center">
          <h2 className="text-3xl font-bold mb-4">Find Your Opponent</h2>
          <p className="text-slate-400 mb-8">
            Get matched with players of similar skill level and compete in real-time
          </p>

          {!searching ? (
            <div>
              <div className="mb-8 p-6 bg-gray-100 dark:bg-dark-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-2">Your Current Rating</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{user?.rating || 1200}</p>
              </div>

              <button
                onClick={handleStartSearch}
                className="btn-primary text-lg py-3 px-8 w-full"
              >
                Start Searching
              </button>
            </div>
          ) : (
            <div className="py-12">
              {/* Searching Animation */}
              <div className="mb-8">
                <div className="flex justify-center mb-6">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-300 dark:border-dark-700 animate-pulse"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-gray-400 dark:border-dark-600 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute inset-4 rounded-full border-4 border-gray-500 dark:border-dark-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
                <p className="text-xl font-semibold mb-2">Searching for opponent...</p>
                <p className="text-gray-600 dark:text-gray-400">This may take a few moments</p>
              </div>

              {/* Queue Info */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Queue Position</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">#{queuePosition || '-'}</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Wait Time</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{waitTime}s</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Queue Size</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{queueSize}</p>
                </div>
              </div>

              <button
                onClick={handleCancelSearch}
                className="btn-secondary w-full"
              >
                Cancel Search
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-3">⚡ How It Works</h3>
            <ul className="text-slate-400 space-y-2 text-sm">
              <li>• You'll be matched with a player of similar rating</li>
              <li>• Both players get the same DSA problem</li>
              <li>• Solve it faster and better to win</li>
              <li>• Your rating changes based on the result</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-3">🏆 Rating System</h3>
            <ul className="text-slate-400 space-y-2 text-sm">
              <li>• Starting rating: 1200 (like Chess)</li>
              <li>• Win against higher rated: +more points</li>
              <li>• Win against lower rated: +fewer points</li>
              <li>• Losses deduct points accordingly</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

