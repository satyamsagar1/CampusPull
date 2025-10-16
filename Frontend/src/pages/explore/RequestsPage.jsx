// src/pages/explore/RequestsPage.jsx
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function RequestsPage({ onBack }) {
  const [incomingRequests, setIncomingRequests] = useState([
    {
      _id: "r1",
      name: "Alice Johnson",
      college: "MIT",
      degree: "B.Tech CS",
      graduationYear: 2022,
    },
    {
      _id: "r2",
      name: "Bob Smith",
      college: "Stanford",
      degree: "M.Sc AI",
      graduationYear: 2021,
    },
    {
      _id: "r3",
      name: "Clara Davis",
      college: "Harvard",
      degree: "MBA",
      graduationYear: 2023,
    },
  ]);

  const handleAccept = (id) => {
    alert("Request Accepted!");
    setIncomingRequests((prev) => prev.filter((r) => r._id !== id));
  };

  const handleIgnore = (id) => {
    alert("Request Ignored!");
    setIncomingRequests((prev) => prev.filter((r) => r._id !== id));
  };

  const handleViewProfile = (user) => {
    alert(
      `Viewing profile of ${user.name}\nCollege: ${user.college}\nDegree: ${user.degree}`
    );
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-white shadow-lg text-pink-500 rounded-full font-medium hover:bg-white/90 transition"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Incoming Requests</h1>

      {incomingRequests.length === 0 ? (
        <p className="text-gray-600 text-center">No incoming requests.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {incomingRequests.map((req) => (
            <div
              key={req._id}
              className="p-6 bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg flex flex-col justify-between transition hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{req.name}</h2>
                <p className="text-sm text-gray-500">{req.college}</p>
                <p className="text-sm text-gray-500">
                  {req.degree} - {req.graduationYear}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => handleAccept(req._id)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white rounded-full font-medium transition shadow"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleIgnore(req._id)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full font-medium transition shadow"
                >
                  Ignore
                </button>
                <button
                  onClick={() => handleViewProfile(req)}
                  className="px-4 py-2 bg-white/50 hover:bg-white/70 text-pink-500 rounded-full font-medium transition shadow"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
