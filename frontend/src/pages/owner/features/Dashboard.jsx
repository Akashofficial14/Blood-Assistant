import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getDashboardData } from "../../../api/blood bank/getDashboardData";

const Dashboard = () => {
  const [filter, setFilter] = useState("Today");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [dashboardData, setDashboardData] = useState({});

  const mutation = useMutation({
    mutationKey: ["bloodBankDashboardData"],
    mutationFn: getDashboardData,
    retry: 0,
    onSuccess: (data) => {
      if (data) {
        setDashboardData(data?.data);
      }
    },
    onError: (err) => {
      console.error("ERROR:", err.message);
    },
  });

  useEffect(() => {
    mutation.mutate();
  }, []);

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" }),
  );

  const stats = [
    {
      title: "Total Units",
      value: dashboardData?.stats?.totalUnits || 0,
      color: "text-red-600",
      bg: "bg-red-50",
      icon: "bloodtype",
      change: "",
    },
    {
      title: "Low Stock",
      value: dashboardData?.stats?.lowStockCount || 0,
      color: "text-slate-800",
      bg: "bg-slate-100",
      icon: "warning",
      change: "",
    },
    {
      title: "Blood Groups",
      value: dashboardData?.inventory?.length || 0,
      color: "text-green-600",
      bg: "bg-green-50",
      icon: "category",
      change: "",
    },
  ];

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10">
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
          <select
            className="text-sm bg-transparent outline-none cursor-pointer"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>

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
            </div>

            <h2 className={`text-3xl font-black ${item.color}`}>
              {item.value}
            </h2>

            <p className="text-sm text-slate-500 mt-1">{item.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>

          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Activity system will be integrated later
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Inventory Status</h3>

          <div className="space-y-4">
            {(dashboardData?.inventory || []).map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.group}</span>
                  <span className="font-bold">{item.units} units</span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full">
                  <div
                    className="h-2 bg-red-600 rounded-full"
                    style={{
                      width: `${Math.min(item.units * 5, 100)}%`,
                    }}
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
