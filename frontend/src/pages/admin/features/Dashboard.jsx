import React, { useEffect, useState } from "react";
import { useDeleteBank, useGetVerifiedBanks } from "./hooks/useAdminApi";

const Dashboard = ({ searchTerm, setSearchTerm }) => {
  const [verifiedBanks, setVerifiedBanks] = useState([]);
  const { data: verifiedBanksData, isLoading, isError } = useGetVerifiedBanks();
  const { mutate: deleteBank } = useDeleteBank();

  const handleDelete = (bankId, type) => {
    if (window.confirm("Are you sure you want to delete this blood bank? ")) {
      deleteBank(bankId);
    }
  };

  useEffect(() => {
    if (verifiedBanksData) {
      // Accessing the nested array from your backend response structure
      setVerifiedBanks(verifiedBanksData.data?.bloodBanks || verifiedBanksData);
    }
  }, [verifiedBanksData]);

  // Handle Loading & Error States
  if (verifiedBanks.length === 0 && !isLoading) {
    return (
      <div className="flex mt-10 flex-col items-center h-full">
        <div className="flex flex-col w-9/12 ml-70 md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Facilities
            </h1>
            <p className="text-slate-500 mt-1">
              Manage and track all {verifiedBanks.length} verified blood bank
              facilities.
            </p>
          </div>
          <div className="relative">
            {/* <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span> */}
            <input
              type="text"
              className="pl-5 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none w-72 text-sm focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all shadow-sm"
              placeholder="Search by name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex w-9/12 ml-70 flex-col items-center justify-center p-20 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
          <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-slate-400 text-2xl">
              bloodbank
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            No Verified Blood Banks Found
          </h2>
          <p className="text-slate-500">
            There are no verified blood banks to display at the moment.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="lg:ml-72 p-10 font-bold text-slate-400">
        Loading facilities...
      </div>
    );
  if (isError)
    return (
      <div className="lg:ml-72 p-10 text-red-500">Error fetching data.</div>
    );

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10 bg-[#F8FAFC] min-h-screen">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Facilities
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and track all {verifiedBanks.length} verified blood bank
            facilities.
          </p>
        </div>
        <div className="relative">
          {/* <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span> */}
          <input
            type="text"
            className="pl-5 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none w-72 text-sm focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all shadow-sm"
            placeholder="Search by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {verifiedBanks
          ?.filter(
            (bank) =>
              bank.name
                ?.toLowerCase()
                .includes(searchTerm?.toLowerCase() || "") ||
              bank.address?.city
                ?.toLowerCase()
                .includes(searchTerm?.toLowerCase() || ""),
          )
          .map((bank) => (
            <div
              key={bank._id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              {/* Top Row: Icon & Status */}
              <div className="flex justify-between items-center mb-5">
                <div className="bg-red-50 px-5 py-2 rounded-2xl">
                  <span className="material-symbols-outlined text-red-600 text-md">
                    Blood Bank
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  {bank.verificationStatus?.status || "Verified"}
                </span>
              </div>

              {/* Bank Identity */}
              <h3 className="font-bold text-xl text-slate-800 truncate mb-1">
                {bank.name}
              </h3>
              <p className="text-slate-500 text-sm font-medium flex items-center gap-1 mb-1">
                {/* <span className="material-symbols-outlined text-sm">location_on</span> */}
                {bank.address?.city}, {bank.address?.state}
              </p>
              <p className="text-xs text-slate-400 mb-5">
                Owner:{" "}
                <span className="text-slate-600 font-semibold">
                  {bank.owner?.name}
                </span>
              </p>

              {/* Technical Details Labels */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <p className="text-[9px] uppercase font-bold text-slate-400">
                    Org Type
                  </p>
                  <p className="text-[11px] font-bold text-slate-700 truncate">
                    {bank.organizationType}
                  </p>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <p className="text-[9px] uppercase font-bold text-slate-400">
                    License
                  </p>
                  <p className="text-[11px] font-bold text-slate-700 truncate">
                    {bank.registrationDetails?.licenseNumber}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  // onClick={() => window.open(bank.registrationDetails?.licenseDocUrl, "_blank")}
                  className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">
                    Available
                  </span>
                </button>
                <button
                  onClick={() => {
                    handleDelete(bank._id, "delete");
                  }}
                  className="flex-[2] bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-black transition-colors shadow-lg shadow-slate-200"
                >
                  Remove Blood Bank
                </button>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
};

export default Dashboard;
