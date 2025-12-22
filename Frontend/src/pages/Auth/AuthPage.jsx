import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import {
  FaUser, FaEnvelope, FaLock, FaUniversity, FaCalendarAlt,
  FaPhone, FaLinkedin, FaInfoCircle, FaTools, FaBuilding,
  FaIdBadge, FaLayerGroup, FaChalkboardTeacher,
  FaCheckCircle, FaTimesCircle // added these for validation
} from "react-icons/fa";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, login, signup } = useAuth();
  const [role, setRole] = useState("student");

  // --- NEW: Password Validation State ---
  const [passwordValidations, setPasswordValidations] = useState({
    hasCapital: false,
    hasNumber: false,
    isMinLength: false,
  });

  const [form, setForm] = useState({
    name: "", email: "", password: "", college: "ABESIT", degree: "",
    department: "", section: "", year: "", graduationYear: "",
    designation: "", currentCompany: "", phone: "", linkedin: "",
    bio: "", skills: [],
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Reset validations when toggling
    setPasswordValidations({ hasCapital: false, hasNumber: false, isMinLength: false });
  };

  // --- NEW: Validation Logic ---
  const validatePassword = (pass) => {
    setPasswordValidations({
      hasCapital: /[A-Z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
      isMinLength: pass.length >= 8,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Trigger validation if user is typing in the password field during signup
    if (name === "password" && !isLogin) {
      validatePassword(value);
    }

    if (name === "skills") {
      setForm({ ...form, skills: value.split(",").map((s) => s.trim()) });
    }
    else if (name === "graduationYear" || name === "year") {
      setForm({ ...form, [name]: Number(value) });
    }
    else {
      setForm({ ...form, [name]: value });
    }
  };

  useEffect(() => {
    if (!user) {
      setForm(prev => ({ ...prev, email: "", password: "" }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if password requirements aren't met on Signup
    if (!isLogin && (!passwordValidations.hasCapital || !passwordValidations.hasNumber || !passwordValidations.isMinLength)) {
      alert("Satyam, your password doesn't meet the requirements yet. Fix it, buddy!");
      return;
    }

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

            {/* --- PASSWORD SECTION WITH VALIDATION --- */}
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

              {/* Validation Feedback (Only on Signup) */}
              {!isLogin && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className={`flex items-center text-[11px] font-bold ${passwordValidations.isMinLength ? "text-green-600" : "text-gray-400"}`}>
                      {passwordValidations.isMinLength ? <FaCheckCircle className="mr-1" /> : <FaTimesCircle className="mr-1" />}
                      8+ Characters
                    </div>
                    <div className={`flex items-center text-[11px] font-bold ${passwordValidations.hasCapital ? "text-green-600" : "text-gray-400"}`}>
                      {passwordValidations.hasCapital ? <FaCheckCircle className="mr-1" /> : <FaTimesCircle className="mr-1" />}
                      1 Capital
                    </div>
                    <div className={`flex items-center text-[11px] font-bold ${passwordValidations.hasNumber ? "text-green-600" : "text-gray-400"}`}>
                      {passwordValidations.hasNumber ? <FaCheckCircle className="mr-1" /> : <FaTimesCircle className="mr-1" />}
                      1 Number
                    </div>
                  </div>
                  
                  {/* Strength Bar */}
                  <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        Object.values(passwordValidations).filter(Boolean).length === 3 ? "w-full bg-green-500" :
                        Object.values(passwordValidations).filter(Boolean).length >= 1 ? "w-1/2 bg-yellow-500" : "w-0"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isLogin && (
            <>
              {/* ... (Academic & Social fields remain exactly as you had them) ... */}
              <div className="border-t border-gray-200 my-4"></div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Academic & Professional Details</h3>
              {/* Keep your existing field grid here */}
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
