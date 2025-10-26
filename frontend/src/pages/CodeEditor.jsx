import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMatchStore } from '../store/matchStore';
import { useThemeStore } from '../store/themeStore';
import { useExplanationStore } from '../store/explanationStore';
import Editor from '@monaco-editor/react';
import { submitCodeNotification, onOpponentSubmitted } from '../utils/socket';
import { toast } from 'react-hot-toast';
import { Play, Send, Clock, Flag, Moon, Sun, ExternalLink, Lightbulb, BookOpen, Zap, ChevronLeft, ChevronRight, Settings, Users, Share2, Award } from 'lucide-react';

export default function CodeEditor() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { currentMatch, submitCode, getMatch, giveUp } = useMatchStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { explanation, guidance, solution, loading: explanationLoading, generateExplanation, generateGuidance, generateSolution, clearExplanations } = useExplanationStore();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [match, setMatch] = useState(currentMatch);
  const [opponentSubmitted, setOpponentSubmitted] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [givingUp, setGivingUp] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // description, editorial, solutions, submissions
  const [leftPanelWidth, setLeftPanelWidth] = useState(40);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch match if not in store
  useEffect(() => {
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
  }, [matchId, match, getMatch, navigate]);

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
      const result = await submitCode(matchId, code, language);
      setTestResults(result.executionResult);

      // Notify opponent
      submitCodeNotification(matchId, user._id, user.username);

      toast.success('Code submitted!');

      // If match is completed, redirect to results
      if (result.match.status === 'completed') {
        setTimeout(() => {
          navigate(`/results/${matchId}`);
        }, 2000);
      }
    } catch (error) {
      toast.error('Failed to submit code');
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

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading match...</p>
        </div>
      </div>
    );
  }

  if (!match.problem) {
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

  const problem = match.problem;

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
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Top Navigation Bar */}
      <header className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b px-4 py-3 transition-colors duration-300`}>
        <div className="flex items-center justify-between">
          {/* Left: Problem List & Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-2 rounded-lg hover:${isDark ? 'bg-slate-800' : 'bg-slate-100'} transition`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Problem List</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-sm font-semibold">{problem?.title}</span>
          </div>

          {/* Center: Problem Number & Difficulty */}
          <div className="flex items-center gap-4">
            <span className={`text-xs px-2 py-1 rounded ${
              problem?.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              problem?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {problem?.difficulty}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button className={`p-2 rounded-lg hover:${isDark ? 'bg-slate-800' : 'bg-slate-100'} transition`}>
              <Share2 className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg hover:${isDark ? 'bg-slate-800' : 'bg-slate-100'} transition`}>
              <Award className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {match?.matchType === 'solo' && (
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <Clock className={`w-4 h-4 ${timerEnabled ? 'text-yellow-500' : 'text-slate-400'}`} />
                  <span className={`font-mono font-bold text-sm ${timerEnabled && timeLeft < 60 ? 'text-red-500' : ''}`}>
                    {timerEnabled ? formatTime(timeLeft) : '∞'}
                  </span>
                </div>
                <button
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  className={`p-2 rounded-lg transition ${
                    timerEnabled
                      ? isDark ? 'bg-yellow-900 text-yellow-400 hover:bg-yellow-800' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={timerEnabled ? 'Timer On' : 'Timer Off'}
                >
                  <Clock className="w-4 h-4" />
                </button>
              </div>
            )}
            <button className={`px-4 py-2 rounded-lg font-semibold transition ${
              opponentSubmitted
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}>
              Submit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div id="editor-container" className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div
          style={{ width: `${leftPanelWidth}%` }}
          className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} border-r flex flex-col transition-colors duration-300 overflow-hidden`}
        >
          {/* Tabs */}
          <div className={`flex border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            {['Description', 'Editorial', 'Solutions', 'Submissions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.toLowerCase()
                    ? `border-orange-500 ${isDark ? 'text-orange-400' : 'text-orange-600'}`
                    : `border-transparent ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'description' && (
              <div className="space-y-6">
                {/* Problem Title & Stats */}
                <div>
                  <h1 className="text-2xl font-bold mb-2">{problem?.title}</h1>
                  <div className="flex gap-4 text-sm">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>👍 1995 Online</span>
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>💬 1.6K</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-lg font-bold mb-3">Description</h2>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {problem?.description}
                  </p>
                </div>

                {/* Examples */}
                {problem?.examples && problem.examples.length > 0 && (
                  <div>
                    <h3 className="font-bold mb-3">Examples</h3>
                    {problem.examples.map((example, idx) => (
                      <div key={idx} className={`mb-4 p-4 rounded-lg text-sm ${isDark ? 'bg-slate-800' : 'bg-white border border-slate-200'}`}>
                        <p className={`font-mono mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Example {idx + 1}:
                        </p>
                        <p className={`mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          <span className="font-semibold">Input:</span> {example.input}
                        </p>
                        <p className={`mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          <span className="font-semibold">Output:</span> {example.output}
                        </p>
                        {example.explanation && (
                          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                            <span className="font-semibold">Explanation:</span> {example.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {problem?.constraints && (
                  <div>
                    <h3 className="font-bold mb-2">Constraints</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{problem.constraints}</p>
                  </div>
                )}

                {/* AI Help Section */}
                {match?.matchType === 'solo' && (
                  <div className={`p-4 rounded-lg border-2 border-purple-500 ${isDark ? 'bg-purple-900 bg-opacity-20' : 'bg-purple-50'}`}>
                    <p className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                      <Zap className="w-4 h-4" /> AI-Powered Help
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={handleGenerateExplanation}
                        disabled={explanationLoading}
                        className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                      >
                        <Lightbulb className="w-4 h-4" />
                        {explanationLoading ? 'Generating...' : 'Get Explanation'}
                      </button>
                      <button
                        onClick={handleGenerateGuidance}
                        disabled={explanationLoading || !code}
                        className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        {explanationLoading ? 'Generating...' : 'Get Guidance'}
                      </button>
                      <button
                        onClick={handleGenerateSolution}
                        disabled={explanationLoading}
                        className="w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {explanationLoading ? 'Generating...' : 'View Full Solution'}
                      </button>
                    </div>
                  </div>
                )}

                {/* AI Responses */}
                {showExplanation && explanation && (
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold">💡 Problem Explanation</h4>
                      <button onClick={() => setShowExplanation(false)} className="text-slate-500 hover:text-slate-700">✕</button>
                    </div>
                    <div className={`text-xs leading-relaxed whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {explanation}
                    </div>
                  </div>
                )}

                {showGuidance && guidance && (
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold">📖 AI Guidance</h4>
                      <button onClick={() => setShowGuidance(false)} className="text-slate-500 hover:text-slate-700">✕</button>
                    </div>
                    <div className={`text-xs leading-relaxed whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {guidance}
                    </div>
                  </div>
                )}

                {showSolution && solution && (
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold">✨ Full Solution</h4>
                      <button onClick={() => setShowSolution(false)} className="text-slate-500 hover:text-slate-700">✕</button>
                    </div>
                    <div className={`text-xs leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {solution}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'editorial' && (
              <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <p>Editorial content coming soon...</p>
              </div>
            )}

            {activeTab === 'solutions' && (
              <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <p>Community solutions coming soon...</p>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <p>Your submissions will appear here...</p>
              </div>
            )}
          </div>
        </div>

        {/* Resizer */}
        <div
          onMouseDown={handleMouseDown}
          className={`w-1 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'} cursor-col-resize transition ${isDragging ? 'bg-blue-500' : ''}`}
        />

        {/* Right Panel - Code Editor */}
        <div className={`flex-1 flex flex-col transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
          {/* Editor Toolbar */}
          <div className={`border-b px-4 py-3 flex items-center justify-between transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-3 py-1 border rounded text-sm transition-colors duration-300 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className={`p-2 rounded-lg hover:${isDark ? 'bg-slate-800' : 'bg-slate-100'} transition`}>
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={isDark ? 'vs-dark' : 'vs-light'}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'Fira Code',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </div>

          {/* Test Results */}
          {testResults && (
            <div className={`border-t p-4 max-h-48 overflow-y-auto transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className="font-bold mb-2">Test Results</h3>
              <div className="space-y-2 text-sm">
                <p>Status: <span className={testResults.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}>
                  {testResults.status}
                </span></p>
                <p>Passed: {testResults.testCasesPassed}/{testResults.totalTestCases}</p>
                <p>Time: {testResults.executionTime}ms</p>
                <p>Memory: {testResults.memoryUsed}MB</p>
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className={`border-t p-4 flex gap-3 transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <button
              onClick={handleSubmit}
              disabled={submitting || timeLeft === 0}
              className="btn-primary flex items-center gap-2 flex-1"
            >
              <Play className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
            {match.matchType !== 'solo' && (
              <button
                onClick={handleGiveUp}
                disabled={givingUp || match.status !== 'in-progress'}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white rounded-lg font-semibold flex items-center gap-2 transition"
              >
                <Flag className="w-4 h-4" />
                {givingUp ? 'Giving Up...' : 'Give Up'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

