import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMatchStore } from '../store/matchStore';
import { useContestStore } from '../store/contestStore';
import { useThemeStore } from '../store/themeStore';
import { useExplanationStore } from '../store/explanationStore';
import Editor from '@monaco-editor/react';
import { submitCodeNotification, onOpponentSubmitted } from '../utils/socket';
import { toast } from 'react-hot-toast';
import { Play, Send, Clock, Flag, Moon, Sun, ExternalLink, Lightbulb, BookOpen, Zap, ChevronLeft, ChevronRight, Settings, Users, Share2, Award, Trophy, Code2, Terminal, Maximize2, Minimize2, RotateCcw } from 'lucide-react';

export default function CodeEditor() {
  const { matchId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const contestId = searchParams.get('contest');
  const problemId = searchParams.get('problem') || matchId;
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { currentMatch, submitCode, getMatch, giveUp } = useMatchStore();
  const { submitSolution: submitContestSolution } = useContestStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { explanation, guidance, solution, loading: explanationLoading, generateExplanation, generateGuidance, generateSolution, clearExplanations } = useExplanationStore();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [match, setMatch] = useState(currentMatch);
  const [contestProblem, setContestProblem] = useState(location.state?.problem || null);
  const [opponentSubmitted, setOpponentSubmitted] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [givingUp, setGivingUp] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // description, editorial, solutions, submissions
  const [leftPanelWidth, setLeftPanelWidth] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const isContestMode = !!contestId;

  // Fetch match or problem data
  useEffect(() => {
    // Skip if in contest mode (problem data loaded from ContestLive page)
    if (isContestMode) {
      return;
    }

    if (!match) {
      const fetchMatch = async () => {
        try {
          const data = await getMatch(matchId);
          setMatch(data);
        } catch (error) {
          toast.error('Failed to load match');
          navigate('/');
        }
      };
      fetchMatch();
    }
  }, [matchId, match, getMatch, navigate, isContestMode]);

  // Pre-fill code with function signature when problem loads
  useEffect(() => {
    const problem = isContestMode ? contestProblem : match?.problem;
    if (problem && problem.functionSignature && !code) {
      const signature = problem.functionSignature[language] || '';
      if (signature) {
        setCode(signature);
      }
    }
  }, [match, contestProblem, language, isContestMode]);

  // Timer with auto-submit (only for solo practice with timer enabled)
  useEffect(() => {
    // Only enable timer for solo matches when timer is enabled
    if (!match || match.matchType !== 'solo' || !timerEnabled) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('Time is up! Auto-submitting...');
          // Auto-submit when time runs out
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [match, timerEnabled]);

  // Listen for opponent submission
  useEffect(() => {
    onOpponentSubmitted((data) => {
      setOpponentSubmitted(true);
      toast.success(`${data.username} submitted their code!`);
    });
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code');
      return;
    }

    setSubmitting(true);
    try {
      // Contest mode submission
      if (isContestMode) {
        const result = await submitContestSolution(contestId, problemId, code, language);
        setTestResults(result);

        if (result.status === 'accepted') {
          toast.success(`✅ Accepted! +${result.score} points`);
        } else {
          toast.error(`❌ ${result.status}`);
        }

        // Redirect back to contest after a delay
        setTimeout(() => {
          navigate(`/contests/${contestId}/live`);
        }, 2000);
      }
      // Match mode submission
      else {
        const result = await submitCode(matchId, code, language);
        setTestResults(result.executionResult);

        // Notify opponent
        submitCodeNotification(matchId, user._id, user.username);

        toast.success('Code submitted!');
        console.log('Code submitted - staying on editor page (no redirect)');

        // Don't redirect - stay on code editor to see results
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGiveUp = async () => {
    if (match.matchType === 'solo') {
      toast.error('Cannot give up in solo practice');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to give up? Your opponent will win!');
    if (!confirmed) return;

    setGivingUp(true);
    try {
      const result = await giveUp(matchId);
      toast.success(result.message);

      // Redirect to results after a short delay
      setTimeout(() => {
        navigate(`/results/${matchId}`);
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to give up');
    } finally {
      setGivingUp(false);
    }
  };

  const handleGenerateExplanation = async () => {
    try {
      setShowExplanation(true);
      await generateExplanation(match.problem._id, token);
      toast.success('Explanation generated!');
    } catch (error) {
      toast.error('Failed to generate explanation');
      setShowExplanation(false);
    }
  };

  const handleGenerateGuidance = async () => {
    try {
      setShowGuidance(true);
      await generateGuidance(match.problem._id, code, token);
      toast.success('Guidance generated!');
    } catch (error) {
      toast.error('Failed to generate guidance');
      setShowGuidance(false);
    }
  };

  const handleGenerateSolution = async () => {
    try {
      setShowSolution(true);
      await generateSolution(match.problem._id, token);
      toast.success('Solution generated!');
    } catch (error) {
      toast.error('Failed to generate solution');
      setShowSolution(false);
    }
  };

  // In contest mode, we don't need match data
  if (!isContestMode && !match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading match...</p>
        </div>
      </div>
    );
  }

  if (!isContestMode && !match?.problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold">Error: Problem data is corrupted</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Get problem data from either match or contest
  const problem = isContestMode ? contestProblem : match?.problem;

  // If in contest mode and no problem data, show error
  if (isContestMode && !contestProblem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold">Error: Problem data not found</p>
          <button
            onClick={() => navigate(`/contests/${contestId}/live`)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Back to Contest
          </button>
        </div>
      </div>
    );
  }

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const container = document.getElementById('editor-container');
      if (container) {
        const newWidth = (e.clientX / container.clientWidth) * 100;
        if (newWidth > 20 && newWidth < 70) {
          setLeftPanelWidth(newWidth);
        }
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-dark-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top Navigation Bar - TensorFlow Style */}
      <header className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} border-b px-4 py-3 flex-shrink-0 shadow-sm`}>
        <div className="flex items-center justify-between">
          {/* Left: Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => isContestMode ? navigate(`/contests/${contestId}/live`) : navigate('/dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-dark-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur-sm opacity-50"></div>
                <div className="relative p-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {problem?.title || 'Loading...'}
                </h1>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    problem?.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                    problem?.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                    'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}>
                    {problem?.difficulty}
                  </span>
                  {problem?.category && (
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {problem.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Center: Timer (if applicable) */}
          {match?.matchType === 'solo' && timerEnabled && (
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg ${isDark ? 'bg-dark-800' : 'bg-gray-100'}`}>
              <Clock className="w-4 h-4 text-orange-500" />
              <span className={`text-sm font-medium ${timeLeft < 60 ? 'text-red-500' : isDark ? 'text-white' : 'text-gray-900'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Font Size Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                className={`p-1.5 rounded transition-colors ${isDark ? 'hover:bg-dark-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                title="Decrease font size"
              >
                <span className="text-xs font-bold">A-</span>
              </button>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{fontSize}px</span>
              <button
                onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
                className={`p-1.5 rounded transition-colors ${isDark ? 'hover:bg-dark-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                title="Increase font size"
              >
                <span className="text-xs font-bold">A+</span>
              </button>
            </div>

            {/* Reset Code */}
            <button
              onClick={() => {
                const signature = problem?.functionSignature?.[language] || '';
                setCode(signature);
                toast.success('Code reset to template');
              }}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-dark-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
              title="Reset code"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-dark-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-dark-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                isDark 
                  ? 'bg-dark-800 border-dark-700 text-white hover:bg-dark-700' 
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div id="editor-container" className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div
          style={{ width: `${leftPanelWidth}%` }}
          className={`${isDark ? 'bg-dark-900' : 'bg-white'} flex flex-col`}
        >
          {/* Tabs */}
          <div className={`flex border-b ${isDark ? 'border-dark-800' : 'border-gray-200'} flex-shrink-0 px-4`}>
            {['Description', 'Editorial', 'Solutions', 'Submissions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${
                  activeTab === tab.toLowerCase()
                    ? `border-blue-500 ${isDark ? 'text-white' : 'text-gray-900'}`
                    : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-3">
            {activeTab === 'description' && (
              <div className="space-y-4">
                {/* Problem Title */}
                <div>
                  <h1 className={`text-2xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    1. {problem?.title}
                  </h1>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`px-2 py-0.5 rounded ${
                      problem?.difficulty === 'Easy'
                        ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
                        : problem?.difficulty === 'Medium'
                        ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {problem?.difficulty}
                    </span>
                    <button className={`flex items-center gap-1 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>
                      <span>Topics</span>
                    </button>
                    <button className={`flex items-center gap-1 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>
                      <span>Companies</span>
                    </button>
                    <button className={`flex items-center gap-1 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>
                      <span>Hint</span>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className={`text-sm leading-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {problem?.description}
                  </p>
                </div>

                {/* Examples */}
                {problem?.examples && problem.examples.length > 0 && (
                  <div className="space-y-3">
                    {problem.examples.map((example, idx) => (
                      <div key={idx}>
                        <p className={`text-sm font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Example {idx + 1}:
                        </p>
                        <div className={`p-3 rounded text-sm space-y-1 ${isDark ? 'bg-dark-800' : 'bg-gray-50'}`}>
                          <div className="font-mono">
                            <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Input:</span>
                            <span className={`ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{example.input}</span>
                          </div>
                          <div className="font-mono">
                            <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Output:</span>
                            <span className={`ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{example.output}</span>
                          </div>
                          {example.explanation && (
                            <div className="font-mono">
                              <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Explanation:</span>
                              <span className={`ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{example.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {problem?.constraints && (
                  <div>
                    <p className={`text-sm font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>Constraints:</p>
                    <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <li className="font-mono text-xs">• {problem.constraints}</li>
                    </ul>
                  </div>
                )}

                {/* AI Help Section */}
                {match?.matchType === 'solo' && (
                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-200'}`}>
                    <p className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                      <Zap className="w-3.5 h-3.5" /> AI-Powered Help
                    </p>
                    <div className="space-y-1.5">
                      <button
                        onClick={handleGenerateExplanation}
                        disabled={explanationLoading}
                        className="w-full px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white rounded text-xs font-medium transition flex items-center justify-center gap-1.5"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        {explanationLoading ? 'Generating...' : 'Get Explanation'}
                      </button>
                      <button
                        onClick={handleGenerateGuidance}
                        disabled={explanationLoading || !code}
                        className="w-full px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 text-white rounded text-xs font-medium transition flex items-center justify-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {explanationLoading ? 'Generating...' : 'Get Guidance'}
                      </button>
                      <button
                        onClick={handleGenerateSolution}
                        disabled={explanationLoading}
                        className="w-full px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900 text-white rounded text-xs font-medium transition flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {explanationLoading ? 'Generating...' : 'View Full Solution'}
                      </button>
                    </div>
                  </div>
                )}

                {/* AI Responses */}
                {showExplanation && explanation && (
                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold">💡 Problem Explanation</h4>
                      <button onClick={() => setShowExplanation(false)} className={`text-xs ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}>✕</button>
                    </div>
                    <div className={`text-xs leading-relaxed whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {explanation}
                    </div>
                  </div>
                )}

                {showGuidance && guidance && (
                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold">📖 AI Guidance</h4>
                      <button onClick={() => setShowGuidance(false)} className={`text-xs ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}>✕</button>
                    </div>
                    <div className={`text-xs leading-relaxed whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {guidance}
                    </div>
                  </div>
                )}

                {showSolution && solution && (
                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold">✨ Full Solution</h4>
                      <button onClick={() => setShowSolution(false)} className={`text-xs ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}>✕</button>
                    </div>
                    <div className={`text-xs leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {solution}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'editorial' && (
              <div className={`text-center py-12 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <p>Editorial content coming soon...</p>
              </div>
            )}

            {activeTab === 'solutions' && (
              <div className={`text-center py-12 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <p>Community solutions coming soon...</p>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className={`text-center py-12 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <p>Your submissions will appear here...</p>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Resizer */}
        <div
          onMouseDown={handleMouseDown}
          className={`w-1 ${isDark ? 'bg-dark-800 hover:bg-blue-500' : 'bg-gray-300 hover:bg-blue-400'} cursor-col-resize ${isDragging ? 'bg-blue-500' : ''}`}
        />

        {/* Right Panel - Code Editor */}
        <div className={`flex-1 flex flex-col ${isDark ? 'bg-dark-950' : 'bg-white'}`}>
          {/* Code Tab */}
          <div className={`flex items-center justify-between border-b ${isDark ? 'border-dark-800 bg-[#1a1a1a]' : 'border-gray-200 bg-gray-50'} px-4 flex-shrink-0`}>
            <div className="flex items-center gap-2">
              <Terminal className={`w-4 h-4 ${isDark ? 'text-orange-500' : 'text-orange-600'}`} />
              <button className={`px-3 py-2.5 text-sm font-medium border-b-2 -mb-px ${isDark ? 'border-orange-500 text-white' : 'border-orange-500 text-gray-900'}`}>
                Code
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-dark-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
                {language === 'cpp' ? 'C++' : language === 'python' ? 'Python' : language === 'java' ? 'Java' : 'JavaScript'}
              </span>
            </div>
          </div>

          {/* Editor - Scrollable */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={isDark ? 'vs-dark' : 'vs-light'}
              options={{
                minimap: { enabled: !isFullscreen },
                fontSize: fontSize,
                fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                lineHeight: fontSize + 8,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                wordWrap: 'on',
                formatOnPaste: true,
                formatOnType: true,
                suggest: {
                  enabled: true,
                },
                quickSuggestions: true,
                tabSize: 2,
                bracketPairColorization: {
                  enabled: true,
                },
              }}
            />
          </div>

          {/* Test Results Section */}
          <div className={`border-t ${isDark ? 'border-dark-800 bg-dark-900' : 'border-gray-200 bg-white'} flex-shrink-0 max-h-64 overflow-y-auto`}>
            {testResults ? (
              <div className="p-4">
                {/* Status Header */}
                <div className="mb-4">
                  <div className={`text-lg font-semibold mb-2 ${
                    testResults.status === 'Accepted' ? 'text-green-500' :
                    testResults.status === 'Wrong Answer' ? 'text-red-500' :
                    testResults.status === 'Runtime Error' ? 'text-orange-500' :
                    testResults.status === 'Time Limit Exceeded' ? 'text-yellow-500' :
                    'text-gray-500'
                  }`}>
                    {testResults.status === 'Accepted' ? '✓ Accepted' : `✗ ${testResults.status}`}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {testResults.testCasesPassed}/{testResults.totalTestCases} test cases passed
                  </div>
                  {testResults.status === 'Accepted' && (
                    <div className={`text-xs mt-2 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div>Runtime: {testResults.executionTime}ms</div>
                      <div>Memory: {testResults.memoryUsed.toFixed(2)}MB</div>
                    </div>
                  )}
                </div>

                {/* Test Case Results */}
                {testResults.outputs && testResults.outputs.length > 0 && (
                  <div className="space-y-3">
                    {testResults.outputs.map((output, idx) => (
                      <div key={idx} className={`p-3 rounded border ${
                        output.passed
                          ? isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                          : isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className={`text-sm font-medium mb-2 ${
                          output.passed ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {output.passed ? '✓' : '✗'} Test Case {output.testCase}
                        </div>

                        {output.input && (
                          <div className={`text-xs mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <div className={`mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Input:</div>
                            <div className={`p-2 rounded font-mono ${isDark ? 'bg-dark-800' : 'bg-gray-100'}`}>
                              {output.input}
                            </div>
                          </div>
                        )}

                        {output.expectedOutput && (
                          <div className={`text-xs mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <div className={`mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Expected:</div>
                            <div className={`p-2 rounded font-mono ${isDark ? 'bg-dark-800' : 'bg-gray-100'}`}>
                              {output.expectedOutput}
                            </div>
                          </div>
                        )}

                        {output.actualOutput !== undefined && (
                          <div className={`text-xs mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <div className={`mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Output:</div>
                            <div className={`p-2 rounded font-mono ${isDark ? 'bg-dark-800' : 'bg-gray-100'}`}>
                              {output.actualOutput}
                            </div>
                          </div>
                        )}

                        {output.error && (
                          <div className={`text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                            <div className={`mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Error:</div>
                            <div className={`p-2 rounded font-mono ${isDark ? 'bg-dark-800' : 'bg-gray-100'}`}>
                              {output.error}
                            </div>
                            {output.stderr && (
                              <div className={`p-2 mt-2 rounded font-mono text-xs ${isDark ? 'bg-dark-800' : 'bg-gray-100'}`}>
                                {output.stderr}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Errors */}
                {testResults.errors && testResults.errors.length > 0 && (
                  <div className={`mt-4 p-3 rounded ${isDark ? 'bg-red-900/20 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
                    <div className={`text-sm font-medium mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      Errors:
                    </div>
                    <div className={`text-xs font-mono ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                      {testResults.errors.map((error, idx) => (
                        <div key={idx}>{error}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="text-sm">Run your code to see test results</div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar - TensorFlow Style */}
          <div className={`border-t px-6 py-3 flex gap-3 flex-shrink-0 ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
            <button
              onClick={handleSubmit}
              disabled={submitting || (!isContestMode && timeLeft === 0)}
              className={`px-5 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                submitting || (!isContestMode && timeLeft === 0)
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : isDark ? 'bg-dark-800 hover:bg-dark-700 text-white border border-dark-700' : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Run Code</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || (!isContestMode && timeLeft === 0)}
              className={`px-5 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 flex-1 transition-all shadow-lg ${
                submitting || (!isContestMode && timeLeft === 0)
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Solution</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

