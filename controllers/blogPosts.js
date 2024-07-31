const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const BlogPost = require('../models/blogPost.js');
const router = express.Router();


//Public Routes (for users and guests)

router.get('/', async (req, res) => {
    try {
      const hoots = await Hoot.find({})
        .populate('author')
        .sort({ createdAt: 'desc' });
      res.status(200).json(hoots);
    } catch (error) {
      res.status(500).json(error);
    }
  });

router.get('/:hootId', async (req, res) => {
    try {
      const hoot = await Hoot.findById(req.params.hootId).populate('author');
      res.status(200).json(hoot);
    } catch (error) {
      res.status(500).json(error);
    }
  });  



// Protected Routes (only for users)

router.use(verifyToken);

router.post('/', async (req, res) => {
    try {
        req.body.author = req.user._id;
        const blogPost = await BlogPost.create(req.body);
        blogPost._doc.author = req.user;
        res.status(201).json(blogPost);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});



router.put('/:hootId', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.hootId);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (!blogPost.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.hootId,
      req.body,
      { new: true }
    ).populate('author');

    res.status(200).json(updatedBlogPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:hootId', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.hootId);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (!blogPost.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    await BlogPost.findByIdAndDelete(req.params.hootId);

    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;