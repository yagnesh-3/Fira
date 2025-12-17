const Notification = require('../models/Notification');

const notificationService = {
    // Get user's notifications
    async getUserNotifications(userId, limit = 50) {
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(limit);
        return notifications;
    },

    // Get unread count
    async getUnreadCount(userId) {
        const count = await Notification.countDocuments({ user: userId, isRead: false });
        return count;
    },

    // Get notification by ID
    async getNotificationById(id) {
        const notification = await Notification.findById(id);
        if (!notification) {
            throw new Error('Notification not found');
        }
        return notification;
    },

    // Create notification
    async createNotification({ userId, type, title, message, data, priority = 'medium', channel = 'in_app' }) {
        const notification = await Notification.create({
            user: userId,
            type,
            title,
            message,
            data,
            priority,
            channel
        });

        // TODO: Send push notification if channel is 'push' or 'all'
        // TODO: Send email if channel is 'email' or 'all'

        return notification;
    },

    // Mark as read
    async markAsRead(id) {
        const notification = await Notification.findByIdAndUpdate(
            id,
            { $set: { isRead: true, readAt: new Date() } },
            { new: true }
        );
        if (!notification) {
            throw new Error('Notification not found');
        }
        return notification;
    },

    // Mark all as read
    async markAllAsRead(userId) {
        await Notification.updateMany(
            { user: userId, isRead: false },
            { $set: { isRead: true, readAt: new Date() } }
        );
        return { message: 'All notifications marked as read' };
    },

    // Delete notification
    async deleteNotification(id) {
        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) {
            throw new Error('Notification not found');
        }
        return { message: 'Notification deleted' };
    },

    // Send bulk notifications (for events like new event from followed user)
    async sendBulkNotifications(userIds, { type, title, message, data }) {
        const notifications = userIds.map(userId => ({
            user: userId,
            type,
            title,
            message,
            data
        }));

        await Notification.insertMany(notifications);
        return { message: `Sent ${userIds.length} notifications` };
    }
};

module.exports = notificationService;
