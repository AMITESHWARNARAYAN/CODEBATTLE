import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { ChevronLeft, Calendar, Flame, Trophy, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function DailyChallenge() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [challenge, setChallenge] = useState(null);
  const [userCompleted, setUserCompleted] = useState(false);
  const [streak, setStreak] = useState({ current: 0, longest: 0, totalCompleted: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyChallenge();
    fetchHistory();
  }, []);

  const fetchDailyChallenge = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/daily-challenge/today`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChallenge(response.data.challenge);
      setUserCompleted(response.data.userCompleted);
      setStreak(response.data.userStreak);
    } catch (error) {
      console.error('Failed to fetch daily challenge:', error);
      toast.error('Failed to load daily challenge');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/daily-challenge/history?limit=7`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const handleStartChallenge = () => {
    if (challenge?.problem) {
      navigate(`/match/solo?problemId=${challenge.problem._id}&dailyChallenge=true`);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-900/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'Hard': return 'text-red-400 bg-red-900/20';
      default: return 'text-slate-400 bg-slate-800/20';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading daily challenge...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 px-4 sm:px-6 py-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <h1 className="text-lg sm:text-2xl font-bold">Daily Challenge</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Challenge */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Challenge Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Today's Challenge</h2>
                </div>
                <div className="text-sm opacity-90">
                  {formatDate(new Date())}
                </div>
              </div>

              {challenge?.problem && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-bold">{challenge.problem.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(challenge.problem.difficulty)}`}>
                      {challenge.problem.difficulty}
                    </span>
                  </div>

                  <p className="text-white/80 text-lg line-clamp-3">
                    {challenge.problem.description}
                  </p>

                  <div className="flex items-center gap-4 pt-4">
                    {userCompleted ? (
                      <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-semibold">Completed!</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleStartChallenge}
                        className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition flex items-center gap-2"
                      >
                        <Clock className="w-5 h-5" />
                        Start Challenge
                      </button>
                    )}
                    <div className="text-white/70 text-sm">
                      {challenge.totalParticipants} participants today
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent History */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Recent Challenges
              </h3>
              <div className="space-y-3">
                {history.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No completed challenges yet</p>
                ) : (
                  history.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:bg-slate-800 transition"
                    >
                      <div className="flex items-center gap-4">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                          <h4 className="font-semibold">{item.problem.title}</h4>
                          <p className="text-sm text-slate-400">{formatDate(item.date)}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(item.problem.difficulty)}`}>
                        {item.problem.difficulty}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Streak Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="w-6 h-6" />
                <h3 className="text-xl font-bold">Current Streak</h3>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{streak.current}</div>
                <div className="text-white/80">days</div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Your Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Longest Streak</span>
                  <span className="font-bold text-xl">{streak.longest} days</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Total Completed</span>
                  <span className="font-bold text-xl">{streak.totalCompleted}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Completion Rate</span>
                  <span className="font-bold text-xl">
                    {streak.totalCompleted > 0 
                      ? Math.round((streak.totalCompleted / Math.max(streak.totalCompleted, 30)) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Streak Badges</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { days: 7, emoji: '🔥', name: 'Week Warrior', unlocked: streak.longest >= 7 },
                  { days: 30, emoji: '⚡', name: 'Month Master', unlocked: streak.longest >= 30 },
                  { days: 100, emoji: '💎', name: 'Century Club', unlocked: streak.longest >= 100 },
                  { days: 365, emoji: '👑', name: 'Year Legend', unlocked: streak.longest >= 365 }
                ].map((badge, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-center ${
                      badge.unlocked 
                        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                        : 'bg-slate-800/30 border border-slate-700 opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-1">{badge.emoji}</div>
                    <div className="text-xs font-semibold">{badge.name}</div>
                    <div className="text-xs text-slate-400">{badge.days} days</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

