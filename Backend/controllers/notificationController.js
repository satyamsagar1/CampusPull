import Notification from "../models/notifications.js"; // Ensure filename matches exactly

// @desc    Get all notifications for current user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    // defensive check for ID
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate("sender", "name avatar role");
    

    const unreadCount = await Notification.countDocuments({ 
      recipient: userId, 
      isRead: false 
    });

    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read
// @access  Private
export const markNotificationsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    // FIX: Changed 'read' to 'isRead'
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications:", error);
    res.status(500).json({ message: "Server Error" });
  }
};