const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_LENGTH = 14;



router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const hashedPassword = bcrypt.hashSync(password, SALT_LENGTH);
        
        const newUser = new User({ username, hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('signin', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        });
        if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
            const token = jwt.sign({
                username: user.username, _id: user._id
            }, process.env.JWT_SECRET);
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid username or password.' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/logout', (req, res) => {
    try {
        res.status(200).json({ message: 'User logged out successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});