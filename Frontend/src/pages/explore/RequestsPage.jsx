// src/pages/explore/RequestsPage.jsx
import React, { useState } from "react";

export default function RequestsPage({ onBack }) {
  // Dummy incoming requests data
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

  // Accept request
  const handleAccept = (id) => {
    alert("Request Accepted!");
    setIncomingRequests((prev) => prev.filter((r) => r._id !== id));
  };

  // Ignore request
  const handleIgnore = (id) => {
    alert("Request Ignored!");
    setIncomingRequests((prev) => prev.filter((r) => r._id !== id));
  };

  // View profile
  const handleViewProfile = (user) => {
    alert(`Viewing profile of ${user.name}\nCollege: ${user.college}\nDegree: ${user.degree}`);
  };

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-white text-blue-600 rounded-full font-medium shadow"
      >
        Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Incoming Requests</h1>

      {incomingRequests.length === 0 ? (
        <p>No incoming requests.</p>
      ) : (
        <div className="space-y-4">
          {incomingRequests.map((req) => (
            <div
              key={req._id}
              className="p-4 bg-white/20 backdrop-blur-md rounded-xl flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">{req.name}</h2>
                <p className="text-sm">{req.college}</p>
                <p className="text-sm">{req.degree} - {req.graduationYear}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(req._id)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-full font-medium"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleIgnore(req._id)}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded-full font-medium"
                >
                  Ignore
                </button>
                <button
                  onClick={() => handleViewProfile(req)}
                  className="px-3 py-1 bg-blue-400 hover:bg-blue-500 rounded-full font-medium"
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
