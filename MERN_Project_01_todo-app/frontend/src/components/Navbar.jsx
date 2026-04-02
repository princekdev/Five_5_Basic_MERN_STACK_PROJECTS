import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    setShowMenu(false);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-ink-100">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-ink-900 rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="font-sans font-bold text-ink-800 tracking-tight">Taskr</span>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-parchment transition-all group"
          >
            <div className="w-7 h-7 bg-ember rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white font-mono">{initials}</span>
            </div>
            <span className="text-sm font-sans text-ink-600 hidden sm:block">{user?.name}</span>
            <svg
              className={`w-3.5 h-3.5 text-ink-300 transition-transform ${showMenu ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-paper-lg border border-ink-100 overflow-hidden animate-slide-down z-50">
                <div className="px-4 py-3 border-b border-ink-50">
                  <p className="text-xs font-mono text-ink-300 uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-sans text-ink-700 font-medium truncate mt-0.5">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-sans text-red-500 hover:bg-red-50 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
