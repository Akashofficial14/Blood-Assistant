import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut, User } from "lucide-react";

const Logout = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      // Call logout endpoint
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Dispatch event to notify other components
      window.dispatchEvent(new Event("storageAuthChanged"));

      // Redirect to login
      navigate("/login");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout endpoint fails, clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.dispatchEvent(new Event("storageAuthChanged"));
      navigate("/login");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Icon Button */}
      <button onClick={() => setIsOpen(!isOpen)}>
        <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
          {/* View Profile Option */}
          <button
            onClick={() => {
              navigate("/user/profile");
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-1 text-gray-500 hover:bg-gray-100 flex items-center gap-2 transition-colors"
          >
            <User size={15} />
            <span className="text-md">View Profile</span>
          </button>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Sign Out Option */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-1 text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors font-semibold"
          >
            <LogOut size={15} />
            <span className="text-md">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Logout;
