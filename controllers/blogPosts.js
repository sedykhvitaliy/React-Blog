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

module.exports = router;