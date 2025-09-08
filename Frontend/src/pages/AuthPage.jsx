import  { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, login, signup } = useAuth();
  
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
    // whenever user logs out, reset form
    if (!user) {
      setForm({
        email: "",
        password: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({
          email: form.email,
          password: form.password,
        });

      } else {
        await signup({form});
      }
      
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(isLogin ? "Login failed" : "Signup failed");
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                minLength={2}
                maxLength={80}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="role"
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="text"
                name="college"
                placeholder="College"
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="degree"
                placeholder="Degree"
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="graduationYear"
                placeholder="Graduation Year"
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="profilePicture"
                placeholder="Profile Picture URL"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="linkedin"
                placeholder="LinkedIn URL"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="bio"
                placeholder="Short Bio"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <input
                type="text"
                name="skills"
                placeholder="Skills (comma separated)"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-blue-500 cursor-pointer hover:underline bg-transparent border-none p-0 m-0 focus:outline-none"
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
