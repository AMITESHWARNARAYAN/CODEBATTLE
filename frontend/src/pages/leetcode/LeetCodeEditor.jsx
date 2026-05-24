import { useEffect, useState, useRef, Component } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Editor from '@monaco-editor/react';
import { toast } from 'react-hot-toast';
import { LANGUAGES, DEFAULT_CODE } from './constants';
import * as api from './api';
import { DescriptionTab, EditorialTab, SolutionsTab, SubmissionsTab, TestCasePanel, Confetti, ShortcutsModal } from './Panels';

// Error Boundary
class EditorErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div className="h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-[#ef4743] text-lg font-semibold mb-2">Something went wrong</p>
          <p className="text-[#eff1f680] text-sm mb-4">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#2cbb5d] text-white rounded-lg text-sm">Reload Page</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

// ═══ Find cursor position inside function body ═══
function findBodyPosition(code) {
  const lines = code.split('\n');
  for (let i = 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '' || trimmed === 'pass') {
      const prev = lines[i - 1]?.trim() || '';
      if (prev.endsWith('{') || prev.endsWith(':')) {
        const indent = lines[i].match(/^(\s*)/)?.[1] || '    ';
        return { lineNumber: i + 1, column: indent.length + 1 };
      }
    }
  }
  return { lineNumber: 1, column: 1 };
}

