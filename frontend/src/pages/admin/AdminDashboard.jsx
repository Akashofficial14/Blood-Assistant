import React, { useContext, useEffect, useState } from "react";
import Dashboard from "./features/Dashboard";
import AdminProfile from "./features/AdminProfile";
import UserManagement from "./features/UserManagement";
import Requests from "./features/Requests";
import { toast } from "react-toastify";
import { getAdminProfile } from "./features/hooks/useAdminApi";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";

// --- Sub-components ---

const SidebarItem = ({ icon, label, active, onClick }) => (
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

const FacilityCard = ({
  name,
  address,
  capacity,
  staffCount,
  status,
  type,
  icon,
}) => {
  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    suspended: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <div
      className={`bg-white rounded-xl border ${status === "pending" ? "border-2 border-red-100" : "border-slate-200"} shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden`}
    >
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-lg ${status === "pending" ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"}`}
          >
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <span
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusStyles[status]}`}
          >
            {status}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{name}</h3>
        <p className="text-sm text-slate-500 mb-6">{address}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
              Capacity
            </p>
            <p className="font-mono text-sm font-bold">{capacity} Units</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
              Staff
            </p>
            <p className="font-mono text-sm font-bold">
              {staffCount} Personnel
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-slate-100 flex gap-3">
        <button className="flex-1 py-2 bg-[#af101a] text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-all">
          View Details
        </button>
      </div>
    </div>
  );
};
// --- Main Dashboard Component ---

const FacilityDashboard = () => {
  // CORRECT: Hooks must be inside the component
  //refresh login for active tab in admin section
  const [activeItem, setActiveItem] = useState(() => {
    return localStorage.getItem("activeAdminTab") || "Dashboard";
  });
  useEffect(() => {
    localStorage.setItem("activeAdminTab", activeItem);
  }, [activeItem]);

  const [searchTerm, setSearchTerm] = useState("");
  let navigate = useNavigate();
  const [adminData, setAdminData] = useState({}); // Local state to hold user data
  const { data, isLoading, error } = getAdminProfile();
  console.log("Admin Profile Data from React Query:", data);
  useEffect(() => {
    if (data) {
      setAdminData(data);
    }
  }, [data]);

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

  const menuItems = [
    { name: "Dashboard" },
    { name: "Requests" },
    { name: "Users" },
    { name: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans antialiased text-slate-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 h-16">
        <span className="text-2xl font-black tracking-tighter text-red-600 cursor-pointer hover:opacity-80 transition-opacity">
          Blood Assistant
        </span>
        <div className="h-10 w-10 flex justify-center items-center rounded-full bg-linear-to-tr from-red-600 to-orange-400 border border-slate-300" >
          <span className="text-white font-bold text-lg">{adminData?.name?.charAt(0) || "A"}</span>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-72 bg-white border-r border-slate-200 p-4">
          <div className="flex items-center justify-center flex-col gap-1 p-4 mb-6 bg-slate-50 rounded-xl">
            <h3 className="font-bold text-2xl text-gray-800 truncate">
              {adminData?.name}
            </h3>
            <p className="text-red-600 font-bold text-xs uppercase tracking-widest mt-1">
              System Administrator
            </p>
          </div>

          {/* Navigation Links - flex-1 allows this to grow and push the logout down */}
          <nav className="space-y-1 flex-1">
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

          {/* Bottom Logout Section - INSIDE the aside with mt-auto */}
          <div className="pt-6 border-t border-slate-100 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all font-bold group"
            >
              <LogOut
                className="group-hover:-translate-x-1 transition-transform"
                size={20}
              />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 lg:min-h-[calc(100vh-64px)]">
          {activeItem === "Dashboard" && (
            <Dashboard searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          )}
          {activeItem === "Requests" && <Requests />}
          {activeItem === "Profile" && <AdminProfile adminData={adminData} />}
          {activeItem === "Users" && (
            <UserManagement
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 w-full h-20 bg-white border-t flex justify-around items-center z-50">
        {menuItems.slice(0, 4).map((item) => (
          <MobileItem
            key={item.name}
            icon={item.icon}
            label={item.name}
            active={activeItem === item.name}
            onClick={() => setActiveItem(item.name)}
          />
        ))}
        {/* Adding Logout to Mobile Nav for consistency */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 text-slate-400"
        >
          <LogOut size={20} />
          <span className="text-[10px] uppercase font-bold">Exit</span>
        </button>
      </nav>
    </div>
  );
};

export default FacilityDashboard;
