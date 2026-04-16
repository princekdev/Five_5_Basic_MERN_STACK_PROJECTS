import { useState, useEffect, useMemo } from "react";
import { useNotes } from "../hooks/useNotes";
import { useDebounce } from "../hooks/useDebounce";
import { useAuth } from "../context/AuthContext";
import { NoteCard } from "../components/NoteCard";
import { NoteModal } from "../components/NoteModal";
import { CategoryFilter } from "../components/CategoryFilter";
import { SearchBar } from "../components/SearchBar";
import { EmptyState } from "../components/EmptyState";
import { CATEGORIES } from "../components/constants";
import toast from "react-hot-toast";

export const DashboardPage = () => {
  const { user } = useAuth();
  const { notes, total, loading, error, fetchNotes, createNote, updateNote, deleteNote, togglePin } = useNotes();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 400);
 
  useEffect(() => {
    fetchNotes({
      category: category === "All" ? undefined : category,
      search: debouncedSearch || undefined,
    });
  }, [category, debouncedSearch, fetchNotes]);

  // Count notes per category for sidebar badges
  const counts = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((c) => (map[c] = 0));
    notes.forEach((n) => { if (map[n.category] !== undefined) map[n.category]++; });
    return map;
  }, [notes]);

  const handleSave = async (formData) => {
    if (editNote) {
      await updateNote(editNote._id, formData);
    } else {
      await createNote(formData);
    }
    setEditNote(null);
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditNote(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditNote(null);
  };

  const handleDelete = async (id) => {
    try { await deleteNote(id); } catch { toast.error("Failed to delete note"); }
  };

  const handleTogglePin = async (id) => {
    try { await togglePin(id); } catch { toast.error("Failed to toggle pin"); }
  };

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const regularNotes = notes.filter((n) => !n.isPinned);
  const isFiltered = !!debouncedSearch || category !== "All";

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* ── Sidebar ── */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 lg:z-auto w-64 bg-ink-950 lg:bg-transparent border-r lg:border-0 border-ink-800 pt-16 lg:pt-0 px-4 lg:px-0 transition-transform lg:transition-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="sticky top-20">
            {/* User greeting */}
            <div className="mb-6 px-3">
              <p className="text-parchment-200/40 text-xs font-mono uppercase tracking-wider">Welcome back,</p>
              <p className="text-parchment-50 font-display text-lg mt-0.5">{user?.name?.split(" ")[0]}</p>
            </div>

            <CategoryFilter
              selected={category}
              onSelect={(cat) => { setCategory(cat); setSidebarOpen(false); }}
              counts={counts}
            />

            {/* Stats block */}
            <div className="mt-8 px-3">
              <div className="bg-ink-800 border border-ink-700 rounded-xl p-4">
                <p className="text-xs text-ink-600 font-mono uppercase tracking-wider mb-3">Notebook</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl text-amber-400">{total}</span>
                  <span className="text-ink-600 text-sm">{total === 1 ? "note" : "notes"}</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-600">
                  <span>📌</span>
                  <span>{pinnedNotes.length} pinned</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-6">
            {/* Mobile sidebar toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-ink-800 text-parchment-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} />
            </div>

            <button
              onClick={handleNew}
              className="btn-primary flex items-center gap-2 whitespace-nowrap text-sm"
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">New Note</span>
            </button>
          </div>

          {/* Section heading */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-parchment-50">
              {category === "All" ? "All Notes" : category}
            </h2>
            {isFiltered && (
              <button
                onClick={() => { setSearch(""); setCategory("All"); }}
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                ✕ Clear filters
              </button>
            )}
          </div>

          {/* Error state */}
          {error && (
            <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-ink-800 rounded-xl animate-pulse border border-ink-700" />
              ))}
            </div>
          )}

          {/* Notes grid */}
          {!loading && (
            <>
              {notes.length === 0 ? (
                <EmptyState search={debouncedSearch} category={category} onNew={handleNew} />
              ) : (
                <div className="space-y-6">
                  {/* Pinned section */}
                  {pinnedNotes.length > 0 && !isFiltered && (
                    <section>
                      <p className="text-xs text-ink-600 font-mono uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <span>📌</span> Pinned
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {pinnedNotes.map((note) => (
                          <NoteCard
                            key={note._id}
                            note={note}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onTogglePin={handleTogglePin}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Regular notes */}
                  {regularNotes.length > 0 && (
                    <section>
                      {pinnedNotes.length > 0 && !isFiltered && (
                        <p className="text-xs text-ink-600 font-mono uppercase tracking-wider mb-3">Others</p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {(isFiltered ? notes : regularNotes).map((note) => (
                          <NoteCard
                            key={note._id}
                            note={note}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onTogglePin={handleTogglePin}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Note modal */}
      {modalOpen && (
        <NoteModal
          note={editNote}
          onSave={handleSave}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};
