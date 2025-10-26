import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { toast } from 'react-hot-toast';
import { Trophy, TrendingUp, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { getUserProfile } = useUserStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(username);
        setProfile(data);
      } catch (error) {
        toast.error('Failed to load profile');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, getUserProfile, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Profile not found</p>
        </div>
      </div>
    );
  }

  const winRate = profile.totalMatches > 0 ? ((profile.wins / profile.totalMatches) * 100).toFixed(1) : 0;

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
          <h1 className="text-2xl font-bold">Player Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">{profile.username}</h2>
              <p className="text-slate-400">
                {profile.isOnline ? (
                  <span className="text-green-500">● Online</span>
                ) : (
                  <span className="text-slate-500">● Offline</span>
                )}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Rating</p>
              <p className="text-2xl font-bold text-indigo-500">{profile.rating}</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Wins</p>
              <p className="text-2xl font-bold text-green-500">{profile.wins}</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Losses</p>
              <p className="text-2xl font-bold text-red-500">{profile.losses}</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Draws</p>
              <p className="text-2xl font-bold text-slate-400">{profile.draws}</p>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-400">Total Matches</span>
                <span className="font-bold">{profile.totalMatches}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-400">Win Rate</span>
                <span className="font-bold text-green-500">{winRate}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-400">Highest Rating</span>
                <span className="font-bold text-yellow-500">{profile.highestRating}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-400">Lowest Rating</span>
                <span className="font-bold text-slate-400">{profile.lowestRating}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-400">Wins</span>
                <span className="font-bold text-green-500">{profile.wins}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-400">Losses</span>
                <span className="font-bold text-red-500">{profile.losses}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-400">Draws</span>
                <span className="font-bold text-slate-400">{profile.draws}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-400">Current Rating</span>
                <span className="font-bold text-indigo-500">{profile.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex-1"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="btn-primary flex-1"
          >
            View Leaderboard
          </button>
        </div>
      </main>
    </div>
  );
}

