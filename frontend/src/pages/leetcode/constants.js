export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const LANGUAGES = [
  { id: 'cpp', name: 'C++', monacoId: 'cpp' },
  { id: 'java', name: 'Java', monacoId: 'java' },
  { id: 'python', name: 'Python 3', monacoId: 'python' },
  { id: 'javascript', name: 'JavaScript', monacoId: 'javascript' },
];

export const DIFF_COLORS = {
  Easy: '#00b8a3',
  Medium: '#ffc01e',
  Hard: '#ef4743',
};

export const DEFAULT_CODE = {
  cpp: '// Write your C++ solution here\n#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    \n};\n',
  java: '// Write your Java solution here\nclass Solution {\n    \n}\n',
  python: '# Write your Python solution here\nclass Solution:\n    pass\n',
  javascript: '// Write your JavaScript solution here\nvar solution = function() {\n    \n};\n',
};
