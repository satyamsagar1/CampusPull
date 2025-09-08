import { useNavigate } from "react-router-dom";


function HomePage() {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="p-4">
      <h1>Welcome to Homepage</h1>
      <button
        onClick={goToDashboard}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Dashboard
      </button>
    </div>
  );
}

export default HomePage;
