import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import ConfirmDialog from '../components/ConfirmDialog';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function readingTime(content = '') {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
} 

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const { data } = await api.get('/posts/my');
        setPosts(data);
      } catch {
        setError('Failed to load your posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${deleteTarget._id}`);
      setPosts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setSuccess('Post deleted successfully.');
    } catch {
      setError('Failed to delete post.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const totalWords = posts.reduce((acc, p) => acc + (p.content?.split(/\s+/).length || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 page-enter">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-950">
            Your Dashboard
          </h1>
          <p className="text-ink-500 font-sans text-sm mt-1">
            Welcome back, <span className="font-medium text-ink-700">{user?.name}</span>
          </p>
        </div>
        <Link to="/posts/new" className="btn-accent flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {/* Alerts */}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Stats */}
      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Posts', value: posts.length },
            { label: 'Words', value: totalWords.toLocaleString() },
            { label: 'Est. read time', value: `${Math.max(1, Math.ceil(totalWords / 200))} min` },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-ink-100 rounded-lg p-4 text-center">
              <p className="font-serif text-2xl font-bold text-ink-900">{stat.value}</p>
              <p className="text-xs text-ink-500 font-sans mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Posts list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" message="Loading your posts…" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24 space-y-4 bg-white border border-ink-100 rounded-xl">
          <div className="text-4xl">✍️</div>
          <p className="font-serif text-xl text-ink-600">No posts yet</p>
          <p className="text-sm text-ink-400 font-sans">Share your first story with the world.</p>
          <Link to="/posts/new" className="btn-accent inline-block mt-2">Write Your First Post</Link>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="font-serif text-lg font-semibold text-ink-800 mb-4">
            All Posts ({posts.length})
          </h2>
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white border border-ink-100 rounded-lg px-5 py-4 flex items-start gap-4 hover:border-ink-300 transition-colors duration-150"
            >
              <div className="flex-1 min-w-0">
                <Link
                  to={`/posts/${post._id}`}
                  className="font-serif text-base font-semibold text-ink-900 hover:text-accent transition-colors line-clamp-1"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 mt-1 text-xs text-ink-400 font-sans">
                  <span>{formatDate(post.createdAt)}</span>
                  <span>·</span>
                  <span>{readingTime(post.content)}</span>
                  {post.tags?.length > 0 && (
                    <>
                      <span>·</span>
                      <span className="font-mono">{post.tags.slice(0, 2).join(', ')}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/posts/${post._id}`}
                  className="text-xs text-ink-500 hover:text-ink-800 font-sans transition-colors px-2 py-1"
                >
                  View
                </Link>
                <Link
                  to={`/posts/${post._id}/edit`}
                  className="btn-secondary text-xs py-1.5"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteTarget(post)}
                  className="btn-danger text-xs py-1.5"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete post?"
        message={`"${deleteTarget?.title}" will be permanently deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
      />
    </div>
  );
}
