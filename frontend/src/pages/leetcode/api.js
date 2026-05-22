import { API_URL } from './constants';

export async function fetchProblem(problemId, token) {
  const res = await fetch(`${API_URL}/problems/${problemId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch problem');
  return res.json();
}

export async function fetchMetadata(problemId, token) {
  const res = await fetch(`${API_URL}/problem-metadata/${problemId}/user-preferences`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchFullMetadata(problemId, token) {
  const res = await fetch(`${API_URL}/problem-metadata/${problemId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchSubmissions(problemId, token) {
  const res = await fetch(`${API_URL}/submissions?problemId=${problemId}&limit=20`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.submissions || [];
}

export async function fetchSubmissionById(id, token) {
  const res = await fetch(`${API_URL}/submissions/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchDiscussions(problemId, token) {
  const res = await fetch(`${API_URL}/discussions/problem/${problemId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.discussions || [];
}

export async function fetchHints(problemId, token) {
  const res = await fetch(`${API_URL}/judge/hints/${problemId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.hints || [];
}

export async function fetchDraft(problemId, token) {
  const res = await fetch(`${API_URL}/drafts/${problemId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  return res.json();
}

export async function saveDraft(problemId, code, language, token) {
  await fetch(`${API_URL}/drafts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ problemId, code, language })
  });
}

// Run a single test case
export async function runCode(code, language, problemId, testCaseIndex, token) {
  const res = await fetch(`${API_URL}/judge/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ code, language, problemId, testCaseIndex })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Run failed');
  }
  return res.json();
}

// Run ALL visible test cases at once (batch)
export async function runCodeBatch(code, language, problemId, token, customCases = []) {
  const res = await fetch(`${API_URL}/judge/run-batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ code, language, problemId, customCases })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Batch run failed');
  }
  return res.json();
}

// Run with custom input (user-edited test case)
export async function runCodeCustom(code, language, input, token) {
  const res = await fetch(`${API_URL}/judge/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ code, language, input })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Run failed');
  }
  return res.json();
}

export async function submitCode(code, language, problemId, token) {
  const res = await fetch(`${API_URL}/judge/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ code, language, problemId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Submit failed');
  }
  return res.json();
}

export async function toggleLike(problemId, token) {
  const res = await fetch(`${API_URL}/problem-metadata/${problemId}/like`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function toggleDislike(problemId, token) {
  const res = await fetch(`${API_URL}/problem-metadata/${problemId}/dislike`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function toggleBookmark(problemId, token) {
  const res = await fetch(`${API_URL}/problem-metadata/${problemId}/bookmark`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function fetchEditorial(problemId, token) {
  const res = await fetch(`${API_URL}/explanations/problem/${problemId}/solution`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: '{}'
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function fetchNextProblem(problemId, token) {
  const res = await fetch(`${API_URL}/problems/${problemId}/next`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchPrevProblem(problemId, token) {
  const res = await fetch(`${API_URL}/problems/${problemId}/previous`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchPercentile(problemId, token) {
  const res = await fetch(`${API_URL}/judge/percentile/${problemId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  return res.json();
}

// Real-time syntax check (compile-only, no execution)
export async function syntaxCheck(code, language, token) {
  try {
    const res = await fetch(`${API_URL}/judge/syntax-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ code, language })
    });
    if (!res.ok) return { valid: true };
    return res.json();
  } catch {
    return { valid: true }; // Never block user on network errors
  }
}
