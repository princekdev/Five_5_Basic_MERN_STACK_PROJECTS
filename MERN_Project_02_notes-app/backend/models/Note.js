const mongoose = require("mongoose");

const CATEGORIES = ["Work", "Personal", "Study", "Health", "Finance", "Ideas", "Other"];

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: "Personal",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "default",
      enum: ["default", "amber", "rose", "emerald", "sky", "violet"], 
    },
  },
  { timestamps: true }
);

// Text index for full-text search on title and content
noteSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Note", noteSchema);
module.exports.CATEGORIES = CATEGORIES;
