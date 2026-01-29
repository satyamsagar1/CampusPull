import React, { useEffect, useState } from 'react';
import { useFeedback } from '../../context/feedbackContext';
import { useAuth } from '../../context/AuthContext'; 

const FeedbackPage = () => {
    const { feedbacks, loading, getAllFeedbacks, addFeedback } = useFeedback();
    const { user } = useAuth(); 
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getAllFeedbacks();
    }, []);

    // Logic remains: only alumni with a company can see the submission card
    const canPost = user?.role === 'alumni' && user?.currentCompany;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        try {
            await addFeedback(message);
            setMessage(""); 
            alert("Feedback posted successfully!");
        } catch (err) {
            console.error("Failed to post feedback:", err);
            alert("Failed to post feedback.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderFeedbacks = () => {
        if (loading) return <p className="text-center py-10">Loading feedback...</p>;
        
        if (feedbacks.length > 0) {
            return feedbacks.map((item) => (
                <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-600 mr-4">
                            {item.userId?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{item.userId?.name}</h3>
                            <p className="text-sm text-gray-500">
                                Alumni | {item.userId?.branch} | Working at <span className="text-green-600 font-semibold">{item.userId?.currentCompany || "Leading Company"}</span>
                            </p>
                        </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic border-l-4 border-gray-200 pl-4">
                        "{item.message}"
                    </p>
                </div>
            ));
        }
        
        return <p className="text-center text-gray-500 py-10">No alumni feedback shared yet.</p>;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 relative">
            <div className="max-w-4xl mx-auto pb-24"> {/* Added padding bottom to avoid overlap */}
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Alumni Feedback Portal</h1>

                {/* List of Feedback Cards */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Voices of Success</h2>
                    {renderFeedbacks()}
                </div>
            </div>

            {/* FIXED CARD AT BOTTOM RIGHT */}
            {canPost && (
                <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white p-6 rounded-2xl shadow-2xl border border-blue-100 z-50 animate-in slide-in-from-right-5">
                    <h2 className="text-lg font-bold mb-2 text-blue-800">
                        Share your journey, {user.name}!
                    </h2>
                    <p className="text-xs text-gray-500 mb-3">Your advice helps juniors at {user.currentCompany}.</p>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-gray-50"
                            rows="3"
                            placeholder="Write your success story..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !message.trim()}
                            className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-lg"
                        >
                            {isSubmitting ? "Posting..." : "Post Feedback"}
                        </button>
                    </form>
                </div>
            )}

            {/* Placeholder for non-alumni or missing company */}
            {!canPost && user && (
                <div className="fixed bottom-6 right-6 w-72 bg-gray-100 p-4 rounded-xl border border-gray-300 text-xs text-gray-600 shadow-md">
                   Update your profile to 'Alumni' and add your 'Current Company' to share feedback.
                </div>
            )}
        </div>
    );
};

export default FeedbackPage;