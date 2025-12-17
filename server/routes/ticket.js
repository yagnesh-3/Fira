const express = require('express');
const router = express.Router();
const ticketService = require('../services/ticketService');

// GET /api/tickets - Get all tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await ticketService.getAllTickets(req.query);
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/tickets/user/:userId - Get user's tickets
router.get('/user/:userId', async (req, res) => {
    try {
        const tickets = await ticketService.getUserTickets(req.params.userId);
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/tickets/event/:eventId - Get event's tickets
router.get('/event/:eventId', async (req, res) => {
    try {
        const tickets = await ticketService.getEventTickets(req.params.eventId);
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/tickets/:id - Get ticket by ID
router.get('/:id', async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);
        res.json(ticket);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /api/tickets - Purchase ticket
router.post('/', async (req, res) => {
    try {
        const ticket = await ticketService.purchaseTicket(req.body);
        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST /api/tickets/:id/validate - Validate ticket (check-in)
router.post('/:id/validate', async (req, res) => {
    try {
        const result = await ticketService.validateTicket(req.params.id, req.body.qrCode);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST /api/tickets/:id/cancel - Cancel ticket
router.post('/:id/cancel', async (req, res) => {
    try {
        const ticket = await ticketService.cancelTicket(req.params.id);
        res.json(ticket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
