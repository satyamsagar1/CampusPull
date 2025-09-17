// pages/Explore.jsx
import React, { useContext } from "react";
import { FaSearch, FaUserCircle, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { ExploreContext } from "../../context/exploreContext";

export default function Explore() {
  const { suggestions, search, setSearch, loading, error, sendRequest } =
    useContext(ExploreContext);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-3">
        Explore Network 🌐
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Search and connect with students & alumni of LinkeMate
      </p>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
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

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Profile Cards Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {suggestions.length > 0 ? (
          suggestions.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition transform hover:scale-105"
            >
              <FaUserCircle className="text-blue-600 text-6xl mb-4" />
              <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-600 mb-1">{user.college}</p>
              <p className="text-sm text-gray-500 mb-1">
                {user.degree} - {user.graduationYear}
              </p>
              <p className="text-sm text-gray-500 mb-4">{user.skills.join(", ")}</p>

              <div className="flex space-x-4">
                <a
                  href={`mailto:${user.email}`}
                  className="text-blue-600 hover:text-blue-800 text-xl"
                  title="Send Email"
                >
                  <FaEnvelope />
                </a>
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xl"
                    title="LinkedIn Profile"
                  >
                    <FaLinkedin />
                  </a>
                )}
              </div>

              <button
                className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
                onClick={() => sendRequest(user._id)}
              >
                Connect
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No profiles found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
