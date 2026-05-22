// Strings — Batch 1 (32 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'valid-palindrome',
  title: 'Valid Palindrome',
  description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Two Pointers', 'String'],
  constraints: '1 <= s.length <= 2 * 10^5. s consists only of printable ASCII characters.',
  examples: [{ input: '"A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Clean and Reverse', content: 'Convert to lowercase, keep only alphanumeric characters, and check if it is equal to its reversed version.' }],
  jsSolution: (s) => {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["A man, a plan, a canal: Panama"]);
    cases.push(["race a car"]);
    
    const gen = (n, makePal) => {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789   ,,,!!!:::';
      let s = Array.from({ length: n }, () => chars[randInt(0, chars.length - 1)]).join('');
      if (makePal) {
        const half = randStr(Math.floor(n / 2), 'abcdefghijklmnopqrstuvwxyz0123456789');
        s = half + (n % 2 === 1 ? 'z' : '') + half.split('').reverse().join('');
      }
      return [s];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 30), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(30, 100), Math.random() < 0.5));
    return cases;
  }
},

// 2
{
  slug: 'valid-palindrome-ii',
  title: 'Valid Palindrome II',
  description: 'Given a string s, return true if the s can be palindrome after deleting at most one character from it.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Two Pointers', 'String', 'Greedy'],
  constraints: '1 <= s.length <= 10^5. s consists of lowercase English letters.',
  examples: [{ input: '"aba"', output: 'true' }, { input: '"abca"', output: 'true', explanation: 'You could delete the character \'c\'.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Greedy mismatch correction', content: 'Use two pointers from both ends. When you find a mismatch, check if the remaining substring without left character OR without right character is a palindrome.' }],
  jsSolution: (s) => {
    const isPal = (str, l, r) => {
      while (l < r) {
        if (str[l] !== str[r]) return false;
        l++;
        r--;
      }
      return true;
    };
    let l = 0, r = s.length - 1;
    while (l < r) {
      if (s[l] !== s[r]) {
        return isPal(s, l + 1, r) || isPal(s, l, r - 1);
      }
      l++;
      r--;
    }
    return true;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["aba"]);
    cases.push(["abca"]);
    
    const gen = (n, almostPal) => {
      const half = randStr(Math.floor(n / 2));
      let s = half + (n % 2 === 1 ? 'a' : '') + half.split('').reverse().join('');
      if (almostPal && s.length > 2) {
        // inject one wrong character
        const idx = randInt(0, s.length - 1);
        s = s.substring(0, idx) + 'z' + s.substring(idx + 1);
      } else if (!almostPal) {
        s = randStr(n);
      }
      return [s];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8), Math.random() < 0.6));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25), Math.random() < 0.6));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 80), Math.random() < 0.6));
    return cases;
  }
},

// 3
{
  slug: 'roman-to-integer',
  title: 'Roman to Integer',
  description: 'Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Given a roman numeral, convert it to an integer.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Hash Table', 'Math', 'String'],
  constraints: '1 <= s.length <= 15. s contains only the characters (\'I\', \'V\', \'X\', \'L\', \'C\', \'D\', \'M\'). It is guaranteed that s is a valid roman numeral in the range [1, 3999].',
  examples: [{ input: '"LVIII"', output: '58', explanation: 'L = 50, V= 5, III = 3.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Left to Right Scanning', content: 'Compare current value with next value. If current value is less than next, subtract current value; otherwise, add it.' }],
  jsSolution: (s) => {
    const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
      const cur = map[s[i]];
      const next = map[s[i + 1]];
      if (next && cur < next) {
        sum -= cur;
      } else {
        sum += cur;
      }
    }
    return sum;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["III"]);
    cases.push(["LVIII"]);
    cases.push(["MCMXCIV"]);
    
    const toRoman = (num) => {
      const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
      const syb = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
      let roman = "";
      for (let i = 0; i < val.length; i++) {
        while (num >= val[i]) {
          roman += syb[i];
          num -= val[i];
        }
      }
      return roman;
    };
    for (let i = 0; i < 47; i++) cases.push([toRoman(randInt(1, 50))]);
    for (let i = 0; i < 50; i++) cases.push([toRoman(randInt(50, 500))]);
    for (let i = 0; i < 50; i++) cases.push([toRoman(randInt(500, 3999))]);
    return cases;
  }
},

// 4
{
  slug: 'integer-to-roman',
  title: 'Integer to Roman',
  description: 'Seven different symbols represent Roman numerals. Given an integer, convert it to a roman numeral.',
  difficulty: 'Medium',
  category: 'Strings',
  tags: ['Hash Table', 'Math', 'String'],
  constraints: '1 <= num <= 3999',
  examples: [{ input: '58', output: '"LVIII"' }],
  args: [{ name: 'num', cpp: 'int', java: 'int', py: 'num: int', js: 'num' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Greedy matching values', content: 'Store Roman numeral pairings in descending order. Repeatedly subtract the largest possible values and append their symbols.' }],
  jsSolution: (num) => {
    const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const syb = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    let roman = "";
    for (let i = 0; i < val.length; i++) {
      while (num >= val[i]) {
        roman += syb[i];
        num -= val[i];
      }
    }
    return roman;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3]);
    cases.push([58]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(50, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(500, 3999)]);
    return cases;
  }
},

