import React, { useState } from "react";

const BloodBankProfile = () => {
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({
    name: "City Blood Bank",
    organizationType: "Private Hospital",
    licenseNumber: "BB-12345",
    licenseValidity: "2026-12-31",
    verificationStatus: "verified",

    email: "cityblood@hospital.com",
    phone: "9876543210",
    emergencyContact: "1800-222-333",
    website: "www.citybloodbank.com",

    city: "Bhopal",
    state: "Madhya Pradesh",
    zip: "462001",

    isOpen247: true,
  });

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Blood Bank Profile
          </h1>
          <p className="text-slate-500 mt-1">
            Official information & operational settings
          </p>
        </div>

        <button
          onClick={() => setEditMode(!editMode)}
          className="bg-red-700 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-red-800"
        >
          {editMode ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PANEL */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">
            Basic Information
          </h3>

          <p className="text-sm text-slate-500 mb-1">Name</p>
          <p className="font-bold text-lg">{profile.name}</p>

          <p className="text-sm text-slate-500 mt-4 mb-1">
            Organization Type
          </p>
          <p className="font-semibold">{profile.organizationType}</p>

          <p className="text-sm text-slate-500 mt-4 mb-1">
            Verification Status
          </p>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">
            {profile.verificationStatus}
          </span>
        </div>

        {/* LICENSE PANEL (READ ONLY) */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">
            License Details
          </h3>

          <p className="text-sm text-slate-500">License Number</p>
          <p className="font-bold">{profile.licenseNumber}</p>

          <p className="text-sm text-slate-500 mt-4">
            Valid Till
          </p>
          <p className="font-semibold">
            {new Date(profile.licenseValidity).toDateString()}
          </p>

          <p className="text-xs text-slate-400 mt-4">
            * License details cannot be edited
          </p>
        </div>

        {/* OPERATION PANEL */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">
            Operations
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Open 24/7
            </span>

            <input
              type="checkbox"
              checked={profile.isOpen247}
              disabled={!editMode}
              onChange={(e) =>
                handleChange("isOpen247", e.target.checked)
              }
            />
          </div>
        </div>
      </div>

      {/* CONTACT + ADDRESS */}
      <div className="mt-6 bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">
          Contact & Location
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* EMAIL */}
          <div>
            <label className="text-xs text-slate-400">Email</label>
            <input
              disabled={!editMode}
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-slate-50"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-xs text-slate-400">Phone</label>
            <input
              disabled={!editMode}
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-slate-50"
            />
          </div>

          {/* EMERGENCY */}
          <div>
            <label className="text-xs text-slate-400">
              Emergency Contact
            </label>
            <input
              disabled={!editMode}
              value={profile.emergencyContact}
              onChange={(e) =>
                handleChange("emergencyContact", e.target.value)
              }
              className="w-full mt-1 p-2 border rounded-lg bg-slate-50"
            />
          </div>

          {/* WEBSITE */}
          <div>
            <label className="text-xs text-slate-400">
              Website
            </label>
            <input
              disabled={!editMode}
              value={profile.website}
              onChange={(e) =>
                handleChange("website", e.target.value)
              }
              className="w-full mt-1 p-2 border rounded-lg bg-slate-50"
            />
          </div>

          {/* CITY */}
          <div>
            <label className="text-xs text-slate-400">City</label>
            <input
              disabled={!editMode}
              value={profile.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-slate-50"
            />
          </div>

          {/* STATE */}
          <div>
            <label className="text-xs text-slate-400">State</label>
            <input
              disabled={!editMode}
              value={profile.state}
              onChange={(e) => handleChange("state", e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-slate-50"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default BloodBankProfile;