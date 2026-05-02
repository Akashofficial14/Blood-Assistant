import React, { useState } from "react";
import Dashboard from "./features/Dashboard";
import Inventory from "./features/Inventory";
import Requests from "./features/Requests";
import Staff from "./features/Staff";
import BloodBankProfile from "./features/BloodBankProfile";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";

const SidebarItem = ({ label, icon, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all ${
      active
        ? "bg-red-50 text-red-700 border-r-4 border-red-600 font-bold"
        : "text-slate-600 hover:bg-slate-50"
    }`}
  >
    <span className="material-symbols-outlined text-[18px]">{icon}</span>
    <span className="text-md">{label}</span>
  </div>
);

const MobileItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center gap-1 cursor-pointer ${
      active ? "text-red-600 font-bold" : "text-slate-400 font-medium"
    }`}
  >
    <span className="material-symbols-outlined">{icon}</span>
    <span className="text-[10px] uppercase tracking-wider">{label}</span>
  </div>
);

const OwnerDashboard = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard" },
    { name: "Inventory" },
    { name: "Requests" },
    // { name: "Staff" },
    { name: "Profile" },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      // 1. Optional: Call your backend to invalidate the session
      let res = await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      console.log("Logout response:", res.data);
      // 2. Clear all local storage data
      localStorage.clear();

      // 3. Notify the app that authentication state has changed
      window.dispatchEvent(new Event("storageAuthChanged"));

      // 4. Redirect the user to the login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the API fails, we clear local data and redirect
      localStorage.clear();
      window.dispatchEvent(new Event("storageAuthChanged"));
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans antialiased text-slate-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 h-16">
        <span className="text-2xl font-black tracking-tighter text-red-600">
          Blood Assistant
        </span>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold">City Blood Bank</p>
            <p className="text-xs text-slate-500">Hospital Panel</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-linear-to-tr from-red-600 to-orange-400 border border-slate-300" />
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-72 bg-white border-r border-slate-200 p-4">
          <div className="flex items-center gap-3 p-4 mb-6 bg-slate-50 rounded-xl">
            <div>
              <p className="text-lg font-bold">City Blood Bank</p>
              <p className="text-sm text-slate-500">Blood Bank Panel</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.name}
                label={item.name}
                icon={item.icon}
                active={activeItem === item.name}
                onClick={() => setActiveItem(item.name)}
              />
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-100 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center cursor-pointer gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all font-bold group"
            >
              <LogOut
                className="group-hover:-translate-x-1 transition-transform"
                size={20}
              />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </aside>

        {activeItem === "Dashboard" && <Dashboard />}
        {activeItem === "Inventory" && <Inventory />}
        {activeItem === "Requests" && <Requests />}
        {/* {activeItem === "Staff" && <Staff />} */}
        {activeItem === "Profile" && <BloodBankProfile />}
      </div>

      <nav className="lg:hidden fixed bottom-0 w-full h-20 bg-white border-t flex justify-around items-center z-50">
        {menuItems.map((item) => (
          <MobileItem
            key={item.name}
            icon={item.icon}
            label={item.name}
            active={activeItem === item.name}
            onClick={() => setActiveItem(item.name)}
          />
        ))}
        <button
          onClick={handleLogout}
          className="cursor-pointer flex flex-col items-center gap-1 text-slate-400"
        >
          <LogOut size={20} />
          <span className="text-[10px] uppercase font-bold">Exit</span>
        </button>
      </nav>
    </div>
  );
};

export default OwnerDashboard;
