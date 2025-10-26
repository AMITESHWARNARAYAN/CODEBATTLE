import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { Trophy, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Leaderboard() {
  const navigate = useNavigate();
  const { getLeaderboard, leaderboard, loading } = useUserStore();
  const [limit, setLimit] = useState(100);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        await getLeaderboard(limit);
      } catch (error) {
        toast.error('Failed to load leaderboard');
      }
    };

    fetchLeaderboard();
  }, [limit, getLeaderboard]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Global Leaderboard
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p>Loading leaderboard...</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Player</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Rating</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Wins</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Losses</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Draws</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Win Rate</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Matches</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, idx) => (
                    <tr
                      key={idx}
                      onClick={() => navigate(`/profile/${player.username}`)}
                      className="border-b border-slate-700 hover:bg-slate-800 transition cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {idx === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                          {idx === 1 && <Trophy className="w-5 h-5 text-gray-400" />}
                          {idx === 2 && <Trophy className="w-5 h-5 text-orange-600" />}
                          <span className="font-bold">{player.rank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold">{player.username}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-indigo-900 text-indigo-300 rounded-full font-bold">
                          {player.rating}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-green-500 font-semibold">{player.wins}</td>
                      <td className="px-6 py-4 text-center text-red-500 font-semibold">{player.losses}</td>
                      <td className="px-6 py-4 text-center text-slate-400 font-semibold">{player.draws}</td>
                      <td className="px-6 py-4 text-center font-semibold">{player.winRate}%</td>
                      <td className="px-6 py-4 text-center font-semibold">{player.totalMatches}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {leaderboard.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No players yet</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

