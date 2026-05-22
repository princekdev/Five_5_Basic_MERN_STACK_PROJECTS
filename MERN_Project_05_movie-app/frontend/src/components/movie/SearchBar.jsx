import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';

const SearchBar = ({ initialQuery = '', autoFocus = false, large = false }) => {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 400);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      navigate(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
    }
  }, [debouncedQuery, navigate]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative ${large ? 'max-w-2xl' : 'max-w-md'}`}>
        <svg className={`absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 ${large ? 'w-5 h-5' : 'w-4 h-4'}`}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies…"
          autoFocus={autoFocus}
          className={`w-full bg-zinc-800/80 border border-zinc-700 rounded-xl text-white placeholder-zinc-500
            focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all
            ${large ? 'pl-12 pr-4 py-4 text-base' : 'pl-10 pr-4 py-2.5 text-sm'}`}
        />
        {query && (
          <button type="button" onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};
export default SearchBar;
