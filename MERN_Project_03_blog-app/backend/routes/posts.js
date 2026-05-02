const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// @route   GET /api/posts
// @desc    Get all posts (public), supports ?page, ?limit, ?search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search
      ? { $text: { $search: search } }
      : {};

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query),
    ]);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total, 
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// @route   GET /api/posts/my
// @desc    Get posts by logged-in user
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your posts' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .lean();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, excerpt, tags, coverImage } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await Post.create({
      title,
      content,
      excerpt,
      tags: tags || [],
      coverImage: coverImage || '',
      author: req.user._id,
    });

    await post.populate('author', 'name email');

    res.status(201).json(post);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post (owner only)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, excerpt, tags, coverImage } = req.body;

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.excerpt = excerpt ?? post.excerpt;
    post.tags = tags ?? post.tags;
    post.coverImage = coverImage ?? post.coverImage;

    const updated = await post.save();
    await updated.populate('author', 'name email');

    res.json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Failed to update post' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post (owner only)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

module.exports = router;
