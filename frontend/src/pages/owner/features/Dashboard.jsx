import React, { useState } from "react";

const Dashboard = () => {
  const [filter, setFilter] = useState("Today");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" }),
  );

  // This will later come from API
  const stats = [
    {
      title: "Total Units",
      value: 120,
      color: "text-red-600",
      bg: "bg-red-50",
      icon: "bloodtype",
      change: "+12%",
    },
    {
      title: "Requests Today",
      value: 15,
      color: "text-slate-800",
      bg: "bg-slate-100",
      icon: "notifications",
      change: "+5%",
    },
    {
      title: "Fulfilled",
      value: 10,
      color: "text-green-600",
      bg: "bg-green-50",
      icon: "check_circle",
      change: "+8%",
    },
  ];

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10">
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Blood Bank Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Monitor inventory, requests, and operations in real-time.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
          <span className="material-symbols-outlined text-slate-400 text-sm">
            <select
              className="
            text-sm bg-transparent outline-none cursor-pointer"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
          </span>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm bg-transparent outline-none cursor-pointer"
          >
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${item.bg}`}>
                <span className={`material-symbols-outlined ${item.color}`}>
                  {item.icon}
                </span>
              </div>

              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                {item.change}
              </span>
            </div>

            <h2 className={`text-3xl font-black ${item.color}`}>
              {item.value}
            </h2>

            <p className="text-sm text-slate-500 mt-1">{item.title}</p>
          </div>
        ))}
      </div>

      {/* QUICK INSIGHTS / ACTIVITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-green-600">
                check_circle
              </span>
              <p className="text-sm text-slate-600">
                Request fulfilled for <b>O+</b> (2 units)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600">
                warning
              </span>
              <p className="text-sm text-slate-600">
                Low stock alert for <b>AB-</b>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-600">
                notifications
              </span>
              <p className="text-sm text-slate-600">
                New request received (B+)
              </p>
            </div>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Inventory Status</h3>

          <div className="space-y-4">
            {[
              { group: "A+", value: 20 },
              { group: "O-", value: 5 },
              { group: "B+", value: 15 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.group}</span>
                  <span className="font-bold">{item.value} units</span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full">
                  <div
                    className="h-2 bg-red-600 rounded-full"
                    style={{ width: `${item.value * 3}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
