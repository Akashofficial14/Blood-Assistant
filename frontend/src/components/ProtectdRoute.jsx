import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, allowedRole }) => {
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    
    console.log("ProtectedRoute check - role:", role, "allowedRole:", allowedRole, "token exists:", !!token);
    
    // If no role or token, redirect to login
    if (!role || !token) {
      setIsAllowed(false);
      return;
    }

    // If a specific role is required, check if user has it
    if (allowedRole && role !== allowedRole) {
      console.log("Role mismatch! User role:", role, "Required role:", allowedRole);
      setIsAllowed(null); // null means redirect to appropriate dashboard
      return;
    }

    setIsAllowed(true);
  }, [allowedRole]);

  // Loading state
  if (isAllowed === null) {
    const role = localStorage.getItem("role");
    if (role === "admin") return <Navigate to="/admin/dashboard" />;
    if (role === "manage_bank") return <Navigate to="/manage-blood-bank" />;
    if (role === "find_blood") return <Navigate to="/" />;
    return <Navigate to="/login" />;
  }

  // Not allowed - redirect to login
  if (isAllowed === false) {
    return <Navigate to="/login" />;
  }

  // Allowed - render children
  return children;
};

export default ProtectedRoute;
