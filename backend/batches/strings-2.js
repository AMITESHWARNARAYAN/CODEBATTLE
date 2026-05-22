// Strings — Batch 2 Topup (15 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'reverse-prefix-of-word',
  title: 'Reverse Prefix of Word',
  description: 'Given a 0-indexed string word and a character ch, reverse the segment of word that starts at index 0 and ends at the index of the first occurrence of ch (inclusive). If the character ch does not exist in word, do nothing. Return the resulting string.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Two Pointers', 'String'],
  constraints: '1 <= word.length <= 250. word consists of lowercase English letters. ch is a lowercase English letter.',
  examples: [{ input: '"abcdefd", "d"', output: '"dcbaefd"' }],
  args: [
    { name: 'word', cpp: 'string', java: 'String', py: 'word: str', js: 'word' },
    { name: 'ch', cpp: 'char', java: 'char', py: 'ch: str', js: 'ch' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Find index and reverse', content: 'Find the first occurrence of ch. If found, reverse the substring up to that index and concatenate the rest. Otherwise, return the original string.' }],
  jsSolution: (word, ch) => {
    const idx = word.indexOf(ch);
    if (idx === -1) return word;
    return word.substring(0, idx + 1).split('').reverse().join('') + word.substring(idx + 1);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["abcdefd", "d"]);
    cases.push(["abcd", "z"]);
    
    const gen = (n) => {
      const w = randStr(n);
      const ch = Math.random() < 0.7 ? w[randInt(0, w.length - 1)] : 'z';
      return [w, ch];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 100)));
    return cases;
  }
},

// 2
{
  slug: 'number-of-segments-in-a-string',
  title: 'Number of Segments in a String',
  description: 'Given a string s, return the number of segments in the string. A segment is defined to be a contiguous sequence of non-space characters.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String'],
  constraints: '0 <= s.length <= 300. s consists of English letters, digits, and standard punctuation/spaces.',
  examples: [{ input: '"Hello, my name is John"', output: '5' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Counting non-space transitions', content: 'Iterate through characters. Count a segment whenever we see a non-space character that either is at index 0 or follows a space.' }],
  jsSolution: (s) => {
    let count = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== ' ' && (i === 0 || s[i - 1] === ' ')) {
        count++;
      }
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["Hello, my name is John"]);
    cases.push([""]);
    
    const gen = (n) => {
      const words = Array.from({ length: n }, () => randStr(randInt(1, 6)));
      return [words.join(' '.repeat(randInt(1, 3)))];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 25)));
    return cases;
  }
},

// 3
{
  slug: 'check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence',
  title: 'Check If a Word Occurs As a Prefix of Any Word in a Sentence',
  description: 'Given a sentence string s and a searchWord string, check if searchWord occurs as a prefix of any word in s. Return the index of the word in s (1-indexed) where searchWord occurs as a prefix. If searchWord occurs as a prefix of multiple words, return the minimum index. If it does not occur as a prefix of any word, return -1.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String', 'String Matching'],
  constraints: '1 <= s.length <= 500. 1 <= searchWord.length <= 10. s consists of lowercase English letters and spaces. searchWord consists of lowercase English letters.',
  examples: [{ input: '"i love eating burger", "burg"', output: '4' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'searchWord', cpp: 'string', java: 'String', py: 'searchWord: str', js: 'searchWord' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Iterate words list', content: 'Split the sentence by spaces. Loop through the words list and check if word.startsWith(searchWord). Return index + 1 if matching.' }],
  jsSolution: (s, searchWord) => {
    const words = s.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (words[i].startsWith(searchWord)) {
        return i + 1;
      }
    }
    return -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["i love eating burger", "burg"]);
    cases.push(["this problem is easy", "pro"]);
    
    const gen = (numWords, match) => {
      const search = randStr(randInt(2, 4));
      const words = Array.from({ length: numWords }, () => randStr(randInt(3, 7)));
      if (match) {
        const idx = randInt(0, numWords - 1);
        words[idx] = search + randStr(randInt(0, 3));
      }
      return [words.join(' '), search];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 5), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 12), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 25), Math.random() < 0.5));
    return cases;
  }
},

