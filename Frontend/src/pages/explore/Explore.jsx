// pages/Explore.jsx
import React, { useContext, useState } from "react";
import { FaSearch, FaUserCircle, FaLinkedin, FaEnvelope, FaUserPlus, FaStar, FaFire } from "react-icons/fa";
import { ExploreContext } from "../../context/exploreContext";
import RequestsPage from "./RequestsPage"; // New page for handling requests

export default function Explore() {
  const { suggestions, search, setSearch, loading, error, sendRequest, requests } =
    useContext(ExploreContext);

  const [showRequestsPage, setShowRequestsPage] = useState(false);

  const dummyMentors = [
    {
      _id: "1",
      name: "Alice Johnson",
      college: "MIT",
      degree: "B.Tech CS",
      graduationYear: 2022,
      skills: ["React", "Node.js", "UI/UX"],
      email: "alice@mit.edu",
      linkedin: "https://linkedin.com/in/alice",
      reviews: [
        { user: "John", rating: 5, comment: "Great mentor, very supportive!" },
        { user: "Emma", rating: 4, comment: "Helped me improve my skills!" },
      ],
    },
    {
      _id: "2",
      name: "Bob Smith",
      college: "Stanford",
      degree: "M.Sc AI",
      graduationYear: 2021,
      skills: ["Python", "Machine Learning", "Data Science"],
      email: "bob@stanford.edu",
      linkedin: "https://linkedin.com/in/bob",
      reviews: [
        { user: "Liam", rating: 5, comment: "Excellent guidance!" },
        { user: "Olivia", rating: 5, comment: "Very knowledgeable mentor." },
      ],
    },
    {
      _id: "3",
      name: "Clara Davis",
      college: "Harvard",
      degree: "MBA",
      graduationYear: 2023,
      skills: ["Management", "Leadership", "Strategy"],
      email: "clara@harvard.edu",
      linkedin: "https://linkedin.com/in/clara",
      reviews: [
        { user: "Sophia", rating: 4, comment: "Helpful mentor for career growth." },
      ],
    },
  ];

  const displayedMentors = suggestions.length > 0 ? suggestions : dummyMentors;

  const topRatedMentors = displayedMentors
    .map((m) => {
      const avgRating =
        m.reviews.length > 0
          ? m.reviews.reduce((acc, r) => acc + r.rating, 0) / m.reviews.length
          : 0;
      return { ...m, avgRating };
    })
    .filter((m) => m.avgRating >= 4.5)
    .sort((a, b) => b.avgRating - a.avgRating);

  // Show RequestsPage if clicked
  if (showRequestsPage) {
    return <RequestsPage onBack={() => setShowRequestsPage(false)} />;
  }

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative">
      
      {/* Heading and Requests Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Explore Network 🌐</h1>
          <p className="text-gray-100">Search and connect with students & mentors of LinkeMate</p>
        </div>
        <button
          onClick={() => setShowRequestsPage(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium shadow flex items-center gap-2"
        >
          <FaUserPlus /> Requests {requests?.length > 0 && `(${requests.length})`}
        </button>
      </div>

      {/* Pending Requests Panel */}
      <div className="bg-blue-100 p-4 rounded-xl shadow mb-6">
        <h2 className="text-blue-700 font-semibold mb-3 flex items-center gap-2">
          <FaUserPlus /> Pending Requests
        </h2>
        {requests.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {requests.map((req) => (
              <div
                key={req._id}
                className="px-4 py-2 bg-white rounded-full shadow text-sm text-gray-700"
              >
                {req.name || "Unknown User"}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No pending requests.</p>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center w-full max-w-xl bg-white shadow-md rounded-full px-4 py-2">
          <FaSearch className="text-gray-400 text-lg mr-2" />
          <input
            type="text"
            placeholder="Search by name, college, degree, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Top Rated Mentors */}
      {topRatedMentors.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-2 animate-pulse">
            <FaFire className="text-yellow-400" /> Top Rated Mentors
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topRatedMentors.map((user) => (
              <div
                key={user._id}
                className="bg-red-700/40 backdrop-blur-lg border border-red-500/50 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition transform hover:scale-105 relative"
              >
                <FaUserCircle className="text-white text-6xl mb-4" />
                <h2 className="text-lg font-semibold text-white">{user.name}</h2>
                <p className="text-sm text-white mb-1">{user.college}</p>
                <p className="text-sm text-white mb-2">
                  {user.degree} - {user.graduationYear}
                </p>

                <div className="flex items-center mb-4">
                  {[...Array(Math.round(user.avgRating))].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 mr-1" />
                  ))}
                  <span className="text-sm ml-2 text-white">{user.avgRating.toFixed(1)}</span>
                </div>

                <button
                  className={`mt-2 px-5 py-2 rounded-full font-medium transition ${
                    requests.some((req) => req._id === user._id)
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-white text-red-800 hover:bg-white/90"
                  }`}
                  disabled={requests.some((req) => req._id === user._id)}
                  onClick={() => sendRequest(user._id)}
                >
                  {requests.some((req) => req._id === user._id) ? "Request Sent" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <p className="text-center text-white">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Mentor Cards Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedMentors.length > 0 ? (
          displayedMentors.map((user) => (
            <div
              key={user._id}
              className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition transform hover:scale-105 relative"
            >
              <FaUserCircle className="text-white text-6xl mb-4" />
              <h2 className="text-lg font-semibold text-white">{user.name}</h2>
              <p className="text-sm text-white mb-1">{user.college}</p>
              <p className="text-sm text-white mb-1">
                {user.degree} - {user.graduationYear}
              </p>
              <p className="text-sm text-white mb-2">{user.skills.join(", ")}</p>

              {/* Reviews */}
              <div className="mb-4 w-full">
                {user.reviews.map((r, idx) => (
                  <div key={idx} className="flex items-center mb-1">
                    {[...Array(r.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 mr-1" />
                    ))}
                    <span className="text-xs text-white ml-1">({r.comment})</span>
                  </div>
                ))}
              </div>

              {/* Contact Links */}
              <div className="flex space-x-4 mb-4">
                <a
                  href={`mailto:${user.email}`}
                  className="text-white hover:text-gray-200 text-xl"
                  title="Send Email"
                >
                  <FaEnvelope />
                </a>
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-200 text-xl"
                    title="LinkedIn Profile"
                  >
                    <FaLinkedin />
                  </a>
                )}
              </div>

              {/* Connect Button */}
              <button
                className={`mt-2 px-5 py-2 rounded-full font-medium transition ${
                  requests.some((req) => req._id === user._id)
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={requests.some((req) => req._id === user._id)}
                onClick={() => sendRequest(user._id)}
              >
                {requests.some((req) => req._id === user._id) ? "Request Sent" : "Connect"}
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-white">
            No profiles found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
