// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/DashBoard"; 
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Default route → redirect to /auth */}
        <Route path="/" element={<Navigate to="/auth" />} />

        {/* Public routes (only for not logged in users) */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
      </Routes>
    </div>
  );
}

export default App;
