import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useMatchStore } from '../store/matchStore';
import { useThemeStore } from '../store/themeStore';
import { LogOut, Trophy, Zap, Users, Check, X, Settings, Calendar, Target, Brain, Sparkles, TrendingUp, Award, Code2, Swords, BookOpen, ArrowRight, Play, Clock, BarChart3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getSocket } from '../utils/socket';
import NotificationBell from '../components/NotificationBell';
import ThemeToggle from '../components/ThemeToggle';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { getUserStats, userStats } = useUserStore();
  const { getPendingChallenges, acceptChallenge, rejectChallenge } = useMatchStore();
  const { isDark } = useThemeStore();
  const [loading, setLoading] = useState(true);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [challengeLoading, setChallengeLoading] = useState({});
  const [activeChallengesCount, setActiveChallengesCount] = useState(0);
  const [runningContestsCount, setRunningContestsCount] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Modern professional color scheme
  const bgColor = isDark ? 'bg-slate-950' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-slate-800' : 'border-gray-200';
  const cardBg = isDark ? 'bg-slate-900' : 'bg-white';
  const accentBg = isDark ? 'bg-slate-800' : 'bg-gray-50';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await getUserStats();
        await fetchPendingChallenges();
        await fetchRunningContests();
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [getUserStats]);

  const fetchRunningContests = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/contests/running`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const contests = await response.json();
      setRunningContestsCount(contests.length);
    } catch (error) {
      console.error('Failed to fetch running contests:', error);
    }
  };

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
      await acceptChallenge(matchId);
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

  const winRate = user?.totalMatches > 0 ? ((user.wins / user.totalMatches) * 100).toFixed(1) : 0;

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-200`}>
      {/* Header - Modern Professional */}
      <header className={`${cardBg} border-b ${borderColor} sticky top-0 z-50 backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="p-2 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg shadow-lg">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <h1 className={`text-xl font-bold ${textColor}`}>
                  CodeBattle
                </h1>
              </div>
              
              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1">
                {[
                  { label: 'Problems', route: '/problems' },
                  { label: 'Contests', route: '/contests' },
                  { label: 'Challenges', route: '/challenges' },
                  { label: 'Stories', route: '/stories' },
                  { label: 'Leaderboard', route: '/leaderboard' },
                  { label: 'Community', route: '/discussions' }
                ].map((item) => (
                  <button
                    key={item.route}
                    onClick={() => navigate(item.route)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${textMuted} hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDark ? 'bg-dark-800 border-dark-700' : 'bg-gray-50 border-gray-200'}`}>
                <span className={`${textColor} font-medium text-sm`}>{user?.username}</span>
              </div>
              <NotificationBell />
              <ThemeToggle />
              {user?.isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition font-medium text-sm shadow-lg"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden md:inline">Admin</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm border ${isDark ? 'bg-dark-800 hover:bg-dark-700 border-dark-700 text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-900'}`}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={`hidden lg:block w-64 min-h-screen ${cardBg} border-r ${borderColor}`}>
          <div className="sticky top-20 p-6">
            {/* User Info Card */}
            <div 
              className={`${cardBg} rounded-xl p-4 border-2 ${borderColor} mb-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-orange-500`}
              onClick={() => navigate(`/profile/${user?.username}`)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={`font-semibold ${textColor} text-sm`}>{user?.username}</p>
                  <p className={`text-xs ${textMuted}`}>View Profile</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg mb-2" style={{ backgroundColor: isDark ? 'rgba(30,30,30,0.5)' : '#f9fafb' }}>
                <span className={`text-xs ${textMuted}`}>Battle Rating</span>
                <span className="text-sm font-bold text-orange-500 dark:text-orange-400">{user?.rating || 0}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(30,30,30,0.5)' : '#f9fafb' }}>
                <span className={`text-xs ${textMuted}`}>Contest Rating</span>
                <span className="text-sm font-bold text-blue-500 dark:text-blue-400">{user?.contestRating || 0}</span>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="mb-6">
              <h3 className={`text-xs font-semibold ${textMuted} uppercase tracking-wider mb-3`}>Quick Links</h3>
              <nav className="space-y-1">
                {[
                  { icon: BarChart3, label: 'Dashboard', route: '/dashboard' },
                  { icon: Swords, label: 'Matchmaking', route: '/matchmaking' },
                  { icon: BookOpen, label: 'Problems', route: '/problems' },
                  { icon: Trophy, label: 'Contests', route: '/contests' },
                  { icon: Target, label: 'Challenges', route: '/challenges' },
                  { icon: Calendar, label: 'Daily Challenge', route: '/daily-challenge' },
                  { icon: Award, label: 'Leaderboard', route: '/leaderboard' },
                  { icon: Code2, label: 'Submissions', route: '/submissions' }
                ].map(({ icon: Icon, label, route }) => (
                  <button
                    key={route}
                    onClick={() => navigate(route)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${textMuted} hover:bg-orange-500/10 hover:text-orange-500 dark:hover:text-orange-400`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Stats Summary */}
            <div className={`${cardBg} rounded-xl p-4 border`} style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}>
              <h3 className={`text-xs font-semibold ${textMuted} uppercase tracking-wider mb-3`}>Your Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${textMuted}`}>Wins</span>
                  <span className={`text-sm font-bold ${textColor}`}>{user?.wins || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${textMuted}`}>Matches</span>
                  <span className={`text-sm font-bold ${textColor}`}>{user?.totalMatches || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${textMuted}`}>Win Rate</span>
                  <span className={`text-sm font-bold ${textColor}`}>{winRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${textMuted}`}>Peak Battle</span>
                  <span className="text-sm font-bold text-orange-500">{user?.highestRating || user?.rating || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${textMuted}`}>Peak Contest</span>
                  <span className="text-sm font-bold text-blue-500">{user?.contestHighestRating || user?.contestRating || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`
        {/* Welcome Section - TensorFlow Style */}
        <div className="mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold ${textColor} mb-3`}>
            Welcome back, <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{user?.username}</span>
          </h2>
          <p className={`text-lg ${textMuted}`}>Ready to compete and level up your coding skills?</p>
        </div>

        {/* Pending Challenges */}
        {pendingChallenges.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h3 className={`text-2xl font-bold ${textColor}`}>Pending Challenges</h3>
              <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full text-xs font-semibold text-white shadow-lg">
                {pendingChallenges.length} New
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingChallenges.map((challenge) => (
                <div
                  key={challenge._id}
                  className={`${cardBg} rounded-xl p-6 border-l-4 border-orange-500 shadow-lg transition-all duration-300 hover:shadow-2xl border ${borderColor}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className={`text-xs ${textMuted} mb-1`}>Challenge from</p>
                      <p className={`text-lg font-bold ${textColor}`}>{challenge.challengerEmail}</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-full text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                      Pending
                    </span>
                  </div>

                  <div className={`mb-4 p-4 rounded-lg border ${borderColor} ${accentBg}`}>
                    <p className={`text-xs ${textMuted} mb-1`}>Problem</p>
                    <p className={`font-semibold ${textColor} mb-2`}>{challenge.problem?.title}</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      challenge.problem?.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                      challenge.problem?.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                      'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    }`}>
                      {challenge.problem?.difficulty}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAcceptChallenge(challenge._id, challenge)}
                      disabled={challengeLoading[challenge._id]}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-lg"
                    >
                      <Check className="w-4 h-4" />
                      {challengeLoading[challenge._id] ? 'Accepting...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleRejectChallenge(challenge._id, challenge)}
                      disabled={challengeLoading[challenge._id]}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm border ${borderColor} ${accentBg} ${textColor} hover:border-red-400 hover:text-red-600`}
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

        {/* Quick Action Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Daily Challenge Banner */}
          <div
            onClick={() => navigate('/daily-challenge')}
            onMouseEnter={() => setHoveredCard('daily')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`${cardBg} rounded-xl p-6 cursor-pointer transition-all duration-300 border ${borderColor} ${
              hoveredCard === 'daily' ? 'transform scale-105 shadow-2xl border-orange-500' : 'shadow-lg'
            }`}
          >
            <div className="flex items-center justify-end mb-4">
              <ArrowRight className={`w-5 h-5 ${hoveredCard === 'daily' ? 'text-orange-600' : textMuted}`} />
            </div>
            <h3 className={`text-lg font-bold ${textColor} mb-2`}>Daily Challenge</h3>
            <p className={`text-sm ${textMuted}`}>
              Maintain your streak!
            </p>
          </div>

          {/* Admin Challenges Banner */}
          <div
            onClick={() => navigate('/challenges')}
            onMouseEnter={() => setHoveredCard('challenges')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`${cardBg} rounded-xl p-6 cursor-pointer transition-all duration-300 border ${borderColor} ${
              hoveredCard === 'challenges' ? 'transform scale-105 shadow-2xl border-yellow-500' : 'shadow-lg'
            }`}
          >
            <div className="flex items-center justify-end mb-4">
              <ArrowRight className={`w-5 h-5 ${hoveredCard === 'challenges' ? 'text-yellow-600' : textMuted}`} />
            </div>
            <h3 className={`text-lg font-bold ${textColor} mb-2`}>Challenges</h3>
            <p className={`text-sm ${textMuted}`}>
              Complete & earn rewards!
            </p>
          </div>

          {/* Contests Banner */}
          <div
            onClick={() => navigate('/contests')}
            onMouseEnter={() => setHoveredCard('contests')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`${cardBg} rounded-xl p-6 cursor-pointer transition-all duration-300 border ${borderColor} ${
              hoveredCard === 'contests' ? 'transform scale-105 shadow-2xl border-orange-600' : 'shadow-lg'
            }`}
          >
            <div className="flex items-center justify-end mb-4">
              <ArrowRight className={`w-5 h-5 ${hoveredCard === 'contests' ? 'text-orange-700' : textMuted}`} />
            </div>
            <h3 className={`text-lg font-bold ${textColor} mb-2`}>Contests</h3>
            <p className={`text-sm ${textMuted}`}>
              {runningContestsCount > 0 ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  {runningContestsCount} Live Now!
                </span>
              ) : (
                'Compete & climb the leaderboard!'
              )}
            </p>
          </div>
        </div>

        {/* Game Modes */}
        <div className="mb-12">
          <h3 className={`text-2xl font-bold ${textColor} mb-6`}>Choose Your Mode</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Matchmaking */}
            <div
              onClick={() => navigate('/matchmaking')}
              onMouseEnter={() => setHoveredCard('matchmaking')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`${cardBg} rounded-xl p-8 border ${borderColor} cursor-pointer transition-all duration-300 ${
                hoveredCard === 'matchmaking' ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
              }`}
            >
              <h4 className={`text-xl font-bold ${textColor} mb-3`}>Matchmaking</h4>
              <p className={`text-sm ${textMuted} mb-6`}>
                Get matched with players of similar skill level and compete in real-time battles.
              </p>
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold text-sm hover:text-orange-700 transition">
                Start Matching
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Friend Challenge */}
            <div
              onClick={() => navigate('/friend-challenge')}
              onMouseEnter={() => setHoveredCard('friend')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`${cardBg} rounded-xl p-8 border ${borderColor} cursor-pointer transition-all duration-300 ${
                hoveredCard === 'friend' ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
              }`}
            >
              <h4 className={`text-xl font-bold ${textColor} mb-3`}>Challenge Friend</h4>
              <p className={`text-sm ${textMuted} mb-6`}>
                Send an invitation link to your friend and compete head-to-head in custom matches.
              </p>
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-semibold text-sm hover:text-yellow-700 transition">
                Challenge Now
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Solo Practice */}
            <div
              onClick={() => navigate('/match/solo')}
              onMouseEnter={() => setHoveredCard('solo')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`${cardBg} rounded-xl p-8 border ${borderColor} cursor-pointer transition-all duration-300 ${
                hoveredCard === 'solo' ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
              }`}
            >
              <h4 className={`text-xl font-bold ${textColor} mb-3`}>Solo Practice</h4>
              <p className={`text-sm ${textMuted} mb-6`}>
                Practice DSA problems at your own pace without time pressure or competition.
              </p>
              <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm">
                Start Practice
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links - TensorFlow Style */}
        <div>
          <h3 className={`text-2xl font-bold ${textColor} mb-6`}>Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={() => navigate('/problems')}
              onMouseEnter={() => setHoveredCard('problems')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`${cardBg} rounded-xl p-6 border cursor-pointer transition-all duration-300 ${
                hoveredCard === 'problems' ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
              }`}
              style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
            >

              <h4 className={`text-lg font-bold ${textColor} mb-2`}>Practice Problems</h4>
              <p className={`text-sm ${textMuted}`}>Browse problems by category</p>
            </div>

            <div
              onClick={() => navigate('/leaderboard')}
              onMouseEnter={() => setHoveredCard('leaderboard')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`${cardBg} rounded-xl p-6 border cursor-pointer transition-all duration-300 ${
                hoveredCard === 'leaderboard' ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
              }`}
              style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
            >

              <h4 className={`text-lg font-bold ${textColor} mb-2`}>Leaderboard</h4>
              <p className={`text-sm ${textMuted}`}>See global rankings</p>
            </div>

            <div
              onClick={() => navigate(`/profile/${user?.username}`)}
              onMouseEnter={() => setHoveredCard('profile')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`${cardBg} rounded-xl p-6 border cursor-pointer transition-all duration-300 ${
                hoveredCard === 'profile' ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
              }`}
              style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
            >

              <h4 className={`text-lg font-bold ${textColor} mb-2`}>Your Profile</h4>
              <p className={`text-sm ${textMuted}`}>View your statistics</p>
            </div>

            <div
              onClick={() => navigate('/submissions')}
              onMouseEnter={() => setHoveredCard('submissions')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`${cardBg} rounded-xl p-6 border cursor-pointer transition-all duration-300 ${
                hoveredCard === 'submissions' ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
              }`}
              style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
            >

              <h4 className={`text-lg font-bold ${textColor} mb-2`}>Submissions</h4>
              <p className={`text-sm ${textMuted}`}>View your code history</p>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

