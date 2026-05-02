import React, { useContext, useEffect, useState } from "react";
import Dashboard from "./features/Dashboard";
import BloodBanks from "./features/BloodBanks";
import AdminProfile from "./features/AdminProfile";
import UserManagement from "./features/UserManagement";
import Requests from "./features/Requests";
import { toast } from "react-toastify";
import { getAdminProfile } from "./features/hooks/useAdminApi";

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
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [adminData, setAdminData] = useState({}); // Local state to hold user data
  const { data, isLoading, error } = getAdminProfile();
  console.log("Admin Profile Data from React Query:", data);
  useEffect(() => {
    if (data) {
      setAdminData(data);
    }
  }, [data]);

  const menuItems = [
    { name: "Dashboard" },
    { name: "Blood Banks" },
    { name: "Requests" },
    { name: "Users" },
    { name: "Profile" },
  ];

  const facilities = [
    {
      name: "St. Jude Regional Center",
      address: "452 Medical Parkway",
      capacity: "1,200",
      staffCount: 24,
      status: "pending",
      type: "Trauma",
      icon: "pending_actions",
    },
    {
      name: "Metro General Blood Bank",
      address: "12 Central Plaza",
      capacity: "4,500",
      staffCount: 82,
      status: "active",
      type: "Public",
      icon: "local_hospital",
    },
    {
      name: "Westside Community Bank",
      address: "Abandoned Sector 7",
      capacity: "0",
      staffCount: 0,
      status: "suspended",
      type: "Private",
      icon: "block",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans antialiased text-slate-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <span className="text-2xl font-black tracking-tighter text-red-600 cursor-pointer hover:opacity-80 transition-opacity">
          Blood Assistant
        </span>
        <div className="h-10 w-10 rounded-full bg-linear-to-tr from-red-600 to-orange-400 border border-slate-300" />
      </header>

      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-72 bg-white border-r border-slate-200 p-4">
          <div className="flex items-center gap-3 p-4 mb-6 bg-slate-50 rounded-xl">
            <div>
              <p className="text-lg font-bold">Akash</p>
              <p className="text-sm text-slate-500">Admin Panel</p>
            </div>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.name}
                label={item.name}
                active={activeItem === item.name}
                onClick={() => setActiveItem(item.name)}
              />
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        {activeItem === "Dashboard" && (
          <Dashboard
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            facilities={facilities}
            FacilityCard={FacilityCard}
          />
        )}
        {activeItem === "Blood Banks" && (
          <BloodBanks searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
      </nav>
    </div>
  );
};

export default FacilityDashboard;
