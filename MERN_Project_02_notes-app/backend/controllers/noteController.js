const { validationResult } = require("express-validator");
const Note = require("../models/Note");

// Build query filter from request params
const buildFilter = (userId, { category, search }) => {
  const filter = { user: userId };
  if (category && category !== "All") filter.category = category;
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ title: regex }, { content: regex }];
  }
  return filter;
};

// @desc    Get all notes for logged-in user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const filter = buildFilter(req.user._id, { category, search });

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notes, total] = await Promise.all([
      Note.find(filter)
        .sort({ isPinned: -1, updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Note.countDocuments(filter),
    ]);

    res.json({
      notes, 
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ message: "Failed to fetch notes." });
  }
};

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found." });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch note." });
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { title, content, category, color, isPinned } = req.body;

  try {
    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      category: category || "Personal",
      color: color || "default",
      isPinned: isPinned || false,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ message: "Failed to create note." });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found." });

    const { title, content, category, color, isPinned } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category;
    if (color !== undefined) note.color = color;
    if (isPinned !== undefined) note.isPinned = isPinned;

    const updated = await note.save();
    res.json(updated);
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ message: "Failed to update note." });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found." });
    res.json({ message: "Note deleted successfully.", id: req.params.id });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ message: "Failed to delete note." });
  }
};

// @desc    Toggle pin status of a note
// @route   PATCH /api/notes/:id/pin
// @access  Private
const togglePin = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found." });
    note.isPinned = !note.isPinned;
    const updated = await note.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle pin." });
  }
};

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote, togglePin };
