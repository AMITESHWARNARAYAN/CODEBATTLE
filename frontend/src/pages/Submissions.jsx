import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { ChevronLeftIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ExclamationCircleIcon, CodeBracketIcon, CalendarIcon, FunnelIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Submissions() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
    fetchHeatmap();
  }, [page, filterStatus, filterLanguage]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = `${API_URL}/submissions?page=${page}&limit=20`;
      if (filterStatus) url += `&status=${filterStatus}`;
      if (filterLanguage) url += `&language=${filterLanguage}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(response.data.submissions);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/submissions/stats/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchHeatmap = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/submissions/calendar/heatmap`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHeatmapData(response.data);
    } catch (error) {
      console.error('Failed to fetch heatmap:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'Wrong Answer':
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case 'Time Limit Exceeded':
        return <ClockIcon className="w-5 h-5 text-yellow-400" />;
      default:
        return <ExclamationCircleIcon className="w-5 h-5 text-orange-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-400 bg-green-900/20';
      case 'Wrong Answer':
        return 'text-red-400 bg-red-900/20';
      case 'Time Limit Exceeded':
        return 'text-yellow-400 bg-yellow-900/20';
      default:
        return 'text-orange-400 bg-orange-900/20';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 dark:text-green-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Hard': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHeatmapColor = (count) => {
    if (count === 0) return 'bg-gray-200 dark:bg-dark-800';
    if (count <= 2) return 'bg-green-200 dark:bg-green-900/40';
    if (count <= 5) return 'bg-green-400 dark:bg-green-700/60';
    if (count <= 10) return 'bg-green-600 dark:bg-green-500/80';
    return 'bg-green-700 dark:bg-green-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 px-4 sm:px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submission History</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-6">
              <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Submissions</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSubmissions}</div>
            </div>
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-6">
              <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Accepted</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.acceptedSubmissions}</div>
            </div>
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-6">
              <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Acceptance Rate</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.acceptanceRate}%</div>
            </div>
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-6">
              <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Problems Solved</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.solvedProblems.total}</div>
              <div className="flex gap-2 mt-2 text-xs">
                <span className="text-green-600 dark:text-green-400">E: {stats.solvedProblems.easy}</span>
                <span className="text-yellow-600 dark:text-yellow-400">M: {stats.solvedProblems.medium}</span>
                <span className="text-red-600 dark:text-red-400">H: {stats.solvedProblems.hard}</span>
              </div>
            </div>
          </div>
        )}

        {/* Activity Heatmap */}
        <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <CalendarIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            Submission Activity
          </h3>
          <div className="overflow-x-auto">
            <div className="inline-flex gap-1">
              {heatmapData.slice(-365).map((day, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-sm ${getHeatmapColor(day.count)}`}
                  title={`${day.date}: ${day.count} submissions (${day.accepted} accepted)`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-dark-800" />
                <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40" />
                <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700/60" />
                <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500/80" />
                <div className="w-3 h-3 rounded-sm bg-green-700 dark:bg-green-400" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
          >
            <option value="">All Status</option>
            <option value="Accepted">Accepted</option>
            <option value="Wrong Answer">Wrong Answer</option>
            <option value="Time Limit Exceeded">Time Limit Exceeded</option>
            <option value="Runtime Error">Runtime Error</option>
            <option value="Compilation Error">Compilation Error</option>
          </select>

          <select
            value={filterLanguage}
            onChange={(e) => {
              setFilterLanguage(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
          >
            <option value="">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">No submissions found</div>
        ) : (
          <div className="space-y-3">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                onClick={() => navigate(`/submission/${submission._id}`)}
                className="bg-white dark:bg-dark-900 hover:shadow-md border border-gray-200 dark:border-dark-800 rounded-lg p-4 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(submission.status)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{submission.problem.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className={getDifficultyColor(submission.problem.difficulty)}>
                          {submission.problem.difficulty}
                        </span>
                        <span>•</span>
                        <span>{submission.language}</span>
                        <span>•</span>
                        <span>{formatDate(submission.submittedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                    {submission.runtime > 0 && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {submission.runtime}ms
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white rounded-lg">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 bg-white dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

