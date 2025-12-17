const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authService = {
    // Register new user
    async register({ email, password, name, role = 'user' }) {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            role
        });

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        };
    },

    // Login user
    async login({ email, password }) {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified,
                verificationBadge: user.verificationBadge
            },
            token
        };
    },

    // Get user from token
    async getUserFromToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            return user;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
};

module.exports = authService;
