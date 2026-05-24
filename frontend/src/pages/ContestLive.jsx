import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContestStore } from '../store/contestStore';
import { useAuthStore } from '../store/authStore';
import Editor from '@monaco-editor/react';
import { Trophy, Clock, CheckCircle, XCircle, ArrowLeft, ChevronRight, Play, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFairnessTracker } from '../hooks/useFairnessTracker';
import { joinContestRoom, leaveContestRoom, onContestUpdate, removeListener } from '../utils/socket';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const LANGUAGES = [
  { id: 'cpp', name: 'C++' },
  { id: 'java', name: 'Java' },
  { id: 'python', name: 'Python 3' },
  { id: 'javascript', name: 'JavaScript' },
];
const DEFAULT_CODE = {
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    \n};\n',
  java: 'class Solution {\n    \n}\n',
  python: 'class Solution:\n    pass\n',
  javascript: 'var solution = function() {\n    \n};\n',
};

export default function ContestLive() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { currentContest, getContest, startContest, registerForContest } = useContestStore();

  const [timeRemaining, setTimeRemaining] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(() => localStorage.getItem('lc_lang') || 'cpp');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [showConsole, setShowConsole] = useState(true);
  const [leftWidth, setLeftWidth] = useState(38);
  const [editorHeight, setEditorHeight] = useState(65);
  const [loading, setLoading] = useState(true);
  const editorRef = useRef(null);

  // Initialize Phase 1 Anti-Cheat tracking
  useFairnessTracker({
    contestId: id,
    enabled: hasStarted && !isOver && currentContest?.status === 'running'
  });

  // Load contest
  const loadContest = useCallback(async () => {
    try {
      setLoading(true);
      await getContest(id);
    } catch { toast.error('Failed to load contest'); navigate('/contests'); }
    finally { setLoading(false); }
  }, [id, getContest, navigate]);

  useEffect(() => { loadContest(); }, [loadContest]);

  // Real-time Contest Updates
  useEffect(() => {
    if (id) {
      joinContestRoom(id);
      
      const handleContestUpdate = (data) => {
        if (data.type === 'submission' && data.status === 'accepted') {
          // Play a tiny subtle sound or just toast
          if (data.userId !== currentContest?.userData?.user) {
            toast(`${data.username} solved a problem! ${data.isFirstToSolve ? '🔥 First to solve!' : ''}`, {
              icon: '🚀',
              position: 'bottom-right'
            });
          }
          // Refresh the contest state to update leaderboard/stats if needed
          loadContest();
        }
      };

      onContestUpdate(handleContestUpdate);

      return () => {
        removeListener('contest-update', handleContestUpdate);
        leaveContestRoom(id);
      };
    }
  }, [id, loadContest, currentContest]);

  // Global timer
  useEffect(() => {
    if (!currentContest?.endTime) return;
    const tick = () => {
      const r = Math.max(0, new Date(currentContest.endTime) - new Date());
      setTimeRemaining(r);
      if (r === 0 && !isOver) { setIsOver(true); toast.error('⏰ Contest time is up!'); }
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [currentContest?.endTime, isOver]);

  // Check started
  useEffect(() => {
    if (currentContest?.userData?.startedAt) setHasStarted(true);
  }, [currentContest]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        e.shiftKey ? handleSubmit() : handleRun();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [code, language, selectedIdx, running, submitting]);

  // Load code for selected problem
  useEffect(() => {
    if (!currentContest?.problems?.[selectedIdx]?.problem) return;
    const p = currentContest.problems[selectedIdx].problem;
    const saved = localStorage.getItem(`contest_${id}_${p._id}_${language}`);
    if (saved) setCode(saved);
    else setCode(p.functionSignature?.[language] || DEFAULT_CODE[language] || '');
    setRunResult(null); setSubmitResult(null);
  }, [selectedIdx, language, currentContest, id]);

  // Auto-save code
  useEffect(() => {
    if (!code || !currentContest?.problems?.[selectedIdx]) return;
    const pid = currentContest.problems[selectedIdx].problem._id;
    const t = setTimeout(() => localStorage.setItem(`contest_${id}_${pid}_${language}`, code), 1500);
    return () => clearTimeout(t);
  }, [code, selectedIdx, language, id, currentContest]);

  const handleEnter = async () => {
    try {
      if (!currentContest?.isRegistered) await registerForContest(id);
      await startContest(id);
      setHasStarted(true);
      toast.success("You're in! Good luck!");
      loadContest();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to enter'); }
  };

  const currentProblem = currentContest?.problems?.[selectedIdx]?.problem;

  const handleRun = async () => {
    if (running || submitting || !currentProblem) return;
    setRunning(true); setShowConsole(true);
    try {
      const res = await fetch(`${API_URL}/judge/run-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code, language, problemId: currentProblem._id })
      });
      const r = await res.json();
      if (!res.ok) throw new Error(r.message);
      setRunResult({ ...r, status: r.testCasesPassed === r.totalTestCases ? 'Accepted' : (r.status || 'Wrong Answer') });
      toast[r.testCasesPassed === r.totalTestCases ? 'success' : 'error'](
        r.testCasesPassed === r.totalTestCases ? '✓ All visible cases passed!' : `✗ ${r.testCasesPassed}/${r.totalTestCases} passed`
      );
    } catch (e) { toast.error(e.message); setRunResult({ status: e.message, outputs: [], errors: [e.message] }); }
    finally { setRunning(false); }
  };

  const handleSubmit = async () => {
    if (running || submitting || !currentProblem) return;
    setSubmitting(true); setShowConsole(true);
    try {
      const res = await fetch(`${API_URL}/contests/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ problemId: currentProblem._id, code, language })
      });
      const r = await res.json();
      if (!res.ok) throw new Error(r.message);
      setSubmitResult(r);
      if (r.status === 'accepted') {
        toast.success(`✓ Accepted! Score: ${r.totalScore} | Rank: #${r.rank}`);
      } else {
        toast.error(`✗ ${r.status}: ${r.executionResult?.testCasesPassed}/${r.executionResult?.totalTestCases} passed`);
      }
      loadContest(); // Refresh to get updated userData
    } catch (e) { toast.error(e.message); }
    finally { setSubmitting(false); }
  };

  const getProblemStatus = (pid) => {
    if (!currentContest?.userData?.submissions) return null;
    const subs = currentContest.userData.submissions.filter(s => s.problem?.toString() === pid?.toString());
    if (subs.some(s => s.status === 'accepted')) return 'accepted';
    if (subs.length > 0) return 'attempted';
    return null;
  };

  const formatTime = (ms) => {
    if (ms == null) return '--:--:--';
    const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  const diffColor = (d) => d === 'Easy' ? '#00b8a3' : d === 'Medium' ? '#ffc01e' : d === 'Hard' ? '#ef4743' : '#999';

  // Resizers
  const startH = (e) => {
    const sx = e.clientX, sw = leftWidth;
    const move = (e) => setLeftWidth(Math.max(20, Math.min(55, sw + ((e.clientX - sx) / window.innerWidth) * 100)));
    const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); document.body.style.cssText = ''; };
    document.body.style.cssText = 'cursor:col-resize;user-select:none';
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
  };
  const startV = (e) => {
    const sy = e.clientY, sh = editorHeight, ct = e.target.parentElement;
    const move = (e) => setEditorHeight(Math.max(20, Math.min(85, sh + ((e.clientY - sy) / ct.clientHeight) * 100)));
    const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); document.body.style.cssText = ''; };
    document.body.style.cssText = 'cursor:row-resize;user-select:none';
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
  };

  // Loading
  if (loading || !currentContest) return (
    <div className="h-screen bg-[#1a1a2e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#3c3c3c] border-t-[#ffa116] rounded-full animate-spin" />
    </div>
  );

  // Contest finished
  if (currentContest.status === 'finished' || isOver) return (
    <div className="h-screen bg-[#1a1a2e] flex items-center justify-center text-white">
      <div className="text-center">

        <h2 className="text-2xl font-bold mb-2">Contest Ended</h2>
        <p className="text-[#eff1f680] mb-6">Check the leaderboard for final results</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate(`/contests/${id}`)} className="px-5 py-2.5 bg-[#ffa116] text-black rounded-lg font-medium text-sm">View Results</button>
          <button onClick={() => navigate('/contests')} className="px-5 py-2.5 border border-[#3c3c3c] text-[#eff1f6] rounded-lg text-sm">Back to Contests</button>
        </div>
      </div>
    </div>
  );

  // Not started — Enter screen
  if (!hasStarted) return (
    <div className="h-screen bg-[#1a1a2e] flex items-center justify-center text-white">
      <div className="text-center max-w-md">
        <Trophy className="w-16 h-16 text-[#ffa116] mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-2">{currentContest.title}</h2>
        <p className="text-[#eff1f680] mb-2">{currentContest.problems?.length} problems • {currentContest.duration} minutes</p>
        <div className="text-3xl font-mono font-bold text-[#2cbb5d] mb-6">{formatTime(timeRemaining)}</div>
        <button onClick={handleEnter} className="px-8 py-3 bg-[#ffa116] text-black rounded-xl font-bold text-lg hover:bg-[#ffb340] transition">
          Enter Contest
        </button>
        <p className="text-[#eff1f650] text-xs mt-4">You'll see all problems once you enter</p>
      </div>
    </div>
  );

  // ─── FULL EDITOR VIEW ───
  const visibleTests = (currentProblem?.testCases || []).filter(t => !t.isHidden);
  const solvedCount = currentContest.problems?.filter(cp => getProblemStatus(cp.problem._id) === 'accepted').length || 0;

  return (
    <div className="h-screen flex flex-col bg-[#1a1a2e] text-[#eff1f6] overflow-hidden select-none" style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Inter',sans-serif" }}>
      {/* NAVBAR */}
      <nav className="h-[46px] flex-shrink-0 bg-[#282828] border-b border-[#3c3c3c] flex items-center px-3 gap-2 z-20">
        <button onClick={() => navigate(`/contests/${id}`)} className="p-1.5 rounded hover:bg-[#ffffff12] text-[#eff1f680] transition">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <Trophy className="w-4 h-4 text-[#ffa116]" />
        <span className="text-sm font-medium truncate max-w-[200px]">{currentContest.title}</span>
        <span className="text-[10px] text-[#eff1f650] ml-1">{solvedCount}/{currentContest.problems?.length} solved</span>

        <div className="flex-1" />

        {/* Timer */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono ${
          timeRemaining < 300000 ? 'bg-red-500/20 text-red-400 animate-pulse' :
          timeRemaining < 900000 ? 'bg-amber-500/20 text-amber-400' :
          'bg-[#2cbb5d20] text-[#2cbb5d]'
        }`}>
          <Clock className="w-3.5 h-3.5" />
          {formatTime(timeRemaining)}
        </div>

        {/* Run / Submit */}
        <button onClick={handleRun} disabled={running || submitting} className="h-[30px] px-3 rounded-lg text-xs font-medium border border-[#404040] text-[#eff1f6] hover:bg-[#ffffff12] disabled:opacity-40 transition flex items-center gap-1.5 ml-2">
          {running ? <div className="w-3 h-3 border border-[#eff1f680] border-t-white rounded-full animate-spin" /> : <Play className="w-3 h-3" />}Run
        </button>
        <button onClick={handleSubmit} disabled={running || submitting} className="h-[30px] px-3 rounded-lg text-xs font-medium bg-[#2cbb5d] text-white hover:bg-[#26a651] disabled:opacity-40 transition flex items-center gap-1.5">
          {submitting ? <div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" /> : <Upload className="w-3 h-3" />}Submit
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Problem Sidebar + Description */}
        <div className="flex flex-col overflow-hidden bg-[#282828] min-w-0" style={{ width: `${leftWidth}%` }}>
          {/* Problem tabs */}
          <div className="flex border-b border-[#3c3c3c] overflow-x-auto flex-shrink-0">
            {currentContest.problems?.map((cp, i) => {
              const st = getProblemStatus(cp.problem._id);
              return (
                <button key={cp._id} onClick={() => setSelectedIdx(i)}
                  className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition flex items-center gap-1.5 ${
                    selectedIdx === i ? 'border-[#ffa116] text-white' : 'border-transparent text-[#eff1f680] hover:text-[#eff1f6a0]'
                  }`}>
                  {st === 'accepted' ? <CheckCircle className="w-3 h-3 text-[#2cbb5d]" /> :
                   st === 'attempted' ? <XCircle className="w-3 h-3 text-[#ffc01e]" /> :
                   <span className="w-3 h-3 rounded-full border border-[#eff1f640] inline-block" />}
                  Q{i + 1}
                </button>
              );
            })}
          </div>

          {/* Problem description */}
          <div className="flex-1 overflow-y-auto p-5 lc-scroll">
            {currentProblem ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-bold">{currentProblem.title}</h2>
                  <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ color: diffColor(currentProblem.difficulty), background: diffColor(currentProblem.difficulty) + '20' }}>
                    {currentProblem.difficulty}
                  </span>
                  <span className="text-xs text-[#ffa116] font-semibold ml-auto">{currentContest.problems[selectedIdx].points} pts</span>
                </div>
                <div className="text-sm text-[#eff1f6cc] leading-relaxed whitespace-pre-wrap mb-4">{currentProblem.description}</div>
                {currentProblem.constraints && (
                  <div className="mb-4">
                    <h3 className="text-xs font-bold text-[#eff1f680] uppercase mb-2">Constraints</h3>
                    <div className="text-xs text-[#eff1f6aa] bg-[#1a1a2e] rounded-lg p-3 whitespace-pre-wrap">{currentProblem.constraints}</div>
                  </div>
                )}
                {currentProblem.examples?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-[#eff1f680] uppercase mb-2">Examples</h3>
                    {currentProblem.examples.map((ex, i) => (
                      <div key={i} className="bg-[#1a1a2e] rounded-lg p-3 mb-3 text-xs">
                        <div className="mb-1"><span className="text-[#eff1f680]">Input:</span> <code className="text-[#2cbb5d]">{ex.input}</code></div>
                        <div className="mb-1"><span className="text-[#eff1f680]">Output:</span> <code className="text-[#ffa116]">{ex.output}</code></div>
                        {ex.explanation && <div className="text-[#eff1f660] mt-1">{ex.explanation}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : <p className="text-[#eff1f650]">Select a problem</p>}
          </div>
        </div>

        {/* H-RESIZE */}
        <div className="w-[5px] flex-shrink-0 cursor-col-resize bg-[#1a1a2e] hover:bg-[#ffa11640] active:bg-[#ffa11660] transition-colors" onMouseDown={startH} />

        {/* RIGHT: Editor + Console */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e] min-w-0">
          {/* Editor header */}
          <div className="h-[38px] flex-shrink-0 flex items-center justify-between px-3 bg-[#282828] border-b border-[#3c3c3c]">
            <span className="text-xs font-medium text-[#eff1f680]">Code</span>
            <select value={language} onChange={e => { setLanguage(e.target.value); localStorage.setItem('lc_lang', e.target.value); }}
              className="bg-[#3c3c3c] text-[#eff1f6] text-xs rounded px-2 py-1 border-none outline-none cursor-pointer">
              {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>

          {/* Editor + Console */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div style={{ height: showConsole ? `${editorHeight}%` : '100%' }} className="overflow-hidden">
              <Editor
                onMount={ed => { editorRef.current = ed; }}
                height="100%" language={language === 'cpp' ? 'cpp' : language} value={code} onChange={v => setCode(v || '')} theme="vs-dark"
                options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: "'Fira Code','Consolas',monospace", fontLigatures: true, lineNumbers: 'on', scrollBeyondLastLine: false, automaticLayout: true, padding: { top: 12, bottom: 12 }, tabSize: language === 'python' ? 4 : 2, bracketPairColorization: { enabled: true }, smoothScrolling: true, cursorBlinking: 'smooth', renderLineHighlight: 'line' }}
              />
            </div>
            {showConsole && (
              <>
                <div className="h-[5px] flex-shrink-0 cursor-row-resize bg-[#1a1a2e] hover:bg-[#ffa11640] active:bg-[#ffa11660] transition-colors" onMouseDown={startV} />
                <div style={{ height: `${100 - editorHeight}%` }} className="overflow-hidden bg-[#282828] flex flex-col">
                  <div className="flex items-center gap-4 px-3 py-2 border-b border-[#3c3c3c]">
                    <span className="text-xs font-medium text-white">Result</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 lc-scroll text-xs">
                    {submitResult ? (
                      (submitResult.status?.toLowerCase() === 'compilation error' || submitResult.status?.toLowerCase() === 'compile error') ? (
                        <div className="space-y-3">
                          <div className="text-lg font-bold text-red-500">
                            Compile Error
                          </div>
                          <div className="bg-[#ff4b4b0a] border border-[#ff4b4b22] rounded-lg p-4 font-mono text-xs text-[#ff8e8e] whitespace-pre-wrap leading-relaxed select-text max-h-[300px] overflow-y-auto custom-scrollbar">
                            {submitResult.executionResult?.compile_output || submitResult.executionResult?.errors?.[0] || 'Unknown compilation error'}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className={`text-lg font-bold mb-2 ${submitResult.status === 'accepted' ? 'text-[#2cbb5d]' : 'text-[#ef4743]'}`}>
                            {submitResult.status === 'accepted' ? '✓ Accepted' : `✗ ${submitResult.status}`}
                          </div>
                          <div className="text-[#eff1f680]">
                            Score: <span className="text-[#ffa116] font-bold">{submitResult.totalScore}</span> • Rank: <span className="text-white font-bold">#{submitResult.rank}</span> • Solved: {submitResult.problemsSolved}
                          </div>
                        </div>
                      )
                    ) : runResult ? (
                      (runResult.status?.toLowerCase() === 'compilation error' || runResult.status?.toLowerCase() === 'compile error') ? (
                        <div className="space-y-3">
                          <div className="text-lg font-bold text-red-500">
                            Compile Error
                          </div>
                          <div className="bg-[#ff4b4b0a] border border-[#ff4b4b22] rounded-lg p-4 font-mono text-xs text-[#ff8e8e] whitespace-pre-wrap leading-relaxed select-text max-h-[300px] overflow-y-auto custom-scrollbar">
                            {runResult.compile_output || runResult.errors?.[0] || 'Unknown compilation error'}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className={`text-lg font-bold mb-2 ${runResult.status === 'Accepted' ? 'text-[#2cbb5d]' : 'text-[#ef4743]'}`}>
                            {runResult.status}
                          </div>
                          {runResult.outputs?.map((o, i) => (
                            <div key={i} className="mb-2 p-2 bg-[#1a1a2e] rounded">
                              <div className="text-[#eff1f680]">Case {i + 1}: <span className={o.passed ? 'text-[#2cbb5d]' : 'text-[#ef4743]'}>{o.passed ? 'Passed' : 'Failed'}</span></div>
                              {o.stdout && <div className="text-[#eff1f6aa] mt-1">Output: {o.stdout}</div>}
                              {o.error && <div className="text-[#ef4743] mt-1">{o.error}</div>}
                            </div>
                          ))}
                          {runResult.errors?.map((e, i) => <div key={i} className="text-[#ef4743]">{e}</div>)}
                        </div>
                      )
                    ) : (
                      <p className="text-[#eff1f650]">Run or submit your code to see results</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom bar */}
          <div className="h-[34px] flex-shrink-0 flex items-center justify-between px-3 bg-[#282828] border-t border-[#3c3c3c]">
            <button onClick={() => setShowConsole(c => !c)} className="text-xs text-[#eff1f680] hover:text-white transition">
              {showConsole ? '▼ Hide' : '▲ Show'} Console
            </button>
            <span className="text-[10px] text-[#eff1f650]">Ctrl+Enter: Run • Ctrl+Shift+Enter: Submit</span>
          </div>
        </div>
      </div>

      <style>{`.lc-scroll::-webkit-scrollbar{width:6px}.lc-scroll::-webkit-scrollbar-track{background:transparent}.lc-scroll::-webkit-scrollbar-thumb{background:#ffffff20;border-radius:3px}`}</style>
    </div>
  );
}
