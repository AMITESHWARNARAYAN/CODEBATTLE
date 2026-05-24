import { spawn } from 'child_process';

// ═══════════════════════════════════════════════════
//  Docker-Based Code Executor
//  Replaces Judge0 API — runs code locally via Docker
// ═══════════════════════════════════════════════════

const DOCKER_IMAGES = {
  cpp:        'gcc:latest',
  python:     'python:3.11-slim',
  java:       'eclipse-temurin:17-jdk-alpine',
  javascript: 'node:18-slim',
  go:         'golang:1.20-alpine',
  rust:       'rust:1.70-alpine',
};

// Separator printed between test case outputs
const TC_SEP = '===TC_SEP===';
const MEM_SEP = '===MEM_SEP===';
const TIME_PREFIX = '===TIME===';     // Per-test-case timing marker
const FAIL_FAST_EXIT = '===FAIL_FAST==='; // Early termination marker

// ═══ Concurrency Limiter ═══
class Semaphore {
  constructor(max) { this.max = max; this.current = 0; this.queue = []; }
  acquire() {
    return new Promise(resolve => {
      if (this.current < this.max) { this.current++; resolve(); }
      else this.queue.push(resolve);
    });
  }
  release() {
    this.current--;
    if (this.queue.length > 0) { this.current++; this.queue.shift()(); }
  }
  get pending() { return this.queue.length; }
}
const executionSemaphore = new Semaphore(5); // Max 5 concurrent code executions

// ═══ Container Pool ═══
// Pre-warmed long-lived containers for fast docker exec instead of cold docker run
const containerPool = new Map(); // language -> { name, status: 'ready'|'starting'|'error' }
let poolInitialized = false;

function spawnAsync(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    let stdout = '', stderr = '';
    const proc = spawn(cmd, args, { timeout: opts.timeout || 30000, stdio: ['ignore', 'pipe', 'pipe'], ...opts });
    proc.stdout?.on('data', d => { stdout += d.toString(); });
    proc.stderr?.on('data', d => { stderr += d.toString(); });
    proc.on('close', code => resolve({ code, stdout, stderr }));
    proc.on('error', err => reject(err));
  });
}

async function startPoolContainer(language, image) {
  const name = `codebattle-pool-${language}`;

  // Remove existing container if any (idempotent)
  await spawnAsync('docker', ['rm', '-f', name], { timeout: 5000 }).catch(() => {});

  // Start long-lived container — generous limits since it handles multiple concurrent execs
  const args = [
    'run', '-d',
    '--name', name,
    '--network', 'none',
    '--memory=1g',
    '--pids-limit=256',
    '--cpus=2',
    '--read-only',
    '--tmpfs', '/tmp:size=100m,rw,exec',
    '--cap-drop=ALL',
    '--security-opt=no-new-privileges',
    image,
    ...(language === 'java' || language === 'go' || language === 'rust'
      ? ['sh', '-c', 'while true; do sleep 3600; done']
      : ['bash', '-c', 'while true; do sleep 3600; done']
    ),
  ];

  const { code, stderr } = await spawnAsync('docker', args, { timeout: 15000 });
  if (code !== 0) throw new Error(`Failed to start ${name}: ${stderr}`);

  containerPool.set(language, { name, status: 'ready' });
  console.log(`  ✅ ${language} pool container ready (${name})`);
}

