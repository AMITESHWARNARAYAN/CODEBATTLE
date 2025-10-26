import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { ChevronLeft, Search, Filter, ArrowUpDown, BarChart3, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

export default function Problems() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('acceptance'); // acceptance, difficulty, submissions
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchProblems = async (categoryId) => {
    try {
      setLoading(true);
      let url = `${API_URL}/categories/${categoryId}/problems`;
      if (selectedDifficulty) {
        url += `?difficulty=${selectedDifficulty}`;
      }
      const response = await axios.get(url);
      let filteredProblems = response.data;

      // Filter by search query
      if (searchQuery) {
        filteredProblems = filteredProblems.filter(p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
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
        }
        return 0;
      });

      setProblems(filteredProblems);
      // Calculate solved count (mock - in real app would come from user data)
      setSolvedCount(Math.floor(filteredProblems.length * 0.65));
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      toast.error('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedDifficulty('');
    setSearchQuery('');
    setSortBy('acceptance');
    fetchProblems(categoryId);
  };

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
    if (selectedCategory) {
      fetchProblems(selectedCategory);
    }
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

  const getDifficultyBgColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-900/20';
      case 'Medium':
        return 'bg-yellow-900/20';
      case 'Hard':
        return 'bg-red-900/20';
      default:
        return 'bg-slate-800/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Problems</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {!selectedCategory ? (
          // Categories View - Featured Cards
          <div>
            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No categories available yet</div>
            ) : (
              <>
                {/* Featured Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {categories.slice(0, 4).map((category, idx) => {
                    const colors = [
                      'from-orange-500 to-orange-600',
                      'from-blue-500 to-blue-600',
                      'from-purple-500 to-purple-600',
                      'from-green-600 to-green-700'
                    ];
                    return (
                      <div
                        key={category._id}
                        onClick={() => handleCategoryClick(category._id)}
                        className={`bg-gradient-to-br ${colors[idx % 4]} rounded-xl p-6 cursor-pointer hover:shadow-lg hover:shadow-white/10 transition-all group min-h-[200px] flex flex-col justify-between`}
                      >
                        <div>
                          <h3 className="text-white font-bold text-lg mb-2">{category.name}</h3>
                          <p className="text-white/80 text-sm mb-4">{category.description}</p>
                        </div>
                        <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold w-fit hover:bg-slate-100 transition">
                          Start Learning
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Category Tags */}
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 items-center">
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => handleCategoryClick(category._id)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm font-medium transition flex items-center gap-2"
                      >
                        <span>{category.icon}</span>
                        {category.name}
                        <span className="text-slate-400 text-xs">{category.problemCount}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          // Problems View - LeetCode Style
          <div>
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold">
                    {categories.find(c => c._id === selectedCategory)?.name}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    {solvedCount}/{problems.length} Solved
                  </p>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search questions"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (selectedCategory) {
                      fetchProblems(selectedCategory);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition">
                <ArrowUpDown className="w-4 h-4" />
              </button>
              <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition">
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Topic Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => {
                  setSelectedDifficulty('');
                  if (selectedCategory) fetchProblems(selectedCategory);
                }}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
                  selectedDifficulty === ''
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Topics
              </button>
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultyChange(diff)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
                    selectedDifficulty === diff
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
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
                    className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-4 cursor-pointer transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-slate-400 font-medium w-8">{idx + 1}.</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-indigo-400 transition">
                          {problem.title}
                        </h3>
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
                      <div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${problem.acceptanceRate || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

