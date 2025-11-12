import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatchStore } from '../store/matchStore';
import { TrophyIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

export default function Results() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { getMatch } = useMatchStore();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const data = await getMatch(matchId);
        setMatch(data);
      } catch (error) {
        toast.error('Failed to load match results');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId, getMatch, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Match not found</p>
        </div>
      </div>
    );
  }

  const isMultiplayer = match.players.length > 1;
  const winner = match.winner;
  const ratingChanges = match.ratingChanges || [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Match Results</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Problem InformationCircleIcon */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-2">{match.problem?.title}</h2>
          <p className="text-slate-400">Difficulty: {match.problem?.difficulty}</p>
        </div>

        {/* Results */}
        {isMultiplayer ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {match.players.map((player, idx) => {
              const submission = match.submissions.find(s => s.userId === player._id);
              const ratingChange = ratingChanges.find(rc => rc.userId === player._id);
              const isWinner = winner && winner._id === player._id;

              return (
                <div
                  key={idx}
                  className={`card ${isWinner ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : ''}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{player.username}</h3>
                    {isWinner && <TrophyIcon className="w-6 h-6 text-yellow-500" />}
                  </div>

                  {submission && (
                    <div className="space-y-3 mb-6">
                      <div className="p-3 bg-slate-800 rounded">
                        <p className="text-slate-400 text-sm">Status</p>
                        <p className={`font-bold ${submission.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                          {submission.status}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-800 rounded">
                          <p className="text-slate-400 text-sm">Test Cases</p>
                          <p className="font-bold">{submission.testCasesPassed}/{submission.totalTestCases}</p>
                        </div>
                        <div className="p-3 bg-slate-800 rounded">
                          <p className="text-slate-400 text-sm">Time</p>
                          <p className="font-bold">{submission.executionTime}ms</p>
                        </div>
                        <div className="p-3 bg-slate-800 rounded">
                          <p className="text-slate-400 text-sm">Memory</p>
                          <p className="font-bold">{submission.memoryUsed}MB</p>
                        </div>
                        <div className="p-3 bg-slate-800 rounded">
                          <p className="text-slate-400 text-sm">Complexity</p>
                          <p className="font-bold text-xs">{submission.timeComplexity}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {ratingChange && (
                    <div className="p-3 bg-slate-800 rounded">
                      <p className="text-slate-400 text-sm mb-1">Rating Change</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{ratingChange.oldRating} → {ratingChange.newRating}</span>
                        <div className={`flex items-center gap-1 ${ratingChange.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {ratingChange.change >= 0 ? (
                            <ArrowTrendingUpIcon className="w-4 h-4" />
                          ) : (
                            <ArrowTrendingDownIcon className="w-4 h-4" />
                          )}
                          <span className="font-bold">{ratingChange.change > 0 ? '+' : ''}{ratingChange.change}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card mb-8">
            <h3 className="text-xl font-bold mb-4">Your Performance</h3>
            {match.submissions[0] && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-800 rounded">
                  <p className="text-slate-400 text-sm">Status</p>
                  <p className={`font-bold ${match.submissions[0].status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                    {match.submissions[0].status}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800 rounded">
                    <p className="text-slate-400 text-sm">Test Cases</p>
                    <p className="font-bold">{match.submissions[0].testCasesPassed}/{match.submissions[0].totalTestCases}</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded">
                    <p className="text-slate-400 text-sm">Time</p>
                    <p className="font-bold">{match.submissions[0].executionTime}ms</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded">
                    <p className="text-slate-400 text-sm">Memory</p>
                    <p className="font-bold">{match.submissions[0].memoryUsed}MB</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded">
                    <p className="text-slate-400 text-sm">Complexity</p>
                    <p className="font-bold text-xs">{match.submissions[0].timeComplexity}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex-1"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/matchmaking')}
            className="btn-primary flex-1"
          >
            PlayIcon Again
          </button>
        </div>
      </main>
    </div>
  );
}

