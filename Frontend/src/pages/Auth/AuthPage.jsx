import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUniversity,
  FaCalendarAlt,
  FaPhone,
  FaLinkedin,
  FaInfoCircle,
  FaTools,
  FaBuilding,
  FaIdBadge,
  FaLayerGroup,
  FaChalkboardTeacher,
} from "react-icons/fa";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, login, signup } = useAuth();
  const [role, setRole] = useState("student");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "ABESIT", // Set default since it's readOnly
    degree: "",
    department: "",
    section: "",
    year: "",
    graduationYear: "",
    designation: "",
    currentCompany: "",
    phone: "",
    linkedin: "",
    bio: "",
    skills: [],
  });

  const toggleForm = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "skills") {
      setForm({ ...form, skills: value.split(",").map((s) => s.trim()) });
    } else if (name === "graduationYear" || name === "year") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  useEffect(() => {
    if (!user) {
      setForm((prev) => ({ ...prev, email: "", password: "" }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
      } else {
        await signup({ ...form, role });
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || (isLogin ? "Login failed" : "Signup failed"));
    }
  };

  const departments = ["CSE", "CS-DS", "AI", "IT", "IOT"];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8 transform transition duration-500 hover:scale-[1.01]">
        
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          {isLogin ? "Welcome Back 👋" : "Create Your Account 🚀"}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {isLogin ? "Login to continue" : "Join CampusPull and start your journey"}
        </p>

        {!isLogin && (
          <div className="flex justify-center gap-4 mb-8">
            {["student", "alumni", "teacher"].map((r) => (
              <button
                key={r}
                type="button"
                className={`px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all transform hover:-translate-y-1 ${
                  role === r
                    ? "bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-2"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setRole(r)}
              >
                {r === "student" && "🎓 Student"}
                {r === "alumni" && "🧑‍💼 Alumni"}
                {r === "teacher" && "📚 Teacher"}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isLogin && (
              <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            )}
            
            <div className={`flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50 ${isLogin ? "col-span-2" : ""}`}>
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                required
                className="w-full bg-transparent focus:outline-none"
              />
            </div>

            {/* Password Field with Condition */}
            <div className={`flex flex-col ${isLogin ? "col-span-2" : ""}`}>
              <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50">
                <FaLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
              {!isLogin && (
                <p className="text-[10px] text-gray-400 mt-1 ml-1">
                  * Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.
                </p>
              )}
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Academic & Professional Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50">
                  <FaUniversity className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="college"
                    value="ABESIT" 
                    readOnly       
                    className="w-full focus:outline-none bg-transparent text-gray-600 font-bold cursor-not-allowed"
                  />
                </div>

                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-white">
                  <FaLayerGroup className="text-gray-500 mr-2" />
                  <select
                    name="department"
                    onChange={handleChange}
                    required
                    defaultValue=""
                    className="w-full focus:outline-none bg-transparent text-gray-700"
                  >
                    <option value="" disabled>Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(role === 'student' || role === 'alumni') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                    <FaIdBadge className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      name="degree"
                      placeholder="Degree (e.g. B.Tech)"
                      onChange={handleChange}
                      required
                      className="w-full focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                    <FaCalendarAlt className="text-gray-500 mr-2" />
                    <input
                      type="number"
                      name="graduationYear"
                      placeholder={role === 'student' ? "Grad Year (Expected)" : "Grad Year"}
                      onChange={handleChange}
                      required
                      className="w-full focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {role === 'student' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                    <FaCalendarAlt className="text-gray-500 mr-2" />
                    <input
                      type="number"
                      name="year"
                      placeholder="Current Year (1-4)"
                      min="1" max="5"
                      onChange={handleChange}
                      required
                      className="w-full focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                    <FaLayerGroup className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      name="section"
                      placeholder="Class Section"
                      onChange={handleChange}
                      required
                      className="w-full focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {role === 'teacher' && (
                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                  <FaChalkboardTeacher className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="designation"
                    placeholder="Designation (e.g. Assistant Professor)"
                    onChange={handleChange}
                    required
                    className="w-full focus:outline-none"
                  />
                </div>
              )}

              {role === 'alumni' && (
                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                  <FaBuilding className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="currentCompany"
                    placeholder="Current Company (Optional)"
                    onChange={handleChange}
                    className="w-full focus:outline-none"
                  />
                </div>
              )}

              <div className="border-t border-gray-200 my-4"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                  <FaPhone className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    className="w-full focus:outline-none"
                  />
                </div>
                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                  <FaLinkedin className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="linkedin"
                    placeholder="LinkedIn URL"
                    onChange={handleChange}
                    className="w-full focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                <FaInfoCircle className="text-gray-500 mr-2" />
                <textarea
                  name="bio"
                  placeholder="Short Bio / Headline"
                  onChange={handleChange}
                  className="w-full focus:outline-none resize-none h-10 py-1"
                />
              </div>

              <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                <FaTools className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="skills"
                  placeholder="Skills (comma separated)"
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold shadow-lg transform transition hover:scale-[1.02] hover:shadow-xl mt-4"
          >
            {isLogin ? "Login" : `Join as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-blue-600 font-bold hover:underline"
            onClick={toggleForm}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
