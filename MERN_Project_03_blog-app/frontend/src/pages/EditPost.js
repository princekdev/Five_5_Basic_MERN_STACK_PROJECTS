import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function EditPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
 
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);

        // Only allow the owner to edit
        if (data.author?._id !== user?._id) {
          navigate('/', { replace: true });
          return;
        }

        setPost(data);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Post not found.' : 'Failed to load post.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      await api.put(`/posts/${id}`, payload);
      navigate(`/posts/${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="font-serif text-2xl text-ink-400">{error}</p>
        <Link to="/dashboard" className="btn-secondary inline-block">← Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 page-enter">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={`/posts/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 font-sans mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to post
        </Link>
        <h1 className="font-serif text-3xl font-bold text-ink-950">Edit post</h1>
        <p className="text-sm text-ink-500 font-sans mt-1 line-clamp-1">{post?.title}</p>
      </div>

      <div className="bg-white border border-ink-200 rounded-xl shadow-sm p-6 sm:p-8">
        <PostForm
          initialData={post}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
