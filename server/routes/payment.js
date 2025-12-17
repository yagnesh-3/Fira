const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');

// GET /api/payments - Get all payments
router.get('/', async (req, res) => {
    try {
        const payments = await paymentService.getAllPayments(req.query);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/payments/user/:userId - Get user's payments
router.get('/user/:userId', async (req, res) => {
    try {
        const payments = await paymentService.getUserPayments(req.params.userId);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/payments/:id - Get payment by ID
router.get('/:id', async (req, res) => {
    try {
        const payment = await paymentService.getPaymentById(req.params.id);
        res.json(payment);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /api/payments/initiate - Initiate payment
router.post('/initiate', async (req, res) => {
    try {
        const result = await paymentService.initiatePayment(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST /api/payments/verify - Verify payment (callback)
router.post('/verify', async (req, res) => {
    try {
        const result = await paymentService.verifyPayment(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST /api/payments/:id/refund - Request refund
router.post('/:id/refund', async (req, res) => {
    try {
        const result = await paymentService.requestRefund(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /api/payments/payouts - Get all payouts
router.get('/payouts/all', async (req, res) => {
    try {
        const payouts = await paymentService.getAllPayouts(req.query);
        res.json(payouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/payments/payouts - Process payout
router.post('/payouts', async (req, res) => {
    try {
        const result = await paymentService.processPayout(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
