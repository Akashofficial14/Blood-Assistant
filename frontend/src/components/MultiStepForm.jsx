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
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = useForm();

  const handlePincodeChange = async (e) => {
    const pin = e.target.value;

    if (pin.length !== 6) return;

    setIsPincodeLoading(true);

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      const post = data[0]?.PostOffice?.[0];
      if (!post) return;

      setValue("address.city", post.District);
      setValue("address.state", post.State);
      setValue("address.street", post.Name);
    } catch (err) {
      console.log("Pincode error:", err);
    } finally {
      setIsPincodeLoading(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords([lng, lat]);
        setSelectedPosition([lat, lng]);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          );
          const data = await res.json();

          const address = data.address;

          if (address) {
            setValue(
              "address.city",
              address.city || address.town || address.village || "",
            );
            setValue("address.state", address.state || "");
            setValue("address.zipCode", address.postcode || "");
          }
        } catch (err) {
          console.log(err);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        alert("Location access denied");
        setIsDetectingLocation(false);
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
    if (!coords) {
      setMapError(true);

      setTimeout(() => setMapError(false), 600);

      return;
    }

    if (coords) {
      formData.address.location = {
        type: "Point",
        coordinates: coords,
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
                  {...register("address.city")}
                  className="input"
                />
                {errors.address?.city && (
                  <p className="error">City is required</p>
                )}
              </div>
              <div>
                <input
                  placeholder="State"
                  {...register("address.state")}
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
                  onChange={(e) => {
                    handlePincodeChange(e); // your logic
                    register("address.zipCode").onChange(e); // RHF update
                  }}
                  className="input"
                />

                {errors.address?.zipCode && (
                  <p className="error">Zip Code is required</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {isPincodeLoading ? "Fetching location..." : ""}
                </p>
              </div>
              <div>
                {/* <p className="text-sm font-semibold mb-2">Select Location</p> */}
                <div
                  className={`transition-all ${
                    mapError
                      ? "animate-shake border-2 border-red-500 rounded-xl p-1"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold">Select Location</p>

                    <button
                      type="button"
                      onClick={detectLocation}
                      disabled={isDetectingLocation}
                      className={`text-xs px-3 py-1 rounded-md flex items-center gap-2 ${
                        isDetectingLocation
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {isDetectingLocation ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Detecting...
                        </>
                      ) : (
                        "Detect My Location"
                      )}
                    </button>
                  </div>

                  <MapPicker
                    setCoords={setCoords}
                    selectedPosition={selectedPosition}
                  />
                  {isDetectingLocation && (
                    <p className="text-xs text-gray-400 mt-1">
                      Getting your current location...
                    </p>
                  )}

                  {mapError && (
                    <p className="text-xs text-red-500 mt-1">
                      Please select location on map or use detect location
                    </p>
                  )}
                </div>
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
