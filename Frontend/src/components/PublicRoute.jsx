
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/homepage" replace />;
  }

  return children;
};

export default AuthRoute;
