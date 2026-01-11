import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">WSB Trading</h1>
            <p className="text-gray-400">Welcome back to the market</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-400 mt-1 flex-shrink-0" size={20} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field pl-10" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <p className="text-gray-400 text-xs font-semibold mb-2">Demo Credentials:</p>
            <p className="text-gray-500 text-xs">Email: test@example.com</p>
            <p className="text-gray-500 text-xs">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
