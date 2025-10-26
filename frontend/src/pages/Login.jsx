import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { Code2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code2 className="w-8 h-8 text-indigo-500" />
            <h1 className="text-3xl font-bold gradient-text">CodeBattle</h1>
          </div>
          <p className="text-slate-400">Compete, Code, Conquer</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-500 hover:text-indigo-400 font-semibold">
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-500 mb-2">⚡</div>
            <p className="text-sm text-slate-400">Real-time Matches</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500 mb-2">🏆</div>
            <p className="text-sm text-slate-400">ELO Rating</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-500 mb-2">👥</div>
            <p className="text-sm text-slate-400">Challenge Friends</p>
          </div>
        </div>
      </div>
    </div>
  );
}

