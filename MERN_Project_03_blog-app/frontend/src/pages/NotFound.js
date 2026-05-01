import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 page-enter">
      <div className="text-center space-y-5 max-w-sm">
        <p className="font-mono text-7xl font-bold text-ink-200">404</p>
        <h1 className="font-serif text-3xl font-bold text-ink-900">Page not found</h1>
        <p className="text-ink-500 font-sans text-sm leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/" className="btn-primary">Go Home</Link>
          <button onClick={() => window.history.back()} className="btn-secondary">Go Back</button>
        </div>
      </div>
    </div>
  );
}
 