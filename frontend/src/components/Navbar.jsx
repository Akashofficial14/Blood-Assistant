import axios from "axios";
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Added useNavigate
import Logout from "./Logout";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showLoginPopup, setShowLoginPopup] = useState(false); // State for Pop-up
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
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
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (error) {
        console.error("Auth Error:", error);
        if (error.response?.status === 401 && localStorage.getItem("token")) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setUser(null);
          setIsLoggedIn(false);
        }
      }
    };

    fetchUser();

    const handleStorageAuthChanged = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      fetchUser();
    };

    window.addEventListener('storageAuthChanged', handleStorageAuthChanged);
    return () => window.removeEventListener('storageAuthChanged', handleStorageAuthChanged);
  }, []);

  const handleDonateClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault(); // Stop navigation
      setShowLoginPopup(true); // Show the cinematic pop-up
    }
  };

  const baseClasses = "pb-1 transition-all duration-300 ease-in-out hover:text-red-500 hover:-translate-y-0.5 active:scale-95 cursor-pointer";
  
  const getNavLinkClass = ({ isActive }) => 
    isActive 
      ? `${baseClasses} text-red-600 border-b-2 border-red-600` 
      : `${baseClasses} text-gray-600 border-b-2 border-transparent`;

  return (
    <>
      <nav className="h-20 w-full flex justify-between items-center px-10 bg-white border-b border-gray-100 sticky top-0 z-40">
        {/* Logo Section */}
        <div className="navleft flex justify-center items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
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
        <div className="navcenter flex gap-8 text-md font-medium">
          <NavLink className={getNavLinkClass} to="/">Home</NavLink>
          <NavLink className={getNavLinkClass} to="/bloodBanks">Find Blood Banks Nearby</NavLink>
          
          {/* Custom Logic for Donate Blood */}
          <NavLink 
            className={getNavLinkClass} 
            to="/donateBlood" 
            onClick={handleDonateClick}
          >
            Donate Blood
          </NavLink>
          
          <NavLink className={getNavLinkClass} to="/about">About Us</NavLink>
        </div>

        {/* Login Section */}
        <div className="navright">
          {isLoggedIn && user ? (
            <Logout user={user} />
          ) : (
            <NavLink
              to="/login"
              className="flex gap-1 justify-center items-center bg-red-500 px-5 py-2 text-white rounded-full font-semibold transition-all duration-300 hover:bg-red-600 hover:scale-110"
            >
              <img className="w-5 invert" src="https://img.icons8.com/?size=100&id=15263&format=png&color=000000" alt="user icon" />
              <span className="text-sm">Login</span>
            </NavLink>
          )}
        </div>
      </nav>

      {/* --- CINEMATIC POP-UP MODAL --- */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-6">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-red-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-gray-900">Become a Hero!</h2>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Please register or login first to join our community of life-saving donors.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowLoginPopup(false);
                    navigate("/login");
                  }}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-lg active:scale-95"
                >
                  Login / Register Now
                </button>
                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="w-full py-2 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;