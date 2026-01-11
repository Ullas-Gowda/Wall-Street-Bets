import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Menu, X, LogOut, TrendingUp } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/market', label: 'Market' },
    { path: '/trade', label: 'Trade' },
    { path: '/portfolio', label: 'Portfolio' },
  ];

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 text-2xl font-bold gradient-text hover:opacity-80 transition-opacity">
            <TrendingUp size={28} />
            <span>WSB</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`transition-colors font-medium ${
                  isActive(path)
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* User & Logout */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-300">{user.name}</p>
                  <p className="text-xs text-gray-500">${user.balance?.toLocaleString()}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 px-4 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                {label}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left py-2 px-4 text-gray-300 hover:bg-slate-700 rounded-lg flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
