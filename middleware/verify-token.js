const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
}

module.exports = verifyToken;