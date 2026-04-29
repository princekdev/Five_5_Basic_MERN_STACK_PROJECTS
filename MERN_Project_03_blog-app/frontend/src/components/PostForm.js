import React, { useState, useEffect } from 'react';
import Alert from './Alert';

export default function PostForm({ initialData = {}, onSubmit, loading, submitLabel = 'Publish Post' }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    excerpt: initialData.excerpt || '',
    tags: initialData.tags ? initialData.tags.join(', ') : '',
    coverImage: initialData.coverImage || '',
  });
  const [error, setError] = useState('');

  // Keep in sync if initialData changes (edit mode)
  useEffect(() => {
    if (initialData.title) {
      setForm({
        title: initialData.title || '',
        content: initialData.content || '',
        excerpt: initialData.excerpt || '',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        coverImage: initialData.coverImage || '',
      });
    }
  }, [initialData.title]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.content.trim()) return setError('Content is required.');

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      excerpt: form.excerpt.trim() || undefined,
      coverImage: form.coverImage.trim() || undefined,
      tags: form.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Title */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="block text-sm font-medium text-ink-700 font-sans">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Give your post a compelling title..."
          className="input-field font-serif text-lg"
          maxLength={150}
          required
        />
        <p className="text-xs text-ink-400 text-right font-mono">{form.title.length}/150</p>
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <label htmlFor="content" className="block text-sm font-medium text-ink-700 font-sans">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Write your story here..."
          rows={18}
          className="input-field resize-y leading-relaxed"
          required
        />
        <p className="text-xs text-ink-400 font-mono">{wordCount} words · ~{Math.max(1, Math.ceil(wordCount / 200))} min read</p>
      </div>

      {/* Excerpt */}
      <div className="space-y-1.5">
        <label htmlFor="excerpt" className="block text-sm font-medium text-ink-700 font-sans">
          Excerpt{' '}
          <span className="text-ink-400 font-normal">(optional — auto-generated if blank)</span>
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="A short summary shown in post listings..."
          rows={3}
          className="input-field resize-none"
          maxLength={300}
        />
        <p className="text-xs text-ink-400 text-right font-mono">{form.excerpt.length}/300</p>
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <label htmlFor="tags" className="block text-sm font-medium text-ink-700 font-sans">
          Tags <span className="text-ink-400 font-normal">(comma separated)</span>
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={form.tags}
          onChange={handleChange}
          placeholder="e.g. technology, design, personal"
          className="input-field font-mono text-sm"
        />
        {form.tags && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {form.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
              <span key={tag} className="tag-badge">{tag.toLowerCase()}</span>
            ))}
          </div>
        )}
      </div>

      {/* Cover Image URL */}
      <div className="space-y-1.5">
        <label htmlFor="coverImage" className="block text-sm font-medium text-ink-700 font-sans">
          Cover Image URL <span className="text-ink-400 font-normal">(optional)</span>
        </label>
        <input
          id="coverImage"
          name="coverImage"
          type="url"
          value={form.coverImage}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="input-field"
        />
        {form.coverImage && (
          <img
            src={form.coverImage}
            alt="Cover preview"
            className="mt-2 h-32 w-full object-cover rounded border border-ink-200"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-ink-100">
        <button type="button" onClick={() => window.history.back()} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-accent">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Saving…
            </span>
          ) : submitLabel}
        </button>
      </div>
    </form>
  );
}
