import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import Editor from '@monaco-editor/react';
import { toast } from 'react-hot-toast';
import { getSocket } from '../utils/socket';
import { 
  Play, Send, ChevronLeft, ChevronRight, ChevronDown, Settings, 
  Clock, CheckCircle2, XCircle, Loader2, Code2, FileText, 
  MessageSquare, BarChart3, Lightbulb, BookOpen, ThumbsUp, ThumbsDown,
  Share2, Star, Eye, EyeOff, RotateCcw, Maximize2, Minimize2, Shuffle,
  ExternalLink, Menu, Users, Bookmark, Info, ListOrdered
} from 'lucide-react';

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
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  
  // Problem metadata
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [unlockedHints, setUnlockedHints] = useState([]);
  const [hints, setHints] = useState([]);
  const [totalHints, setTotalHints] = useState(0);
  const [likeCount, setLikeCount] = useState(9300);
  const [commentCount, setCommentCount] = useState(204);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState('Saved');
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [communitySolutions, setCommunitySolutions] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(0);

  // Layout
  const [leftWidth, setLeftWidth] = useState(50);
  const [consoleHeight, setConsoleHeight] = useState(200);

  // Fetch problem and user interaction status
  useEffect(() => {
    fetchProblem();
    fetchProblemStatus();
    fetchHints();
    fetchDiscussions();
  }, [problemId]);

  // Set initial code template
  useEffect(() => {
    if (problem?.functionSignature && !code) {
      setCode(problem.functionSignature[language] || '');
    }
  }, [problem, language]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !code || !problemId) return;

    const timer = setTimeout(async () => {
      try {
        // Save code to draft submission in database
        const response = await fetch(`${API_URL}/submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            problemId,
            code,
            language,
            status: 'Draft',
            isDraft: true
          })
        });

        if (response.ok) {
          setLastSaved(`Saved at ${new Date().toLocaleTimeString()}`);
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 30000); // Save every 30 seconds

    return () => clearTimeout(timer);
  }, [code, autoSave, problemId, language, token]);

  // Socket.io for online users
  useEffect(() => {
    const socket = getSocket();
    
    // Join problem room
    socket.emit('join-problem', { problemId, userId: user?._id, username: user?.username });
    
    // Listen for online users count
    socket.on('problem-users', (count) => {
      setOnlineUsers(count);
    });

    return () => {
      socket.emit('leave-problem', { problemId, userId: user?._id });
      socket.off('problem-users');
    };
  }, [problemId, user]);

  const fetchProblem = async () => {
    try {
      const response = await fetch(`${API_URL}/problems/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setProblem(data);
    } catch (error) {
      toast.error('Failed to load problem');
      navigate('/problems');
    } finally {
      setLoading(false);
    }
  };

  const fetchProblemStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/problems/${problemId}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setLiked(data.liked);
      setDisliked(data.disliked);
      setBookmarked(data.bookmarked);
      setLikeCount(data.likes);
    } catch (error) {
      console.error('Failed to fetch problem status:', error);
    }
  };

  const fetchHints = async () => {
    try {
      const response = await fetch(`${API_URL}/problem-metadata/${problemId}/hints`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setHints(data.hints);
      setTotalHints(data.totalHints);
    } catch (error) {
      console.error('Failed to fetch hints:', error);
    }
  };

  const unlockHint = async (hintIndex) => {
    try {
      const response = await fetch(`${API_URL}/problem-metadata/${problemId}/hints/${hintIndex}/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('💡 Hint unlocked!');
        // Update hints to show the unlocked hint
        fetchHints();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to unlock hint');
      console.error('Unlock hint error:', error);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`${API_URL}/discussions/problem/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setDiscussions(data);
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
    }
  };

  const postComment = async () => {
    if (!newCommentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          problem: problemId,
          title: `Comment on ${problem?.title}`,
          content: newCommentText,
          tags: ['comment']
        })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Comment posted!');
        setNewCommentText('');
        fetchDiscussions();
      } else {
        toast.error('Failed to post comment');
      }
    } catch (error) {
      toast.error('Failed to post comment');
      console.error('Post comment error:', error);
    }
  };

  const fetchUserSubmissions = async () => {
    try {
      const response = await fetch(`${API_URL}/submissions?problemId=${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setUserSubmissions(data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  const fetchCommunitySolutions = async () => {
    try {
      const response = await fetch(`${API_URL}/submissions/community/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setCommunitySolutions(data);
    } catch (error) {
      console.error('Failed to fetch community solutions:', error);
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
          testCaseIndex: customInput ? undefined : selectedTestCase,
          input: customInput || undefined
        })
      });

      const result = await response.json();
      setTestResults(result);

      if (result.status === 'Accepted') {
        toast.success('Test case passed!');
      } else {
        toast.error(result.status);
      }
    } catch (error) {
      toast.error('Failed to run code');
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

      const result = await response.json();
      setTestResults(result);

      if (result.status === 'Accepted') {
        toast.success('✅ Accepted!');
      } else {
        toast.error(`❌ ${result.status}`);
      }
    } catch (error) {
      toast.error('Failed to submit code');
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

  const handleLike = async () => {
    try {
      const response = await fetch(`${API_URL}/problems/${problemId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setLiked(data.liked);
      setLikeCount(data.likes);
      if (data.liked) {
        setDisliked(false);
      }
      toast.success(data.liked ? 'Liked!' : 'Unliked!');
    } catch (error) {
      toast.error('Failed to like problem');
      console.error('Like error:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch(`${API_URL}/problems/${problemId}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setDisliked(data.disliked);
      if (data.disliked) {
        setLiked(false);
      }
      toast.success(data.disliked ? 'Disliked!' : 'Undisliked!');
    } catch (error) {
      toast.error('Failed to dislike problem');
      console.error('Dislike error:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await fetch(`${API_URL}/problems/${problemId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBookmarked(data.bookmarked);
      toast.success(data.bookmarked ? '🔖 Bookmarked!' : '🔖 Removed from bookmarks!');
    } catch (error) {
      toast.error('Failed to bookmark problem');
      console.error('Bookmark error:', error);
    }
  };

  const handleShare = async () => {
    const problemUrl = `${window.location.origin}/problem/${problemId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: problem?.title,
          text: `Check out this problem: ${problem?.title}`,
          url: problemUrl
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(problemUrl).then(() => {
        toast.success('Problem link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link');
      });
    }
  };

  const handlePreviousProblem = async () => {
    try {
      const response = await fetch(`${API_URL}/problems`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const problems = await response.json();
      const currentIndex = problems.findIndex(p => p._id === problemId);
      if (currentIndex > 0) {
        navigate(`/problem/${problems[currentIndex - 1]._id}`);
      } else {
        toast.error('No previous problem');
      }
    } catch (error) {
      toast.error('Failed to navigate');
    }
  };

  const handleNextProblem = async () => {
    try {
      const response = await fetch(`${API_URL}/problems`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const problems = await response.json();
      const currentIndex = problems.findIndex(p => p._id === problemId);
      if (currentIndex < problems.length - 1) {
        navigate(`/problem/${problems[currentIndex + 1]._id}`);
      } else {
        toast.error('No next problem');
      }
    } catch (error) {
      toast.error('Failed to navigate');
    }
  };

  const handleRandomProblem = async () => {
    try {
      const response = await fetch(`${API_URL}/problems/random`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const problem = await response.json();
      navigate(`/problem/${problem._id}`);
    } catch (error) {
      toast.error('Failed to get random problem');
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
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${bgColor} ${textColor} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Navigation Bar */}
      {!isFullscreen && (
      <header className={`border-b ${borderColor} px-3 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          {/* Logo/Back */}
          <button
            onClick={() => navigate('/problems')}
            className={`${hoverBg} p-1.5 rounded transition`}
          >
            <Code2 className="w-5 h-5 text-orange-500" />
          </button>

          {/* Problem Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePreviousProblem}
              className={`${hoverBg} p-1.5 rounded transition`}
              title="Previous Problem"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/problems')}
              className={`${hoverBg} p-1.5 rounded transition`}
              title="Problem List"
            >
              <Menu className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextProblem}
              className={`${hoverBg} p-1.5 rounded transition`}
              title="Next Problem"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Random Problem */}
          <button
            onClick={handleRandomProblem}
            className={`${hoverBg} p-1.5 rounded transition`}
            title="Random Problem"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Premium Badge */}
          <button className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded text-xs font-semibold">
            Premium
          </button>

          {/* Icons */}
          <button className={`${hoverBg} p-1.5 rounded transition`}>
            <Users className="w-4 h-4" />
          </button>
          
          <button className={`${hoverBg} p-1.5 rounded transition`}>
            <Settings className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`${hoverBg} p-1.5 rounded transition`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className={`${hoverBg} p-1.5 rounded cursor-pointer`}>
            <span className="text-sm font-medium">0</span>
          </div>

          <button className={`${hoverBg} p-1.5 rounded transition`}>
            <Clock className="w-4 h-4" />
          </button>

          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
        </div>
      </header>
      )}

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
              { id: 'description', label: 'Description', icon: FileText },
              { id: 'editorial', label: 'Editorial', icon: BookOpen },
              { id: 'solutions', label: 'Solutions', icon: Users },
              { id: 'submissions', label: 'Submissions', icon: ListOrdered },
              { id: 'discussions', label: 'Discussions', icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setLeftPanelTab(tab.id)}
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
              </div>
            )}

            {leftPanelTab === 'editorial' && (
              <div className="p-4 space-y-4">
                <h2 className="text-lg font-bold">Hints & Editorial</h2>
                {hints && hints.length > 0 ? (
                  <div className="space-y-3">
                    {hints.map((hint, idx) => (
                      <div key={idx} className={`${bgSecondary} rounded-lg p-3 border ${borderColor}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Hint {hint.index + 1}</span>
                          {hint.isLocked ? (
                            <button
                              onClick={() => unlockHint(hint.index)}
                              className="text-xs px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white transition"
                            >
                              Unlock
                            </button>
                          ) : (
                            <span className="text-xs text-green-500">✓ Unlocked</span>
                          )}
                        </div>
                        <p className="text-sm">{hint.hint}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`${bgSecondary} rounded-lg p-6 text-center`}>
                    <Lightbulb className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                    <p className={`text-sm ${mutedText}`}>
                      No hints available for this problem
                    </p>
                  </div>
                )}
                <div className={`${bgSecondary} rounded-lg p-4 mt-4`}>
                  <h3 className="text-sm font-bold mb-2">Premium Editorial</h3>
                  <p className={`text-xs ${mutedText} mb-3`}>
                    Get detailed editorials and explanations
                  </p>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 rounded text-sm font-semibold transition">
                    Unlock Premium
                  </button>
                </div>
              </div>
            )}

            {leftPanelTab === 'solutions' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Solutions</h2>
                  <button
                    onClick={fetchCommunitySolutions}
                    className={`px-3 py-1 text-xs rounded border ${borderColor} ${bgColor} hover:${bgSecondary} transition`}
                  >
                    Reload
                  </button>
                </div>
                {communitySolutions && communitySolutions.length > 0 ? (
                  <div className="space-y-2">
                    {communitySolutions.map((solution, idx) => (
                      <div key={idx} className={`${bgSecondary} rounded-lg p-3 border ${borderColor} cursor-pointer hover:border-blue-500 transition`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{solution.user?.username}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              solution.language === 'cpp' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                              solution.language === 'python' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                              solution.language === 'java' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                            }`}>
                              {solution.language}
                            </span>
                          </div>
                          <div className="text-xs text-green-500 font-medium">Accepted</div>
                        </div>
                        <div className="text-xs mt-2 flex gap-3">
                          {solution.runtime && <span>⚡ {solution.runtime}ms</span>}
                          {solution.memory && <span>💾 {solution.memory}MB</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`${bgSecondary} rounded-lg p-6 text-center`}>
                    <Users className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                    <p className={`text-sm ${mutedText}`}>
                      Solve the problem to unlock community solutions
                    </p>
                  </div>
                )}
              </div>
            )}

            {leftPanelTab === 'submissions' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Submissions</h2>
                  <button
                    onClick={fetchUserSubmissions}
                    className={`px-3 py-1 text-xs rounded border ${borderColor} ${bgColor} hover:${bgSecondary} transition`}
                  >
                    Reload
                  </button>
                </div>
                {userSubmissions && userSubmissions.length > 0 ? (
                  <div className="space-y-2">
                    {userSubmissions.map((submission, idx) => (
                      <div key={idx} className={`${bgSecondary} rounded-lg p-3 border ${borderColor}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {submission.status === 'Accepted' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm font-medium">{submission.status}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs mt-2 flex gap-2">
                          <span>{submission.language}</span>
                          {submission.runtime && <span>{submission.runtime}ms</span>}
                          {submission.memory && <span>{submission.memory}MB</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`${bgSecondary} rounded-lg p-6 text-center`}>
                    <ListOrdered className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p className={`text-sm ${mutedText}`}>
                      Your submissions will appear here
                    </p>
                  </div>
                )}
              </div>
            )}

            {leftPanelTab === 'discussions' && (
              <div className="p-4 space-y-4 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Discussions</h2>
                  <button
                    onClick={fetchDiscussions}
                    className={`px-3 py-1 text-xs rounded border ${borderColor} ${bgColor} hover:${bgSecondary} transition`}
                  >
                    Reload
                  </button>
                </div>

                {/* New Comment Input */}
                <div className="space-y-2">
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Share your thoughts about this problem..."
                    className={`w-full h-20 ${bgSecondary} rounded p-2 text-sm border ${borderColor} focus:outline-none focus:border-blue-500 resize-none`}
                  />
                  <button
                    onClick={postComment}
                    className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition"
                  >
                    Post Comment
                  </button>
                </div>

                {/* Discussions List */}
                <div className="flex-1 overflow-y-auto space-y-2">
                  {discussions && discussions.length > 0 ? (
                    discussions.map((discussion, idx) => (
                      <div key={idx} className={`${bgSecondary} rounded-lg p-3 border ${borderColor}`}>
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{discussion.user?.username}</p>
                            <p className="text-sm mt-1">{discussion.content}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <span className={mutedText}>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                              <span className={mutedText}>
                                {discussion.upvotes?.length || 0} Votes
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`${bgSecondary} rounded-lg p-6 text-center`}>
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                      <p className={`text-sm ${mutedText}`}>
                        No discussions yet. Be the first to comment!
                      </p>
                    </div>
                  )}
                </div>
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
                  liked ? 'text-blue-500' : mutedText
                }`}
              >
                <ThumbsUp className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} />
                <span className="font-medium">{formatLikeCount(likeCount)}</span>
              </button>

              {/* Dislike */}
              <button
                onClick={handleDislike}
                className={`${hoverBg} p-1 rounded transition ${
                  disliked ? 'text-red-500' : mutedText
                }`}
              >
                <ThumbsDown className="w-4 h-4" fill={disliked ? 'currentColor' : 'none'} />
              </button>

              {/* Comments */}
              <button 
                onClick={() => setLeftPanelTab('discussions')}
                className={`flex items-center gap-1.5 ${hoverBg} px-2 py-1 rounded transition ${
                  leftPanelTab === 'discussions' ? 'text-blue-500' : mutedText
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium">{discussions.length}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={handleBookmark}
                className={`${hoverBg} p-1 rounded transition ${
                  bookmarked ? 'text-yellow-500' : mutedText
                }`}
              >
                <Star className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
              </button>

              {/* Share */}
              <button 
                onClick={handleShare}
                className={`${hoverBg} p-1 rounded transition ${mutedText}`}
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* External Link */}
              <button className={`${hoverBg} p-1 rounded transition ${mutedText}`}>
                <ExternalLink className="w-4 h-4" />
              </button>

              {/* Info */}
              <button className={`${hoverBg} p-1 rounded transition ${mutedText}`}>
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Online Count */}
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className={mutedText}>{onlineUsers} {onlineUsers === 1 ? 'User' : 'Users'} Online</span>
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
                <Code2 className="w-4 h-4" />
                <span className="text-sm font-medium">Code</span>
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
                  <Settings className="w-3 h-3" />
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
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button className={`${hoverBg} p-1 rounded transition`} title="Fullscreen">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleReset}
                className={`${hoverBg} p-1 rounded transition`} 
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
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
                // Handle cursor position change
                editor.onDidChangeCursorPosition((e) => {
                  setCursorPosition({
                    line: e.position.lineNumber,
                    column: e.position.column
                  });
                });
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
              <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
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
                      <div className="flex gap-2 flex-wrap">
                        {problem?.testCases?.slice(0, 3).map((tc, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedTestCase(idx);
                              setCustomInput('');
                            }}
                            className={`px-3 py-1.5 text-sm rounded transition ${
                              selectedTestCase === idx && !customInput
                                ? 'bg-blue-500 text-white'
                                : `${bgSecondary} ${mutedText} ${hoverBg}`
                            }`}
                          >
                            Case {idx + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setSelectedTestCase(-1);
                          }}
                          className={`px-3 py-1.5 text-sm rounded transition ${
                            customInput
                              ? 'bg-blue-500 text-white'
                              : `${bgSecondary} ${mutedText} ${hoverBg}`
                          }`}
                        >
                          Custom
                        </button>
                      </div>

                      {/* Test Case Input or Custom Input */}
                      {customInput || selectedTestCase === -1 ? (
                        <div>
                          <label className="text-sm font-medium mb-1 block">Custom Input</label>
                          <textarea
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder="Enter custom test input..."
                            className={`w-full h-32 ${bgSecondary} rounded p-3 font-mono text-sm border ${borderColor} focus:outline-none focus:border-blue-500`}
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="text-sm font-medium mb-1 block">Input</label>
                          <div className={`${bgSecondary} rounded p-3 font-mono text-sm`}>
                            {problem?.testCases?.[selectedTestCase]?.input}
                          </div>
                        </div>
                      )}
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
                    ? 'bg-[#333333] hover:bg-[#3a3a3a] text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                {running ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
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
