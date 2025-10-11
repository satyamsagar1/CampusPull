import React, { useContext, useState } from "react";
import {
  FaSearch,
  FaUserCircle,
  FaLinkedin,
  FaEnvelope,
  FaUserPlus,
  FaStar,
  FaFire,
} from "react-icons/fa";
import { ExploreContext } from "../../context/exploreContext";
import RequestsPage from "./RequestsPage";

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
        { user: "John", rating: 5, comment: "Great mentor!" },
        { user: "Emma", rating: 4, comment: "Very helpful!" },
      ],
    },
    {
      _id: "2",
      name: "Bob Smith",
      college: "Stanford",
      degree: "M.Sc AI",
      graduationYear: 2021,
      skills: ["Python", "Machine Learning"],
      email: "bob@stanford.edu",
      linkedin: "https://linkedin.com/in/bob",
      reviews: [
        { user: "Liam", rating: 5, comment: "Excellent guidance!" },
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

  if (showRequestsPage) {
    return <RequestsPage onBack={() => setShowRequestsPage(false)} />;
  }

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Explore Network</h1>
          <p className="text-gray-600 mt-1">Connect with students & mentors of LinkeMate</p>
        </div>
        <button
          onClick={() => setShowRequestsPage(true)}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white rounded-xl font-medium shadow-lg flex items-center gap-2 transition"
        >
          <FaUserPlus /> Requests {requests?.length > 0 && `(${requests.length})`}
        </button>
      </div>

      {/* Pending Requests Panel */}
      <div className="bg-white/30 backdrop-blur-md p-4 rounded-2xl shadow mb-8 border border-white/30">
        <h2 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
          <FaUserPlus /> Pending Requests
        </h2>
        {requests.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {requests.map((req) => (
              <div
                key={req._id}
                className="px-4 py-2 bg-white rounded-full shadow text-gray-800 font-medium"
              >
                {req.name || "Unknown User"}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No pending requests.</p>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center w-full max-w-xl bg-white/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/30 shadow-sm">
          <FaSearch className="text-gray-400 text-lg mr-2" />
          <input
            type="text"
            placeholder="Search by name, college, degree, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Top Rated Mentors */}
      {topRatedMentors.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaFire className="text-yellow-400" /> Top Rated Mentors
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topRatedMentors.map((user) => (
              <div
                key={user._id}
                className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <FaUserCircle className="text-pink-500 text-6xl mb-4" />
                <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500 mb-1">{user.college}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {user.degree} - {user.graduationYear}
                </p>

                <div className="flex items-center mb-4">
                  {[...Array(Math.round(user.avgRating))].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 mr-1" />
                  ))}
                  <span className="text-sm ml-2 text-gray-700">{user.avgRating.toFixed(1)}</span>
                </div>

                <button
                  className={`mt-2 px-5 py-2 rounded-xl font-medium transition ${
                    requests.some((req) => req._id === user._id)
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
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

      {/* All Mentors Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedMentors.length > 0 ? (
          displayedMentors.map((user) => (
            <div
              key={user._id}
              className="bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <FaUserCircle className="text-pink-500 text-6xl mb-4" />
              <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-1">{user.college}</p>
              <p className="text-sm text-gray-500 mb-1">
                {user.degree} - {user.graduationYear}
              </p>
              <p className="text-sm text-gray-700 mb-2">{user.skills.join(", ")}</p>

              {/* Reviews */}
              <div className="mb-4 w-full">
                {user.reviews.map((r, idx) => (
                  <div key={idx} className="flex items-center mb-1">
                    {[...Array(r.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 mr-1" />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">({r.comment})</span>
                  </div>
                ))}
              </div>

              {/* Contact Links */}
              <div className="flex space-x-4 mb-4">
                <a
                  href={`mailto:${user.email}`}
                  className="text-gray-700 hover:text-gray-900 text-xl"
                  title="Send Email"
                >
                  <FaEnvelope />
                </a>
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900 text-xl"
                    title="LinkedIn Profile"
                  >
                    <FaLinkedin />
                  </a>
                )}
              </div>

              {/* Connect Button */}
              <button
                className={`mt-2 px-5 py-2 rounded-xl font-medium transition ${
                  requests.some((req) => req._id === user._id)
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
                }`}
                disabled={requests.some((req) => req._id === user._id)}
                onClick={() => sendRequest(user._id)}
              >
                {requests.some((req) => req._id === user._id) ? "Request Sent" : "Connect"}
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            No profiles found matching your search.
          </p>
        )}
      </div>

      {loading && <p className="text-center text-gray-600 mt-6">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-6">{error}</p>}
    </div>
  );
}
