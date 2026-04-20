const express = require("express");
const { body } = require("express-validator");
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
} = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All note routes are protected
router.use(protect);

const noteValidation = [
  body("title").trim().notEmpty().withMessage("Title is required")
    .isLength({ max: 120 }).withMessage("Title cannot exceed 120 characters"),
  body("content").trim().notEmpty().withMessage("Content is required")
    .isLength({ max: 5000 }).withMessage("Content cannot exceed 5000 characters"),
  body("category")
    .optional()
    .isIn(["Work", "Personal", "Study", "Health", "Finance", "Ideas", "Other"])
    .withMessage("Invalid category"),
];

router.route("/")
  .get(getNotes)
  .post(noteValidation, createNote);

router.route("/:id")
  .get(getNoteById)
  .put(noteValidation, updateNote)
  .delete(deleteNote);

router.patch("/:id/pin", togglePin); 

module.exports = router;
