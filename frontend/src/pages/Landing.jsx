import { useNavigate } from 'react-router-dom';
import { Code2, Zap, Trophy, Users, ArrowRight, Moon, Sun, Terminal, Clock, TrendingUp, Play, Github, Linkedin, ChevronRight, BookOpen, Sparkles, Loader2, CheckCircle2, Flame, Target, Brain } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LANGUAGES = {
  javascript: {
    label: 'JavaScript',
    filename: 'twoSum.js',
    template: `// Two Sum Problem
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}

// Test case
console.log(JSON.stringify(twoSum([2, 7, 11, 15], 9)));
`
  },
  python: {
    label: 'Python 3',
    filename: 'two_sum.py',
    template: `# Two Sum Problem
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test case
print(two_sum([2, 7, 11, 15], 9))
`
  },
  cpp: {
    label: 'C++',
    filename: 'two_sum.cpp',
    template: `// Two Sum Problem
#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    vector<int> result = twoSum(nums, 9);
    cout << "[" << result[0] << ", " << result[1] << "]" << endl;
    return 0;
}
`
  }
};

export default function Landing() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(LANGUAGES.javascript.template);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch real total users from the backend to replace fake stats
  useEffect(() => {
    fetch(`${API_URL}/auth/registration-status`)
      .then((res) => {
        if (!res.ok) throw new Error('Offline');
        return res.json();
      })
      .then((data) => {
        if (data && typeof data.totalUsers === 'number') {
          setTotalUsers(data.totalUsers);
        }
      })
      .catch((err) => {
        console.warn('Registration status fetch failed, using fallback.', err);
        setTotalUsers(142); // Fallback realistic number
      });
  }, []);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setCode(LANGUAGES[lang].template);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    
    try {
      const response = await fetch(`${API_URL}/judge/run-public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to run code');
      }

      const result = await response.json();
      setOutput(result);
      
      if (result.error) {
        toast.error('Code execution failed');
      } else {
        toast.success('Code executed successfully!');
      }
    } catch (error) {
      console.error('Run code error:', error);
      toast.error('Failed to run code');
      setOutput({ error: error.message || 'Failed to execute code' });
    } finally {
      setIsRunning(false);
    }
  };

  // Modern professional color scheme
  const bgColor = isDark ? 'bg-slate-950' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-slate-800' : 'border-gray-200';
  const cardBg = isDark ? 'bg-slate-900' : 'bg-gray-50';
  const accentColor = 'from-orange-500 to-yellow-500';

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-200`}>
      {/* Header - Professional Navigation */}
      <header className={`${isDark ? 'bg-slate-950/95' : 'bg-white/95'} border-b ${borderColor} sticky top-0 z-50 backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg shadow-lg">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${textColor}`}>CodeBattle</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className={`text-sm font-medium ${textMuted} hover:text-orange-500 transition-colors duration-200`}>
                Features
              </a>
              <a href="#how-it-works" className={`text-sm font-medium ${textMuted} hover:text-orange-500 transition-colors duration-200`}>
                How It Works
              </a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={() => navigate('/login')} className={`text-sm font-medium ${textMuted} hover:text-orange-500 transition-colors`}>
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:shadow-lg hover:from-orange-600 hover:to-yellow-600 transition-all">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Master Competitive Programming
              </div>
              
              <h1 className={`text-5xl sm:text-6xl font-bold tracking-tight mb-6 ${textColor}`}>
                Code. Battle. 
                <span className="block bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600 bg-clip-text text-transparent">
                  Dominate.
                </span>
              </h1>
              
              <p className={`text-lg sm:text-xl mb-8 ${textMuted} max-w-xl leading-relaxed`}>
                Real-time competitive programming with intelligent matchmaking. Challenge others, climb the leaderboard, and prepare for your dream tech interviews.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-200 inline-flex items-center justify-center gap-2"
                >
                  Start Free
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className={`px-8 py-4 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 border-2 ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <Play className="w-5 h-5" />
                  Try Demo
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                <div>
                  <div className={`text-2xl font-bold ${textColor}`}>500+</div>
                  <div className={`text-sm ${textMuted}`}>Problems</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${textColor}`}>
                    {totalUsers > 0 ? `${totalUsers}` : '140+'}
                  </div>
                  <div className={`text-sm ${textMuted}`}>Coders</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${textColor}`}>24/7</div>
                  <div className={`text-sm ${textMuted}`}>Battles</div>
                </div>
              </div>
            </div>

            {/* Right Content - Code Demo */}
            <div className={`relative rounded-xl border-2 ${borderColor} ${cardBg} p-6 shadow-2xl overflow-hidden`}>
              <div className={`flex items-center justify-between mb-4 pb-4 border-b ${borderColor}`}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  {/* Interactive Language Selector Dropdown */}
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className={`ml-3 text-xs font-semibold bg-transparent border-none outline-none ${textColor} cursor-pointer hover:text-orange-500 transition-colors`}
                  >
                    {Object.entries(LANGUAGES).map(([key, lang]) => (
                      <option key={key} value={key} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                        {lang.filename} ({lang.label})
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="text-xs font-medium px-3 py-1.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded hover:shadow-lg transition-all disabled:opacity-50 inline-flex items-center gap-1"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Running
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      Run
                    </>
                  )}
                </button>
              </div>
              
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full text-xs sm:text-sm ${textMuted} font-mono bg-transparent border-none outline-none resize-none overflow-x-auto`}
                rows={16}
                spellCheck={false}
              />
              
              {output && (
                <div className={`mt-4 pt-4 border-t ${borderColor}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="w-4 h-4 text-green-500" />
                    <span className={`text-xs font-medium ${textColor}`}>Output</span>
                  </div>
                  {output.error ? (
                    <div className={`text-xs p-3 rounded-lg font-mono ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}`}>
                      {output.error}
                    </div>
                  ) : (
                    <div className={`text-xs p-3 rounded-lg font-mono ${isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-600'}`}>
                      {output.output || output.stdout || '✓ Success'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className={`py-24 ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${textColor}`}>Powerful Features</h2>
            <p className={`text-lg ${textMuted} max-w-2xl mx-auto`}>
              Everything you need to excel in competitive programming
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature Cards */}
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Real-time Battles',
                desc: 'Compete with other coders in real-time matches with instant feedback',
                color: 'blue'
              },
              {
                icon: <Trophy className="w-6 h-6" />,
                title: 'ELO Rankings',
                desc: 'Professional rating system that reflects your true skill level',
                color: 'yellow'
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: 'AI-Powered Learning',
                desc: 'Get instant explanations and hints using cutting-edge AI',
                color: 'purple'
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Community',
                desc: 'Join thousands of coders, share solutions, and learn together',
                color: 'green'
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: '1000+ Problems',
                desc: 'Curated problems from top tech companies',
                color: 'red'
              },
              {
                icon: <Flame className="w-6 h-6" />,
                title: 'Daily Challenges',
                desc: 'Test your skills with fresh challenges every day',
                color: 'orange'
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`${cardBg} border ${borderColor} rounded-xl p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer`}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  feature.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                  feature.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                  feature.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                  feature.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  feature.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                  'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`font-semibold mb-2 ${textColor} group-hover:text-orange-500 transition-colors`}>{feature.title}</h3>
                <p className={`text-sm ${textMuted}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solve Real-World Problems Section */}
      <section id="how-it-works" className={`py-20 ${bgColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${textColor}`}>Solve real-world coding challenges</h2>
            <p className={`text-lg ${textMuted} max-w-2xl mx-auto`}>
              Explore examples of how CodeBattle helps developers master algorithms and prepare for technical interviews.
            </p>
          </div>

          {/* Use Cases */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Use Case 1 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-8 hover:shadow-xl transition-shadow`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">MATCHMAKING</span>
                  <h3 className={`text-xl font-bold mt-2 mb-3 ${textColor}`}>Battle random opponents in real-time</h3>
                  <p className={`${textMuted} mb-4`}>
                    Join our matchmaking system to compete against players of similar skill levels. Improve your ranking through consistent practice and strategic problem-solving.
                  </p>
                  <button 
                    onClick={() => navigate('/matchmaking')}
                    className="text-orange-500 hover:text-orange-600 inline-flex items-center gap-1 text-sm font-medium"
                  >
                    Learn more
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Use Case 2 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-8 hover:shadow-xl transition-shadow`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">CONTESTS</span>
                  <h3 className={`text-xl font-bold mt-2 mb-3 ${textColor}`}>Participate in timed coding contests</h3>
                  <p className={`${textMuted} mb-4`}>
                    Join weekly contests to test your skills under time pressure. Experience a real interview environment and compete for top positions on the leaderboard.
                  </p>
                  <button 
                    onClick={() => navigate('/contests')}
                    className="text-orange-500 hover:text-orange-600 inline-flex items-center gap-1 text-sm font-medium"
                  >
                    View contests
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore the Ecosystem */}
      <section id="ecosystem" className={`py-20 ${isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${textColor}`}>Explore the ecosystem</h2>
            <p className={`text-lg ${textMuted} max-w-2xl mx-auto`}>
              Discover production-tested tools to accelerate your learning and track your coding journey.
            </p>
          </div>

          {/* Ecosystem Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tool 1 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer`} onClick={() => navigate('/code-editor')}>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Terminal className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">FEATURE</span>
              <h3 className={`text-lg font-bold mt-2 mb-2 ${textColor}`}>Code Editor</h3>
              <p className={`text-sm ${textMuted}`}>
                Write and test code with our powerful in-browser editor supporting multiple languages.
              </p>
            </div>

            {/* Tool 2 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer`} onClick={() => navigate('/leaderboard')}>
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">FEATURE</span>
              <h3 className={`text-lg font-bold mt-2 mb-2 ${textColor}`}>Leaderboards</h3>
              <p className={`text-sm ${textMuted}`}>
                Track your ranking and compete with thousands of developers worldwide.
              </p>
            </div>

            {/* Tool 3 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer`} onClick={() => navigate('/problems')}>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">RESOURCE</span>
              <h3 className={`text-lg font-bold mt-2 mb-2 ${textColor}`}>Problem Library</h3>
              <p className={`text-sm ${textMuted}`}>
                Access hundreds of curated coding problems across all difficulty levels.
              </p>
            </div>

            {/* Tool 4 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer`}>
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">TOOL</span>
              <h3 className={`text-lg font-bold mt-2 mb-2 ${textColor}`}>AI Explanations</h3>
              <p className={`text-sm ${textMuted}`}>
                Get instant explanations for problems using AI-powered insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - TensorFlow Style */}
      <footer className={`${cardBg} border-t ${borderColor} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Column 1 */}
            <div>
              <h4 className={`font-bold mb-4 ${textColor}`}>Learn</h4>
              <ul className="space-y-2">
                <li><span onClick={() => navigate('/problems')} className={`text-sm ${textMuted} hover:text-orange-500 transition-colors cursor-pointer`}>Problems</span></li>
                <li><a href="#features" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>Features</a></li>
                <li><a href="#ecosystem" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>Ecosystem</a></li>
              </ul>
            </div>
            {/* Column 2 */}
            <div>
              <h4 className={`font-bold mb-4 ${textColor}`}>Practice</h4>
              <ul className="space-y-2">
                <li><span onClick={() => navigate('/problems')} className={`text-sm ${textMuted} hover:text-orange-500 transition-colors cursor-pointer`}>Problems</span></li>
                <li><span onClick={() => navigate('/contests')} className={`text-sm ${textMuted} hover:text-orange-500 transition-colors cursor-pointer`}>Contests</span></li>
                <li><span onClick={() => navigate('/register')} className={`text-sm ${textMuted} hover:text-orange-500 transition-colors cursor-pointer`}>Daily Challenge</span></li>
              </ul>
            </div>
            {/* Column 3 */}
            <div>
              <h4 className={`font-bold mb-4 ${textColor}`}>Community</h4>
              <ul className="space-y-2">
                <li><a href="https://github.com" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>GitHub</a></li>
                <li><a href="https://linkedin.com" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>LinkedIn</a></li>
                <li><span onClick={() => navigate('/discussions')} className={`text-sm ${textMuted} hover:text-orange-500 transition-colors cursor-pointer`}>Discussions</span></li>
              </ul>
            </div>
            {/* Column 4 */}
            <div>
              <h4 className={`font-bold mb-4 ${textColor}`}>About</h4>
              <ul className="space-y-2">
                <li><a href="#features" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>Why CodeBattle</a></li>
                <li><span onClick={() => navigate('/discussions')} className={`text-sm ${textMuted} hover:text-orange-500 transition-colors cursor-pointer`}>Q&A Help</span></li>
                <li><span onClick={() => navigate('/discussions')} className={`text-sm ${textMuted} hover:text-orange-500 transition-colors cursor-pointer`}>Contact</span></li>
              </ul>
            </div>
          </div>
          <div className={`pt-8 border-t ${borderColor} flex flex-col sm:flex-row justify-between items-center gap-4`}>
            <p className={`text-sm ${textMuted}`}>© 2026 CodeBattle. All rights reserved.</p>
            <div className="flex gap-6">
              <span onClick={() => navigate('/discussions')} className={`text-sm ${textMuted} hover:text-orange-500 transition-colors cursor-pointer`}>Terms</span>
              <span onClick={() => navigate('/discussions')} className={`text-sm ${textMuted} hover:text-orange-500 transition-colors cursor-pointer`}>Privacy</span>
              <span onClick={() => navigate('/discussions')} className={`text-sm ${textMuted} hover:text-orange-500 transition-colors cursor-pointer`}>Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

