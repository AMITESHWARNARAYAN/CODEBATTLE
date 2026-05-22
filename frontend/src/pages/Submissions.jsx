import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import {
  ChevronLeft, CheckCircle, XCircle, Clock, AlertCircle,
  Filter, ChevronDown, ChevronUp, ArrowUpDown, Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Submission Heatmap (GitHub-style calendar) ───
function SubmissionHeatmap({ data }) {
  const weeks = useMemo(() => {
    // Build a full year of days (52 weeks + partial)
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    // Start from the nearest Sunday
    oneYearAgo.setDate(oneYearAgo.getDate() - oneYearAgo.getDay());

    // Index heatmap data by date string for O(1) lookup
    const dataMap = {};
    if (Array.isArray(data)) {
      data.forEach(d => { dataMap[d.date] = d; });
    }

    const allWeeks = [];
    let currentWeek = [];
    const cursor = new Date(oneYearAgo);

    while (cursor <= today) {
      const dateStr = cursor.toISOString().split('T')[0];
      const dayData = dataMap[dateStr] || { date: dateStr, count: 0, accepted: 0 };
      currentWeek.push(dayData);

      if (currentWeek.length === 7) {
        allWeeks.push(currentWeek);
        currentWeek = [];
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (currentWeek.length > 0) allWeeks.push(currentWeek);
    return allWeeks;
  }, [data]);

  const getColor = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-dark-800/60';
    if (count <= 2) return 'bg-green-200 dark:bg-green-900/50';
    if (count <= 5) return 'bg-green-400 dark:bg-green-700/70';
    if (count <= 10) return 'bg-green-500 dark:bg-green-500/80';
    return 'bg-green-600 dark:bg-green-400';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-0.5 min-w-[680px]">
          {/* Month labels */}
          <div className="flex gap-0.5 ml-0 mb-1">
            {weeks.map((week, wi) => {
              const firstDay = new Date(week[0]?.date);
              const showLabel = firstDay.getDate() <= 7 && wi > 0;
              return (
                <div key={wi} className="w-[11px] text-center">
                  {showLabel && (
                    <span className="text-[9px] text-gray-400 dark:text-gray-500">
                      {months[firstDay.getMonth()]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {/* Day grid — 7 rows (Sun–Sat), columns = weeks */}
          {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => (
            <div key={dayOfWeek} className="flex gap-0.5">
              {weeks.map((week, wi) => {
                const cell = week[dayOfWeek];
                if (!cell) return <div key={wi} className="w-[11px] h-[11px]" />;
                return (
                  <div
                    key={wi}
                    className={`w-[11px] h-[11px] rounded-[2px] ${getColor(cell.count)} transition-colors cursor-pointer hover:ring-1 hover:ring-gray-400 dark:hover:ring-gray-500`}
                    title={`${cell.date}: ${cell.count} submission${cell.count !== 1 ? 's' : ''} (${cell.accepted} accepted)`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400 dark:text-gray-500 justify-end">
        <span>Less</span>
        <div className="w-[11px] h-[11px] rounded-[2px] bg-gray-100 dark:bg-dark-800/60" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-green-200 dark:bg-green-900/50" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-green-400 dark:bg-green-700/70" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-green-500 dark:bg-green-500/80" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-green-600 dark:bg-green-400" />
        <span>More</span>
      </div>
    </div>
  );
}

// ─── Difficulty Badge ───
function DifficultyBadge({ difficulty }) {
  const colors = {
    Easy: 'text-emerald-500 dark:text-emerald-400',
    Medium: 'text-amber-500 dark:text-amber-400',
    Hard: 'text-red-500 dark:text-red-400',
  };
  return (
    <span className={`text-xs font-medium ${colors[difficulty] || 'text-gray-400'}`}>
      {difficulty}
    </span>
  );
}

// ─── Solved Ring SVG ───
function SolvedRing({ solved, total, easy, medium, hard, totalEasy, totalMedium, totalHard }) {
  const radius = 52;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? (solved / total) : 0;
  const dashOffset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[130px] h-[130px]">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor"
            className="text-gray-200 dark:text-dark-700" strokeWidth={stroke} />
          {/* Progress */}
          <circle cx="60" cy="60" r={radius} fill="none"
            stroke="url(#solvedGradient)" strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-out" />
          <defs>
            <linearGradient id="solvedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{solved}</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5">/{total}</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">Solved</span>
        </div>
      </div>

      {/* Difficulty breakdown */}
      <div className="mt-4 w-full space-y-2">
        {[
          { label: 'Easy', solved: easy, total: totalEasy, color: 'bg-emerald-500', textColor: 'text-emerald-500' },
          { label: 'Med.', solved: medium, total: totalMedium, color: 'bg-amber-500', textColor: 'text-amber-500' },
          { label: 'Hard', solved: hard, total: totalHard, color: 'bg-red-500', textColor: 'text-red-500' },
        ].map(d => (
          <div key={d.label} className="flex items-center gap-2">
            <span className={`text-xs font-medium w-8 ${d.textColor}`}>{d.label}</span>
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${d.color} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${d.total > 0 ? (d.solved / d.total) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
              {d.solved}/{d.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


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
  const [sortField, setSortField] = useState('submittedAt');
  const [sortDir, setSortDir] = useState('desc');
  const [expandedProblem, setExpandedProblem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [page, filterStatus, filterLanguage, sortField, sortDir]);

  useEffect(() => {
    fetchStats();
    fetchHeatmap();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = `${API_URL}/submissions?page=${page}&limit=15`;
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

  // ─── Group submissions by problem for LeetCode-style table ───
  const groupedSubmissions = useMemo(() => {
    const map = new Map();
    submissions.forEach(sub => {
      const pid = sub.problem?._id || sub.problem;
      if (!map.has(pid)) {
        map.set(pid, {
          problemId: pid,
          problemTitle: sub.problem?.title || 'Unknown Problem',
          difficulty: sub.problem?.difficulty || 'Medium',
          submissions: [],
          lastResult: sub.status,
          lastDate: sub.submittedAt,
          count: 0,
          accepted: false,
        });
      }
      const group = map.get(pid);
      group.submissions.push(sub);
      group.count++;
      if (sub.status === 'Accepted') group.accepted = true;
      // Keep latest
      if (new Date(sub.submittedAt) > new Date(group.lastDate)) {
        group.lastDate = sub.submittedAt;
        group.lastResult = sub.status;
      }
    });
    return Array.from(map.values());
  }, [submissions]);

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) {
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'text-emerald-600 dark:text-emerald-400';
      case 'Wrong Answer': return 'text-red-500 dark:text-red-400';
      case 'Time Limit Exceeded': return 'text-amber-500 dark:text-amber-400';
      default: return 'text-orange-500 dark:text-orange-400';
    }
  };

  const getStatusShort = (status) => {
    switch (status) {
      case 'Accepted': return 'Accepted';
      case 'Wrong Answer': return 'Wrong Answer';
      case 'Time Limit Exceeded': return 'TLE';
      case 'Runtime Error': return 'Runtime Error';
      case 'Compilation Error': return 'Compile Error';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* ─── Header ─── */}
      <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 px-4 sm:px-6 py-3 shadow-sm sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Practice History
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* ─── Main Layout ─── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ═══ Left Panel: Practice History Table ═══ */}
          <div className="flex-1 min-w-0">
            {/* Filter bar */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">
                Practice History
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition px-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900"
              >
                <Filter className="w-3.5 h-3.5" />
                Filter
              </button>
            </div>

            {/* Collapsible filters */}
            {showFilters && (
              <div className="flex flex-wrap gap-3 mb-4 animate-slide-in">
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="">All Status</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Wrong Answer">Wrong Answer</option>
                  <option value="Time Limit Exceeded">TLE</option>
                  <option value="Runtime Error">Runtime Error</option>
                  <option value="Compilation Error">Compilation Error</option>
                </select>
                <select
                  value={filterLanguage}
                  onChange={(e) => { setFilterLanguage(e.target.value); setPage(1); }}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="">All Languages</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
                {(filterStatus || filterLanguage) && (
                  <button
                    onClick={() => { setFilterStatus(''); setFilterLanguage(''); setPage(1); }}
                    className="text-sm text-red-500 hover:text-red-600 px-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* ─── Table ─── */}
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl overflow-hidden shadow-sm">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 dark:border-dark-800 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => { setSortField('submittedAt'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>
                  Last Submitted
                  <ArrowUpDown className="w-3 h-3" />
                </div>
                <div className="col-span-5">Problem</div>
                <div className="col-span-3">Last Result</div>
                <div className="col-span-2 text-center">Submissions</div>
              </div>

              {/* Rows */}
              {loading ? (
                <div className="py-16 text-center">
                  <div className="inline-flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-gray-300 dark:border-dark-600 border-t-emerald-500 rounded-full animate-spin" />
                    <span className="text-sm text-gray-400 dark:text-gray-500">Loading submissions…</span>
                  </div>
                </div>
              ) : groupedSubmissions.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-gray-400 dark:text-gray-500 text-sm">No submissions found</div>
                  <button onClick={() => navigate('/problems')}
                    className="mt-3 text-sm text-emerald-500 hover:text-emerald-400 transition">
                    Start solving problems →
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-dark-800/60">
                  {groupedSubmissions.map((group, idx) => (
                    <div key={group.problemId + '-' + idx}>
                      {/* Main row */}
                      <div
                        className="grid grid-cols-12 gap-2 px-4 py-3.5 items-center hover:bg-gray-50 dark:hover:bg-dark-800/40 transition-colors cursor-pointer group"
                        onClick={() => setExpandedProblem(expandedProblem === group.problemId ? null : group.problemId)}
                      >
                        {/* Date */}
                        <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(group.lastDate)}
                        </div>

                        {/* Problem */}
                        <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                          {group.accepted && (
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div
                              className="text-sm font-medium text-gray-900 dark:text-white truncate hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/problem/${group.problemId}`);
                              }}
                            >
                              {group.problemTitle}
                            </div>
                            <DifficultyBadge difficulty={group.difficulty} />
                          </div>
                        </div>

                        {/* Last Result */}
                        <div className="col-span-3">
                          <span className={`text-sm font-medium ${getStatusColor(group.lastResult)}`}>
                            {getStatusShort(group.lastResult)}
                          </span>
                        </div>

                        {/* Submission count */}
                        <div className="col-span-2 flex items-center justify-center gap-1">
                          <span className="text-sm text-gray-600 dark:text-gray-300">{group.count}</span>
                          {group.count > 1 ? (
                            expandedProblem === group.problemId
                              ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                              : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                          ) : null}
                        </div>
                      </div>

                      {/* Expanded sub-submissions */}
                      {expandedProblem === group.problemId && group.count > 1 && (
                        <div className="bg-gray-50/50 dark:bg-dark-800/20 border-t border-gray-100 dark:border-dark-800/60">
                          {group.submissions.map((sub, si) => (
                            <div
                              key={sub._id}
                              className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center hover:bg-gray-100/50 dark:hover:bg-dark-800/40 transition-colors cursor-pointer text-xs"
                              onClick={() => navigate(`/problem/${group.problemId}`)}
                            >
                              <div className="col-span-2 text-gray-400 dark:text-gray-500 pl-4">
                                {formatFullDate(sub.submittedAt)}
                              </div>
                              <div className="col-span-5 text-gray-500 dark:text-gray-400 pl-6">
                                {sub.language} • {sub.testCasesPassed}/{sub.totalTestCases} passed
                              </div>
                              <div className="col-span-3">
                                <span className={`font-medium ${getStatusColor(sub.status)}`}>
                                  {getStatusShort(sub.status)}
                                </span>
                              </div>
                              <div className="col-span-2 text-center text-gray-400 dark:text-gray-500">
                                {sub.runtime > 0 ? `${sub.runtime}ms` : '—'}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Pagination ─── */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ← Previous
                </button>
                <span className="text-gray-400 dark:text-gray-500">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* ═══ Right Panel: Summary ═══ */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-5">
            {/* Total Solved Card */}
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Total Solved
              </h3>
              {stats ? (
                <SolvedRing
                  solved={stats.solvedProblems?.total || 0}
                  total={stats.systemTotals?.total || 0}
                  easy={stats.solvedProblems?.easy || 0}
                  medium={stats.solvedProblems?.medium || 0}
                  hard={stats.solvedProblems?.hard || 0}
                  totalEasy={stats.systemTotals?.easy || 0}
                  totalMedium={stats.systemTotals?.medium || 0}
                  totalHard={stats.systemTotals?.hard || 0}
                />
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gray-300 dark:border-dark-600 border-t-emerald-500 rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-4 shadow-sm">
                <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Submissions
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalSubmissions || 0}
                </div>
              </div>
              <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-4 shadow-sm">
                <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Acceptance
                </div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats?.acceptanceRate || 0}
                  <span className="text-lg">%</span>
                </div>
              </div>
            </div>

            {/* Language Distribution */}
            {stats?.languageStats && stats.languageStats.length > 0 && (
              <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Languages
                </h3>
                <div className="space-y-2.5">
                  {stats.languageStats
                    .sort((a, b) => b.count - a.count)
                    .map(lang => {
                      const maxCount = Math.max(...stats.languageStats.map(l => l.count));
                      const pct = maxCount > 0 ? (lang.count / maxCount) * 100 : 0;
                      const langColors = {
                        javascript: 'bg-yellow-400',
                        python: 'bg-blue-500',
                        java: 'bg-orange-500',
                        cpp: 'bg-indigo-500',
                        c: 'bg-gray-500',
                        go: 'bg-cyan-500',
                        rust: 'bg-orange-600',
                        ruby: 'bg-red-500',
                      };
                      return (
                        <div key={lang._id} className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 dark:text-gray-400 w-16 truncate capitalize">
                            {lang._id}
                          </span>
                          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${langColors[lang._id] || 'bg-gray-400'} transition-all duration-500`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 dark:text-gray-500 w-8 text-right">
                            {lang.count}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Heatmap Card */}
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Activity
              </h3>
              <SubmissionHeatmap data={heatmapData} />
              {/* Total active days */}
              {Array.isArray(heatmapData) && (
                <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                  {heatmapData.filter(d => d.count > 0).length} active days in the past year
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
