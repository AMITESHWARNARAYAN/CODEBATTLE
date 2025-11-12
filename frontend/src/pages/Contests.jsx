import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContestStore } from '../store/contestStore';
import { TrophyIcon, CalendarIcon, ClockIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

export default function Contests() {
  const navigate = useNavigate();
  const { getUpcomingContests, getRunningContests, getPastContests, loading } = useContestStore();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [runningContests, setRunningContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      const [upcoming, running, past] = await Promise.all([
        getUpcomingContests(),
        getRunningContests(),
        getPastContests()
      ]);
      console.log('Upcoming contests:', upcoming);
      console.log('Running contests:', running);
      console.log('Past contests:', past);
      setUpcomingContests(upcoming);
      setRunningContests(running);
      setPastContests(past);
    } catch (error) {
      console.error('Failed to load contests:', error);
      toast.error('Failed to load contests');
    }
  };

  const getTimeUntilStart = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;
    
    if (diff < 0) return 'Started';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const ContestCard = ({ contest, showRegister = false, showEnter = false }) => {
    console.log('Contest card:', {
      title: contest.title,
      isRegistered: contest.isRegistered,
      showRegister,
      showEnter,
      status: contest.status
    });

    return (
    <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-4 sm:p-6 hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <TrophyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{contest.title}</h3>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              contest.type === 'weekly' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
              contest.type === 'biweekly' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' :
              'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
            }`}>
              {contest.type}
            </span>
            {contest.isRated && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-xs font-semibold">
                RATED
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4">{contest.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4" />
              <span>{new Date(contest.startTime).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <ClockIcon className="w-4 h-4" />
              <span>{contest.duration} min</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <TrophyIcon className="w-4 h-4" />
              <span>{contest.problems?.length || 0} problems</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <UserGroupIcon className="w-4 h-4" />
              <span>{contest.totalParticipants} registered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-800">
        {contest.status === 'upcoming' && (
          <div className="text-sm text-gray-900 dark:text-white font-semibold">
            Starts in {getTimeUntilStart(contest.startTime)}
          </div>
        )}
        {contest.status === 'running' && (
          <div className="text-sm text-green-600 dark:text-green-400 font-semibold animate-pulse">
            🔴 LIVE NOW
          </div>
        )}
        {contest.status === 'finished' && (
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Ended {new Date(contest.endTime).toLocaleDateString()}
          </div>
        )}

        <div className="flex gap-2">
          {/* Register button for upcoming contests */}
          {showRegister && !contest.isRegistered && (
            <button
              onClick={() => navigate(`/contests/${contest._id}`)}
              className="btn-primary flex items-center gap-2"
            >
              Register
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          )}

          {/* Already registered for upcoming contest */}
          {showRegister && contest.isRegistered && (
            <div className="px-4 py-2 bg-green-900 text-green-300 rounded-lg font-semibold">
              ✓ Registered
            </div>
          )}

          {/* Enter button for running contests if registered */}
          {showEnter && contest.isRegistered && (
            <button
              onClick={() => navigate(`/contests/${contest._id}/live`)}
              className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              Enter Contest
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          )}

          {/* Register button for running contests if not registered */}
          {showEnter && !contest.isRegistered && (
            <button
              onClick={() => navigate(`/contests/${contest._id}`)}
              className="btn-primary flex items-center gap-2"
            >
              Register & Enter
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          )}

          {/* View details for past contests */}
          {!showRegister && !showEnter && (
            <button
              onClick={() => navigate(`/contests/${contest._id}`)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition flex items-center gap-2"
            >
              View Details
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Contests
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Compete in timed coding contests and climb the leaderboard
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-dark-800">
          <button
            onClick={() => setActiveTab('running')}
            className={`py-2 px-4 font-medium border-b-2 transition text-sm ${
              activeTab === 'running'
                ? 'border-green-600 dark:border-green-400 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Live ({runningContests.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-2 px-4 font-medium border-b-2 transition text-sm ${
              activeTab === 'upcoming'
                ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Upcoming ({upcomingContests.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-2 px-4 font-medium border-b-2 transition text-sm ${
              activeTab === 'past'
                ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Past ({pastContests.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'running' && (
              runningContests.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  No contests running right now
                </div>
              ) : (
                runningContests.map((contest) => (
                  <ContestCard key={contest._id} contest={contest} showEnter />
                ))
              )
            )}

            {activeTab === 'upcoming' && (
              upcomingContests.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  No upcoming contests
                </div>
              ) : (
                upcomingContests.map((contest) => (
                  <ContestCard key={contest._id} contest={contest} showRegister />
                ))
              )
            )}

            {activeTab === 'past' && (
              pastContests.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  No past contests
                </div>
              ) : (
                pastContests.map((contest) => (
                  <ContestCard key={contest._id} contest={contest} />
                ))
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}