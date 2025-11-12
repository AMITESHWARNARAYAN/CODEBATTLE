import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useMatchStore } from '../store/matchStore';
import { useThemeStore } from '../store/themeStore';
import { ArrowRightOnRectangleIcon, TrophyIcon, BoltIcon, UserGroupIcon, CheckIcon, XMarkIcon, Cog6ToothIcon, CalendarIcon, TargetIcon, SparklesIcon, SparklesIcon, ArrowTrendingUpIcon, AcademicCapIcon, CodeBracketIcon, BoltIcon, BookOpenIcon, ArrowRightIcon, PlayIcon, ClockIcon, BarChartIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { getSocket, acceptChallenge as emitAcceptChallenge, rejectChallenge as emitRejectChallenge } from '../utils/socket';
import NotificationBellIcon from '../components/NotificationBellIcon';
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

  // TensorFlow color scheme
  const bgColor = isDark ? '#0a0a0a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1a1a1a';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb';
  const cardBg = isDark ? '#1a1a1a' : '#ffffff';

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

  const winRate = user?.totalMatches > 0 ? ((user.wins / user.totalMatches) * 100).toFixed(1) : 0;

  const stats = [
    {
      label: 'ELO Rating',
      value: user?.rating || 1200,
      icon: TrophyIcon,
      change: user?.rating > 1200 ? `+${user.rating - 1200}` : user?.rating < 1200 ? `${user.rating - 1200}` : '0',
      color: 'orange'
    },
    {
      label: 'Total Wins',
      value: user?.wins || 0,
      icon: BoltIcon,
      change: `${winRate}% WR`,
      color: 'green'
    },
    {
      label: 'Total Matches',
      value: user?.totalMatches || 0,
      icon: BoltIcon,
      change: `${user?.losses || 0} losses`,
      color: 'blue'
    },
    {
      label: 'Peak Rating',
      value: user?.highestRating || user?.rating || 1200,
      icon: AcademicCapIcon,
      change: 'All-time best',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {/* Header - TensorFlow Style */}
      <header className={`${cardBg} border-b ${borderColor} sticky top-0 z-50`} style={{ borderBottomWidth: '1px', borderBottomColor: isDark ? '#2a2a2a' : '#e5e7eb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur-sm opacity-50"></div>
                  <div className="relative p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg">
                    <CodeBracketIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h1 className={`text-xl font-bold ${textColor}`}>
                  CodeBattle
                </h1>
              </div>
              
              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-6">
                <button
                  onClick={() => navigate('/problems')}
                  className={`text-sm font-medium transition-colors ${textMuted} hover:text-orange-500`}
                >
                  Problems
                </button>
                <button
                  onClick={() => navigate('/contests')}
                  className={`text-sm font-medium transition-colors ${textMuted} hover:text-orange-500`}
                >
                  Contests
                </button>
                <button
                  onClick={() => navigate('/challenges')}
                  className={`text-sm font-medium transition-colors ${textMuted} hover:text-orange-500`}
                >
                  Challenges
                </button>
                <button
                  onClick={() => navigate('/resources')}
                  className={`text-sm font-medium transition-colors ${textMuted} hover:text-orange-500`}
                >
                  Resources
                </button>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className={`text-sm font-medium transition-colors ${textMuted} hover:text-orange-500`}
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => navigate('/discussions')}
                  className={`text-sm font-medium transition-colors ${textMuted} hover:text-orange-500`}
                >
                  Community
                </button>
              </nav>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDark ? 'bg-dark-800 border-dark-700' : 'bg-gray-50 border-gray-200'}`}>
                <span className={`${textColor} font-medium text-sm`}>{user?.username}</span>
              </div>
              <NotificationBellIcon />
              <ThemeToggle />
              {user?.isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition font-medium text-sm shadow-lg"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  <span className="hidden md:inline">Admin</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm border ${isDark ? 'bg-dark-800 hover:bg-dark-700 border-dark-700 text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-900'}`}
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={`hidden lg:block w-64 min-h-screen ${cardBg} border-r`} style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderRightWidth: '1px' }}>
          <div className="sticky top-20 p-6">
            {/* UserIcon InformationCircleIcon Card */}
            <div 
              className={`${cardBg} rounded-xl p-4 border mb-6 cursor-pointer transition-all duration-300 hover:shadow-lg`}
              style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
              onClick={() => navigate(`/profile/${user?.username}`)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={`font-semibold ${textColor} text-sm`}>{user?.username}</p>
                  <p className={`text-xs ${textMuted}`}>View Profile</p>
                </div>
              </div>
              <div className={`flex items-center justify-between py-2 px-3 rounded-lg ${isDark ? 'bg-dark-800' : 'bg-gray-50'}`}>
                <span className={`text-xs ${textMuted}`}>ELO Rating</span>
                <span className="text-sm font-bold text-orange-500">{user?.rating || 1200}</span>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="mb-6">
              <h3 className={`text-xs font-semibold ${textMuted} uppercase tracking-wider mb-3`}>Quick Links</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${textColor} hover:bg-orange-500 hover:text-white`}
                >
                  <BarChartIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </button>
                <button
                  onClick={() => navigate('/matchmaking')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${textMuted} hover:bg-orange-500 hover:text-white`}
                >
                  <BoltIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Matchmaking</span>
                </button>
                <button
                  onClick={() => navigate('/problems')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${textMuted} hover:bg-orange-500 hover:text-white`}
                >
                  <BookOpenIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Problems</span>
                </button>
                <button
                  onClick={() => navigate('/contests')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${textMuted} hover:bg-orange-500 hover:text-white`}
                >
                  <TrophyIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Contests</span>
                </button>
                <button
                  onClick={() => navigate('/challenges')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${textMuted} hover:bg-orange-500 hover:text-white`}
                >
                  <TargetIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Challenges</span>
                </button>
                <button
                  onClick={() => navigate('/daily-challenge')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${textMuted} hover:bg-orange-500 hover:text-white`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Daily Challenge</span>
                </button>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${textMuted} hover:bg-orange-500 hover:text-white`}
                >
                  <AcademicCapIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Leaderboard</span>
                </button>
                <button
                  onClick={() => navigate('/submissions')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${textMuted} hover:bg-orange-500 hover:text-white`}
                >
                  <CodeBracketIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Submissions</span>
                </button>
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
                  <span className={`text-xs ${textMuted}`}>Peak Rating</span>
                  <span className="text-sm font-bold text-orange-500">{user?.highestRating || user?.rating || 1200}</span>
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

        {/* Stats Grid - TensorFlow Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(`stat-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`${cardBg} rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
                  hoveredCard === `stat-${index}` ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
                }`}
                style={{ 
                  borderColor: isDark ? '#2a2a2a' : '#e5e7eb',
                  borderWidth: '1px'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-dark-800' : 'bg-gray-50'}`}>
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-dark-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    <ArrowTrendingUpIcon className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
                <p className={`text-sm ${textMuted} mb-2`}>{stat.label}</p>
                <p className={`text-4xl font-bold ${textColor}`}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Pending Challenges - TensorFlow Style */}
        {pendingChallenges.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h3 className={`text-2xl font-bold ${textColor}`}>Pending Challenges</h3>
              <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-semibold text-white shadow-lg">
                {pendingChallenges.length} New
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingChallenges.map((challenge) => (
                <div
                  key={challenge._id}
                  className={`${cardBg} rounded-xl p-6 border-l-4 border-orange-500 shadow-lg transition-all duration-300 hover:shadow-2xl`}
                  style={{ 
                    borderTopWidth: '1px',
                    borderRightWidth: '1px',
                    borderBottomWidth: '1px',
                    borderColor: isDark ? '#2a2a2a' : '#e5e7eb'
                  }}
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

                  <div className={`mb-4 p-4 rounded-lg border ${isDark ? 'bg-dark-800 border-dark-700' : 'bg-gray-50 border-gray-200'}`}>
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
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-lg"
                    >
                      <CheckIcon className="w-4 h-4" />
                      {challengeLoading[challenge._id] ? 'Accepting...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleRejectChallenge(challenge._id, challenge)}
                      disabled={challengeLoading[challenge._id]}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm border ${isDark ? 'bg-dark-800 hover:bg-dark-700 border-dark-700 text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-900'}`}
                    >
                      <XMarkIcon className="w-4 h-4" />
                      {challengeLoading[challenge._id] ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Action Banners - TensorFlow Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Daily Challenge Banner */}
          <div
            onClick={() => navigate('/daily-challenge')}
            onMouseEnter={() => setHoveredCard('daily')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`${cardBg} rounded-xl p-6 cursor-pointer transition-all duration-300 border ${
              hoveredCard === 'daily' ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
            }`}
            style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowRightIcon className="w-5 h-5 text-orange-500" />
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
            className={`${cardBg} rounded-xl p-6 cursor-pointer transition-all duration-300 border ${
              hoveredCard === 'challenges' ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
            }`}
            style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
                <TargetIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowRightIcon className="w-5 h-5 text-purple-500" />
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
            className={`${cardBg} rounded-xl p-6 cursor-pointer transition-all duration-300 border ${
              hoveredCard === 'contests' ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
            }`}
            style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowRightIcon className="w-5 h-5 text-blue-500" />
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

        {/* Game Modes - TensorFlow Style */}
        <div className="mb-12">
          <h3 className={`text-2xl font-bold ${textColor} mb-6`}>Choose Your Mode</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Matchmaking */}
            <div
              onClick={() => navigate('/matchmaking')}
              onMouseEnter={() => setHoveredCard('matchmaking')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`${cardBg} rounded-xl p-8 border cursor-pointer transition-all duration-300 ${
                hoveredCard === 'matchmaking' ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
              }`}
              style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
            >
              <div className="text-5xl mb-4">⚡</div>
              <h4 className={`text-xl font-bold ${textColor} mb-3`}>Matchmaking</h4>
              <p className={`text-sm ${textMuted} mb-6`}>
                Get matched with players of similar skill level and compete in real-time battles.
              </p>
              <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm">
                Start Matching
                <ArrowRightIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Friend Challenge */}
            <div
              onClick={() => navigate('/friend-challenge')}
              onMouseEnter={() => setHoveredCard('friend')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`${cardBg} rounded-xl p-8 border cursor-pointer transition-all duration-300 ${
                hoveredCard === 'friend' ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
              }`}
              style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
            >
              <div className="text-5xl mb-4">👥</div>
              <h4 className={`text-xl font-bold ${textColor} mb-3`}>Challenge Friend</h4>
              <p className={`text-sm ${textMuted} mb-6`}>
                PaperAirplaneIcon an invitation link to your friend and compete head-to-head in custom matches.
              </p>
              <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm">
                Challenge Now
                <ArrowRightIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Solo Practice */}
            <div
              onClick={() => navigate('/match/solo')}
              onMouseEnter={() => setHoveredCard('solo')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`${cardBg} rounded-xl p-8 border cursor-pointer transition-all duration-300 ${
                hoveredCard === 'solo' ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
              }`}
              style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
            >
              <div className="text-5xl mb-4">🎯</div>
              <h4 className={`text-xl font-bold ${textColor} mb-3`}>Solo Practice</h4>
              <p className={`text-sm ${textMuted} mb-6`}>
                Practice DSA problems at your own pace without time pressure or competition.
              </p>
              <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm">
                Start Practice
                <ArrowRightIcon className="w-4 h-4" />
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
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">📚</div>
                <BookOpenIcon className="w-5 h-5 text-orange-500" />
              </div>
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
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">🏆</div>
                <TrophyIcon className="w-5 h-5 text-orange-500" />
              </div>
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
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">📊</div>
                <BarChartIcon className="w-5 h-5 text-orange-500" />
              </div>
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
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">📝</div>
                <CodeBracketIcon className="w-5 h-5 text-orange-500" />
              </div>
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

