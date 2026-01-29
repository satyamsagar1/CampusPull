import Feedback from '../models/feedback.js';
import User from '../models/user.js';

// For Placed Students to submit feedback
export const submitFeedback = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user || user.role !== 'alumni' || !user.currentCompany) {
            return res.status(403).json({ 
                success: false, 
                message: "Only alumni with a listed company can share feedback." 
            });
        }
        
        const newFeedback = new Feedback({ userId, message });
        await newFeedback.save();
        
        res.status(201).json({ success: true, message: "Feedback shared!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// For HOD/Frontend to view all feedback
export const getFeedbackList = async (req, res) => {
    try {
        const list = await Feedback.find()
            .populate('userId', 'name branch currentCompany profileImage')
            .sort({ createdAt: -1 });

            const validList = list.filter(item => item.userId !== null);

        res.status(200).json(validList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};