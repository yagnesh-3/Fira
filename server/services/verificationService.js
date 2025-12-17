const VerificationRequest = require('../models/VerificationRequest');
const User = require('../models/User');

const verificationService = {
    // Get all requests (admin)
    async getAllRequests(query = {}) {
        const { page = 1, limit = 10, status, type } = query;
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.type = type;

        const requests = await VerificationRequest.find(filter)
            .populate('user', 'name email avatar')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await VerificationRequest.countDocuments(filter);

        return {
            requests,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };
    },

    // Get user's request
    async getUserRequest(userId) {
        const request = await VerificationRequest.findOne({ user: userId })
            .sort({ createdAt: -1 });
        return request;
    },

    // Get request by ID
    async getRequestById(id) {
        const request = await VerificationRequest.findById(id)
            .populate('user', 'name email avatar')
            .populate('reviewedBy', 'name');
        if (!request) {
            throw new Error('Verification request not found');
        }
        return request;
    },

    // Submit request
    async submitRequest(data) {
        // Check if user already has a pending request
        const existing = await VerificationRequest.findOne({
            user: data.user,
            status: { $in: ['pending', 'under_review'] }
        });

        if (existing) {
            throw new Error('You already have a pending verification request');
        }

        const request = await VerificationRequest.create(data);
        return request;
    },

    // Update request
    async updateRequest(id, updateData) {
        const request = await VerificationRequest.findById(id);
        if (!request) {
            throw new Error('Verification request not found');
        }

        if (request.status !== 'pending') {
            throw new Error('Cannot update request that is already being reviewed');
        }

        Object.assign(request, updateData);
        await request.save();
        return request;
    },

    // Review request (admin)
    async reviewRequest(id, { status, rejectionReason, adminNotes, reviewedBy }) {
        const request = await VerificationRequest.findById(id);
        if (!request) {
            throw new Error('Verification request not found');
        }

        request.status = status;
        request.reviewedBy = reviewedBy;
        request.reviewedAt = new Date();

        if (rejectionReason) {
            request.rejectionReason = rejectionReason;
        }
        if (adminNotes) {
            request.adminNotes = adminNotes;
        }

        await request.save();

        // If approved, update user's verification status
        if (status === 'approved') {
            await User.findByIdAndUpdate(request.user, {
                $set: {
                    isVerified: true,
                    verificationBadge: request.type
                }
            });
        }

        // TODO: Send notification to user

        return request;
    }
};

module.exports = verificationService;
