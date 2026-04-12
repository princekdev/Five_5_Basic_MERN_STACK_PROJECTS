import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CATEGORY_COLORS, CATEGORY_ICONS, NOTE_COLORS } from "./constants";

export const NoteCard = ({ note, onEdit, onDelete, onTogglePin }) => {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const catStyle = CATEGORY_COLORS[note.category] || CATEGORY_COLORS.Other;
  const colorStyle = NOTE_COLORS[note.color] || NOTE_COLORS.default;

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    try { await onDelete(note._id); } finally { setDeleting(false); }
  };

  const timeAgo = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true });

  return (
    <article
      className={`group relative rounded-xl border p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 animate-fade-in ${colorStyle.card} ${colorStyle.accent}`}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute top-3 right-3 text-amber-500 text-sm" title="Pinned">📌</div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 pr-6">
        <h3 className="font-display text-parchment-50 text-base font-semibold leading-snug line-clamp-2">
          {note.title}
        </h3>
      </div>

      {/* Content preview */}
      <p className="text-sm text-parchment-200/60 leading-relaxed line-clamp-3 flex-1">
        {note.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className={`tag ${catStyle.bg} ${catStyle.text} ${catStyle.border} border`}>
            {CATEGORY_ICONS[note.category]} {note.category}
          </span>
          <span className="text-xs text-ink-600">{timeAgo}</span>
        </div>

        {/* Actions - visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionBtn
            title={note.isPinned ? "Unpin" : "Pin"}
            onClick={() => onTogglePin(note._id)}
            className="text-amber-500/60 hover:text-amber-400 hover:bg-amber-500/10"
          >
            📌
          </ActionBtn>
          <ActionBtn
            title="Edit"
            onClick={() => onEdit(note)}
            className="text-parchment-200/50 hover:text-parchment-50 hover:bg-ink-700"
          >
            <EditIcon />
          </ActionBtn>
          {confirmDelete ? (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs px-2 py-1 rounded bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {deleting ? "…" : "Sure?"}
            </button>
          ) : (
            <ActionBtn
              title="Delete"
              onClick={handleDelete}
              className="text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10"
            >
              <TrashIcon />
            </ActionBtn>
          )}
        </div>
      </div>
      {confirmDelete && !deleting && (
        <button
          onClick={() => setConfirmDelete(false)}
          className="absolute inset-0 rounded-xl"
          aria-label="cancel delete"
        />
      )}
    </article>
  );
};

const ActionBtn = ({ children, title, onClick, className }) => (
  <button
    title={title}
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`w-7 h-7 rounded-md flex items-center justify-center text-sm transition-all ${className}`}
  >
    {children}
  </button>
);

const EditIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
