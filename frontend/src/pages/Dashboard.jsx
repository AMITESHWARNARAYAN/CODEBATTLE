import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useMatchStore } from '../store/matchStore';
import { LogOut, Trophy, Zap, Users, Check, X, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getSocket, acceptChallenge as emitAcceptChallenge, rejectChallenge as emitRejectChallenge } from '../utils/socket';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { getUserStats, userStats } = useUserStore();
  const { getPendingChallenges, acceptChallenge, rejectChallenge } = useMatchStore();
  const [loading, setLoading] = useState(true);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [challengeLoading, setChallengeLoading] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await getUserStats();
        await fetchPendingChallenges();
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [getUserStats]);

  const fetchPendingChallenges = async () => {
    try {
      const challenges = await getPendingChallenges();
      setPendingChallenges(challenges);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    }
  };

  const handleAcceptChallenge = async (matchId, challenge) => {
    setChallengeLoading({ ...challengeLoading, [matchId]: true });
    try {
      const match = await acceptChallenge(matchId);

      // Notify challenger via socket
      emitAcceptChallenge(matchId, challenge.challengerEmail);

      toast.success('Challenge accepted! Starting match...');
      navigate(`/match/${matchId}`);
    } catch (error) {
      toast.error('Failed to accept challenge');
    } finally {
      setChallengeLoading({ ...challengeLoading, [matchId]: false });
    }
  };

  const handleRejectChallenge = async (matchId, challenge) => {
    setChallengeLoading({ ...challengeLoading, [matchId]: true });
    try {
      await rejectChallenge(matchId);

      // Notify challenger via socket
      emitRejectChallenge(matchId, challenge.challengerEmail);

      toast.success('Challenge rejected');
      setPendingChallenges(pendingChallenges.filter(c => c._id !== matchId));
    } catch (error) {
      toast.error('Failed to reject challenge');
    } finally {
      setChallengeLoading({ ...challengeLoading, [matchId]: false });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const stats = [
    { label: 'Rating', value: user?.rating || 1200, icon: Trophy, color: 'text-yellow-500' },
    { label: 'Wins', value: user?.wins || 0, icon: Zap, color: 'text-green-500' },
    { label: 'Losses', value: user?.losses || 0, icon: Users, color: 'text-red-500' },
    { label: 'Matches', value: user?.totalMatches || 0, icon: Trophy, color: 'text-blue-500' }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold gradient-text">CodeBattle</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{user?.username}</span>
            {user?.isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2">Welcome back, {user?.username}! 👋</h2>
          <p className="text-slate-400">Ready to compete and improve your coding skills?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pending Challenges */}
        {pendingChallenges.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">🎯 Pending Challenges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingChallenges.map((challenge) => (
                <div key={challenge._id} className="card border-l-4 border-indigo-500">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-slate-400 text-sm">Challenge from</p>
                      <p className="text-lg font-bold">{challenge.challengerEmail}</p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-600 rounded-full text-xs font-semibold">Pending</span>
                  </div>

                  <div className="mb-4 p-3 bg-slate-800 rounded">
                    <p className="text-slate-400 text-xs mb-1">Problem</p>
                    <p className="font-semibold">{challenge.problem?.title}</p>
                    <p className="text-xs text-slate-400 mt-1">Difficulty: {challenge.problem?.difficulty}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptChallenge(challenge._id, challenge)}
                      disabled={challengeLoading[challenge._id]}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {challengeLoading[challenge._id] ? 'Accepting...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleRejectChallenge(challenge._id, challenge)}
                      disabled={challengeLoading[challenge._id]}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      {challengeLoading[challenge._id] ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Modes */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Choose Your Battle Mode</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Matchmaking */}
            <div
              onClick={() => navigate('/matchmaking')}
              className="card cursor-pointer hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all group"
            >
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition">Matchmaking</h4>
              <p className="text-slate-400 mb-4">
                Get matched with players of similar skill level. Compete in real-time and climb the rankings.
              </p>
              <div className="flex items-center gap-2 text-indigo-500 font-semibold">
                Start Matching →
              </div>
            </div>

            {/* Friend Challenge */}
            <div
              onClick={() => navigate('/friend-challenge')}
              className="card cursor-pointer hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all group"
            >
              <div className="text-4xl mb-4">👥</div>
              <h4 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition">Challenge Friend</h4>
              <p className="text-slate-400 mb-4">
                Send an invitation link to your friend and compete head-to-head in a private match.
              </p>
              <div className="flex items-center gap-2 text-purple-500 font-semibold">
                Challenge →
              </div>
            </div>

            {/* Solo Practice */}
            <div
              onClick={() => navigate('/match/solo')}
              className="card cursor-pointer hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/20 transition-all group"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-bold mb-2 group-hover:text-pink-400 transition">Solo Practice</h4>
              <p className="text-slate-400 mb-4">
                Practice DSA problems at your own pace. No time pressure, just pure coding.
              </p>
              <div className="flex items-center gap-2 text-pink-500 font-semibold">
                Practice →
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate('/problems')}
            className="card cursor-pointer hover:border-indigo-500 transition-all group"
          >
            <h4 className="text-lg font-bold mb-2 group-hover:text-indigo-400">📚 Practice Problems</h4>
            <p className="text-slate-400">Browse and practice problems by category</p>
          </div>

          <div
            onClick={() => navigate('/leaderboard')}
            className="card cursor-pointer hover:border-yellow-500 transition-all group"
          >
            <h4 className="text-lg font-bold mb-2 group-hover:text-yellow-400">🏆 Global Leaderboard</h4>
            <p className="text-slate-400">See where you stand against other players worldwide</p>
          </div>

          <div
            onClick={() => navigate(`/profile/${user?.username}`)}
            className="card cursor-pointer hover:border-cyan-500 transition-all group"
          >
            <h4 className="text-lg font-bold mb-2 group-hover:text-cyan-400">📊 Your Profile</h4>
            <p className="text-slate-400">View your detailed statistics and match history</p>
          </div>
        </div>
      </main>
    </div>
  );
}

