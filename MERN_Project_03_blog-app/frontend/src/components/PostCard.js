import React from 'react';
import { Link } from 'react-router-dom';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function readingTime(content = '') {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

export default function PostCard({ post }) {
  const { _id, title, excerpt, content, author, createdAt, tags = [] } = post;

  return (
    <article className="card p-6 flex flex-col gap-4 page-enter">
      {/* Meta */}
      <div className="flex items-center gap-2 text-xs text-ink-500 font-sans">
        <span className="font-medium text-ink-700">{author?.name || 'Unknown'}</span> 
        <span className="text-ink-300">·</span>
        <time dateTime={createdAt}>{formatDate(createdAt)}</time>
        <span className="text-ink-300">·</span>
        <span>{readingTime(content)}</span>
      </div>

      {/* Title */}
      <Link to={`/posts/${_id}`}>
        <h2 className="font-serif text-xl font-semibold text-ink-950 leading-snug hover:text-accent transition-colors duration-150 line-clamp-2">
          {title}
        </h2>
      </Link>

      {/* Excerpt */}
      <p className="text-sm text-ink-600 font-sans leading-relaxed line-clamp-3">
        {excerpt}
      </p>

      {/* Tags + Read more */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-badge">{tag}</span>
          ))}
        </div>
        <Link
          to={`/posts/${_id}`}
          className="text-xs font-medium text-accent hover:text-orange-700 transition-colors flex items-center gap-1"
        >
          Read
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
