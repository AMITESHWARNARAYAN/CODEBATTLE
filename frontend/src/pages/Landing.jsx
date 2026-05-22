import { useNavigate } from 'react-router-dom';
import { Code2, Zap, Trophy, Users, ArrowRight, Moon, Sun, Terminal, Clock, TrendingUp, Play, Github, Linkedin, ChevronRight, BookOpen, Sparkles, Loader2, CheckCircle2, Flame, Target, Brain } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Landing() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [code, setCode] = useState(`// Two Sum Problem
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
console.log(twoSum([2,7,11,15], 9));
// Output: [0, 1]`);

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
          language: 'javascript',
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
              <a href="#community" className={`text-sm font-medium ${textMuted} hover:text-orange-500 transition-colors duration-200`}>
                Community
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
                  onClick={() => navigate('/problems')}
                  className={`px-8 py-4 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 border-2 ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <Play className="w-5 h-5" />
                  Try Demo
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                <div>
                  <div className={`text-2xl font-bold ${textColor}`}>1,000+</div>
                  <div className={`text-sm ${textMuted}`}>Problems</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${textColor}`}>10,000+</div>
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
                  <span className={`text-xs font-medium ${textMuted} ml-3`}>code.js</span>
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
                  feature.color === 'blue' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                  feature.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' :
                  feature.color === 'purple' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' :
                  feature.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                  feature.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                  'bg-orange-100 dark:bg-orange-900/30 text-orange-600'
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
      <section className={`py-20 ${bgColor}`}>
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

      {/* Community Section */}
      <section id="community" className={`py-20 ${bgColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-4xl font-bold mb-6 ${textColor}`}>Join the community</h2>
              <p className={`text-lg ${textMuted} mb-8`}>
                Collaborate, find support, and share your coding journey by joining our vibrant community of developers.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className={`flex items-center gap-3 ${cardBg} border ${borderColor} rounded-lg px-6 py-4`}>
                  <Users className="w-8 h-8 text-orange-500" />
                  <div>
                    <div className={`text-2xl font-bold ${textColor}`}>10K+</div>
                    <div className={`text-sm ${textMuted}`}>Active Users</div>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${cardBg} border ${borderColor} rounded-lg px-6 py-4`}>
                  <Trophy className="w-8 h-8 text-orange-500" />
                  <div>
                    <div className={`text-2xl font-bold ${textColor}`}>50K+</div>
                    <div className={`text-sm ${textMuted}`}>Battles Completed</div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-3.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
              >
                Get involved
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-8 shadow-xl`}>
              <h3 className={`text-xl font-bold mb-6 ${textColor}`}>Connect with us</h3>
              <div className="space-y-4">
                <a href="https://github.com" className={`flex items-center gap-3 p-4 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className="w-10 h-10 bg-gray-500/10 rounded-lg flex items-center justify-center">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`font-medium ${textColor}`}>GitHub</div>
                    <div className={`text-sm ${textMuted}`}>Star us on GitHub</div>
                  </div>
                </a>
                <a href="https://linkedin.com" className={`flex items-center gap-3 p-4 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className={`font-medium ${textColor}`}>LinkedIn</div>
                    <div className={`text-sm ${textMuted}`}>Follow for updates</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn Section */}
      <section id="learn" className={`py-20 ${isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl font-bold mb-6 ${textColor}`}>Learn competitive programming</h2>
          <p className={`text-lg ${textMuted} max-w-2xl mx-auto mb-8`}>
            New to competitive programming? Begin with CodeBattle's curated learning paths and master algorithms step by step.
          </p>
          <button 
            onClick={() => navigate('/problems')}
            className="px-8 py-3.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
          >
            Explore resources
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${bgColor} border-t ${borderColor}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl font-bold mb-6 ${textColor}`}>Start building with CodeBattle</h2>
          <p className={`text-lg ${textMuted} mb-8 max-w-2xl mx-auto`}>
            Join thousands of developers who are improving their coding skills through real-time battles and challenges.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-3.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
            >
              Install CodeBattle
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/problems')}
              className={`px-8 py-3.5 rounded-lg font-medium transition-colors inline-flex items-center gap-2 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Explore tutorials
              <ChevronRight className="w-5 h-5" />
            </button>
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
                <li><a href="#" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>Tutorials</a></li>
                <li><a href="#" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>Documentation</a></li>
                <li><a href="#" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>Examples</a></li>
              </ul>
            </div>
            {/* Column 2 */}
            <div>
              <h4 className={`font-bold mb-4 ${textColor}`}>Practice</h4>
              <ul className="space-y-2">
                <li><a href="#" onClick={() => navigate('/problems')} className={`text-sm ${textMuted} hover:text-orange-500 transition-colors cursor-pointer`}>Problems</a></li>
                <li><a href="#" onClick={() => navigate('/contests')} className={`text-sm ${textMuted} hover:text-orange-500 transition-colors cursor-pointer`}>Contests</a></li>
                <li><a href="#" onClick={() => navigate('/daily-challenge')} className={`text-sm ${textMuted} hover:text-orange-500 transition-colors cursor-pointer`}>Daily Challenge</a></li>
              </ul>
            </div>
            {/* Column 3 */}
            <div>
              <h4 className={`font-bold mb-4 ${textColor}`}>Community</h4>
              <ul className="space-y-2">
                <li><a href="https://github.com" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>GitHub</a></li>
                <li><a href="https://linkedin.com" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>LinkedIn</a></li>
                <li><a href="#" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>Blog</a></li>
              </ul>
            </div>
            {/* Column 4 */}
            <div>
              <h4 className={`font-bold mb-4 ${textColor}`}>About</h4>
              <ul className="space-y-2">
                <li><a href="#" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>Why CodeBattle</a></li>
                <li><a href="#" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>Team</a></li>
                <li><a href="#" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>Contact</a></li>
              </ul>
            </div>
          </div>
          <div className={`pt-8 border-t ${borderColor} flex flex-col sm:flex-row justify-between items-center gap-4`}>
            <p className={`text-sm ${textMuted}`}>© 2025 CodeBattle. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>Terms</a>
              <a href="#" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>Privacy</a>
              <a href="#" className={`text-sm ${textMuted} hover:text-orange-500 transition-colors`}>Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

