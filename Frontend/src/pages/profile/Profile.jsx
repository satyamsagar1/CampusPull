import React, { useState, useEffect, useContext } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTools,
  FaPlus,
  FaMagic,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaFolderOpen,
  FaCamera
} from "react-icons/fa";
import { motion } from "framer-motion";
import { ProfileContext } from "../../context/profileContext"; 

// ✅ FIX: Define Card component OUTSIDE of the main component
const Card = ({ children, className = "" }) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
    className={`bg-white/70 backdrop-blur-xl rounded-2xl shadow-md p-6 border border-white/30 ${className}`}
  >
    {children}
  </motion.div>
);

export default function Profile() {
  const { profile, loading, error, updateProfile, addItemToProfile, uploadPhoto } = useContext(ProfileContext);

  const [bio, setBio] = useState("");
  const [editBio, setEditBio] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [resume, setResume] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form States
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "" });
  const [newExperience, setNewExperience] = useState({ role: "", company: "", description: "", year: "" });
  const [newEducation, setNewEducation] = useState({ degree: "", institution: "", year: "" });
  const [newCert, setNewCert] = useState({ name: "", provider: "", link: "" }); 

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
    }
  }, [profile]);

  if (loading) return <p className="p-6 text-center text-gray-600">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!profile) return <p className="p-6">No profile data</p>;

  // --- HANDLERS ---

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      return alert("Image too large. Please choose an image smaller than 5MB.");
    }

    setUploadingImage(true);
    try {
      await uploadPhoto(file); 
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    await addItemToProfile("skills", newSkill);
    setNewSkill("");
  };

  const handleAddSection = async (key, item, setItem, emptyState) => {
    const isValid = Object.values(item).some(val => val.trim() !== "");
    if (!isValid) return;

    await addItemToProfile(key, item);
    setItem(emptyState);
  };

  const saveBio = async () => {
    await updateProfile({ bio });
    setEditBio(false);
  };

  const generateResume = () => {
    const resumeData = `
📌 Name: ${profile.name || ""}
🎯 Role: ${profile.role || ""}

💡 About:
${profile.bio || ""}

🛠 Skills:
${profile.skills?.join(", ") || "None"}

🚀 Projects:
${profile.projects?.map(p => `- ${p.title}: ${p.description}`).join("\n") || "None"}

💼 Experience:
${profile.experience?.map(e => `- ${e.role} at ${e.company} (${e.year})`).join("\n") || "None"}

🎓 Education:
${profile.education?.map(e => `- ${e.degree}, ${e.institution} (${e.year})`).join("\n") || "None"}

📜 Certifications:
${profile.certifications?.map(c => `- ${c.name} by ${c.provider}`).join("\n") || "None"}
    `;
    setResume(resumeData);
  };

  // Configuration for the 4 sections
  const sections = [
    {
      key: "projects",
      title: "Projects",
      icon: <FaFolderOpen />,
      data: profile.projects,
      inputs: newProject,
      setInputs: setNewProject,
      emptyState: { title: "", description: "", link: "" },
      fields: [
        { name: "title", placeholder: "Project Title" },
        { name: "description", placeholder: "Description" },
        { name: "link", placeholder: "Link (GitHub/Live)" }
      ]
    },
    {
      key: "experience",
      title: "Experience",
      icon: <FaBriefcase />,
      data: profile.experience,
      inputs: newExperience,
      setInputs: setNewExperience,
      emptyState: { role: "", company: "", description: "", year: "" },
      fields: [
        { name: "role", placeholder: "Role / Job Title" },
        { name: "company", placeholder: "Company Name" },
        { name: "year", placeholder: "Year" },
        { name: "description", placeholder: "Description" }
      ]
    },
    {
      key: "education",
      title: "Education",
      icon: <FaGraduationCap />,
      data: profile.education,
      inputs: newEducation,
      setInputs: setNewEducation,
      emptyState: { degree: "", institution: "", year: "" },
      fields: [
        { name: "degree", placeholder: "Degree (e.g. B.Tech CS)" },
        { name: "institution", placeholder: "College / University" },
        { name: "year", placeholder: "Year" }
      ]
    },
    {
      key: "certifications",
      title: "Certifications",
      icon: <FaCertificate />,
      data: profile.certifications,
      inputs: newCert,
      setInputs: setNewCert,
      emptyState: { name: "", provider: "", link: "" },
      fields: [
        { name: "name", placeholder: "Certificate Name" },
        { name: "provider", placeholder: "Provider" },
        { name: "link", placeholder: "Verification Link" }
      ]
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 md:px-10 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ================= SIDEBAR ================= */}
        <Card className="h-fit">
          <div className="flex flex-col items-center text-center relative">
            <div className="relative">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={profile.profileImage || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
              />
              <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-md transition-colors">
                {uploadingImage ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaCamera size={14} />}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
              </label>
            </div>

            <h2 className="text-2xl font-bold mt-4 text-gray-800">{profile.name || "User"}</h2>
            <p className="text-gray-500">{profile.role || "Student"}</p>
            
            <div className="flex gap-5 mt-4 text-2xl text-gray-600">
              {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition"><FaLinkedin /></a>}
              {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-black transition"><FaGithub /></a>}
            </div>

            <div className="mt-6 w-full">
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm border border-orange-200">
                <span role="img" aria-label="fire">🔥</span>
                <span>{profile.streakCount || 0} Day Streak</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-700 mb-3"><FaTools /> Skills</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill, idx) => (
                  <span key={idx} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                ))
              ) : <p className="text-sm text-gray-400 italic">No skills added.</p>}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <button onClick={handleAddSkill} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition"><FaPlus /></button>
            </div>
          </div>
        </Card>

        {/* ================= MAIN CONTENT ================= */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-indigo-700">About</h3>
              {!editBio && <button onClick={() => setEditBio(true)} className="text-sm text-indigo-600 font-medium hover:underline">✏️ Edit</button>}
            </div>
            {editBio ? (
              <div className="flex flex-col gap-3">
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none min-h-[100px]" placeholder="Tell us about yourself..." />
                <div className="flex gap-2 self-end">
                   <button onClick={() => setEditBio(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                   <button onClick={saveBio} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">Save Bio</button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{bio || "No about information yet."}</p>
            )}
          </Card>

          {sections.map((section) => (
            <Card key={section.key}>
              <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-700 mb-4">{section.icon} {section.title}</h3>
              <div className="space-y-3 mb-4">
                {section.data?.length > 0 ? (
                  section.data.map((item, i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg bg-white/50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                          {Object.entries(item).map(([k, v]) => {
                            if (k === '_id') return null;

                            // ✨ LOGIC TO DETECT LINKS
                            const isLink = k === 'link' || (typeof v === 'string' && (v.startsWith('http://') || v.startsWith('https://')));

                            return (
                              <div key={k} className="text-sm">
                                <span className="font-semibold text-gray-600 capitalize">{k}: </span>
                                {isLink ? (
                                    <a 
                                        href={v} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                                    >
                                        {v}
                                    </a>
                                ) : (
                                    <span className="text-gray-800">{v}</span>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))
                ) : <p className="text-sm text-gray-400 italic">No {section.title.toLowerCase()} added yet.</p>}
              </div>

              <div className="bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  {section.fields.map((field) => (
                    <input
                      key={field.name}
                      type="text"
                      value={section.inputs[field.name]}
                      onChange={(e) => section.setInputs({ ...section.inputs, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      className={`px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none ${field.name === 'description' ? 'sm:col-span-2' : ''}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => handleAddSection(section.key, section.inputs, section.setInputs, section.emptyState)}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition flex items-center justify-center gap-2"
                >
                  <FaPlus size={12} /> Add {section.title}
                </button>
              </div>
            </Card>
          ))}

          <motion.div whileHover={{ y: -3 }} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><FaMagic /> AI Resume Builder</h3>
            <p className="text-indigo-100 text-sm mt-1">Generate a text-based resume from your profile instantly.</p>
            <button onClick={generateResume} className="mt-4 px-5 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-indigo-50 transition text-sm">Generate Resume</button>
            {resume && (
              <div className="mt-4 bg-white/95 text-gray-800 rounded-xl p-4 max-h-64 overflow-y-auto shadow-inner font-mono text-xs sm:text-sm border-2 border-indigo-200">
                <pre className="whitespace-pre-wrap">{resume}</pre>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}