import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContestStore } from '../store/contestStore';
import { Trophy, Calendar, Clock, Users, Award, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentContest, leaderboard, getContest, registerForContest, getLeaderboard, loading } = useContestStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadContest();
  }, [id]);

  const loadContest = async () => {
    try {
      await getContest(id);
      await getLeaderboard(id);
    } catch (error) {
      toast.error('Failed to load contest');
    }
  };

  const handleRegister = async () => {
    try {
      await registerForContest(id);
      toast.success('Successfully registered for contest!');
      loadContest();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  const handleEnterContest = () => {
    navigate(`/contests/${id}/live`);
  };

  if (loading || !currentContest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/contests')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Contests
        </button>

        {/* Contest Header */}
        <div className="glass border border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h1 className="text-3xl font-bold">{currentContest.title}</h1>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  currentContest.status === 'running' ? 'bg-green-900 text-green-300 animate-pulse' :
                  currentContest.status === 'upcoming' ? 'bg-blue-900 text-blue-300' :
                  currentContest.status === 'finished' ? 'bg-slate-800 text-slate-400' :
                  'bg-red-900 text-red-300'
                }`}>
                  {currentContest.status.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-400 mb-4">{currentContest.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-xs text-slate-500">Start Time</div>
                    <div className="font-semibold">{new Date(currentContest.startTime).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-xs text-slate-500">Duration</div>
                    <div className="font-semibold">{currentContest.duration} minutes</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Trophy className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-xs text-slate-500">Problems</div>
                    <div className="font-semibold">{currentContest.problems?.length || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-xs text-slate-500">Participants</div>
                    <div className="font-semibold">{currentContest.totalParticipants}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            {currentContest.status === 'upcoming' && !currentContest.userData && (
              <button
                onClick={handleRegister}
                className="btn-primary flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Register for Contest
              </button>
            )}
            {currentContest.status === 'upcoming' && currentContest.userData && (
              <div className="px-4 py-2 bg-green-900 text-green-300 rounded-lg font-semibold">
                ✓ Registered
              </div>
            )}
            {currentContest.status === 'running' && currentContest.userData && (
              <button
                onClick={handleEnterContest}
                className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                Enter Contest
              </button>
            )}
            {currentContest.isRated && (
              <div className="px-4 py-2 bg-purple-900 text-purple-300 rounded-lg font-semibold">
                Rated Contest
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeTab === 'problems'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Problems
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeTab === 'leaderboard'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Leaderboard
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="glass border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Contest Rules</h2>
            <div className="text-slate-300 whitespace-pre-line">
              {currentContest.rules || 'Standard contest rules apply.'}
            </div>

            {currentContest.prizes && currentContest.prizes.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Prizes
                </h2>
                <div className="space-y-2">
                  {currentContest.prizes.map((prize, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                      <span className="text-2xl">{prize.badge}</span>
                      <div>
                        <div className="font-semibold">Rank {prize.rank}</div>
                        <div className="text-sm text-slate-400">{prize.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="space-y-3">
            {currentContest.problems?.map((cp, index) => (
              <div key={cp._id} className="glass border border-slate-700 rounded-lg p-4 hover:border-indigo-500 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-slate-600">{index + 1}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{cp.problem?.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-sm font-semibold ${getDifficultyColor(cp.problem?.difficulty)}`}>
                          {cp.problem?.difficulty}
                        </span>
                        <span className="text-sm text-slate-400">{cp.points} points</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="glass border border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Penalty</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Solved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {leaderboard.map((participant) => (
                  <tr key={participant._id} className="hover:bg-slate-800 transition">
                    <td className="px-6 py-4">
                      <span className={`font-bold ${
                        participant.rank === 1 ? 'text-yellow-400' :
                        participant.rank === 2 ? 'text-slate-300' :
                        participant.rank === 3 ? 'text-orange-400' :
                        'text-slate-400'
                      }`}>
                        #{participant.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{participant.username}</td>
                    <td className="px-6 py-4 text-green-400 font-semibold">{participant.totalScore}</td>
                    <td className="px-6 py-4 text-slate-400">{participant.totalPenalty.toFixed(0)} min</td>
                    <td className="px-6 py-4 text-indigo-400">{participant.problemsSolved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leaderboard.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No participants yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

