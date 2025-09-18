import React, { useState, useEffect, useContext } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaArrowLeft,
  FaTools,
  FaPlus,
  FaMagic,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaFolderOpen,
} from "react-icons/fa";
import { ProfileContext } from "../../context/profileContext";

export default function Profile() {
  const { profile, loading, error, updateProfile } = useContext(ProfileContext);

  // Local editable states
  const [bio, setbio] = useState("");
  const [editbio, setEditbio] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [newExperience, setNewExperience] = useState({ role: "", description: "", year: "" });
  const [newEducation, setNewEducation] = useState({ degree: "", institution: "", year: "" });
  const [newCert, setNewCert] = useState({ name: "", provider: "" });
  const [resume, setResume] = useState(null);

  // Sync profile → local states
  useEffect(() => {
    if (profile) {
      setbio(profile.bio || "");
    }
  }, [profile]);

  // Loading and error states
  if (loading) return <p className="p-6">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!profile && !loading) return <p className="p-6">No profile data</p>;

  // --- Handlers with error alerts ---
  const safeUpdate = async (updatedProfile) => {
    try {
      await updateProfile(updatedProfile);
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    safeUpdate({ ...profile, skills: [...(profile.skills || []), newSkill] });
    setNewSkill("");
  };

  const addProject = () => {
    if (!newProject.title.trim()) return;
    safeUpdate({ ...profile, projects: [...(profile.projects || []), newProject] });
    setNewProject({ title: "", description: "" });
  };

  const addExperience = () => {
    if (!newExperience.role.trim()) return;
    safeUpdate({ ...profile, experience: [...(profile.experience || []), newExperience] });
    setNewExperience({ role: "", description: "", year: "" });
  };

  const addEducation = () => {
    if (!newEducation.degree.trim()) return;
    safeUpdate({ ...profile, education: [...(profile.education || []), newEducation] });
    setNewEducation({ degree: "", institution: "", year: "" });
  };

  const addCertification = () => {
    if (!newCert.name.trim()) return;
    safeUpdate({ ...profile, certifications: [...(profile.certifications || []), newCert] });
    setNewCert({ name: "", provider: "" });
  };

  const savebio = () => {
    safeUpdate({ bio });
    setEditbio(false);
  };

  // AI Resume Builder
  const generateResume = () => {
    const resumeData = `
📌 Name: ${profile.name || ""}
🎯 Role: ${profile.role || ""}

💡 About:
${profile.bio || ""}

🛠 Skills:
${profile.skills?.join(", ") || "None"}

🚀 Projects:
${
  profile.projects?.length
    ? profile.projects.map(p => `- ${p.title || ""}: ${p.description || ""}`).join("\n")
    : "None"
}

💼 Experience:
${
  profile.experience?.length
    ? profile.experience.map(e => `- ${e.role || ""} (${e.year || ""}): ${e.description || ""}`).join("\n")
    : "None"
}

🎓 Education:
${
  profile.education?.length
    ? profile.education.map(e => `- ${e.degree || ""}, ${e.institution || ""} (${e.year || ""})`).join("\n")
    : "None"
}

📜 Certifications:
${
  profile.certifications?.length
    ? profile.certifications.map(c => `- ${c.name || ""} by ${c.provider || ""}`).join("\n")
    : "None"
}
    `;
    setResume(resumeData);
  };

return (
  <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
    {/* Back Button */}
    <div className="absolute top-4 left-4 z-10">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 px-4 py-2 bg-white/80 text-gray-800 hover:bg-gray-200 rounded-lg shadow"
      >
        <FaArrowLeft /> Back
      </button>
    </div>

    <div className="relative z-10 max-w-6xl mx-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6">
        <div className="flex flex-col items-center text-center">
          <img
            src={profile.profileImage || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
          />
          <h2 className="text-xl font-bold mt-4">{profile.name || "Unnamed"}</h2>
          <p className="text-gray-600">{profile.role || "No role yet"}</p>
          <div className="flex gap-4 mt-4 text-xl">
            <a href={profile.linkedin || "#"} className="hover:text-blue-600">
              <FaLinkedin />
            </a>
            <a href={profile.github || "#"} className="hover:text-gray-800">
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaTools /> Skills
          </h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.skills?.length ? (
              profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-sm shadow"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No skills added yet</p>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add new skill"
              className="flex-1 px-3 py-1 border rounded-lg text-sm"
            />
            <button onClick={addSkill} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm">
              <FaPlus />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:col-span-2 space-y-6">
        {/* About */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3">About</h3>
          {editbio ? (
            <div className="flex flex-col gap-3">
              <textarea
                value={bio}
                onChange={(e) => setbio(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={savebio}
                className="self-end px-3 py-1 bg-green-500 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-700">{bio || "No about information yet"}</p>
              <button
                onClick={() => setEditbio(true)}
                className="mt-2 text-sm text-blue-500"
              >
                ✏️ Edit
              </button>
            </>
          )}
        </div>

        {/* Projects */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaFolderOpen /> Projects
          </h3>
          <div className="mt-3 space-y-2">
            {profile.projects?.length ? (
              profile.projects.map((p, idx) => (
                <div key={idx} className="p-3 border rounded-lg shadow-sm">
                  <p className="font-semibold">{p.title || "Untitled Project"}</p>
                  <p className="text-gray-600 text-sm">{p.description || "No description"}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No projects added yet</p>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="Project title"
              className="px-3 py-1 border rounded-lg text-sm"
            />
            <input
              type="text"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Project description"
              className="px-3 py-1 border rounded-lg text-sm"
            />
            <button
              onClick={addProject}
              className="self-start px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
            >
              <FaPlus /> Add Project
            </button>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaBriefcase /> Experience
          </h3>
          <div className="mt-3 space-y-2">
            {profile.experience?.length ? (
              profile.experience.map((e, idx) => (
                <div key={idx} className="p-3 border rounded-lg shadow-sm">
                  <p className="font-semibold">{e.role || "Role not provided"}</p>
                  <p className="text-gray-600 text-sm">{e.year || "Year not provided"}</p>
                  <p className="text-gray-600 text-sm">{e.description || "No description"}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No experience added yet</p>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <input
              type="text"
              value={newExperience.role}
              onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
              placeholder="Role"
              className="px-3 py-1 border rounded-lg text-sm"
            />
            <input
              type="text"
              value={newExperience.year}
              onChange={(e) => setNewExperience({ ...newExperience, year: e.target.value })}
              placeholder="Year"
              className="px-3 py-1 border rounded-lg text-sm"
            />
            <input
              type="text"
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              placeholder="Description"
              className="px-3 py-1 border rounded-lg text-sm"
            />
            <button
              onClick={addExperience}
              className="self-start px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
            >
              <FaPlus /> Add Experience
            </button>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaGraduationCap /> Education
          </h3>
          <div className="mt-3 space-y-2">
            {profile.education?.length ? (
              profile.education.map((edu, idx) => (
                <div key={idx} className="p-3 border rounded-lg shadow-sm">
                  <p className="font-semibold">{edu.degree || "Degree not provided"}</p>
                  <p className="text-gray-600 text-sm">{edu.institution || "Institution not provided"}</p>
                  <p className="text-gray-600 text-sm">{edu.year || "Year not provided"}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No education added yet</p>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <input
              type="text"
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              placeholder="Degree"
              className="px-3 py-1 border rounded-lg text-sm"
            />
            <input
              type="text"
              value={newEducation.institution}
              onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              placeholder="Institution"
              className="px-3 py-1 border rounded-lg text-sm"
            />
            <input
              type="text"
              value={newEducation.year}
              onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
              placeholder="Year"
              className="px-3 py-1 border rounded-lg text-sm"
            />
            <button
              onClick={addEducation}
              className="self-start px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
            >
              <FaPlus /> Add Education
            </button>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaCertificate /> Certifications
          </h3>
          <div className="mt-3 space-y-2">
            {profile.certifications?.length ? (
              profile.certifications.map((c, idx) => (
                <div key={idx} className="p-3 border rounded-lg shadow-sm">
                  <p className="font-semibold">{c.name || "Certificate name not provided"}</p>
                  <p className="text-gray-600 text-sm">{c.provider || "Provider not provided"}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No certifications added yet</p>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <input
              type="text"
              value={newCert.name}
              onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
              placeholder="Certificate name"
              className="px-3 py-1 border rounded-lg text-sm"
            />
            <input
              type="text"
              value={newCert.provider}
              onChange={(e) => setNewCert({ ...newCert, provider: e.target.value })}
              placeholder="Provider"
              className="px-3 py-1 border rounded-lg text-sm"
            />
            <button
              onClick={addCertification}
              className="self-start px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
            >
              <FaPlus /> Add Certification
            </button>
          </div>
        </div>

        {/* AI Resume Builder */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaMagic /> AI Resume Builder
          </h3>
          <button
            onClick={generateResume}
            className="mt-4 px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
          >
            Generate Resume
          </button>
          {resume && (
            <div className="mt-4 bg-white text-gray-800 rounded-xl p-4 max-h-64 overflow-y-auto shadow-inner">
              <pre className="whitespace-pre-wrap text-sm">{resume}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

}
