import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { getRegisteredDonors } from "../../../api/blood bank/getRegisteredDonar";
import { toast } from "react-toastify";

const DonarDirectory = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { bloodBankId } = user;
  const [requests, setRequests] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["registeredDonors", bloodBankId],
    queryFn: () => getRegisteredDonors({ bloodBankId }),
  });

  useEffect(() => {
    // Ensure we are accessing the correct data path from your API response
    if (data) {
      setRequests(data);
    }
    if (error) {
      toast.error("Failed to load registered donors");
    }
  }, [data, error]);

  const handleAction = (id, action) => {
    // We match by _id since that is what MongoDB/your API uses
    const updated = requests.map((req) =>
      req._id === id ? { ...req, status: action } : req
    );
    setRequests(updated);
    
    if(action === "Accepted") {
      toast.success("Appointment Confirmed!");
    }
  };

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10 bg-slate-50 min-h-screen">
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}

      {/* DASHBOARD HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Donor Management
          </h1>
          <p className="text-slate-500 mt-1">
            Review and process upcoming blood donation appointments.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Donors
            </p>
            <p className="text-2xl font-black text-red-600">
              {requests.length}
            </p>
          </div>
        </div>
      </div>

      {/* APPOINTMENT LIST */}
      <div className="grid gap-6">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div
              key={req._id}
              // Dynamic background: turns green if status is 'Accepted'
              className={`group p-6 rounded-3xl border transition-all duration-500 flex flex-col lg:flex-row lg:items-center gap-6 shadow-sm ${
                req.status === "Accepted"
                  ? "bg-green-50 border-green-200 shadow-green-100"
                  : "bg-white border-slate-200 hover:shadow-xl hover:border-red-100"
              }`}
            >
              {/* BLOOD GROUP AVATAR */}
              <div className="flex-shrink-0">
                <div className={`h-20 w-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-colors duration-500 ${
                  req.status === "Accepted" 
                    ? "bg-green-600 border-green-400 text-white" 
                    : "bg-red-50 border-red-100 text-red-600"
                }`}>
                  <span className="text-[10px] font-bold uppercase">Type</span>
                  <span className="text-2xl font-black leading-none">
                    {req.donorInfo.bloodGroup}
                  </span>
                </div>
              </div>

              {/* DONOR INFO SECTION */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-black text-xl text-slate-800 truncate">
                    {req.donorInfo.fullName}
                  </h3>
                  {req.status === "Accepted" && (
                    <span className="bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-md">
                      CONFIRMED
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-slate-100 rounded-lg text-slate-400">📞</span>
                    <span className="font-medium text-slate-700">{req.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <span className="p-1.5 bg-slate-100 rounded-lg text-slate-400">✉️</span>
                    <span className="font-medium">{req.contact.email}</span>
                  </div>
                </div>
              </div>

              {/* SCHEDULE CARD */}
              <div className={`lg:w-64 rounded-2xl p-4 border transition-colors ${
                req.status === "Accepted" ? "bg-white border-green-100" : "bg-slate-50 border-slate-100"
              }`}>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Schedule</p>
                <div className="flex flex-col gap-1 text-sm font-bold">
                  <p className="text-slate-800">
                    📅 {new Date(req.appointment.preferredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                  <p className={req.status === "Accepted" ? "text-green-600" : "text-red-500"}>
                    ⏰ {req.appointment.timeSlot}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex lg:flex-col gap-2">
                <button
                  onClick={() => handleAction(req._id, "Accepted")}
                  disabled={req.status === "Accepted"}
                  className={`flex-1 px-8 py-3 rounded-2xl text-sm font-black transition-all duration-300 shadow-sm ${
                    req.status === "Accepted"
                      ? "bg-green-600 text-white cursor-default scale-105"
                      : "bg-red-600 text-white hover:bg-red-700 active:scale-95"
                  }`}
                >
                  {req.status === "Accepted" ? "✓ Accepted" : "Accept Appointment"}
                </button>

                {req.status === "Pending" && (
                  <button
                    onClick={() => handleAction(req._id, "Rejected")}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all"
                  >
                    Decline
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          !isLoading && (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
              <p className="text-slate-400 font-bold text-lg italic">No active requests found.</p>
            </div>
          )
        )}
      </div>
    </main>
  );
};

export default DonarDirectory;