// 5
{
  slug: 'add-strings',
  title: 'Add Strings',
  description: 'Given two non-negative integers, num1 and num2 represented as string, return the sum of num1 and num2 as a string. You must solve the problem without using any built-in BigInteger library or converting the inputs to integer directly.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Math', 'String', 'Simulation'],
  constraints: '1 <= num1.length, num2.length <= 10^4. num1 and num2 consist of only digits. num1 and num2 have no leading zeros, except the number 0 itself.',
  examples: [{ input: '"11", "123"', output: '"134"' }],
  args: [
    { name: 'num1', cpp: 'string', java: 'String', py: 'num1: str', js: 'num1' },
    { name: 'num2', cpp: 'string', java: 'String', py: 'num2: str', js: 'num2' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Digits Simulation', content: 'Use two pointers starting from the ends of both strings, computing digit sum and carry as you move backwards.' }],
  jsSolution: (num1, num2) => {
    let res = "";
    let i = num1.length - 1;
    let j = num2.length - 1;
    let carry = 0;
    while (i >= 0 || j >= 0 || carry > 0) {
      let sum = carry;
      if (i >= 0) sum += num1.charCodeAt(i--) - 48;
      if (j >= 0) sum += num2.charCodeAt(j--) - 48;
      res = (sum % 10) + res;
      carry = Math.floor(sum / 10);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["11", "123"]);
    cases.push(["456", "77"]);
    
    const gen = (len1, len2) => {
      const n1 = randStr(len1, '123456789') + randStr(Math.max(0, len1 - 1), '0123456789');
      const n2 = randStr(len2, '123456789') + randStr(Math.max(0, len2 - 1), '0123456789');
      return [n1, n2];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 5), randInt(1, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 20), randInt(5, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 100), randInt(20, 100)));
    return cases;
  }
},

// 6
{
  slug: 'multiply-strings',
  title: 'Multiply Strings',
  description: 'Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string. Note: You must not use any built-in BigInteger library or convert the inputs to integer directly.',
  difficulty: 'Medium',
  category: 'Strings',
  tags: ['Math', 'String', 'Simulation'],
  constraints: '1 <= num1.length, num2.length <= 200. num1 and num2 consist of digits only. Both num1 and num2 do not contain any leading zero, except the number 0 itself.',
  examples: [{ input: '"2", "3"', output: '"6"' }, { input: '"123", "456"', output: '"56088"' }],
  args: [
    { name: 'num1', cpp: 'string', java: 'String', py: 'num1: str', js: 'num1' },
    { name: 'num2', cpp: 'string', java: 'String', py: 'num2: str', js: 'num2' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Grid multiplication', content: 'Initialize an array of size num1.length + num2.length with 0. For each position i and j, add the product of num1[i] * num2[j] to position i + j + 1, then resolve carries.' }],
  jsSolution: (num1, num2) => {
    if (num1 === "0" || num2 === "0") return "0";
    const m = num1.length, n = num2.length;
    const pos = Array(m + n).fill(0);
    
    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        const mul = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48);
        const p1 = i + j;
        const p2 = i + j + 1;
        const sum = mul + pos[p2];
        
        pos[p2] = sum % 10;
        pos[p1] += Math.floor(sum / 10);
      }
    }
    
    let res = "";
    for (const p of pos) {
      if (!(res.length === 0 && p === 0)) res += p;
    }
    return res.length === 0 ? "0" : res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["2", "3"]);
    cases.push(["123", "456"]);
    
    const gen = (len1, len2) => {
      const n1 = randStr(len1, '123456789') + randStr(Math.max(0, len1 - 1), '0123456789');
      const n2 = randStr(len2, '123456789') + randStr(Math.max(0, len2 - 1), '0123456789');
      return [n1, n2];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 3), randInt(1, 3)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(3, 8), randInt(3, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 20), randInt(8, 20)));
    return cases;
  }
},

