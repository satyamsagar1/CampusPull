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
} from "react-icons/fa";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, login, signup } = useAuth();

  const [role, setRole] = useState("student"); // switched to tab selector
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    college: "",
    degree: "",
    graduationYear: "",
    profilePicture: "",
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
    } else if (name === "graduationYear") {
      setForm({ ...form, graduationYear: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  useEffect(() => {
    if (!user) {
      setForm({ email: "", password: "" });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
      } else {
        await signup({ ...form, role }); // role from toggle buttons
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(isLogin ? "Login failed" : "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8 transform transition duration-500 hover:scale-105">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          {isLogin ? "Welcome Back 👋" : "Create Your Account 🚀"}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {isLogin ? "Login to continue" : "Join LinkeMate and start your journey"}
        </p>

        {/* Role Toggle (Signup only) */}
        {!isLogin && (
          <div className="flex justify-center gap-4 mb-6">
            {["student", "alumni", "teacher"].map((r) => (
              <button
                key={r}
                type="button"
                className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md transition ${
                  role === r
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              {/* Two-column layout for first row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                  <FaUser className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                    className="w-full focus:outline-none"
                  />
                </div>

                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                  <FaUniversity className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="college"
                    placeholder="College"
                    onChange={handleChange}
                    required
                    className="w-full focus:outline-none"
                  />
                </div>
              </div>

              {/* Second row: Degree + Graduation Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                  <FaUniversity className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="degree"
                    placeholder="Degree"
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
                    placeholder="Graduation Year"
                    onChange={handleChange}
                    required
                    className="w-full focus:outline-none"
                  />
                </div>
              </div>

              {/* Profile Picture + Phone */}
              <div className="grid grid-cols-2 gap-4">
                
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

              {/* Bio */}
              <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
                <FaInfoCircle className="text-gray-500 mr-2" />
                <textarea
                  name="bio"
                  placeholder="Short Bio"
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                />
              </div>

              {/* Skills */}
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

          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full focus:outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold shadow-lg transform transition hover:scale-105 hover:shadow-xl"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-5">
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
