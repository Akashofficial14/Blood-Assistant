import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { ShieldCheck, Droplet, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../config/axiosInstance";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  // States for flow control
  const [userID, setUserID] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // Watch the password field to compare with confirmPassword
  const passwordValue = watch("password");

  // 1. VERIFY: Runs immediately when the user clicks the link from their email
  useEffect(() => {
    const verifyTokenOnLoad = async () => {
      try {
        const response = await axiosInstance.get(
          `/auth/reset-password/${token}`,
        );
        // Ensure your backend sends back { success: true, data: { userID: "..." } }
        if (response.data.success && response.data.data.userID) {
          setUserID(response.data.data.userID);
          setIsVerifying(false);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        toast.error("Link expired or invalid! Please request a new one.");
        navigate("/login");
      }
    };
    verifyTokenOnLoad();
  }, [token, navigate]);

  // 2. UPDATE: Runs when the user fills the form and clicks "Update Password"
  const onSubmit = async (data) => {
    // Prevent execution if userID is missing (prevents Cast to ObjectId error)
    if (!userID) {
      toast.error("User session not found. Please refresh the page.");
      return;
    }

    try {
      const res = await axiosInstance.post(`/auth/update-password/${userID}`, {
        password: data.password,
      });

      if (res.data.success) {
        toast.success("Password updated! You can now login.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  // While checking the token, show a nice loader
  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
        <p className="text-gray-500 font-bold animate-pulse">
          Verifying secure link...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-200">
              <Droplet className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
            Set New Password
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Create a strong password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* New Password Field */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase ml-1 tracking-widest">
              New Password
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <ShieldCheck size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters required",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Include uppercase, lowercase, number and symbol",
                  },
                })}
                className={`w-full rounded-xl border p-3.5 pl-11 pr-12 outline-none transition-all ${
                  errors.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 focus:ring-2 focus:ring-red-500"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500 mt-1 ml-1 font-semibold">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase ml-1 tracking-widest">
              Confirm Password
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <ShieldCheck size={18} />
              </span>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                })}
                className={`w-full rounded-xl border p-3.5 pl-11 outline-none transition-all ${
                  errors.confirmPassword
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 focus:ring-2 focus:ring-red-500"
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-500 mt-1 ml-1 font-semibold">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 rounded-xl bg-red-600 py-4 font-bold text-white shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-[0.98] disabled:bg-gray-400 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
