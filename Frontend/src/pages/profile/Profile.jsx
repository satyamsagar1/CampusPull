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
  FaCamera,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { ProfileContext } from "../../context/profileContext";

export default function Profile() {
  const { profile, loading, error, updateProfile } = useContext(ProfileContext);

  const [bio, setbio] = useState("");
  const [editbio, setEditbio] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [newExperience, setNewExperience] = useState({ role: "", description: "", year: "" });
  const [newEducation, setNewEducation] = useState({ degree: "", institution: "", year: "" });
  const [newCert, setNewCert] = useState({ name: "", provider: "" });
  const [resume, setResume] = useState(null);
  const [previewImage, setPreviewImage] = useState(profile?.profileImage || "/default-avatar.png");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (profile) {
      setbio(profile.bio || "");
      setPreviewImage(profile.profileImage || "/default-avatar.png");
    }
  }, [profile]);

  if (loading) return <p className="p-6 text-center text-gray-600">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!profile && !loading) return <p className="p-6">No profile data</p>;

  const safeUpdate = async (updatedProfile) => {
    try {
      await updateProfile(updatedProfile);
    } catch (err) {
      alert("Failed to update profile: " + (err?.message || "Unknown error"));
      throw err;
    }
  };

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("File read error"));
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  const resizeImage = (dataUrl, maxWidth = 1024) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width <= maxWidth) return resolve(dataUrl);
        const ratio = maxWidth / img.width;
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeMB = 6;
    if (file.size / 1024 / 1024 > maxSizeMB) {
      alert(`Image too large. Please choose an image smaller than ${maxSizeMB} MB.`);
      return;
    }

    try {
      setUploadingImage(true);
      let dataUrl = await readFileAsDataURL(file);
      dataUrl = await resizeImage(dataUrl, 1024);
      setPreviewImage(dataUrl);

      try {
        await safeUpdate({ ...profile, profileImage: dataUrl });
        setUploadingImage(false);
        return;
      } catch (err) {
        console.warn("Base64 update failed, attempting multipart upload fallback...", err);
      }

      try {
        const formData = new FormData();
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const filename = file.name || `profile_${Date.now()}.jpg`;
        formData.append("photo", blob, filename);
        const token = localStorage.getItem("token");
        const uploadRes = await fetch("/api/upload-profile-photo", {
          method: "POST",
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!uploadRes.ok) {
          const txt = await uploadRes.text().catch(() => "");
          throw new Error(`Upload failed (${uploadRes.status}): ${txt}`);
        }

        const uploadJson = await uploadRes.json();
        const photoUrl = uploadJson.photoUrl || uploadJson.url || uploadJson.data?.photoUrl;
        if (!photoUrl) throw new Error("No photo URL returned from upload endpoint.");
        await safeUpdate({ ...profile, profileImage: photoUrl });
        setPreviewImage(photoUrl);
      } catch (uploadErr) {
        console.error("Multipart upload fallback failed:", uploadErr);
        alert(
          "Failed to upload image to server. Both methods failed. Check console."
        );
      }
    } catch (err) {
      console.error("Image handling error:", err);
      alert("Could not process image. Try a different file.");
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = "";
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

  const Card = ({ children }) => (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-xl p-6 transition-all border border-white/30"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 md:px-10 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <Card>
          <div className="flex flex-col items-center text-center relative">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={previewImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />

            {/* Upload Button */}
            <label
              htmlFor="imageUpload"
              className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-md"
              title={uploadingImage ? "Uploading..." : "Change photo"}
            >
              <FaCamera size={16} />
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <h2 className="text-2xl font-bold mt-4 text-gray-800">{profile.name || "Unnamed"}</h2>
            <p className="text-gray-500">{profile.role || "No role yet"}</p>
            <div className="flex gap-5 mt-4 text-2xl">
              <a href={profile.linkedin || "#"} className="hover:text-blue-600 transition">
                <FaLinkedin />
              </a>
              <a href={profile.github || "#"} className="hover:text-gray-800 transition">
                <FaGithub />
              </a>
            </div>

            {/* 🔥 Streak Section */}
            <div className="mt-4 flex flex-col items-center">
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-md animate-pulse">
                <span role="img" aria-label="fire">🔥</span>
                <span>{profile.streakCount ?? 5} days</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">Your current streak</p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-700">
              <FaTools /> Skills
            </h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.skills?.length ? (
                profile.skills.map((skill, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                  >
                    {skill}
                  </motion.span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No skills added yet</p>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add new skill"
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <button
                onClick={addSkill}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* About Section */}
          <Card>
            <h3 className="text-lg font-semibold mb-3 text-indigo-700">About</h3>
            {editbio ? (
              <div className="flex flex-col gap-3">
                <textarea
                  value={bio}
                  onChange={(e) => setbio(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <button
                  onClick={savebio}
                  className="self-end px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-700 leading-relaxed">{bio || "No about information yet"}</p>
                <button
                  onClick={() => setEditbio(true)}
                  className="mt-2 text-sm text-indigo-600 font-medium hover:underline"
                >
                  ✏️ Edit
                </button>
              </>
            )}
          </Card>

          {/* Reusable Sections */}
          {[
            { icon: <FaFolderOpen />, title: "Projects", data: profile.projects, add: addProject, inputs: newProject, setInputs: setNewProject, fields: ["title", "description"] },
            { icon: <FaBriefcase />, title: "Experience", data: profile.experience, add: addExperience, inputs: newExperience, setInputs: setNewExperience, fields: ["role", "year", "description"] },
            { icon: <FaGraduationCap />, title: "Education", data: profile.education, add: addEducation, inputs: newEducation, setInputs: setNewEducation, fields: ["degree", "institution", "year"] },
            { icon: <FaCertificate />, title: "Certifications", data: profile.certifications, add: addCertification, inputs: newCert, setInputs: setNewCert, fields: ["name", "provider"] },
          ].map((section, idx) => (
            <Card key={idx}>
              <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-700">
                {section.icon} {section.title}
              </h3>
              <div className="mt-3 space-y-3">
                {section.data?.length ? (
                  section.data.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 border rounded-lg bg-white/40 shadow-sm"
                    >
                      {Object.values(item).map((val, j) => (
                        <p key={j} className="text-gray-700 text-sm">
                          {val || "—"}
                        </p>
                      ))}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No {section.title.toLowerCase()} added yet</p>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-3">
                {section.fields.map((f) => (
                  <input
                    key={f}
                    type="text"
                    value={section.inputs[f]}
                    onChange={(e) => section.setInputs({ ...section.inputs, [f]: e.target.value })}
                    placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                ))}
                <button
                  onClick={section.add}
                  className="self-start px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition flex items-center gap-2"
                >
                  <FaPlus /> Add {section.title}
                </button>
              </div>
            </Card>
          ))}

          {/* AI Resume Builder */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FaMagic /> AI Resume Builder
            </h3>
            <button
              onClick={generateResume}
              className="mt-4 px-5 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
            >
              Generate Resume
            </button>
            {resume && (
              <div className="mt-4 bg-white text-gray-800 rounded-xl p-4 max-h-64 overflow-y-auto shadow-inner">
                <pre className="whitespace-pre-wrap text-sm">{resume}</pre>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
