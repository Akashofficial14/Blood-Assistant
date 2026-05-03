import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { registerBloodBankApi } from "../api/blood bank/registerBloodBank";
import MapPicker from "./MapPicker";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const steps = ["Basic Info", "License", "Contact", "Address"];

const MultiStepForm = () => {
  const [step, setStep] = useState(0);
  const [coords, setCoords] = useState(null);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["bloodBankData"],
    mutationFn: registerBloodBankApi,
    retry: 0,
    onSuccess: (data) => {
      if (data) {
        toast.success("Details Saved successfully");
        navigate("/manage-blood-bank");
      }
    },
    onError: (err) => {
      console.error("ERROR:", err);
    },
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  const nextStep = async () => {
    const valid = await trigger();
    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = (formData) => {
    console.log("FINAL DATA:", formData);

    if (coords) {
      formData.address.location = {
        type: "Point",
        coordinates: coords, // [lng, lat]
      };
    }

    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-sm border">
        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-2">Register Blood Bank</h1>
        <p className="text-slate-500 mb-6">
          Step {step + 1} of {steps.length} • {steps[step]}
        </p>

        {/* PROGRESS BAR */}
        <div className="w-full h-2 bg-slate-100 rounded mb-6">
          <div
            className="h-2 bg-red-600 rounded transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1 */}
          {step === 0 && (
            <div className="space-y-4">
              <input
                placeholder="Blood Bank Name"
                {...register("name", { required: "Name is required" })}
                className="input"
              />
              <p className="error">{errors.name?.message}</p>

              <select
                {...register("organizationType", { required: true })}
                className="input"
              >
                <option value="">Select Organization Type</option>
                <option>Government</option>
                <option>Charitable</option>
                <option>Red Cross</option>
                <option>Private Hospital</option>
                <option>Standalone Private</option>
              </select>
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div className="space-y-4">
              <input
                placeholder="License Number"
                {...register("registrationDetails.licenseNumber", {
                  required: "License required",
                })}
                className="input"
              />

              <input
                type="date"
                {...register("registrationDetails.licenseValidity", {
                  required: true,
                })}
                className="input"
              />

              <input
                placeholder="License Document URL"
                {...register("registrationDetails.licenseDocUrl", {
                  required: true,
                })}
                className="input"
              />
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="space-y-4">
              <input
                placeholder="Email"
                {...register("contact.email", {
                  required: true,
                  pattern: {
                    value: /^\S+@\S+$/,
                    message: "Invalid email",
                  },
                })}
                className="input"
              />

              <input
                placeholder="Phone"
                {...register("contact.phone", { required: true })}
                className="input"
              />

              <input
                placeholder="Emergency Contact"
                {...register("contact.emergencyContact")}
                className="input"
              />

              <input
                placeholder="Website"
                {...register("contact.website")}
                className="input"
              />
            </div>
          )}

          {/* STEP 4 */}
          {step === 3 && (
            <div className="space-y-4">
              <input
                placeholder="Street"
                {...register("address.street")}
                className="input"
              />

              <input
                placeholder="Landmark"
                {...register("address.landmark")}
                className="input"
              />

              <input
                placeholder="City"
                {...register("address.city", { required: true })}
                className="input"
              />

              <input
                placeholder="State"
                {...register("address.state", { required: true })}
                className="input"
              />

              <input
                placeholder="Zip Code"
                {...register("address.zipCode", { required: true })}
                className="input"
              />

              <div>
                <p className="text-sm font-semibold mb-2">Select Location</p>

                <MapPicker setCoords={setCoords} />

                {coords && (
                  <p className="text-xs text-slate-500 mt-2">
                    Selected: {coords[1]}, {coords[0]}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2 bg-slate-200 rounded-lg font-bold"
              >
                Back
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-2 bg-red-700 text-white rounded-lg font-bold"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg font-bold"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* STYLES */}
      <style>{`
        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
          outline: none;
        }
        .input:focus {
          border-color: #dc2626;
          background: white;
        }
        .error {
          font-size: 12px;
          color: red;
        }
      `}</style>
    </div>
  );
};

export default MultiStepForm;
