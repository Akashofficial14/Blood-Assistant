"use client";
import React, {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import {
  useDonateBloodRegistration,
  useGetVerifiedBanks,
} from "./features/hooks/useUserApi.js";

export default function DonateBlood() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  // 1. Fetch live data from your API
  const { data: verifiedBanksData } = useGetVerifiedBanks();
  const { mutate: registerDonation } = useDonateBloodRegistration();

  // 2. Transform the flat API data into the nested structure for dropdowns
  const platformData = useMemo(() => {
    if (!verifiedBanksData || !Array.isArray(verifiedBanksData)) return [];

    const grouped = {};

    verifiedBanksData.forEach((bank) => {
      const state = bank.address?.state || "Unknown State";
      const city = bank.address?.city || "Unknown City";

      if (!grouped[state]) grouped[state] = {};
      if (!grouped[state][city]) grouped[state][city] = [];

      grouped[state][city].push({
        id: bank._id,
        name: bank.name,
      });
    });

    return Object.keys(grouped).map((stateName) => ({
      state: stateName,
      cities: Object.keys(grouped[stateName]).map((cityName) => ({
        name: cityName,
        banks: grouped[stateName][cityName],
      })),
    }));
  }, [verifiedBanksData]);

  // States for filtered lists
  const [availableCities, setAvailableCities] = useState([]);
  const [availableBanks, setAvailableBanks] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      donorInfo: { fullName: "", bloodGroup: "", dob: "", gender: "" },
      appointment: {
        state: "",
        city: "",
        bloodBankId: "",
        preferredDate: "",
        timeSlot: "",
      },
      contact: { phone: "", email: "" },
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

  // Cascading Dropdown Logic using the dynamic platformData
  const handleStateChange = (e) => {
    const stateName = e.target.value;
    const stateObj = platformData.find((s) => s.state === stateName);
    setAvailableCities(stateObj ? stateObj.cities : []);
    setAvailableBanks([]);
    setValue("appointment.city", "");
    setValue("appointment.bloodBankId", "");
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    const cityObj = availableCities.find((c) => c.name === cityName);
    setAvailableBanks(cityObj ? cityObj.banks : []);
    setValue("appointment.bloodBankId", "");
  };

  const onSubmit = (data) => {
    const bloodBankId = data.appointment.bloodBankId;
    console.log("Submitting donation registration for Blood Bank ID:", bloodBankId);

    // We wrap the ID and the form data into the 'variables' object
    registerDonation({
      bloodBankId,
      donorData: data,
    });

    console.log("Donation registration submitted for ID:", bloodBankId);
  };

  return (
    <>
      <div
        ref={formRef}
        className="min-h-screen bg-[#0d0d0d] text-white py-16 px-6 flex items-center justify-center selection:bg-red-600"
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          {/* LEFT COLUMN: GUIDELINES */}
          <div className="flex flex-col justify-center items-center space-y-10">
            <div className="form-animate">
              <h1 className="text-6xl font-black tracking-tight mb-6">
                Become a <span className="text-red-600">Donor</span>
              </h1>
              <p className="text-gray-400 text-xl font-medium leading-relaxed">
                Register on our platform and choose a local blood bank to
                schedule your donation.
              </p>
            </div>

            <div className="form-animate bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl">
              <h3 className="text-lg font-bold text-red-500 uppercase tracking-[0.3em] mb-6">
                Requirement Checklist
              </h3>
              <ul className="space-y-5 text-gray-300">
                {[
                  "18-65 years old",
                  "Weight > 50kg",
                  "No surgery in 6 months",
                  "Valid Gov ID",
                ].map((info, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-4 text-sm font-medium"
                  >
                    <span className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                    {info}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: THE NESTED FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="form-animate bg-white p-8 md:p-12 rounded-[3.5rem] text-black shadow-2xl space-y-6"
          >
            {/* donorInfo Section */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Step 1: Donor Identity
              </p>
              <div className="flex flex-col gap-1">
                <input
                  {...register("donorInfo.fullName", {
                    required: "Full name is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                  })}
                  placeholder="Full Name"
                  className={`input-field ${errors.donorInfo?.fullName ? "ring-2 ring-red-500" : ""}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  {...register("donorInfo.bloodGroup", {
                    required: "Required",
                  })}
                  className="input-field"
                >
                  <option value="">Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ),
                  )}
                </select>

                <select
                  {...register("donorInfo.gender", { required: "Required" })}
                  className="input-field"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* appointment Section */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Step 2: Location & Bank
              </p>
              <div className="grid grid-cols-2 gap-4">
                <select
                  {...register("appointment.state", { required: "Required" })}
                  onChange={handleStateChange}
                  className="input-field"
                >
                  <option value="">State</option>
                  {platformData.map((s) => (
                    <option key={s.state} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>

                <select
                  {...register("appointment.city", { required: "Required" })}
                  onChange={handleCityChange}
                  disabled={availableCities.length === 0}
                  className="input-field disabled:opacity-40"
                >
                  <option value="">City</option>
                  {availableCities.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <select
                {...register("appointment.bloodBankId", {
                  required: "Required",
                })}
                disabled={availableBanks.length === 0}
                className="input-field disabled:opacity-40"
              >
                <option value="">Select Registered Bank</option>
                {availableBanks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  {...register("appointment.preferredDate", {
                    required: "Required",
                  })}
                  className="input-field"
                />
                <select
                  {...register("appointment.timeSlot", {
                    required: "Required",
                  })}
                  className="input-field"
                >
                  <option value="">Time Slot</option>
                  <option value="9am-12pm">9AM - 12PM</option>
                  <option value="12pm-3pm">12PM - 3PM</option>
                  <option value="3pm-6pm">3PM - 6PM</option>
                </select>
              </div>
            </div>

            {/* contact Section */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Step 3: Contact Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                <input
                  {...register("contact.phone", { required: "Required" })}
                  placeholder="Phone"
                  className="input-field"
                />
                <input
                  {...register("contact.email", { required: "Required" })}
                  placeholder="Email"
                  className="input-field"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-[0_15px_30px_rgba(220,38,38,0.25)] active:scale-95"
            >
              Register & Schedule
            </button>
          </form>
        </div>
      </div>

      {/* Footer and Styles remain the same */}
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 1rem 1.5rem;
          background-color: #f3f4f6;
          border-radius: 1rem;
          outline: none;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .input-field:focus {
          border-color: #dc2626;
          background-color: white;
        }
      `}</style>
    </>
  );
}
