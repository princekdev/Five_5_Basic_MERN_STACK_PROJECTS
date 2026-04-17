import { useState, useCallback, useRef } from "react";
import { noteService } from "../services/noteService";
import toast from "react-hot-toast";

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchNotes = useCallback(async (params = {}) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    try {
      const data = await noteService.getNotes(params);
      setNotes(data.notes);
      setTotal(data.total);
    } catch (err) {
      if (err.name !== "CanceledError") {
        const msg = err.response?.data?.message || "Failed to load notes";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);
 
  const createNote = useCallback(async (noteData) => {
    const note = await noteService.createNote(noteData);
    setNotes((prev) => [note, ...prev]);
    setTotal((t) => t + 1);
    toast.success("Note created!");
    return note;
  }, []);

  const updateNote = useCallback(async (id, noteData) => {
    const updated = await noteService.updateNote(id, noteData);
    setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    toast.success("Note updated!");
    return updated;
  }, []);

  const deleteNote = useCallback(async (id) => {
    await noteService.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
    setTotal((t) => t - 1);
    toast.success("Note deleted");
  }, []);

  const togglePin = useCallback(async (id) => {
    const updated = await noteService.togglePin(id);
    setNotes((prev) =>
      prev
        .map((n) => (n._id === id ? updated : n))
        .sort((a, b) => b.isPinned - a.isPinned || new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  }, []);

  return { notes, total, loading, error, fetchNotes, createNote, updateNote, deleteNote, togglePin };
};
