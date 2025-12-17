const User = require('../models/User');

const userService = {
    // Get all users
    async getAllUsers(query = {}) {
        const { page = 1, limit = 10, role } = query;
        const filter = {};
        if (role) filter.role = role;

        const users = await User.find(filter)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);

        return {
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };
    },

    // Get user by ID
    async getUserById(id) {
        const user = await User.findById(id).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    // Update user
    async updateUser(id, updateData) {
        const { password, ...safeData } = updateData; // Don't allow password update here

        const user = await User.findByIdAndUpdate(
            id,
            { $set: safeData },
            { new: true }
        ).select('-password');

        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    // Delete user
    async deleteUser(id) {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new Error('User not found');
        }
        return { message: 'User deleted successfully' };
    },

    // Follow user
    async followUser(userId, targetUserId) {
        if (userId === targetUserId) {
            throw new Error('Cannot follow yourself');
        }

        const [user, targetUser] = await Promise.all([
            User.findById(userId),
            User.findById(targetUserId)
        ]);

        if (!user || !targetUser) {
            throw new Error('User not found');
        }

        // Add to following/followers
        await Promise.all([
            User.findByIdAndUpdate(userId, { $addToSet: { following: targetUserId } }),
            User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: userId } })
        ]);

        return { message: 'Successfully followed user' };
    },

    // Unfollow user
    async unfollowUser(userId, targetUserId) {
        await Promise.all([
            User.findByIdAndUpdate(userId, { $pull: { following: targetUserId } }),
            User.findByIdAndUpdate(targetUserId, { $pull: { followers: userId } })
        ]);

        return { message: 'Successfully unfollowed user' };
    }
};

module.exports = userService;
