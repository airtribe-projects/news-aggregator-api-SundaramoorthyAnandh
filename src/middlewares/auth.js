const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MESSAGES = require('./constants');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: MESSAGES.TOKEN_MISSING });
    }

    if (!token.startsWith('Bearer ')) {
        return res.status(401).json({ msg: MESSAGES.TOKEN_FORMAT_INVALID });
    }

    const jwtToken = token.split(' ')[1];

    try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

        const userId = decoded.user.id;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(401).json({ msg: MESSAGES.TOKEN_INVALID });
        }

        req.user = user;

        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: MESSAGES.TOKEN_EXPIRED });
        }
        console.error(err.message);
        res.status(401).json({ msg: MESSAGES.TOKEN_INVALID });
    }
};

module.exports = authMiddleware;