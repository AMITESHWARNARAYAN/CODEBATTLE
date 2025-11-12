import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Building2, List, Clock, Plus, X, Save, Search, ChevronLeft } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminProblemMetadata() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [newCompany, setNewCompany] = useState({ name: '', frequency: 50, acceptanceRate: 0 });
  const [selectedLists, setSelectedLists] = useState([]);
  const [frequencyData, setFrequencyData] = useState({
    sixMonths: 0,
    oneYear: 0,
    twoYears: 0,
    allTime: 0
  });

  const availableCompanies = [
    'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Tesla',
    'Adobe', 'Bloomberg', 'Uber', 'LinkedIn', 'Oracle', 'Salesforce', 'Twitter'
  ];

  const availableLists = [
    'Top 100 Liked',
    'Blind 75',
    'NeetCode 150',
    'Top Interview Questions',
    'Beginner Friendly',
    'Amazon Top 50',
    'Google Top 50',
    'Meta Top 50',
    'Microsoft Top 50',
    'Apple Top 50'
  ];

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/problems`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProblems(response.data);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      toast.error('Failed to load problems');
    }
  };

  const fetchMetadata = async (problemId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/problem-metadata/${problemId}`);
      setMetadata(response.data);
      setSelectedLists(response.data.lists || []);
      setFrequencyData(response.data.frequencyData || {
        sixMonths: 0,
        oneYear: 0,
        twoYears: 0,
        allTime: 0
      });
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
      toast.error('Failed to load metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
    fetchMetadata(problem._id);
  };

  const handleAddCompany = async () => {
    if (!newCompany.name) {
      toast.error('Please select a company');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/problem-metadata/${selectedProblem._id}/company`,
        newCompany,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Company added successfully');
      fetchMetadata(selectedProblem._id);
      setNewCompany({ name: '', frequency: 50, acceptanceRate: 0 });
    } catch (error) {
      console.error('Failed to add company:', error);
      toast.error('Failed to add company');
    }
  };

  const handleRemoveCompany = async (companyName) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/problem-metadata/${selectedProblem._id}/company/${companyName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Company removed successfully');
      fetchMetadata(selectedProblem._id);
    } catch (error) {
      console.error('Failed to remove company:', error);
      toast.error('Failed to remove company');
    }
  };

  const handleToggleList = async (listName) => {
    const token = localStorage.getItem('token');
    
    if (selectedLists.includes(listName)) {
      // Remove from list
      try {
        await axios.delete(
          `${API_URL}/problem-metadata/${selectedProblem._id}/list/${listName}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSelectedLists(selectedLists.filter(l => l !== listName));
        toast.success('Removed from list');
      } catch (error) {
        console.error('Failed to remove from list:', error);
        toast.error('Failed to remove from list');
      }
    } else {
      // Add to list
      try {
        await axios.post(
          `${API_URL}/problem-metadata/${selectedProblem._id}/list`,
          { listName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSelectedLists([...selectedLists, listName]);
        toast.success('Added to list');
      } catch (error) {
        console.error('Failed to add to list:', error);
        toast.error('Failed to add to list');
      }
    }
  };

  const handleSaveFrequency = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/problem-metadata/${selectedProblem._id}`,
        { frequencyData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Frequency data saved successfully');
      fetchMetadata(selectedProblem._id);
    } catch (error) {
      console.error('Failed to save frequency:', error);
      toast.error('Failed to save frequency data');
    }
  };

  const filteredProblems = problems.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Problem Metadata Management</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problems List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Select Problem</h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white"
                />
              </div>

              {/* Problems List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                {filteredProblems.map((problem) => (
                  <button
                    key={problem._id}
                    onClick={() => handleProblemSelect(problem)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedProblem?._id === problem._id
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-white dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700'
                    }`}
                  >
                    <div className="font-medium">{problem.title}</div>
                    <div className={`text-xs mt-1 ${selectedProblem?._id === problem._id ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>{problem.difficulty}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Metadata Editor */}
          <div className="lg:col-span-2">
            {!selectedProblem ? (
              <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
                Select a problem to manage its metadata
              </div>
            ) : loading ? (
              <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
                Loading metadata...
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selected Problem Info */}
                <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedProblem.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{selectedProblem.difficulty}</p>
                </div>

                {/* Company Tags */}
                <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                    <Building2 className="w-5 h-5" />
                    Company Tags
                  </h3>

                  {/* Existing Companies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {metadata?.companies?.map((company, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg text-sm flex items-center gap-2 border border-gray-200 dark:border-dark-700"
                      >
                        {company.name} ({company.frequency}%)
                        <button
                          onClick={() => handleRemoveCompany(company.name)}
                          className="hover:text-red-600 dark:hover:text-red-400 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Company */}
                  <div className="flex gap-2">
                    <select
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    >
                      <option value="">Select Company</option>
                      {availableCompanies.map((company) => (
                        <option key={company} value={company}>{company}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newCompany.frequency}
                      onChange={(e) => setNewCompany({ ...newCompany, frequency: parseInt(e.target.value) })}
                      placeholder="Frequency %"
                      className="w-24 px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    />
                    <button
                      onClick={handleAddCompany}
                      className="px-4 py-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg transition flex items-center gap-2 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Problem Lists */}
                <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                    <List className="w-5 h-5" />
                    Problem Lists
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {availableLists.map((list) => (
                      <label
                        key={list}
                        className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-700 transition"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLists.includes(list)}
                          onChange={() => handleToggleList(list)}
                          className="w-4 h-4 text-gray-900 dark:text-white bg-white dark:bg-dark-700 border-gray-300 dark:border-dark-600 rounded focus:ring-gray-900 dark:focus:ring-white"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">{list}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Frequency Data */}
                <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                    <Clock className="w-5 h-5" />
                    Frequency Data
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">6 Months (%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={frequencyData.sixMonths}
                        onChange={(e) => setFrequencyData({ ...frequencyData, sixMonths: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">{frequencyData.sixMonths}%</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">1 Year (%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={frequencyData.oneYear}
                        onChange={(e) => setFrequencyData({ ...frequencyData, oneYear: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">{frequencyData.oneYear}%</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">2 Years (%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={frequencyData.twoYears}
                        onChange={(e) => setFrequencyData({ ...frequencyData, twoYears: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">{frequencyData.twoYears}%</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">All Time (%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={frequencyData.allTime}
                        onChange={(e) => setFrequencyData({ ...frequencyData, allTime: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">{frequencyData.allTime}%</div>
                    </div>

                    <button
                      onClick={handleSaveFrequency}
                      className="w-full px-4 py-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg transition flex items-center justify-center gap-2 font-medium"
                    >
                      <Save className="w-4 h-4" />
                      Save Frequency Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