// 7
{
  slug: 'string-compression',
  title: 'String Compression',
  description: 'Given an array of characters chars, compress it using the following algorithm: Begin with an empty string s. For each group of consecutive repeating characters in chars: If the group\'s length is 1, append the character to s. Otherwise, append the character followed by the group\'s length. The compressed string s should not be returned separately, but instead, be stored in the input character array chars. Note that group lengths 10 or more will be split into multiple characters in chars. After you are done modifying the input array, return the new length of the array.',
  difficulty: 'Medium',
  category: 'Strings',
  tags: ['Two Pointers', 'String'],
  constraints: '1 <= chars.length <= 2000. chars[i] is a lowercase English letter, uppercase English letter, digit, or symbol.',
  examples: [{ input: '["a","a","b","b","c","c","c"]', output: '6', explanation: 'Modified array is ["a","2","b","2","c","3"]. Size 6.' }],
  args: [{ name: 'chars', cpp: 'vector<char>&', java: 'char[]', py: 'chars: List[str]', js: 'chars' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Two pointers inplace', content: 'Use one pointer for reading the input array, another writing the modifications. Keep count of occurrences and write appropriately.' }],
  jsSolution: (chars) => {
    let write = 0;
    let read = 0;
    while (read < chars.length) {
      let char = chars[read];
      let count = 0;
      while (read < chars.length && chars[read] === char) {
        read++;
        count++;
      }
      chars[write++] = char;
      if (count > 1) {
        const countStr = count.toString();
        for (let i = 0; i < countStr.length; i++) {
          chars[write++] = countStr[i];
        }
      }
    }
    return write;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([["a", "a", "b", "b", "c", "c", "c"]]);
    cases.push([["a"]]);
    
    const gen = (n) => {
      const arr = [];
      let i = 0;
      while (arr.length < n) {
        const char = randStr(1, 'abcdefghijklmnopqrstuvwxyz');
        const count = randInt(1, 15);
        for (let c = 0; c < count; c++) {
          arr.push(char);
        }
      }
      return [arr.slice(0, n)];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 8
{
  slug: 'reverse-words-in-a-string',
  title: 'Reverse Words in a String',
  description: 'Given an input string s, reverse the order of the words. A word is defined as a sequence of non-space characters. The words in s will be separated by at least one space. Return a string of the words in reverse order concatenated by a single space. Note that s may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces.',
  difficulty: 'Medium',
  category: 'Strings',
  tags: ['Two Pointers', 'String'],
  constraints: '1 <= s.length <= 10^4. s contains English letters, digits, and spaces.',
  examples: [{ input: '"the sky is blue"', output: '"blue is sky the"' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Trim and Split', content: 'Filter out multiple spacing, divide words into individual entries, reverse their list/array, and rejoin.' }],
  jsSolution: (s) => {
    return s.trim().split(/\s+/).reverse().join(' ');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["the sky is blue"]);
    cases.push(["  hello world  "]);
    
    const gen = (wordCount) => {
      const words = Array.from({ length: wordCount }, () => randStr(randInt(2, 6)));
      return [words.join(' '.repeat(randInt(1, 3)))];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 25)));
    return cases;
  }
},

// 9
{
  slug: 'excel-sheet-column-title',
  title: 'Excel Sheet Column Title',
  description: 'Given an integer columnNumber, return its corresponding column title as it appears in an Excel sheet. (e.g. 1 -> A, 2 -> B, 26 -> Z, 27 -> AA, 28 -> AB etc.)',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Math', 'String'],
  constraints: '1 <= columnNumber <= 2^31 - 1',
  examples: [{ input: '28', output: '"AB"' }],
  args: [{ name: 'columnNumber', cpp: 'int', java: 'int', py: 'columnNumber: int', js: 'columnNumber' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Base-26 with shift', content: 'This is base 26. Since the values are 1-indexed (A=1), decrement columnNumber by 1 at each step before taking modulo 26.' }],
  jsSolution: (columnNumber) => {
    let title = "";
    while (columnNumber > 0) {
      columnNumber--;
      title = String.fromCharCode((columnNumber % 26) + 65) + title;
      columnNumber = Math.floor(columnNumber / 26);
    }
    return title;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([1]);
    cases.push([28]);
    cases.push([701]);
    for (let i = 0; i < 47; i++) cases.push([randInt(1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(50, 2000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(2000, 1000000)]);
    return cases;
  }
},

// 10
{
  slug: 'excel-sheet-column-number',
  title: 'Excel Sheet Column Number',
  description: 'Given a string columnTitle that represents the column title as appears in an Excel sheet, return its corresponding column number.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Math', 'String'],
  constraints: '1 <= columnTitle.length <= 7. columnTitle consists only of uppercase English letters. columnTitle is in the range ["A", "FXSHRXW"].',
  examples: [{ input: '"AB"', output: '28' }],
  args: [{ name: 'columnTitle', cpp: 'string', java: 'String', py: 'columnTitle: str', js: 'columnTitle' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Base-26 conversion', content: 'Loop through string left to right. Accumulate result by multiplying current result by 26 and adding standard value (ch.charCodeAt(0) - 64).' }],
  jsSolution: (columnTitle) => {
    let num = 0;
    for (let i = 0; i < columnTitle.length; i++) {
      num = num * 26 + (columnTitle.charCodeAt(i) - 64);
    }
    return num;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["A"]);
    cases.push(["AB"]);
    cases.push(["ZY"]);
    
    const genTitle = (len) => {
      return randStr(len, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    };
    for (let i = 0; i < 47; i++) cases.push([genTitle(randInt(1, 2))]);
    for (let i = 0; i < 50; i++) cases.push([genTitle(randInt(2, 4))]);
    for (let i = 0; i < 50; i++) cases.push([genTitle(randInt(4, 6))]);
    return cases;
  }
},

// 11
{
  slug: 'repeated-substring-pattern',
  title: 'Repeated Substring Pattern',
  description: 'Given a string s, check if it can be constructed by taking a substring of it and repeating multiple times to form s.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String', 'String Matching'],
  constraints: '1 <= s.length <= 10^4. s consists of lowercase English letters.',
  examples: [{ input: '"abab"', output: 'true' }, { input: '"aba"', output: 'false' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Shift and Search', content: 'If s consists of repeated patterns, then (s + s) with the first and last characters removed will contain s.' }],
  jsSolution: (s) => {
    const doubled = s + s;
    return doubled.substring(1, doubled.length - 1).includes(s);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["abab"]);
    cases.push(["aba"]);
    
    const gen = (n, repeats) => {
      if (repeats) {
        const sub = randStr(randInt(1, Math.floor(n / 2)));
        let s = "";
        while (s.length < n) s += sub;
        return [s];
      } else {
        return [randStr(n)];
      }
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 8), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 60), Math.random() < 0.5));
    return cases;
  }
},

// 12
{
  slug: 'word-pattern',
  title: 'Word Pattern',
  description: 'Given a pattern and a string s, find if s follows the same pattern. Here follow means a full match, such that there is a bijection between a letter in pattern and a non-empty word in s.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Hash Table', 'String'],
  constraints: '1 <= pattern.length <= 300. pattern consists of lowercase English letters. 1 <= s.length <= 3000. s contains lowercase English letters and spaces. s does not contain any leading or trailing spaces. All words in s are separated by a single space.',
  examples: [{ input: '"abba", "dog cat cat dog"', output: 'true' }],
  args: [
    { name: 'pattern', cpp: 'string', java: 'String', py: 'pattern: str', js: 'pattern' },
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Dual Mapping', content: 'Split s into words. The pattern length must equal the number of words. Use two hash maps (one pattern to word, another word to pattern) to verify the bijection.' }],
  jsSolution: (pattern, s) => {
    const words = s.split(' ');
    if (words.length !== pattern.length) return false;
    const pToW = {};
    const wToP = {};
    for (let i = 0; i < pattern.length; i++) {
      const p = pattern[i];
      const w = words[i];
      if (pToW[p] && pToW[p] !== w) return false;
      if (wToP[w] && wToP[w] !== p) return false;
      pToW[p] = w;
      wToP[w] = p;
    }
    return true;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["abba", "dog cat cat dog"]);
    cases.push(["abba", "dog cat cat fish"]);
    
    const gen = (len, matching) => {
      const pattern = randStr(len, 'abcd');
      const vocabulary = ["dog", "cat", "fish", "bird"];
      const words = [];
      const map = {};
      const usedWords = new Set();
      
      if (matching) {
        for (let i = 0; i < len; i++) {
          const char = pattern[i];
          if (!map[char]) {
            const avail = vocabulary.filter(x => !usedWords.has(x));
            const w = avail.length > 0 ? avail[randInt(0, avail.length - 1)] : "mouse";
            map[char] = w;
            usedWords.add(w);
          }
          words.push(map[char]);
        }
      } else {
        for (let i = 0; i < len; i++) {
          words.push(vocabulary[randInt(0, vocabulary.length - 1)]);
        }
      }
      return [pattern, words.join(' ')];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 5), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 10), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 20), Math.random() < 0.5));
    return cases;
  }
},

// 13
{
  slug: 'letter-combinations-of-a-phone-number',
  title: 'Letter Combinations of a Phone Number',
  description: 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order. A mapping of digits to letters (just like on the telephone buttons) is standard.',
  difficulty: 'Medium',
  category: 'Strings',
  tags: ['Hash Table', 'String', 'Backtracking'],
  constraints: '0 <= digits.length <= 4. digits[i] is a digit in the range [\'2\', \'9\'].',
  examples: [{ input: '"23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' }],
  args: [{ name: 'digits', cpp: 'string', java: 'String', py: 'digits: str', js: 'digits' }],
  retType: { cpp: 'vector<string>', java: 'List<String>', py: 'List[str]' },
  hints: [{ title: 'DFS Backtracking Combinations', content: 'Create a phone dictionary map. Traverse standard characters for digit[index], branching recursion depth index + 1.' }],
  jsSolution: (digits) => {
    if (digits.length === 0) return [];
    const map = {
      2: "abc", 3: "def", 4: "ghi", 5: "jkl",
      6: "mno", 7: "pqrs", 8: "tuv", 9: "wxyz"
    };
    const ans = [];
    const backtrack = (idx, current) => {
      if (idx === digits.length) {
        ans.push(current);
        return;
      }
      const letters = map[digits[idx]];
      for (let i = 0; i < letters.length; i++) {
        backtrack(idx + 1, current + letters[i]);
      }
    };
    backtrack(0, "");
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["23"]);
    cases.push([""]);
    
    const gen = (len) => {
      return [randStr(len, '23456789')];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 2)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(2, 3)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(3, 4)));
    return cases;
  }
},

