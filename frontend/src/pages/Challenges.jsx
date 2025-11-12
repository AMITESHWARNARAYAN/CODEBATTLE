import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { TrophyIcon, CalendarIcon, UserGroupIcon, ClockIcon, ArrowLeftIcon, PlayIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import ThemeToggle from '../components/ThemeToggle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Challenges() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [upcomingChallenges, setUpcomingChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [activeRes, upcomingRes, completedRes] = await Promise.all([
        axios.get(`${API_URL}/challenges`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/challenges/upcoming`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/challenges/completed`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setActiveChallenges(activeRes.data);
      setUpcomingChallenges(upcomingRes.data);
      setCompletedChallenges(completedRes.data);
    } catch (error) {
      console.error('Fetch challenges error:', error);
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = async (challengeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/challenges/${challengeId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Challenge started!');
      // Navigate to solo practice with the problem
      navigate(`/match/solo?problemId=${response.data.problemId}&challengeId=${challengeId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start challenge');
    }
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const renderChallengeCard = (challenge, showStartButton = false) => (
    <div key={challenge._id} className="glass border border-slate-700 rounded-lg p-4 sm:p-6 hover:border-indigo-500 transition">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h3 className="text-lg sm:text-xl font-bold">{challenge.title}</h3>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              challenge.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
              challenge.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
              'bg-red-900 text-red-300'
            }`}>
              {challenge.difficulty}
            </span>
            {challenge.userStatus === 'completed' && (
              <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs font-semibold flex items-center gap-1">
                <CheckCircleIcon className="w-3 h-3" />
                Completed
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm sm:text-base mb-4">{challenge.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <TrophyIcon className="w-4 h-4 text-indigo-400" />
          <span>{challenge.problem?.title}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <UserGroupIcon className="w-4 h-4 text-indigo-400" />
          <span>{challenge.totalParticipants} participants</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <CalendarIcon className="w-4 h-4 text-indigo-400" />
          <span>{new Date(challenge.startDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <ClockIcon className="w-4 h-4 text-indigo-400" />
          <span>{getTimeRemaining(challenge.endDate)}</span>
        </div>
      </div>

      {challenge.rewards?.points > 0 && (
        <div className="mb-4 p-3 bg-indigo-900/20 border border-indigo-700 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <TrophyIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-indigo-300">
              Rewards: {challenge.rewards.points} points
              {challenge.rewards.badge && ` + ${challenge.rewards.badge} badge`}
            </span>
          </div>
        </div>
      )}

      {showStartButton && challenge.userStatus === 'not-started' && (
        <button
          onClick={() => handleStartChallenge(challenge._id)}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <PlayIcon className="w-4 h-4" />
          Start Challenge
        </button>
      )}

      {challenge.userStatus === 'in-progress' && (
        <button
          onClick={() => navigate(`/match/solo?problemId=${challenge.problem._id}&challengeId=${challenge._id}`)}
          className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition flex items-center justify-center gap-2"
        >
          <PlayIcon className="w-4 h-4" />
          Continue Challenge
        </button>
      )}

      {challenge.userStatus === 'completed' && challenge.userScore !== undefined && (
        <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-300">Your Score: {challenge.userScore}/100</span>
            <span className="text-slate-400">
              Completed {new Date(challenge.userCompletedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="glass border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Challenges</h1>
              <p className="text-sm text-slate-400">Complete challenges to earn rewards</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-sm text-slate-400">
              Welcome, {user?.username}
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-700 px-6">
        <div className="max-w-7xl mx-auto flex gap-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-4 px-2 font-semibold border-b-2 transition ${
              activeTab === 'active'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Active ({activeChallenges.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-4 px-2 font-semibold border-b-2 transition ${
              activeTab === 'upcoming'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Upcoming ({upcomingChallenges.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-4 px-2 font-semibold border-b-2 transition ${
              activeTab === 'completed'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Completed ({completedChallenges.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading challenges...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'active' && (
              <>
                {activeChallenges.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <TrophyIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No active challenges at the moment</p>
                  </div>
                ) : (
                  activeChallenges.map(challenge => renderChallengeCard(challenge, true))
                )}
              </>
            )}

            {activeTab === 'upcoming' && (
              <>
                {upcomingChallenges.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No upcoming challenges</p>
                  </div>
                ) : (
                  upcomingChallenges.map(challenge => renderChallengeCard(challenge, false))
                )}
              </>
            )}

            {activeTab === 'completed' && (
              <>
                {completedChallenges.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>You haven't completed any challenges yet</p>
                  </div>
                ) : (
                  completedChallenges.map(challenge => renderChallengeCard(challenge, false))
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

