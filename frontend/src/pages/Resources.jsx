import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { BookOpenIcon, VideoIcon, DocumentTextIcon, CodeBracketIcon, ArrowTopRightOnSquareIcon, ArrowTopRightOnSquareIcon, ArrowTopRightOnSquareIcon, AcademicCapIcon, LightBulbIcon, BoltIcon, TargetIcon, SparklesIcon, ArrowRightIcon, Book, BookOpenIcon, NewspaperIcon, AcademicCapIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

export default function Resources() {
  const navigate = useNavigate();
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [resources, setResources] = useState({
    'learning-path': [],
    'tutorial': [],
    'video': [],
    'external': []
  });
  const [loading, setLoading] = useState(true);

  // TensorFlow color scheme
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/resources`);
      const data = await response.json();
      
      // Group resources by type
      const grouped = {
        'learning-path': [],
        'tutorial': [],
        'video': [],
        'external': []
      };
      
      data.forEach(resource => {
        if (grouped[resource.type]) {
          grouped[resource.type].push(resource);
        }
      });
      
      setResources(grouped);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      BookOpenIcon, VideoIcon, DocumentTextIcon, CodeBracketIcon, ArrowTopRightOnSquareIcon, ArrowTopRightOnSquareIcon, ArrowTopRightOnSquareIcon, 
      AcademicCapIcon, LightBulbIcon, BoltIcon, TargetIcon, SparklesIcon, ArrowRightIcon, Book, 
      BookOpenIcon, NewspaperIcon, AcademicCapIcon, TrophyIcon
    };
    return icons[iconName] || BookOpenIcon;
  };

  const learningPaths = [
    {
      title: 'Data Structures & Algorithms',
      description: 'Master fundamental DSA concepts from basics to advanced',
      icon: SparklesIcon,
      difficulty: 'Beginner to Advanced',
      topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'],
      color: 'orange'
    },
    {
      title: 'Competitive Programming',
      description: 'Learn strategies and techniques for coding competitions',
      icon: TrophyIcon,
      difficulty: 'Intermediate',
      topics: ['Time Complexity', 'Problem Solving', 'Contest Strategies'],
      color: 'blue'
    },
    {
      title: 'System Design',
      description: 'Understand how to design scalable systems',
      icon: TargetIcon,
      difficulty: 'Advanced',
      topics: ['Scalability', 'Database Design', 'Caching', 'Load Balancing'],
      color: 'purple'
    }
  ];

  const tutorialResources = [
    {
      title: 'Getting Started Guide',
      description: 'Learn how to use CodeBattle effectively',
      type: 'Guide',
      icon: BookOpenIcon,
      link: '#'
    },
    {
      title: 'Problem Solving Tips',
      description: 'Essential tips for solving coding problems',
      type: 'Article',
      icon: LightBulbIcon,
      link: '#'
    },
    {
      title: 'C++ STL Reference',
      description: 'Complete reference for C++ Standard Template BookOpenIcon',
      type: 'Reference',
      icon: CodeBracketIcon,
      link: '#'
    },
    {
      title: 'Python Cheat Sheet',
      description: 'Quick reference for Python syntax and libraries',
      type: 'Cheat Sheet',
      icon: DocumentTextIcon,
      link: '#'
    }
  ];

  const externalResources = [
    {
      title: 'LeetCodeBracketIcon',
      description: 'Practice coding problems',
      url: 'https://leetcode.com',
      icon: ArrowTopRightOnSquareIcon
    },
    {
      title: 'Codeforces',
      description: 'Competitive programming platform',
      url: 'https://codeforces.com',
      icon: ArrowTopRightOnSquareIcon
    },
    {
      title: 'GeeksforGeeks',
      description: 'Tutorials and practice problems',
      url: 'https://www.geeksforgeeks.org',
      icon: ArrowTopRightOnSquareIcon
    },
    {
      title: 'CP-Algorithms',
      description: 'Algorithm implementations and explanations',
      url: 'https://cp-algorithms.com',
      icon: ArrowTopRightOnSquareIcon
    }
  ];

  const videoResources = [
    {
      title: 'DSA Playlist',
      description: 'Complete DSA tutorial series',
      platform: 'YouTube',
      icon: ArrowTopRightOnSquareIcon
    },
    {
      title: 'System Design',
      description: 'System design interview preparation',
      platform: 'YouTube',
      icon: ArrowTopRightOnSquareIcon
    },
    {
      title: 'Problem Walkthroughs',
      description: 'Step-by-step problem solutions',
      platform: 'YouTube',
      icon: ArrowTopRightOnSquareIcon
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {/* Header */}
      <header className={`${cardBg} border-b sticky top-0 z-50 shadow-sm`} style={{ borderBottomWidth: '1px', borderBottomColor: isDark ? '#2a2a2a' : '#e5e7eb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur-sm opacity-50"></div>
                <div className="relative p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg">
                  <CodeBracketIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h1 className={`text-xl font-bold ${textColor}`}>
                CodeBattle <span className={`text-sm font-normal ${textMuted}`}>/ Resources</span>
              </h1>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
              <BookOpenIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-4xl md:text-5xl font-bold ${textColor} mb-2`}>
                Learning <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Resources</span>
              </h1>
              <p className={`text-lg ${textMuted}`}>
                Everything you need to master competitive programming
              </p>
            </div>
          </div>
        </div>

        {/* Learning Paths */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <AcademicCapIcon className="w-6 h-6 text-orange-500" />
            <h2 className={`text-3xl font-bold ${textColor}`}>Learning Paths</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 flex items-center justify-center h-32">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : resources['learning-path'].length > 0 ? (
              resources['learning-path'].map((path, index) => {
                const Icon = getIconComponent(path.icon);
                return (
                  <div
                    key={path._id}
                    onMouseEnter={() => setHoveredCard(`path-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`${cardBg} rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
                      hoveredCard === `path-${index}` ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
                    }`}
                    style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${isDark ? 'bg-dark-800' : 'bg-gray-50'}`}>
                        <Icon className="w-6 h-6 text-orange-500" />
                      </div>
                      {path.difficulty && (
                        <span className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-dark-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {path.difficulty}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-xl font-bold ${textColor} mb-2`}>{path.title}</h3>
                    <p className={`text-sm ${textMuted} mb-4`}>{path.description}</p>
                    {path.topics && path.topics.length > 0 && (
                      <div className="space-y-2">
                        <p className={`text-xs font-semibold ${textMuted} uppercase tracking-wider`}>Topics Covered:</p>
                        <div className="flex flex-wrap gap-2">
                          {path.topics.map((topic, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-dark-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {path.url && (
                      <button 
                        onClick={() => window.open(path.url, '_blank')}
                        className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition font-medium text-sm shadow-lg flex items-center justify-center gap-2"
                      >
                        Start Learning
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              learningPaths.map((path, index) => {
                const Icon = path.icon;
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredCard(`path-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`${cardBg} rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
                      hoveredCard === `path-${index}` ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
                    }`}
                    style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${isDark ? 'bg-dark-800' : 'bg-gray-50'}`}>
                        <Icon className="w-6 h-6 text-orange-500" />
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-dark-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        {path.difficulty}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold ${textColor} mb-2`}>{path.title}</h3>
                    <p className={`text-sm ${textMuted} mb-4`}>{path.description}</p>
                    <div className="space-y-2">
                      <p className={`text-xs font-semibold ${textMuted} uppercase tracking-wider`}>Topics Covered:</p>
                      <div className="flex flex-wrap gap-2">
                        {path.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-dark-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition font-medium text-sm shadow-lg flex items-center justify-center gap-2">
                      Start Learning
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Tutorial Resources */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Book className="w-6 h-6 text-orange-500" />
            <h2 className={`text-3xl font-bold ${textColor}`}>Tutorials & Guides</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutorialResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredCard(`tutorial-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`${cardBg} rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
                    hoveredCard === `tutorial-${index}` ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
                  }`}
                  style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
                >
                  <Icon className="w-8 h-8 mb-4 text-orange-500" />
                  <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-orange-900/20 text-orange-300' : 'bg-orange-100 text-orange-700'} mb-3 inline-block`}>
                    {resource.type}
                  </span>
                  <h3 className={`text-lg font-bold ${textColor} mb-2`}>{resource.title}</h3>
                  <p className={`text-sm ${textMuted}`}>{resource.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* VideoIcon Resources */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <VideoIcon className="w-6 h-6 text-orange-500" />
            <h2 className={`text-3xl font-bold ${textColor}`}>VideoIcon Tutorials</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoResources.map((video, index) => {
              const Icon = video.icon;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredCard(`video-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`${cardBg} rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
                    hoveredCard === `video-${index}` ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
                  }`}
                  style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg bg-red-500/10`}>
                      <Icon className="w-6 h-6 text-red-500" />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-dark-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      {video.platform}
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold ${textColor} mb-2`}>{video.title}</h3>
                  <p className={`text-sm ${textMuted}`}>{video.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* External Resources */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <NewspaperIcon className="w-6 h-6 text-orange-500" />
            <h2 className={`text-3xl font-bold ${textColor}`}>External Resources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {externalResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredCard(`external-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`${cardBg} rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
                    hoveredCard === `external-${index}` ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
                  }`}
                  style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-dark-800' : 'bg-gray-50'}`}>
                      <Icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <ArrowRightIcon className={`w-4 h-4 ${textMuted}`} />
                  </div>
                  <h3 className={`text-lg font-bold ${textColor} mb-2`}>{resource.title}</h3>
                  <p className={`text-sm ${textMuted}`}>{resource.description}</p>
                </a>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className={`${cardBg} rounded-2xl p-12 border text-center shadow-2xl`} style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb', borderWidth: '1px' }}>
          <div className="max-w-2xl mx-auto">
            <BoltIcon className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className={`text-3xl font-bold ${textColor} mb-4`}>
              Ready to Start Learning?
            </h2>
            <p className={`text-lg ${textMuted} mb-8`}>
              Practice with real coding problems and track your progress
            </p>
            <div className="flex gap-4 justify-center">
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
        </section>
      </main>
    </div>
  );
}