// 14
{
  slug: 'generate-parentheses',
  title: 'Generate Parentheses',
  description: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
  difficulty: 'Medium',
  category: 'Strings',
  tags: ['String', 'Dynamic Programming', 'Backtracking'],
  constraints: '1 <= n <= 8',
  examples: [{ input: '3', output: '["((()))","(()())","(())()","()(())","()()()"]' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'vector<string>', java: 'List<String>', py: 'List[str]' },
  hints: [{ title: 'Keep track of counts', content: 'Use backtracking. Recursively add open brackets if openCount < n, and add close brackets if closeCount < openCount.' }],
  jsSolution: (n) => {
    const ans = [];
    const backtrack = (s, open, close) => {
      if (s.length === 2 * n) {
        ans.push(s);
        return;
      }
      if (open < n) backtrack(s + "(", open + 1, close);
      if (close < open) backtrack(s + ")", open, close + 1);
    };
    backtrack("", 0, 0);
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3]);
    cases.push([1]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 3)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(3, 5)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(5, 7)]);
    return cases;
  }
},

// 15
{
  slug: 'decode-string',
  title: 'Decode String',
  description: 'Given an encoded string, return its decoded string. The encoding rule is: k[encoded_string], where the encoded_string inside the square brackets is being repeated exactly k times. Note that k is guaranteed to be a positive integer. You may assume that the input string is always valid.',
  difficulty: 'Medium',
  category: 'Strings',
  tags: ['String', 'Stack', 'Recursion'],
  constraints: '1 <= s.length <= 30. s consists of lowercase English letters, digits, and square brackets \'[\', \']\'. It is guaranteed that s is a valid input. All the integers in s are in the range [1, 300].',
  examples: [{ input: '"3[a]2[bc]"', output: '"aaabcbc"' }, { input: '"3[a2[c]]"', output: '"accaccacc"' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Nested bracket stacks', content: 'Use two stacks: one for counts, and one for string states. When you encounter \'[\', push counts and strings, reset them. When you encounter \']\', pop and multiply.' }],
  jsSolution: (s) => {
    const countStack = [];
    const strStack = [];
    let currentStr = "";
    let k = 0;
    
    for (let i = 0; i < s.length; i++) {
      const char = s[i];
      if (char >= '0' && char <= '9') {
        k = k * 10 + parseInt(char, 10);
      } else if (char === '[') {
        countStack.push(k);
        strStack.push(currentStr);
        currentStr = "";
        k = 0;
      } else if (char === ']') {
        const count = countStack.pop();
        const prev = strStack.pop();
        currentStr = prev + currentStr.repeat(count);
      } else {
        currentStr += char;
      }
    }
    return currentStr;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["3[a]2[bc]"]);
    cases.push(["3[a2[c]]"]);
    
    const gen = (depth) => {
      let s = randStr(randInt(1, 3));
      for (let i = 0; i < depth; i++) {
        s = `${randInt(2, 4)}[${s + randStr(randInt(1, 2))}]`;
      }
      return [s];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(1));
    for (let i = 0; i < 50; i++) cases.push(gen(2));
    for (let i = 0; i < 50; i++) cases.push(gen(3));
    return cases;
  }
},

// 16
{
  slug: 'count-and-say',
  title: 'Count and Say',
  description: 'The count-and-say sequence is a sequence of digit strings defined by the recursive formula: countAndSay(1) = "1", countAndSay(n) is the run-length encoding of countAndSay(n - 1). Given a positive integer n, return the nth term of the count-and-say sequence.',
  difficulty: 'Medium',
  category: 'Strings',
  tags: ['String'],
  constraints: '1 <= n <= 30',
  examples: [{ input: '4', output: '"1211"', explanation: 'countAndSay(1) = "1", countAndSay(2) = "11", countAndSay(3) = "21", countAndSay(4) = "1211".' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Run-length generation', content: 'Generate terms iteratively. For each term, loop through its characters, count contiguous groupings, and append the count + char to form the next term.' }],
  jsSolution: (n) => {
    let s = "1";
    for (let i = 2; i <= n; i++) {
      let next = "";
      let j = 0;
      while (j < s.length) {
        let count = 1;
        while (j + 1 < s.length && s[j] === s[j + 1]) {
          count++;
          j++;
        }
        next += count.toString() + s[j];
        j++;
      }
      s = next;
    }
    return s;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([1]);
    cases.push([4]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 4)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(4, 8)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(8, 12)]);
    return cases;
  }
},

