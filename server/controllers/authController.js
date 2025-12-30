const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Password hashing is handled in User model pre-save hook
        // We pass 'password' to 'passwordHash' field in the model creation? 
        // Wait, the model expects 'passwordHash' to be set? 
        // No, the model has 'passwordHash' field. But I usually pass 'password' and let pre-save handle it?
        // Let's check User.js.
        // User.js: 'this.passwordHash = await bcrypt.hash(this.passwordHash, salt);'
        // So I should pass the plain password into 'passwordHash' field initially, OR I should modify User.js to accept virtual 'password'.
        // To be safe and explicit, I will manually hash here OR follow the User.js logic.
        // User.js logic: `if (!this.isModified('passwordHash'))`.
        // I will pass `passwordHash: password` locally to trigger the hook, OR just do it explicitly here.
        // Actually, the previous User.js code I wrote does: `this.passwordHash = await bcrypt.hash(this.passwordHash, salt);`
        // So if I create user with `{ name, email, passwordHash: password }`, it will work.

        const user = await User.create({
            name,
            email,
            passwordHash: password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    authUser,
};
