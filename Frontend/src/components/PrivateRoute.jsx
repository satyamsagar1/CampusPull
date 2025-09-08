
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // not logged in → go to auth
  if (!user) return <Navigate to="/auth" replace />;

  // role-based restriction (only if allowedRoles passed)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ user is logged in and authorized → render the child route
  return <Outlet />;
};

export default PrivateRoute;
