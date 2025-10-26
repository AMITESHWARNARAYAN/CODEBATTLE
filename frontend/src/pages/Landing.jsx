import { useNavigate } from 'react-router-dom';
import { Code2, Zap, Trophy, Users, ArrowRight, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDark(savedTheme === 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-8 h-8 text-cyan-500" />
            <h1 className="text-2xl font-bold">CodeBattle</h1>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className={`text-sm font-medium transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Premium</a>
            <a href="#" className={`text-sm font-medium transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Explore</a>
            <a href="#" className={`text-sm font-medium transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Product</a>
            <a href="#" className={`text-sm font-medium transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Developer</a>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => navigate('/login')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'}`}
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`relative overflow-hidden py-24 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="z-10">
            <h2 className="text-6xl font-bold mb-6 leading-tight">
              A New Way to Learn
            </h2>
            <p className={`text-lg mb-8 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              CodeBattle is the best platform to help you enhance your skills, expand your knowledge and prepare for technical interviews.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold flex items-center gap-2 transition"
            >
              Create Account <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Illustration */}
          <div className="relative h-96">
            <div className={`absolute inset-0 rounded-3xl ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-100 to-slate-200'} shadow-2xl overflow-hidden`}>
              {/* Colorful cards illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-6 p-12">
                  <div className="w-20 h-20 bg-blue-400 rounded-lg shadow-lg"></div>
                  <div className="w-20 h-20 bg-green-400 rounded-lg shadow-lg"></div>
                  <div className="w-20 h-20 bg-yellow-400 rounded-lg shadow-lg"></div>
                  <div className="w-20 h-20 bg-red-400 rounded-lg shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagonal divider */}
        <div className={`absolute bottom-0 left-0 right-0 h-24 ${isDark ? 'bg-slate-900' : 'bg-slate-50'} transform -skew-y-3 origin-left`}></div>
      </section>

      {/* Start Exploring Section */}
      <section className={`py-24 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-bold">Start Exploring</h2>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-cyan-600' : 'bg-cyan-500'}`}>
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>

          <p className={`text-lg mb-16 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Explore is a well-organized tool that helps you get the most out of CodeBattle by providing structure to guide your progress towards the next level.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Real-Time Matches',
                desc: 'Compete live with other developers in real-time coding battles'
              },
              {
                icon: '🏆',
                title: 'ELO Rating System',
                desc: 'Track your skill progression with our advanced rating system'
              },
              {
                icon: '👥',
                title: 'Friend Challenges',
                desc: 'Challenge your friends directly and prove your coding skills'
              }
            ].map((feature, idx) => (
              <div key={idx} className={`p-8 rounded-2xl transition transform hover:scale-105 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:shadow-lg border border-slate-200'}`}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-24 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Start Coding?</h3>
          <p className={`text-lg mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Join thousands of developers improving their skills through competitive coding.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} border-t py-8`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={isDark ? 'text-slate-500' : 'text-slate-600'}>© 2025 CodeBattle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

