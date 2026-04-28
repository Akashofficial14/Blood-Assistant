"use client";
import React, { useLayoutEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

export default function DonateBlood() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isAvailable: true,
      city: "",
      bloodGroup: ""
    },
  });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".form-animate", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  const onSubmit = (data) => {
    console.log("Donor Registered:", data);
    // Integration point for your MongoDB/Express backend
  };

  return (
<>    <div ref={formRef} className="min-h-screen bg-[#0d0d0d] text-white py-16 px-6 flex items-center justify-center selection:bg-red-600">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* LEFT COLUMN: BRANDING & GUIDELINES */}
        <div className="flex flex-col justify-center space-y-10">
          <div className="form-animate">
            <h1 className="text-6xl font-black tracking-tight mb-6">
              Become a <span className="text-red-600">Donor</span>
            </h1>
            <p className="text-gray-400 text-xl font-medium leading-relaxed">
              Join our community of life-savers. Your contribution bridges the gap between despair and hope.
            </p>
          </div>

          <div className="form-animate bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl">
            <h3 className="text-lg font-bold text-red-500 uppercase tracking-[0.3em] mb-6">Important Information</h3>
            <ul className="space-y-5 text-gray-300">
              {[
                "You must be between 18-65 years old",
                "Minimum weight requirement is 50 kg",
                "You should be in good health",
                "You can donate blood every 3 months"
              ].map((info, idx) => (
                <li key={idx} className="flex items-center gap-4 text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                  {info}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: THE FORM */}
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="form-animate bg-white p-8 md:p-12 rounded-[3.5rem] text-black shadow-2xl space-y-6"
        >
          {/* Section 1: Personal Info */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Personal Information</p>
            
            <input 
              {...register("fullName", { required: "Full name is required" })}
              placeholder="Full Name"
              className="w-full px-6 py-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 transition-all font-medium"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
                placeholder="Email Address"
                className="px-6 py-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 transition-all font-medium"
              />
              <input 
                {...register("phone", { required: "Phone number is required" })}
                placeholder="Phone Number"
                className="px-6 py-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <input 
                  type="number"
                  {...register("age", { required: "Required", min: 18, max: 65 })}
                  placeholder="Age (Years)"
                  className="w-full px-6 py-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 transition-all font-medium"
                />
                {errors.age && <p className="text-[10px] text-red-600 font-bold ml-2">Must be 18-65</p>}
              </div>
              <div className="space-y-1">
                <input 
                  type="number"
                  {...register("weight", { required: "Required", min: 50 })}
                  placeholder="Weight (kg)"
                  className="w-full px-6 py-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 transition-all font-medium"
                />
                {errors.weight && <p className="text-[10px] text-red-600 font-bold ml-2">Min 50kg</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Blood & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Blood Information</p>
              <select 
                {...register("bloodGroup", { required: true })}
                className="w-full px-6 py-4 bg-gray-100 rounded-2xl outline-none cursor-pointer focus:ring-2 focus:ring-red-600 font-medium appearance-none"
              >
                <option value="" disabled>Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Location</p>
              <select 
                {...register("city", { required: true })}
                className="w-full px-6 py-4 bg-gray-100 rounded-2xl outline-none cursor-pointer focus:ring-2 focus:ring-red-600 font-medium appearance-none"
              >
                <option value="" disabled>Select City</option>
                {["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Section 3: Availability */}
          <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
            <div className="pr-4">
              <p className="font-bold text-sm">Availability Status</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Ready for urgent calls</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register("isAvailable")} className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <button 
              type="submit"
              className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-[0_15px_30px_rgba(220,38,38,0.25)] active:scale-95"
            >
              Register as Donor
            </button>
            <button 
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-3 text-gray-400 font-bold hover:text-black transition-colors text-sm uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
      
    </div>
                 <footer className="bg-[#0d0d0d] text-white pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-2xl font-black tracking-tighter">Blood <span className="text-red-600">Assistant.</span></h3>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              Indore's digital life-saving network. We leverage modern web tech 
              to ensure no request for blood goes unanswered.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-red-600">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 font-medium text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Home</li>
              <li className="hover:text-white cursor-pointer transition-colors">Donate Blood</li>
              <li className="hover:text-white cursor-pointer transition-colors">Search Banks</li>
              <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-red-600">Connect</h4>
            <ul className="space-y-4 text-gray-400 font-medium text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Instagram</li>
              <li className="hover:text-white cursor-pointer transition-colors">Twitter</li>
              <li className="hover:text-white cursor-pointer transition-colors">LinkedIn</li>
              <li className="hover:text-white cursor-pointer transition-colors">Contact Support</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
            © 2026 Akash Warade. Developed for Impact.
          </p>
          <div className="flex gap-8 text-gray-600 text-xs font-bold uppercase tracking-widest">
            <span className="hover:text-red-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-red-600 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
</>
  );
}