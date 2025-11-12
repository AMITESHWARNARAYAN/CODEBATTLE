import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Code2, Plus, Edit2, Trash2, Save, X, BookOpen, Video, FileText, ExternalLink, ChevronLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminResources() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { isDark } = useThemeStore();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    type: 'learning-path', // learning-path, tutorial, video, external
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner',
    topics: [],
    url: '',
    platform: '',
    icon: 'BookOpen'
  });

  // TensorFlow color scheme
  const bgColor = isDark ? '#0a0a0a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1a1a1a';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';
  const cardBg = isDark ? '#1a1a1a' : '#ffffff';

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchResources();
  }, [user, navigate]);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/resources`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setResources(data);
    } catch (error) {
      toast.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingResource
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/resources/${editingResource._id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/resources`;

      const method = editingResource ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingResource ? 'Resource updated!' : 'Resource created!');
        setShowModal(false);
        setEditingResource(null);
        resetForm();
        fetchResources();
      } else {
        toast.error('Failed to save resource');
      }
    } catch (error) {
      toast.error('Error saving resource');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/resources/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Resource deleted!');
        fetchResources();
      } else {
        toast.error('Failed to delete resource');
      }
    } catch (error) {
      toast.error('Error deleting resource');
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      type: resource.type,
      title: resource.title,
      description: resource.description,
      category: resource.category || '',
      difficulty: resource.difficulty || 'Beginner',
      topics: resource.topics || [],
      url: resource.url || '',
      platform: resource.platform || '',
      icon: resource.icon || 'BookOpen'
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'learning-path',
      title: '',
      description: '',
      category: '',
      difficulty: 'Beginner',
      topics: [],
      url: '',
      platform: '',
      icon: 'BookOpen'
    });
  };

  const handleAddTopic = () => {
    const topic = prompt('Enter topic name:');
    if (topic) {
      setFormData({ ...formData, topics: [...formData.topics, topic] });
    }
  };

  const handleRemoveTopic = (index) => {
    const newTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({ ...formData, topics: newTopics });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {/* Header */}
      <header className={`${cardBg} border-b sticky top-0 z-50 shadow-sm`} style={{ borderBottomWidth: '1px', borderBottomColor: isDark ? '#2a2a2a' : '#e5e7eb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-dark-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Admin</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur-sm opacity-50"></div>
                  <div className="relative p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h1 className={`text-xl font-bold ${textColor}`}>
                  Manage Resources
                </h1>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingResource(null);
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition font-medium text-sm shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Resource
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className={textMuted}>Loading resources...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource._id}
                className={`${cardBg} rounded-xl p-6 border shadow-lg`}
                style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-orange-900/20 text-orange-300' : 'bg-orange-100 text-orange-700'}`}>
                    {resource.type.replace('-', ' ').toUpperCase()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(resource)}
                      className={`p-1.5 rounded transition-colors ${isDark ? 'hover:bg-dark-800 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(resource._id)}
                      className={`p-1.5 rounded transition-colors ${isDark ? 'hover:bg-dark-800 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className={`text-lg font-bold ${textColor} mb-2`}>{resource.title}</h3>
                <p className={`text-sm ${textMuted} mb-3`}>{resource.description}</p>
                {resource.difficulty && (
                  <p className={`text-xs ${textMuted} mb-2`}>Difficulty: {resource.difficulty}</p>
                )}
                {resource.topics && resource.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-dark-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-orange-500 hover:text-orange-600 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Link
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && resources.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className={`w-16 h-16 ${textMuted} mx-auto mb-4`} />
            <h3 className={`text-xl font-bold ${textColor} mb-2`}>No resources yet</h3>
            <p className={`${textMuted} mb-4`}>Start by adding your first resource</p>
            <button
              onClick={() => {
                setEditingResource(null);
                resetForm();
                setShowModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition font-medium shadow-lg"
            >
              Add First Resource
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${textColor}`}>
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingResource(null);
                  resetForm();
                }}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-dark-800' : 'hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type */}
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-dark-800 border-dark-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                >
                  <option value="learning-path">Learning Path</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="video">Video</option>
                  <option value="external">External Resource</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-dark-800 border-dark-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-dark-800 border-dark-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  rows="3"
                  required
                />
              </div>

              {/* Difficulty (for learning paths) */}
              {formData.type === 'learning-path' && (
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-dark-800 border-dark-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Beginner to Advanced">Beginner to Advanced</option>
                  </select>
                </div>
              )}

              {/* Topics */}
              {(formData.type === 'learning-path' || formData.type === 'tutorial') && (
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>Topics</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${isDark ? 'bg-dark-800 text-white' : 'bg-gray-100 text-gray-900'}`}
                      >
                        {topic}
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(idx)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className={`text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1`}
                  >
                    <Plus className="w-4 h-4" />
                    Add Topic
                  </button>
                </div>
              )}

              {/* URL (for external resources and videos) */}
              {(formData.type === 'external' || formData.type === 'video') && (
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-dark-800 border-dark-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="https://..."
                  />
                </div>
              )}

              {/* Platform (for videos) */}
              {formData.type === 'video' && (
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>Platform</label>
                  <input
                    type="text"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-dark-800 border-dark-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="e.g., YouTube"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition font-medium shadow-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingResource ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingResource(null);
                    resetForm();
                  }}
                  className={`px-4 py-2 rounded-lg transition font-medium border ${isDark ? 'bg-dark-800 hover:bg-dark-700 border-dark-700 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
