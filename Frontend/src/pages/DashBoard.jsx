import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api"; // axios instance with token

function Dashboard() {
  const { user, loading } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    let endpoint = "";
    if (user.role === "admin") endpoint = "/auth/admin-dashboard";
    if (user.role === "alumni") endpoint = "/auth/alumni-dashboard";
    if (user.role === "student") endpoint = "/auth/student-dashboard";

    api.get(endpoint, { withCredentials: true })
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || "Unauthorized"));
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Access Denied. Please log in.</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading Dashboard...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Hello {user.name}</h2>
        {/* <p className="font-bold">{data.message}</p> */}
      </div>
    </div>
  );
}

export default Dashboard;
