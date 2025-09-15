import React from "react";

const TeamProfiles = () => {
  const team = [
    { name: "Sanskriti", role: "Frontend Developer" },
    { name: "Sakshi Sharma", role: "Backend Developer" },
    { name: "Zaid", role: "UI/UX Designer" },
    { name: "Satyam Sagar", role: "Database Engineer" },
    { name: "Shoiab", role: "Project Coordinator" },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Meet Our Team 👩‍💻👨‍💻
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {team.map((member, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 text-center transform transition hover:scale-105"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
              {member.name[0]}
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {member.name}
            </h3>
            <p className="text-gray-500">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamProfiles;
