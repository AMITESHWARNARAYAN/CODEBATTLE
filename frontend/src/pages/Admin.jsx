import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAdminStore } from '../store/adminStore';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, ArrowLeft, Tags, Check, X, Calendar, Trophy, Users } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { problems, categories, stats, loading, getProblems, createProblem, deleteProblem, getStats, createCategory, getCategories, deleteCategory, createChallenge, getChallenges, challenges, deleteChallenge, createContest, getContests, contests, deleteContest, users, getUsers, deleteUser } = useAdminStore();
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('users');
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [showContestForm, setShowContestForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    tags: '',
    constraints: '',
    examples: '[]',
    testCases: '[]',
    functionSignature: '{}',
    timeLimit: 2000,
    memoryLimit: 256,
    solutionLink: '',
    category: ''
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    icon: '📚',
    color: 'gray'
  });
  const [challengeFormData, setChallengeFormData] = useState({
    title: '',
    description: '',
    problemId: '',
    challengeType: 'global',
    startDate: '',
    endDate: '',
    difficulty: 'Medium',
    rewards: { points: 100, badge: '' }
  });
  const [contestFormData, setContestFormData] = useState({
    title: '',
    description: '',
    type: 'weekly',
    problems: [],
    startTime: '',
    duration: 120,
    rules: '',
    prizes: '',
    isRated: true
  });
  const [selectedProblems, setSelectedProblems] = useState([]);

  // Check if user is admin
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      toast.error('Admin access required');
    }
  }, [user, navigate]);

  // Load problems, categories and stats
  useEffect(() => {
    if (token) {
      getProblems();
      getCategories();
      getStats();
      if (activeTab === 'challenges') {
        getChallenges();
      }
      if (activeTab === 'contests') {
        getContests();
      }
      if (activeTab === 'users') {
        getUsers();
      }
    }
  }, [token, getProblems, getCategories, getStats, activeTab, getChallenges, getContests, getUsers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Parse JSON fields
      const problemData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        examples: JSON.parse(formData.examples),
        testCases: JSON.parse(formData.testCases),
        functionSignature: JSON.parse(formData.functionSignature),
        timeLimit: parseInt(formData.timeLimit),
        memoryLimit: parseInt(formData.memoryLimit)
      };

      await createProblem(problemData);
      toast.success('Problem created successfully!');

      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        difficulty: 'Medium',
        tags: '',
        constraints: '',
        examples: '[]',
        testCases: '[]',
        functionSignature: '{}',
        timeLimit: 2000,
        memoryLimit: 256,
        solutionLink: ''
      });
    } catch (error) {
      toast.error('Failed to create problem');
    }
  };

  const handleDelete = async (problemId) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await deleteProblem(problemId);
        toast.success('Problem deleted successfully');
      } catch (error) {
        toast.error('Failed to delete problem');
      }
    }
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory(categoryFormData);
      toast.success('Category created successfully!');
      setShowCategoryForm(false);
      setCategoryFormData({
        name: '',
        description: '',
        icon: '📚',
        color: 'gray'
      });
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const handleChallengeInputChange = (e) => {
    const { name, value } = e.target;
    setChallengeFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChallengeSubmit = async (e) => {
    e.preventDefault();
    try {
      await createChallenge(challengeFormData);
      toast.success('Challenge created successfully!');
      setShowChallengeForm(false);
      setChallengeFormData({
        title: '',
        description: '',
        problemId: '',
        challengeType: 'global',
        startDate: '',
        endDate: '',
        difficulty: 'Medium',
        rewards: { points: 100, badge: '' }
      });
      getChallenges();
    } catch (error) {
      toast.error('Failed to create challenge');
    }
  };

  const handleContestInputChange = (e) => {
    const { name, value } = e.target;
    setContestFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
    }));
  };

  const handleContestSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format problems array for backend
      const formattedProblems = selectedProblems.map((problemId, index) => ({
        problemId,
        points: 100,
        order: index + 1
      }));

      // Format prizes - convert comma-separated string to array
      const prizesArray = contestFormData.prizes
        ? contestFormData.prizes.split(',').map(p => p.trim()).filter(p => p)
        : [];

      const contestPayload = {
        title: contestFormData.title,
        description: contestFormData.description,
        type: contestFormData.type,
        problems: formattedProblems,
        startTime: contestFormData.startTime,
        duration: parseInt(contestFormData.duration),
        rules: contestFormData.rules || '',
        prizes: prizesArray,
        isRated: contestFormData.isRated
      };

      console.log('Submitting contest:', contestPayload);

      await createContest(contestPayload);
      toast.success('Contest created successfully!');
      setShowContestForm(false);
      setContestFormData({
        title: '',
        description: '',
        type: 'weekly',
        problems: [],
        startTime: '',
        duration: 120,
        rules: '',
        prizes: '',
        isRated: true
      });
      setSelectedProblems([]);
      getContests();
    } catch (error) {
      console.error('Contest creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create contest');
    }
  };

  const handleProblemSelection = (problemId) => {
    setSelectedProblems(prev => {
      if (prev.includes(problemId)) {
        return prev.filter(id => id !== problemId);
      } else {
        return [...prev, problemId];
      }
    });
  };

  const handleDeleteChallenge = async (challengeId) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        await deleteChallenge(challengeId);
        toast.success('Challenge deleted successfully');
        getChallenges();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete challenge');
      }
    }
  };

  const handleDeleteContest = async (contestId) => {
    if (window.confirm('Are you sure you want to delete this contest?')) {
      try {
        await deleteContest(contestId);
        toast.success('Contest deleted successfully');
        getContests();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete contest');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully');
        getUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => navigate('/admin/resources')}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium text-sm"
            >
              <Tags className="w-4 h-4" />
              Manage Resources
            </button>
            <button
              onClick={() => navigate('/admin/problem-metadata')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg transition font-medium text-sm"
            >
              <Tags className="w-4 h-4" />
              Manage Metadata
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {user?.username}
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-dark-800 px-4 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto flex gap-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-2 font-medium border-b-2 transition text-sm ${
              activeTab === 'users'
                ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-2 font-medium border-b-2 transition text-sm ${
              activeTab === 'categories'
                ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`py-3 px-2 font-medium border-b-2 transition text-sm ${
              activeTab === 'problems'
                ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Problems
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`py-3 px-2 font-medium border-b-2 transition text-sm ${
              activeTab === 'challenges'
                ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Challenges
          </button>
          <button
            onClick={() => setActiveTab('contests')}
            className={`py-3 px-2 font-medium border-b-2 transition text-sm ${
              activeTab === 'contests'
                ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Contests
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Users Section */}
        {activeTab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Registered Users</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Users: {users.length}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Matches
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Win Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {u.username}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {u.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {u.rating || 1200}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {u.totalMatches || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {u.totalMatches > 0
                                ? `${((u.wins / u.totalMatches) * 100).toFixed(1)}%`
                                : '0%'
                              }
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              u.isAdmin
                                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/30'
                                : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-700'
                            }`}>
                              {u.isAdmin ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={u._id === user._id}
                              className={`p-2 rounded-lg transition ${
                                u._id === user._id
                                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                  : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                              }`}
                              title={u._id === user._id ? 'Cannot delete your own account' : 'Delete user'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categories Section */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Manage Categories</h2>
              <button
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            {/* Add Category Form */}
            {showCategoryForm && (
              <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Create New Category</h3>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Category Name"
                      value={categoryFormData.name}
                      onChange={handleCategoryInputChange}
                      required
                      className="px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    />
                    <input
                      type="text"
                      name="icon"
                      placeholder="Icon (emoji)"
                      value={categoryFormData.icon}
                      onChange={handleCategoryInputChange}
                      className="px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    />
                  </div>

                  <textarea
                    name="description"
                    placeholder="Category Description"
                    value={categoryFormData.description}
                    onChange={handleCategoryInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white"
                  />

                  <select
                    name="color"
                    value={categoryFormData.color}
                    onChange={handleCategoryInputChange}
                    className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="gray">Gray</option>
                    <option value="red">Red</option>
                    <option value="orange">Orange</option>
                    <option value="yellow">Yellow</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                  </select>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1"
                    >
                      {loading ? 'Creating...' : 'Create Category'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCategoryForm(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-dark-800 hover:bg-gray-300 dark:hover:bg-dark-700 text-gray-900 dark:text-white rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Categories List */}
            <div className="space-y-4">
              {categories.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No categories yet. Create one to get started!
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category._id} className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{category.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                            {category.problemCount} problems
                          </span>
                          <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                            Easy: {category.difficulty.easy}
                          </span>
                          <span className="px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded text-xs font-medium">
                            Medium: {category.difficulty.medium}
                          </span>
                          <span className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-xs font-medium">
                            Hard: {category.difficulty.hard}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Problems Section */}
        {activeTab === 'problems' && (
        <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Manage Problems</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Problem
              </button>
            </div>

            {/* Add Problem Form */}
            {showForm && (
              <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Create New Problem</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="title"
                      placeholder="Problem Title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    />
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <textarea
                    name="description"
                    placeholder="Problem Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="input-field"
                  />

                  <textarea
                    name="constraints"
                    placeholder="Constraints"
                    value={formData.constraints}
                    onChange={handleInputChange}
                    rows="2"
                    className="input-field"
                  />

                  <input
                    type="text"
                    name="tags"
                    placeholder="Tags (comma separated)"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="input-field"
                  />

                  <textarea
                    name="examples"
                    placeholder='Examples (JSON array): [{"input": "...", "output": "...", "explanation": "..."}]'
                    value={formData.examples}
                    onChange={handleInputChange}
                    rows="3"
                    className="input-field font-mono text-sm"
                  />

                  <textarea
                    name="testCases"
                    placeholder='Test Cases (JSON array): [{"input": "...", "expectedOutput": "...", "isHidden": false}]'
                    value={formData.testCases}
                    onChange={handleInputChange}
                    rows="3"
                    required
                    className="input-field font-mono text-sm"
                  />

                  <textarea
                    name="functionSignature"
                    placeholder='Function Signature (JSON): {"javascript": "function solve(arr) {}", "python": "def solve(arr):", ...}'
                    value={formData.functionSignature}
                    onChange={handleInputChange}
                    rows="3"
                    required
                    className="input-field font-mono text-sm"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      name="timeLimit"
                      placeholder="Time Limit (ms)"
                      value={formData.timeLimit}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                    <input
                      type="number"
                      name="memoryLimit"
                      placeholder="Memory Limit (MB)"
                      value={formData.memoryLimit}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <input
                    type="url"
                    name="solutionLink"
                    placeholder="Solution Link (optional - for solo practice help)"
                    value={formData.solutionLink}
                    onChange={handleInputChange}
                    className="input-field"
                  />

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category (optional)</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1"
                    >
                      {loading ? 'Creating...' : 'Create Problem'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Problems List */}
            <div className="space-y-4">
              {problems.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No problems yet. Create one to get started!
                </div>
              ) : (
                problems.map((problem) => (
                  <div key={problem._id} className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{problem.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{problem.description.substring(0, 100)}...</p>
                        <div className="flex gap-2 mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            problem.difficulty === 'Easy' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                            'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          }`}>
                            {problem.difficulty}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded text-xs text-gray-700 dark:text-gray-300 font-medium">
                            {problem.totalSubmissions} submissions
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(problem._id)}
                          className="p-2 hover:bg-red-900 text-red-400 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Challenges Section */}
        {activeTab === 'challenges' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Manage Challenges</h2>
              <button
                onClick={() => setShowChallengeForm(!showChallengeForm)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Challenge
              </button>
            </div>

            {/* Create Challenge Form */}
            {showChallengeForm && (
              <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Create New Challenge</h3>
                <form onSubmit={handleChallengeSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="title"
                      placeholder="Challenge Title"
                      value={challengeFormData.title}
                      onChange={handleChallengeInputChange}
                      required
                      className="input-field"
                    />
                    <select
                      name="difficulty"
                      value={challengeFormData.difficulty}
                      onChange={handleChallengeInputChange}
                      className="px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <textarea
                    name="description"
                    placeholder="Challenge Description"
                    value={challengeFormData.description}
                    onChange={handleChallengeInputChange}
                    required
                    rows="3"
                    className="input-field"
                  />

                  <select
                    name="problemId"
                    value={challengeFormData.problemId}
                    onChange={handleChallengeInputChange}
                    required
                    className="px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="">Select Problem</option>
                    {problems.map((problem) => (
                      <option key={problem._id} value={problem._id}>
                        {problem.title} ({problem.difficulty})
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                      <input
                        type="datetime-local"
                        name="startDate"
                        value={challengeFormData.startDate}
                        onChange={handleChallengeInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                      <input
                        type="datetime-local"
                        name="endDate"
                        value={challengeFormData.endDate}
                        onChange={handleChallengeInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <select
                    name="challengeType"
                    value={challengeFormData.challengeType}
                    onChange={handleChallengeInputChange}
                    className="px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="global">Global Challenge</option>
                    <option value="targeted">Targeted Challenge</option>
                  </select>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1"
                    >
                      {loading ? 'Creating...' : 'Create Challenge'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowChallengeForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Challenges List */}
            <div className="space-y-4">
              {!challenges || challenges.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No challenges yet. Create one to get started!
                </div>
              ) : (
                challenges.map((challenge) => (
                  <div key={challenge._id} className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{challenge.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{challenge.description}</p>
                        <div className="flex gap-2 mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            challenge.difficulty === 'Easy' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                            challenge.difficulty === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                            'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          }`}>
                            {challenge.difficulty}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded text-xs text-gray-700 dark:text-gray-300">
                            {challenge.status}
                          </span>
                          {challenge.problem && (
                            <span className="px-2 py-1 bg-gray-200 dark:bg-dark-800 text-gray-900 dark:text-white rounded text-xs">
                              {challenge.problem.title}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteChallenge(challenge._id)}
                        className="ml-4 p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        title="Delete Challenge"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Contests Section */}
        {activeTab === 'contests' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Manage Contests</h2>
              <button
                onClick={() => setShowContestForm(!showContestForm)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Contest
              </button>
            </div>

            {/* Create Contest Form */}
            {showContestForm && (
              <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Create New Contest</h3>
                <form onSubmit={handleContestSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Contest Title"
                    value={contestFormData.title}
                    onChange={handleContestInputChange}
                    required
                    className="input-field"
                  />

                  <textarea
                    name="description"
                    placeholder="Contest Description"
                    value={contestFormData.description}
                    onChange={handleContestInputChange}
                    required
                    rows="3"
                    className="input-field"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      name="type"
                      value={contestFormData.type}
                      onChange={handleContestInputChange}
                      className="px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white"
                    >
                      <option value="weekly">Weekly Contest</option>
                      <option value="biweekly">Biweekly Contest</option>
                      <option value="special">Special Contest</option>
                      <option value="virtual">Virtual Contest</option>
                    </select>
                    <input
                      type="number"
                      name="duration"
                      placeholder="Duration (minutes)"
                      value={contestFormData.duration}
                      onChange={handleContestInputChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Start Time</label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={contestFormData.startTime}
                      onChange={handleContestInputChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Select Problems (at least 1 required)</label>
                    <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-dark-700 rounded-lg p-3 bg-gray-50 dark:bg-dark-800">
                      {problems.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No problems available</p>
                      ) : (
                        problems.map((problem) => (
                          <label key={problem._id} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedProblems.includes(problem._id)}
                              onChange={() => handleProblemSelection(problem._id)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-gray-900 dark:text-white">{problem.title}</span>
                            <span className={`ml-auto text-xs px-2 py-0.5 rounded ${
                              problem.difficulty === 'Easy' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                              problem.difficulty === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                              'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            }`}>
                              {problem.difficulty}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                    {selectedProblems.length > 0 && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{selectedProblems.length} problem(s) selected</p>
                    )}
                  </div>

                  <textarea
                    name="rules"
                    placeholder="Contest Rules (optional)"
                    value={contestFormData.rules}
                    onChange={handleContestInputChange}
                    rows="2"
                    className="input-field"
                  />

                  <input
                    type="text"
                    name="prizes"
                    placeholder="Prizes (comma-separated, optional)"
                    value={contestFormData.prizes}
                    onChange={handleContestInputChange}
                    className="input-field"
                  />

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isRated"
                      checked={contestFormData.isRated}
                      onChange={(e) => setContestFormData(prev => ({ ...prev, isRated: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-900 dark:text-white">Rated Contest</label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading || selectedProblems.length === 0}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating...' : 'Create Contest'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowContestForm(false);
                        setSelectedProblems([]);
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                  {selectedProblems.length === 0 && (
                    <p className="text-xs text-red-600 dark:text-red-400">Please select at least one problem</p>
                  )}
                </form>
              </div>
            )}

            {/* Contests List */}
            <div className="space-y-4">
              {!contests || contests.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No contests yet. Create one to get started!
                </div>
              ) : (
                contests.map((contest) => (
                  <div key={contest._id} className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{contest.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{contest.description}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded text-xs text-gray-700 dark:text-gray-300">
                            {contest.type}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded text-xs text-gray-700 dark:text-gray-300">
                            {contest.duration} mins
                          </span>
                          <span className="px-2 py-1 bg-gray-200 dark:bg-dark-800 text-gray-900 dark:text-white rounded text-xs">
                            {contest.problems?.length || 0} problems
                          </span>
                          {contest.isRated && (
                            <span className="px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded text-xs">
                              Rated
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteContest(contest._id)}
                        className="ml-4 p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        title="Delete Contest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

