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
  const [selectedPosition, setSelectedPosition] = useState(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Set coords (Mongo format)
        setCoords([lng, lat]);

        // Set map position
        setSelectedPosition([lat, lng]);

        try {
          // Reverse geocoding
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
              params: {
                lat,
                lon: lng,
                format: "json",
              },
            },
          );

          const address = res.data.address;

          // Auto fill form fields
          if (address) {
            document.querySelector('input[name="address.city"]').value =
              address.city || address.town || address.village || "";

            document.querySelector('input[name="address.state"]').value =
              address.state || "";

            document.querySelector('input[name="address.zipCode"]').value =
              address.postcode || "";
          }
        } catch (err) {
          console.error("Geocode error:", err);
        }
      },
      (err) => {
        alert("Location access denied");
      },
    );
  };

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
    console.log("Next Step");
    let fieldsToValidate = [];

    // Define which fields belong to which step
    if (step === 0) fieldsToValidate = ["name", "organizationType"];
    if (step === 1)
      fieldsToValidate = [
        "registrationDetails.licenseNumber",
        "registrationDetails.licenseValidity",
        "registrationDetails.licenseDocUrl",
      ];
    if (step === 2) {
      // Use exact field names as registered
      fieldsToValidate = [
        "contact.email",
        "contact.phone",
        "contact.emergencyContact",
        "contact.website",
      ];
    }
    if (step === 3)
      fieldsToValidate = ["address.city", "address.state", "address.zipCode"];

    const valid = await trigger(fieldsToValidate);
    if (valid) setStep((prev) => prev + 1);
    console.log("Validation Result for Step", step, ":", valid);
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
        <h1 className="text-2xl font-bold mb-2">Register Blood Bank</h1>
        <p className="text-slate-500 mb-6">
          Step {step + 1} of {steps.length} • {steps[step]}
        </p>

        <div className="w-full h-2 bg-slate-100 rounded mb-6">
          <div
            className="h-2 bg-red-600 rounded transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1: BASIC INFO */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <input
                  placeholder="Blood Bank Name"
                  {...register("name", { required: "Name is required" })}
                  className="input"
                />
                {errors.name && <p className="error">{errors.name.message}</p>}
              </div>
              <div>
                <select
                  {...register("organizationType", {
                    required: "Please select an organization type",
                  })}
                  className="input"
                >
                  <option value="">Select Organization Type</option>
                  <option>Government</option>
                  <option>Charitable</option>
                  <option>Red Cross</option>
                  <option>Private Hospital</option>
                  <option>Standalone Private</option>
                </select>
                {errors.organizationType && (
                  <p className="error">{errors.organizationType.message}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: LICENSE */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <input
                  placeholder="License Number"
                  {...register("registrationDetails.licenseNumber", {
                    required: "License number is required",
                  })}
                  className="input"
                />
                {errors.registrationDetails?.licenseNumber && (
                  <p className="error">
                    {errors.registrationDetails.licenseNumber.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="date"
                  {...register("registrationDetails.licenseValidity", {
                    required: "Validity date is required",
                  })}
                  className="input"
                />
                {errors.registrationDetails?.licenseValidity && (
                  <p className="error">Validity date is required</p>
                )}
              </div>
              <div>
                <input
                  placeholder="License Document URL"
                  {...register("registrationDetails.licenseDocUrl", {
                    required: "Document URL is required",
                  })}
                  className="input"
                />
                {errors.registrationDetails?.licenseDocUrl && (
                  <p className="error">Document URL is required</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <input
                  placeholder="Email"
                  {...register("contact.email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                  className="input"
                />
                {errors.contact?.email && (
                  <p className="error">{errors.contact.email.message}</p>
                )}
              </div>
              <div>
                <input
                  placeholder="Phone"
                  {...register("contact.phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Must be 10 digits",
                    },
                  })}
                  className="input"
                />
                {errors.contact?.phone && (
                  <p className="error">{errors.contact.phone.message}</p>
                )}
              </div>
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

          {/* STEP 4: ADDRESS */}
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
              <div>
                <input
                  placeholder="City"
                  {...register("address.city", {
                    required: "City is required",
                  })}
                  className="input"
                />
                {errors.address?.city && (
                  <p className="error">City is required</p>
                )}
              </div>
              <div>
                <input
                  placeholder="State"
                  {...register("address.state", {
                    required: "State is required",
                  })}
                  className="input"
                />
                {errors.address?.state && (
                  <p className="error">State is required</p>
                )}
              </div>
              <div>
                <input
                  placeholder="Zip Code"
                  {...register("address.zipCode", {
                    required: "Zip Code is required",
                  })}
                  className="input"
                />
                {errors.address?.zipCode && (
                  <p className="error">Zip Code is required</p>
                )}
              </div>
              <div>
                {/* <p className="text-sm font-semibold mb-2">Select Location</p> */}
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold">Select Location</p>

                  <button
                    type="button"
                    onClick={detectLocation}
                    className="text-xs bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 my-3"
                  >
                    Detect My Location
                  </button>
                </div>

                <MapPicker
                  setCoords={setCoords}
                  selectedPosition={selectedPosition}
                />
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

      <style>{`
        .input { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; outline: none; }
        .input:focus { border-color: #dc2626; background: white; }
        .error { font-size: 12px; color: #dc2626; margin-top: 2px; }
      `}</style>
    </div>
  );
};

export default MultiStepForm;
