import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { ChevronLeft, Search, ChevronDown, ChevronUp, Building2, ListChecks, CheckCircle2, Code2, X, Award, Circle, Flame, Tag, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Problems() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedList, setSelectedList] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [allTags, setAllTags] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Sidebar collapse states
  const [topicsExpanded, setTopicsExpanded] = useState(true);
  const [companiesExpanded, setCompaniesExpanded] = useState(false);
  const [listsExpanded, setListsExpanded] = useState(false);
  const [statusExpanded, setStatusExpanded] = useState(false);
  const [difficultyExpanded, setDifficultyExpanded] = useState(true);

  // Search debounce
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const companies = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Adobe', 'Bloomberg', 'Uber'];
  const lists = ['Top 100 Liked', 'Blind 75', 'NeetCode 150', 'Top Interview Questions', 'Beginner Friendly'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (selectedDifficulty) params.set('difficulty', selectedDifficulty);
      if (selectedTag) params.set('tag', selectedTag);
      if (selectedCompany) params.set('company', selectedCompany);
      if (selectedList) params.set('list', selectedList);
      if (selectedStatus) params.set('status', selectedStatus.toLowerCase());
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (sortBy) params.set('sort', sortBy);
      params.set('page', page);
      params.set('limit', 50);

      const res = await axios.get(`${API_URL}/problems?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Handle both old format (array) and new format (object with problems)
      if (Array.isArray(res.data)) {
        setProblems(res.data);
        setPagination({ total: res.data.length, totalPages: 1 });
        setAllTags([]);
      } else {
        setProblems(res.data.problems || []);
        setPagination(res.data.pagination || { total: 0, totalPages: 1 });
        if (res.data.allTags?.length) setAllTags(res.data.allTags);
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      toast.error('Failed to load problems');
    } finally {
      setLoading(false);
    }
  }, [selectedDifficulty, selectedTag, selectedCompany, selectedList, selectedStatus, debouncedSearch, sortBy, page]);

  useEffect(() => { fetchProblems(); }, [fetchProblems]);
  useEffect(() => { setPage(1); }, [selectedDifficulty, selectedTag, selectedCompany, selectedList, selectedStatus, debouncedSearch, sortBy]);

  const activeFiltersCount = [selectedDifficulty, selectedCompany, selectedList, selectedStatus, selectedTag].filter(Boolean).length;
  const clearFilters = () => { setSelectedDifficulty(''); setSelectedCompany(''); setSelectedList(''); setSelectedStatus(''); setSelectedTag(''); setSearchQuery(''); };

  const diffColor = (d) => d === 'Easy' ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' : d === 'Medium' ? 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30' : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
  const diffDot = (d) => d === 'Easy' ? 'bg-green-500' : d === 'Medium' ? 'bg-orange-500' : 'bg-red-500';

  // Sidebar filter section component
  const FilterSection = ({ title, icon: Icon, expanded, setExpanded, children }) => (
    <div className="mb-3">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full text-sm font-medium mb-1.5 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition">
        <span className="flex items-center gap-2"><Icon className="w-4 h-4" />{title}</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {expanded && children}
    </div>
  );

  const FilterButton = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`w-full text-left px-3 py-1.5 rounded text-sm transition ${active ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium' : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300'}`}>{label}</button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition">
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gray-900 dark:bg-white rounded-lg"><Code2 className="w-5 h-5 text-white dark:text-gray-900" /></div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Practice Problems</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
              <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{user?.username}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* ═══ SIDEBAR ═══ */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Filters</h2>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-gray-200 dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300">{activeFiltersCount}</span>
                )}
              </div>

              {/* ── TOPICS (Tags) ── */}
              <FilterSection title="Topics" icon={Tag} expanded={topicsExpanded} setExpanded={setTopicsExpanded}>
                <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
                  {allTags.length > 0 ? allTags.map(tag => (
                    <FilterButton key={tag} label={tag} active={selectedTag === tag} onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)} />
                  )) : (
                    <p className="text-xs text-gray-500 dark:text-gray-500 px-3 py-2">No topics available</p>
                  )}
                </div>
              </FilterSection>

              {/* ── DIFFICULTY ── */}
              <FilterSection title="Difficulty" icon={Award} expanded={difficultyExpanded} setExpanded={setDifficultyExpanded}>
                <div className="space-y-0.5">
                  {difficulties.map(d => (
                    <FilterButton key={d} label={d} active={selectedDifficulty === d} onClick={() => setSelectedDifficulty(selectedDifficulty === d ? '' : d)} />
                  ))}
                </div>
              </FilterSection>

              {/* ── STATUS ── */}
              <FilterSection title="Status" icon={CheckCircle2} expanded={statusExpanded} setExpanded={setStatusExpanded}>
                <div className="space-y-0.5">
                  {['Solved', 'Unsolved'].map(s => (
                    <FilterButton key={s} label={s} active={selectedStatus === s} onClick={() => setSelectedStatus(selectedStatus === s ? '' : s)} />
                  ))}
                </div>
              </FilterSection>

              {/* ── COMPANIES ── */}
              <FilterSection title="Companies" icon={Building2} expanded={companiesExpanded} setExpanded={setCompaniesExpanded}>
                <div className="space-y-0.5 max-h-48 overflow-y-auto">
                  {companies.map(c => (
                    <FilterButton key={c} label={c} active={selectedCompany === c} onClick={() => setSelectedCompany(selectedCompany === c ? '' : c)} />
                  ))}
                </div>
              </FilterSection>

              {/* ── LISTS ── */}
              <FilterSection title="Lists" icon={ListChecks} expanded={listsExpanded} setExpanded={setListsExpanded}>
                <div className="space-y-0.5 max-h-48 overflow-y-auto">
                  {lists.map(l => (
                    <FilterButton key={l} label={l} active={selectedList === l} onClick={() => setSelectedList(selectedList === l ? '' : l)} />
                  ))}
                </div>
              </FilterSection>

              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 mt-2">
                  <X className="w-4 h-4" /> Clear All
                </button>
              )}
            </div>
          </div>

          {/* ═══ MAIN CONTENT ═══ */}
          <div className="flex-1 min-w-0">
            {/* Active Tag Indicator */}
            {selectedTag && (
              <div className="mb-4 flex items-center gap-2 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg px-4 py-3">
                <Tag className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Topic: <span className="text-orange-600 dark:text-orange-400">{selectedTag}</span></span>
                <button onClick={() => setSelectedTag('')} className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-dark-800 rounded transition"><X className="w-3.5 h-3.5 text-gray-500" /></button>
              </div>
            )}

            {/* Search */}
            <div className="mb-5">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search problems..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 transition" />
              </div>
            </div>

            {/* Stats + Sort */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="text-gray-900 dark:text-white font-semibold">{problems.length}</span> of {pagination.total} problems
              </div>
              <div className="flex gap-2">
                {['acceptance', 'difficulty', 'frequency'].map(s => (
                  <button key={s} onClick={() => setSortBy(sortBy === s ? '' : s)} className={`px-3 py-1.5 rounded text-sm font-medium transition ${sortBy === s ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700'}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Problems Table */}
            {loading ? (
              <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg overflow-hidden">
                <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 font-semibold text-sm text-gray-700 dark:text-gray-300">
                  <div className="col-span-1">Status</div><div className="col-span-1">#</div><div className="col-span-5">Title</div>
                  <div className="col-span-2">Difficulty</div><div className="col-span-2">Acceptance</div><div className="col-span-1">Popular</div>
                </div>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 dark:border-dark-800 animate-pulse">
                    <div className="col-span-1"><div className="w-6 h-6 bg-gray-200 dark:bg-dark-700 rounded-full" /></div>
                    <div className="col-span-1"><div className="w-8 h-5 bg-gray-200 dark:bg-dark-700 rounded" /></div>
                    <div className="col-span-5"><div className="h-5 bg-gray-200 dark:bg-dark-700 rounded w-3/4" /></div>
                    <div className="col-span-2"><div className="h-5 bg-gray-200 dark:bg-dark-700 rounded w-16" /></div>
                    <div className="col-span-2"><div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-20" /></div>
                    <div className="col-span-1" />
                  </div>
                ))}
              </div>
            ) : problems.length === 0 ? (
              <div className="text-center py-20">

                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No problems found</p>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 font-semibold text-sm text-gray-700 dark:text-gray-300">
                  <div className="col-span-1">Status</div><div className="col-span-1">#</div><div className="col-span-5">Title</div>
                  <div className="col-span-2">Difficulty</div><div className="col-span-2">Acceptance</div><div className="col-span-1">Popular</div>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-dark-800">
                  {problems.map((problem, idx) => (
                    <div key={problem._id} onClick={() => navigate(`/problem/${problem._id}`)}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-4 px-6 py-4 hover:bg-orange-50 dark:hover:bg-orange-900/10 cursor-pointer transition duration-150 items-center group">
                      {/* Status */}
                      <div className="col-span-1 flex items-center">
                        {problem.solved ? (
                          <div className="flex items-center justify-center w-6 h-6 bg-green-500/20 rounded-full" title="Solved">
                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-dark-700 rounded-full" title="Unsolved">
                            <Circle className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Number */}
                      <div className="col-span-1">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-800 px-2.5 py-1 rounded">
                          {(page - 1) * 50 + idx + 1}
                        </span>
                      </div>

                      {/* Title + Tags */}
                      <div className="col-span-5">
                        <div className="flex flex-col">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                            {problem.title}
                          </h3>
                          {problem.tags?.length > 0 && (
                            <div className="flex gap-1 mt-1.5 flex-wrap">
                              {problem.tags.slice(0, 3).map(tag => (
                                <span key={tag} onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); }} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-dark-800 rounded text-gray-600 dark:text-gray-400 hover:bg-orange-100 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition cursor-pointer">
                                  {tag}
                                </span>
                              ))}
                              {problem.tags.length > 3 && <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-dark-800 rounded text-gray-500 dark:text-gray-500">+{problem.tags.length - 3}</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Difficulty */}
                      <div className="col-span-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold gap-1 ${diffColor(problem.difficulty)}`}>
                          <span className={`w-2 h-2 rounded-full ${diffDot(problem.difficulty)}`} />
                          {problem.difficulty}
                        </span>
                      </div>

                      {/* Acceptance */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-gray-200 dark:bg-dark-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500" style={{ width: `${problem.acceptanceRate || 0}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-10 text-right">{problem.acceptanceRate || 0}%</span>
                        </div>
                      </div>

                      {/* Frequency/Hot */}
                      <div className="col-span-1 flex justify-end">
                        {problem.frequency > 50 && (
                          <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded" title="Popular">
                            <Flame className="w-3.5 h-3.5" /><span>Hot</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-dark-700 hover:bg-gray-100 dark:hover:bg-dark-800 disabled:opacity-30 transition">
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition ${page === p ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-700'}`}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-dark-700 hover:bg-gray-100 dark:hover:bg-dark-800 disabled:opacity-30 transition">
                  <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
