import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import Editor from '@monaco-editor/react';
import { toast } from 'react-hot-toast';
import {
  PlayIcon, PaperAirplaneIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon,
  Cog6ToothIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon,
  CodeBracketIcon, DocumentTextIcon, ChatBubbleLeftIcon, BarChartIcon,
  LightBulbIcon, BookOpenIcon, HandThumbUpIcon, HandThumbDownIcon,
  ShareIcon, StarIcon, EyeIcon, EyeSlashIcon, ArrowsPointingOutIcon,
  ArrowsPointingInIcon, SparklesIcon, ArrowTopRightOnSquareIcon, Bars3Icon,
  UserGroupIcon, BookmarkIcon, InformationCircleIcon, ListBulletIcon,
  PlusIcon, XMarkIcon
} from '@heroicons/react/24/solid';
import {
  PlayIcon as PlayOutline, HandThumbUpIcon as HandThumbUpOutline,
  HandThumbDownIcon as HandThumbDownOutline, StarIcon as StarOutline
} from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CodeEditorNew() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { isDark } = useThemeStore();
  const editorRef = useRef(null);

  // Problem data
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editor state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [fontSize, setFontSize] = useState(14);
  
  // UI state
  const [activeTab, setActiveTab] = useState('description'); // description, editorial, solutions, submissions
  const [leftPanelTab, setLeftPanelTab] = useState('description');
  const [consoleTab, setConsoleTab] = useState('testcase'); // testcase, result
  const [showConsole, setShowConsole] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Test execution
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  
  // Problem metadata
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hints, setHints] = useState([]);
  const [unlockedHints, setUnlockedHints] = useState([]);
  const [likeCount, setLikeCount] = useState(9300);
  const [commentCount, setCommentCount] = useState(204);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState('Saved');

  // Editorial & Solutions
  const [editorial, setEditorial] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(39);

  // Layout
  const [leftWidth, setLeftWidth] = useState(50);
  const [consoleHeight, setConsoleHeight] = useState(200);

  // Fetch problem
  useEffect(() => {
    fetchProblem();
    fetchOnlineUsers();
    fetchUserPreferences();
  }, [problemId]);

  // Set initial code template
  useEffect(() => {
    if (problem?.functionSignature && !code) {
      setCode(problem.functionSignature[language] || '');
    }
  }, [problem, language]);

  const fetchProblem = async () => {
    try {
      const response = await fetch(`${API_URL}/problems/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setProblem(data);
      // Fetch hints for the problem
      fetchHints();
    } catch (error) {
      toast.error('Failed to load problem');
      navigate('/problems');
    } finally {
      setLoading(false);
    }
  };

  const fetchHints = async () => {
    try {
      const response = await fetch(`${API_URL}/judge/hints/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHints(data.hints || []);
      }
    } catch (error) {
      console.error('Failed to fetch hints:', error);
    }
  };

  const fetchEditorial = async () => {
    try {
      const response = await fetch(`${API_URL}/explanations/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEditorial(data);
      }
    } catch (error) {
      console.error('Failed to fetch editorial:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${API_URL}/submissions?problemId=${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  const unlockHint = (hintId) => {
    if (!unlockedHints.includes(hintId)) {
      setUnlockedHints([...unlockedHints, hintId]);
    }
  };

  // Problem Navigation
  const goToPreviousProblem = async () => {
    try {
      const response = await fetch(`${API_URL}/problems?skip=${Math.max(0, parseInt(problemId) - 1)}&limit=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.problems && data.problems.length > 0) {
          navigate(`/problem/${data.problems[0]._id}`);
        }
      }
    } catch (error) {
      toast.error('Failed to load previous problem');
    }
  };

  const goToNextProblem = async () => {
    try {
      const response = await fetch(`${API_URL}/problems?skip=${parseInt(problemId) + 1}&limit=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.problems && data.problems.length > 0) {
          navigate(`/problem/${data.problems[0]._id}`);
        } else {
          toast.info('No more problems');
        }
      }
    } catch (error) {
      toast.error('Failed to load next problem');
    }
  };

  const goToRandomProblem = async () => {
    try {
      const response = await fetch(`${API_URL}/problems?random=true&limit=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.problems && data.problems.length > 0) {
          navigate(`/problem/${data.problems[0]._id}`);
        }
      }
    } catch (error) {
      toast.error('Failed to load random problem');
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setRunning(true);
    setConsoleTab('result');
    
    try {
      const response = await fetch(`${API_URL}/judge/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          language,
          problemId,
          testCaseIndex: selectedTestCase
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to run code');
      }

      const result = await response.json();
      setTestResults({
        ...result,
        status: result.status || 'Accepted'
      });

      if (result.status === 'Accepted') {
        toast.success('✅ Test case passed!');
      } else if (result.error) {
        toast.error('❌ Runtime Error');
      } else {
        toast.error('❌ Wrong Answer');
      }
    } catch (error) {
      toast.error(`Error: ${error.message || 'Failed to run code'}`);
      console.error('Run code error:', error);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setSubmitting(true);
    setConsoleTab('result');

    try {
      const response = await fetch(`${API_URL}/judge/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          language,
          problemId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit code');
      }

      const result = await response.json();
      setTestResults({
        status: result.status,
        testCasesPassed: result.testCasesPassed,
        totalTestCases: result.totalTestCases,
        executionTime: result.executionTime,
        memoryUsed: result.memoryUsed,
        outputs: result.outputs,
        errors: result.errors
      });

      if (result.status === 'Accepted') {
        toast.success('✅ Accepted! All test cases passed!');
      } else {
        toast.error(`❌ ${result.testCasesPassed}/${result.totalTestCases} test cases passed`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message || 'Failed to submit code'}`);
      console.error('Submit code error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset to default code template?')) {
      setCode(problem?.functionSignature?.[language] || '');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return isDark ? 'text-green-400' : 'text-green-600';
      case 'Medium': return isDark ? 'text-yellow-500' : 'text-yellow-600';
      case 'Hard': return isDark ? 'text-red-400' : 'text-red-600';
      default: return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  // Fetch user preferences
  useEffect(() => {
    if (problemId && token) {
      fetchUserPreferences();
    }
  }, [problemId, token]);

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch(`${API_URL}/problem-metadata/${problemId}/user-preferences`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const prefs = await response.json();
        console.log('User preferences loaded:', prefs);
        setLiked(prefs.liked);
        setDisliked(prefs.disliked);
        setBookmarked(prefs.bookmarked);
        setLikeCount(prefs.likes || 9300);
        setCommentCount(prefs.comments || 204);
      } else {
        const error = await response.json();
        console.error('Failed to fetch preferences:', error);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    }
  };

  // Fetch online users
  const fetchOnlineUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/problems/online-users/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Online users loaded:', data);
        setOnlineUsers(data.onlineUsers || 39);
      } else {
        console.error('Failed to fetch online users');
      }
    } catch (error) {
      console.error('Failed to fetch online users:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`${API_URL}/problem-metadata/${problemId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setDisliked(false);
        setLikeCount(data.likes);
        setCommentCount(data.comments || commentCount);
        toast.success(data.liked ? '👍 Liked!' : '👎 Unlike');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to like problem');
        console.error('Like error:', error);
      }
    } catch (error) {
      toast.error('Failed to save preference');
      console.error('Like fetch error:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch(`${API_URL}/problem-metadata/${problemId}/dislike`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setDisliked(data.disliked);
        setLiked(false);
        setLikeCount(data.likes);
        setCommentCount(data.comments || commentCount);
        toast.success(data.disliked ? '👎 Disliked!' : 'Remove dislike');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to dislike problem');
        console.error('Dislike error:', error);
      }
    } catch (error) {
      toast.error('Failed to save preference');
      console.error('Dislike fetch error:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await fetch(`${API_URL}/problem-metadata/${problemId}/bookmark`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarked(data.bookmarked);
        toast.success(data.bookmarked ? '🔖 Bookmarked!' : '🔖 Bookmark removed');
      }
    } catch (error) {
      toast.error('Failed to save bookmark');
      console.error(error);
    }
  };

  const formatLikeCount = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  const bgColor = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
  const bgSecondary = isDark ? 'bg-[#262626]' : 'bg-gray-50';
  const borderColor = isDark ? 'border-[#333333]' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const mutedText = isDark ? 'text-gray-400' : 'text-gray-600';
  const hoverBg = isDark ? 'hover:bg-[#262626]' : 'hover:bg-gray-100';

  if (loading) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
        <div className="animate-spin">
          <ArrowPathIcon className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${bgColor} ${textColor}`}>
      {/* Top Navigation Bar */}
      <header className={`border-b ${borderColor} px-3 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          {/* Logo/Back */}
          <button
            onClick={() => navigate('/problems')}
            className={`${hoverBg} p-1.5 rounded transition`}
          >
            <CodeBracketIcon className="w-5 h-5 text-blue-600" />
          </button>

          {/* Problem Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={goToPreviousProblem}
              className={`${hoverBg} p-1.5 rounded transition`}
              title="Previous Problem"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/problems')}
              className={`${hoverBg} p-1.5 rounded transition`}
              title="Problem List"
            >
              <Bars3Icon className="w-4 h-4" />
            </button>
            <button
              onClick={goToNextProblem}
              className={`${hoverBg} p-1.5 rounded transition`}
              title="Next Problem"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Random Problem */}
          <button
            onClick={goToRandomProblem}
            className={`${hoverBg} p-1.5 rounded transition`}
            title="Random Problem"
          >
            <SparklesIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Premium Badge */}
          <button className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded text-xs font-semibold hover:from-blue-700 hover:to-purple-700 transition">
            Premium
          </button>

          {/* Icons */}
          <button className={`${hoverBg} p-1.5 rounded transition`} title="Online Users">
            <UserGroupIcon className="w-4 h-4" />
          </button>
          
          <button className={`${hoverBg} p-1.5 rounded transition`} title="Settings">
            <Cog6ToothIcon className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`${hoverBg} p-1.5 rounded transition`}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <ArrowsPointingInIcon className="w-4 h-4" /> : <ArrowsPointingOutIcon className="w-4 h-4" />}
          </button>

          <div className={`${hoverBg} p-1.5 rounded cursor-pointer`}>
            <span className="text-sm font-medium">0</span>
          </div>

          <button className={`${hoverBg} p-1.5 rounded transition`} title="Timer">
            <ClockIcon className="w-4 h-4" />
          </button>

          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.username?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div 
          className={`border-r ${borderColor} overflow-hidden flex flex-col`}
          style={{ width: `${leftWidth}%` }}
        >
          {/* Tabs */}
          <div className={`border-b ${borderColor} flex`}>
            {[
              { id: 'description', label: 'Description', icon: DocumentTextIcon },
              { id: 'editorial', label: 'Editorial', icon: BookOpenIcon },
              { id: 'solutions', label: 'Solutions', icon: UserGroupIcon },
              { id: 'submissions', label: 'Submissions', icon: ListBulletIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setLeftPanelTab(tab.id);
                    // Fetch data when tab is clicked
                    if (tab.id === 'editorial' && !editorial) fetchEditorial();
                    if (tab.id === 'submissions' && submissions.length === 0) fetchSubmissions();
                  }}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
                    leftPanelTab === tab.id
                      ? 'border-blue-500 text-blue-500'
                      : `border-transparent ${mutedText} ${hoverBg}`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {leftPanelTab === 'description' && (
              <div className="p-4 space-y-4">
                {/* Problem Title */}
                <div>
                  <h1 className={`text-xl font-semibold mb-3 ${textColor}`}>
                    {problem?.title}
                  </h1>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Difficulty Badge */}
                    <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                      problem?.difficulty === 'Easy' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : problem?.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {problem?.difficulty}
                    </span>

                    {/* Topics */}
                    {problem?.tags && problem.tags.length > 0 && (
                      <>
                        <span className={`text-xs ${mutedText}`}>Topics</span>
                        {problem.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-0.5 rounded ${bgSecondary} ${mutedText} hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition`}
                          >
                            {tag}
                          </span>
                        ))}
                      </>
                    )}

                    {/* Companies */}
                    {problem?.companyTags && problem.companyTags.length > 0 && (
                      <>
                        <span className={`text-xs ${mutedText}`}>Companies</span>
                        {problem.companyTags.slice(0, 3).map((company, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-0.5 rounded ${bgSecondary} ${mutedText} hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition`}
                          >
                            {company}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Problem Description */}
                <div className="text-sm leading-relaxed space-y-4">
                  <p>{problem?.description}</p>
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  {problem?.examples?.map((example, idx) => (
                    <div key={idx}>
                      <p className="text-sm font-semibold mb-2">Example {idx + 1}:</p>
                      <div className={`${bgSecondary} rounded-lg p-3 space-y-2 text-sm font-mono`}>
                        <div>
                          <span className="font-semibold">Input:</span> {example.input}
                        </div>
                        <div>
                          <span className="font-semibold">Output:</span> {example.output}
                        </div>
                        {example.explanation && (
                          <div>
                            <span className="font-semibold">Explanation:</span> {example.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                {problem?.constraints && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Constraints:</h3>
                    <ul className={`text-sm space-y-1 ${mutedText} font-mono`}>
                      {problem.constraints.split(',').map((constraint, idx) => (
                        <li key={idx} className="ml-4">• {constraint.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hints Section */}
                {hints.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <LightBulbIcon className="w-4 h-4 text-yellow-500" />
                        Hints
                      </h3>
                      <button
                        onClick={() => setShowHints(!showHints)}
                        className={`text-xs px-2 py-1 rounded ${bgSecondary} ${hoverBg} transition`}
                      >
                        {showHints ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    {showHints && (
                      <div className="space-y-2">
                        {hints.map((hint) => (
                          <div
                            key={hint.id}
                            className={`${bgSecondary} rounded p-3 text-sm`}
                          >
                            {unlockedHints.includes(hint.id) ? (
                              <>
                                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Hint {hint.id}: {hint.title}</p>
                                <p className={mutedText}>{hint.content}</p>
                              </>
                            ) : (
                              <button
                                onClick={() => unlockHint(hint.id)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition font-medium flex items-center gap-2"
                              >
                                <LightBulbIcon className="w-4 h-4" />
                                Unlock Hint {hint.id}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {leftPanelTab === 'editorial' && (
              <div className="p-4 space-y-4">
                <h2 className="text-lg font-bold">Editorial</h2>
                {editorial ? (
                  <div className="space-y-4">
                    <div className={`${bgSecondary} rounded-lg p-4`}>
                      <h3 className="font-semibold mb-2">Approach:</h3>
                      <p className={`text-sm ${mutedText}`}>{editorial.approach}</p>
                    </div>
                    {editorial.solution && (
                      <div className={`${bgSecondary} rounded-lg p-4`}>
                        <h3 className="font-semibold mb-2">Solution:</h3>
                        <pre className={`text-xs overflow-x-auto ${bgColor} p-2 rounded font-mono`}>
                          {editorial.solution}
                        </pre>
                      </div>
                    )}
                    {editorial.complexity && (
                      <div className={`${bgSecondary} rounded-lg p-4`}>
                        <h3 className="font-semibold mb-2">Complexity Analysis:</h3>
                        <p className={`text-sm ${mutedText}`}>{editorial.complexity}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`${bgSecondary} rounded-lg p-6 text-center`}>
                    <BookOpenIcon className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <p className={`text-sm ${mutedText} mb-4`}>
                      Editorial not available for this problem
                    </p>
                  </div>
                )}
              </div>
            )}

            {leftPanelTab === 'solutions' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Solutions</h2>
                  <select className={`px-3 py-1.5 text-xs rounded border ${borderColor} ${bgColor}`}>
                    <option>Most Votes</option>
                    <option>Most Recent</option>
                    <option>Top Runtime</option>
                  </select>
                </div>
                <div className={`${bgSecondary} rounded-lg p-6 text-center`}>
                  <UserGroupIcon className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                  <p className={`text-sm ${mutedText}`}>
                    Solve the problem to unlock community solutions
                  </p>
                </div>
              </div>
            )}

            {leftPanelTab === 'submissions' && (
              <div className="p-4 space-y-4">
                <h2 className="text-lg font-bold">Submissions</h2>
                {submissions.length > 0 ? (
                  <div className="space-y-2">
                    {submissions.slice(0, 10).map((submission, idx) => (
                      <div
                        key={idx}
                        className={`${bgSecondary} rounded p-3 text-sm`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium flex items-center gap-2">
                            {submission.status === 'Accepted' ? (
                              <>
                                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                <span className="text-green-600">{submission.status}</span>
                              </>
                            ) : (
                              <>
                                <XCircleIcon className="w-4 h-4 text-red-600" />
                                <span className="text-red-600">{submission.status}</span>
                              </>
                            )}
                          </span>
                          <span className={`text-xs ${mutedText}`}>
                            {submission.language}
                          </span>
                        </div>
                        <div className={`text-xs ${mutedText}`}>
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </div>
                        {submission.runtime && (
                          <div className={`text-xs ${mutedText}`}>
                            Runtime: {submission.runtime}ms
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`${bgSecondary} rounded-lg p-6 text-center`}>
                    <ListBulletIcon className="w-12 h-12 mx-auto mb-3 text-green-600" />
                    <p className={`text-sm ${mutedText}`}>
                      Your submissions will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Actions Bar */}
          <div className={`border-t ${borderColor} px-4 py-2.5 flex items-center justify-between text-sm`}>
            <div className="flex items-center gap-3">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 ${hoverBg} px-2 py-1 rounded transition ${
                  liked ? 'text-blue-600' : mutedText
                }`}
                title="Like this problem"
              >
                {liked ? (
                  <HandThumbUpIcon className="w-4 h-4" />
                ) : (
                  <HandThumbUpOutline className="w-4 h-4" />
                )}
                <span className="font-medium">{formatLikeCount(likeCount)}</span>
              </button>

              {/* Dislike */}
              <button
                onClick={handleDislike}
                className={`${hoverBg} p-1 rounded transition ${
                  disliked ? 'text-red-600' : mutedText
                }`}
                title="Dislike this problem"
              >
                {disliked ? (
                  <HandThumbDownIcon className="w-4 h-4" />
                ) : (
                  <HandThumbDownOutline className="w-4 h-4" />
                )}
              </button>

              {/* Comments */}
              <button className={`flex items-center gap-1.5 ${hoverBg} px-2 py-1 rounded transition ${mutedText}`} title="Comments">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                <span className="font-medium">{commentCount}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={handleBookmark}
                className={`${hoverBg} p-1 rounded transition ${
                  bookmarked ? 'text-amber-600' : mutedText
                }`}
                title="Bookmark this problem"
              >
                {bookmarked ? (
                  <StarIcon className="w-4 h-4" />
                ) : (
                  <StarOutline className="w-4 h-4" />
                )}
              </button>

              {/* Share */}
              <button className={`${hoverBg} p-1 rounded transition ${mutedText}`} title="Share">
                <ShareIcon className="w-4 h-4" />
              </button>

              {/* External Link */}
              <button className={`${hoverBg} p-1 rounded transition ${mutedText}`} title="Open in new tab">
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </button>

              {/* Info */}
              <button className={`${hoverBg} p-1 rounded transition ${mutedText}`} title="Problem info">
                <InformationCircleIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Online Count */}
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className={mutedText}>{onlineUsers} Online</span>
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className={`w-1 cursor-col-resize ${hoverBg} transition`}
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = leftWidth;

            const handleMouseMove = (e) => {
              const delta = ((e.clientX - startX) / window.innerWidth) * 100;
              const newWidth = Math.max(30, Math.min(70, startWidth + delta));
              setLeftWidth(newWidth);
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Tab Header */}
          <div className={`border-b ${borderColor} px-4 py-2 flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CodeBracketIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Code Editor</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-3 py-1 text-sm rounded border ${borderColor} ${bgColor} font-medium cursor-pointer`}
              >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python3</option>
                <option value="javascript">JavaScript</option>
              </select>

              {/* Auto Toggle */}
              <div className="flex items-center gap-2">
                <button className={`flex items-center gap-1 px-2 py-1 text-xs ${bgSecondary} rounded ${mutedText}`}>
                  <Cog6ToothIcon className="w-3 h-3" />
                  Auto
                </button>
              </div>
            </div>
          </div>

          {/* Editor Toolbar */}
          <div className={`border-b ${borderColor} px-4 py-1.5 flex items-center justify-between text-xs`}>
            <div className="flex items-center gap-2">
              {/* Font Size */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className={`${hoverBg} px-2 py-0.5 rounded font-medium`}
                >
                  A-
                </button>
                <span className="px-1 text-xs">{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className={`${hoverBg} px-2 py-0.5 rounded font-medium`}
                >
                  A+
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Icons */}
              <button className={`${hoverBg} p-1 rounded transition`} title="Settings">
                <Cog6ToothIcon className="w-3.5 h-3.5" />
              </button>
              <button className={`${hoverBg} p-1 rounded transition`} title="Fullscreen">
                <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleReset}
                className={`${hoverBg} p-1 rounded transition`} 
                title="Reset"
              >
                <ArrowPathIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={isDark ? 'vs-dark' : 'light'}
              options={{
                fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 4,
                fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
                fontLigatures: true,
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                bracketPairColorization: { enabled: true },
                padding: { top: 12, bottom: 12 },
                lineNumbers: 'on',
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
              }}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
            />
          </div>

          {/* Bottom Status Bar */}
          <div className={`border-t ${borderColor} px-4 py-1.5 flex items-center justify-between text-xs ${mutedText}`}>
            <div className="flex items-center gap-3">
              <span>{lastSaved}</span>
              {autoSave && <span className="text-green-500">● Auto-save enabled</span>}
            </div>
            <div className="flex items-center gap-2">
              <span>Ln 1, Col 1</span>
            </div>
          </div>

          {/* Console - Test Cases & Results */}
          {showConsole && (
            <>
              {/* Resize Handle */}
              <div
                className={`h-1 cursor-row-resize ${borderColor} border-t ${hoverBg} transition`}
                onMouseDown={(e) => {
                  const startY = e.clientY;
                  const startHeight = consoleHeight;

                  const handleMouseMove = (e) => {
                    const delta = startY - e.clientY;
                    const newHeight = Math.max(150, Math.min(400, startHeight + delta));
                    setConsoleHeight(newHeight);
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />

              <div
                className={`overflow-hidden flex flex-col`}
                style={{ height: `${consoleHeight}px` }}
              >
                {/* Console Tabs */}
                <div className={`border-b ${borderColor} flex items-center justify-between px-4 ${bgSecondary}`}>
                  <div className="flex">
                    <button
                      onClick={() => setConsoleTab('testcase')}
                      className={`px-4 py-2 text-sm font-medium transition ${
                        consoleTab === 'testcase'
                          ? `${textColor} border-b-2 border-blue-500`
                          : mutedText
                      }`}
                    >
                      Testcase
                    </button>
                    <button
                      onClick={() => setConsoleTab('result')}
                      className={`px-4 py-2 text-sm font-medium transition ${
                        consoleTab === 'result'
                          ? `${textColor} border-b-2 border-blue-500`
                          : mutedText
                      }`}
                    >
                      Test Result
                    </button>
                  </div>

                  <button
                    onClick={() => setShowConsole(false)}
                    className={`${hoverBg} p-1 rounded`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Console Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {consoleTab === 'testcase' && (
                    <div className="space-y-3">
                      {/* Test Case Selector */}
                      <div className="flex gap-2">
                        {problem?.testCases?.slice(0, 3).map((tc, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedTestCase(idx)}
                            className={`px-3 py-1.5 text-sm rounded transition ${
                              selectedTestCase === idx
                                ? 'bg-blue-500 text-white'
                                : `${bgSecondary} ${mutedText} ${hoverBg}`
                            }`}
                          >
                            Case {idx + 1}
                          </button>
                        ))}
                      </div>

                      {/* Test Case Input */}
                      <div>
                        <label className="text-sm font-medium mb-1 block">nums =</label>
                        <div className={`${bgSecondary} rounded p-3 font-mono text-sm`}>
                          {problem?.testCases?.[selectedTestCase]?.input}
                        </div>
                      </div>
                    </div>
                  )}

                  {consoleTab === 'result' && (
                    <div className="space-y-3">
                      {testResults ? (
                        <>
                          {/* Status */}
                          <div className="flex items-center gap-2">
                            {testResults.status === 'Accepted' ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="text-lg font-semibold text-green-500">Accepted</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-red-500" />
                                <span className="text-lg font-semibold text-red-500">{testResults.status}</span>
                              </>
                            )}
                          </div>

                          {/* Stats */}
                          {testResults.status === 'Accepted' && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className={`text-xs ${mutedText} mb-1`}>Runtime</p>
                                <p className="text-sm font-semibold">{testResults.executionTime}ms</p>
                                <p className="text-xs text-green-500">Beats 85.2%</p>
                              </div>
                              <div>
                                <p className={`text-xs ${mutedText} mb-1`}>Memory</p>
                                <p className="text-sm font-semibold">{testResults.memoryUsed?.toFixed(2)}MB</p>
                                <p className="text-xs text-green-500">Beats 72.4%</p>
                              </div>
                            </div>
                          )}

                          {/* Test Cases Passed */}
                          <div>
                            <p className="text-sm font-medium mb-1">
                              Test Cases: {testResults.testCasesPassed}/{testResults.totalTestCases}
                            </p>
                          </div>

                          {/* Output */}
                          {testResults.output && (
                            <div>
                              <label className="text-sm font-medium mb-1 block">Your Output:</label>
                              <div className={`${bgSecondary} rounded p-3 font-mono text-sm`}>
                                {testResults.output}
                              </div>
                            </div>
                          )}

                          {/* Error */}
                          {testResults.error && (
                            <div>
                              <label className="text-sm font-medium mb-1 block text-red-500">Error:</label>
                              <div className="bg-red-900/20 border border-red-500/30 rounded p-3 font-mono text-sm text-red-400">
                                {testResults.error}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className={`text-sm ${mutedText}`}>
                          Run your code to see results here
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Bottom Action Bar */}
          <div className={`border-t ${borderColor} px-4 py-3 flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              {!showConsole && (
                <button
                  onClick={() => setShowConsole(true)}
                  className={`${hoverBg} px-3 py-1.5 rounded text-sm font-medium transition flex items-center gap-2`}
                >
                  Console
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Run Code */}
              <button
                onClick={handleRunCode}
                disabled={running}
                className={`px-4 py-2 rounded text-sm font-medium transition flex items-center gap-2 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900 disabled:opacity-50'
                }`}
              >
                {running ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4" />
                    Run
                  </>
                )}
              </button>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
