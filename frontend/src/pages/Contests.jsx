import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContestStore } from '../store/contestStore';
import { Trophy, Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <div className="glass border border-slate-700 rounded-lg p-4 sm:p-6 hover:border-indigo-500 transition">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            <h3 className="text-lg sm:text-xl font-bold">{contest.title}</h3>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              contest.type === 'weekly' ? 'bg-blue-900 text-blue-300' :
              contest.type === 'biweekly' ? 'bg-purple-900 text-purple-300' :
              'bg-pink-900 text-pink-300'
            }`}>
              {contest.type}
            </span>
            {contest.isRated && (
              <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs font-semibold">
                RATED
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mb-4">{contest.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>{new Date(contest.startTime).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{contest.duration} min</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Trophy className="w-4 h-4" />
              <span>{contest.problems?.length || 0} problems</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4" />
              <span>{contest.totalParticipants} registered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        {contest.status === 'upcoming' && (
          <div className="text-sm text-indigo-400 font-semibold">
            Starts in {getTimeUntilStart(contest.startTime)}
          </div>
        )}
        {contest.status === 'running' && (
          <div className="text-sm text-green-400 font-semibold animate-pulse">
            🔴 LIVE NOW
          </div>
        )}
        {contest.status === 'finished' && (
          <div className="text-sm text-slate-500">
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
              <ArrowRight className="w-4 h-4" />
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
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Register button for running contests if not registered */}
          {showEnter && !contest.isRegistered && (
            <button
              onClick={() => navigate(`/contests/${contest._id}`)}
              className="btn-primary flex items-center gap-2"
            >
              Register & Enter
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* View details for past contests */}
          {!showRegister && !showEnter && (
            <button
              onClick={() => navigate(`/contests/${contest._id}`)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition flex items-center gap-2"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Contests
          </h1>
          <p className="text-slate-400">
            Compete with others in timed coding contests and climb the leaderboard
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('running')}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeTab === 'running'
                ? 'border-green-500 text-green-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Live ({runningContests.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeTab === 'upcoming'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Upcoming ({upcomingContests.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeTab === 'past'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Past ({pastContests.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
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