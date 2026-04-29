const Requests = () => {
  const requests = [
    { type: "O+", units: 4, hospital: "St. Jude Regional", urgency: "Critical", time: "12 mins ago" },
    { type: "AB-", units: 2, hospital: "Metro General", urgency: "Normal", time: "1h ago" },
  ];

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10">
      <h1 className="text-3xl font-bold tracking-tight mb-10">Active Requests</h1>
      <div className="grid grid-cols-1 gap-4">
        {requests.map((req, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border-l-4 border-l-red-600 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 bg-red-50 rounded-full flex items-center justify-center text-red-700 font-black text-xl">
                {req.type}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{req.hospital}</h3>
                <p className="text-xs text-slate-500">{req.units} Units requested • {req.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${req.urgency === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {req.urgency}
              </span>
              <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-900">Approve</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
export default Requests;