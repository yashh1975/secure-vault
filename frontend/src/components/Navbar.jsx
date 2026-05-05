import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Cloud, UploadCloud } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-6">
      <div className="bg-white/70 backdrop-blur-md shadow-sm border border-slate-200/50 rounded-2xl">
        <div className="flex justify-between h-16 px-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary-500 text-white p-2 rounded-xl group-hover:bg-primary-600 transition-colors">
                <Cloud size={24} />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">SecureVault</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/upload" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                  <UploadCloud size={18} />
                  <span>Upload</span>
                </Link>
                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full">{user.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
                <Link to="/signup" className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-primary-700 transition-all hover:shadow">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
