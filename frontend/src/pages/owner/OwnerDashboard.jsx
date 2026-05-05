import React, { useState, useEffect } from "react";
import Dashboard from "./features/Dashboard";
import Inventory from "./features/Inventory";
import Staff from "./features/Staff";
import BloodBankProfile from "./features/BloodBankProfile";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import DonarDirectory from "./features/Requests";
import Chatbot from "../../components/ChatBot";

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
  // 1. Initialize state from localStorage immediately
  const [activeItem, setActiveItem] = useState(() => {
    return localStorage.getItem("activeTab") || "Dashboard";
  });

  const navigate = useNavigate();

  // 2. Persistent wrapper function
  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    localStorage.setItem("activeTab", itemName);
  };

  // Added icons so they render correctly in the sidebar/mobile nav
  const menuItems = [
    { name: "Dashboard" },
    { name: "Inventory"},
    { name: "Donar Requests" },
    { name: "Profile" },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      localStorage.clear();
      window.dispatchEvent(new Event("storageAuthChanged"));
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      window.dispatchEvent(new Event("storageAuthChanged"));
      navigate("/login");
    }
  };

  const userStr = localStorage.getItem("user");
  const userName = userStr ? JSON.parse(userStr).name : "User";

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
          <div className="h-10 w-10 flex justify-center items-center rounded-full bg-gradient-to-tr from-red-600 to-orange-400 border border-slate-300">
            <span className="text-white font-bold text-lg">
              {userName?.charAt(0)?.toUpperCase()}
            </span>
          </div>
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
                onClick={() => handleItemClick(item.name)}
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

        {/* Content Section */}
        <div className="flex-1 lg:min-h-screen">
            {activeItem === "Dashboard" && <Dashboard />}
            {activeItem === "Inventory" && <Inventory />}
            {activeItem === "Donar Requests" && <DonarDirectory />}
            {activeItem === "Profile" && <BloodBankProfile />}
        </div>
      </div>

      {/* Mobile Navigation - Fixed with handleItemClick */}
      <nav className="lg:hidden fixed bottom-0 w-full h-20 bg-white border-t flex justify-around items-center z-50">
        {menuItems.map((item) => (
          <MobileItem
            key={item.name}
            icon={item.icon}
            label={item.name}
            active={activeItem === item.name}
            onClick={() => handleItemClick(item.name)} // This was missing the wrapper!
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
      <Chatbot/>
    </div>
  );
};

export default OwnerDashboard;