// 17
{
  slug: 'goal-parser-interpretation',
  title: 'Goal Parser Interpretation',
  description: 'You own a Goal Parser that can interpret a string command. The command consists of "G", "()" and/or "(al)" in some order. The Goal Parser will interpret "G" as the string "G", "()" as the string "o", and "(al)" as the string "al". Return the interpreted string.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String'],
  constraints: '1 <= command.length <= 100. command consists of "G", "()", and "(al)" in some order.',
  examples: [{ input: '"G()(al)"', output: '"Goal"' }],
  args: [{ name: 'command', cpp: 'string', java: 'String', py: 'command: str', js: 'command' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'String replacement rules', content: 'Loop through the string. If current is G, output G. If current is (, check if next is ). If yes, output o, else output al (shifting pointer appropriately).' }],
  jsSolution: (command) => {
    return command.replaceAll('()', 'o').replaceAll('(al)', 'al');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["G()(al)"]);
    cases.push(["G()()()()(al)"]);
    
    const gen = (n) => {
      const parts = ["G", "()", "(al)"];
      let s = "";
      for (let i = 0; i < n; i++) {
        s += parts[randInt(0, 2)];
      }
      return [s];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30)));
    return cases;
  }
},

// 18
{
  slug: 'merge-strings-alternately',
  title: 'Merge Strings Alternately',
  description: 'You are given two strings word1 and word2. Merge the strings by adding letters in alternating order, starting with word1. If a string is longer than the other, append the additional letters onto the end of the merged string. Return the merged string.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Two Pointers', 'String'],
  constraints: '1 <= word1.length, word2.length <= 100. word1 and word2 consist of lowercase English letters.',
  examples: [{ input: '"abc", "pqr"', output: '"apbqcr"' }],
  args: [
    { name: 'word1', cpp: 'string', java: 'String', py: 'word1: str', js: 'word1' },
    { name: 'word2', cpp: 'string', java: 'String', py: 'word2: str', js: 'word2' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Alternating Loop', content: 'Use a loop up to the maximum length of both words. Append letters sequentially if indices are within string boundaries.' }],
  jsSolution: (word1, word2) => {
    let merged = "";
    const limit = Math.max(word1.length, word2.length);
    for (let i = 0; i < limit; i++) {
      if (i < word1.length) merged += word1[i];
      if (i < word2.length) merged += word2[i];
    }
    return merged;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["abc", "pqr"]);
    cases.push(["ab", "rs"]);
    
    const gen = (l1, l2) => {
      return [randStr(l1), randStr(l2)];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 5), randInt(1, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 20), randInt(5, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50), randInt(20, 50)));
    return cases;
  }
},

// 19
{
  slug: 'determine-if-string-halves-are-alike',
  title: 'Determine if String Halves Are Alike',
  description: 'You are given a string s of even length. Split this string into two halves of equal lengths, and let a be the first half and b be the second half. Two strings are alike if they have the same number of vowels (\'a\', \'e\', \'i\', \'o\', \'u\', \'A\', \'E\', \'I\', \'O\', \'U\'). Return true if a and b are alike. Otherwise, return false.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String', 'Counting'],
  constraints: '2 <= s.length <= 1000. s.length is even. s consists of uppercase and lowercase English letters.',
  examples: [{ input: '"book"', output: 'true', explanation: 'a = "bo" (1 vowel), b = "ok" (1 vowel). Alike!' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Count Vowels', content: 'Create a set of vowels. Split the string into halves. Count how many vowels exist in the first half and compare to the second half.' }],
  jsSolution: (s) => {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
    const mid = s.length / 2;
    let countA = 0, countB = 0;
    for (let i = 0; i < mid; i++) {
      if (vowels.has(s[i])) countA++;
      if (vowels.has(s[mid + i])) countB++;
    }
    return countA === countB;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["book"]);
    cases.push(["textbook"]);
    
    const gen = (n) => {
      // Force even length
      const len = n % 2 === 1 ? n + 1 : n;
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZaeiouAEIOU';
      return [randStr(len, chars)];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 100)));
    return cases;
  }
},

// 20
{
  slug: 'split-a-string-in-balanced-strings',
  title: 'Split a String in Balanced Strings',
  description: 'Balanced strings are those that have an equal quantity of \'L\' and \'R\' characters. Given a balanced string s, split it in the maximum amount of balanced strings. Return the maximum amount of split balanced strings.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String', 'Greedy'],
  constraints: '2 <= s.length <= 1000. s[i] is either \'L\' or \'R\'. s is a balanced string.',
  examples: [{ input: '"RLRRLLRLRL"', output: '4' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Balance counter', content: 'Iterate through the string. Maintain a balance counter: +1 for R, -1 for L. Every time balance becomes 0, increment output count.' }],
  jsSolution: (s) => {
    let bal = 0, count = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === 'R') bal++;
      else bal--;
      if (bal === 0) count++;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["RLRRLLRLRL"]);
    cases.push(["RLLLLRRRLR"]);
    
    const gen = (n) => {
      let s = "";
      for (let i = 0; i < n; i++) {
        // Append small matching blocks
        const blocks = ["RL", "LR", "RRLRLL", "LLRLRR"];
        s += blocks[randInt(0, 3)];
      }
      return [s];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 3)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(3, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 30)));
    return cases;
  }
},