// 4
{
  slug: 'consecutive-characters',
  title: 'Consecutive Characters',
  description: 'The power of the string is the maximum length of a non-empty substring that contains only one unique character. Given a string s, return the power of s.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String'],
  constraints: '1 <= s.length <= 500. s consists of lowercase English letters.',
  examples: [{ input: '"leetcode"', output: '2', explanation: 'The substring "ee" has length 2.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Iterative contiguous scanning', content: 'Track current running length of matching characters and maximum length seen so far. Reset current to 1 when a mismatch occurs.' }],
  jsSolution: (s) => {
    let maxPower = 1;
    let curr = 1;
    for (let i = 1; i < s.length; i++) {
      if (s[i] === s[i - 1]) {
        curr++;
        maxPower = Math.max(maxPower, curr);
      } else {
        curr = 1;
      }
    }
    return maxPower;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["leetcode"]);
    cases.push(["abbcccddddeeeeedcba"]);
    
    const gen = (n) => {
      let s = "";
      while (s.length < n) {
        const ch = randStr(1);
        s += ch.repeat(randInt(1, Math.min(6, n - s.length)));
      }
      return [s];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 30)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(30, 100)));
    return cases;
  }
},

// 5
{
  slug: 'slowest-key',
  title: 'Slowest Key',
  description: 'A newly designed keypad was tested, where a tester pressed a sequence of keys. You are given a string keysPressed and an array releaseTimes where releaseTimes[i] is the time the i-th key was released. Return the key of the keypress that had the longest duration. If there are multiple keypresses with the same longest duration, return the lexicographically largest key.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Array', 'String'],
  constraints: 'releaseTimes.length == keysPressed.length. 2 <= releaseTimes.length <= 1000. 1 <= releaseTimes[i] <= 10^9. releaseTimes[i] < releaseTimes[i+1]. keysPressed consists of lowercase English letters.',
  examples: [{ input: '"cbcd", [9,29,49,50]', output: '"c"' }],
  args: [
    { name: 'keysPressed', cpp: 'string', java: 'String', py: 'keysPressed: str', js: 'keysPressed' },
    { name: 'releaseTimes', cpp: 'vector<int>&', java: 'int[]', py: 'releaseTimes: List[int]', js: 'releaseTimes' }
  ],
  retType: { cpp: 'char', java: 'char', py: 'str' },
  hints: [{ title: 'Compute Durations', content: 'For each key i, compute releaseTimes[i] - releaseTimes[i - 1]. Find the maximum duration, handling lexicographical ties.' }],
  jsSolution: (keysPressed, releaseTimes) => {
    let maxDur = releaseTimes[0];
    let bestKey = keysPressed[0];
    
    for (let i = 1; i < keysPressed.length; i++) {
      const dur = releaseTimes[i] - releaseTimes[i - 1];
      const key = keysPressed[i];
      if (dur > maxDur || (dur === maxDur && key > bestKey)) {
        maxDur = dur;
        bestKey = key;
      }
    }
    return bestKey;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["cbcd", [9, 29, 49, 50]]);
    
    const gen = (n) => {
      const keys = randStr(n);
      const times = [];
      let last = 0;
      for (let i = 0; i < n; i++) {
        last += randInt(5, 50);
        times.push(last);
      }
      return [keys, times];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 100)));
    return cases;
  }
},

// 6
{
  slug: 'maximum-score-after-splitting-a-string',
  title: 'Maximum Score After Splitting a String',
  description: 'Given a string s of zeros and ones, return the maximum score after splitting the string into two non-empty substrings (i.e. left and right). The score after splitting a string is the number of zeros in the left substring plus the number of ones in the right substring.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String'],
  constraints: '2 <= s.length <= 500. s consists of characters \'0\' and \'1\' only.',
  examples: [{ input: '"011101"', output: '5', explanation: 'Left = "0", Right = "11101", Score = 1 + 4 = 5.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Count zeroes and ones', content: 'Initialize leftZeros = 0 and rightOnes = count of all ones in s. Iterate s up to length - 1, adjust counts at each split, and track max score.' }],
  jsSolution: (s) => {
    let ones = 0;
    for (let i = 0; i < s.length; i++) if (s[i] === '1') ones++;
    
    let maxScore = 0;
    let zeros = 0;
    for (let i = 0; i < s.length - 1; i++) {
      if (s[i] === '0') zeros++;
      else ones--;
      maxScore = Math.max(maxScore, zeros + ones);
    }
    return maxScore;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["011101"]);
    cases.push(["1111"]);
    
    const gen = (n) => {
      return [Array.from({ length: n }, () => Math.random() < 0.5 ? '0' : '1').join('')];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 100)));
    return cases;
  }
},

