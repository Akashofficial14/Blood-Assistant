const AdminProfile = () => (
  <main className="flex-1 lg:ml-72 p-6 md:p-10">
    <h1 className="text-3xl font-bold tracking-tight mb-10">
      Account Settings
    </h1>
    <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 text-center shadow-sm">
        <div className="w-24 h-24 bg-red-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          A
        </div>
        <h3 className="font-bold text-xl">Akash</h3>
        <p className="text-slate-500 text-sm">System Administrator</p>
        <button className="mt-6 w-full py-2 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
          Change Photo
        </button>
      </div>

      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-6">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                defaultValue="Akash"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Email Address
              </label>
              <input
                type="email"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                defaultValue="admin@bloodassistant.com"
              />
            </div>
          </div>
          <button className="mt-8 bg-red-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-800 shadow-md transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </main>
);
export default AdminProfile;
