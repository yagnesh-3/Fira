const express = require('express');
const router = express.Router();
const verificationService = require('../services/verificationService');

// GET /api/verification - Get all verification requests (admin)
router.get('/', async (req, res) => {
    try {
        const requests = await verificationService.getAllRequests(req.query);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/verification/user/:userId - Get user's verification request
router.get('/user/:userId', async (req, res) => {
    try {
        const request = await verificationService.getUserRequest(req.params.userId);
        res.json(request);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// GET /api/verification/:id - Get request by ID
router.get('/:id', async (req, res) => {
    try {
        const request = await verificationService.getRequestById(req.params.id);
        res.json(request);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /api/verification - Submit verification request
router.post('/', async (req, res) => {
    try {
        const request = await verificationService.submitRequest(req.body);
        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/verification/:id - Update verification request
router.put('/:id', async (req, res) => {
    try {
        const request = await verificationService.updateRequest(req.params.id, req.body);
        res.json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/verification/:id/review - Review request (admin)
router.put('/:id/review', async (req, res) => {
    try {
        const result = await verificationService.reviewRequest(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
