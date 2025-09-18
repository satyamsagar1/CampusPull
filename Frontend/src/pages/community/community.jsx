import React, { useState } from "react";
import { Heart, MessageCircle, Trash2, Edit } from "lucide-react";
import { useCommunity } from "../../context/communityContext";
import AnswerCard from "../../components/ui/answerCard"; // ✅ Import AnswerCard

const Community = () => {
  const {
    posts,
    createPost,
    likePost,
    deletePost,
    answerPost,
    updatePost,
    updateAnswer,
    deleteAnswer,
    likeAnswer,
    loading
  } = useCommunity();

  const [newPost, setNewPost] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostBody, setEditingPostBody] = useState("");
  const [answerInput, setAnswerInput] = useState({});
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingAnswerBody, setEditingAnswerBody] = useState("");
  const [expandedPosts, setExpandedPosts] = useState({});

  const handlePost = () => {
    if (newPost.trim() === "") return;
    createPost(newPost);
    setNewPost("");
  };

  const handleUpdatePost = (postId) => {
    if (!editingPostBody.trim()) return;
    updatePost(postId, editingPostBody);
    setEditingPostId(null);
    setEditingPostBody("");
  };

  const handleAnswerPost = (postId) => {
    if (!answerInput[postId]?.trim()) return;
    answerPost(postId, answerInput[postId]);
    setAnswerInput((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleUpdateAnswer = (answerId) => {
    if (!editingAnswerBody.trim()) return;
    updateAnswer(answerId, editingAnswerBody);
    setEditingAnswerId(null);
    setEditingAnswerBody("");
  };

  // ✅ Helper to format date & time
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 flex flex-col">
      {/* Header (Back button removed ✅) */}
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-2xl font-bold text-white">LinkMate Community</h1>
      </div>

      {/* Feed */}
      {(() => {
        let feedContent;
        if (loading) {
          feedContent = (
            <p className="text-white text-center">Loading posts...</p>
          );
        } else if (posts.length === 0) {
          feedContent = (
            <p className="text-white text-center">
              No posts yet. Be the first!
            </p>
          );
        } else {
          feedContent = posts.map((post) => (
            <div key={post._id} className="bg-white p-4 rounded-xl shadow-md">
              {/* Post Author + DateTime */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.author?.avatar || "https://i.pravatar.cc/40"}
                    alt={post.author?.name || "Anonymous"}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">
                      {post.author?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(post.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Post Body */}
              {editingPostId === post._id ? (
                <>
                  <textarea
                    className="w-full border rounded-lg p-2 mb-2"
                    value={editingPostBody}
                    onChange={(e) => setEditingPostBody(e.target.value)}
                  />
                  <button
                    onClick={() => handleUpdatePost(post._id)}
                    className="px-2 py-1 bg-green-500 text-white rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPostId(null)}
                    className="px-2 py-1 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <p className="text-gray-700 mb-3">{post.body}</p>
              )}

              {/* Post Actions */}
              <div className="flex items-center space-x-4 mb-2">
                <button
                  onClick={() => likePost(post._id)}
                  className="flex items-center space-x-1 hover:text-red-500"
                >
                  <Heart className="w-5 h-5" />
                  <span>{post.likes || 0}</span>
                </button>

                <button className="flex items-center space-x-1 hover:text-blue-500">
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.answers?.length || 0}</span>
                </button>

                <button
                  onClick={() => {
                    setEditingPostId(post._id);
                    setEditingPostBody(post.body);
                  }}
                  className="hover:text-yellow-500"
                >
                  <Edit className="w-5 h-5" />
                </button>

                <button
                  onClick={() => deletePost(post._id)}
                  className="hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Answers List */}
              <div className="ml-6 space-y-2">
                {post.answers
                  ?.slice(
                    0,
                    expandedPosts[post._id] ? post.answers.length : 2
                  )
                  .map((ans) => (
                    <AnswerCard
                      key={ans._id}
                      ans={ans}
                      editingAnswerId={editingAnswerId}
                      editingAnswerBody={editingAnswerBody}
                      setEditingAnswerId={setEditingAnswerId}
                      setEditingAnswerBody={setEditingAnswerBody}
                      likeAnswer={likeAnswer}
                      deleteAnswer={deleteAnswer}
                      handleUpdateAnswer={handleUpdateAnswer}
                    />
                  ))}

                {post.answers?.length > 2 && !expandedPosts[post._id] && (
                  <button
                    className="text-blue-600 text-sm mt-1"
                    onClick={() =>
                      setExpandedPosts((prev) => ({
                        ...prev,
                        [post._id]: true
                      }))
                    }
                  >
                    View {post.answers.length - 2} more answers
                  </button>
                )}

                {/* New Answer Input */}
                <div className="flex mt-2">
                  <input
                    type="text"
                    placeholder="Write an answer..."
                    className="w-full border rounded-lg p-2 mr-2"
                    value={answerInput[post._id] || ""}
                    onChange={(e) =>
                      setAnswerInput((prev) => ({
                        ...prev,
                        [post._id]: e.target.value
                      }))
                    }
                  />
                  <button
                    onClick={() => handleAnswerPost(post._id)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Answer
                  </button>
                </div>
              </div>
            </div>
          ));
        }
        return (
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {feedContent}
          </div>
        );
      })()}

      {/* New Post Input */}
      <div className="sticky bottom-0 bg-white shadow-md rounded-2xl p-4">
        <textarea
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="3"
          placeholder="Share your idea or thought..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button
          onClick={handlePost}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Community;
