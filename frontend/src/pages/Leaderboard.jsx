import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { TrophyIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import ThemeToggle from '../components/ThemeToggle';
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
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition"
            >
              <ArrowLeftIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              <span className="text-gray-900 dark:text-white">Back</span>
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <TrophyIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
              Global Leaderboard
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 dark:border-dark-700 border-t-gray-900 dark:border-t-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Player</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Rating</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Wins</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Losses</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Draws</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Win Rate</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Matches</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, idx) => (
                    <tr
                      key={idx}
                      onClick={() => navigate(`/profile/${player.username}`)}
                      className="border-b border-gray-200 dark:border-dark-800 hover:bg-gray-50 dark:hover:bg-dark-800 transition cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {idx === 0 && <TrophyIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />}
                          {idx === 1 && <TrophyIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                          {idx === 2 && <TrophyIcon className="w-5 h-5 text-orange-600 dark:text-orange-500" />}
                          <span className="font-bold text-gray-900 dark:text-white">{player.rank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{player.username}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-gray-200 dark:bg-dark-800 text-gray-900 dark:text-white rounded-full font-bold">
                          {player.rating}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-green-600 dark:text-green-500 font-semibold">{player.wins}</td>
                      <td className="px-6 py-4 text-center text-red-600 dark:text-red-500 font-semibold">{player.losses}</td>
                      <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400 font-semibold">{player.draws}</td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">{player.winRate}%</td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">{player.totalMatches}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {leaderboard.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No players yet</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

