import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  changePassword,
  getAdminProfileData,
  updateProfile,
} from "../../api/admin/getProfile";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      return await getAdminProfileData();
      //   return {
      //     name: "Vaibhav",
      //     email: "vaibhav@gmail.com",
      //     bloodGroup: "B+",
      //     phone: "9876543210",
      //     location: "Indore",
      //   };
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      updatedData = { userId: user._id, data: updatedData };
      console.log("object->>", updatedData);
      return await updateProfile(updatedData);
      console.log("update profile", updatedData);
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (passwordData) => {
      passwordData = { userId: user._id, password: passwordData.newPassword };
      console.log("object", passwordData);
      return await changePassword(passwordData);
      console.log("update password", passwordData);
    },
  });

  const [form, setForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    updateProfileMutation.mutate(form);
    setIsEditing(false);
  };

  const handlePasswordUpdate = () => {
    updatePasswordMutation.mutate(passwordForm);
    setPasswordForm({ currentPassword: "", newPassword: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-5">
          <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
            {user.name?.[0]}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* PROFILE FORM */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Personal Information
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              name="name"
              value={isEditing ? (form.name ?? user.name) : user.name}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input label="Email" name="email" value={user.email} disabled />

            <Input
              label="Blood Group"
              name="bloodGroup"
              value={
                isEditing
                  ? (form.bloodGroup ?? user.bloodGroup)
                  : user.bloodGroup
              }
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              label="Phone"
              name="phone"
              value={isEditing ? (form.phone ?? user.phone) : user.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              label="Location"
              name="location"
              value={
                isEditing ? (form.location ?? user.location) : user.location
              }
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button
                onClick={handleUpdate}
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* PASSWORD SECTION */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Change Password
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
            />

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handlePasswordUpdate}
              className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Reusable Input */
const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-600">{label}</label>
    <input
      {...props}
      className={`px-4 py-2 rounded-lg border ${
        props.disabled ? "bg-gray-100" : "bg-white"
      } focus:outline-none focus:border-red-500`}
    />
  </div>
);
