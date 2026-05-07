import { useEffect, useState } from "react";
import { useBulkUpdateRoles, useGetAllUsers } from "./hooks/useAdminApi";
import { Eye, EyeOff, UserPlus, ShieldAlert } from "lucide-react";

const UserManagement = ({ searchTerm }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [visibleEmails, setVisibleEmails] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState("");

  const { data: usersData, isLoading } = useGetAllUsers();
  const { mutate: updateRoles } = useBulkUpdateRoles();

  useEffect(() => {
    if (usersData) setAllUsers(usersData);
  }, [usersData]);

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
    updateRoles(
      {
        userIds: selectedUsers,
        newRole: targetRole,
      },
      {
        onSuccess: () => {
          setIsBulkModalOpen(false);
          setSelectedUsers([]);
        },
      },
    );
  };

  const filteredUsers = allUsers.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm?.toLowerCase() || ""),
  );

  if (isLoading)
    return <div className="p-6 text-center font-bold">Loading...</div>;

  return (
    <main className="flex-1 lg:ml-72 p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Users
          </h1>
          {selectedUsers.length > 0 && (
            <p className="text-red-600 text-sm font-bold mt-1">
              {selectedUsers.length} users selected for bulk action
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {selectedUsers.length > 0 && (
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="bg-black text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
            >
              <ShieldAlert size={16} /> Change Role
            </button>
          )}

          <button className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
            <UserPlus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Table Wrapper FIX */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[600px] w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-4 w-10">
                  <input type="checkbox" onChange={handleSelectAll} />
                </th>
                <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase">
                  User Details
                </th>
                <th className="px-4 py-4 text-xs font-bold text-gray-400 text-center uppercase">
                  Current Role
                </th>
                <th className="px-4 py-4 text-xs font-bold text-gray-400 text-right uppercase">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-800">{user.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {visibleEmails[user._id]
                          ? user.email
                          : "••••••••@••••.com"}
                      </span>
                      <button onClick={() => toggleEmail(user._id)}>
                        {visibleEmails[user._id] ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="px-3 py-1 bg-gray-100 text-xs font-bold rounded-full">
                      {user.userRole === "manage_bank"
                        ? "Bank Manager"
                        : user.userRole}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right text-xs font-bold">
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
      </div>

      {/* Modal (unchanged logic) */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl font-black text-gray-900 mb-2">
              Update Roles
            </h2>

            <div className="space-y-3 mt-4">
              {["admin", "user"].map((role) => {
                const roleValue = role === "user" ? "find_blood" : role;

                return (
                  <button
                    key={role}
                    onClick={() => setTargetRole(roleValue)}
                    className={`w-full p-3 rounded-xl font-bold text-sm border ${
                      targetRole === roleValue
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-100 text-gray-600"
                    }`}
                  >
                    {role === "user"
                      ? "USER"
                      : role.toUpperCase().replace("_", " ")}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="flex-1 py-3 font-bold text-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleBulkUpdate}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold"
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
