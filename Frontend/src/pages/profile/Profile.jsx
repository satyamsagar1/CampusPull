import React, { useState, useEffect } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaCode,
  FaArrowLeft,
  FaBriefcase,
  FaTools,
  FaPlus,
  FaCamera,
  FaGraduationCap,
  FaCertificate,
  FaRegNewspaper,
  FaMagic,
} from "react-icons/fa";

export default function Profile() {
  const [name, setName] = useState("Sanskriti");
  const [role] = useState("Final Year BTech Student | Aspiring Developer");

  const [skills, setSkills] = useState(["Java (DSA)", "React.js", "Node.js", "MongoDB"]);
  const [newSkill, setNewSkill] = useState("");

  const [projects, setProjects] = useState([
    { title: "Cold Chain IQ", description: "Analytics platform for cold storage." },
    { title: "Mental Health 101", description: "Web app for anxiety & bipolar disorder support." },
  ]);
  const [newProject, setNewProject] = useState({ title: "", description: "" });

  const [experience, setExperience] = useState([
    { role: "UI/UX Intern – Dehix", description: "Created logos and designed web pages using Figma.", year: "2024" },
  ]);
  const [newExperience, setNewExperience] = useState({ role: "", description: "", year: "" });

  const [education, setEducation] = useState([
    { degree: "B.Tech in Computer Science", institution: "ABESIT College of Engineering", year: "2021 - 2025" },
  ]);
  const [newEducation, setNewEducation] = useState({ degree: "", institution: "", year: "" });

  const [certifications, setCertifications] = useState([{ name: "Data Structures & Algorithms", provider: "Coursera" }]);
  const [newCert, setNewCert] = useState({ name: "", provider: "" });

  const [about, setAbout] = useState(
    "Passionate about building impactful projects in software development, data analytics, and full-stack web."
  );
  const [editAbout, setEditAbout] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null); // AI Resume

  // Load profile image from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) setProfileImage(savedImage);
  }, []);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      localStorage.setItem("profileImage", imageUrl);
    }
  };

  // Add Functions
  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };
  const addProject = () => {
    if (newProject.title.trim()) {
      setProjects([...projects, newProject]);
      setNewProject({ title: "", description: "" });
    }
  };
  const addExperience = () => {
    if (newExperience.role.trim()) {
      setExperience([...experience, newExperience]);
      setNewExperience({ role: "", description: "", year: "" });
    }
  };
  const addEducation = () => {
    if (newEducation.degree.trim()) {
      setEducation([...education, newEducation]);
      setNewEducation({ degree: "", institution: "", year: "" });
    }
  };
  const addCertification = () => {
    if (newCert.name.trim()) {
      setCertifications([...certifications, newCert]);
      setNewCert({ name: "", provider: "" });
    }
  };

  // Mock AI Resume Builder
  const generateResume = () => {
    const resumeData = `
📌 Resume: ${name}
🎯 Role: ${role}

💡 About:
${about}

🛠 Skills:
${skills.join(", ")}

🚀 Projects:
${projects.map((p) => `- ${p.title}: ${p.description}`).join("\n")}

💼 Experience:
${experience.map((e) => `- ${e.role} (${e.year}): ${e.description}`).join("\n")}

🎓 Education:
${education.map((e) => `- ${e.degree}, ${e.institution} (${e.year})`).join("\n")}

📜 Certifications:
${certifications.map((c) => `- ${c.name} by ${c.provider}`).join("\n")}
    `;
    setResume(resumeData);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Colorful Background Banner */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-3xl"></div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 text-gray-800 hover:bg-gray-200 rounded-lg shadow"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* Profile Layout */}
      <div className="relative z-10 max-w-6xl mx-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={profileImage || "https://via.placeholder.com/120"}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <label className="absolute bottom-1 right-1 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-600">
                <FaCamera size={14} />
                <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
              </label>
            </div>
            <h2 className="text-xl font-bold mt-4">{name}</h2>
            <p className="text-gray-600">{role}</p>
            <div className="flex gap-4 mt-4 text-xl">
              <a href="#" className="hover:text-blue-600"><FaLinkedin /></a>
              <a href="#" className="hover:text-gray-800"><FaGithub /></a>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold flex items-center gap-2"><FaTools /> Skills</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-sm shadow">
                  {skill}
                </span>
              ))}
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
            {editAbout ? (
              <div className="flex flex-col gap-3">
                <textarea value={about} onChange={(e) => setAbout(e.target.value)} className="w-full p-2 border rounded-lg" />
                <button onClick={() => setEditAbout(false)} className="self-end px-3 py-1 bg-green-500 text-white rounded-lg">Save</button>
              </div>
            ) : (
              <>
                <p className="text-gray-700">{about}</p>
                <button onClick={() => setEditAbout(true)} className="mt-2 text-sm text-blue-500">✏️ Edit</button>
              </>
            )}
          </div>

          {/* Projects */}
          <div className="bg-white/90 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3"><FaCode /> Projects</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-4 border rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 shadow">
                  <h4 className="font-bold text-blue-600">{proj.title}</h4>
                  <p className="text-gray-600 text-sm mt-2">{proj.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <input type="text" placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className="px-3 py-1 border rounded-lg text-sm" />
              <input type="text" placeholder="Project Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="px-3 py-1 border rounded-lg text-sm" />
              <button onClick={addProject} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm self-start"><FaPlus /> Add Project</button>
            </div>
          </div>

          {/* AI Resume Builder */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><FaMagic /> AI Resume Builder</h3>
            <p className="mt-2 text-sm text-purple-100">
              Instantly generate a structured resume preview using your profile data.
            </p>
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

          {/* Experience */}
          <div className="bg-white/90 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><FaBriefcase /> Experience</h3>
            <ul className="mt-3 border-l-2 border-blue-300 pl-4 space-y-4">
              {experience.map((exp, idx) => (
                <li key={idx} className="relative">
                  <div className="absolute -left-2 top-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h4 className="font-bold">{exp.role} <span className="text-sm text-gray-500">({exp.year})</span></h4>
                  <p className="text-gray-600 text-sm">{exp.description}</p>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col gap-2">
              <input type="text" placeholder="Role" value={newExperience.role} onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })} className="px-3 py-1 border rounded-lg text-sm" />
              <input type="text" placeholder="Description" value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} className="px-3 py-1 border rounded-lg text-sm" />
              <input type="text" placeholder="Year" value={newExperience.year} onChange={(e) => setNewExperience({ ...newExperience, year: e.target.value })} className="px-3 py-1 border rounded-lg text-sm" />
              <button onClick={addExperience} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm self-start"><FaPlus /> Add Experience</button>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white/90 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><FaGraduationCap /> Education</h3>
            <ul className="mt-3 space-y-3">
              {education.map((edu, idx) => (
                <li key={idx} className="p-3 border rounded-lg bg-gray-50 shadow-sm">
                  <h4 className="font-bold">{edu.degree}</h4>
                  <p className="text-gray-600 text-sm">{edu.institution} ({edu.year})</p>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col gap-2">
              <input type="text" placeholder="Degree" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} className="px-3 py-1 border rounded-lg text-sm" />
              <input type="text" placeholder="Institution" value={newEducation.institution} onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })} className="px-3 py-1 border rounded-lg text-sm" />
              <input type="text" placeholder="Year" value={newEducation.year} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })} className="px-3 py-1 border rounded-lg text-sm" />
              <button onClick={addEducation} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm self-start"><FaPlus /> Add Education</button>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white/90 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><FaCertificate /> Certifications</h3>
            <ul className="mt-3 space-y-3">
              {certifications.map((cert, idx) => (
                <li key={idx} className="p-3 border rounded-lg bg-gray-50 shadow-sm">
                  <h4 className="font-bold">{cert.name}</h4>
                  <p className="text-gray-600 text-sm">By {cert.provider}</p>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col gap-2">
              <input type="text" placeholder="Certification Name" value={newCert.name} onChange={(e) => setNewCert({ ...newCert, name: e.target.value })} className="px-3 py-1 border rounded-lg text-sm" />
              <input type="text" placeholder="Provider" value={newCert.provider} onChange={(e) => setNewCert({ ...newCert, provider: e.target.value })} className="px-3 py-1 border rounded-lg text-sm" />
              <button onClick={addCertification} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm self-start"><FaPlus /> Add Certification</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


