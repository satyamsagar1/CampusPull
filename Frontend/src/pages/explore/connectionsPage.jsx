// src/pages/explore/ConnectionsPage.jsx
import React from "react";
import { FaArrowLeft, FaUserCircle, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useExplore } from "../../context/exploreContext"; // Import context hook

export default function ConnectionsPage({ onBack }) {
  // Get connections from the context
  const { connections, loading } = useExplore();

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-white shadow-lg text-pink-500 rounded-full font-medium hover:bg-white/90 transition"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Connections ({connections.length})</h1>

      {loading && <p className="text-center text-gray-600">Loading connections...</p>}
      
      {!loading && connections.length === 0 ? (
        <p className="text-gray-600 text-center">You haven't made any connections yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {connections.map((user) => (
            // Using a slightly simpler card for connections
            <div
              key={user._id}
              className="p-6 bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg flex flex-col items-center transition hover:shadow-xl hover:-translate-y-1"
            >
              {/* Avatar */}
               <div className="w-20 h-20 rounded-full mb-4 overflow-hidden border-2 border-blue-200 shadow-md">
                 {user.avatar ? (
                   <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                 ) : (
                   <FaUserCircle className="text-blue-500 text-6xl w-full h-full p-1" />
                 )}
              </div>
              {/* Info */}
              <h2 className="text-lg font-semibold text-gray-800 text-center">{user.name}</h2>
              <p className="text-sm text-gray-500 text-center mb-1">{user.college || "College not specified"}</p>
              <p className="text-sm text-gray-500 text-center mb-3">
                {user.degree || ""} {user.degree && user.graduationYear ? `- ${user.graduationYear}` : user.graduationYear || ""}
              </p>
               {/* Skills */}
              {(user.skills && user.skills.length > 0) && (
                <p className="text-xs text-center text-blue-600 font-medium mb-3">
                  {user.skills.slice(0, 3).join(" • ")} {user.skills.length > 3 ? '...' : ''}
                </p>
              )}
               {/* Contact Links */}
              <div className="flex space-x-4 mb-4 mt-auto pt-2">
                {user.email && (
                  <a href={`mailto:${user.email}`} className="text-gray-500 hover:text-pink-500 text-xl" title="Send Email">
                    <FaEnvelope />
                  </a>
                )}
                {user.linkedin && (
                  <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 text-xl" title="LinkedIn Profile">
                    <FaLinkedin />
                  </a>
                )}
              </div>
              {/* Optional: Add Message/Remove button here */}
              {/* <button className="mt-2 px-4 py-1 bg-red-100 text-red-600 text-xs rounded-full hover:bg-red-200">Remove</button> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}