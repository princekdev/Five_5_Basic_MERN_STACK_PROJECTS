import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };
 
  const navLinkClass = ({ isActive }) =>
    `text-sm font-sans transition-colors duration-150 ${
      isActive ? 'text-accent font-medium' : 'text-ink-600 hover:text-ink-900'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-parchment/95 backdrop-blur-sm border-b border-ink-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif text-xl font-bold text-ink-950 group-hover:text-accent transition-colors">
              Inkwell
            </span>
            <span className="hidden sm:inline text-ink-400 text-xs font-mono mt-1">/ blog</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/posts/new" className={navLinkClass}>Write</NavLink>
                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-ink-200">
                  <span className="text-sm text-ink-500 font-sans">
                    Hi, <span className="text-ink-800 font-medium">{user.name.split(' ')[0]}</span>
                  </span>
                  <button onClick={handleLogout} className="btn-secondary text-xs py-1.5">
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink to="/login" className={navLinkClass}>Sign In</NavLink>
                <Link to="/register" className="btn-primary text-xs py-2">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded text-ink-600 hover:bg-ink-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-ink-200 bg-white px-4 py-4 space-y-3">
          <NavLink to="/" className={navLinkClass} end onClick={() => setMenuOpen(false)}>Home</NavLink>
          {user ? (
            <>
              <div><NavLink to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink></div>
              <div><NavLink to="/posts/new" className={navLinkClass} onClick={() => setMenuOpen(false)}>Write Post</NavLink></div>
              <div className="pt-2 border-t border-ink-100">
                <p className="text-xs text-ink-500 mb-2">{user.email}</p>
                <button onClick={handleLogout} className="btn-secondary text-xs py-1.5 w-full">Sign Out</button>
              </div>
            </>
          ) : (
            <>
              <div><NavLink to="/login" className={navLinkClass} onClick={() => setMenuOpen(false)}>Sign In</NavLink></div>
              <div><Link to="/register" className="btn-primary text-xs py-2 inline-block" onClick={() => setMenuOpen(false)}>Get Started</Link></div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
