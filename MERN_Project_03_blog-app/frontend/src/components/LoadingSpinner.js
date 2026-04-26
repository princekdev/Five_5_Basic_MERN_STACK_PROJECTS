import React from 'react';

export default function LoadingSpinner({ fullPage = false, size = 'md', message = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-10 h-10' };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        className={`${sizes[size]} animate-spin text-ink-400`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      {message && <p className="text-sm text-ink-500 font-sans">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-parchment z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
