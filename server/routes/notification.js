const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');

// GET /api/notifications - Get user's notifications
router.get('/', async (req, res) => {
    try {
        const notifications = await notificationService.getUserNotifications(req.query.userId);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/notifications/unread - Get unread count
router.get('/unread', async (req, res) => {
    try {
        const count = await notificationService.getUnreadCount(req.query.userId);
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/notifications/:id - Get notification by ID
router.get('/:id', async (req, res) => {
    try {
        const notification = await notificationService.getNotificationById(req.params.id);
        res.json(notification);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', async (req, res) => {
    try {
        const notification = await notificationService.markAsRead(req.params.id);
        res.json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/notifications/read-all - Mark all as read
router.put('/read-all', async (req, res) => {
    try {
        const result = await notificationService.markAllAsRead(req.body.userId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', async (req, res) => {
    try {
        await notificationService.deleteNotification(req.params.id);
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
