/**
 * Code Sanitizer — P0 Security Layer
 * 
 * Blocks dangerous system calls, imports, and exploits BEFORE code
 * reaches the Docker executor. Even though Docker is sandboxed,
 * defense-in-depth means we reject malicious code at the gate.
 */

const DANGEROUS_PATTERNS = {
  // ─── Python ───
  python: [
    { pattern: /\bos\.system\b/,           reason: 'os.system() is not allowed' },
    { pattern: /\bos\.popen\b/,            reason: 'os.popen() is not allowed' },
    { pattern: /\bos\.exec\w*\b/,          reason: 'os.exec*() is not allowed' },
    { pattern: /\bos\.spawn\w*\b/,         reason: 'os.spawn*() is not allowed' },
    { pattern: /\bos\.remove\b/,           reason: 'os.remove() is not allowed' },
    { pattern: /\bos\.unlink\b/,           reason: 'os.unlink() is not allowed' },
    { pattern: /\bos\.rmdir\b/,            reason: 'os.rmdir() is not allowed' },
    { pattern: /\bos\.rename\b/,           reason: 'os.rename() is not allowed' },
    { pattern: /\bsubprocess\b/,           reason: 'subprocess module is not allowed' },
    { pattern: /\b__import__\b/,           reason: '__import__() is not allowed' },
    { pattern: /\beval\s*\(/,              reason: 'eval() is not allowed' },
    { pattern: /\bexec\s*\(/,              reason: 'exec() is not allowed' },
    { pattern: /\bcompile\s*\(/,           reason: 'compile() is not allowed' },
    { pattern: /\bopen\s*\(\s*['"][\/\\]/, reason: 'Reading system files is not allowed' },
    { pattern: /\bsocket\b/,              reason: 'socket module is not allowed' },
    { pattern: /\burllib\b/,              reason: 'urllib module is not allowed' },
    { pattern: /\brequests\b/,            reason: 'requests module is not allowed' },
    { pattern: /\bhttp\.\w+\b/,           reason: 'http module is not allowed' },
    { pattern: /\bshutil\b/,              reason: 'shutil module is not allowed' },
    { pattern: /\bctypes\b/,              reason: 'ctypes module is not allowed' },
    { pattern: /\bpickle\b/,              reason: 'pickle module is not allowed' },
    { pattern: /\bglobals\s*\(\s*\)/,      reason: 'globals() is not allowed' },
  ],

  // ─── JavaScript / Node.js ───
  javascript: [
    { pattern: /\brequire\s*\(\s*['"]child_process['"]\)/, reason: 'child_process is not allowed' },
    { pattern: /\brequire\s*\(\s*['"]fs['"]\)/,            reason: 'fs module is not allowed' },
    { pattern: /\brequire\s*\(\s*['"]net['"]\)/,           reason: 'net module is not allowed' },
    { pattern: /\brequire\s*\(\s*['"]http['"]\)/,          reason: 'http module is not allowed' },
    { pattern: /\brequire\s*\(\s*['"]https['"]\)/,         reason: 'https module is not allowed' },
    { pattern: /\brequire\s*\(\s*['"]os['"]\)/,            reason: 'os module is not allowed' },
    { pattern: /\brequire\s*\(\s*['"]path['"]\)/,          reason: 'path module is not allowed' },
    { pattern: /\brequire\s*\(\s*['"]cluster['"]\)/,       reason: 'cluster module is not allowed' },
    { pattern: /\brequire\s*\(\s*['"]vm['"]\)/,            reason: 'vm module is not allowed' },
    { pattern: /\bprocess\.exit\b/,                        reason: 'process.exit() is not allowed' },
    { pattern: /\bprocess\.env\b/,                         reason: 'process.env is not allowed' },
    { pattern: /\bprocess\.kill\b/,                        reason: 'process.kill() is not allowed' },
    { pattern: /\beval\s*\(/,                              reason: 'eval() is not allowed' },
    { pattern: /\bFunction\s*\(/,                          reason: 'Function constructor is not allowed' },
    { pattern: /\bimport\s*\(\s*['"]fs['"]\)/,             reason: 'Dynamic import of fs is not allowed' },
    { pattern: /\bimport\s*\(\s*['"]child_process['"]\)/,  reason: 'Dynamic import of child_process is not allowed' },
  ],

  // ─── C++ ───
  cpp: [
    { pattern: /\bsystem\s*\(/,            reason: 'system() is not allowed' },
    { pattern: /\bpopen\s*\(/,             reason: 'popen() is not allowed' },
    { pattern: /\bexec[vlp]*\s*\(/,        reason: 'exec*() is not allowed' },
    { pattern: /\bfork\s*\(\s*\)/,         reason: 'fork() is not allowed' },
    { pattern: /\b#include\s*<fstream>/,   reason: 'File I/O (fstream) is not allowed' },
    { pattern: /\b#include\s*<filesystem>/,reason: 'filesystem is not allowed' },
    { pattern: /\b#include\s*<sys\/socket\.h>/, reason: 'Socket programming is not allowed' },
    { pattern: /\b#include\s*<netinet/,    reason: 'Network headers are not allowed' },
    { pattern: /\b#include\s*<arpa/,       reason: 'Network headers are not allowed' },
    { pattern: /\basm\s*\(/,               reason: 'Inline assembly is not allowed' },
    { pattern: /\b__asm__\b/,              reason: 'Inline assembly is not allowed' },
  ],

  // ─── Java ───
  java: [
    { pattern: /\bRuntime\.getRuntime\(\)/,          reason: 'Runtime.getRuntime() is not allowed' },
    { pattern: /\bProcessBuilder\b/,                 reason: 'ProcessBuilder is not allowed' },
    { pattern: /\bSystem\.exit\b/,                   reason: 'System.exit() is not allowed' },
    { pattern: /\bjava\.io\.File\b/,                 reason: 'File I/O is not allowed' },
    { pattern: /\bjava\.net\./,                      reason: 'Networking is not allowed' },
    { pattern: /\bjava\.lang\.reflect\b/,            reason: 'Reflection is not allowed' },
    { pattern: /\bClassLoader\b/,                    reason: 'ClassLoader is not allowed' },
    { pattern: /\bThread\b/,                         reason: 'Threading is not allowed' },
    { pattern: /\bSecurityManager\b/,                reason: 'SecurityManager access is not allowed' },
    { pattern: /\bjava\.nio\.file\b/,                reason: 'NIO file access is not allowed' },
  ],

  // ─── Go ───
  go: [
    { pattern: /\bos\/exec\b/,             reason: 'os/exec package is not allowed' },
    { pattern: /\bsyscall\b/,              reason: 'syscall package is not allowed' },
    { pattern: /\bnet\b/,                 reason: 'net package is not allowed' },
    { pattern: /\bos\.Remove\b/,           reason: 'os.Remove is not allowed' },
    { pattern: /\bos\.Create\b/,           reason: 'os.Create is not allowed' },
  ],

  // ─── Rust ───
  rust: [
    { pattern: /\bstd::process\b/,         reason: 'std::process is not allowed' },
    { pattern: /\bstd::fs\b/,              reason: 'std::fs is not allowed' },
    { pattern: /\bstd::net\b/,             reason: 'std::net is not allowed' },
    { pattern: /\bstd::os\b/,              reason: 'std::os is not allowed' },
  ],
};

// Universal patterns that apply to ALL languages
const UNIVERSAL_PATTERNS = [
  { pattern: /rm\s+-rf\s+\//,             reason: 'Destructive shell commands are not allowed' },
  { pattern: /\/etc\/passwd/,              reason: 'Accessing system files is not allowed' },
  { pattern: /\/etc\/shadow/,              reason: 'Accessing system files is not allowed' },
  { pattern: /while\s*\(\s*true\s*\)\s*\{\s*\}/, reason: 'Infinite empty loops are not allowed' },
  { pattern: /for\s*\(\s*;\s*;\s*\)\s*\{\s*\}/,  reason: 'Infinite empty loops are not allowed' },
];

/**
 * Sanitize user code before execution.
 * @param {string} code - The user's raw source code
 * @param {string} language - The programming language (cpp, python, java, javascript)
 * @returns {{ safe: boolean, reason?: string }} - Whether the code is safe to execute
 */
export function sanitizeCode(code, language) {
  if (!code || !language) {
    return { safe: false, reason: 'Code and language are required' };
  }

  // Strip comments to prevent bypass via comment-wrapped patterns
  let stripped = code;

  if (language === 'python') {
    stripped = stripped.replace(/#.*$/gm, '');
    stripped = stripped.replace(/'''[\s\S]*?'''/g, '');
    stripped = stripped.replace(/"""[\s\S]*?"""/g, '');
  } else {
    stripped = stripped.replace(/\/\/.*$/gm, '');
    stripped = stripped.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  // Check universal patterns
  for (const rule of UNIVERSAL_PATTERNS) {
    if (rule.pattern.test(stripped)) {
      return { safe: false, reason: rule.reason };
    }
  }

  // Check language-specific patterns
  const langPatterns = DANGEROUS_PATTERNS[language] || [];
  for (const rule of langPatterns) {
    if (rule.pattern.test(stripped)) {
      return { safe: false, reason: rule.reason };
    }
  }

  // Code size limit (prevent massive allocations disguised as code)
  if (code.length > 50000) {
    return { safe: false, reason: 'Code exceeds maximum size limit (50KB)' };
  }

  return { safe: true };
}
