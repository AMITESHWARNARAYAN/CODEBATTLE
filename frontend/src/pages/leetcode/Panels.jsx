import { useState } from 'react';
import { DIFF_COLORS } from './constants';

/* ─── Skeleton Loader ─── */
export function Skeleton({ lines = 6 }) {
  return (
    <div className="p-5 space-y-3 animate-pulse">
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-4 bg-[#ffffff10] rounded" style={{ width: `${50 + Math.random() * 50}%` }} />
      ))}
    </div>
  );
}

/* ─── Confetti Effect ─── */
export function Confetti({ show }) {
  if (!show) return null;
  const colors = ['#2cbb5d', '#ffc01e', '#00b8a3', '#ef4743', '#a855f7', '#3b82f6'];
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(60)].map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const dur = 1.5 + Math.random() * 1.5;
        const color = colors[i % colors.length];
        const size = 4 + Math.random() * 6;
        return (
          <div key={i} className="absolute" style={{
            left: `${left}%`, top: '-10px',
            width: size, height: size * 1.5,
            backgroundColor: color,
            borderRadius: '2px',
            animation: `confettiFall ${dur}s ease-in ${delay}s forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }} />
        );
      })}
      <style>{`@keyframes confettiFall { 0% { opacity:1; transform: translateY(0) rotate(0deg); } 100% { opacity:0; transform: translateY(100vh) rotate(${360 + Math.random() * 720}deg); } }`}</style>
    </div>
  );
}

/* ─── Keyboard Shortcuts Modal ─── */
export function ShortcutsModal({ show, onClose }) {
  if (!show) return null;
  const shortcuts = [
    ['Ctrl + Enter', 'Run Code'],
    ['Ctrl + Shift + Enter', 'Submit Code'],
    ['Ctrl + S', 'Save Draft'],
    ['Ctrl + ]', 'Increase Font'],
    ['Ctrl + [', 'Decrease Font'],
    ['Ctrl + /', 'Toggle Comment'],
    ['Ctrl + Z', 'Undo'],
    ['Ctrl + Shift + Z', 'Redo'],
    ['?', 'Show Shortcuts'],
  ];
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[#282828] rounded-xl border border-[#3c3c3c] p-6 w-[420px] shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white">Keyboard Shortcuts</h3>
          <button onClick={onClose} className="text-[#eff1f680] hover:text-white transition">✕</button>
        </div>
        <div className="space-y-2">
          {shortcuts.map(([key, desc]) => (
            <div key={key} className="flex justify-between items-center py-1.5">
              <span className="text-xs text-[#eff1f6cc]">{desc}</span>
              <kbd className="px-2 py-0.5 bg-[#3c3c3c] rounded text-[10px] text-[#eff1f6a0] font-mono">{key}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Description Tab ─── */
export function DescriptionTab({ problem, liked, disliked, likeCount, dislikeCount, bookmarked, onLike, onDislike, onBookmark, hints, unlockedHints, onUnlockHint, similarProblems, onNavigate, loading }) {
  const [showTags, setShowTags] = useState(true);

  if (loading) return <Skeleton lines={12} />;

  // Extract examples: use DB examples, fallback to first 3 public testcases as safety net
  let examples = problem.examples || [];
  if (examples.length === 0 || (examples.length === 1 && (!examples[0].input || examples[0].input === 'None' || examples[0].input === 'none'))) {
    const publicCases = (problem.testCases || []).filter(tc => !tc.isHidden).slice(0, 3);
    if (publicCases.length > 0) {
      examples = publicCases.map(tc => ({
        input: tc.input,
        output: tc.expectedOutput,
        explanation: ''
      }));
    } else {
      examples = [];
    }
  }

  // Constraints come from DB — all 100 problems now have real per-problem constraints
  const constraints = problem.constraints || '';

  return (
    <div className="p-5 space-y-5 text-sm">
      {/* Title + Category + Difficulty */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {problem.category && (
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#2a2a2a] text-white flex items-center gap-1.5 border border-[#3e3e3e]" style={{ borderLeft: `3px solid ${problem.category.color || '#3b82f6'}` }}>
              <span>{problem.category.icon || '📚'}</span>
              <span>{problem.category.name}</span>
            </span>
          )}
          <span className="text-xs px-2.5 py-0.5 rounded font-bold border" style={{ color: DIFF_COLORS[problem.difficulty] || '#eff1f6', backgroundColor: `${DIFF_COLORS[problem.difficulty]}12`, borderColor: `${DIFF_COLORS[problem.difficulty]}25` }}>{problem.difficulty}</span>
        </div>
        <h1 className="text-xl font-semibold text-[#eff1f6]">{problem.title}</h1>
      </div>

      {/* Like / Dislike / Bookmark */}
      <div className="flex items-center gap-3 text-[#eff1f6a0]">
        <button onClick={onLike} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition ${liked ? 'bg-[#2cbb5d20] text-[#2cbb5d]' : 'hover:bg-[#3c3c3c]'}`}>
          <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" /><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" /></svg>
          {likeCount > 0 && likeCount}
        </button>
        <button onClick={onDislike} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition ${disliked ? 'bg-[#ef474320] text-[#ef4743]' : 'hover:bg-[#3c3c3c]'}`}>
          <svg className="w-4 h-4" fill={disliked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 15V19a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" /><path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" /></svg>
          {dislikeCount > 0 && dislikeCount}
        </button>
        <button onClick={onBookmark} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition ${bookmarked ? 'bg-[#ffc01e20] text-[#ffc01e]' : 'hover:bg-[#3c3c3c]'}`}>
          <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" /></svg>
        </button>
      </div>

      {/* Description — now contains rich HTML with <code>, <ul>, <p>, <strong> tags */}
      <div className="text-[#eff1f6cc] leading-relaxed text-sm description-content dark-desc" dangerouslySetInnerHTML={{ __html: problem.description }} />

      {/* Examples — now human-readable (e.g. "nums = [2,7,11,15], target = 9") */}
      {examples.map((ex, i) => (
        <div key={i} className="space-y-2">
          <p className="font-semibold text-[#eff1f6]">Example {i + 1}:</p>
          <div className="bg-[#ffffff06] rounded-lg p-4 border-l-[3px] border-[#3b82f640] font-mono text-xs space-y-1.5">
            <div><span className="font-bold text-[#eff1f6]">Input: </span><span className="text-[#eff1f6cc]">{ex.input}</span></div>
            <div><span className="font-bold text-[#eff1f6]">Output: </span><span className="text-[#eff1f6cc]">{ex.output}</span></div>
            {ex.explanation && <div className="text-[#eff1f6a0] pt-1 border-t border-[#ffffff08]"><span className="font-bold text-[#eff1f6b0]">Explanation: </span>{ex.explanation}</div>}
          </div>
        </div>
      ))}

      {/* Constraints */}
      {constraints && constraints.toLowerCase() !== 'none' && (
        <div>
          <p className="font-semibold text-[#eff1f6] mb-2">Constraints:</p>
          <ul className="list-disc list-inside space-y-1 text-[#eff1f6cc]">
            {constraints.split('\n').filter(Boolean).map((c, i) => (
              <li key={i} className="text-xs text-[#eff1f6a0]"><code className="bg-[#ffffff08] px-1.5 py-0.5 rounded text-[#eff1f6cc] font-mono text-[11px]">{c.replace(/^[-•]\s*/, '')}</code></li>
            ))}
          </ul>
        </div>
      )}

      {/* Topics / Tags (collapsible) */}
      {problem.tags && problem.tags.length > 0 && (
        <div>
          <button onClick={() => setShowTags(!showTags)} className="flex items-center gap-2 font-semibold text-[#eff1f6] text-sm">
            Topics <svg className={`w-3 h-3 transition-transform ${showTags ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
          </button>
          {showTags && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {problem.tags.map((tag, i) => <span key={i} className="px-2.5 py-1 rounded-full bg-[#ffffff0f] text-[#eff1f6a0] text-xs hover:bg-[#ffffff18] cursor-pointer transition">{tag}</span>)}
            </div>
          )}
        </div>
      )}

      {/* Company Tags */}
      {problem.companyTags && problem.companyTags.length > 0 && (
        <div>
          <p className="font-semibold text-[#eff1f6] mb-2">Companies</p>
          <div className="flex flex-wrap gap-1.5">
            {problem.companyTags.map((c, i) => <span key={i} className="px-2.5 py-1 rounded-full bg-[#ffffff0f] text-[#eff1f6a0] text-xs">{c}</span>)}
          </div>
        </div>
      )}

      {/* Hints */}
      {hints && hints.length > 0 && (
        <div>
          <p className="font-semibold text-[#eff1f6] mb-2">Hints</p>
          <div className="space-y-2">
            {hints.map((hint, i) => (
              <button key={i} onClick={() => onUnlockHint(i)} className="w-full text-left p-3 rounded-lg bg-[#ffffff08] hover:bg-[#ffffff12] transition text-xs">
                {unlockedHints.includes(i)
                  ? <span className="text-[#eff1f6cc]">{typeof hint === 'string' ? hint : hint.content || hint.title}</span>
                  : <span className="text-[#eff1f6a0]">💡 Hint {i + 1} — Click to reveal</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Similar Problems */}
      {similarProblems && similarProblems.length > 0 && (
        <div>
          <p className="font-semibold text-[#eff1f6] mb-2">Similar Questions</p>
          <div className="space-y-1">
            {similarProblems.map((sp, i) => (
              <button key={i} onClick={() => onNavigate && onNavigate(sp._id)} className="flex items-center justify-between w-full p-2 rounded hover:bg-[#ffffff08] transition text-xs">
                <span className="text-[#eff1f6cc]">{sp.title}</span>
                <span style={{ color: DIFF_COLORS[sp.difficulty] || '#eff1f6' }}>{sp.difficulty}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-6 text-xs text-[#eff1f680] pt-2 border-t border-[#ffffff10]">
        {problem.totalSubmissions != null && <span>Submissions: {problem.totalSubmissions}</span>}
        {problem.acceptanceRate != null && <span>Acceptance: {problem.acceptanceRate}%</span>}
      </div>
    </div>
  );
}

/* ─── Editorial Tab ─── */
export function EditorialTab({ editorial, loading, onLoad }) {
  if (!editorial && !loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#eff1f680] text-sm mb-4">Generate AI-powered editorial for this problem</p>
        <button onClick={onLoad} className="px-4 py-2 bg-[#2cbb5d] text-white rounded-lg text-sm font-medium hover:bg-[#26a651] transition">Generate Editorial</button>
      </div>
    );
  }
  if (loading) return <Skeleton lines={10} />;
  return <div className="p-5 text-sm text-[#eff1f6cc] leading-relaxed whitespace-pre-wrap">{editorial}</div>;
}

/* ─── Solutions/Discussions Tab ─── */
export function SolutionsTab({ discussions, loading, discussionCount }) {
  if (loading) return <Skeleton lines={6} />;
  if (!discussions || discussions.length === 0) {
    return <div className="p-6 text-center text-[#eff1f680] text-sm">No community solutions yet.</div>;
  }
  return (
    <div className="p-4 space-y-2">
      <div className="text-xs text-[#eff1f680] mb-3">{discussionCount || discussions.length} solutions</div>
      {discussions.map((d, i) => (
        <div key={i} className="p-3 rounded-lg bg-[#ffffff08] hover:bg-[#ffffff12] transition cursor-pointer">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-[#eff1f6]">{d.title || 'Untitled'}</span>
            <span className="text-xs text-[#eff1f680]">{d.upvotes?.length || 0} 👍</span>
          </div>
          <div className="text-xs text-[#eff1f680]">
            {d.user?.username || 'Anonymous'} • {d.comments?.length || 0} comments
            {d.tags?.map((t, j) => <span key={j} className="ml-2 px-1.5 py-0.5 rounded bg-[#ffffff10] text-[10px]">{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Submissions Tab ─── */
export function SubmissionsTab({ submissions, loading, onViewCode }) {
  if (loading) return <Skeleton lines={8} />;
  if (!submissions || submissions.length === 0) {
    return <div className="p-6 text-center text-[#eff1f680] text-sm">No submissions yet. Solve the problem!</div>;
  }

  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)} min ago`;
    if (s < 86400) return `${Math.floor(s / 3600)} hr ago`;
    if (s < 2592000) return `${Math.floor(s / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-[#eff1f680] border-b border-[#ffffff10]">
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Language</th>
            <th className="text-left p-3 font-medium">Runtime</th>
            <th className="text-left p-3 font-medium">Memory</th>
            <th className="text-left p-3 font-medium">Time</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s, i) => (
            <tr key={i} className="border-b border-[#ffffff08] hover:bg-[#ffffff08] cursor-pointer transition" onClick={() => onViewCode?.(s)}>
              <td className="p-3"><span className={`font-medium ${s.status === 'Accepted' ? 'text-[#2cbb5d]' : 'text-[#ef4743]'}`}>{s.status}</span></td>
              <td className="p-3 text-[#eff1f6cc]">{s.language}</td>
              <td className="p-3 text-[#eff1f6cc]">{s.runtime || 0} ms</td>
              <td className="p-3 text-[#eff1f6cc]">{typeof s.memory === 'number' ? s.memory.toFixed(1) : s.memory || 0} MB</td>
              <td className="p-3 text-[#eff1f680]">{timeAgo(s.submittedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Percentile Bar ─── */
export function PercentileBar({ label, value, percentile, unit }) {
  if (percentile == null) return null;
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="w-16 text-[#eff1f680]">{label}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#eff1f6] font-medium">{value} {unit}</span>
          <span className="text-[#2cbb5d] font-medium">Beats {percentile}%</span>
        </div>
        <div className="h-2 bg-[#3c3c3c] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#2cbb5d] to-[#00b8a3] rounded-full transition-all duration-700" style={{ width: `${percentile}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ─── TestCase Panel (with editable inputs + custom cases) ─── */
export function TestCasePanel({ testCases, activeCase, setActiveCase, runResult, submitResult, activeTab, setActiveTab, customCases, setCustomCases, onAddCase, onRemoveCase }) {
  const allCases = [...(testCases || []), ...(customCases || [])];
  const result = activeTab === 'result' ? (submitResult || runResult) : null;

  const handleInputChange = (idx, value) => {
    if (idx >= (testCases || []).length) {
      // Custom case
      const ci = idx - (testCases || []).length;
      const updated = [...(customCases || [])];
      updated[ci] = { ...updated[ci], input: value };
      setCustomCases(updated);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="flex items-center border-b border-[#3c3c3c] px-3">
        <button onClick={() => setActiveTab('testcase')} className={`px-3 py-2 text-xs font-medium border-b-2 transition ${activeTab === 'testcase' ? 'border-white text-white' : 'border-transparent text-[#eff1f680] hover:text-[#eff1f6a0]'}`}>Testcase</button>
        <button onClick={() => setActiveTab('result')} className={`px-3 py-2 text-xs font-medium border-b-2 transition ${activeTab === 'result' ? 'border-white text-white' : 'border-transparent text-[#eff1f680] hover:text-[#eff1f6a0]'}`}>
          Test Result
          {result && <span className={`ml-1.5 inline-block w-1.5 h-1.5 rounded-full ${result.status === 'Accepted' ? 'bg-[#2cbb5d]' : 'bg-[#ef4743]'}`} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'testcase' ? (
          <div>
            <div className="flex gap-1 mb-3 flex-wrap items-center">
              {allCases.map((_, i) => (
                <button key={i} onClick={() => setActiveCase(i)}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${activeCase === i ? 'bg-[#ffffff1a] text-white' : 'text-[#eff1f680] hover:bg-[#ffffff0d]'}`}
                >
                  Case {i + 1}
                  {i >= (testCases || []).length && (
                    <span onClick={(e) => { e.stopPropagation(); onRemoveCase?.(i - (testCases || []).length); }} className="ml-1 text-[#ef4743] hover:text-[#ff6b6b]">×</span>
                  )}
                </button>
              ))}
              <button onClick={onAddCase} className="px-2 py-1 rounded text-xs text-[#eff1f680] hover:bg-[#ffffff0d] hover:text-[#eff1f6] transition" title="Add custom test case">+</button>
            </div>
            {allCases[activeCase] && (
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-[#eff1f680] font-medium uppercase tracking-wider">Input</label>
                  {activeCase >= (testCases || []).length ? (
                    <textarea value={allCases[activeCase].input || ''} onChange={e => handleInputChange(activeCase, e.target.value)}
                      className="mt-1 w-full bg-[#282828] rounded-lg p-3 font-mono text-xs text-[#eff1f6cc] outline-none border border-[#3c3c3c] focus:border-[#ffa116] transition resize-none" rows={3} placeholder="Enter input..." />
                  ) : (
                    <div className="mt-1 bg-[#282828] rounded-lg p-3 font-mono text-xs text-[#eff1f6cc] whitespace-pre-wrap break-all">{allCases[activeCase].input}</div>
                  )}
                </div>
                <div>
                  <label className="text-[10px] text-[#eff1f680] font-medium uppercase tracking-wider">Expected Output</label>
                  <div className="mt-1 bg-[#282828] rounded-lg p-3 font-mono text-xs text-[#eff1f6cc] whitespace-pre-wrap break-all">{allCases[activeCase].expectedOutput || '—'}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {!result ? (
              <div className="text-center text-[#eff1f680] text-xs py-8">Run or submit your code to see results</div>
            ) : (result.status?.toLowerCase() === 'compilation error' || result.status?.toLowerCase() === 'compile error') ? (
              <div className="space-y-3">
                <div className="text-lg font-bold text-red-500">
                  Compile Error
                </div>
                <div className="bg-[#ff4b4b0a] border border-[#ff4b4b22] rounded-lg p-4 font-mono text-xs text-[#ff8e8e] whitespace-pre-wrap leading-relaxed select-text max-h-[300px] overflow-y-auto custom-scrollbar">
                  {result.compile_output || (result.errors && result.errors[0]) || 'Unknown compilation error'}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className={`text-lg font-semibold ${result.status === 'Accepted' ? 'text-[#2cbb5d]' : 'text-[#ef4743]'}`}>
                    {result.status === 'Accepted' ? '✓ Accepted' : `✗ ${result.status}`}
                  </div>
                  <div className="text-xs text-[#eff1f680] mt-1">{result.testCasesPassed}/{result.totalTestCases} test cases passed</div>
                </div>

                {result.status === 'Accepted' && (
                  <div className="space-y-2">
                    {result.runtimePercentile != null && <PercentileBar label="Runtime" value={result.executionTime || 0} percentile={result.runtimePercentile} unit="ms" />}
                    {result.memoryPercentile != null && <PercentileBar label="Memory" value={(result.memoryUsed || 0).toFixed?.(2) || 0} percentile={result.memoryPercentile} unit="MB" />}
                    {result.runtimePercentile == null && (
                      <div className="flex gap-6 text-xs">
                        <div><span className="text-[#eff1f680]">Runtime: </span><span className="text-[#eff1f6]">{result.executionTime || 0} ms</span></div>
                        <div><span className="text-[#eff1f680]">Memory: </span><span className="text-[#eff1f6]">{(result.memoryUsed || 0).toFixed?.(2) || 0} MB</span></div>
                      </div>
                    )}
                  </div>
                )}

                {result.outputs?.map((out, i) => (
                  <div key={i} className={`p-3 rounded-lg border text-xs ${out.passed ? 'bg-[#2cbb5d10] border-[#2cbb5d30]' : 'bg-[#ef474310] border-[#ef474330]'} relative`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`font-medium ${out.passed ? 'text-[#2cbb5d]' : 'text-[#ef4743]'}`}>
                        {out.passed ? '✓' : '✗'} Case {out.testCase}
                      </div>
                      {out.isHidden && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ef474312] text-[#ef4743] border border-[#ef474325]">
                          Private Test Case
                        </span>
                      )}
                    </div>
                    {out.input && <div className="mb-1"><span className="text-[#eff1f680]">Input: </span><span className="font-mono text-[#eff1f6cc]">{out.input}</span></div>}
                    {out.expectedOutput && <div className="mb-1"><span className="text-[#eff1f680]">Expected: </span><span className="font-mono text-[#eff1f6cc]">{out.expectedOutput}</span></div>}
                    {out.actualOutput && <div className="mb-1"><span className="text-[#eff1f680]">Output: </span><span className={`font-mono ${out.passed ? 'text-[#2cbb5d]' : 'text-[#ef4743]'}`}>{out.actualOutput}</span></div>}
                    {out.stdout && <div className="mb-1"><span className="text-[#eff1f680]">Stdout: </span><span className="font-mono text-[#eff1f6a0]">{out.stdout}</span></div>}
                    {out.error && <div className="mt-1 text-[#ef4743] font-mono break-all">{out.error}</div>}
                  </div>
                ))}

                {result.errors?.length > 0 && (
                  <div className="p-3 rounded-lg bg-[#ef474310] border border-[#ef474330]">
                    <div className="text-xs font-medium text-[#ef4743] mb-1">Errors</div>
                    {result.errors.map((e, i) => <div key={i} className="text-xs font-mono text-[#ef4743cc] break-all">{e}</div>)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