// 21
{
  slug: 'decrypt-string-from-alphabet-to-integer-mapping',
  title: 'Decrypt String from Alphabet to Integer Mapping',
  description: 'Given a string s formed by digits and \'#\', we want to map s to English lowercase characters as follows: Characters (\'a\' to \'i\') are represented by (\'1\' to \'9\') respectively. Characters (\'j\' to \'z\') are represented by (\'10#\' to \'26#\') respectively. Return the decrypted string.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String'],
  constraints: '1 <= s.length <= 1000. s consists of digits (\'0\'-\'9\') and \'#\' characters. s will be a valid string such that mapping is always possible.',
  examples: [{ input: '"10#11#12"', output: '"jkab"' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Look-ahead matching', content: 'Iterate through string. If s[i + 2] === \'#\', decode the 2-digit number (s[i]s[i+1]) and skip 3 steps. Otherwise decode single digit.' }],
  jsSolution: (s) => {
    let res = "";
    let i = 0;
    while (i < s.length) {
      if (i + 2 < s.length && s[i + 2] === '#') {
        const val = parseInt(s.substring(i, i + 2), 10);
        res += String.fromCharCode(96 + val);
        i += 3;
      } else {
        const val = parseInt(s[i], 10);
        res += String.fromCharCode(96 + val);
        i++;
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["10#11#12"]);
    cases.push(["1326#"]);
    
    const gen = (n) => {
      let s = "";
      for (let i = 0; i < n; i++) {
        if (Math.random() < 0.5) {
          s += randInt(1, 9).toString();
        } else {
          s += randInt(10, 26).toString() + '#';
        }
      }
      return [s];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 22
{
  slug: 'to-lower-case',
  title: 'To Lower Case',
  description: 'Given a string s, return the string after replacing every uppercase letter with the same lowercase letter.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String'],
  constraints: '1 <= s.length <= 100. s consists of printable ASCII characters.',
  examples: [{ input: '"Hello"', output: '"hello"' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'ASCII value shifts', content: 'Iterate characters. If char code is between 65 (A) and 90 (Z), add 32 to char code to get the lowercase counterpart.' }],
  jsSolution: (s) => {
    return s.toLowerCase();
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["Hello"]);
    cases.push(["here"]);
    cases.push(["LOVELY"]);
    
    const gen = (n) => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789!!! ';
      return [Array.from({ length: n }, () => chars[randInt(0, chars.length - 1)]).join('')];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 23
{
  slug: 'truncate-sentence',
  title: 'Truncate Sentence',
  description: 'A sentence is a list of words that are separated by a single space with no leading or trailing spaces. Each of the words consists of only uppercase and lowercase English letters. You are given a sentence s and an integer k. Truncate s such that it contains only the first k words. Return the truncated sentence.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Array', 'String'],
  constraints: '1 <= s.length <= 500. k is in the range [1, number of words in s]. s consists of only lowercase and uppercase English letters and spaces.',
  examples: [{ input: '"Hello how are you Contestant", 4', output: '"Hello how are you"' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Spaces as bounds', content: 'Split s by space, take the first k words using slice, and join them back using space.' }],
  jsSolution: (s, k) => {
    return s.split(' ').slice(0, k).join(' ');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["Hello how are you Contestant", 4]);
    cases.push(["What is the solution to this problem", 4]);
    
    const gen = (wordsCount) => {
      const words = Array.from({ length: wordsCount }, () => randStr(randInt(2, 6)));
      const k = randInt(1, wordsCount);
      return [words.join(' '), k];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 30)));
    return cases;
  }
},

// 24
{
  slug: 'check-if-two-string-arrays-are-equivalent',
  title: 'Check if Two String Arrays are Equivalent',
  description: 'Given two string arrays word1 and word2, return true if the two arrays represent the same string, and false otherwise. A string is represented by an array if the array elements concatenated in order forms the string.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Array', 'String'],
  constraints: '1 <= word1.length, word2.length <= 1000. 1 <= word1[i].length, word2[i].length <= 1000. 1 <= sum(word1[i].length), sum(word2[i].length) <= 1000. word1[i] and word2[i] consist of lowercase English letters.',
  examples: [{ input: '["ab", "c"], ["a", "bc"]', output: 'true' }],
  args: [
    { name: 'word1', cpp: 'vector<string>&', java: 'String[]', py: 'word1: List[str]', js: 'word1' },
    { name: 'word2', cpp: 'vector<string>&', java: 'String[]', py: 'word2: List[str]', js: 'word2' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Join Comparison', content: 'Simply concatenate all elements in word1 to make string 1, and elements in word2 to make string 2. Check if they are equal.' }],
  jsSolution: (word1, word2) => {
    return word1.join('') === word2.join('');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([["ab", "c"], ["a", "bc"]]);
    cases.push([["a", "cb"], ["ab", "c"]]);
    
    const gen = (n, equal) => {
      const fullString = randStr(n);
      const splitArray = (str) => {
        const arr = [];
        let i = 0;
        while (i < str.length) {
          const cut = randInt(1, Math.min(3, str.length - i));
          arr.push(str.substring(i, i + cut));
          i += cut;
        }
        return arr;
      };
      
      const word1 = splitArray(fullString);
      const word2 = equal ? splitArray(fullString) : splitArray(fullString + 'z');
      return [word1, word2];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 60), Math.random() < 0.5));
    return cases;
  }
},

// 25
{
  slug: 'sorting-the-sentence',
  title: 'Sorting the Sentence',
  description: 'A sentence is a list of words that are separated by a single space with no leading or trailing spaces. Each word consists of lowercase and uppercase English letters and a single 1-indexed number at the end to indicate its original position. Given a shuffled sentence s, reconstruct and return the original sentence.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String', 'Sorting'],
  constraints: '2 <= s.length <= 200. s consists of shuffled words, spaces, and digits from 1 to 9. The number of words in s is between 1 and 9.',
  examples: [{ input: '"is2 sentence4 This1 a3"', output: '"This is a sentence"' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Sort by suffixes', content: 'Split the sentence by space. Sort the words based on the number at their end, then trim off that number, and join words with space.' }],
  jsSolution: (s) => {
    const words = s.split(' ');
    const ans = Array(words.length);
    for (const w of words) {
      const idx = parseInt(w[w.length - 1], 10) - 1;
      ans[idx] = w.substring(0, w.length - 1);
    }
    return ans.join(' ');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["is2 sentence4 This1 a3"]);
    cases.push(["Myself2 Me1"]);
    
    const gen = (n) => {
      const words = Array.from({ length: n }, () => randStr(randInt(2, 6)));
      const indexed = words.map((w, idx) => w + (idx + 1).toString());
      // shuffle
      const shuffled = [];
      const temp = [...indexed];
      while (temp.length > 0) {
        shuffled.push(temp.splice(randInt(0, temp.length - 1), 1)[0]);
      }
      return [shuffled.join(' ')];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 3)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(3, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 8)));
    return cases;
  }
},

