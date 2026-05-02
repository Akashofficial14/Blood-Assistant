import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  X,
  Lock,
  Mail,
  User,
  Loader2,
  Edit3,
  Save,
} from "lucide-react";
import { useChangePassword, useUpdateProfile } from "./hooks/useAdminApi";

const AdminProfile = ({ adminData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
  } = useForm();

  const newPassword = watch("password");

  const onProfileUpdate = (data) => {
    updateProfile(
      { userId: adminData._id, data },
      { onSuccess: () => setIsEditMode(false) }
    );
  };

  const onPasswordChange = (data) => {
    changePassword(
      { userId: adminData._id, password: data.password },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        },
      }
    );
  };

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U";

  return (
    /* FIXED: Adjusted margin to lg:ml-72 (standard sidebar) and removed ml-37 */
    <main className="flex-1 lg:ml-72 p-4 md:p-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        {/* FIXED: Added flex-col for mobile and items-start for better alignment */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Account Settings
            </h1>
            <p className="text-gray-500 mt-1">Manage your identity and security</p>
          </div>
          {!isEditMode ? (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 shadow-sm transition-all w-full sm:w-auto justify-center"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditMode(false)}
              className="px-5 py-2.5 font-bold text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all w-full sm:w-auto text-center"
            >
              Cancel
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile Sidebar */}
          <div className="lg:col-span-1">
            {/* FIXED: Removed sticky top-10 for mobile to prevent layout jumps */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center lg:sticky lg:top-10">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-tr from-red-600 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl md:text-4xl font-black shadow-xl ring-4 ring-red-50 ring-offset-2">
                {getInitials(adminData?.name)}
              </div>
              <h3 className="font-bold text-2xl text-gray-800 truncate">{adminData?.name}</h3>
              <p className="text-red-600 font-bold text-xs uppercase tracking-widest mt-1">
                System Administrator
              </p>

              <div className="mt-8">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl text-sm font-bold hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <Lock size={16} /> Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Right: Identity Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleProfileSubmit(onProfileUpdate)}
              className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-red-50 rounded-lg text-red-600">
                  <User size={20} />
                </div>
                <h4 className="font-bold text-xl text-gray-800">Identity Details</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        isEditMode ? "text-red-400" : "text-gray-400"
                      }`}
                      size={18}
                    />
                    <input
                      type="text"
                      disabled={!isEditMode}
                      defaultValue={adminData?.name}
                      {...registerProfile("name", { required: "Name is required" })}
                      className={`w-full pl-11 p-3.5 border rounded-2xl outline-none transition-all ${
                        isEditMode
                          ? "bg-white border-red-200 focus:ring-2 focus:ring-red-500 shadow-sm"
                          : "bg-gray-50 border-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        isEditMode ? "text-red-400" : "text-gray-400"
                      }`}
                      size={18}
                    />
                    <input
                      type="email"
                      disabled={!isEditMode}
                      defaultValue={adminData?.email}
                      {...registerProfile("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                      })}
                      className={`w-full pl-11 p-3.5 border rounded-2xl outline-none transition-all ${
                        isEditMode
                          ? "bg-white border-red-200 focus:ring-2 focus:ring-red-500 shadow-sm"
                          : "bg-gray-50 border-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {isEditMode && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="w-full sm:w-auto bg-red-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isUpdatingProfile ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    Update Profile Info
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* --- Password Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-black text-gray-800 uppercase tracking-tight text-sm">
                Security Update
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onPasswordChange)} className="p-6 md:p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    {...register("password", {
                      required: "Required",
                      minLength: { value: 8, message: "Min 8 chars" },
                    })}
                    className="w-full pl-11 pr-12 p-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-500 font-bold">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      required: "Required",
                      validate: (val) => val === newPassword || "No match",
                    })}
                    className="w-full pl-11 p-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] text-red-500 font-bold">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="order-2 sm:order-1 flex-1 py-3.5 font-bold text-gray-500 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="order-1 sm:order-2 flex-1 py-3.5 font-bold text-white bg-red-600 rounded-2xl shadow-lg hover:bg-red-700 transition-all disabled:bg-gray-400 flex justify-center items-center"
                >
                  {isChangingPassword ? <Loader2 className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminProfile;