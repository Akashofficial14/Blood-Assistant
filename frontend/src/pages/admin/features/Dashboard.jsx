import React from "react";

const Dashboard = ({searchTerm, setSearchTerm,activeItem, setActiveItem,facilities,FacilityCard}) => {
  return (
    <>
      <main className="flex-1 lg:ml-72 p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{activeItem}</h1>
            <p className="text-slate-500 mt-1">
              Viewing management for {activeItem?.toLowerCase()}.
            </p>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              search
            </span>
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none w-64 text-sm focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {facilities
            .filter((f) =>
              f?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((facility, index) => (
              <FacilityCard key={index} {...facility} />
            ))}

          <button className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-all min-h-[300px] group">
            <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">
              add_circle
            </span>
            <p className="font-bold">Add New Facility</p>
          </button>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
