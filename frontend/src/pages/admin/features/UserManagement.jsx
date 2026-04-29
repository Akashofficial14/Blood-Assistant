const UserManagement = ({ searchTerm, setSearchTerm }) => {
  const users = [
    { name: "Dr. Julian Thorne", email: "j.thorne@clinic.org", role: "Admin", status: "Online" },
    { name: "Sarah Jenkins", email: "s.jenkins@clinic.org", role: "Staff", status: "Offline" },
  ];

  return (
    <main className="flex-1 lg:ml-72 p-6 md:p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <button className="bg-red-700 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">person_add</span> Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-600">{user.role}</td>
                <td className="px-6 py-4">
                   <span className={`w-2 h-2 inline-block rounded-full mr-2 ${user.status === 'Online' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                   <span className="text-sm">{user.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-red-600"><span className="material-symbols-outlined">more_vert</span></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
export default UserManagement;