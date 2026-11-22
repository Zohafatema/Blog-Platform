const express = require("express");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

const Post = require("../models/Post");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(e => e.msg)
    });
  }

  next();
};

// GET ALL POSTS + SEARCH
router.get("/", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();

    if (search.length > 100) {
      return res.status(400).json({
        message: "Search query is too long"
      });
    }

    const filter = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    const posts = await Post.find(filter)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch posts"
    });
  }
});

// GET SINGLE POST
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(req.params.id)
      .populate("author", "name")
      .populate("comments.author", "name");

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch post"
    });
  }
});

// CREATE POST
router.post(
  "/",
  protect,
  [
    body("title").trim().isLength({ min: 3, max: 150 }),
    body("content").trim().isLength({ min: 10, max: 30000 }),
    body("category").optional().trim().isLength({ max: 40 })
  ],
  validate,
  async (req, res) => {
    try {
      const { title, content, category } = req.body;

      const post = await Post.create({
        title,
        content,
        category: category || "General",
        author: req.user.id
      });

      await post.populate("author", "name");

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({
        message: "Could not create post"
      });
    }
  }
);

// UPDATE POST
router.put(
  "/:id",
  protect,
  [
    body("title").trim().isLength({ min: 3, max: 150 }),
    body("content").trim().isLength({ min: 10, max: 30000 }),
    body("category").optional().trim().isLength({ max: 40 })
  ],
  validate,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          message: "Post not found"
        });
      }

      if (post.author.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You cannot edit this post"
        });
      }

      post.title = req.body.title;
      post.content = req.body.content;
      post.category = req.body.category || "General";

      await post.save();
      await post.populate("author", "name");

      res.json(post);
    } catch (error) {
      res.status(500).json({
        message: "Could not update post"
      });
    }
  }
);

// DELETE POST
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You cannot delete this post"
      });
    }

    await post.deleteOne();

    res.json({
      message: "Post deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete post"
    });
  }
});

// ADD COMMENT
router.post(
  "/:id/comments",
  protect,
  [
    body("text").trim().isLength({ min: 1, max: 1000 })
  ],
  validate,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          message: "Post not found"
        });
      }

      post.comments.push({
        text: req.body.text,
        author: req.user.id
      });

      await post.save();
      await post.populate("comments.author", "name");

      res.status(201).json(post.comments);
    } catch (error) {
      res.status(500).json({
        message: "Could not add comment"
      });
    }
  }
);

// DELETE COMMENT
router.delete(
  "/:id/comments/:commentId",
  protect,
  async (req, res) => {
    try {
      const { id, commentId } = req.params;

      if (
        !mongoose.isValidObjectId(id) ||
        !mongoose.isValidObjectId(commentId)
      ) {
        return res.status(400).json({
          message: "Invalid ID"
        });
      }

      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({
          message: "Post not found"
        });
      }

      const comment = post.comments.id(commentId);

      if (!comment) {
        return res.status(404).json({
          message: "Comment not found"
        });
      }

      if (comment.author.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You cannot delete this comment"
        });
      }

      comment.deleteOne();

      await post.save();

      res.json({
        message: "Comment deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Could not delete comment"
      });
    }
  }
);

module.exports = router;