// Execute code inside an existing pool container via docker exec (FAST — no cold start)
function execInPool(code, language, timeLimit) {
  return new Promise((resolve) => {
    const pool = containerPool.get(language);
    if (!pool || pool.status !== 'ready') { resolve(null); return; } // fall back to docker run

    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const name = pool.name;
    const memCheck = `; echo -n "${MEM_SEP}"; if [ -f /sys/fs/cgroup/memory.peak ]; then cat /sys/fs/cgroup/memory.peak; else echo -n "0"; fi`;
    const shell = (language === 'java' || language === 'go' || language === 'rust') ? 'sh' : 'bash';

    let cmd;
    const memPart = `echo -n "${MEM_SEP}"; if [ -f /sys/fs/cgroup/memory.peak ]; then cat /sys/fs/cgroup/memory.peak; else echo -n "0"; fi`;
    switch (language) {
      case 'cpp':
        cmd = `cat > /tmp/${id}.cpp && g++ -O0 -std=c++17 -o /tmp/${id} /tmp/${id}.cpp && { timeout ${timeLimit} /tmp/${id}; _X=$?; } || _X=$?; ${memPart}; rm -f /tmp/${id}.cpp /tmp/${id}; exit $_X`;
        break;
      case 'python':
        cmd = `{ cat > /tmp/${id}.py && timeout ${timeLimit} python3 /tmp/${id}.py; _X=$?; } || _X=$?; ${memPart}; rm -f /tmp/${id}.py; exit $_X`;
        break;
      case 'java':
        cmd = `mkdir -p /tmp/${id} && cat > /tmp/${id}/Main.java && { javac -d /tmp/${id} /tmp/${id}/Main.java 2>&1 && timeout ${timeLimit} java -cp /tmp/${id} Main; _X=$?; } || _X=$?; ${memPart}; rm -rf /tmp/${id}; exit $_X`;
        break;
      case 'javascript':
        cmd = `{ cat > /tmp/${id}.js && timeout ${timeLimit} node /tmp/${id}.js; _X=$?; } || _X=$?; ${memPart}; rm -f /tmp/${id}.js; exit $_X`;
        break;
      case 'go':
        cmd = `{ cat > /tmp/${id}.go && timeout ${timeLimit} go run /tmp/${id}.go; _X=$?; } || _X=$?; ${memPart}; rm -f /tmp/${id}.go; exit $_X`;
        break;
      case 'rust':
        cmd = `cat > /tmp/${id}.rs && rustc -C opt-level=3 -o /tmp/${id} /tmp/${id}.rs && { timeout ${timeLimit} /tmp/${id}; _X=$?; } || _X=$?; ${memPart}; rm -f /tmp/${id}.rs /tmp/${id}; exit $_X`;
        break;
      default: resolve(null); return;
    }

    const startTime = Date.now();
    let stdout = '', stderr = '';
    let finished = false;

    const proc = spawn('docker', ['exec', '-i', name, shell, '-c', cmd], {
      timeout: (timeLimit + 10) * 1000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    proc.stdout.on('data', d => { stdout += d.toString(); });
    proc.stderr.on('data', d => { stderr += d.toString(); });

    const finish = (exitCode) => {
      if (finished) return;
      finished = true;
      resolve({
        stdout, stderr,
        exitCode: exitCode || 0,
        timedOut: exitCode === 124 || exitCode === 143 || (Date.now() - startTime > (timeLimit + 5) * 1000),
        elapsed: Date.now() - startTime,
      });
    };

    proc.on('close', code => finish(code));
    proc.on('error', err => {
      if (!finished) { stderr += err.message; finish(1); }
    });

    proc.stdin.write(code);
    proc.stdin.end();
  });
}

// Initialize container pool — called on server startup
export async function initContainerPool() {
  console.log('\n🐳 [Container Pool] Initializing...');

  // Verify Docker is available
  try {
    await spawnAsync('docker', ['info'], { timeout: 5000 });
    isDockerAvailable = true;
    dockerLastChecked = Date.now();
  } catch {
    console.error('  ❌ Docker not available. Pool disabled — will use cold docker run as fallback.');
    isDockerAvailable = false;
    dockerLastChecked = Date.now();
    return;
  }

  // Pull all images in parallel and start containers
  const languages = Object.entries(DOCKER_IMAGES);
  console.log(`  📦 Pulling ${languages.length} Docker images...`);

  await Promise.allSettled(
    languages.map(async ([lang, image]) => {
      try {
        console.log(`  ⬇️  Pulling ${image}...`);
        await spawnAsync('docker', ['pull', image], { timeout: 120000 });
        await startPoolContainer(lang, image);
      } catch (err) {
        console.error(`  ⚠️  Failed to init ${lang}: ${err.message}`);
      }
    })
  );

  poolInitialized = true;
  console.log(`🐳 [Container Pool] Ready — ${containerPool.size}/${languages.length} containers active\n`);
}

// Cleanup pool — called on server shutdown
export async function cleanupContainerPool() {
  console.log('🐳 [Container Pool] Shutting down...');
  for (const [, pool] of containerPool.entries()) {
    await spawnAsync('docker', ['rm', '-f', pool.name], { timeout: 5000 }).catch(() => {});
  }
  containerPool.clear();
  poolInitialized = false;
  console.log('🐳 [Container Pool] Cleaned up.');
}

import { compareOutputs } from './outputComparator.js';
import { sanitizeCode } from './codeSanitizer.js';


// ─── Code Wrapping (generates full program from user's function) ───

const DS_HELPERS = {
  cpp: `
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

ListNode* buildLinkedList(const vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* curr = head;
    for (size_t i = 1; i < arr.size(); i++) {
        curr->next = new ListNode(arr[i]);
        curr = curr->next;
    }
    return head;
}

void printLinkedList(ListNode* head) {
    cout << "[";
    ListNode* curr = head;
    while (curr) {
        cout << curr->val;
        if (curr->next) cout << ",";
        curr = curr->next;
    }
    cout << "]" << endl;
}

TreeNode* buildTree(const vector<string>& arr) {
    if (arr.empty() || arr[0] == "null") return nullptr;
    TreeNode* root = new TreeNode(stoi(arr[0]));
    queue<TreeNode*> q;
    q.push(root);
    size_t i = 1;
    while (!q.empty() && i < arr.size()) {
        TreeNode* curr = q.front();
        q.pop();
        if (i < arr.size() && arr[i] != "null") {
            curr->left = new TreeNode(stoi(arr[i]));
            q.push(curr->left);
        }
        i++;
        if (i < arr.size() && arr[i] != "null") {
            curr->right = new TreeNode(stoi(arr[i]));
            q.push(curr->right);
        }
        i++;
    }
    return root;
}

void printTree(TreeNode* root) {
    if (!root) {
        cout << "[]" << endl;
        return;
    }
    vector<string> res;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* curr = q.front();
        q.pop();
        if (curr) {
            res.push_back(to_string(curr->val));
            q.push(curr->left);
            q.push(curr->right);
        } else {
            res.push_back("null");
        }
    }
    while (!res.empty() && res.back() == "null") res.pop_back();
    cout << "[";
    for (size_t i = 0; i < res.size(); i++) {
        if (i > 0) cout << ",";
        if (res[i] == "null") cout << "null";
        else cout << res[i];
    }
    cout << "]" << endl;
}
`,
  python: `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildLinkedList(arr):
    if not arr: return None
    head = ListNode(arr[0])
    curr = head
    for v in arr[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def printLinkedList(head):
    res = []
    curr = head
    while curr:
        res.append(curr.val)
        curr = curr.next
    print(res)

def buildTree(arr):
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0])
    q = [root]
    i = 1
    while q and i < len(arr):
        curr = q.pop(0)
        if i < len(arr) and arr[i] is not None:
            curr.left = TreeNode(arr[i])
            q.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            curr.right = TreeNode(arr[i])
            q.append(curr.right)
        i += 1
    return root

def printTree(root):
    if not root:
        print([])
        return
    res = []
    q = [root]
    while q:
        curr = q.pop(0)
        if curr:
            res.append(curr.val)
            q.append(curr.left)
            q.append(curr.right)
        else:
            res.append(None)
    while res and res[-1] is None:
        res.pop()
    print(res)
`,
  javascript: `
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function buildLinkedList(arr) {
    if (!arr || arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let curr = head;
    for (let i = 1; i < arr.length; i++) {
        curr.next = new ListNode(arr[i]);
        curr = curr.next;
    }
    return head;
}

function printLinkedList(head) {
    const res = [];
    let curr = head;
    while (curr) {
        res.push(curr.val);
        curr = curr.next;
    }
    console.log(JSON.stringify(res));
}

function buildTree(arr) {
    if (!arr || arr.length === 0 || arr[0] === null) return null;
    const root = new TreeNode(arr[0]);
    const q = [root];
    let i = 1;
    while (q.length > 0 && i < arr.length) {
        const curr = q.shift();
        if (i < arr.length && arr[i] !== null) {
            curr.left = new TreeNode(arr[i]);
            q.push(curr.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            curr.right = new TreeNode(arr[i]);
            q.push(curr.right);
        }
        i++;
    }
    return root;
}

function printTree(root) {
    if (!root) {
        console.log("[]");
        return;
    }
    const res = [];
    const q = [root];
    while (q.length > 0) {
        const curr = q.shift();
        if (curr) {
            res.push(curr.val);
            q.push(curr.left);
            q.push(curr.right);
        } else {
            res.push(null);
        }
    }
    while (res.length > 0 && res[res.length - 1] === null) {
        res.pop();
    }
    console.log(JSON.stringify(res));
}
`,
  java: `
class ListNode {
    int val;
    ListNode next;
    ListNode() { val = 0; next = null; }
    ListNode(int x) { val = x; next = null; }
    ListNode(int x, ListNode next) { val = x; this.next = next; }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() { val = 0; left = null; right = null; }
    TreeNode(int x) { val = x; left = null; right = null; }
    TreeNode(int x, TreeNode left, TreeNode right) { val = x; this.left = left; this.right = right; }
}
`,
};

function wrapCpp(userCode, testCases, metaData) {
  let fnName = 'solve', retType = 'int', params = [];
  if (metaData && metaData.name) {
    fnName = metaData.name;
    const typeMap = { 'integer': 'int', 'integer[]': 'vector<int>', 'integer[][]': 'vector<vector<int>>', 'string': 'string', 'string[]': 'vector<string>', 'boolean': 'bool', 'list': 'ListNode*', 'tree': 'TreeNode*', 'void': 'void' };
    retType = typeMap[metaData.return?.type] || 'int';
    params = metaData.params.map(p => `${typeMap[p.type] || 'int'} ${p.name}`);
  } else {
    const fnMatch = userCode.match(/(?:int|bool|void|vector<[^>]+>|string|double|float|long|long long|ListNode\*|TreeNode\*)\s+(\w+)\s*\(/);
    fnName = fnMatch ? fnMatch[1] : 'solve';
    const retMatch = userCode.match(/(int|bool|void|vector<vector<int>>|vector<vector<string>>|vector<int>|vector<string>|vector<char>|string|double|float|long|long long|ListNode\*|TreeNode\*)\s+\w+\s*\(/);
    retType = retMatch ? retMatch[1] : 'int';
    const paramsMatch = userCode.match(/\(([^)]*)\)/);
    params = paramsMatch ? paramsMatch[1].split(',').map(p => p.trim()).filter(Boolean) : [];
  }

  const hasClass = userCode.includes('class Solution');

  const convertToCpp = (val, type = '') => {
    const cleanType = type.replace(/const\s+/, '').replace(/&\s*/, '').trim();
    if (val === null) {
      if (cleanType.includes('TreeNode') || cleanType === 'TREE_NODE_ELEMENT') return '"null"';
      if (cleanType.includes('*')) return 'nullptr';
      return 'NULL';
    }
    if (val === true) return 'true';
    if (val === false) return 'false';
    if (Array.isArray(val)) {
      let elementType = '';
      if (cleanType.includes('TreeNode')) {
        elementType = 'TREE_NODE_ELEMENT';
      } else if (cleanType.startsWith('vector<')) {
        const match = cleanType.match(/vector<\s*(.+)\s*>/);
        if (match) elementType = match[1].trim();
      } else if (cleanType.endsWith('[]')) {
        elementType = cleanType.slice(0, -2).trim();
      }
      return `{${val.map(v => convertToCpp(v, elementType)).join(', ')}}`;
    }
    if (typeof val === 'string') {
      if (cleanType === 'char' || cleanType === 'vector<char>' || cleanType === 'char&' || cleanType === 'TREE_NODE_ELEMENT' || cleanType.endsWith('char')) {
        return `'${val}'`;
      }
      return `"${val}"`;
    }
    return String(val);
  };

  const printResult = (varName, type) => {
    if (type === 'bool') return `cout << (${varName} ? "true" : "false") << endl;`;
    if (type === 'ListNode*') return `printLinkedList(${varName});`;
    if (type === 'TreeNode*') return `printTree(${varName});`;
    if (type === 'vector<vector<int>>' || type === 'vector<vector<char>>' || type === 'vector<vector<double>>' || type === 'vector<vector<long long>>' || type === 'vector<vector<string>>') {
      const isChar = type.includes('char');
      const isStr = type.includes('string');
      const printVal = isChar ? `"'\\"" << ${varName}[_i][_j] << "'\\""` : (isStr ? `"\\\"" << ${varName}[_i][_j] << "\\\""` : `${varName}[_i][_j]`);
      return `cout << "["; for(int _i=0;_i<${varName}.size();_i++){if(_i>0)cout<<",";cout<<"[";for(int _j=0;_j<${varName}[_i].size();_j++){if(_j>0)cout<<",";cout<<${printVal};}cout<<"]";}cout<<"]"<<endl;`;
    }
    if (type === 'vector<int>' || type === 'vector<char>' || type === 'vector<double>' || type === 'vector<long long>') {
      const isChar = type.includes('char');
      const printVal = isChar ? `"'\\"" << ${varName}[_i] << "'\\""` : `${varName}[_i]`;
      return `cout << "["; for(int _i=0;_i<${varName}.size();_i++){if(_i>0)cout<<",";cout<<${printVal};}cout<<"]"<<endl;`;
    }
    if (type === 'vector<string>') return `cout << "["; for(int _i=0;_i<${varName}.size();_i++){if(_i>0)cout<<",";cout<<"\\\""<<${varName}[_i]<<"\\\"";}cout<<"]"<<endl;`;
    if (type === 'string') return `cout << "\\\""<<${varName}<<"\\\""<<endl;`;
    if (type === 'void') return `// void`;
    return `cout << ${varName} << endl;`;
  };

  let tcBlocks = '';
  for (let t = 0; t < testCases.length; t++) {
    let inputArgs;
    try { inputArgs = JSON.parse(testCases[t].input); if (!Array.isArray(inputArgs)) inputArgs = [inputArgs]; }
    catch { inputArgs = [testCases[t].input]; }

    let decls = '', args = '';
    for (let i = 0; i < inputArgs.length; i++) {
      const param = params[i] || '';
      let varType = param.replace('&', '').trim();
      const lastSpace = varType.lastIndexOf(' ');
      if (lastSpace > 0) {
        varType = varType.substring(0, lastSpace).trim();
      }
      if (!varType || varType === 'const') varType = 'auto';

      if (param.includes('ListNode*')) {
        decls += `      ListNode* _a${i} = buildLinkedList(${convertToCpp(inputArgs[i], 'vector<int>')});\n`;
      } else if (param.includes('TreeNode*')) {
        decls += `      TreeNode* _a${i} = buildTree(${convertToCpp(inputArgs[i], 'TreeNode*')});\n`;
      } else {
        decls += `      ${varType} _a${i} = ${convertToCpp(inputArgs[i], varType)};\n`;
      }
      args += (i > 0 ? ', ' : '') + `_a${i}`;
    }

    let callAndPrint;
    if (retType === 'void') {
      callAndPrint = `${hasClass ? '_sol.' : ''}${fnName}(${args});\n`;
      if (params.length > 0) {
        let firstParamType = params[0].replace('&', '').trim();
        const lastSpace = firstParamType.lastIndexOf(' ');
        if (lastSpace > 0) {
          firstParamType = firstParamType.substring(0, lastSpace).trim();
        }
        callAndPrint += `      ${printResult('_a0', firstParamType)}`;
      }
    } else {
      callAndPrint = `auto _r = ${hasClass ? '_sol.' : ''}${fnName}(${args});\n      ${printResult('_r', retType)}`;
    }

    tcBlocks += `
    // Test Case ${t + 1}
    {
      auto _tc_start = chrono::high_resolution_clock::now();
      try {
${hasClass ? '      Solution _sol;\n' : ''}${decls}      ${callAndPrint}
      } catch(const exception& e) { cerr << "RUNTIME_ERROR: " << e.what() << endl; cout << "ERROR" << endl; }
      auto _tc_end = chrono::high_resolution_clock::now();
      cout << "${TIME_PREFIX}" << chrono::duration_cast<chrono::microseconds>(_tc_end - _tc_start).count() << endl;
    }
    ${t < testCases.length - 1 ? `cout << "${TC_SEP}" << endl;` : ''}
`;
  }

  return `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <stack>
#include <queue>
#include <climits>
#include <cmath>
#include <numeric>
#include <chrono>
using namespace std;

${DS_HELPERS.cpp}

// ===USER_CODE_START===
${userCode}

int main() {
${tcBlocks}
    return 0;
}
`;
}

function wrapPython(userCode, testCases, metaData) {
  const hasClass = userCode.includes('class Solution');
  let fnName = 'solve';
  if (metaData && metaData.name) {
    fnName = metaData.name;
  } else {
    if (hasClass) {
      const fnMatch = userCode.match(/def\s+(\w+)\s*\(\s*self/);
      if (fnMatch) fnName = fnMatch[1];
    } else {
      const fnMatch = userCode.match(/def\s+(\w+)\s*\(/);
      if (fnMatch) fnName = fnMatch[1];
    }
  }

  const convertToPython = (val) => {
    if (val === null) return 'None';
    if (val === true) return 'True';
    if (val === false) return 'False';
    if (Array.isArray(val)) {
      return `[${val.map(convertToPython).join(', ')}]`;
    }
    if (typeof val === 'object') {
      const items = Object.entries(val).map(([k, v]) => `${JSON.stringify(k)}: ${convertToPython(v)}`);
      return `{${items.join(', ')}}`;
    }
    return JSON.stringify(val);
  };

  let tcBlocks = '';
  for (let t = 0; t < testCases.length; t++) {
    let inputArgs;
    try { inputArgs = JSON.parse(testCases[t].input); if (!Array.isArray(inputArgs)) inputArgs = [inputArgs]; }
    catch { inputArgs = [testCases[t].input]; }

    let decls = '';
    const argsList = [];
    inputArgs.forEach((arg, idx) => {
      const isList = userCode.includes('ListNode') && Array.isArray(arg);
      const isTree = userCode.includes('TreeNode') && Array.isArray(arg) && !isList;
      if (isList) {
        decls += `    _a${idx} = buildLinkedList(${convertToPython(arg)})\n`;
      } else if (isTree) {
        decls += `    _a${idx} = buildTree(${convertToPython(arg)})\n`;
      } else {
        decls += `    _a${idx} = ${convertToPython(arg)}\n`;
      }
      argsList.push(`_a${idx}`);
    });

    const argsStr = argsList.join(', ');

    tcBlocks += `
_tc_start = __import__('time').perf_counter_ns()
try:
${decls}    ${hasClass ? `_sol = Solution()\n    _r = _sol.${fnName}(${argsStr})` : `_r = ${fnName}(${argsStr})`}
    if _r is None and ${inputArgs.length > 0 ? 'True' : 'False'}:
        _r = _a0
    if isinstance(_r, ListNode): printLinkedList(_r)
    elif isinstance(_r, TreeNode): printTree(_r)
    elif isinstance(_r, bool): print(str(_r).lower())
    elif isinstance(_r, list) or isinstance(_r, dict): import json; print(json.dumps(_r))
    else: print(_r)
except Exception as e:
    import sys; print(f"RUNTIME_ERROR: {e}", file=sys.stderr); print("ERROR")
_tc_end = __import__('time').perf_counter_ns()
print(f"${TIME_PREFIX}{(_tc_end - _tc_start) // 1000}")
${t < testCases.length - 1 ? `print("${TC_SEP}")` : ''}
`;
  }

  return `${DS_HELPERS.python}

# ===USER_CODE_START===
${userCode}

${tcBlocks}
`;
}

function wrapJavaScript(userCode, testCases, metaData) {
  const hasClass = userCode.includes('class Solution');
  let fnName = 'solve';
  if (metaData && metaData.name) {
    fnName = metaData.name;
  } else {
    if (hasClass) {
      const methodMatch = userCode.match(/class\s+Solution[\s\S]*?(\w+)\s*\([^)]*\)\s*\{/);
      if (methodMatch) fnName = methodMatch[1];
    } else {
      let fnMatch = userCode.match(/(?:var|let|const)\s+(\w+)\s*=\s*function/);
      if (!fnMatch) fnMatch = userCode.match(/function\s+(\w+)\s*\(/);
      if (!fnMatch) fnMatch = userCode.match(/(?:var|let|const)\s+(\w+)\s*=\s*(?:\([^)]*\)|[\w]+)\s*=>/);
      if (fnMatch) fnName = fnMatch[1];
    }
  }

  let tcBlocks = '';
  for (let t = 0; t < testCases.length; t++) {
    let inputArgs;
    try { inputArgs = JSON.parse(testCases[t].input); if (!Array.isArray(inputArgs)) inputArgs = [inputArgs]; }
    catch { inputArgs = [testCases[t].input]; }

    let decls = '';
    const argsList = [];
    inputArgs.forEach((arg, idx) => {
      const isList = userCode.includes('ListNode') && Array.isArray(arg);
      const isTree = userCode.includes('TreeNode') && Array.isArray(arg) && !isList;
      if (isList) {
        decls += `    const _a${idx} = buildLinkedList(${JSON.stringify(arg)});\n`;
      } else if (isTree) {
        decls += `    const _a${idx} = buildTree(${JSON.stringify(arg)});\n`;
      } else {
        decls += `    const _a${idx} = ${JSON.stringify(arg)};\n`;
      }
      argsList.push(`_a${idx}`);
    });

    const argsStr = argsList.join(', ');
    tcBlocks += `
{
  const _tc_start = process.hrtime.bigint();
  try {
    ${decls}    let _r = ${hasClass ? `new Solution().${fnName}(${argsStr})` : `${fnName}(${argsStr})`};
    if (_r === undefined && ${inputArgs.length > 0 ? 'true' : 'false'}) {
      _r = _a0;
    }
    if (_r instanceof ListNode) {
      printLinkedList(_r);
    } else if (_r instanceof TreeNode) {
      printTree(_r);
    } else {
      console.log(typeof _r === 'object' ? JSON.stringify(_r) : String(_r));
    }
  } catch(e) { console.error("RUNTIME_ERROR: " + e.message); console.log("ERROR"); }
  const _tc_end = process.hrtime.bigint();
  console.log("${TIME_PREFIX}" + Number((_tc_end - _tc_start) / 1000n));
}
${t < testCases.length - 1 ? `console.log("${TC_SEP}");` : ''}
`;
  }

  return `${DS_HELPERS.javascript}\n// ===USER_CODE_START===\n${userCode}\n${tcBlocks}`;
}

function wrapJava(userCode, testCases, metaData) {
  let methodName = 'solve', retType = 'int';
  let paramTypes = [];
  if (metaData && metaData.name) {
    methodName = metaData.name;
    const typeMap = { 'integer': 'int', 'integer[]': 'int[]', 'integer[][]': 'int[][]', 'string': 'String', 'string[]': 'String[]', 'boolean': 'boolean', 'list': 'ListNode', 'tree': 'TreeNode', 'void': 'void' };
    retType = typeMap[metaData.return?.type] || 'int';
    paramTypes = (metaData.params || []).map(p => typeMap[p.type] || 'int');
  } else {
    const methodMatch = userCode.match(/public\s+(\w[\w<>\[\]]*)\s+(\w+)\s*\(/);
    if (methodMatch) {
      retType = methodMatch[1];
      methodName = methodMatch[2];
    } else {
      const fallbackMatch = userCode.match(/public\s+\w[\w<>\[\]]*\s+(\w+)\s*\(/);
      methodName = fallbackMatch ? fallbackMatch[1] : 'solve';
      const retMatch = userCode.match(/public\s+(int|boolean|void|int\[\]|String\[\]|int\[\]\[\]|String|double|long|List<List<Integer>>|List<List<String>>|List<Integer>|List<String>|ListNode|TreeNode)\s+\w+\s*\(/);
      retType = retMatch ? retMatch[1] : 'int';
    }

    const sigMatch = userCode.match(/public\s+\w[\w<>\[\]]*\s+\w+\s*\(([^)]*)\)/);
    if (sigMatch) {
      const paramsStr = sigMatch[1];
      paramTypes = paramsStr.split(',').map(p => {
        const parts = p.trim().split(/\s+/);
        return parts.slice(0, -1).join(' ').trim();
      }).filter(Boolean);
    }
  }

  const toJava = (v, type = 'int') => {
    if (v === null) return 'null';
    if (type === 'String') return `"${v}"`;
    if (type === 'boolean') return String(v);
    if (type === 'int[]' || type === 'double[]' || type === 'long[]') {
      const baseType = type.replace('[]', '');
      return `new ${baseType}[]{${v.join(',')}}`;
    }
    if (type === 'String[]') {
      return `new String[]{${v.map(s => s === null ? "null" : `"${s}"`).join(',')}}`;
    }
    if (type === 'char[]') {
      return `new char[]{${v.map(c => `'${c}'`).join(',')}}`;
    }
    if (type === 'int[][]' || type === 'double[][]' || type === 'long[][]') {
      const baseType = type.replace('[][]', '');
      return `new ${baseType}[][]{${v.map(row => `new ${baseType}[]{${row.join(',')}}`).join(',')}}`;
    }
    if (type === 'String[][]') {
      return `new String[][]{${v.map(row => `new String[]{${row.map(s => s === null ? "null" : `"${s}"`).join(',')}}`).join(',')}}`;
    }
    if (type.startsWith('List<') || type.startsWith('ArrayList<')) {
      if (Array.isArray(v)) {
        if (v.length === 0) return `new ArrayList<>()`;
        if (Array.isArray(v[0])) {
          const innerMatch = type.match(/List<([^>]+)>/);
          const innerType = innerMatch ? innerMatch[1].trim() : 'List<Integer>';
          return `new ArrayList<>(Arrays.asList(${v.map(row => toJava(row, innerType)).join(',')}))`;
        } else {
          const innerMatch = type.match(/List<([^>]+)>/);
          const innerType = innerMatch ? innerMatch[1].trim() : 'Integer';
          const baseValues = v.map(item => {
            if (innerType === 'Integer' || innerType === 'Double' || innerType === 'Long') return String(item);
            if (innerType === 'String') return `"${item}"`;
            if (innerType === 'Boolean') return String(item);
            return String(item);
          }).join(',');
          return `new ArrayList<>(Arrays.asList(${baseValues}))`;
        }
      }
    }
    return String(v);
  };

  const getJavaPrintStatement = (varName, type) => {
    if (type === 'ListNode') return `printLinkedList(${varName});`;
    if (type === 'TreeNode') return `printTree(${varName});`;
    if (type.endsWith('[][]')) return `System.out.println(java.util.Arrays.deepToString(${varName}).replace(" ", ""));`;
    if (type.endsWith('[]')) return `System.out.println(java.util.Arrays.toString(${varName}).replace(" ", ""));`;
    if (type === 'boolean') return `System.out.println(${varName} ? "true" : "false");`;
    return `System.out.println(${varName});`;
  };

  let tcBlocks = '';
  for (let t = 0; t < testCases.length; t++) {
    let inputArgs;
    try { inputArgs = JSON.parse(testCases[t].input); if (!Array.isArray(inputArgs)) inputArgs = [inputArgs]; }
    catch { inputArgs = [testCases[t].input]; }

    let decls = '';
    const argsList = [];
    inputArgs.forEach((arg, idx) => {
      const paramType = paramTypes[idx] || 'int';
      const isList = paramType.includes('ListNode') || (userCode.includes('ListNode') && Array.isArray(arg));
      const isTree = paramType.includes('TreeNode') || (userCode.includes('TreeNode') && Array.isArray(arg) && !isList);
      
      const varName = `_a${idx}`;
      if (isList) {
        decls += `          ListNode ${varName} = buildLinkedList(${toJava(arg, 'int[]')});\n`;
      } else if (isTree) {
        const javaStringArray = `new String[]{${arg.map(v => v === null ? "\"null\"" : `"${v}"`).join(',')}}`;
        decls += `          TreeNode ${varName} = buildTree(${javaStringArray});\n`;
      } else {
        decls += `          ${paramType} ${varName} = ${toJava(arg, paramType)};\n`;
      }
      argsList.push(varName);
    });

    const argsStr = argsList.join(', ');
    const printResult = retType === 'void'
      ? (paramTypes.length > 0 ? getJavaPrintStatement('_a0', paramTypes[0]) : '')
      : getJavaPrintStatement('_r', retType);

    tcBlocks += `
      {
        long _tc_start = System.nanoTime();
        try {
          Solution sol = new Solution();
${decls}          ${retType === 'void' ? `sol.${methodName}(${argsStr});\n          ${printResult}` : `var _r = sol.${methodName}(${argsStr});\n          ${printResult}`}
        } catch(Exception e) { System.err.println("RUNTIME_ERROR: " + e.getMessage()); System.out.println("ERROR"); }
        long _tc_end = System.nanoTime();
        System.out.println("${TIME_PREFIX}" + ((_tc_end - _tc_start) / 1000));
      }
      ${t < testCases.length - 1 ? `System.out.println("${TC_SEP}");` : ''}
`;
  }

  return `
import java.util.*;

${DS_HELPERS.java}

// ===USER_CODE_START===
${userCode}

class Main {
    // Java Deserialization and Print Helpers
    public static ListNode buildLinkedList(int[] arr) {
        if (arr == null || arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for (int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }

    public static void printLinkedList(ListNode head) {
        List<Integer> res = new ArrayList<>();
        ListNode curr = head;
        while (curr != null) {
            res.add(curr.val);
            curr = curr.next;
        }
        System.out.println(res.toString().replace(" ", ""));
    }

    public static TreeNode buildTree(String[] arr) {
        if (arr == null || arr.length == 0 || arr[0].equals("null")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(arr[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < arr.length) {
            TreeNode curr = q.poll();
            if (i < arr.length && !arr[i].equals("null")) {
                curr.left = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.left);
            }
            i++;
            if (i < arr.length && !arr[i].equals("null")) {
                curr.right = new TreeNode(Integer.parseInt(arr[i]));
                q.add(curr.right);
            }
            i++;
        }
        return root;
    }

    public static void printTree(TreeNode root) {
        if (root == null) {
            System.out.println("[]");
            return;
        }
        List<String> res = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode curr = q.poll();
            if (curr != null) {
                res.add(String.valueOf(curr.val));
                q.add(curr.left);
                q.add(curr.right);
            } else {
                res.add("null");
            }
        }
        while (!res.isEmpty() && res.get(res.size() - 1).equals("null")) {
            res.remove(res.size() - 1);
        }
        System.out.println(res.toString().replace(" ", ""));
    }

    public static void main(String[] args) {
        ${tcBlocks}
    }
}
`;
}

function wrapGo(userCode, testCases, metaData) {
  let fnName = 'solve', retType = 'int', params = [];
  if (metaData && metaData.name) {
    fnName = metaData.name;
    const typeMap = { 'integer': 'int', 'integer[]': '[]int', 'integer[][]': '[][]int', 'string': 'string', 'string[]': '[]string', 'boolean': 'bool', 'void': 'void' };
    retType = typeMap[metaData.return?.type] || 'int';
    params = metaData.params.map(p => `${typeMap[p.type] || 'int'}`);
  } else {
    // Basic regex match for Go function: e.g. func twoSum(nums []int, target int) []int
    const fnMatch = userCode.match(/func\s+(\w+)\s*\(/);
    fnName = fnMatch ? fnMatch[1] : 'solve';
    // Try to extract return type
    const retMatch = userCode.match(/func\s+\w+\s*\([^)]*\)\s*([a-zA-Z0-9_\[\]\*]+)/);
    retType = retMatch ? retMatch[1] : 'int';
  }

  // Convert JS value to Go syntax literal
  const convertToGo = (val, typeStr) => {
    if (val === null) return 'nil';
    if (val === true) return 'true';
    if (val === false) return 'false';
    if (Array.isArray(val)) {
      let goType = '[]int';
      if (typeStr) {
        const typeMap = {
          'integer[]': '[]int',
          'integer[][]': '[][]int',
          'string[]': '[]string',
          'string[][]': '[][]string',
          'boolean[]': '[]bool',
          '[]int': '[]int',
          '[][]int': '[][]int',
          '[]string': '[]string',
          '[]bool': '[]bool'
        };
        goType = typeMap[typeStr] || typeStr || '[]int';
      } else {
        if (val.length > 0) {
          if (typeof val[0] === 'string') goType = '[]string';
          else if (typeof val[0] === 'boolean') goType = '[]bool';
          else if (Array.isArray(val[0])) goType = '[][]int';
        }
      }
      const innerType = typeStr && typeStr.endsWith('[]') ? typeStr.slice(0, -2) : (goType.startsWith('[]') ? goType.slice(2) : null);
      return `${goType}{${val.map(v => convertToGo(v, innerType)).join(', ')}}`;
    }
    if (typeof val === 'string') return `"${val}"`;
    return String(val);
  };

  let tcBlocks = '';
  for (let t = 0; t < testCases.length; t++) {
    let inputArgs;
    try { inputArgs = JSON.parse(testCases[t].input); if (!Array.isArray(inputArgs)) inputArgs = [inputArgs]; }
    catch { inputArgs = [testCases[t].input]; }

    let argsList = [];
    inputArgs.forEach((arg, idx) => {
      const typeStr = params[idx] || null;
      argsList.push(convertToGo(arg, typeStr));
    });

    const argsStr = argsList.join(', ');

    let printResult = '';
    if (retType === 'void') {
      printResult = `${fnName}(${argsStr})\n        fmt.Println("\"void\"")`;
    } else {
      printResult = `_r := ${fnName}(${argsStr})\n        _bytes, _ := json.Marshal(_r)\n        fmt.Println(string(_bytes))`;
    }

    tcBlocks += `
    // Test Case ${t + 1}
    {
        _start := time.Now()
        ${printResult}
        _dur := time.Since(_start).Nanoseconds() / 1000
        fmt.Printf("${TIME_PREFIX}%d\\n", _dur)
    }
    ${t < testCases.length - 1 ? `fmt.Println("${TC_SEP}")` : ''}
`;
  }

  return `
package main

import (
    "fmt"
    "time"
    "encoding/json"
)

// ===USER_CODE_START===
${userCode}

func main() {
${tcBlocks}
}
`;
}

function wrapRust(userCode, testCases, metaData) {
  let fnName = 'solve', retType = 'i32', params = [];
  if (metaData && metaData.name) {
    fnName = metaData.name;
    const typeMap = { 'integer': 'i32', 'integer[]': 'Vec<i32>', 'integer[][]': 'Vec<Vec<i32>>', 'string': 'String', 'string[]': 'Vec<String>', 'boolean': 'bool', 'void': '()' };
    retType = typeMap[metaData.return?.type] || 'i32';
    params = metaData.params.map(p => `${typeMap[p.type] || 'i32'}`);
  } else {
    // Basic regex match for Rust function: e.g. pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32>
    const fnMatch = userCode.match(/fn\s+(\w+)\s*\(/);
    fnName = fnMatch ? fnMatch[1] : 'solve';
    // Try to extract return type
    const retMatch = userCode.match(/fn\s+\w+\s*\([^)]*\)\s*->\s*([a-zA-Z0-9_<>:\[\]]+)/);
    retType = retMatch ? retMatch[1].trim() : 'i32';
  }

  const convertToRust = (val, typeStr) => {
    if (val === null) return 'None';
    if (val === true) return 'true';
    if (val === false) return 'false';
    if (Array.isArray(val)) {
      const innerType = typeStr && typeStr.startsWith('Vec<') ? typeStr.slice(4, -1) : null;
      return `vec![${val.map(v => convertToRust(v, innerType)).join(', ')}]`;
    }
    if (typeof val === 'string') return `String::from("${val}")`;
    return String(val);
  };

  let tcBlocks = '';
  for (let t = 0; t < testCases.length; t++) {
    let inputArgs;
    try { inputArgs = JSON.parse(testCases[t].input); if (!Array.isArray(inputArgs)) inputArgs = [inputArgs]; }
    catch { inputArgs = [testCases[t].input]; }

    let argsList = [];
    inputArgs.forEach((arg, idx) => {
      const typeStr = params[idx] || null;
      argsList.push(convertToRust(arg, typeStr));
    });

    const argsStr = argsList.join(', ');

    let printResult = '';
    if (retType === '()') {
      printResult = `${fnName}(${argsStr});\n        println!("\\"void\\"");`;
    } else if (retType === 'Vec<i32>' || retType === 'Vec<Vec<i32>>' || retType === 'Vec<String>' || retType === 'bool') {
      const printFunc = retType === 'Vec<i32>' ? 'print_vec_int' : (retType === 'Vec<Vec<i32>>' ? 'print_vec_vec_int' : (retType === 'Vec<String>' ? 'print_vec_string' : 'print_bool'));
      printResult = `let _r = ${fnName}(${argsStr});\n        ${printFunc}(&_r);`;
    } else if (retType === 'String') {
      printResult = `let _r = ${fnName}(${argsStr});\n        println!("\\"{}\\"", _r);`;
    } else {
      printResult = `let _r = ${fnName}(${argsStr});\n        println!("{}", _r);`;
    }

    tcBlocks += `
    // Test Case ${t + 1}
    {
        let _start = std::time::Instant::now();
        ${printResult}
        let _dur = _start.elapsed().as_micros();
        println!("${TIME_PREFIX}{}", _dur);
    }
    ${t < testCases.length - 1 ? `println!("${TC_SEP}");` : ''}
`;
  }

  const helperFunctions = `
fn print_vec_int(v: &Vec<i32>) {
    print!("[");
    for (i, x) in v.iter().enumerate() {
        if i > 0 { print!(","); }
        print!("{}", x);
    }
    println!("]");
}

fn print_vec_vec_int(v: &Vec<Vec<i32>>) {
    print!("[");
    for (i, row) in v.iter().enumerate() {
        if i > 0 { print!(","); }
        print!("[");
        for (j, x) in row.iter().enumerate() {
            if j > 0 { print!(","); }
            print!("{}", x);
        }
        print!("]");
    }
    println!("]");
}

fn print_vec_string(v: &Vec<String>) {
    print!("[");
    for (i, x) in v.iter().enumerate() {
        if i > 0 { print!(","); }
        print!("\"{}\"", x);
    }
    println!("]");
}

fn print_bool(b: &bool) {
    println!("{}", if *b { "true" } else { "false" });
}
`;

  return `
// ===USER_CODE_START===
${userCode}

${helperFunctions}

fn main() {
${tcBlocks}
}
`;
}

// ─── Wrap code for all test cases ───
export function wrapAllTestCases(code, testCases, language, metaData) {
  switch (language) {
    case 'cpp': return wrapCpp(code, testCases, metaData);
    case 'python': return wrapPython(code, testCases, metaData);
    case 'javascript': return wrapJavaScript(code, testCases, metaData);
    case 'java': return wrapJava(code, testCases, metaData);
    case 'go': return wrapGo(code, testCases, metaData);
    case 'rust': return wrapRust(code, testCases, metaData);
    default: return code;
  }
}

// ─── Run code inside Docker container ───
function runInDocker(code, language, timeLimit) {
  return new Promise((resolve) => {
    const image = DOCKER_IMAGES[language];
    if (!image) {
      resolve({ stdout: '', stderr: `Unsupported language: ${language}`, exitCode: 1, timedOut: false, elapsed: 0 });
      return;
    }

    // Build the compile+run command that executes inside the container
    const memCheck = `; echo -n "${MEM_SEP}"; if [ -f /sys/fs/cgroup/memory.peak ]; then cat /sys/fs/cgroup/memory.peak; else echo -n "0"; fi`;
    let cmd, shell;
    const memPart = `echo -n "${MEM_SEP}"; if [ -f /sys/fs/cgroup/memory.peak ]; then cat /sys/fs/cgroup/memory.peak; else echo -n "0"; fi`;
    switch (language) {
      case 'cpp':
        cmd = `cat > /tmp/s.cpp && g++ -O0 -std=c++17 -o /tmp/s /tmp/s.cpp && { timeout ${timeLimit} /tmp/s; _X=$?; } || _X=$?; ${memPart}; exit $_X`;
        shell = 'bash';
        break;
      case 'python':
        cmd = `{ cat > /tmp/s.py && timeout ${timeLimit} python3 /tmp/s.py; _X=$?; } || _X=$?; ${memPart}; exit $_X`;
        shell = 'bash';
        break;
      case 'java':
        cmd = `{ cat > /tmp/Main.java && javac /tmp/Main.java 2>&1 && timeout ${timeLimit} java -cp /tmp Main; _X=$?; } || _X=$?; ${memPart}; exit $_X`;
        shell = 'sh';
        break;
      case 'javascript':
        cmd = `{ cat > /tmp/s.js && timeout ${timeLimit} node /tmp/s.js; _X=$?; } || _X=$?; ${memPart}; exit $_X`;
        shell = 'bash';
        break;
      case 'go':
        cmd = `{ cat > /tmp/s.go && timeout ${timeLimit} go run /tmp/s.go; _X=$?; } || _X=$?; ${memPart}; exit $_X`;
        shell = 'sh';
        break;
      case 'rust':
        cmd = `cat > /tmp/s.rs && rustc -C opt-level=3 -o /tmp/s /tmp/s.rs && { timeout ${timeLimit} /tmp/s; _X=$?; } || _X=$?; ${memPart}; exit $_X`;
        shell = 'sh';
        break;
    }

    const args = [
      'run', '--rm', '-i',
      '--network', 'none',                  // No internet access
      '--memory=256m',                       // 256MB RAM limit
      '--pids-limit=64',                     // Fork bomb protection
      '--cpus=1',                            // 1 CPU core
      '--read-only',                         // Immutable root filesystem
      '--tmpfs', '/tmp:size=50m,rw,exec',    // Size-limited writable scratch area
      '--cap-drop=ALL',                      // Drop ALL Linux capabilities
      '--security-opt=no-new-privileges',    // Block setuid/setgid escalation
      image,
      shell, '-c', cmd
    ];

    const startTime = Date.now();
    let stdout = '', stderr = '';
    let finished = false;

    const proc = spawn('docker', args, {
      timeout: (timeLimit + 15) * 1000, // Extra buffer for Docker startup
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    const finish = (exitCode) => {
      if (finished) return;
      finished = true;
      resolve({
        stdout, stderr,
        exitCode: exitCode || 0,
        timedOut: exitCode === 124 || exitCode === 143 || (Date.now() - startTime > (timeLimit + 10) * 1000),
        elapsed: Date.now() - startTime,
      });
    };

    proc.on('close', (code) => finish(code));
    proc.on('error', (err) => {
      stderr += err.message;
      finish(1);
    });

    // Pipe user code into the container's stdin
    proc.stdin.write(code);
    proc.stdin.end();
  });
}
function adjustCompileErrorLines(output, language, lineOffset) {
  if (!lineOffset) return output;
  const lines = output.split('\n');
  const adjustedLines = lines.map(line => {
    let newLine = line;
    if (language === 'cpp') {
      // Pattern: /tmp/s.cpp:118:5:
      newLine = line.replace(/\/tmp\/[a-zA-Z0-9_-]+\.cpp:(\d+):(\d+):/, (match, p1, p2) => {
        const adjusted = parseInt(p1) - lineOffset;
        return `Line ${adjusted}: Char ${p2}:`;
      });
    } else if (language === 'java') {
      // Pattern: /tmp/Main.java:5: or /tmp/1234_abc/Main.java:5:
      newLine = line.replace(/\/tmp\/[a-zA-Z0-9_./]+\/Main\.java:(\d+):/, (match, p1) => {
        const adjusted = parseInt(p1) - lineOffset;
        return `Line ${adjusted}:`;
      }).replace(/\/tmp\/Main\.java:(\d+):/, (match, p1) => {
        const adjusted = parseInt(p1) - lineOffset;
        return `Line ${adjusted}:`;
      });
    } else if (language === 'python') {
      // Pattern: File "/tmp/s.py", line 12
      newLine = line.replace(/File "\/tmp\/[a-zA-Z0-9_-]+\.py", line (\d+)/, (match, p1) => {
        const adjusted = parseInt(p1) - lineOffset;
        return `Line ${adjusted}`;
      });
    } else if (language === 'javascript') {
      // Pattern: /tmp/s.js:12
      newLine = line.replace(/\/tmp\/[a-zA-Z0-9_-]+\.js:(\d+)/, (match, p1) => {
        const adjusted = parseInt(p1) - lineOffset;
        return `Line ${adjusted}`;
      });
    }

    // Adjust lines in caret traceback snippet blocks, e.g. "  118 |     } // Missing semicolon"
    newLine = newLine.replace(/^(\s*)(\d+)(\s*\|)/, (match, p1, p2, p3) => {
      const adjusted = parseInt(p2) - lineOffset;
      return `${p1}${adjusted}${p3}`;
    });

    // Replace the random temp path with Solution.cpp for clean aesthetics
    newLine = newLine.replace(/\/tmp\/[a-zA-Z0-9_-]+\.cpp/g, 'solution.cpp');
    newLine = newLine.replace(/\/tmp\/[a-zA-Z0-9_-]+\.py/g, 'solution.py');
    newLine = newLine.replace(/\/tmp\/[a-zA-Z0-9_-]+\.js/g, 'solution.js');
    newLine = newLine.replace(/\/tmp\/[a-zA-Z0-9_./]+\/Main\.java/g, 'Solution.java');
    newLine = newLine.replace(/\/tmp\/Main\.java/g, 'Solution.java');

    return newLine;
  });
  return adjustedLines.join('\n');
}

let isDockerAvailable = null;
let dockerLastChecked = 0;
const DOCKER_RECHECK_MS = 30000; // Re-check Docker availability every 30s after failure

// ─── Unified Parser for Sandbox Execution Results ───
function parseExecutionResults(stdout, stderr, exitCode, timedOut, elapsed, testCases, timeLimit, options = {}) {
  const failFast = options.failFast !== false;
  const results = {
    status: 'Accepted',
    testCasesPassed: 0,
    totalTestCases: testCases.length,
    executionTime: 0,
    memoryUsed: 0,
    errors: [],
    outputs: [],
  };

  // Clean peak memory tags out of standard output first
  const cleanStdout = stdout.split(MEM_SEP)[0] || '';

  // Handle compilation and initial parsing errors (both stdout and stderr combined due to Java 2>&1 redirection)
  const combinedOutput = (cleanStdout + '\n' + stderr).trim();
  const errText = combinedOutput.toLowerCase();
  const isCompileError = exitCode !== 0 && (
    errText.includes('error:') || 
    errText.includes('syntaxerror') ||
    errText.includes('indentationerror') ||
    errText.includes('taberror') ||
    errText.includes('cannot find symbol') ||
    errText.includes('compilation') ||
    errText.includes('invalid syntax') ||
    errText.includes('syntax error') ||
    errText.includes('javac') ||
    errText.includes('g++') ||
    errText.includes('rustc') ||
    errText.includes('undefined reference') ||
    (errText.includes('symbol:') && errText.includes('location:')) ||
    errText.includes('/tmp/main.java:') ||
    errText.includes('/tmp/s.cpp:') ||
    errText.includes('class main is public, should be declared')
  );

  if (isCompileError) {
    let lineOffset = 0;
    if (options.wrappedCode) {
      const index = options.wrappedCode.indexOf('===USER_CODE_START===');
      if (index !== -1) {
        const headerPart = options.wrappedCode.substring(0, index);
        lineOffset = headerPart.split('\n').length - 1;
      }
    }

    const adjustedOutput = adjustCompileErrorLines(combinedOutput, options.language || '', lineOffset);

    results.status = 'Compilation Error';
    results.compile_output = adjustedOutput;
    results.errors.push(adjustedOutput.substring(0, 1000));
    for (let i = 0; i < testCases.length; i++) {
      results.outputs.push({
        testCase: i + 1, passed: false,
        error: adjustedOutput.substring(0, 500) || results.status,
        executionTime: 0,
      });
    }
    return results;
  }

  // Parse peak memory usage if MEM_SEP is present
  let peakMemoryBytes = 0;
  if (stdout.includes(MEM_SEP)) {
    const parts = stdout.split(MEM_SEP);
    const memStr = (parts[1] || '').trim();
    const bytes = parseInt(memStr, 10);
    if (!isNaN(bytes) && bytes > 0) {
      peakMemoryBytes = bytes;
    }
  }

  // Extract per-test-case output parts
  const outputParts = cleanStdout.split(TC_SEP).map(s => s.trim());

  // Helper to extract timing from a single testcase output
  const extractTiming = (outputStr, defaultTime) => {
    const timeMatch = outputStr.match(new RegExp(`${TIME_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d+)`));
    if (timeMatch) {
      const microseconds = parseInt(timeMatch[1], 10);
      const cleanOutput = outputStr.replace(new RegExp(`${TIME_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+\\s*`), '').trim();
      return { time: Math.round(microseconds / 1000), output: cleanOutput };
    }
    return { time: defaultTime, output: outputStr.trim() };
  };

  const defaultTcTime = Math.round((timedOut ? timeLimit * 1000 : elapsed) / testCases.length);
  let totalRealTime = 0;
  let firstFailFastIndex = -1;

  for (let i = 0; i < testCases.length; i++) {
    const expectedOutput = (testCases[i].expectedOutput || '').trim();
    
    // Check if we have output for this test case
    const hasOutput = i < outputParts.length && outputParts[i] !== '';
    const rawOutput = hasOutput ? outputParts[i] : '';
    const { time: tcTime, output: actualOutput } = extractTiming(rawOutput, defaultTcTime);

    totalRealTime += tcTime;

    // Determine if this case or any previous case failed fast/was skipped
    if (firstFailFastIndex !== -1) {
      results.outputs.push({
        testCase: i + 1, passed: false,
        input: testCases[i].input,
        expectedOutput,
        actualOutput: '',
        error: 'Skipped due to previous failure',
        executionTime: 0,
      });
      continue;
    }

    if (timedOut && !hasOutput) {
      // This test case caused the timeout
      if (results.status === 'Accepted') results.status = 'Time Limit Exceeded';
      results.errors.push(`Test case ${i + 1}: Time Limit Exceeded`);
      results.outputs.push({
        testCase: i + 1, passed: false,
        input: testCases[i].input,
        expectedOutput,
        actualOutput: '',
        error: 'Time Limit Exceeded',
        executionTime: timeLimit * 1000,
      });
      if (failFast) {
        firstFailFastIndex = i;
      }
    } else if (exitCode !== 0 && !hasOutput) {
      // This test case caused a runtime crash
      if (results.status === 'Accepted') results.status = 'Runtime Error';
      results.errors.push(`Test case ${i + 1}: Runtime Error / Process Crash`);
      results.outputs.push({
        testCase: i + 1, passed: false,
        input: testCases[i].input,
        expectedOutput,
        actualOutput: '',
        error: stderr.trim().substring(0, 500) || 'Process Crash',
        executionTime: tcTime,
      });
      if (failFast) {
        firstFailFastIndex = i;
      }
    } else if (actualOutput === 'ERROR' || actualOutput.includes('RUNTIME_ERROR')) {
      // Caught runtime error in execution block
      if (results.status === 'Accepted') results.status = 'Runtime Error';
      results.errors.push(`Test case ${i + 1}: Runtime Error`);
      results.outputs.push({
        testCase: i + 1, passed: false,
        input: testCases[i].input,
        expectedOutput,
        actualOutput: '',
        error: actualOutput.replace('ERROR', '').trim() || stderr.trim().substring(0, 500) || 'Runtime Error',
        executionTime: tcTime,
      });
      if (failFast) {
        firstFailFastIndex = i;
      }
    } else if (actualOutput.includes(FAIL_FAST_EXIT)) {
      // Early termination triggered in wrapper
      if (results.status === 'Accepted') results.status = 'Wrong Answer';
      results.outputs.push({
        testCase: i + 1, passed: false,
        input: testCases[i].input,
        expectedOutput,
        actualOutput: actualOutput.replace(FAIL_FAST_EXIT, '').trim(),
        error: 'Wrong Answer (Early Terminated)',
        executionTime: tcTime,
      });
      if (failFast) {
        firstFailFastIndex = i;
      }
    } else if (compareOutputs(actualOutput, expectedOutput)) {
      results.testCasesPassed++;
      results.outputs.push({
        testCase: i + 1, passed: true,
        input: testCases[i].input,
        expectedOutput,
        actualOutput,
        executionTime: tcTime,
      });
    } else {
      if (results.status === 'Accepted') results.status = 'Wrong Answer';
      results.outputs.push({
        testCase: i + 1, passed: false,
        input: testCases[i].input,
        expectedOutput,
        actualOutput,
        executionTime: tcTime,
      });
      if (failFast) {
        firstFailFastIndex = i; // Enable LeetCode-style fail-fast on first failure
      }
    }
  }

  // Fallback status assignment if early crash happened without concrete output
  if (results.testCasesPassed < testCases.length && results.status === 'Accepted') {
    results.status = timedOut ? 'Time Limit Exceeded' : (exitCode !== 0 ? 'Runtime Error' : 'Wrong Answer');
  }

  results.executionTime = totalRealTime > 0 ? totalRealTime : Math.round(elapsed);
  results.memoryUsed = peakMemoryBytes > 0 
    ? Math.round((peakMemoryBytes / 1024 / 1024) * 100) / 100 
    : 0;

  return results;
}

// ─── Main entry point (same signature as executeCodeWithJudge0) ───
export async function executeCodeWithDocker(code, testCases, language = 'cpp', timeLimit = 5, metaData = null, options = {}) {
  const results = {
    status: 'Accepted',
    testCasesPassed: 0,
    totalTestCases: testCases.length,
    executionTime: 0,
    memoryUsed: 0,
    errors: [],
    outputs: [],
  };

  // Check Docker availability (with auto-recovery — re-check every 30s after failure)
  if (isDockerAvailable === null || (isDockerAvailable === false && Date.now() - dockerLastChecked > DOCKER_RECHECK_MS)) {
    try {
      await new Promise((resolve, reject) => {
        const p = spawn('docker', ['info'], { timeout: 5000, stdio: ['ignore', 'pipe', 'pipe'] });
        p.on('close', (code) => code === 0 ? resolve() : reject(new Error('Docker not running')));
        p.on('error', () => reject(new Error('Docker not installed')));
      });
      isDockerAvailable = true;
      dockerLastChecked = Date.now();
    } catch (err) {
      isDockerAvailable = false;
      dockerLastChecked = Date.now();
      return { ...results, status: 'Error', errors: [`${err.message}. Install Docker Desktop and ensure it is running.`] };
    }
  } else if (isDockerAvailable === false) {
    return { ...results, status: 'Error', errors: ['Docker not available. Will auto-retry in 30 seconds.'] };
  }

  // ── Concurrency gate — prevent server overload ──
  if (executionSemaphore.pending > 10) {
    return { ...results, status: 'Error', errors: ['Server is busy. Please try again in a few seconds.'] };
  }
  await executionSemaphore.acquire();

  // Check if image exists (pull if not)
  const image = DOCKER_IMAGES[language];
  if (!image) {
    return { ...results, status: 'Error', errors: [`Unsupported language: ${language}`] };
  }

  // ── P0: Code Sanitizer ──
  const sanitizeResult = sanitizeCode(code, language);
  if (!sanitizeResult.safe) {
    return {
      ...results,
      status: 'Compilation Error',
      compile_output: `Security violation: ${sanitizeResult.reason}`,
      errors: [`Security violation: ${sanitizeResult.reason}`]
    };
  }

  // Wrap user code with all test cases
  const wrappedCode = wrapAllTestCases(code, testCases, language, metaData);

  console.log(`\n[Docker Executor] Language: ${language}, Test Cases: ${testCases.length}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Docker Executor] Wrapped Code Preview:', wrappedCode.substring(0, 200) + '...');
  }

  // Execute in Docker — try pool first (fast), fall back to cold docker run
  let execResult;
  try {
    if (poolInitialized && containerPool.has(language)) {
      execResult = await execInPool(wrappedCode, language, timeLimit);
    }
    // Fall back to cold docker run if pool unavailable or failed
    if (!execResult) {
      execResult = await runInDocker(wrappedCode, language, timeLimit);
    }
  } finally {
    executionSemaphore.release();
  }

  const { stdout, stderr, exitCode, timedOut, elapsed } = execResult;

  console.log(`[Docker Executor] Exit: ${exitCode}, Time: ${elapsed}ms, Timed out: ${timedOut}, Pool: ${poolInitialized && containerPool.has(language) ? 'yes' : 'no'}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Docker Executor] Stdout:', stdout.substring(0, 300));
    if (stderr) console.log('[Docker Executor] Stderr:', stderr.substring(0, 300));
  }

  return parseExecutionResults(stdout, stderr, exitCode, timedOut, elapsed, testCases, timeLimit, {
    ...options,
    wrappedCode,
    language
  });
}

// ─── Syntax-Only Checking (no execution, compile-only) ───

function buildSyntaxCheckCode(code, language) {
  let header, footer;

  switch (language) {
    case 'cpp': {
      const includes = [
        '#include <iostream>', '#include <vector>', '#include <string>',
        '#include <algorithm>', '#include <unordered_map>', '#include <unordered_set>',
        '#include <map>', '#include <set>', '#include <stack>', '#include <queue>',
        '#include <climits>', '#include <cmath>', '#include <numeric>',
        'using namespace std;', '',
      ].join('\n');
      header = includes + '\n' + DS_HELPERS.cpp.trim() + '\n\n';
      footer = '\nint main() { return 0; }\n';
      break;
    }
    case 'java': {
      header = 'import java.util.*;\n\n' + DS_HELPERS.java.trim() + '\n\n';
      footer = '\nclass Main {\n    public static void main(String[] args) {}\n}\n';
      break;
    }
    case 'python': {
      header = DS_HELPERS.python.trim() + '\n\n';
      footer = '\n';
      break;
    }
    case 'javascript': {
      header = DS_HELPERS.javascript.trim() + '\n\n';
      footer = '\n';
      break;
    }
    default: {
      header = '';
      footer = '\n';
    }
  }

  const wrappedCode = header + code + footer;
  const lineOffset = header.split('\n').length - 1;
  const userLineCount = code.split('\n').length;

  return { wrappedCode, lineOffset, userLineCount };
}

function parseSyntaxErrors(output, language, lineOffset, userLineCount) {
  const errors = [];
  const lines = output.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;

    if (language === 'cpp') {
      match = line.match(/\/tmp\/s\.cpp:(\d+):(\d+):\s*(error|warning):\s*(.*)/);
      if (match) {
        const adjusted = parseInt(match[1]) - lineOffset;
        if (adjusted >= 1 && adjusted <= userLineCount) {
          errors.push({ line: adjusted, column: parseInt(match[2]), severity: match[3], message: match[4].trim() });
        }
      }
    } else if (language === 'java') {
      match = line.match(/\/tmp\/Main\.java:(\d+):\s*error:\s*(.*)/);
      if (match) {
        const adjusted = parseInt(match[1]) - lineOffset;
        if (adjusted >= 1 && adjusted <= userLineCount) {
          errors.push({ line: adjusted, column: 1, severity: 'error', message: match[2].trim() });
        }
      }
    } else if (language === 'python') {
      match = line.match(/File "\/tmp\/s\.py", line (\d+)/);
      if (match) {
        const adjusted = parseInt(match[1]) - lineOffset;
        let message = 'Syntax Error';
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const errMatch = lines[j].match(/^(SyntaxError|IndentationError|TabError):\s*(.*)/);
          if (errMatch) { message = lines[j].trim(); break; }
        }
        if (adjusted >= 1 && adjusted <= userLineCount) {
          errors.push({ line: adjusted, column: 1, severity: 'error', message });
        }
      }
    } else if (language === 'javascript') {
      match = line.match(/\/tmp\/s\.js:(\d+)/);
      if (match) {
        const adjusted = parseInt(match[1]) - lineOffset;
        if (adjusted >= 1 && adjusted <= userLineCount) {
          errors.push({ line: adjusted, column: 1, severity: 'error', message: line.trim() });
        }
      }
    }
  }

  // Deduplicate by line+message
  const seen = new Set();
  return errors.filter(e => {
    const key = `${e.line}:${e.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function syntaxCheckWithDocker(code, language) {
  // Skip if Docker is known to be unavailable
  if (isDockerAvailable === false) return { valid: true };

  const image = DOCKER_IMAGES[language];
  if (!image) return { valid: true };

  // Sanitize first (defense-in-depth even for compile-only)
  const sanitizeResult = sanitizeCode(code, language);
  if (!sanitizeResult.safe) {
    return { valid: false, errors: [{ line: 1, column: 1, severity: 'error', message: sanitizeResult.reason }] };
  }

  const { wrappedCode, lineOffset, userLineCount } = buildSyntaxCheckCode(code, language);

  // Compile-only commands — no execution, very fast
  let cmd, shell;
  switch (language) {
    case 'cpp':
      cmd = 'cat > /tmp/s.cpp && g++ -fsyntax-only -std=c++17 /tmp/s.cpp';
      shell = 'bash';
      break;
    case 'java':
      cmd = 'cat > /tmp/Main.java && javac /tmp/Main.java';
      shell = 'sh';
      break;
    case 'python':
      cmd = 'cat > /tmp/s.py && python3 -m py_compile /tmp/s.py';
      shell = 'bash';
      break;
    case 'javascript':
      cmd = 'cat > /tmp/s.js && node --check /tmp/s.js';
      shell = 'bash';
      break;
    default:
      return { valid: true };
  }

  const args = [
    'run', '--rm', '-i',
    '--network', 'none',
    '--memory=128m',
    '--pids-limit=32',
    '--cpus=0.5',
    '--read-only',
    '--tmpfs', '/tmp:size=10m,rw,exec',
    '--cap-drop=ALL',
    '--security-opt=no-new-privileges',
    image,
    shell, '-c', cmd
  ];

  return new Promise((resolve) => {
    let stdout = '', stderr = '';
    let finished = false;

    const proc = spawn('docker', args, {
      timeout: 10000,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    proc.stdout.on('data', d => { stdout += d.toString(); });
    proc.stderr.on('data', d => { stderr += d.toString(); });

    const done = (exitCode) => {
      if (finished) return;
      finished = true;

      if (exitCode === 0) {
        resolve({ valid: true });
      } else {
        const output = (stdout + '\n' + stderr).trim();
        const errors = parseSyntaxErrors(output, language, lineOffset, userLineCount);
        resolve({
          valid: false,
          errors: errors.length > 0
            ? errors
            : [{ line: 1, column: 1, severity: 'error', message: output.substring(0, 500) }],
          raw: output.substring(0, 1000)
        });
      }
    };

    proc.on('close', code => done(code));
    proc.on('error', () => {
      if (!finished) { finished = true; resolve({ valid: true }); }
    });

    proc.stdin.write(wrappedCode);
    proc.stdin.end();
  });
}
