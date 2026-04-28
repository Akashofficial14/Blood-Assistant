import React from "react";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, Loader2, Droplet } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router";

const ForgotPassword = () => {
   let navigate= useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/forget-password",
        data,
      );
      if (res.data) {
        toast.success("Reset link sent! Please check your email inbox.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "User not found or Server Error",
      );
    }
  };
  const onBack = () => {
    // <Navigate to={"/login"} />;
    //jab return karna ho tab use karte hai normally navigate
    navigate("/login")
  };
  return (
    // min-h-screen and bg-gray-50 to match your Login background
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-50 p-4">
      {/* Main Card - Matching your Login card shadow and border */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo Section to keep branding consistent */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-500 p-3 rounded-2xl shadow-lg shadow-red-200">
            <Droplet className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
            Forgot Password?
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            No worries! Enter your email below and we'll send you a password
            reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase ml-1 tracking-widest">
              Registered Email
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <Mail size={18} />
              </span>
              <input
                {...register("email", {
                  required: "Email is required to reset password",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Please enter a valid email",
                  },
                })}
                className={`w-full rounded-xl border p-3.5 pl-11 outline-none transition-all ${
                  errors.email
                    ? "border-red-500 bg-red-50 focus:ring-red-100"
                    : "border-gray-200 focus:ring-2 focus:ring-red-500"
                }`}
                placeholder="akash@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-500 mt-1.5 ml-1 font-semibold italic">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 rounded-xl bg-red-600 py-4 font-bold text-white shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Sending Link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
