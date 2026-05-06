import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
// import { getBloodbankDetails } from "../../../api/blood bank/getBloodbankDetails";
import { getBloodbankDetails } from "../../../api/blood bank/getBloodBankDetails";
import { updateBloodBankDetails } from "../../../api/blood bank/updateBloodBankDetails";

const BloodBankProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({});

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    verified: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    suspended: "bg-slate-200 text-slate-700",
  };

  const getMutation = useMutation({
    mutationKey: ["bloodbankDetails"],
    mutationFn: getBloodbankDetails,
    retry: 0,
    onSuccess: (data) => {
      if (data?.data?.profile) {
        setProfile(data.data.profile);
      }
    },
    onError: (err) => {
      console.error("ERROR:", err.message);
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["updateBloodbankDetails"],
    mutationFn: updateBloodBankDetails,
    retry: 0,
    onSuccess: () => {
      setEditMode(false);
      getMutation.mutate(); 
    },
    onError: (err) => {
      console.error("UPDATE ERROR:", err.message);
    },
  });

  useEffect(() => {
    getMutation.mutate();
  }, []);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = () => {
    const payload = {
      contact: {
        email: profile.email,
        phone: profile.phone,
        emergencyContact: profile.emergencyContact,
        website: profile.website,
      },
      address: {
        city: profile.city,
        state: profile.state,
        zipCode: profile.zip,
      },
      isOpen247: profile.isOpen247,
    };

    updateMutation.mutate(payload);
  };

  if (!profile || Object.keys(profile).length === 0) {
    return (
      <main className="flex-1 lg:ml-72 p-6 md:p-10">
        <p className="text-slate-500">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10">
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
          onClick={() => {
            if (editMode) {
              handleSave(); 
            } else {
              setEditMode(true);
            }
          }}
          className="bg-red-700 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-red-800"
        >
          {editMode ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Basic Information</h3>

          <p className="text-sm text-slate-500 mb-1">Name</p>
          <p className="font-bold text-lg">{profile.name}</p>

          <p className="text-sm text-slate-500 mt-4 mb-1">Organization Type</p>
          <p className="font-semibold">{profile.organizationType}</p>

          <p className="text-sm text-slate-500 mt-4 mb-1">
            Verification Status
          </p>
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full ${
              statusStyles[profile.verificationStatus] ||
              "bg-slate-100 text-slate-600"
            }`}
          >
            {profile.verificationStatus}
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">License Details</h3>

          <p className="text-sm text-slate-500">License Number</p>
          <p className="font-bold">{profile.licenseNumber}</p>

          <p className="text-sm text-slate-500 mt-4">Valid Till</p>
          <p className="font-semibold">
            {profile.licenseValidity
              ? new Date(profile.licenseValidity).toDateString()
              : "N/A"}
          </p>

          <p className="text-xs text-slate-400 mt-4">
            * License details cannot be edited
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Operations</h3>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Open 24/7</span>

            <input
              type="checkbox"
              checked={profile.isOpen247}
              disabled={!editMode}
              onChange={(e) => handleChange("isOpen247", e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Contact & Location</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-slate-400">Email</label>
            <input
              disabled={!editMode}
              value={profile.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Phone</label>
            <input
              disabled={!editMode}
              value={profile.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Emergency Contact</label>
            <input
              disabled={!editMode}
              value={profile.emergencyContact || ""}
              onChange={(e) => handleChange("emergencyContact", e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Website</label>
            <input
              disabled={!editMode}
              value={profile.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">City</label>
            <input
              disabled={!editMode}
              value={profile.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">State</label>
            <input
              disabled={!editMode}
              value={profile.state || ""}
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
