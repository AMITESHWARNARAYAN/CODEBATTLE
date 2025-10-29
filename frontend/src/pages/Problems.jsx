import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { ChevronLeft, Search, BarChart3, ChevronDown, ChevronUp, Building2, ListChecks, TrendingUp, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

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
  const lists = ['Top 100 Liked', 'Blind 75', 'NeetCode 150', 'Top Interview Questions', 'Beginner Friendly', 'Amazon Top 50', 'Google Top 50', 'Meta Top 50', 'Microsoft Top 50', 'Apple Top 50'];
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
    navigate(`/match/solo?problemId=${problemId}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Problems
            </h1>
          </div>
          <div className="text-sm text-slate-400">
            Welcome, <span className="text-white font-semibold">{user?.username}</span>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar - Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="glass border border-slate-700 rounded-lg p-4 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Filters</h2>
              
              {/* Companies Filter */}
              <div className="mb-4">
                <button
                  onClick={() => setCompaniesExpanded(!companiesExpanded)}
                  className="flex items-center justify-between w-full text-sm font-semibold mb-2 hover:text-indigo-400 transition"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Companies
                  </span>
                  {companiesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {companiesExpanded && (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {companies.map(company => (
                      <button
                        key={company}
                        onClick={() => setSelectedCompany(selectedCompany === company ? '' : company)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition ${
                          selectedCompany === company
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Lists Filter */}
              <div className="mb-4">
                <button
                  onClick={() => setListsExpanded(!listsExpanded)}
                  className="flex items-center justify-between w-full text-sm font-semibold mb-2 hover:text-indigo-400 transition"
                >
                  <span className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4" />
                    Lists
                  </span>
                  {listsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {listsExpanded && (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {lists.map(list => (
                      <button
                        key={list}
                        onClick={() => setSelectedList(selectedList === list ? '' : list)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition ${
                          selectedList === list
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {list}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Frequency Filter */}
              <div className="mb-4">
                <button
                  onClick={() => setFrequencyExpanded(!frequencyExpanded)}
                  className="flex items-center justify-between w-full text-sm font-semibold mb-2 hover:text-indigo-400 transition"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Frequency
                  </span>
                  {frequencyExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {frequencyExpanded && (
                  <div className="space-y-1">
                    {frequencies.map(freq => (
                      <button
                        key={freq}
                        onClick={() => setSelectedFrequency(selectedFrequency === freq ? '' : freq)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition ${
                          selectedFrequency === freq
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="mb-4">
                <button
                  onClick={() => setStatusExpanded(!statusExpanded)}
                  className="flex items-center justify-between w-full text-sm font-semibold mb-2 hover:text-indigo-400 transition"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Status
                  </span>
                  {statusExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {statusExpanded && (
                  <div className="space-y-1">
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(selectedStatus === status ? '' : status)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition ${
                          selectedStatus === status
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Difficulty Filter */}
              <div className="mb-4">
                <button
                  onClick={() => setDifficultyExpanded(!difficultyExpanded)}
                  className="flex items-center justify-between w-full text-sm font-semibold mb-2 hover:text-indigo-400 transition"
                >
                  <span>Difficulty</span>
                  {difficultyExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {difficultyExpanded && (
                  <div className="space-y-1">
                    {difficulties.map(diff => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? '' : diff)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition ${
                          selectedDifficulty === diff
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCompany('');
                  setSelectedList('');
                  setSelectedFrequency('');
                  setSelectedStatus('');
                  setSelectedDifficulty('');
                  setSearchQuery('');
                }}
                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Problems List */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSortBy('acceptance')}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  sortBy === 'acceptance'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Acceptance
              </button>
              <button
                onClick={() => setSortBy('difficulty')}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  sortBy === 'difficulty'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Difficulty
              </button>
              <button
                onClick={() => setSortBy('frequency')}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  sortBy === 'frequency'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Frequency
              </button>
            </div>

            {/* Problems Table */}
            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading problems...</div>
            ) : problems.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No problems found</div>
            ) : (
              <div className="space-y-2">
                {problems.map((problem, idx) => (
                  <div
                    key={problem._id}
                    onClick={() => handleProblemClick(problem._id)}
                    className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-4 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-slate-400 font-medium w-8">{idx + 1}.</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white group-hover:text-indigo-400 transition">
                            {problem.title}
                          </h3>
                          {problem.metadata?.companies && problem.metadata.companies.length > 0 && (
                            <div className="flex gap-2 mt-1">
                              {problem.metadata.companies.slice(0, 3).map(company => (
                                <span key={company.name} className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-300">
                                  {company.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 ml-4">
                        <span className={`text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <BarChart3 className="w-4 h-4" />
                          <span>{problem.acceptanceRate || 0}%</span>
                        </div>
                        {selectedFrequency && problem.metadata?.frequencyData && (
                          <div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
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

