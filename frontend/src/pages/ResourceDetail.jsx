import { useNavigate, useParams } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ExternalLink, BookOpen, CheckCircle2, Circle, Clock, BarChart3, PlayCircle, FileText, Code2, Target, Zap, TrendingUp } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ResourceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDark } = useThemeStore();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [completedProblems, setCompletedProblems] = useState({});

  // Theme colors
  const bgColor = isDark ? '#0f0f0f' : '#ffffff';
  const cardBg = isDark ? 'bg-dark-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb';

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/resources/${id}`);
      setResource(response.data);
      
      // Initialize all sections as collapsed
      const sections = {};
      response.data.metadata?.sections?.forEach((section, index) => {
        sections[index] = false;
      });
      setExpandedSections(sections);
    } catch (error) {
      console.error('Error fetching resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleProblem = (problemId) => {
    setCompletedProblems(prev => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'text-green-500 bg-green-500/10 border-green-500/20',
      'Medium': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
      'Hard': 'text-red-500 bg-red-500/10 border-red-500/20'
    };
    return colors[difficulty] || 'text-gray-500 bg-gray-500/10 border-gray-500/20';
  };

  const calculateProgress = () => {
    const totalProblems = resource?.metadata?.sections?.reduce((acc, section) => 
      acc + (section.problems?.length || 0), 0) || 0;
    const completed = Object.values(completedProblems).filter(Boolean).length;
    return totalProblems > 0 ? Math.round((completed / totalProblems) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${textColor} mb-4`}>Resource not found</h2>
          <button
            onClick={() => navigate('/resources')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg"
          >
            Back to Resources
          </button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const totalProblems = resource?.metadata?.sections?.reduce((acc, section) => 
    acc + (section.problems?.length || 0), 0) || 0;
  const completedCount = Object.values(completedProblems).filter(Boolean).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {/* Header */}
      <header className={`${cardBg} border-b sticky top-0 z-50 shadow-sm`} style={{ borderBottomWidth: '1px', borderBottomColor: borderColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/resources')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDark ? 'hover:bg-dark-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Resources</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Resource Header */}
        <div className={`${cardBg} rounded-xl p-8 mb-8 border`} style={{ borderColor }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className={`text-4xl font-bold ${textColor} mb-4`}>{resource.title}</h1>
              <p className={`text-lg ${textMuted} mb-4`}>{resource.description}</p>
              
              <div className="flex flex-wrap gap-3">
                {resource.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                )}
                {resource.category && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-dark-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {resource.category}
                  </span>
                )}
                {resource.author && (
                  <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${textMuted}`}>
                    <Target className="w-4 h-4" />
                    {resource.author}
                  </span>
                )}
              </div>
            </div>

            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
              >
                <span>Visit Original</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${textColor}`}>Overall Progress</span>
              <span className={`text-sm font-medium ${textColor}`}>{completedCount}/{totalProblems} Problems</span>
            </div>
            <div className={`w-full h-3 rounded-full ${isDark ? 'bg-dark-800' : 'bg-gray-200'} overflow-hidden`}>
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={`text-xs ${textMuted} mt-1 block`}>{progress}% Complete</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-dark-800' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className={`w-5 h-5 ${textMuted}`} />
                <span className={`text-sm ${textMuted}`}>Sections</span>
              </div>
              <p className={`text-2xl font-bold ${textColor}`}>{resource.metadata?.sections?.length || 0}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-dark-800' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Code2 className={`w-5 h-5 ${textMuted}`} />
                <span className={`text-sm ${textMuted}`}>Problems</span>
              </div>
              <p className={`text-2xl font-bold ${textColor}`}>{totalProblems}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-dark-800' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className={`w-5 h-5 ${textMuted}`} />
                <span className={`text-sm ${textMuted}`}>Duration</span>
              </div>
              <p className={`text-2xl font-bold ${textColor}`}>{resource.duration || 'Self-paced'}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-dark-800' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className={`w-5 h-5 ${textMuted}`} />
                <span className={`text-sm ${textMuted}`}>Completed</span>
              </div>
              <p className={`text-2xl font-bold ${textColor}`}>{progress}%</p>
            </div>
          </div>
        </div>

        {/* Topics Covered */}
        {resource.topics && resource.topics.length > 0 && (
          <div className={`${cardBg} rounded-xl p-6 mb-8 border`} style={{ borderColor }}>
            <h2 className={`text-2xl font-bold ${textColor} mb-4 flex items-center gap-2`}>
              <Zap className="w-6 h-6 text-orange-500" />
              Topics Covered
            </h2>
            <div className="flex flex-wrap gap-2">
              {resource.topics.map((topic, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-lg text-sm ${isDark ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Course Content */}
        {resource.metadata?.sections && resource.metadata.sections.length > 0 && (
          <div className={`${cardBg} rounded-xl p-6 border`} style={{ borderColor }}>
            <h2 className={`text-2xl font-bold ${textColor} mb-6 flex items-center gap-2`}>
              <BookOpen className="w-6 h-6 text-orange-500" />
              Course Content
            </h2>

            <div className="space-y-4">
              {resource.metadata.sections.map((section, sectionIndex) => {
                const sectionCompleted = section.problems?.filter(p => completedProblems[p.id]).length || 0;
                const sectionTotal = section.problems?.length || 0;
                const sectionProgress = sectionTotal > 0 ? Math.round((sectionCompleted / sectionTotal) * 100) : 0;

                return (
                  <div
                    key={sectionIndex}
                    className={`border rounded-lg overflow-hidden ${isDark ? 'border-dark-700' : 'border-gray-200'}`}
                  >
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(sectionIndex)}
                      className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
                        isDark ? 'hover:bg-dark-800' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`text-sm font-bold px-3 py-1 rounded ${isDark ? 'bg-dark-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          Step {sectionIndex + 1}
                        </div>
                        <div className="text-left flex-1">
                          <h3 className={`text-lg font-bold ${textColor} mb-1`}>{section.title}</h3>
                          {section.description && (
                            <p className={`text-sm ${textMuted}`}>{section.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`text-sm font-medium ${textColor}`}>
                            {sectionCompleted}/{sectionTotal} Problems
                          </div>
                          <div className={`text-xs ${textMuted}`}>{sectionProgress}% Complete</div>
                        </div>
                        {expandedSections[sectionIndex] ? (
                          <ChevronUp className={`w-5 h-5 ${textMuted}`} />
                        ) : (
                          <ChevronDown className={`w-5 h-5 ${textMuted}`} />
                        )}
                      </div>
                    </button>

                    {/* Section Content */}
                    {expandedSections[sectionIndex] && (
                      <div className={`px-6 py-4 border-t ${isDark ? 'bg-dark-800/50 border-dark-700' : 'bg-gray-50 border-gray-200'}`}>
                        {section.problems && section.problems.length > 0 ? (
                          <div className="space-y-2">
                            {section.problems.map((problem, problemIndex) => (
                              <div
                                key={problemIndex}
                                className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                                  isDark ? 'hover:bg-dark-900' : 'hover:bg-white'
                                } ${completedProblems[problem.id] ? 'opacity-60' : ''}`}
                              >
                                <button
                                  onClick={() => toggleProblem(problem.id)}
                                  className="flex-shrink-0"
                                >
                                  {completedProblems[problem.id] ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <Circle className={`w-5 h-5 ${textMuted}`} />
                                  )}
                                </button>

                                <div className="flex-1">
                                  <h4 className={`font-medium ${textColor} mb-1`}>{problem.title}</h4>
                                  <div className="flex items-center gap-3">
                                    {problem.difficulty && (
                                      <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                      </span>
                                    )}
                                    {problem.platform && (
                                      <span className={`text-xs ${textMuted}`}>{problem.platform}</span>
                                    )}
                                  </div>
                                </div>

                                {problem.url && (
                                  <a
                                    href={problem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                      isDark ? 'bg-dark-900 hover:bg-dark-700 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700'
                                    } border ${isDark ? 'border-dark-700' : 'border-gray-200'}`}
                                  >
                                    <span className="text-sm">Solve</span>
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className={textMuted}>No problems available in this section.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
