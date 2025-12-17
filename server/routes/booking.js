const express = require('express');
const router = express.Router();
const bookingService = require('../services/bookingService');

// GET /api/bookings - Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await bookingService.getAllBookings(req.query);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/bookings/user/:userId - Get user's bookings
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await bookingService.getUserBookings(req.params.userId);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/bookings/venue/:venueId - Get venue's bookings
router.get('/venue/:venueId', async (req, res) => {
    try {
        const bookings = await bookingService.getVenueBookings(req.params.venueId);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/bookings/:id - Get booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await bookingService.getBookingById(req.params.id);
        res.json(booking);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /api/bookings - Create new booking
router.post('/', async (req, res) => {
    try {
        const booking = await bookingService.createBooking(req.body);
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/bookings/:id - Update booking
router.put('/:id', async (req, res) => {
    try {
        const booking = await bookingService.updateBooking(req.params.id, req.body);
        res.json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/bookings/:id/status - Accept/Reject booking (venue owner)
router.put('/:id/status', async (req, res) => {
    try {
        const booking = await bookingService.updateBookingStatus(req.params.id, req.body);
        res.json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST /api/bookings/:id/cancel - Cancel booking
router.post('/:id/cancel', async (req, res) => {
    try {
        const booking = await bookingService.cancelBooking(req.params.id, req.body.reason);
        res.json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
