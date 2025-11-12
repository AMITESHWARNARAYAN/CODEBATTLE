import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { ChevronLeftIcon, Search, BarChartIcon, ChevronDownIcon, ChevronUpIcon, BuildingOfficeIcon, CheckIcon, ArrowTrendingUpIcon, CheckCircleIcon, CodeBracketIcon, FunnelIcon, XMarkIcon, SparklesIcon, AcademicCapIcon } from '@heroicons/react/24/solid';
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
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('acceptance');
  
  // Sidebar collapse states
  const [companiesExpanded, setCompaniesExpanded] = useState(true);
  const [listsExpanded, setListsExpanded] = useState(true);
  const [frequencyExpanded, setFrequencyExpanded] = useState(true);
  const [statusExpanded, setStatusExpanded] = useState(true);
  const [difficultyExpanded, setDifficultyExpanded] = useState(true);

  const companies = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Tesla', 'Adobe', 'Bloomberg', 'Uber', 'LinkedIn', 'Oracle', 'Salesforce', 'Twitter'];
  const lists = ['Top 100 Liked', 'Blind 75', 'NeetCodeBracketIcon 150', 'Top Interview Questions', 'Beginner Friendly', 'Amazon Top 50', 'Google Top 50', 'Meta Top 50', 'Microsoft Top 50', 'Apple Top 50'];
  const frequencies = ['6 Months', '1 Year', '2 Years', 'All Time'];
  const statuses = ['Solved', 'Unsolved'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchProblems();
  }, [selectedDifficulty, selectedCompany, selectedList, selectedFrequency, selectedStatus, searchQuery, sortBy]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch all problems
      const problemsResponse = await axios.get(`${API_URL}/problems`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let allProblems = problemsResponse.data;

      // Fetch metadata for each problem and merge
      const problemsWithMetadata = await Promise.all(
        allProblems.map(async (problem) => {
          try {
            const metadataResponse = await axios.get(`${API_URL}/problem-metadata/${problem._id}`);
            return { ...problem, metadata: metadataResponse.data };
          } catch (error) {
            return { ...problem, metadata: null };
          }
        })
      );

      let filteredProblems = problemsWithMetadata;

      // Apply filters
      if (searchQuery) {
        filteredProblems = filteredProblems.filter(p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedDifficulty) {
        filteredProblems = filteredProblems.filter(p => p.difficulty === selectedDifficulty);
      }

      if (selectedCompany) {
        filteredProblems = filteredProblems.filter(p =>
          p.metadata?.companies?.some(c => c.name === selectedCompany)
        );
      }

      if (selectedList) {
        filteredProblems = filteredProblems.filter(p =>
          p.metadata?.lists?.includes(selectedList)
        );
      }

      if (selectedFrequency) {
        filteredProblems = filteredProblems.filter(p => {
          const freq = getFrequencyValue(p.metadata?.frequencyData);
          return freq > 0;
        });
      }

      if (selectedStatus === 'Solved') {
        // Mock - in real app would check user's solved problems
        filteredProblems = filteredProblems.filter((_, idx) => idx % 3 === 0);
      } else if (selectedStatus === 'Unsolved') {
        filteredProblems = filteredProblems.filter((_, idx) => idx % 3 !== 0);
      }

      // Sort problems
      filteredProblems.sort((a, b) => {
        if (sortBy === 'acceptance') {
          return (b.acceptanceRate || 0) - (a.acceptanceRate || 0);
        } else if (sortBy === 'difficulty') {
          const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        } else if (sortBy === 'submissions') {
          return (b.totalSubmissions || 0) - (a.totalSubmissions || 0);
        } else if (sortBy === 'frequency') {
          const freqA = getFrequencyValue(a.metadata?.frequencyData);
          const freqB = getFrequencyValue(b.metadata?.frequencyData);
          return freqB - freqA;
        }
        return 0;
      });

      setProblems(filteredProblems);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      toast.error('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const getFrequencyValue = (frequencyData) => {
    if (!frequencyData) return 0;
    if (selectedFrequency === '6 Months') return frequencyData.sixMonths || 0;
    if (selectedFrequency === '1 Year') return frequencyData.oneYear || 0;
    if (selectedFrequency === '2 Years') return frequencyData.twoYears || 0;
    if (selectedFrequency === 'All Time') return frequencyData.allTime || 0;
    return frequencyData.allTime || 0;
  };

  const handleProblemClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const activeFiltersCount = [selectedDifficulty, selectedCompany, selectedList, selectedFrequency, selectedStatus].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gray-900 dark:bg-white rounded-lg">
                <CodeBracketIcon className="w-5 h-5 text-white dark:text-gray-900" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Practice Problems
              </h1>
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

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Filters</h2>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-gray-200 dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              
              {/* Companies FunnelIcon */}
              <div className="mb-4">
                <button
                  onClick={() => setCompaniesExpanded(!companiesExpanded)}
                  className="flex items-center justify-between w-full text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <BuildingOfficeIcon className="w-4 h-4" />
                    Companies
                  </span>
                  {companiesExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                </button>
                {companiesExpanded && (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {companies.map(company => (
                      <button
                        key={company}
                        onClick={() => setSelectedCompany(selectedCompany === company ? '' : company)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition ${
                          selectedCompany === company
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium'
                            : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Lists FunnelIcon */}
              <div className="mb-4">
                <button
                  onClick={() => setListsExpanded(!listsExpanded)}
                  className="flex items-center justify-between w-full text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4" />
                    Lists
                  </span>
                  {listsExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                </button>
                {listsExpanded && (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {lists.map(list => (
                      <button
                        key={list}
                        onClick={() => setSelectedList(selectedList === list ? '' : list)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition ${
                          selectedList === list
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium'
                            : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {list}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Frequency FunnelIcon */}
              <div className="mb-4">
                <button
                  onClick={() => setFrequencyExpanded(!frequencyExpanded)}
                  className="flex items-center justify-between w-full text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    Frequency
                  </span>
                  {frequencyExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                </button>
                {frequencyExpanded && (
                  <div className="space-y-1">
                    {frequencies.map(freq => (
                      <button
                        key={freq}
                        onClick={() => setSelectedFrequency(selectedFrequency === freq ? '' : freq)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition ${
                          selectedFrequency === freq
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium'
                            : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status FunnelIcon */}
              <div className="mb-4">
                <button
                  onClick={() => setStatusExpanded(!statusExpanded)}
                  className="flex items-center justify-between w-full text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    Status
                  </span>
                  {statusExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                </button>
                {statusExpanded && (
                  <div className="space-y-1">
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(selectedStatus === status ? '' : status)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition ${
                          selectedStatus === status
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium'
                            : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Difficulty FunnelIcon */}
              <div className="mb-4">
                <button
                  onClick={() => setDifficultyExpanded(!difficultyExpanded)}
                  className="flex items-center justify-between w-full text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <AcademicCapIcon className="w-4 h-4" />
                    Difficulty
                  </span>
                  {difficultyExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                </button>
                {difficultyExpanded && (
                  <div className="space-y-1">
                    {difficulties.map(diff => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? '' : diff)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition ${
                          selectedDifficulty === diff
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium'
                            : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedCompany('');
                    setSelectedList('');
                    setSelectedFrequency('');
                    setSelectedStatus('');
                    setSelectedDifficulty('');
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Problems List */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-5">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 transition"
                />
              </div>
            </div>

            {/* Stats and Sort Options */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="text-gray-900 dark:text-white font-semibold">{problems.length}</span> problems
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('acceptance')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                    sortBy === 'acceptance'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700'
                  }`}
                >
                  Acceptance
                </button>
                <button
                  onClick={() => setSortBy('difficulty')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                    sortBy === 'difficulty'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700'
                  }`}
                >
                  Difficulty
                </button>
                <button
                  onClick={() => setSortBy('frequency')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                    sortBy === 'frequency'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700'
                  }`}
                >
                  Frequency
                </button>
              </div>
            </div>

            {/* Problems Table */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-gray-300 dark:border-dark-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading problems...</p>
                </div>
              </div>
            ) : problems.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No problems found</p>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="space-y-2">
                {problems.map((problem, idx) => (
                  <div
                    key={problem._id}
                    onClick={() => handleProblemClick(problem._id)}
                    className="bg-white dark:bg-dark-900 hover:shadow-md border border-gray-200 dark:border-dark-800 rounded-lg p-4 cursor-pointer transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-dark-800 rounded font-semibold text-gray-600 dark:text-gray-400 text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {problem.title}
                          </h3>
                          {problem.metadata?.companies && problem.metadata.companies.length > 0 && (
                            <div className="flex gap-1.5 mt-1.5">
                              {problem.metadata.companies.slice(0, 3).map(company => (
                                <span key={company.name} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-dark-800 rounded text-gray-600 dark:text-gray-400">
                                  {company.name}
                                </span>
                              ))}
                              {problem.metadata.companies.length > 3 && (
                                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-dark-800 rounded text-gray-500 dark:text-gray-500">
                                  +{problem.metadata.companies.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                          problem.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                          'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        }`}>
                          {problem.difficulty}
                        </span>
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm bg-gray-100 dark:bg-dark-800 px-2.5 py-1 rounded">
                          <BarChartIcon className="w-3.5 h-3.5" />
                          <span className="font-medium">{problem.acceptanceRate || 0}%</span>
                        </div>
                        {selectedFrequency && problem.metadata?.frequencyData && (
                          <div className="w-20 h-1.5 bg-gray-200 dark:bg-dark-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-900 dark:bg-white"
                              style={{ width: `${Math.min(getFrequencyValue(problem.metadata.frequencyData), 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