// 7
{
  slug: 'path-crossing',
  title: 'Path Crossing',
  description: 'Given a string path, where path[i] = \'N\', \'S\', \'E\' or \'W\', each representing moving one unit north, south, east, or west, respectively. You start at the origin (0, 0) on a 2D plane and walk on the path specified by path. Return true if the path crosses itself at any point, that is, if at any time you are on a location you have previously visited. Return false otherwise.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Hash Table', 'String'],
  constraints: '1 <= path.length <= 10^4. path[i] is either \'N\', \'S\', \'E\', or \'W\'.',
  examples: [{ input: '"NES"', output: 'false' }, { input: '"NESW"', output: 'true' }],
  args: [{ name: 'path', cpp: 'string', java: 'String', py: 'path: str', js: 'path' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Visited Set tracking', content: 'Track current coordinates (x, y). Convert to string hashes like "x,y" and insert into a Visited Hash Set. Return true if a coordinate is visited twice.' }],
  jsSolution: (path) => {
    let x = 0, y = 0;
    const visited = new Set(["0,0"]);
    for (let i = 0; i < path.length; i++) {
      const step = path[i];
      if (step === 'N') y++;
      else if (step === 'S') y--;
      else if (step === 'E') x++;
      else if (step === 'W') x--;
      
      const hash = `${x},${y}`;
      if (visited.has(hash)) return true;
      visited.add(hash);
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["NES"]);
    cases.push(["NESW"]);
    
    const gen = (n, crosses) => {
      if (crosses && n > 3) {
        const dirs = ['N', 'E', 'S', 'W'];
        let p = "";
        for (let i = 0; i < n - 4; i++) p += dirs[randInt(0, 3)];
        p += "NESW"; // force loop
        return [p];
      } else {
        const dirs = ['N', 'E']; // no loop possible
        let p = "";
        for (let i = 0; i < n; i++) p += dirs[randInt(0, 1)];
        return [p];
      }
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 25), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 100), Math.random() < 0.5));
    return cases;
  }
},

// 8
{
  slug: 'check-if-all-characters-have-equal-number-of-occurrences',
  title: 'Check if All Characters Have Equal Number of Occurrences',
  description: 'Given a string s, return true if s is a good string, or false otherwise. A string s is good if all the characters that appear in s have the same number of occurrences (i.e., the same frequency).',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Hash Table', 'String', 'Counting'],
  constraints: '1 <= s.length <= 1000. s consists of lowercase English letters.',
  examples: [{ input: '"abacbc"', output: 'true', explanation: 'All characters (a, b, c) occur exactly twice.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Check frequencies Set', content: 'Create a frequency map of characters in s. Add all frequencies to a Set. If the set size is 1, return true, otherwise false.' }],
  jsSolution: (s) => {
    const counts = {};
    for (let i = 0; i < s.length; i++) counts[s[i]] = (counts[s[i]] || 0) + 1;
    const freq = new Set(Object.values(counts));
    return freq.size === 1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["abacbc"]);
    cases.push(["aaabb"]);
    
    const gen = (distinctChars, matching) => {
      const vocab = 'abcdefghijklmnopqrstuvwxyz'.substring(0, distinctChars);
      if (matching) {
        const count = randInt(1, 5);
        let s = "";
        for (let i = 0; i < distinctChars; i++) {
          s += vocab[i].repeat(count);
        }
        return [s];
      } else {
        return [randStr(distinctChars * 3, vocab)];
      }
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 3), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(3, 6), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 12), Math.random() < 0.5));
    return cases;
  }
},

// 9
{
  slug: 'reformat-date',
  title: 'Reformat Date',
  description: 'Given a Date string in the format "Day Month Year", where Day is like "20th", Month is like "Jan", and Year is like "2052". Reformat the date string to be YYYY-MM-DD.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String'],
  constraints: 'The given dates are guaranteed to be valid, so no error handling is necessary.',
  examples: [{ input: '"20th Oct 2052"', output: '"2052-10-20"' }],
  args: [{ name: 'date', cpp: 'string', java: 'String', py: 'date: str', js: 'date' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Parse space tokens', content: 'Split string by spaces to get Day, Month, Year. Use a dictionary to map month name to 2-digit MM. Extract digits from Day to form DD.' }],
  jsSolution: (date) => {
    const months = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    };
    const [dayStr, monthStr, year] = date.split(' ');
    const dayVal = parseInt(dayStr, 10);
    const day = dayVal < 10 ? '0' + dayVal : dayVal.toString();
    const month = months[monthStr];
    return `${year}-${month}-${day}`;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["20th Oct 2052"]);
    cases.push(["6th Jun 1933"]);
    
    const gen = () => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const day = randInt(1, 28);
      const suffix = day === 1 || day === 21 ? 'st' : (day === 2 || day === 22 ? 'nd' : (day === 3 || day === 23 ? 'rd' : 'th'));
      const dateStr = `${day}${suffix} ${monthNames[randInt(0, 11)]} ${randInt(1900, 2030)}`;
      return [dateStr];
    };
    for (let i = 0; i < 48; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    return cases;
  }
},

