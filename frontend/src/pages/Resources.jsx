import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { BookOpen, Video, FileText, Code2, ExternalLink, Github, Youtube, Award, Lightbulb, Zap, Target, Brain, ArrowRight, Book, Library, Newspaper, GraduationCap, Trophy, Filter, Search, ChevronRight, Star, Clock, User, Eye, Heart, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Resources() {
  const navigate = useNavigate();
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const bgColor = isDark ? '#0a0a0a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1a1a1a';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb';
  const cardBg = isDark ? '#1a1a1a' : '#ffffff';

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${API_URL}/resources`);
      setResources(response.data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (resourceId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/resources/${resourceId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(prev => prev.map(r => 
        r._id === resourceId ? { ...r, likes: r.likes + 1 } : r
      ));
    } catch (error) {
      toast.error('Please login to like resources');
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      BookOpen, Video, FileText, Code2, ExternalLink, Github, Youtube, 
      Award, Lightbulb, Zap, Target, Brain, ArrowRight, Book, 
      Library, Newspaper, GraduationCap, Trophy
    };
    return icons[iconName] || BookOpen;
  };

  const getColorClasses = (color) => {
    const colors = {
      orange: 'from-orange-500 to-red-500',
      blue: 'from-blue-500 to-cyan-500',
      purple: 'from-purple-500 to-pink-500',
      green: 'from-green-500 to-emerald-500',
      red: 'from-red-500 to-rose-500',
      yellow: 'from-yellow-500 to-orange-500',
      indigo: 'from-indigo-500 to-purple-500',
      gray: 'from-gray-500 to-slate-500'
    };
    return colors[color] || colors.orange;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'text-green-500 bg-green-500/10 border-green-500/30',
      'Intermediate': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
      'Advanced': 'text-red-500 bg-red-500/10 border-red-500/30',
      'All Levels': 'text-blue-500 bg-blue-500/10 border-blue-500/30'
    };
    return colors[difficulty] || colors['All Levels'];
  };

  const filteredResources = resources.filter(resource => {
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const groupedResources = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.type]) acc[resource.type] = [];
    acc[resource.type].push(resource);
    return acc;
  }, {});

  const typeLabels = {
    'learning-path': 'Learning Paths',
    'problem-sheet': 'Problem Sheets',
    'tutorial': 'Tutorials & Guides',
    'video': 'Video Courses',
    'article': 'Articles',
    'course': 'Complete Courses',
    'external': 'External Resources'
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {/* Header */}
      <header className={`${cardBg} border-b sticky top-0 z-50 shadow-sm`} style={{ borderBottomWidth: '1px', borderBottomColor: borderColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur-sm opacity-50"></div>
                <div className="relative p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg">
                  <Library className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${textColor}`}>Learning Resources</h1>
                <p className={`text-xs ${textMuted}`}>Everything you need for interview preparation</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'hover:bg-dark-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${textColor}`}>
            Master <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">DSA & Coding</span>
          </h2>
          <p className={`text-lg ${textMuted} max-w-2xl mx-auto`}>
            Curated learning paths, problem sheets, tutorials, and resources to help you ace technical interviews
          </p>
        </div>

        {/* Search and Filter */}
        <div className={`${cardBg} rounded-xl p-6 mb-8 border`} style={{ borderColor }}>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-3">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`} />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-dark-800 border-dark-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-dark-800 border-dark-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
              >
                <option value="all">All Types</option>
                <option value="learning-path">Learning Paths</option>
                <option value="problem-sheet">Problem Sheets</option>
                <option value="tutorial">Tutorials</option>
                <option value="video">Videos</option>
                <option value="article">Articles</option>
                <option value="course">Courses</option>
                <option value="external">External</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-dark-800 border-dark-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
              >
                <option value="all">All Categories</option>
                <option value="DSA">DSA</option>
                <option value="Algorithms">Algorithms</option>
                <option value="Data Structures">Data Structures</option>
                <option value="System Design">System Design</option>
                <option value="Competitive Programming">Competitive Programming</option>
                <option value="Interview Preparation">Interview Preparation</option>
                <option value="Problem Solving">Problem Solving</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-dark-800' : 'bg-gray-100'} w-full text-center`}>
                <p className={`text-sm ${textMuted}`}>
                  Showing <span className="font-bold text-orange-500">{filteredResources.length}</span> resources
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className={`mt-4 ${textMuted}`}>Loading resources...</p>
          </div>
        )}

        {/* Resources by Type */}
        {!loading && Object.keys(groupedResources).map((type) => (
          <div key={type} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${getColorClasses(groupedResources[type][0]?.color || 'orange')}`}>
                {(() => {
                  const Icon = getIconComponent(groupedResources[type][0]?.icon);
                  return <Icon className="w-5 h-5 text-white" />;
                })()}
              </div>
              <h3 className={`text-2xl font-bold ${textColor}`}>{typeLabels[type] || type}</h3>
              <div className={`ml-auto px-3 py-1 rounded-full text-sm ${isDark ? 'bg-dark-800' : 'bg-gray-100'} ${textMuted}`}>
                {groupedResources[type].length} items
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedResources[type].map((resource, idx) => {
                const Icon = getIconComponent(resource.icon);
                return (
                  <div
                    key={resource._id}
                    className={`${cardBg} rounded-xl p-6 border transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105 ${hoveredCard === resource._id ? 'shadow-2xl scale-105' : 'shadow-md'}`}
                    style={{ borderColor: hoveredCard === resource._id ? '#f97316' : borderColor }}
                    onMouseEnter={() => setHoveredCard(resource._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => {
                      if (resource.type === 'external' && resource.url) {
                        window.open(resource.url, '_blank');
                      } else {
                        navigate(`/resources/${resource._id}`);
                      }
                    }}
                  >
                    {/* Icon and Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${getColorClasses(resource.color)}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(resource.difficulty)}`}>
                        {resource.difficulty}
                      </div>
                    </div>

                    {/* Title and Description */}
                    <h4 className={`text-lg font-bold mb-2 ${textColor}`}>{resource.title}</h4>
                    <p className={`text-sm ${textMuted} mb-4 line-clamp-2`}>{resource.description}</p>

                    {/* Topics */}
                    {resource.topics && resource.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {resource.topics.slice(0, 3).map((topic, i) => (
                          <span key={i} className={`px-2 py-1 rounded text-xs ${isDark ? 'bg-dark-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            {topic}
                          </span>
                        ))}
                        {resource.topics.length > 3 && (
                          <span className={`px-2 py-1 rounded text-xs ${textMuted}`}>
                            +{resource.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor }}>
                      <div className="flex items-center gap-4">
                        {resource.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className={`w-4 h-4 ${textMuted}`} />
                            <span className={`text-xs ${textMuted}`}>{resource.duration}</span>
                          </div>
                        )}
                        {resource.author && (
                          <div className="flex items-center gap-1">
                            <User className={`w-4 h-4 ${textMuted}`} />
                            <span className={`text-xs ${textMuted}`}>{resource.author}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {resource.views > 0 && (
                          <div className="flex items-center gap-1">
                            <Eye className={`w-4 h-4 ${textMuted}`} />
                            <span className={`text-xs ${textMuted}`}>{resource.views}</span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(resource._id);
                          }}
                          className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${textMuted}`} />
                          <span className={`text-xs ${textMuted}`}>{resource.likes || 0}</span>
                        </button>
                      </div>
                    </div>

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {resource.tags.map((tag, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* External Link Indicator */}
                    {resource.url && (
                      <div className="mt-3 flex items-center gap-2 text-orange-500 text-sm font-medium">
                        <span>Visit Resource</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {!loading && filteredResources.length === 0 && (
          <div className="text-center py-16">
            <Library className={`w-16 h-16 mx-auto mb-4 ${textMuted}`} />
            <h3 className={`text-xl font-bold mb-2 ${textColor}`}>No resources found</h3>
            <p className={textMuted}>Try adjusting your filters or search query</p>
          </div>
        )}

        {/* CTA Section */}
        <div className={`${cardBg} rounded-2xl p-12 text-center border mt-16`} style={{ borderColor }}>
          <div className="max-w-2xl mx-auto">
            <div className="inline-block p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-6">
              <Target className="w-12 h-12 text-white" />
            </div>
            <h2 className={`text-3xl font-bold ${textColor} mb-4`}>
              Ready to Level Up Your Skills?
            </h2>
            <p className={`text-lg ${textMuted} mb-8`}>
              Start your journey with our curated resources and practice problems
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/problems')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition font-medium shadow-lg"
              >
                Browse Problems
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-6 py-3 rounded-lg transition font-medium border ${isDark ? 'bg-dark-800 hover:bg-dark-700 border-dark-700 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'}`}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}