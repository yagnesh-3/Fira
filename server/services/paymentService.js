const Payment = require('../models/Payment');
const Payout = require('../models/Payout');
const Refund = require('../models/Refund');
const Razorpay = require('razorpay');
const crypto = require('crypto');

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
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error('Razorpay credentials not configured');
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            notes: {
                userId: userId.toString(),
                type,
                referenceId: referenceId.toString()
            }
        };

        const order = await razorpay.orders.create(options);

        const payment = await Payment.create({
            user: userId,
            type,
            referenceId,
            referenceModel,
            amount: amount,
            status: 'pending',
            gatewayOrderId: order.id,
            gatewayResponse: order
        });

        return {
            payment,
            gatewayOrderId: order.id,
            keyId: process.env.RAZORPAY_KEY_ID,
            amount: options.amount,
            currency: options.currency
        };
    },

    // Verify payment (callback from gateway)
    async verifyPayment({ paymentId, gatewayOrderId, gatewayPaymentId, gatewaySignature }) {
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            throw new Error('Payment not found');
        }

        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(gatewayOrderId + "|" + gatewayPaymentId)
            .digest('hex');

        if (generated_signature === gatewaySignature) {
            payment.gatewayTransactionId = gatewayPaymentId;
            payment.status = 'success'; // Changed from 'paid' to 'success' to match initiatePayment status
            payment.paidAt = new Date();
            await payment.save();

            return { success: true, payment };
        } else {
            payment.status = 'failed';
            await payment.save();
            throw new Error('Payment verification failed: Invalid signature');
        }
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
