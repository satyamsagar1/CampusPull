import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  return (
    <nav className="flex justify-between items-center bg-blue-600 text-white px-6 py-3 shadow-md">
      <button
        className="font-bold text-xl cursor-pointer bg-transparent border-none outline-none"
        onClick={() => navigate("/home")}
        type="button"
        aria-label="Go to Home"
      >
        LinkMate
      </button>
      <div className="flex gap-4">
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={() => navigate("/profile")}>Profile</button>
        <button onClick={() => navigate("/events")}>Events</button>
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