// 26
{
  slug: 'valid-parentheses',
  title: 'Valid Parentheses',
  description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['String', 'Stack'],
  constraints: '1 <= s.length <= 10^4. s consists of parentheses only \'()[]{}\'.',
  examples: [{ input: '"()[]{}"', output: 'true' }, { input: '"(]"', output: 'false' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Matching Bracket Stack', content: 'Use a stack. If current is open bracket, push onto stack. If close, check if stack top matches, if yes pop, else return false.' }],
  jsSolution: (s) => {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (let i = 0; i < s.length; i++) {
      const char = s[i];
      if (char === '(' || char === '{' || char === '[') {
        stack.push(char);
      } else {
        if (stack.length === 0 || stack[stack.length - 1] !== map[char]) {
          return false;
        }
        stack.pop();
      }
    }
    return stack.length === 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["()[]{}"]);
    cases.push(["(]"]);
    
    const gen = (n, valid) => {
      if (valid) {
        let s = "";
        const parts = ["()", "{}", "[]"];
        for (let i = 0; i < n; i++) {
          const block = parts[randInt(0, 2)];
          if (Math.random() < 0.5) {
            s = block + s;
          } else {
            s = s.substring(0, Math.floor(s.length / 2)) + block + s.substring(Math.floor(s.length / 2));
          }
        }
        return [s];
      } else {
        const chars = '()[]{}';
        return [Array.from({ length: n * 2 }, () => chars[randInt(0, chars.length - 1)]).join('')];
      }
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 3), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(3, 10), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 30), Math.random() < 0.5));
    return cases;
  }
},

// 27
{
  slug: 'backspace-string-compare',
  title: 'Backspace String Compare',
  description: 'Given two strings s and t, return true if they are equal when both are typed into empty text editors. \'#\' means a backspace character. Note that after backspacing an empty text, the text will continue empty.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Two Pointers', 'String', 'Stack', 'Simulation'],
  constraints: '1 <= s.length, t.length <= 200. s and t contain lowercase letters and \'#\' characters.',
  examples: [{ input: '"ab#c", "ad#c"', output: 'true', explanation: 'Both become "ac".' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 't', cpp: 'string', java: 'String', py: 't: str', js: 't' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Build Helper', content: 'Write a helper function that takes a string and processes it using a stack, popping when you see \'#\' and pushing otherwise. Compare results.' }],
  jsSolution: (s, t) => {
    const build = (str) => {
      const res = [];
      for (let i = 0; i < str.length; i++) {
        if (str[i] === '#') {
          res.pop();
        } else {
          res.push(str[i]);
        }
      }
      return res.join('');
    };
    return build(s) === build(t);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["ab#c", "ad#c"]);
    cases.push(["a##c", "#a#c"]);
    
    const gen = (n, equal) => {
      const buildStr = (len) => {
        let res = "";
        for (let i = 0; i < len; i++) {
          if (Math.random() < 0.3) {
            res += '#';
          } else {
            res += randStr(1);
          }
        }
        return res;
      };
      const s = buildStr(n);
      const t = equal ? s : buildStr(n);
      return [s, t];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50), Math.random() < 0.5));
    return cases;
  }
},

// 28
{
  slug: 'greatest-common-divisor-of-strings',
  title: 'Greatest Common Divisor of Strings',
  description: 'For two strings s and t, we say "t divides s" if and only if s = t + t + t + ... + t (i.e., t is concatenated with itself one or more times). Given two strings str1 and str2, return the largest string x such that x divides both str1 and str2.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Math', 'String'],
  constraints: '1 <= str1.length, str2.length <= 1000. str1 and str2 consist of uppercase English letters.',
  examples: [{ input: '"ABCABC", "ABC"', output: '"ABC"' }],
  args: [
    { name: 'str1', cpp: 'string', java: 'String', py: 'str1: str', js: 'str1' },
    { name: 'str2', cpp: 'string', java: 'String', py: 'str2: str', js: 'str2' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'String GCD Math relation', content: 'If str1 + str2 !== str2 + str1, return "". Otherwise, the GCD string length is the GCD of their lengths. Return substring of that length.' }],
  jsSolution: (str1, str2) => {
    if (str1 + str2 !== str2 + str1) return "";
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    return str1.substring(0, gcd(str1.length, str2.length));
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["ABCABC", "ABC"]);
    cases.push(["LEET", "CODE"]);
    
    const gen = (gLen, matching) => {
      const gcdStr = randStr(gLen, 'ABC').toUpperCase();
      if (matching) {
        const str1 = gcdStr.repeat(randInt(1, 4));
        const str2 = gcdStr.repeat(randInt(1, 4));
        return [str1, str2];
      } else {
        return [randStr(gLen * 2, 'ABC').toUpperCase(), randStr(gLen * 3, 'DEF').toUpperCase()];
      }
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 3), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(3, 6), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 12), Math.random() < 0.5));
    return cases;
  }
},

// 29
{
  slug: 'find-the-index-of-the-first-occurrence-in-a-string',
  title: 'Find the Index of the First Occurrence in a String',
  description: 'Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.',
  difficulty: 'Easy',
  category: 'Strings',
  tags: ['Two Pointers', 'String', 'String Matching'],
  constraints: '1 <= haystack.length, needle.length <= 10^4. haystack and needle consist of only lowercase English characters.',
  examples: [{ input: '"sadbutsad", "sad"', output: '0' }],
  args: [
    { name: 'haystack', cpp: 'string', java: 'String', py: 'haystack: str', js: 'haystack' },
    { name: 'needle', cpp: 'string', java: 'String', py: 'needle: str', js: 'needle' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Substring index', content: 'Simply use indexOf or substring searching. For a robust manually coded solution, loop from 0 to haystack.length - needle.length and match character-by-character.' }],
  jsSolution: (haystack, needle) => {
    return haystack.indexOf(needle);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["sadbutsad", "sad"]);
    cases.push(["leetcode", "leeto"]);
    
    const gen = (hLen, match) => {
      const needle = randStr(randInt(2, 5));
      let haystack = randStr(hLen);
      if (match) {
        const idx = randInt(0, hLen - needle.length);
        haystack = haystack.substring(0, idx) + needle + haystack.substring(idx + needle.length);
      }
      return [haystack, needle];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(5, 10), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 30), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(30, 80), Math.random() < 0.5));
    return cases;
  }
},