// 10
{
  slug: 'reformat-phone-number',
  title: 'Reformat Phone Number',
  description: 'You are given a phone number as a string number. number consists of digits, spaces \' \', and/or dashes \'-\'. Reformat the phone number according to standard rules: remove all non-digits, group from left to right in blocks of length 3 until there are 4 or fewer digits left. If 4 digits are left, split into two blocks of length 2.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String'],
  constraints: '2 <= number.length <= 100. number consists of digits, spaces, and dashes only.',
  examples: [{ input: '"1-23-45 6"', output: '"123-456"' }, { input: '"123 4-5678"', output: '"123-456-78"' }],
  args: [{ name: 'number', cpp: 'string', java: 'String', py: 'number: str', js: 'number' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Simulate blocks logic', content: 'First clean the string of spaces and dashes. Loop through digits. While digits remaining > 4, slice 3 and append. If remaining is 4, slice 2 and 2. Otherwise append remaining.' }],
  jsSolution: (number) => {
    const cleaned = number.replace(/[^0-9]/g, '');
    const blocks = [];
    let i = 0;
    while (i < cleaned.length) {
      const rem = cleaned.length - i;
      if (rem === 4) {
        blocks.push(cleaned.substring(i, i + 2));
        blocks.push(cleaned.substring(i + 2, i + 4));
        break;
      } else if (rem === 2 || rem === 3) {
        blocks.push(cleaned.substring(i));
        break;
      } else {
        blocks.push(cleaned.substring(i, i + 3));
        i += 3;
      }
    }
    return blocks.join('-');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["1-23-45 6"]);
    cases.push(["123 4-5678"]);
    
    const gen = (n) => {
      let raw = Array.from({ length: n }, () => randInt(0, 9)).join('');
      // Inject some spaces/dashes
      let withSp = "";
      for (let i = 0; i < raw.length; i++) {
        withSp += raw[i];
        if (Math.random() < 0.25) withSp += Math.random() < 0.5 ? ' ' : '-';
      }
      return [withSp];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 80)));
    return cases;
  }
},

// 11
{
  slug: 'number-of-lines-to-write-string',
  title: 'Number of Lines To Write String',
  description: 'You are given an array widths where widths[0] is the width of \'a\', widths[1] is the width of \'b\', ..., widths[25] is the width of \'z\'. You are also given a string s. Write s across lines where each line has a max capacity of 100 pixels. If writing a char exceeds 100 pixels, wrap it to the next line. Return an array of size 2: [totalLines, lastLinePixelsUsed].',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Array', 'String'],
  constraints: 'widths.length == 26. widths[i] is between 2 and 10. 1 <= s.length <= 1000.',
  examples: [{ input: '[10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10], "abcdefghijklmnopqrstuvwxyz"', output: '[3, 60]' }],
  args: [
    { name: 'widths', cpp: 'vector<int>&', java: 'int[]', py: 'widths: List[int]', js: 'widths' },
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Simulate line wrapping', content: 'Track lines count starting at 1, and current pixelsUsed = 0. For each char, check if pixelsUsed + charWidth > 100. If yes, lines++, pixelsUsed = charWidth. Else pixelsUsed += charWidth.' }],
  jsSolution: (widths, s) => {
    let lines = 1;
    let currWidth = 0;
    for (let i = 0; i < s.length; i++) {
      const w = widths[s.charCodeAt(i) - 97];
      if (currWidth + w > 100) {
        lines++;
        currWidth = w;
      } else {
        currWidth += w;
      }
    }
    return [lines, currWidth];
  },
  inputGenerator: () => {
    const cases = [];
    const standardWidths = Array(26).fill(10);
    cases.push([standardWidths, "abcdefghijklmnopqrstuvwxyz"]);
    
    const gen = (n) => {
      const widths = randArr(26, 4, 10);
      const s = randStr(n);
      return [widths, s];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(5, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 100)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(100, 300)));
    return cases;
  }
},

