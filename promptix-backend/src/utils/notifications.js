const Notification = require('../models/Notification');
const User = require('../models/User');

const createNotification = async (data) => {
    try {
        const { userId, title, message, type, relatedId } = data;

        // If userId is 'all', send to all admins/managers
        if (userId === 'staff') {
            const staff = await User.find({ role: { $in: ['Admin', 'Manager'] } });
            const notifications = staff.map(s => ({
                userId: s._id,
                title,
                message,
                type,
                relatedId
            }));
            await Notification.insertMany(notifications);
        } else {
            const notification = new Notification({
                userId,
                title,
                message,
                type,
                relatedId
            });
            await notification.save();
        }
    } catch (err) {
        console.error('Notification creation failed:', err);
    }
};

module.exports = { createNotification };
