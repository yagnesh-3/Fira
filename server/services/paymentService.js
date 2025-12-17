const Payment = require('../models/Payment');
const Payout = require('../models/Payout');
const Refund = require('../models/Refund');

const paymentService = {
    // Get all payments
    async getAllPayments(query = {}) {
        const { page = 1, limit = 10, status, type } = query;
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.type = type;

        const payments = await Payment.find(filter)
            .populate('user', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Payment.countDocuments(filter);

        return {
            payments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };
    },

    // Get user's payments
    async getUserPayments(userId) {
        const payments = await Payment.find({ user: userId })
            .sort({ createdAt: -1 });
        return payments;
    },

    // Get payment by ID
    async getPaymentById(id) {
        const payment = await Payment.findById(id).populate('user', 'name email');
        if (!payment) {
            throw new Error('Payment not found');
        }
        return payment;
    },

    // Initiate payment
    async initiatePayment({ userId, type, referenceId, referenceModel, amount }) {
        const payment = await Payment.create({
            user: userId,
            type,
            referenceId,
            referenceModel,
            amount,
            status: 'pending'
        });

        // TODO: Integrate with actual payment gateway (Razorpay/Stripe)
        // For now, return payment with mock gateway order ID
        payment.gatewayOrderId = `ORDER_${Date.now()}`;
        await payment.save();

        return {
            payment,
            gatewayOrderId: payment.gatewayOrderId,
            // Add payment gateway specific data here
        };
    },

    // Verify payment (callback from gateway)
    async verifyPayment({ paymentId, gatewayTransactionId, gatewayResponse, success }) {
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            throw new Error('Payment not found');
        }

        payment.gatewayTransactionId = gatewayTransactionId;
        payment.gatewayResponse = gatewayResponse;
        payment.status = success ? 'success' : 'failed';
        payment.paidAt = success ? new Date() : null;
        await payment.save();

        // TODO: Update related booking/ticket status

        return payment;
    },

    // Request refund
    async requestRefund(paymentId, { reason, reasonDetails }) {
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            throw new Error('Payment not found');
        }

        if (payment.status !== 'success') {
            throw new Error('Can only refund successful payments');
        }

        const refund = await Refund.create({
            payment: paymentId,
            user: payment.user,
            reason,
            reasonDetails,
            amount: payment.amount,
            status: 'pending'
        });

        return refund;
    },

    // Get all payouts
    async getAllPayouts(query = {}) {
        const { page = 1, limit = 10, status } = query;
        const filter = {};
        if (status) filter.status = status;

        const payouts = await Payout.find(filter)
            .populate('recipient', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Payout.countDocuments(filter);

        return {
            payouts,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };
    },

    // Process payout
    async processPayout({ recipientId, type, referenceId, referenceModel, grossAmount, bankDetails }) {
        const commissionPercentage = 5; // 5% platform fee
        const platformCommission = Math.round(grossAmount * (commissionPercentage / 100));
        const netAmount = grossAmount - platformCommission;

        const payout = await Payout.create({
            recipient: recipientId,
            type,
            referenceId,
            referenceModel,
            grossAmount,
            platformCommission,
            platformCommissionPercentage: commissionPercentage,
            netAmount,
            bankDetails,
            status: 'pending'
        });

        // TODO: Integrate with payment gateway payout API

        return payout;
    }
};

module.exports = paymentService;
