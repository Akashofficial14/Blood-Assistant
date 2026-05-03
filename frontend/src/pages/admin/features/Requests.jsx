import React, { useState, useEffect } from "react";
import { useGetAllBloodBanks, useRejectBank, useVerifyBank } from "./hooks/useAdminApi";

const Requests = () => {
  const [filterStatus, setFilterStatus] = useState("verified");
  const [displayBanks, setDisplayBanks] = useState([]);

  const { data: allBloodBanks, isLoading } = useGetAllBloodBanks();
  const { mutate: verifyBank } = useVerifyBank();
  const { mutate: rejectBank } = useRejectBank();

  useEffect(() => {
    if (allBloodBanks) {
      const filtered = allBloodBanks.filter(
        (bank) => bank.verificationStatus?.status === filterStatus,
      );
      setDisplayBanks(filtered);
    }
  }, [allBloodBanks, filterStatus]);

  const handleApprove = (id, type) => {
    verifyBank(id);
  };

  const handleReject = (id, type) => {
    rejectBank(id);
  };

  if (isLoading)
    return (
      <div className="p-10 lg:ml-72 font-medium text-slate-400">
        Fetching facility data...
      </div>
    );

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10 bg-[#F8FAFC] min-h-screen">
      {/* Header & Tabs */}
      <div className="mb-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Facility Verifications
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Review and manage blood bank registrations.
          </p>
        </div>

        <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {["pending", "verified", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                filterStatus === s
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid or Empty State */}
      <div className="flex flex-col gap-6">
        {displayBanks.length > 0 ? (
          displayBanks.map((bank) => (
            <div
              key={bank._id}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Section */}
                <div className="flex-1 flex gap-6">
                  <div className="h-15 w-15 bg-red-50 flex items-center rounded-full justify-center text-red-600 p-4">
                    <span className="font-bold text-2xl">
                      {bank.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-black text-slate-800">
                        {bank.name}
                      </h2>
                    </div>
                    <div className="flex flex-wrap flex-col gap-y-2 gap-x-4 text-sm font-medium text-slate-500">
                      <span>{bank.address.city}, {bank.address.state}</span>
                      <span>{bank.contact.email}</span>
                      <span>{bank.contact.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Data Badge Section */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="bg-slate-50 flex flex-col gap-2 justify-center items-center px-5 py-3 rounded-2xl border border-slate-100">
                    <span className="bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                      {bank.organizationType}
                    </span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      License Number
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {bank.registrationDetails.licenseNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => window.open(bank.registrationDetails.licenseDocUrl, "_blank")}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors"
                  >
                    View PDF
                  </button>
                </div>

                {/* Action Section */}
                <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                  {bank.verificationStatus.status === "pending" ? (
                    <>
                      <button onClick={() => handleReject(bank._id, "reject")} className="bg-red-600 text-white px-10 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95">
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(bank._id, "verify")}
                        className="bg-green-600 text-white px-10 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95"
                      >
                        Approve
                      </button>
                    </>
                  ) : (
                    <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest ${
                      bank.verificationStatus.status === "verified" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}>
                      {bank.verificationStatus.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty State UI */
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-slate-300">
                Requests
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 capitalize">
              0 {filterStatus} blood banks
            </h3>
            <p className="text-slate-500 font-medium">
              There are currently no records found in this category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Requests;