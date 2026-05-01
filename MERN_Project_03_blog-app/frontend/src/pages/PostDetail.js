import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import ConfirmDialog from '../components/ConfirmDialog';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function readingTime(content = '') {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Post not found.' : 'Failed to load post.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      navigate('/dashboard', { state: { message: 'Post deleted successfully.' } });
    } catch {
      setError('Failed to delete post.');
      setDeleteDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  const isOwner = user && post && user._id === post.author?._id;

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="font-serif text-2xl text-ink-400">{error}</p>
        <Link to="/" className="btn-secondary inline-block">← Back to Home</Link>
      </div>
    );
  }

  if (!post) return null;

  // Render newlines as paragraphs
  const paragraphs = post.content.split(/\n\n+/).filter(Boolean);

  return (
    <>
      <article className="max-w-2xl mx-auto px-4 sm:px-6 py-12 page-enter">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 font-sans mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All posts
        </Link>

        {/* Cover image */}
        {post.coverImage && (
          <div className="mb-8 -mx-4 sm:-mx-6 overflow-hidden rounded-none sm:rounded-xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-56 sm:h-72 object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.tags.map((tag) => <span key={tag} className="tag-badge">{tag}</span>)}
          </div>
        )}

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950 leading-tight mb-5">
          {post.title}
        </h1>

        {/* Author / meta */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-ink-100 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-ink-200 flex items-center justify-center text-sm font-semibold text-ink-700 font-sans">
              {post.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-ink-800 font-sans">{post.author?.name}</p>
              <p className="text-xs text-ink-500 font-sans">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-400 font-mono">{readingTime(post.content)}</span>
            {isOwner && (
              <div className="flex gap-2">
                <Link to={`/posts/${post._id}/edit`} className="btn-secondary text-xs py-1.5">Edit</Link>
                <button
                  onClick={() => setDeleteDialog(true)}
                  className="btn-danger text-xs py-1.5"
                  disabled={deleting}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="prose-content space-y-4">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="mt-12 pt-8 border-t border-ink-100 flex items-center justify-between">
          <Link to="/" className="btn-secondary text-xs">← All Posts</Link>
          {isOwner && (
            <Link to={`/posts/${post._id}/edit`} className="btn-secondary text-xs">Edit Post</Link>
          )}
        </div>
      </article>

      <ConfirmDialog
        isOpen={deleteDialog}
        title="Delete this post?"
        message={`"${post.title}" will be permanently deleted. This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
        confirmLabel={deleting ? 'Deleting…' : 'Delete Post'}
      />
    </>
  );
}
