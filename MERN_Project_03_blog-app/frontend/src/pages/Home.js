import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(''); 
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 9 };
      if (query) params.search = query;
      const { data } = await api.get('/posts', { params });
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch {
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  };

  const handleClearSearch = () => {
    setSearch('');
    setQuery('');
    setPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <header className="text-center mb-14 page-enter">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-950 leading-tight mb-4">
          Stories worth<br />
          <span className="italic text-accent">reading.</span>
        </h1>
        <p className="text-ink-500 font-sans text-base max-w-md mx-auto leading-relaxed">
          Discover thoughtful essays, technical deep-dives, and personal stories from writers around the world.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link to="/register" className="btn-accent">Start Writing</Link>
          <Link to="/login" className="btn-secondary">Sign In</Link>
        </div>
      </header>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-10 max-w-lg mx-auto">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts…"
          className="input-field flex-1"
        />
        <button type="submit" className="btn-primary px-4">Search</button>
        {query && (
          <button type="button" onClick={handleClearSearch} className="btn-secondary px-4">
            Clear
          </button>
        )}
      </form>

      {/* Search context */}
      {query && !loading && (
        <p className="text-sm text-ink-500 mb-6 text-center font-sans">
          {pagination.totalPosts > 0
            ? `${pagination.totalPosts} result${pagination.totalPosts !== 1 ? 's' : ''} for "${query}"`
            : `No results for "${query}"`}
        </p>
      )}

      {/* Error */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" message="Loading posts…" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <p className="font-serif text-2xl text-ink-400">No posts yet.</p>
          <p className="text-sm text-ink-400 font-sans">Be the first to share your story.</p>
          <Link to="/register" className="btn-accent inline-block mt-4">Write the First Post</Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        </>
      )}
    </div>
  );
}