// 12
{
  slug: 'most-common-word',
  title: 'Most Common Word',
  description: 'Given a string paragraph and a string array of banned words banned, return the most frequent word in paragraph that is not banned. It is guaranteed there is at least one word that is not banned, and that the answer is unique. Words in paragraph are case-insensitive and punctuation is ignored.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Hash Table', 'String', 'Counting'],
  constraints: '1 <= paragraph.length <= 1000. 0 <= banned.length <= 100. paragraph consists of English letters, spaces, or punctuation.',
  examples: [{ input: '"Bob hit a ball, the hit BALL flew far after it was hit.", ["hit"]', output: '"ball"' }],
  args: [
    { name: 'paragraph', cpp: 'string', java: 'String', py: 'paragraph: str', js: 'paragraph' },
    { name: 'banned', cpp: 'vector<string>&', java: 'String[]', py: 'banned: List[str]', js: 'banned' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Split and map', content: 'Clean paragraph by converting to lowercase and replacing punctuation with spaces. Split words, count frequencies of non-banned words, and return the max.' }],
  jsSolution: (paragraph, banned) => {
    const bannedSet = new Set(banned.map(w => w.toLowerCase()));
    const words = paragraph.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
    const counts = {};
    for (const w of words) {
      if (!bannedSet.has(w)) {
        counts[w] = (counts[w] || 0) + 1;
      }
    }
    let maxCount = 0;
    let bestWord = "";
    for (const [w, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        bestWord = w;
      }
    }
    return bestWord;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["Bob hit a ball, the hit BALL flew far after it was hit.", ["hit"]]);
    
    const gen = (numWords) => {
      const vocab = ["ball", "bat", "glove", "base", "pitcher", "catcher"];
      const words = [];
      for (let i = 0; i < numWords; i++) {
        words.push(vocab[randInt(0, vocab.length - 1)] + (Math.random() < 0.2 ? ',' : ''));
      }
      const banned = [vocab[randInt(0, vocab.length - 1)]];
      return [words.join(' '), banned];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(3, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 60)));
    return cases;
  }
},

// 13
{
  slug: 'subdomain-visit-count',
  title: 'Subdomain Visit Count',
  description: 'A website domain "discuss.leetcode.com" consists of various subdomains. We are given a list of count-paired domains cpdomains. We would like a list of count-paired domains, in the same format, that address each subdomain individually.',
  difficulty: 'Medium',
  category: 'Strings',
  tags: ['Array', 'Hash Table', 'String', 'Counting'],
  constraints: '1 <= cpdomains.length <= 100. cpdomains[i] is of format "count domain".',
  examples: [{ input: '["9001 discuss.leetcode.com"]', output: '["9001 discuss.leetcode.com", "9001 leetcode.com", "9001 com"]' }],
  args: [{ name: 'cpdomains', cpp: 'vector<string>&', java: 'String[]', py: 'cpdomains: List[str]', js: 'cpdomains' }],
  retType: { cpp: 'vector<string>', java: 'List<String>', py: 'List[str]' },
  hints: [{ title: 'Generate all subdomains', content: 'For each cpdomain, split into count and domain. Generate all subdomains of that domain, and accumulate their counts in a hash map. Format output list.' }],
  jsSolution: (cpdomains) => {
    const counts = {};
    for (const entry of cpdomains) {
      const [countStr, domain] = entry.split(' ');
      const count = parseInt(countStr, 10);
      const subdomains = [];
      const parts = domain.split('.');
      for (let i = 0; i < parts.length; i++) {
        subdomains.push(parts.slice(i).join('.'));
      }
      for (const sub of subdomains) {
        counts[sub] = (counts[sub] || 0) + count;
      }
    }
    return Object.entries(counts).map(([sub, count]) => `${count} ${sub}`).sort();
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([["9001 discuss.leetcode.com"]]);
    
    const gen = (n) => {
      const arr = [];
      for (let i = 0; i < n; i++) {
        const count = randInt(10, 1000);
        const dom = `${randStr(3)}.${randStr(4)}.${Math.random() < 0.5 ? 'com' : 'org'}`;
        arr.push(`${count} ${dom}`);
      }
      return [arr];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(1, 3)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(3, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 20)));
    return cases;
  }
},

