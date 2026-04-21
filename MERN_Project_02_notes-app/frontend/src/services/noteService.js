import api from "./api";

export const noteService = {
  getNotes: async (params = {}) => {
    const res = await api.get("/notes", { params });
    return res.data;
  },

  getNoteById: async (id) => {
    const res = await api.get(`/notes/${id}`);
    return res.data;
  },

  createNote: async (data) => {
    const res = await api.post("/notes", data);
    return res.data;
  },

  updateNote: async (id, data) => {
    const res = await api.put(`/notes/${id}`, data);
    return res.data;
  },

  deleteNote: async (id) => {
    const res = await api.delete(`/notes/${id}`);
    return res.data;
  },

  togglePin: async (id) => {
    const res = await api.patch(`/notes/${id}/pin`);
    return res.data;
  },
};
 