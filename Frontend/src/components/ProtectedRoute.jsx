import React,{useEffect} from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
  window.history.replaceState(null, "", window.location.pathname);
}, []);

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  // If not logged in → redirect to /auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
