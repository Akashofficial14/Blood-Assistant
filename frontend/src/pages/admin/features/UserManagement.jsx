import { useEffect, useState } from "react";
import { useBulkUpdateRoles, useGetAllUsers } from "./hooks/useAdminApi";
import {
  Eye,
  EyeOff,
  UserPlus,
  MoreVertical,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

const UserManagement = ({ searchTerm }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [visibleEmails, setVisibleEmails] = useState({}); // Stores { userId: true/false }
  const [selectedUsers, setSelectedUsers] = useState([]); // Stores array of User IDs
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState("");

  const { data: usersData, isLoading } = useGetAllUsers();
  const { mutate: updateRoles } = useBulkUpdateRoles();
  useEffect(() => {
    if (usersData) setAllUsers(usersData);
  }, [usersData]);
  console.log("All Users Data from React Query:", allUsers);
  // --- Handlers ---
  const toggleEmail = (id) => {
    setVisibleEmails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u._id));
    }
  };

  const handleBulkUpdate = () => {
    console.log("Updating IDs:", selectedUsers, "to Role:", targetRole);

    // Call the function returned by the hook, NOT the hook itself
    updateRoles(
      {
        userIds: selectedUsers,
        newRole: targetRole,
      },
      {
        onSuccess: () => {
          setIsBulkModalOpen(false);
          setSelectedUsers([]);
          // Optional: Add a success toast here
        },
      },
    );
  };

  const filteredUsers = allUsers.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm?.toLowerCase() || ""),
  );

  if (isLoading)
    return <div className="p-10 text-center font-bold">Loading...</div>;

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Users
          </h1>
          {selectedUsers.length > 0 && (
            <p className="text-red-600 text-sm font-bold mt-1">
              {selectedUsers.length} users selected for bulk action
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {selectedUsers.length > 0 && (
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl"
            >
              <ShieldAlert size={18} /> Change Role
            </button>
          )}
          <button className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2">
            <UserPlus size={18} /> Add User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-5 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedUsers.length === filteredUsers.length &&
                    filteredUsers.length > 0
                  }
                  className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                User Details
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                Current Role
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className={`transition-colors ${selectedUsers.includes(user._id) ? "bg-red-50/30" : "hover:bg-gray-50/50"}`}
              >
                <td className="px-6 py-5">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleSelectUser(user._id)}
                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </td>
                <td className="px-8 py-5">
                  <div className="font-bold text-gray-800">{user.name}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-400 font-mono">
                      {visibleEmails[user._id]
                        ? user.email
                        : "••••••••@••••.com"}
                    </span>
                    <button
                      onClick={() => toggleEmail(user._id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      {visibleEmails[user._id] ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                    {user.userRole === "manage_bank"
                      ? "Bank Manager"
                      : user.userRole}
                  </span>
                </td>
                <td className="px-8 py-5 text-right font-bold text-xs text-gray-400">
                  {user.isVerified ? (
                    <span className="text-green-500">Verified</span>
                  ) : (
                    "Pending"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Bulk Update Modal --- */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-black text-gray-900 mb-2">
              Update Roles
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Select a new role for the {selectedUsers.length} selected users.
            </p>

            <div className="space-y-3">
              {["admin", "user"].map((role) => {
                // Determine the value to be stored in state
                const roleValue = role === "user" ? "find_blood" : role;

                return (
                  <button
                    key={role}
                    // Now when you click, it sets "find_blood" instead of "user"
                    onClick={() => setTargetRole(roleValue)}
                    className={`w-full p-4 rounded-2xl text-left font-bold text-sm transition-all border-2 ${
                      targetRole === roleValue
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-100 text-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {role === "user"
                          ? "USER"
                          : role.toUpperCase().replace("_", " ")}
                      </span>

                      {targetRole === roleValue && (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpdate}
                disabled={!targetRole}
                className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-100 disabled:opacity-50"
              >
                Apply Change
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserManagement;
