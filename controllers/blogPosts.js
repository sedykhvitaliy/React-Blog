const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const BlogPost = require('../models/blogPost.js');
const router = express.Router();

router.post('/', verifyToken, (req, res) => {
    //code here
});