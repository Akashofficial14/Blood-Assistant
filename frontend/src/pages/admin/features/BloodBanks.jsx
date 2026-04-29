import React from "react";

const BloodBanks = ({ searchTerm, setSearchTerm }) => {
  const bloodBanks = [
    { id: 1, name: "City Central Blood Bank", address: "123 Health Ave", type: "Main Hub", status: "Active" },
    { id: 2, name: "LifeLine Reserve", address: "45 Sector 9", type: "Satellite", status: "Active" },
  ];

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blood Banks</h1>
          <p className="text-slate-500 mt-1">Manage and track all registered blood bank facilities.</p>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input 
            type="text" className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none w-64 text-sm focus:ring-2 focus:ring-red-600" 
            placeholder="Search banks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bloodBanks.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())).map((bank) => (
          <div key={bank.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-red-700 bg-red-50 p-3 rounded-xl">local_hospital</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-green-50 text-green-600 rounded-md">{bank.status}</span>
            </div>
            <h3 className="font-bold text-lg text-slate-800">{bank.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{bank.address}</p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
               <span className="material-symbols-outlined text-sm">category</span> {bank.type}
            </div>
            <button className="w-full bg-red-700 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-red-800 transition-colors">
              Manage Inventory
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};
export default BloodBanks;