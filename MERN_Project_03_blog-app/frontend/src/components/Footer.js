import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-ink-900">Inkwell</span>
            <span className="text-ink-300 text-xs font-mono">/ blog</span>
          </div>
          <nav className="flex items-center gap-6 text-xs text-ink-500 font-sans">
            <Link to="/" className="hover:text-ink-800 transition-colors">Home</Link>
            <Link to="/register" className="hover:text-ink-800 transition-colors">Sign Up</Link>
            <Link to="/login" className="hover:text-ink-800 transition-colors">Sign In</Link>
          </nav>
          <p className="text-xs text-ink-400 font-sans">
            © {new Date().getFullYear()} Inkwell. Built with MERN.
          </p>
        </div>
      </div>
    </footer>
  );
}
 