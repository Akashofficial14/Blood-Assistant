import React, { useState } from "react";

const Inventory = () => {
  const [inventory, setInventory] = useState([
    { group: "A+", units: 20 },
    { group: "B+", units: 15 },
    { group: "O-", units: 5 },
    { group: "AB+", units: 8 },
  ]);

  const [selected, setSelected] = useState(null);
  const [newUnits, setNewUnits] = useState("");

  const handleUpdate = () => {
    const updated = inventory.map((item) =>
      item.group === selected.group
        ? { ...item, units: Number(newUnits) }
        : item,
    );

    setInventory(updated);
    setSelected(null);
    setNewUnits("");
  };

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10">
      {/* HEADER */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blood Inventory</h1>
          <p className="text-slate-500 mt-1">
            Manage and update available blood units.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {inventory.map((item, i) => (
          <div
            key={i}
            onClick={() => setSelected(item)}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
          >
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 rounded-2xl transition" />

            <h3 className="text-lg font-bold text-red-700 mb-2">
              {item.group}
            </h3>

            <p className="text-3xl font-black text-slate-900">{item.units}</p>

            <p className="text-xs text-slate-400 mt-2">Click to update</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-lg animate-fadeIn">
            <h2 className="text-lg font-bold mb-4">
              Update {selected.group} Units
            </h2>

            <input
              type="number"
              value={newUnits}
              onChange={(e) => setNewUnits(e.target.value)}
              placeholder="Enter units"
              className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 bg-slate-100 py-2 rounded-lg font-bold"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="flex-1 bg-red-700 text-white py-2 rounded-lg font-bold hover:bg-red-800"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Inventory;