// 14
{
  slug: 'swap-adjacent-in-lr-string',
  title: 'Swap Adjacent in LR String',
  description: 'In a string composed of \'L\', \'R\', and \'X\' characters, like "RXXLRXRXL", a move consists of replacing one occurrence of "XL" with "LX", or replacing one occurrence of "RX" with "XR". Given the starting string start and the ending string end, return true if there exists a sequence of moves to transform start to end.',
  difficulty: 'Medium',
  category: 'Strings',
  tags: ['Two Pointers', 'String'],
  constraints: '1 <= start.length == end.length <= 10^4. Both start and end consist of only \'L\', \'R\', and \'X\'.',
  examples: [{ input: '"RXXLRXRXL", "XRLXXRRLX"', output: 'true' }],
  args: [
    { name: 'start', cpp: 'string', java: 'String', py: 'start: str', js: 'start' },
    { name: 'end', cpp: 'string', java: 'String', py: 'end: str', js: 'end' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Two pointers on relative order', content: 'Relative order of L and R must be identical. L can only move left (so its index in start must be >= index in end), R can only move right (index in start <= index in end).' }],
  jsSolution: (start, end) => {
    if (start.replace(/X/g, '') !== end.replace(/X/g, '')) return false;
    let i = 0, j = 0;
    const n = start.length;
    while (i < n && j < n) {
      while (i < n && start[i] === 'X') i++;
      while (j < n && end[j] === 'X') j++;
      if (i === n || j === n) break;
      if (start[i] === 'L' && i < j) return false;
      if (start[i] === 'R' && i > j) return false;
      i++;
      j++;
    }
    return true;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["RXXLRXRXL", "XRLXXRRLX"]);
    
    const gen = (n, solvable) => {
      let start = Array.from({ length: n }, () => ['L', 'R', 'X'][randInt(0, 2)]).join('');
      if (solvable) {
        let endArr = start.split('');
        // Make some valid moves
        for (let i = 0; i < n - 1; i++) {
          if (endArr[i] === 'X' && endArr[i + 1] === 'L') {
            endArr[i] = 'L';
            endArr[i + 1] = 'X';
          }
          if (endArr[i] === 'R' && endArr[i + 1] === 'X') {
            endArr[i] = 'X';
            endArr[i + 1] = 'R';
          }
        }
        return [start, endArr.join('')];
      } else {
        return [start, randStr(n, 'LRX')];
      }
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50), Math.random() < 0.5));
    return cases;
  }
},

// 15
{
  slug: 'find-common-characters',
  title: 'Find Common Characters',
  description: 'Given a string array words, return an array of all characters that show up in all strings within the words (including duplicates). You may return the answer in any order.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Array', 'Hash Table', 'String'],
  constraints: '1 <= words.length <= 100. 1 <= words[i].length <= 100. words[i] consists of lowercase English letters.',
  examples: [{ input: '["bella","label","roller"]', output: '["e","l","l"]' }],
  args: [{ name: 'words', cpp: 'vector<string>&', java: 'String[]', py: 'words: List[str]', js: 'words' }],
  retType: { cpp: 'vector<string>', java: 'List<String>', py: 'List[str]' },
  hints: [{ title: 'Frequency intersection', content: 'Initialize a minFrequency array of size 26 with Infinity. For each word, count character frequencies, and update minFrequency with the minimum count seen across all words.' }],
  jsSolution: (words) => {
    let minFreq = Array(26).fill(Infinity);
    for (const w of words) {
      const freq = Array(26).fill(0);
      for (let i = 0; i < w.length; i++) {
        freq[w.charCodeAt(i) - 97]++;
      }
      for (let i = 0; i < 26; i++) {
        minFreq[i] = Math.min(minFreq[i], freq[i]);
      }
    }
    const ans = [];
    for (let i = 0; i < 26; i++) {
      while (minFreq[i] > 0 && minFreq[i] !== Infinity) {
        ans.push(String.fromCharCode(97 + i));
        minFreq[i]--;
      }
    }
    return ans.sort();
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([["bella", "label", "roller"]]);
    
    const gen = (numWords) => {
      const common = randStr(randInt(2, 4));
      const arr = [];
      for (let i = 0; i < numWords; i++) {
        arr.push(common + randStr(randInt(2, 6)));
      }
      return [arr];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 15)));
    return cases;
  }
}

];
