import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = res.data.data;
      setAuth(user, accessToken, refreshToken);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full flex bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/50 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Left Side Branding */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-primary-600 to-primary-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-primary-400/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
          
          <div className="relative z-10">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20 shadow-xl">
              <ShieldCheck size={36} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight leading-tight">Secure your digital life.</h1>
            <p className="text-primary-100 text-lg leading-relaxed">
              Military-grade AES-256 encryption. End-to-end secure file sharing. Zero knowledge architecture.
            </p>
          </div>
          
          <div className="relative z-10">
            <div className="flex -space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full border-2 border-primary-700 bg-primary-400"></div>
              <div className="w-10 h-10 rounded-full border-2 border-primary-700 bg-primary-300"></div>
              <div className="w-10 h-10 rounded-full border-2 border-primary-700 bg-primary-200"></div>
            </div>
            <p className="text-sm font-medium text-primary-100">Join thousands of secure users</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white/50">
          <div className="md:hidden flex justify-center mb-6">
            <div className="bg-primary-50 p-3 rounded-full text-primary-600">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2 text-slate-900 text-center md:text-left">Welcome Back</h2>
          <p className="text-slate-500 mb-8 text-center md:text-left">Sign in to access your secure vault</p>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm font-medium">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-slate-500">
              Don't have an account? <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;
