import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateInventory } from "../../../api/blood bank/updateInventory";
import { getDashboardData } from "../../../api/blood bank/getDashboardData";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  const [selected, setSelected] = useState(null);
  const [newUnits, setNewUnits] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [addGroup, setAddGroup] = useState("");
  const [addUnits, setAddUnits] = useState("");

  const fetchInventory = async () => {
    try {
      const res = await getDashboardData();
      if (res?.data) {
        setInventory(res.data.inventory);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const mutation = useMutation({
    mutationKey: ["updateInventory"],
    mutationFn: updateInventory,
    retry: 0,
    onSuccess: () => {
      fetchInventory();
      setSelected(null);
      setShowAddModal(false);
      setNewUnits("");
      setAddUnits("");
      setAddGroup("");
    },
    onError: (err) => {
      console.error("ERROR:", err.message);
    },
  });

  const handleUpdate = () => {
    if (!selected || !newUnits) return;

    mutation.mutate({
      group: selected.group,
      units: Number(newUnits),
    });
  };

  const handleAdd = () => {
    if (!addGroup || !addUnits) return;

    mutation.mutate({
      group: addGroup,
      units: Number(addUnits),
    });
  };

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blood Inventory</h1>
          <p className="text-slate-500 mt-1">
            Manage and update available blood units.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-700 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-red-800 flex items-center gap-2"
        >
          Add Blood
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {inventory.map((item, i) => (
          <div
            key={i}
            onClick={() => setSelected(item)}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
          >
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
          <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add Blood Units</h2>

            <select
              value={addGroup}
              onChange={(e) => setAddGroup(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 mb-3"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>

            <input
              type="number"
              value={addUnits}
              onChange={(e) => setAddUnits(e.target.value)}
              placeholder="Enter units"
              className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-slate-100 py-2 rounded-lg font-bold"
              >
                Cancel
              </button>

              <button
                onClick={handleAdd}
                className="flex-1 bg-red-700 text-white py-2 rounded-lg font-bold hover:bg-red-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Inventory;
