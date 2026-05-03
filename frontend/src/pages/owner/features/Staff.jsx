import React, { useState } from "react";

const Staff = () => {
  const [staff, setStaff] = useState([
    { id: 1, name: "Dr. Mehta", role: "Doctor", status: "Active" },
    { id: 2, name: "Ankit Verma", role: "Technician", status: "Offline" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", role: "" });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.role) return;

    setStaff([
      ...staff,
      {
        id: Date.now(),
        name: newStaff.name,
        role: newStaff.role,
        status: "Active",
      },
    ]);

    setShowModal(false);
    setNewStaff({ name: "", role: "" });
  };

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Staff</h1>
          <p className="text-slate-500 mt-1">
            Manage hospital staff and roles
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-red-700 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-800"
        >
          {/* <span className="material-symbols-outlined text-sm">
            person_add
          </span> */}
          Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">
                {member.name.charAt(0)}
              </div>

              <div>
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-sm text-slate-500">{member.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          
          <div className="bg-white p-6 rounded-2xl w-96">
            
            <h2 className="font-bold text-lg mb-4">
              Add New Staff
            </h2>

            <input
              type="text"
              placeholder="Full Name"
              value={newStaff.name}
              onChange={(e) =>
                setNewStaff({ ...newStaff, name: e.target.value })
              }
              className="w-full p-3 border rounded-lg mb-3"
            />

            <input
              type="text"
              placeholder="Role (Doctor, Technician...)"
              value={newStaff.role}
              onChange={(e) =>
                setNewStaff({ ...newStaff, role: e.target.value })
              }
              className="w-full p-3 border rounded-lg mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-slate-200 py-2 rounded-lg font-bold"
              >
                Cancel
              </button>

              <button
                onClick={handleAddStaff}
                className="flex-1 bg-red-700 text-white py-2 rounded-lg font-bold"
              >
                Add
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
};

export default Staff;