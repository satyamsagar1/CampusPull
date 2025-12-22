import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion"; 
import { 
  FaGithub, FaLinkedin, FaGlobe, FaBriefcase, 
  FaGraduationCap, FaCertificate, FaFolderOpen, 
  FaUniversity, FaUser, FaEnvelope 
} from "react-icons/fa"; 
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext"; 
import { useExplore } from "../../context/exploreContext"; 

// ✅ Reusable Card Component
const Card = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white/70 backdrop-blur-xl rounded-2xl shadow-md p-6 border border-white/30 ${className}`}
  >
    {children}
  </motion.div>
);

const PublicProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth(); 
  
  const { 
    sendRequest, 
    outgoingRequestIds, 
    acceptedConnectionIds, 
    incomingRequests 
  } = useExplore();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/connection/profile/${userId}`); 
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  if (loading) return <div className="p-20 text-center text-gray-500 font-medium">Loading Profile...</div>;
  if (!profile) return <div className="p-20 text-center text-red-500 font-bold">User not found</div>;

  // --- LOGIC: Connection Buttons ---
  const isMe = currentUser?._id === profile._id;
  const isConnected = acceptedConnectionIds.has(profile._id);
  const isRequestSent = outgoingRequestIds.has(profile._id);
  const hasIncomingRequest = incomingRequests.some(req => req.requester._id === profile._id);

  let actionButton;
  if (isMe) {
    actionButton = (
      <span className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg font-medium text-sm border border-gray-300">
        You (View Only)
      </span>
    );
  } else if (isConnected) {
    actionButton = (
      <button className="w-full bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 shadow-sm transition">
        Message
      </button>
    );
  } else if (isRequestSent) {
    actionButton = (
      <button disabled className="w-full bg-gray-400 text-white px-6 py-2 rounded-lg font-medium cursor-not-allowed">
        Request Sent
      </button>
    );
  } else if (hasIncomingRequest) {
     actionButton = (
      <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-md">
        Respond
      </button>
    );
  } else {
    actionButton = (
      <button 
        onClick={() => sendRequest(profile._id)}
        className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
      >
        Connect
      </button>
    );
  }

  // --- Helper: Role Logic ---
  const isStudent = profile.role === "student";
  const isTeacher = profile.role === "teacher";
  const isAlumni = profile.role === "alumni";

  // --- Data Sections Config (Read Only) ---
  const publicSections = [
    {
      key: "projects",
      title: "Projects",
      icon: <FaFolderOpen />,
      data: profile.projects,
    },
    {
      key: "experience",
      title: "Experience",
      icon: <FaBriefcase />,
      data: profile.experience,
    },
    {
      key: "education",
      title: "Education",
      icon: <FaGraduationCap />,
      data: profile.education,
    },
    {
      key: "certifications",
      title: "Certifications",
      icon: <FaCertificate />,
      data: profile.certifications,
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 md:px-10 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="space-y-6">
            <Card className="h-fit text-center">
                <div className="relative inline-block">
                    <img 
                        src={profile.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        alt={profile.name} 
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover mx-auto bg-white"
                    />
                     {/* Streak Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow border-2 border-white flex items-center gap-1">
                        🔥 {profile.streakCount || 0}
                    </div>
                </div>

                <h2 className="text-2xl font-bold mt-4 text-gray-800">{profile.name}</h2>
                <p className="text-indigo-600 font-medium capitalize mb-1">{profile.role}</p>
                <p className="text-gray-500 text-sm">{profile.headline || `${profile.degree || ""} Student`}</p>

                {/* Social Links (Including Email Icon) */}
                <div className="flex justify-center gap-4 mt-4 text-2xl text-gray-600">
                    {profile.linkedin && (
                        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition" title="LinkedIn"><FaLinkedin /></a>
                    )}
                    {profile.github && (
                        <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-black transition" title="GitHub"><FaGithub /></a>
                    )}
                    {profile.portfolio && (
                        <a href={profile.portfolio} target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition" title="Portfolio"><FaGlobe /></a>
                    )}
                    
                    {/* EMAIL ICON - Only shows if connected */}
                    {isConnected && profile.email && (
                        <a href={`mailto:${profile.email}`} className="hover:text-red-500 transition" title="Send Email">
                            <FaEnvelope />
                        </a>
                    )}
                </div>

                {/* Action Button */}
                <div className="mt-6">
                    {actionButton}
                </div>
            </Card>

            {/* Skills Card */}
            <Card>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-700 mb-3">
                    <FaUser /> Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                    {profile.skills?.length > 0 ? (
                        profile.skills.map((skill, idx) => (
                        <span key={idx} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                            {skill}
                        </span>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400 italic">No skills added.</p>
                    )}
                </div>
            </Card>
        </div>


        {/* ================= RIGHT MAIN CONTENT ================= */}
        <div className="md:col-span-2 space-y-6">
            
            {/* 1. Academic & Personal Info */}
            <Card>
                <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-4">
                    <FaUniversity /> Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
                    <div>
                        <span className="font-semibold text-gray-500 block text-xs uppercase">College</span>
                        <span>{profile.college || "N/A"}</span>
                    </div>
                    <div>
                         <span className="font-semibold text-gray-500 block text-xs uppercase">Department</span>
                         <span>{profile.department || "N/A"}</span>
                    </div>

                    {isTeacher && (
                        <div>
                            <span className="font-semibold text-gray-500 block text-xs uppercase">Designation</span>
                            <span>{profile.designation || "N/A"}</span>
                        </div>
                    )}

                    {(isStudent || isAlumni) && (
                        <>
                            <div>
                                <span className="font-semibold text-gray-500 block text-xs uppercase">Degree</span>
                                <span>{profile.degree || "N/A"}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-500 block text-xs uppercase">Graduation Year</span>
                                <span>{profile.graduationYear || "N/A"}</span>
                            </div>
                        </>
                    )}

                    {isStudent && (
                        <>
                            <div>
                                <span className="font-semibold text-gray-500 block text-xs uppercase">Current Year</span>
                                <span>{profile.year || "N/A"}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-500 block text-xs uppercase">Section</span>
                                <span>{profile.section || profile.Section || "N/A"}</span>
                            </div>
                        </>
                    )}
                </div>
            </Card>

            {/* 2. About / Bio */}
            <Card>
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">About</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {profile.bio || "This user hasn't written a bio yet."}
                </p>
            </Card>

            {/* 3. Dynamic Sections (Projects, Exp, Edu) */}
            {publicSections.map((section) => (
                <Card key={section.key}>
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-700 mb-4">
                        {section.icon} {section.title}
                    </h3>
                    
                    <div className="space-y-4">
                        {section.data?.length > 0 ? (
                            section.data.map((item, i) => (
                                <div key={i} className="p-4 border border-gray-200 rounded-lg bg-white/50 shadow-sm">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                                        {Object.entries(item).map(([k, v]) => {
                                            if (k === "_id") return null;
                                            // Check if value looks like a link
                                            const isLink = k === "link" || (typeof v === "string" && v.startsWith("http"));
                                            
                                            return (
                                                <div key={k} className="text-sm">
                                                    <span className="font-semibold text-gray-600 capitalize">{k}: </span>
                                                    {isLink ? (
                                                        <a href={v} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
                        ) : (
                            <p className="text-sm text-gray-400 italic">No {section.title.toLowerCase()} added yet.</p>
                        )}
                    </div>
                </Card>
            ))}

        </div>
      </div>
    </div>
  );
};

export default PublicProfile;