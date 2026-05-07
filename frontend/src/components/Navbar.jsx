import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logout from "./Logout";
import axiosInstance from "../config/axiosInstance";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ start false, let fetchUser decide
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || !role) {
        setUser(null);
        setIsLoggedIn(false);
        return;
      }

      const res = await axiosInstance.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.user) {
        // ✅ Always overwrite with fresh API data - fixes stale user bug
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        setUser(null);
        setIsLoggedIn(false);
      }
    }
  };

  useEffect(() => {
    fetchUser();

    // ✅ Listen for login/logout events from any component
    window.addEventListener("storageAuthChanged", fetchUser);
    return () => window.removeEventListener("storageAuthChanged", fetchUser);
  }, []);

  const handleDonateClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowLoginPopup(true);
    }
  };

  const baseClasses =
    "pb-1 transition-all duration-300 ease-in-out hover:text-red-500 hover:-translate-y-0.5 active:scale-95 cursor-pointer";

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? `${baseClasses} text-red-600 border-b-2 border-red-600`
      : `${baseClasses} text-gray-600 border-b-2 border-transparent`;

  return (
    <>
      <nav className="h-20 w-full flex justify-between items-center px-4 md:px-10 bg-white border-b border-gray-100 sticky top-0 z-40">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="bg-red-500 p-2 rounded-full group-hover:rotate-12 transition">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <h3 className="text-xl md:text-2xl font-black">
            Blood <span className="text-red-600">Assistant.</span>
          </h3>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-md font-medium">
          <NavLink className={getNavLinkClass} to="/">Home</NavLink>
          <NavLink className={getNavLinkClass} to="/bloodBanks">
            Find Blood Banks Nearby
          </NavLink>
          <NavLink
            className={getNavLinkClass}
            to="/donateBlood"
            onClick={handleDonateClick}
          >
            Donate Blood
          </NavLink>
          <NavLink className={getNavLinkClass} to="/about">About Us</NavLink>
        </div>

        {/* Right - Desktop */}
        <div className="hidden md:block">
          {isLoggedIn && user ? (
            <Logout user={user} />
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-1 bg-red-500 px-5 py-2 text-white rounded-full font-semibold hover:bg-red-600 hover:scale-105 transition"
            >
              <span className="text-sm">Login</span>
            </NavLink>
          )}
        </div>

        {/* Right - Mobile */}
        <div className="md:hidden flex items-center gap-2">
          {isLoggedIn && user ? (
            <Logout user={user} />
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-1 bg-red-500 px-3 py-2 text-white rounded-full text-sm"
            >
              Login
            </NavLink>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-red-500 text-2xl"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden z-99 fixed top-20 left-0 w-full bg-white shadow-lg transition-all duration-300 ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-5 py-6 text-lg font-medium">
          <NavLink className={getNavLinkClass} onClick={() => setMobileMenuOpen(false)} to="/">
            Home
          </NavLink>
          <NavLink className={getNavLinkClass} onClick={() => setMobileMenuOpen(false)} to="/bloodBanks">
            Find Blood Banks Nearby
          </NavLink>
          <NavLink
            className={getNavLinkClass}
            onClick={(e) => { handleDonateClick(e); setMobileMenuOpen(false); }}
            to="/donateBlood"
          >
            Donate Blood
          </NavLink>
          <NavLink className={getNavLinkClass} onClick={() => setMobileMenuOpen(false)} to="/about">
            About Us
          </NavLink>
          {!isLoggedIn && (
            <NavLink
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-red-500 px-6 py-2 text-white rounded-full"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 md:p-10 w-full max-w-md shadow-2xl">
            <div className="text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-black">Become a Hero!</h2>
              <p className="text-gray-500">
                Please register or login first to join our community of life-saving donors.
              </p>
              <button
                onClick={() => { setShowLoginPopup(false); navigate("/login"); }}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-black transition"
              >
                Login / Register Now
              </button>
              <button onClick={() => setShowLoginPopup(false)} className="text-gray-400 font-bold">
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;