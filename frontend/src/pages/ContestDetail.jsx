import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContestStore } from '../store/contestStore';
import { Trophy, Calendar, Clock, Users, Award, ArrowLeft, CheckCircle, Play, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

export default function ContestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentContest, leaderboard, getContest, registerForContest, getLeaderboard, loading } = useContestStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [countdown, setCountdown] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => { loadContest(); }, [id]);

  const loadContest = async () => {
    try {
      await getContest(id);
      await getLeaderboard(id);
    } catch (error) {
      toast.error('Failed to load contest');
    }
  };

  // Live countdown
  useEffect(() => {
    if (!currentContest) return;
    const tick = () => {
      const now = new Date();
      if (currentContest.status === 'upcoming') {
        setCountdown(Math.max(0, new Date(currentContest.startTime) - now));
      } else if (currentContest.status === 'running') {
        setCountdown(Math.max(0, new Date(currentContest.endTime) - now));
      } else {
        setCountdown(0);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [currentContest]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await registerForContest(id);
      toast.success('Successfully registered!');
      loadContest();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  const handleEnterContest = () => {
    navigate(`/contests/${id}/live`);
  };

  const formatCountdown = (ms) => {
    if (ms === null || ms === 0) return '00:00:00';
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    if (d > 0) return `${d}d ${h}h ${m}m`;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getDifficultyColor = (d) => {
    if (d === 'Easy') return 'text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    if (d === 'Medium') return 'text-amber-600 dark:text-yellow-400 bg-amber-50 dark:bg-yellow-900/20';
    if (d === 'Hard') return 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    return 'text-gray-500';
  };

  if (loading || !currentContest) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const statusLabel = {
    upcoming: { text: 'Upcoming', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    running: { text: '🔴 LIVE', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 animate-pulse' },
    finished: { text: 'Ended', cls: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
    cancelled: { text: 'Cancelled', cls: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  };

  const st = statusLabel[currentContest.status] || statusLabel.upcoming;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/contests')} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition">
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Contest Details</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Contest Hero Card */}
        <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-2xl overflow-hidden mb-6">
          {/* Top gradient bar */}
          <div className={`h-2 ${currentContest.status === 'running' ? 'bg-gradient-to-r from-red-500 to-orange-500' : currentContest.status === 'upcoming' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`} />

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{currentContest.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${st.cls}`}>{st.text}</span>
                  {currentContest.isRated && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">RATED</span>
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{currentContest.description}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Start</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{new Date(currentContest.startTime).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{currentContest.duration} min</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                <Trophy className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Problems</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{currentContest.problems?.length || 0}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                <Users className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Participants</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{currentContest.totalParticipants}</div>
                </div>
              </div>
            </div>

            {/* Countdown + Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-800">
              <div>
                {currentContest.status === 'upcoming' && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Starts in <span className="font-bold text-blue-600 dark:text-blue-400 text-lg font-mono">{formatCountdown(countdown)}</span>
                  </div>
                )}
                {currentContest.status === 'running' && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Ends in <span className="font-bold text-red-500 text-lg font-mono">{formatCountdown(countdown)}</span>
                  </div>
                )}
                {currentContest.status === 'finished' && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Ended on {new Date(currentContest.endTime).toLocaleString()}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {/* Upcoming: Register */}
                {currentContest.status === 'upcoming' && !currentContest.isRegistered && (
                  <button onClick={handleRegister} disabled={registering} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium text-sm hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50">
                    <CheckCircle className="w-4 h-4" />
                    {registering ? 'Registering...' : 'Register'}
                  </button>
                )}
                {currentContest.status === 'upcoming' && currentContest.isRegistered && (
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl font-semibold text-sm">
                    <CheckCircle className="w-4 h-4" /> Registered
                  </div>
                )}

                {/* Running: Enter (registered or not — LeetCode-style) */}
                {currentContest.status === 'running' && (
                  <button onClick={handleEnterContest} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium text-sm hover:from-red-600 hover:to-orange-600 transition animate-pulse">
                    <Play className="w-4 h-4" />
                    Enter Contest
                  </button>
                )}

                {/* Finished: View Results */}
                {currentContest.status === 'finished' && (
                  <button onClick={() => setActiveTab('leaderboard')} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition">
                    <Trophy className="w-4 h-4" />
                    View Results
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-1">
          {['overview', 'problems', 'leaderboard'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition ${activeTab === tab ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contest Rules</h2>
            <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line text-sm leading-relaxed">
              {currentContest.rules || 'Standard contest rules apply.\n\n• You can submit multiple times for each problem\n• Wrong submissions incur a 20-minute penalty\n• Final ranking: most problems solved, then lowest penalty'}
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="space-y-3">
            {currentContest.status === 'upcoming' && (
              <div className="text-center py-12 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl">

                <p className="text-gray-500 dark:text-gray-400">Problems will be revealed when the contest starts</p>
              </div>
            )}
            {currentContest.status !== 'upcoming' && currentContest.problems?.map((cp, index) => (
              <div key={cp._id} className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-gray-300 dark:text-dark-600 w-8 text-center">{index + 1}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{cp.problem?.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getDifficultyColor(cp.problem?.difficulty)}`}>
                          {cp.problem?.difficulty}
                        </span>
                        <span className="text-sm text-orange-500 font-semibold">{cp.points} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Penalty</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Solved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-800">
                {leaderboard?.map((p, i) => (
                  <tr key={p.user?.toString() || i} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition">
                    <td className="px-6 py-3">
                      <span className={`font-bold ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {i === 0 ? '1st' : i === 1 ? '2nd' : i === 2 ? '3rd' : `#${i + 1}`}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-semibold text-gray-900 dark:text-white">{p.username}</td>
                    <td className="px-6 py-3 text-green-600 dark:text-green-400 font-semibold">{p.totalScore}</td>
                    <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{(p.totalPenalty || 0).toFixed(0)} min</td>
                    <td className="px-6 py-3 text-purple-600 dark:text-purple-400 font-semibold">{p.problemsSolved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!leaderboard || leaderboard.length === 0) && (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500">No participants yet</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
