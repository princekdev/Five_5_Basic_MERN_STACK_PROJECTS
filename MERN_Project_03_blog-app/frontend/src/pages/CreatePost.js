import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import PostForm from '../components/PostForm';

export default function CreatePost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/posts', payload);
      navigate(`/posts/${data._id}`);
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 page-enter">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 font-sans mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>
        <h1 className="font-serif text-3xl font-bold text-ink-950">Write a new post</h1>
        <p className="text-sm text-ink-500 font-sans mt-1">Share your thoughts with the world.</p>
      </div>

      <div className="bg-white border border-ink-200 rounded-xl shadow-sm p-6 sm:p-8">
        <PostForm
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Publish Post"
        />
      </div>
    </div>
  );
}