function LeetCodeEditorInner() {
  const { problemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const syntaxCheckIdRef = useRef(0);
  const cursorPlacedRef = useRef(false);
  const { token } = useAuthStore();

  const [problem, setProblem] = useState(location.state?.problem || null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(() => localStorage.getItem('lc_lang') || 'cpp');
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('lc_fs')) || 14);

  // Layout - restore from localStorage
  const [leftWidth, setLeftWidth] = useState(() => parseFloat(localStorage.getItem('lc_lw')) || 45);
  const [editorHeight, setEditorHeight] = useState(() => parseFloat(localStorage.getItem('lc_eh')) || 65);
  const [showConsole, setShowConsole] = useState(true);
  const [leftTab, setLeftTab] = useState('description');
  const [bottomTab, setBottomTab] = useState('testcase');
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [customCases, setCustomCases] = useState([]);

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [syntaxErrors, setSyntaxErrors] = useState([]);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  const [submissions, setSubmissions] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [editorial, setEditorial] = useState(null);
  const [editorialLoading, setEditorialLoading] = useState(false);
  const [hints, setHints] = useState([]);
  const [unlockedHints, setUnlockedHints] = useState([]);
  const [similarProblems, setSimilarProblems] = useState([]);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Persist layout
  useEffect(() => { localStorage.setItem('lc_lw', leftWidth); }, [leftWidth]);
  useEffect(() => { localStorage.setItem('lc_eh', editorHeight); }, [editorHeight]);
  useEffect(() => { localStorage.setItem('lc_fs', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('lc_lang', language); }, [language]);

  // Fetch problem
  useEffect(() => {
    if (!problemId) return;
    setLoading(true);
    setRunResult(null); setSubmitResult(null); setShowConfetti(false);
    (async () => {
      try {
        const p = problem && problem._id === problemId ? problem : await api.fetchProblem(problemId, token);
        setProblem(p);
        const draft = await api.fetchDraft(problemId, token).catch(() => null);
        if (draft) { setCode(draft.code); setLanguage(draft.language); }
        else { setCode(p.functionSignature?.[language] || DEFAULT_CODE[language] || ''); }
        api.fetchMetadata(problemId, token).then(m => { if (m) { setLiked(m.liked); setDisliked(m.disliked); setBookmarked(m.bookmarked); setLikeCount(m.likes || 0); setDislikeCount(m.dislikes || 0); } });
        api.fetchSubmissions(problemId, token).then(setSubmissions);
        api.fetchDiscussions(problemId, token).then(setDiscussions);
        api.fetchHints(problemId, token).then(setHints).catch(() => { });
        api.fetchFullMetadata(problemId, token).then(m => { if (m?.similarProblems) setSimilarProblems(m.similarProblems); }).catch(() => { });
      } catch (e) { toast.error('Failed to load problem'); navigate('/problems'); }
      finally { setLoading(false); }
    })();
  }, [problemId]);

  // Language change
  useEffect(() => {
    if (!problem) return;
    const saved = localStorage.getItem(`code_${problemId}_${language}`);
    if (saved) { setCode(saved); return; }
    setCode(problem.functionSignature?.[language] || DEFAULT_CODE[language] || '');
  }, [language]);

  // Auto-save
  useEffect(() => {
    if (!code || !problemId) return;
    const t = setTimeout(() => {
      localStorage.setItem(`code_${problemId}_${language}`, code);
      api.saveDraft(problemId, code, language, token).catch(() => { });
    }, 3000);
    return () => clearTimeout(t);
  }, [code, problemId, language]);

  // Timer
  useEffect(() => {
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [problemId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== 'TEXTAREA' && !document.activeElement?.classList?.contains('monaco-mouse-cursor-text')) {
        e.preventDefault(); setShowShortcuts(s => !s); return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault(); e.shiftKey ? handleSubmit() : handleRun();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); toast.success('Draft saved'); }
      if ((e.ctrlKey || e.metaKey) && e.key === ']') { e.preventDefault(); setFontSize(f => Math.min(22, f + 1)); }
      if ((e.ctrlKey || e.metaKey) && e.key === '[') { e.preventDefault(); setFontSize(f => Math.max(11, f - 1)); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [code, language, problemId, running, submitting]);

  // ═══ Monaco Editor Configuration ═══
  const handleEditorWillMount = (monaco) => {
    // Enable built-in JavaScript syntax checking (client-side, instant)
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,  // Skip "variable not defined" (helpers aren't registered)
      noSyntaxValidation: false,   // Keep syntax checking (missing brackets, etc.)
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      allowJs: true,
      checkJs: false,
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  // ═══ Cursor Placement — auto-focus inside function body ═══
  useEffect(() => {
    if (cursorPlacedRef.current || !editorRef.current || !code || loading) return;
    const pos = findBodyPosition(code);
    if (pos) {
      requestAnimationFrame(() => {
        if (editorRef.current) {
          editorRef.current.setPosition(pos);
          editorRef.current.focus();
        }
      });
    }
    cursorPlacedRef.current = true;
  }, [code, loading]);

  useEffect(() => { cursorPlacedRef.current = false; }, [problemId]);



  // Run ALL visible test cases (batch)
  const handleRun = async () => {
    if (running || submitting) return;
    if (!code.trim() || code.trim().length < 5) { toast.error('Code too short'); return; }
    setRunning(true); setBottomTab('result'); setShowConsole(true);
    try {
      const r = await api.runCodeBatch(code, language, problem._id, token, customCases);
      setRunResult({ ...r, status: r.testCasesPassed === r.totalTestCases && !r.errors?.length ? 'Accepted' : (r.status || 'Wrong Answer') });
      toast[r.testCasesPassed === r.totalTestCases ? 'success' : 'error'](r.testCasesPassed === r.totalTestCases ? '✓ All cases passed!' : `✗ ${r.testCasesPassed}/${r.totalTestCases} passed`);
    } catch (e) { toast.error(e.message); setRunResult({ status: e.message, testCasesPassed: 0, totalTestCases: 0, outputs: [], errors: [e.message] }); }
    finally { setRunning(false); }
  };

  const handleSubmit = async () => {
    if (running || submitting) return;
    if (!code.trim() || code.trim().length < 5) { toast.error('Code too short'); return; }
    setSubmitting(true); setBottomTab('result'); setShowConsole(true);
    try {
      const r = await api.submitCode(code, language, problem._id, token);
      setSubmitResult(r);
      if (r.status === 'Accepted') { toast.success('✓ All test cases passed!'); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000); }
      else toast.error(`✗ ${r.status}: ${r.testCasesPassed}/${r.totalTestCases} passed`);
      api.fetchSubmissions(problemId, token).then(setSubmissions);
    } catch (e) { toast.error(e.message); }
    finally { setSubmitting(false); }
  };

  const handleLike = async () => { try { const r = await api.toggleLike(problem._id, token); setLiked(r.liked); setLikeCount(r.likes); setDisliked(false); setDislikeCount(r.dislikes); } catch { } };
  const handleDislike = async () => { try { const r = await api.toggleDislike(problem._id, token); setDisliked(r.disliked); setDislikeCount(r.dislikes); setLiked(false); setLikeCount(r.likes); } catch { } };
  const handleBookmark = async () => { try { const r = await api.toggleBookmark(problem._id, token); setBookmarked(r.bookmarked); } catch { } };
  const handleReset = () => { if (confirm('Reset code to template?')) setCode(problem?.functionSignature?.[language] || DEFAULT_CODE[language]); };
  const handleLoadEditorial = async () => { setEditorialLoading(true); try { const r = await api.fetchEditorial(problem._id, token); setEditorial(r.solution); } catch { toast.error('Failed'); } finally { setEditorialLoading(false); } };
  const goPrev = async () => { const p = await api.fetchPrevProblem(problemId, token); if (p) navigate(`/problem/${p._id}`); else toast.error('No previous problem'); };
  const goNext = async () => { const p = await api.fetchNextProblem(problemId, token); if (p) navigate(`/problem/${p._id}`); else toast.error('No next problem'); };
  const onViewCode = (sub) => { if (sub.code) { setCode(sub.code); setLanguage(sub.language || language); toast.success('Code loaded from submission'); } else { api.fetchSubmissionById(sub._id, token).then(s => { if (s?.code) { setCode(s.code); setLanguage(s.language || language); toast.success('Code loaded'); } else toast.error('Code not available'); }); } };
  const onAddCase = () => { setCustomCases(c => [...c, { input: '', expectedOutput: '' }]); setActiveTestCase((problem?.testCases?.filter(t => !t.isHidden)?.length || 0) + customCases.length); };
  const onRemoveCase = (i) => { setCustomCases(c => c.filter((_, j) => j !== i)); setActiveTestCase(0); };

  // Resizers
  const startHResize = (e) => {
    const startX = e.clientX, startW = leftWidth;
    const onMove = (e) => setLeftWidth(Math.max(25, Math.min(70, startW + ((e.clientX - startX) / window.innerWidth) * 100)));
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); document.body.style.cssText = ''; };
    document.body.style.cssText = 'cursor:col-resize;user-select:none';
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
  };
  const startVResize = (e) => {
    const startY = e.clientY, startH = editorHeight, container = e.target.parentElement;
    const onMove = (e) => setEditorHeight(Math.max(20, Math.min(85, startH + ((e.clientY - startY) / container.clientHeight) * 100)));
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); document.body.style.cssText = ''; };
    document.body.style.cssText = 'cursor:row-resize;user-select:none';
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
  };

  const fmtTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const TABS = [{ id: 'description', label: 'Description' }, { id: 'editorial', label: 'Editorial' }, { id: 'solutions', label: 'Solutions', count: discussions.length }, { id: 'submissions', label: 'Submissions', count: submissions.length }];

  if (loading) return <div className="h-screen bg-[#1a1a2e] flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#3c3c3c] border-t-[#2cbb5d] rounded-full animate-spin" /></div>;
  if (!problem) return <div className="h-screen bg-[#1a1a2e] flex items-center justify-center"><p className="text-[#ef4743] mb-3">Problem not found</p><button onClick={() => navigate('/problems')} className="px-4 py-2 bg-[#2cbb5d] text-white rounded-lg text-sm">Go Back</button></div>;

  const visibleTestCases = (problem.testCases || []).filter(tc => !tc.isHidden);

  return (
    <div className="h-screen flex flex-col bg-[#1a1a2e] text-[#eff1f6] overflow-hidden select-none" style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Inter',sans-serif" }}>
      <Confetti show={showConfetti} />
      <ShortcutsModal show={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* NAVBAR */}
      <nav className="h-[46px] flex-shrink-0 bg-[#282828] border-b border-[#3c3c3c] flex items-center px-3 gap-2 z-20">
        <button onClick={() => navigate('/problems')} className="text-[#ffa116] font-bold text-base mr-2 hover:opacity-80 transition">CB</button>
        <button onClick={() => navigate('/problems')} className="p-1.5 rounded hover:bg-[#ffffff12] text-[#eff1f680] transition" title="Problem List">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div className="flex items-center gap-0.5">
          <button onClick={goPrev} className="p-1 rounded hover:bg-[#ffffff12] text-[#eff1f680] transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg></button>
          <button onClick={goNext} className="p-1 rounded hover:bg-[#ffffff12] text-[#eff1f680] transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg></button>
        </div>
        <span className="text-sm font-medium truncate max-w-[300px]">{problem.title}</span>
        <div className="flex-1" />
        <button onClick={() => setShowShortcuts(true)} className="p-1.5 rounded hover:bg-[#ffffff12] text-[#eff1f680] transition text-xs" title="Shortcuts">⌨</button>
        <div className="flex items-center gap-1.5 text-xs text-[#eff1f680] mr-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
          {fmtTime(elapsed)}
        </div>
        <button onClick={handleRun} disabled={running || submitting} className="h-[30px] px-3.5 rounded-lg text-xs font-medium border border-[#404040] text-[#eff1f6] hover:bg-[#ffffff12] disabled:opacity-40 transition flex items-center gap-1.5">
          {running ? <div className="w-3 h-3 border border-[#eff1f680] border-t-white rounded-full animate-spin" /> : <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}Run
        </button>
        <button onClick={handleSubmit} disabled={running || submitting} className="h-[30px] px-3.5 rounded-lg text-xs font-medium bg-[#2cbb5d] text-white hover:bg-[#26a651] disabled:opacity-40 transition flex items-center gap-1.5">
          {submitting ? <div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" /> : <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12l5 5L20 6" /></svg>}Submit
        </button>
      </nav>

      {/* MAIN */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT */}
        <div className="flex flex-col overflow-hidden bg-[#282828] min-w-0" style={{ width: `${leftWidth}%` }}>
          <div className="flex border-b border-[#3c3c3c] overflow-x-auto flex-shrink-0">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setLeftTab(t.id)} className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition flex items-center gap-1.5 ${leftTab === t.id ? 'border-white text-white' : 'border-transparent text-[#eff1f680] hover:text-[#eff1f6a0]'}`}>
                {t.label}
                {t.count > 0 && <span className="px-1.5 py-0.5 rounded-full bg-[#ffffff15] text-[10px]">{t.count}</span>}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto lc-scroll">
            {leftTab === 'description' && <DescriptionTab problem={problem} liked={liked} disliked={disliked} likeCount={likeCount} dislikeCount={dislikeCount} bookmarked={bookmarked} onLike={handleLike} onDislike={handleDislike} onBookmark={handleBookmark} hints={hints} unlockedHints={unlockedHints} onUnlockHint={i => setUnlockedHints(p => [...new Set([...p, i])])} similarProblems={similarProblems} onNavigate={id => navigate(`/problem/${id}`)} loading={loading} />}
            {leftTab === 'editorial' && <EditorialTab editorial={editorial} loading={editorialLoading} onLoad={handleLoadEditorial} />}
            {leftTab === 'solutions' && <SolutionsTab discussions={discussions} discussionCount={discussions.length} />}
            {leftTab === 'submissions' && <SubmissionsTab submissions={submissions} onViewCode={onViewCode} />}
          </div>
        </div>

        {/* H-RESIZE */}
        <div className="w-[5px] flex-shrink-0 cursor-col-resize bg-[#1a1a2e] hover:bg-[#ffa11640] active:bg-[#ffa11660] transition-colors" onMouseDown={startHResize} />

        {/* RIGHT */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e] min-w-0">
          {/* Editor Header */}
          <div className="h-[38px] flex-shrink-0 flex items-center justify-between px-3 bg-[#282828] border-b border-[#3c3c3c]">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-[#2cbb5d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>
              <span className="text-xs font-medium">Code</span>
            </div>
            <div className="flex items-center gap-2">
              <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-[#3c3c3c] text-[#eff1f6] text-xs rounded px-2 py-1 border-none outline-none cursor-pointer">
                {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
              <button onClick={handleReset} className="p-1 rounded hover:bg-[#ffffff12] text-[#eff1f680] transition" title="Reset">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" /></svg>
              </button>
              <button onClick={() => setFontSize(f => Math.min(22, f + 1))} className="p-1 rounded hover:bg-[#ffffff12] text-[#eff1f680] transition text-[10px] font-bold">A+</button>
              <button onClick={() => setFontSize(f => Math.max(11, f - 1))} className="p-1 rounded hover:bg-[#ffffff12] text-[#eff1f680] transition text-[10px] font-bold">A-</button>
            </div>
          </div>

          {/* Editor + TestCase */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div style={{ height: showConsole ? `${editorHeight}%` : '100%' }} className="overflow-hidden">
              <Editor beforeMount={handleEditorWillMount} onMount={handleEditorDidMount} height="100%" language={language === 'cpp' ? 'cpp' : language} value={code} onChange={v => setCode(v || '')} theme="vs-dark"
                options={{ minimap: { enabled: false }, fontSize, fontFamily: "'Fira Code','Consolas',monospace", fontLigatures: true, lineNumbers: 'on', scrollBeyondLastLine: false, automaticLayout: true, padding: { top: 12, bottom: 12 }, tabSize: language === 'python' ? 4 : 2, bracketPairColorization: { enabled: true }, smoothScrolling: true, cursorBlinking: 'smooth', renderLineHighlight: 'line' }}
              />
            </div>
            {showConsole && (
              <>
                <div className="h-[5px] flex-shrink-0 cursor-row-resize bg-[#1a1a2e] hover:bg-[#ffa11640] active:bg-[#ffa11660] transition-colors" onMouseDown={startVResize} />
                <div style={{ height: `${100 - editorHeight}%` }} className="overflow-hidden">
                  <TestCasePanel testCases={visibleTestCases} activeCase={activeTestCase} setActiveCase={setActiveTestCase} runResult={runResult} submitResult={submitResult} activeTab={bottomTab} setActiveTab={setBottomTab} customCases={customCases} setCustomCases={setCustomCases} onAddCase={onAddCase} onRemoveCase={onRemoveCase} />
                </div>
              </>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="h-[36px] flex-shrink-0 flex items-center justify-between px-3 bg-[#282828] border-t border-[#3c3c3c]">
            <button onClick={() => setShowConsole(c => !c)} className="flex items-center gap-1.5 text-xs text-[#eff1f680] hover:text-[#eff1f6] transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17l6-5-6-5M12 19h8" /></svg>Console
            </button>
            <div className="text-[10px] text-[#eff1f650]">Ctrl+Enter: Run • Ctrl+Shift+Enter: Submit • ?: Shortcuts</div>
          </div>
        </div>
      </div>

      <style>{`
        .lc-scroll::-webkit-scrollbar{width:6px}.lc-scroll::-webkit-scrollbar-track{background:transparent}.lc-scroll::-webkit-scrollbar-thumb{background:#ffffff20;border-radius:3px}.lc-scroll::-webkit-scrollbar-thumb:hover{background:#ffffff30}
        @media(max-width:768px){.lc-scroll{width:100%!important}}
      `}</style>
    </div>
  );
}

export default function LeetCodeEditor() {
  return <EditorErrorBoundary><LeetCodeEditorInner /></EditorErrorBoundary>;
}
