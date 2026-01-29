import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all feedback
    const getAllFeedbacks = async () => {
    setLoading(true);
    try {
        const res = await axios.get('/api/feedback/all');
        // Safety check: Ensure we only set an array
        if (Array.isArray(res.data)) {
            setFeedbacks(res.data);
        } else {
            console.error("Expected an array but got:", typeof res.data);
            setFeedbacks([]); // Fallback to empty array
        }
    } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setFeedbacks([]); // Prevents .map error on failure
    } finally {
        setLoading(false);
    }
};

    // Submit new feedback
    const addFeedback = async (message) => {
        try {
            const res = await axios.post('/api/feedback/submit', { message });
            // Refresh the list after successful submission
            if (res.data.success) {
                getAllFeedbacks();
            }
            return res.data;
        } catch (err) {
            console.error("Error submitting feedback:", err);
            throw err;
        }
    };

    return (
        <FeedbackContext.Provider value={{ feedbacks, loading, getAllFeedbacks, addFeedback }}>
            {children}
        </FeedbackContext.Provider>
    );
};

// Custom hook for easy access
export const useFeedback = () => useContext(FeedbackContext);