// 30
{
  slug: 'longest-palindromic-substring',
  title: 'Longest Palindromic Substring',
  description: 'Given a string s, return the longest palindromic substring in s.',
  difficulty: 'Medium',
  category: 'Strings',
  tags: ['String', 'Dynamic Programming'],
  constraints: '1 <= s.length <= 1000. s consists of only digits and English letters.',
  examples: [{ input: '"babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Expand Around Center', content: 'For each character in the string, expand outwards for odd-length and even-length palindromes. Keep track of the longest one found.' }],
  jsSolution: (s) => {
    if (!s || s.length < 1) return "";
    let start = 0, end = 0;
    
    const expand = (left, right) => {
      while (left >= 0 && right < s.length && s[left] === s[right]) {
        left--;
        right++;
      }
      return right - left - 1;
    };
    
    for (let i = 0; i < s.length; i++) {
      const len1 = expand(i, i);
      const len2 = expand(i, i + 1);
      const len = Math.max(len1, len2);
      if (len > end - start) {
        start = i - Math.floor((len - 1) / 2);
        end = i + Math.floor(len / 2);
      }
    }
    return s.substring(start, end + 1);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["babad"]);
    cases.push(["cbbd"]);
    
    const gen = (n) => {
      const parts = randStr(Math.floor(n / 3));
      const pal = parts + parts.split('').reverse().join('');
      const noise = randStr(n - pal.length);
      return [noise.substring(0, Math.floor(noise.length / 2)) + pal + noise.substring(Math.floor(noise.length / 2))];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 31
{
  slug: 'basic-calculator-ii',
  title: 'Basic Calculator II',
  description: 'Given a string s which represents an expression, evaluate this expression and return its value. The integer division should truncate toward zero. You may assume that the given expression is always valid. All intermediate results will be in the range of [-2^31, 2^31 - 1].',
  difficulty: 'Medium',
  category: 'Strings',
  tags: ['Math', 'String', 'Stack'],
  constraints: '1 <= s.length <= 3 * 10^5. s consists of integers and operators (\'+\', \'-\', \'*\', \'/\') separated by spaces.',
  examples: [{ input: '"3+2*2"', output: '7' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Operators stack', content: 'Store values in stack. Track last operator. When seeing number, process using last operator: if + push num, if - push -num, if * pop and push pop*num, if / pop and push pop/num (truncating).' }],
  jsSolution: (s) => {
    const clean = s.replace(/\s+/g, '');
    const stack = [];
    let num = 0;
    let sign = '+';
    for (let i = 0; i < clean.length; i++) {
      const ch = clean[i];
      if (ch >= '0' && ch <= '9') {
        num = num * 10 + (ch.charCodeAt(0) - 48);
      }
      if (isNaN(ch) || i === clean.length - 1) {
        if (sign === '+') stack.push(num);
        else if (sign === '-') stack.push(-num);
        else if (sign === '*') stack.push(stack.pop() * num);
        else if (sign === '/') {
          const popped = stack.pop();
          stack.push(popped >= 0 ? Math.floor(popped / num) : Math.ceil(popped / num));
        }
        sign = ch;
        num = 0;
      }
    }
    return stack.reduce((a, b) => a + b, 0);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["3+2*2"]);
    cases.push([" 3/2 "]);
    cases.push([" 3 + 5 / 2 "]);
    
    const gen = (numTerms) => {
      const ops = ['+', '-', '*', '/'];
      let s = randInt(1, 10).toString();
      for (let i = 0; i < numTerms - 1; i++) {
        const op = ops[randInt(0, 3)];
        const nextNum = randInt(1, 10);
        s += ` ${op} ${nextNum}`;
      }
      return [s];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(2, 3)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(3, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 8)));
    return cases;
  }
},

// 32
{
  slug: 'custom-sort-string',
  title: 'Custom Sort String',
  description: 'You are given two strings order and s. All the characters of order are unique and were sorted in some custom order previously. Permute the characters of s so that they match the order that order was sorted. More specifically, if a character x occurs before a character y in order, then x should occur before y in the permuted string. Return any permutation of s that satisfies this property.',
  difficulty: 'Medium',
  category: 'Strings',
  tags: ['Hash Table', 'String', 'Sorting'],
  constraints: '1 <= order.length <= 26. 1 <= s.length <= 200. order and s consist of lowercase English letters. All the characters of order are unique.',
  examples: [{ input: '"cba", "abcd"', output: '"cbad"' }],
  args: [
    { name: 'order', cpp: 'string', java: 'String', py: 'order: str', js: 'order' },
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Bucket counting', content: 'Count frequency of each char in s. Append characters from order to result according to their frequency in s, then append all other remaining characters of s.' }],
  jsSolution: (order, s) => {
    const counts = {};
    for (let i = 0; i < s.length; i++) {
      counts[s[i]] = (counts[s[i]] || 0) + 1;
    }
    let res = "";
    for (let i = 0; i < order.length; i++) {
      const char = order[i];
      if (counts[char]) {
        res += char.repeat(counts[char]);
        delete counts[char];
      }
    }
    for (const [char, count] of Object.entries(counts)) {
      res += char.repeat(count);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["cba", "abcd"]);
    cases.push(["cbafg", "abcd"]);
    
    const gen = (lenS) => {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      const order = shuffle(alphabet.split('')).slice(0, randInt(5, 15)).join('');
      const s = randStr(lenS);
      return [order, s];
    };
    const shuffle = (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 60)));
    return cases;
  }
}

];
