import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContestStore } from '../store/contestStore';
import { Trophy, Clock, CheckCircle, XCircle, ArrowLeft, Code } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContestLive() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentContest, getContest, startContest, loading } = useContestStore();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    loadContest();
  }, [id]);

  useEffect(() => {
    if (!currentContest) return;

    // Check if user has started
    if (currentContest.userData?.startedAt) {
      setHasStarted(true);
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [currentContest]);

  const loadContest = async () => {
    try {
      await getContest(id);
    } catch (error) {
      toast.error('Failed to load contest');
      navigate('/contests');
    }
  };

  const updateTimer = () => {
    if (!currentContest?.userData?.startedAt) return;

    const startTime = new Date(currentContest.userData.startedAt);
    const endTime = new Date(startTime.getTime() + currentContest.duration * 60000);
    const now = new Date();
    const remaining = Math.max(0, endTime - now);

    setTimeRemaining(remaining);

    if (remaining === 0) {
      toast.error('Contest time is up!');
      navigate(`/contests/${id}`);
    }
  };

  const handleStartContest = async () => {
    try {
      await startContest(id);
      setHasStarted(true);
      toast.success('Contest started! Good luck!');
      loadContest();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start contest');
    }
  };

  const handleSolveProblem = (problem) => {
    // Navigate to code editor with contest context and problem data
    navigate(`/code-editor/contest-problem?contest=${id}&problem=${problem._id}`, {
      state: { problem, contestId: id }
    });
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProblemStatus = (problemId) => {
    if (!currentContest?.userData?.submissions) return null;
    
    const submissions = currentContest.userData.submissions.filter(
      s => s.problem.toString() === problemId.toString()
    );
    
    if (submissions.length === 0) return null;
    
    const hasAccepted = submissions.some(s => s.status === 'accepted');
    if (hasAccepted) return 'accepted';
    
    return 'attempted';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  if (loading || !currentContest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!currentContest.userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="glass border border-slate-700 rounded-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Not Registered</h2>
          <p className="text-slate-400 mb-6">You need to register for this contest first.</p>
          <button
            onClick={() => navigate(`/contests/${id}`)}
            className="btn-primary"
          >
            Go to Contest Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="glass border border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/contests/${id}`)}
                className="p-2 hover:bg-slate-800 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h1 className="text-2xl font-bold">{currentContest.title}</h1>
                </div>
                <p className="text-sm text-slate-400">
                  {currentContest.problems?.length} problems • {currentContest.duration} minutes
                </p>
              </div>
            </div>

            {hasStarted && (
              <div className="text-right">
                <div className="text-sm text-slate-400 mb-1">Time Remaining</div>
                <div className={`text-3xl font-bold font-mono ${
                  timeRemaining < 300000 ? 'text-red-400 animate-pulse' : 'text-green-400'
                }`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
            )}
          </div>

          {!hasStarted && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="text-center">
                <p className="text-slate-400 mb-4">
                  Click the button below to start your contest timer. Once started, you'll have {currentContest.duration} minutes to solve the problems.
                </p>
                <button
                  onClick={handleStartContest}
                  className="btn-primary text-lg px-8 py-3"
                >
                  Start Contest
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Problems List */}
        {hasStarted && (
          <div>
            <h2 className="text-xl font-bold mb-4">Problems</h2>
            <div className="space-y-3">
              {currentContest.problems?.map((cp, index) => {
                const status = getProblemStatus(cp.problem._id);
                
                return (
                  <div
                    key={cp._id}
                    className={`glass border rounded-lg p-4 hover:border-indigo-500 transition ${
                      status === 'accepted' ? 'border-green-500' :
                      status === 'attempted' ? 'border-yellow-500' :
                      'border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-slate-600">{index + 1}</span>
                          {status === 'accepted' && (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                          {status === 'attempted' && (
                            <XCircle className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{cp.problem?.title}</h3>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`font-semibold ${getDifficultyColor(cp.problem?.difficulty)}`}>
                              {cp.problem?.difficulty}
                            </span>
                            <span className="text-indigo-400 font-semibold">{cp.points} points</span>
                            {status === 'accepted' && (
                              <span className="text-green-400">✓ Solved</span>
                            )}
                            {status === 'attempted' && (
                              <span className="text-yellow-400">Attempted</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSolveProblem(cp.problem)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Code className="w-4 h-4" />
                        {status === 'accepted' ? 'View Solution' : 'Solve'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* User Stats */}
            <div className="glass border border-slate-700 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-bold mb-4">Your Progress</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {currentContest.userData.problemsSolved}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">Problems Solved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-400">
                    {currentContest.userData.totalScore}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">Total Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {currentContest.userData.totalPenalty.toFixed(0)}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">Penalty (min)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

