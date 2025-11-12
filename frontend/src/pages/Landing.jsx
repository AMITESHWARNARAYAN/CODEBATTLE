import { useNavigate } from 'react-router-dom';
import { CodeBracketIcon, BoltIcon, TrophyIcon, UserGroupIcon, ArrowRightIcon, MoonIcon, SunIcon, CommandLineIcon, ClockIcon, ArrowTrendingUpIcon, PlayIcon, ArrowTopRightOnSquareIcon, SparklesIcon, ChevronRightIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import { useThemeStore } from '../store/themeStore';
import { useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const [hoveredCard, setHoveredCard] = useState(null);

  // TensorFlow-inspired color scheme
  const bgColor = isDark ? 'bg-[#0a0a0a]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
  const cardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-white';

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-200`}>
      {/* Header - TensorFlow Style */}
      <header className={`${isDark ? 'bg-[#0a0a0a]/95' : 'bg-white/95'} border-b ${borderColor} sticky top-0 z-50 backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                <CodeBracketIcon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${textColor}`}>CodeBattle</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className={`text-sm font-medium ${textMuted} hover:text-orange-500 transition-colors`}>
                Features
              </a>
              <a href="#ecosystem" className={`text-sm font-medium ${textMuted} hover:text-orange-500 transition-colors`}>
                Ecosystem
              </a>
              <a href="#community" className={`text-sm font-medium ${textMuted} hover:text-orange-500 transition-colors`}>
                Community
              </a>
              <a href="#learn" className={`text-sm font-medium ${textMuted} hover:text-orange-500 transition-colors`}>
                Learn
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
              >
                {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => navigate('/login')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - TensorFlow Style */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 ${textColor}`}>
                An end-to-end platform for
                <span className="block mt-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  competitive coding
                </span>
              </h1>
              <p className={`text-lg sm:text-xl mb-8 ${textMuted} max-w-xl`}>
                Master algorithms through real-time battles, track your progress with ELO rankings, and prepare for technical interviews.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-3.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 inline-flex items-center gap-2"
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

            {/* Right Content - Code Example */}
            <div className={`relative rounded-2xl border ${borderColor} ${cardBg} p-6 shadow-2xl`}>
              <div className={`flex items-center gap-2 mb-4 pb-4 border-b ${borderColor}`}>
                <Terminal className="w-5 h-5 text-orange-500" />
                <span className={`text-sm font-medium ${textColor}`}>Quick Start</span>
                <button className="ml-auto text-sm text-orange-500 hover:text-orange-600 inline-flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  Run code
                </button>
              </div>
              <pre className={`text-sm ${textMuted} overflow-x-auto`}>
                <code>{`// Two Sum Problem
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
// Output: [0, 1]`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section - TensorFlow Style */}
      <section id="features" className={`py-20 ${isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${textColor}`}>Get started with CodeBattle</h2>
            <p className={`text-lg ${textMuted} max-w-2xl mx-auto`}>
              CodeBattle makes it easy to practice competitive programming in any environment. Learn through interactive battles and track your progress.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div 
              className={`${cardBg} border ${borderColor} rounded-xl p-8 transition-all duration-300 ${hoveredCard === 1 ? 'shadow-2xl scale-105' : 'shadow-lg'}`}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${textColor}`}>Real-time Battles</h3>
              <p className={`${textMuted} mb-4`}>
                Compete head-to-head with other coders in real-time. Test your speed and accuracy under pressure.
              </p>
              <button 
                onClick={() => navigate('/matchmaking')}
                className="text-orange-500 hover:text-orange-600 inline-flex items-center gap-1 text-sm font-medium"
              >
                View tutorials
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature 2 */}
            <div 
              className={`${cardBg} border ${borderColor} rounded-xl p-8 transition-all duration-300 ${hoveredCard === 2 ? 'shadow-2xl scale-105' : 'shadow-lg'}`}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${textColor}`}>ELO Rankings</h3>
              <p className={`${textMuted} mb-4`}>
                Track your progress with a professional ELO rating system. Climb the leaderboard as you improve.
              </p>
              <button 
                onClick={() => navigate('/leaderboard')}
                className="text-orange-500 hover:text-orange-600 inline-flex items-center gap-1 text-sm font-medium"
              >
                Run quickstart
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature 3 */}
            <div 
              className={`${cardBg} border ${borderColor} rounded-xl p-8 transition-all duration-300 ${hoveredCard === 3 ? 'shadow-2xl scale-105' : 'shadow-lg'}`}
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                <Trophy className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${textColor}`}>Daily Challenges</h3>
              <p className={`${textMuted} mb-4`}>
                Solve curated problems every day. Build consistency and maintain your coding streak.
              </p>
              <button 
                onClick={() => navigate('/daily-challenge')}
                className="text-orange-500 hover:text-orange-600 inline-flex items-center gap-1 text-sm font-medium"
              >
                Explore challenges
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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

