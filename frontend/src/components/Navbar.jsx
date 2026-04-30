import axios from "axios";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logout from "./Logout";

const Navbar = () => {
  const [user, setUser] = useState(null); // State to store your profile data
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
        // Only fetch user profile if we have both token and role
        if (!token || !role) {
          setUser(null);
          setIsLoggedIn(false);
          return;
        }

        setIsLoggedIn(true);
        const res = await axios.get("http://localhost:3000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.user) {
          setUser(res.data.user); // Save user info (name, email, etc.)
        }
      } catch (error) {
        console.error("Auth Error:", error);
        // Only clear token on explicit 401 AFTER initial login
        // Don't clear on network errors or other issues
        if (error.response?.status === 401 && localStorage.getItem("token")) {
          console.log("Token expired, clearing auth data");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setUser(null);
          setIsLoggedIn(false);
        }
      }
    };

    fetchUser();

    // Listen for auth state changes (from login in same tab)
    const handleStorageAuthChanged = () => {
      console.log("Auth state changed, re-fetching user");
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      fetchUser();
    };

    // Listen for storage changes (from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'role') {
        console.log("Storage changed in another tab");
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
          fetchUser();
        }
      }
    };

    window.addEventListener('storageAuthChanged', handleStorageAuthChanged);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storageAuthChanged', handleStorageAuthChanged);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const navLinkClasses =
    "transition-all duration-300 ease-in-out hover:text-red-500 hover:-translate-y-0.5 active:scale-95";

  return (
    <nav className="h-20 w-full flex justify-between items-center px-10 bg-white border-b border-gray-100">
      {/* Logo Section */}
      <div className="navleft flex justify-center items-center gap-3 cursor-pointer group transition-transform duration-300 hover:scale-105">
        <div className="bg-red-500 p-2 rounded-full transition-transform duration-500 group-hover:rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-droplet h-6 w-6 text-white">
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
          </svg>
        </div>
        <h3 className="text-2xl font-black tracking-tighter">
          Blood <span className="text-red-600">Assistant.</span>
        </h3>
      </div>

      {/* Nav Links */}
      <div className="navcenter flex gap-8 text-md font-medium text-gray-600">
        <NavLink className={navLinkClasses} to={"/"}>Home</NavLink>
        <NavLink className={`${navLinkClasses} font-small text-lg`} to={"/bloodBanks"}>Find Blood Banks Nearby</NavLink>
        <NavLink className={navLinkClasses} to={"/donateBlood"}>Donate Blood</NavLink>
        <NavLink className={navLinkClasses} to={"/about"}>About Us</NavLink>
      </div>

      {/* Login Section - Conditional Rendering */}
      <div className="navright">
        {isLoggedIn && user ? (
          <Logout user={user} />
        ) : (
          <NavLink
            to={"/login"}
            className="flex gap-1 justify-center items-center bg-red-500 px-5 py-2 text-white rounded-full font-semibold transition-all duration-300 hover:bg-red-600 hover:scale-110 hover:shadow-lg active:scale-95"
          >
            <img className="w-5 invert" src="https://img.icons8.com/?size=100&id=15263&format=png&color=000000" alt="user icon" />
            <span className="text-sm">Login</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;