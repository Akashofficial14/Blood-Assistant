import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Eye, EyeOff, Droplet } from "lucide-react";
import MultiStepForm from "../components/MultiStepForm";
// ✅ Correct
import { getBloodbankDetails } from "../api/blood bank/getBloodBankDetails";
import axiosInstance from "../config/axiosInstance";

const AuthLayout = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = React.useState("login");
  const [ForgotPass, setForgotPass] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const selectedRole = watch("userRole");

  const onSubmit = async (data) => {
    const endpoint = isLogin ? "auth/login" : "auth/register";

    try {
      // ✅ Step 1 - wipe old person's data completely first
      localStorage.clear();

      const res = await axiosInstance.post(endpoint, data, {
        withCredentials: true,
      });

      if (res.data && res.data.success) {
        const resData = res.data.data || {};
        const user = resData.user;
        const role = user?.userRole;
        const token = resData.token;

        // ✅ Step 2 - save new person's data
        if (token) localStorage.setItem("token", token);
        if (role) localStorage.setItem("role", role);
        if (user) localStorage.setItem("user", JSON.stringify(user));

        // ✅ Step 3 - tell Navbar to re-fetch with new token immediately
        window.dispatchEvent(new Event("storageAuthChanged"));

        // ✅ Step 4 - navigate based on role
        setTimeout(async () => {
          if (role === "manage_bank") {
            const bankData = await getBloodbankDetails();
            if (bankData) navigate("/manage-blood-bank");
            else navigate("/bloodbank/details/form");
          } else if (role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }, 100);

        toast.success(isLogin ? "Welcome back!" : "Account created!");
      }
    } catch (error) {
      localStorage.clear(); // ✅ wipe on failure too so old data never shows
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  };
  const handleGoogleAuth = () => {
    // Now proceed to Google Login
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };
  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset({}, { keepErrors: false }); // Ensures error messages disappear when switching tabs
  };

  return (
    <>
      {" "}
      <div className="w-full flex justify-center items-center bg-gray-50 p-3">
        <div className="w-full max-w-md rounded-2xl bg-white px-8 py-8 shadow-2xl border border-gray-100">
          {/* Header Section */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="bg-red-500 p-3 rounded-2xl shadow-lg shadow-red-200">
                <Droplet className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              BLOOD ASSISTANT
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {isLogin
                ? "Sign in to your account"
                : "Join our life-saving community"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Role Selection (Registration Only) */}
            {!isLogin && (
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${selectedRole === "find_blood" ? "border-red-500 bg-red-50" : "border-gray-100"}`}
                  >
                    <input
                      {...register("userRole", {
                        required: "Please select a role",
                      })}
                      type="radio"
                      value="find_blood"
                      className="sr-only"
                    />
                    <span className="block font-bold text-sm text-gray-700">
                      Find Blood
                    </span>
                  </label>
                  <label
                    className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${selectedRole === "manage_bank" ? "border-red-500 bg-red-50" : "border-gray-100"}`}
                  >
                    <input
                      {...register("userRole", {
                        required: "Please select a role",
                      })}
                      type="radio"
                      value="manage_bank"
                      className="sr-only"
                    />
                    <span className="block font-bold text-sm text-gray-700">
                      Manage Bank
                    </span>
                  </label>
                </div>
                {errors.userRole && (
                  <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">
                    {errors.userRole.message}
                  </p>
                )}
              </div>
            )}

            {/* Name Field (Register Only) */}
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase ml-1">
                  Full Name
                </label>
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                    validate: (value) => {
                      return !/\d/.test(value) || "Name cannot contain numbers";
                    },
                  })}
                  className={`mt-1 w-full rounded-xl border p-3 outline-none transition-all ${
                    errors.name
                      ? "border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:ring-2 focus:ring-red-500"
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase ml-1">
                Email Address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address format",
                  },
                })}
                className={`mt-1 w-full rounded-xl border p-3 outline-none transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:ring-2 focus:ring-red-500"
                }`}
                placeholder="abcd@example.com"
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase ml-1">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Must include uppercase, lowercase, number and symbol",
                    },
                  })}
                  className={`w-full rounded-xl border p-3 pr-12 outline-none transition-all ${
                    errors.password
                      ? "border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:ring-2 focus:ring-red-500"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember & Forgot Row */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                    Remember me
                  </span>
                </label>
                <NavLink
                  to={"/login/forget-pass"}
                  onClick={() => setForgotPass(true)}
                  type="button"
                  className="font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  Forgot password?
                </NavLink>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-xl py-3.5 font-bold text-white shadow-lg transition-all mt-2 flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 shadow-red-100 active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <>
                  {/* Optional: Simple CSS Spinner */}
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isLogin ? "Logging in..." : "Registering..."}
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Get Started"
              )}
            </button>

            {/* Social Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-white px-4 text-gray-400 font-bold">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 px-4 font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              <img
                src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already a member?"}{" "}
            <button
              onClick={toggleMode}
              className="font-bold text-red-600 hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default AuthLayout;
