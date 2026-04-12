import { useState, useEffect, useRef } from "react";
import { CATEGORIES, NOTE_COLORS } from "./constants";

const COLOR_OPTIONS = [
  { key: "default", label: "Default", swatch: "bg-ink-700" },
  { key: "amber",   label: "Amber",   swatch: "bg-amber-700/60" },
  { key: "rose",    label: "Rose",    swatch: "bg-rose-700/60" },
  { key: "emerald", label: "Emerald", swatch: "bg-emerald-700/60" },
  { key: "sky",     label: "Sky",     swatch: "bg-sky-700/60" },
  { key: "violet",  label: "Violet",  swatch: "bg-violet-700/60" },
];

const INITIAL = { title: "", content: "", category: "Personal", color: "default", isPinned: false };

export const NoteModal = ({ note, onSave, onClose }) => {
  const [form, setForm] = useState(note ? {
    title: note.title,
    content: note.content,
    category: note.category,
    color: note.color || "default",
    isPinned: note.isPinned || false,
  } : INITIAL);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    else if (form.title.length > 120) errs.title = "Max 120 characters";
    if (!form.content.trim()) errs.content = "Content is required";
    else if (form.content.length > 5000) errs.content = "Max 5000 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Failed to save note" });
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-xl bg-ink-900 border border-ink-700 rounded-2xl shadow-2xl shadow-black/60 animate-scale-in flex flex-col max-h-[90vh]">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-800">
          <h2 className="font-display text-lg text-parchment-50">
            {note ? "Edit Note" : "New Note"}
          </h2>
          <button onClick={onClose} className="text-ink-600 hover:text-parchment-100 transition-colors text-xl leading-none">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">
          {errors.submit && (
            <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              {errors.submit}
            </p>
          )}

          {/* Title */}
          <div>
            <input
              ref={titleRef}
              type="text"
              placeholder="Note title…"
              value={form.title}
              onChange={set("title")}
              maxLength={120}
              className={`input-field font-display text-base ${errors.title ? "border-rose-500" : ""}`}
            />
            <div className="flex justify-between mt-1">
              {errors.title ? <p className="text-xs text-rose-400">{errors.title}</p> : <span />}
              <span className={`text-xs ${form.title.length > 100 ? "text-amber-500" : "text-ink-600"}`}>
                {form.title.length}/120
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <textarea
              placeholder="Write your note here…"
              value={form.content}
              onChange={set("content")}
              maxLength={5000}
              rows={7}
              className={`input-field resize-none leading-relaxed ${errors.content ? "border-rose-500" : ""}`}
            />
            <div className="flex justify-between mt-1">
              {errors.content ? <p className="text-xs text-rose-400">{errors.content}</p> : <span />}
              <span className={`text-xs ${form.content.length > 4500 ? "text-amber-500" : "text-ink-600"}`}>
                {form.content.length}/5000
              </span>
            </div>
          </div>

          {/* Category & Options row */}
          <div className="flex gap-3 flex-wrap">
            {/* Category */}
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs text-ink-600 mb-1.5 font-mono uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={set("category")} className="input-field text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-xs text-ink-600 mb-1.5 font-mono uppercase tracking-wider">Color</label>
              <div className="flex gap-1.5 pt-0.5">
                {COLOR_OPTIONS.map(({ key, label, swatch }) => (
                  <button
                    key={key}
                    type="button"
                    title={label}
                    onClick={() => setForm((f) => ({ ...f, color: key }))}
                    className={`w-7 h-7 rounded-full ${swatch} border-2 transition-all ${
                      form.color === key ? "border-amber-400 scale-110" : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Pin toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer w-fit group">
            <div
              onClick={() => setForm((f) => ({ ...f, isPinned: !f.isPinned }))}
              className={`w-9 h-5 rounded-full transition-all relative ${form.isPinned ? "bg-amber-500" : "bg-ink-700"}`}
            >
              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${form.isPinned ? "left-[18px]" : "left-0.5"}`} />
            </div>
            <span className="text-sm text-parchment-200/70 group-hover:text-parchment-50 transition-colors">
              Pin this note
            </span>
          </label>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-ink-800">
          <button type="button" onClick={onClose} className="btn-ghost text-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary text-sm flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              note ? "Save Changes" : "Create Note"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
