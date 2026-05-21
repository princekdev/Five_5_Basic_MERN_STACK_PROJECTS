import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-amber-400' : 'text-zinc-400 hover:text-white'}`;

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🎬</span>
            <span className="text-lg font-black tracking-tight text-white">
              CINE<span className="text-amber-400">VERSE</span>
            </span>
          </Link> 

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/discover" className={linkClass}>Discover</NavLink>
            {isAuthenticated && <NavLink to="/favorites" className={linkClass}>Favorites</NavLink>}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-400">Hi, <span className="text-white font-medium">{user?.username}</span></span>
                <button onClick={handleLogout}
                  className="px-4 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg transition-all">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-1.5 text-sm text-zinc-300 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-1.5 text-sm bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-zinc-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-4 py-4 space-y-3">
          <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <br />
          <NavLink to="/discover" className={linkClass} onClick={() => setMenuOpen(false)}>Discover</NavLink>
          {isAuthenticated && <><br /><NavLink to="/favorites" className={linkClass} onClick={() => setMenuOpen(false)}>Favorites</NavLink></>}
          <div className="pt-3 border-t border-zinc-800">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="w-full text-left text-sm text-zinc-400 hover:text-white transition-colors">
                Logout ({user?.username})
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="text-sm text-zinc-400 hover:text-white" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="text-sm text-amber-400 hover:text-amber-300 font-semibold" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
