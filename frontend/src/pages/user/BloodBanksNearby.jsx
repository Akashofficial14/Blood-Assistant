import { useState, useMemo } from "react";
import { useGetVerifiedBanks } from "./features/hooks/useUserApi";
import { useNavigate } from "react-router-dom";

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function BloodBanks() {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [selectedBank, setSelectedBank] = useState(null);

  // Location filter state
  const [selectedState, setSelectedState] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");

  const navigate = useNavigate();
  const { data: banks = [], isLoading, isError, refetch } = useGetVerifiedBanks();

  // ── Dynamically build states list from real API data ──
  const stateOptions = useMemo(() => {
    const states = [...new Set(banks.map((b) => b.state).filter(Boolean))].sort();
    return ["All", ...states];
  }, [banks]);

  // ── Dynamically build cities based on selected state ──
  const cityOptions = useMemo(() => {
    const source = selectedState === "All" ? banks : banks.filter((b) => b.state === selectedState);
    const cities = [...new Set(source.map((b) => b.city).filter(Boolean))].sort();
    return ["All", ...cities];
  }, [banks, selectedState]);

  // Reset city when state changes
  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedCity("All");
  };

  // ── Filter + Sort ──
  const filtered = [...banks]
    .filter((bank) => {
      const matchSearch =
        bank.name?.toLowerCase().includes(search.toLowerCase()) ||
        bank.city?.toLowerCase().includes(search.toLowerCase()) ||
        bank.state?.toLowerCase().includes(search.toLowerCase());

      const matchGroup =
        selectedGroup === "All" ||
        bank.bloodAvailability?.some((s) => s.group === selectedGroup && s.unitsAvailable > 0);

      const matchState = selectedState === "All" || bank.state === selectedState;
      const matchCity = selectedCity === "All" || bank.city === selectedCity;

      return matchSearch && matchGroup && matchState && matchCity;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name?.localeCompare(b.name);
      if (sortBy === "stock")
        return (
          (b.bloodAvailability?.reduce((s, x) => s + x.unitsAvailable, 0) || 0) -
          (a.bloodAvailability?.reduce((s, x) => s + x.unitsAvailable, 0) || 0)
        );
      return 0;
    });

  const getStockBadge = (bloodAvailability, group) => {
    if (!bloodAvailability || bloodAvailability.length === 0)
      return { label: "No Stock", color: "#ff4444", bg: "#2a1010", border: "#ff4444" };
    if (group === "All") {
      const total = bloodAvailability.reduce((s, x) => s + (x.unitsAvailable || 0), 0);
      if (total === 0) return { label: "No Stock", color: "#ff4444", bg: "#2a1010", border: "#ff4444" };
      if (total < 5) return { label: "Low Stock", color: "#ffaa00", bg: "#2a1f00", border: "#ffaa00" };
      return { label: "Available", color: "#00e676", bg: "#0a2a15", border: "#00e676" };
    }
    const found = bloodAvailability.find((s) => s.group === group);
    if (!found || found.unitsAvailable === 0)
      return { label: "Unavailable", color: "#ff4444", bg: "#2a1010", border: "#ff4444" };
    if (found.unitsAvailable < 3)
      return { label: `${found.unitsAvailable} units`, color: "#ffaa00", bg: "#2a1f00", border: "#ffaa00" };
    return { label: `${found.unitsAvailable} units`, color: "#00e676", bg: "#0a2a15", border: "#00e676" };
  };

  const hasActiveFilters =
    selectedState !== "All" || selectedCity !== "All" || selectedGroup !== "All" || search !== "";

  const resetAllFilters = () => {
    setSearch("");
    setSelectedState("All");
    setSelectedCity("All");
    setSelectedGroup("All");
    setSortBy("name");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); } 50% { box-shadow: 0 0 0 8px rgba(220,38,38,0); } }
        .card-anim { animation: fadeUp 0.35s ease both; }
        .spinner { animation: spin 1s linear infinite; }
        .blood-drop { animation: pulse-glow 2s infinite; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #3f1010; border-radius: 2px; }
        input::placeholder { color: rgba(255,255,255,0.4); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        select option { background: #1a1a1a; color: #fff; }
      `}</style>

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a0000] via-[#2d0000] to-[#0d0d0d] border-b border-red-950 px-6 md:px-10 pt-8 pb-0">
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-red-900/20 blur-3xl" />
        <div className="pointer-events-none absolute top-0 right-40 w-40 h-40 rounded-full bg-red-700/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 w-56 h-56 rounded-full bg-red-800/10 blur-3xl" />
        <div className="pointer-events-none select-none absolute right-8 top-4 text-red-900/20 text-[140px] leading-none font-black">✚</div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
          </div>

          <h1 className="text-[clamp(38px,6vw,68px)] leading-none tracking-widest mb-1 text-white" style={{ fontFamily: "'Bebas Neue'" }}>
            FIND BLOOD BANKS{" "}
            <span className="bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">NEARBY</span>
          </h1>
          <p className="text-sm text-zinc-500 mb-6">
            Real-time availability · <span className="text-red-500 font-semibold">{banks.length}</span> verified centers registered
          </p>

          {/* ── Location Filter Form ── */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5 backdrop-blur-sm">
            <p className="text-[10px] font-bold tracking-[0.2em] text-red-400/70 mb-3 uppercase">📍 Filter by Location</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* State selector */}
              <div>
                <label className="text-[11px] text-zinc-500 font-semibold mb-1 block tracking-wider">STATE</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🗺️</span>
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-600 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white outline-none transition-colors appearance-none cursor-pointer"
                  >
                    {stateOptions.map((s) => (
                      <option key={s} value={s}>{s === "All" ? "All States" : s}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none">▼</span>
                </div>
              </div>

              {/* City selector — disabled until state chosen */}
              <div>
                <label className="text-[11px] text-zinc-500 font-semibold mb-1 block tracking-wider">
                  CITY{" "}
                  {selectedState === "All" && (
                    <span className="text-zinc-700 normal-case font-normal">(select state first)</span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🏙️</span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={selectedState === "All"}
                    className={`w-full border rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none transition-colors appearance-none cursor-pointer ${
                      selectedState === "All"
                        ? "bg-zinc-900/40 border-zinc-800 text-zinc-600 cursor-not-allowed"
                        : "bg-zinc-900 border-zinc-700 focus:border-red-600 text-white cursor-pointer"
                    }`}
                  >
                    {cityOptions.map((c) => (
                      <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none">▼</span>
                </div>
              </div>
            </div>

            {/* Active location badge */}
            {(selectedState !== "All" || selectedCity !== "All") && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-zinc-500">Showing:</span>
                {selectedState !== "All" && (
                  <span className="text-[11px] bg-red-900/40 border border-red-800/60 text-red-300 px-2.5 py-0.5 rounded-full font-semibold">
                    📍 {selectedState}
                  </span>
                )}
                {selectedCity !== "All" && (
                  <span className="text-[11px] bg-red-900/40 border border-red-800/60 text-red-300 px-2.5 py-0.5 rounded-full font-semibold">
                    🏙️ {selectedCity}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Search + Refresh */}
          <div className="flex gap-3 flex-wrap pb-7">
            <div className="flex-1 min-w-[260px] relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, city or state..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <button
              onClick={() => refetch()}
              className="bg-white/5 border border-white/10 text-zinc-400 rounded-xl px-5 py-3 font-semibold text-sm flex items-center gap-2 hover:bg-white/10 hover:text-white transition-all"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ── Filters Strip ── */}
      <div className="bg-[#0f0f0f] border-b border-zinc-800/60 px-6 md:px-10">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-3">
          {BLOOD_GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                selectedGroup === g
                  ? "bg-gradient-to-r from-red-700 to-red-500 text-white shadow-lg shadow-red-900/40 border-0"
                  : "bg-transparent border border-zinc-700 text-zinc-400 hover:border-red-700 hover:text-red-400"
              }`}
            >
              {g === "All" ? "All Groups" : `🩸 ${g}`}
            </button>
          ))}
        </div>

        <div className="flex gap-3 pb-3 flex-wrap items-center">
          <span className="text-zinc-600 text-xs font-bold tracking-widest">SORT BY</span>
          {[
            { key: "name", label: "🏥 Name" },
            { key: "stock", label: "🩸 Stock" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                sortBy === s.key
                  ? "bg-zinc-800 border border-zinc-600 text-white"
                  : "border border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400"
              }`}
            >
              {s.label}
            </button>
          ))}

          {/* Clear all filters button — only shows when filters are active */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="ml-auto flex items-center gap-1.5 text-[11px] text-red-400 border border-red-900/50 bg-red-950/30 hover:bg-red-900/40 px-3 py-1 rounded-full font-semibold transition-all"
            >
              ✕ Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="px-6 md:px-10 py-6">

        {isLoading && (
          <div className="text-center py-20">
            <div className="spinner w-10 h-10 border-[3px] border-zinc-800 border-t-red-600 rounded-full mx-auto mb-4" />
            <p className="text-zinc-600 text-sm">Loading blood banks...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-zinc-500 text-base mb-4">Could not load blood banks</p>
            <button
              onClick={() => refetch()}
              className="bg-gradient-to-r from-red-700 to-red-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-red-600 hover:to-red-400 transition-all shadow-lg shadow-red-900/40"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="flex items-center justify-between mb-5">
            <span className="text-zinc-500 text-xs">
              <span className="text-white font-bold text-sm">{filtered.length}</span> blood banks found
              {selectedGroup !== "All" && (
                <span> · <span className="text-red-500 font-semibold">{selectedGroup}</span> available</span>
              )}
              {selectedCity !== "All" && (
                <span> · in <span className="text-red-400 font-semibold">{selectedCity}</span></span>
              )}
              {selectedState !== "All" && selectedCity === "All" && (
                <span> · in <span className="text-red-400 font-semibold">{selectedState}</span></span>
              )}
            </span>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🩸</div>
            <p className="text-zinc-500 text-base mb-2">No blood banks found</p>
            <p className="text-zinc-700 text-sm mb-5">Try adjusting your state, city or blood group filters</p>
            <button
              onClick={resetAllFilters}
              className="bg-gradient-to-r from-red-700 to-red-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-red-600 hover:to-red-400 transition-all shadow-lg shadow-red-900/40"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Cards Grid */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
            {filtered.map((bank, i) => {
              const badge = getStockBadge(bank.bloodAvailability, selectedGroup);
              return (
                <div
                  key={bank._id}
                  onClick={() => setSelectedBank(bank)}
                  className="card-anim group bg-[#141414] border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-red-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/50 transition-all duration-200"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="h-[3px] bg-gradient-to-r from-red-800 via-red-500 to-rose-400 opacity-60 group-hover:opacity-100 transition-opacity" />

                  <div className="px-5 pt-4 pb-3 border-b border-zinc-800/80">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-[15px] font-bold leading-snug text-white group-hover:text-red-100 transition-colors">
                          {bank.name}
                        </h3>
                        <p className="mt-1 text-zinc-500 text-xs">📍 {bank.city}, {bank.state}</p>
                      </div>
                      <div
                        className="ml-3 flex-shrink-0 px-2.5 py-1 rounded-lg border text-[11px] font-bold"
                        style={{ color: badge.color, background: badge.bg, borderColor: badge.border }}
                      >
                        {badge.label}
                      </div>
                    </div>

                    <div className="flex gap-4 flex-wrap mt-2">
                      {bank.contact?.phone && (
                        <span className="text-zinc-500 text-xs">📞 {bank.contact.phone}</span>
                      )}
                      <span className="text-zinc-500 text-xs">
                        🕐 {bank.isOpen247 ? "Open 24/7" : "Check timings"}
                      </span>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-[#111]/60">
                    <p className="text-zinc-700 text-[10px] font-bold tracking-widest mb-2">BLOOD STOCK</p>
                    {bank.bloodAvailability?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {bank.bloodAvailability.map((s) => (
                          <div
                            key={s.group}
                            className="px-2.5 py-1 rounded-md text-[11px] font-semibold border"
                            style={{
                              background: s.unitsAvailable > 0 ? "#0a1a0a" : "#1a0a0a",
                              borderColor: s.unitsAvailable > 0 ? "#1a3a1a" : "#3a1a1a",
                              color: s.unitsAvailable > 0 ? "#4caf50" : "#f44336",
                            }}
                          >
                            {s.group} {s.unitsAvailable > 0 ? `· ${s.unitsAvailable}u` : "· ✗"}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-700 text-xs">No stock data available</p>
                    )}
                  </div>

                  <div className="px-5 py-2.5 border-t border-zinc-800/80 flex justify-between items-center">
                    <span className="text-zinc-600 text-[11px]">🏢 {bank.organizationType}</span>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        color: bank.isOpen247 ? "#00e676" : "#ffaa00",
                        background: bank.isOpen247 ? "rgba(0,230,118,0.08)" : "rgba(255,170,0,0.08)",
                      }}
                    >
                      {bank.isOpen247 ? "● 24/7" : "● Limited Hours"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedBank && (
        <div
          onClick={() => setSelectedBank(null)}
          className="fixed inset-0 bg-black/85 z-50 flex items-end justify-center backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#141414] border border-zinc-800 rounded-t-3xl w-full max-w-xl px-7 pt-2 pb-7 max-h-[88vh] overflow-y-auto"
          >
            <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mt-3 mb-5" />
            <div className="h-[3px] bg-gradient-to-r from-red-800 via-red-500 to-rose-400 rounded-full mb-5" />

            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedBank.name}</h2>
                <p className="text-zinc-500 mt-1 text-xs">
                  📍 {selectedBank.street && `${selectedBank.street}, `}
                  {selectedBank.city}, {selectedBank.state}
                  {selectedBank.zipCode && ` - ${selectedBank.zipCode}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedBank(null)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {[
                { label: "Phone", value: selectedBank.contact?.phone || "N/A", icon: "📞" },
                { label: "Email", value: selectedBank.contact?.email || "N/A", icon: "📧" },
                { label: "Timings", value: selectedBank.isOpen247 ? "Open 24/7" : "Limited Hours", icon: "🕐" },
                { label: "Org Type", value: selectedBank.organizationType || "N/A", icon: "🏢" },
                { label: "License", value: selectedBank.registrationDetails?.licenseNumber || "N/A", icon: "📋" },
                { label: "Emergency", value: selectedBank.contact?.emergencyContact || "N/A", icon: "🚨" },
              ].map((item) => (
                <div key={item.label} className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3">
                  <p className="text-zinc-600 text-[10px] font-bold tracking-widest mb-1">{item.label.toUpperCase()}</p>
                  <p className="text-white text-[13px] font-semibold break-words">{item.icon} {item.value}</p>
                </div>
              ))}
            </div>

            {selectedBank.bloodAvailability?.length > 0 && (
              <>
                <p className="text-zinc-600 text-[10px] font-bold tracking-widest mb-3">FULL BLOOD STOCK</p>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {selectedBank.bloodAvailability.map((s) => (
                    <div
                      key={s.group}
                      className="rounded-xl py-3 text-center border"
                      style={{
                        background: s.unitsAvailable > 0 ? "#0a1a0a" : "#1a0a0a",
                        borderColor: s.unitsAvailable > 0 ? "#2a4a2a" : "#4a2a2a",
                      }}
                    >
                      <p className="font-bold text-base m-0" style={{ color: s.unitsAvailable > 0 ? "#4caf50" : "#f44336" }}>
                        {s.group}
                      </p>
                      <p className="text-[11px] text-zinc-600 mt-1">
                        {s.unitsAvailable > 0 ? `${s.unitsAvailable} units` : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setSelectedBank(null); navigate("/donateBlood"); }}
                className="flex-1 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white py-3.5 rounded-xl font-bold text-[15px] transition-all shadow-lg shadow-red-950/50"
              >
                🩸 Register to Donate
              </button>
              {selectedBank.contact?.phone && (
                <a
                  href={`tel:${selectedBank.contact.phone}`}
                  className="bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white px-5 py-3.5 rounded-xl font-semibold no-underline flex items-center gap-2 text-sm transition-all"
                >
                  📞 Call
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}