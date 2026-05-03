import React, { useState } from "react";

const Requests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      blood: "O+",
      units: 2,
      time: "10 min ago",
      status: "Pending",
    },
    {
      id: 2,
      name: "Neha Singh",
      blood: "AB-",
      units: 1,
      time: "1 hour ago",
      status: "Pending",
    },
  ]);

  // 🔥 Handle Accept / Reject
  const handleAction = (id, action) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: action } : req
    );

    setRequests(updated);
  };

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10">
      
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Incoming Requests
        </h1>
        <p className="text-slate-500 mt-1">
          Manage and respond to blood requests from users.
        </p>
      </div>

      {/* REQUEST LIST */}
      <div className="space-y-5">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center"
          >
            {/* LEFT SIDE */}
            <div>
              <h3 className="font-bold text-lg text-slate-800">
                {req.name}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {req.blood} • {req.units} units • {req.time}
              </p>

              {/* STATUS BADGE */}
              <span
                className={`inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full ${
                  req.status === "Accepted"
                    ? "bg-green-100 text-green-700"
                    : req.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {req.status}
              </span>
            </div>

            {/* RIGHT SIDE BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => handleAction(req.id, "Accepted")}
                disabled={req.status !== "Pending"}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
                  req.status === "Pending"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Accept
              </button>

              <button
                onClick={() => handleAction(req.id, "Rejected")}
                disabled={req.status !== "Pending"}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
                  req.status === "Pending"
                    ? "bg-slate-200 hover:bg-slate-300"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Requests;