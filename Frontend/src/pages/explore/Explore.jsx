import React, { useState } from "react";
import { FaSearch, FaUserCircle, FaLinkedin, FaEnvelope } from "react-icons/fa";

const profiles = [
  {
    id: 1,
    name: "Sakshi Sharma",
    role: "Alumni • Software Engineer @ Google",
    branch: "CSE",
    year: "2022",
    email: "aarav.sharma@example.com",
    linkedin: "#",
  },
  {
    id: 2,
    name: "Sanskriti Singh",
    role: "Student • BTech Final Year",
    branch: "IT",
    year: "2026",
    email: "sanskriti.singh@example.com",
    linkedin: "#",
  },
  {
    id: 3,
    name: "Satyam Verma",
    role: "Alumni • Data Scientist @ Microsoft",
    branch: "CSE-DS",
    year: "2020",
    email: "rohan.verma@example.com",
    linkedin: "#",
  },
  {
    id: 4,
    name: "Zaid",
    role: "Student • BTech 2nd Year",
    branch: "CSE-AI",
    year: "2027",
    email: "priya.mehta@example.com",
    linkedin: "#",
  },
];

export default function Explore() {
  const [search, setSearch] = useState("");

  const filteredProfiles = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.branch.toLowerCase().includes(search.toLowerCase()) ||
      p.year.includes(search)
  );

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
            placeholder="Search by name, branch, or year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Profile Cards Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition transform hover:scale-105"
            >
              {/* Avatar */}
              <FaUserCircle className="text-blue-600 text-6xl mb-4" />

              {/* Info */}
              <h2 className="text-lg font-semibold text-gray-800">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-600 mb-1">{profile.role}</p>
              <p className="text-sm text-gray-500 mb-1">
                Branch: {profile.branch}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Passing Year: {profile.year}
              </p>

              {/* Contact Buttons */}
              <div className="flex space-x-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="text-blue-600 hover:text-blue-800 text-xl"
                  title="Send Email"
                >
                  <FaEnvelope />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xl"
                  title="LinkedIn Profile"
                >
                  <FaLinkedin />
                </a>
              </div>

              {/* Connect Button */}
              <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">
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
