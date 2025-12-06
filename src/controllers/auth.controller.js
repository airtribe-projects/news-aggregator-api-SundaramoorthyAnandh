const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const MESSAGES = require('./constants');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
const register = async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ msg: MESSAGES.NO_CREDENTIALS });
    }

    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            if (user.email === email) {
                return res.status(400).json({ msg: MESSAGES.USER_ALREADY_EXISTS });
            }
            if (user.username === username) {
                return res.status(400).json({ msg: MESSAGES.USERNAME_ALREADY_EXISTS });
            }
        }

        user = new User({
            email,
            username,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;

                res.status(201).json({
                    token,
                    msg: MESSAGES.REGISTRATION_SUCCESS,
                    user: { id: user._id, email: user.email, username: user.username }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during registration.');
    }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (Login using email OR username)
// @access  Public

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: MESSAGES.NO_CREDENTIALS });
    }

    try {
        const user = await User.findOne({
            email: email
        });

        if (!user) {
            return res.status(400).json({ msg: MESSAGES.INVALID_CREDENTIALS });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: MESSAGES.INVALID_CREDENTIALS });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '8h' },
            (err, token) => {
                if (err) throw err;

                res.json({
                    token,
                    msg: 'Login successful.',
                    user: { id: user.id, email: user.email, username: user.username }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send(MESSAGES.INVALID_CREDENTIALS);
    }
};

module.exports = {
    register,
    login
};
