import { useState, useEffect, useRef } from "react";
import axios from "axios";
import axiosInstance from "../../config/axiosInstance";

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const DISTANCES = [2, 5, 10, 20, 50];

const mockBanks = [
  { _id: "1", name: "City Blood Bank", address: "MP Nagar, Bhopal", phone: "0755-1234567", distance: 1.2, status: "approved", stock: [{ bloodGroup: "A+", unitsAvailable: 12 }, { bloodGroup: "B+", unitsAvailable: 0 }, { bloodGroup: "O+", unitsAvailable: 5 }], timing: "24/7", rating: 4.8 },
  { _id: "2", name: "Red Cross Center", address: "Arera Colony, Bhopal", phone: "0755-9876543", distance: 3.4, status: "approved", stock: [{ bloodGroup: "AB+", unitsAvailable: 8 }, { bloodGroup: "O-", unitsAvailable: 3 }, { bloodGroup: "A-", unitsAvailable: 0 }], timing: "8AM - 10PM", rating: 4.5 },
  { _id: "3", name: "Hamidia Hospital Bank", address: "Royal Market, Bhopal", phone: "0755-4561230", distance: 5.1, status: "approved", stock: [{ bloodGroup: "B-", unitsAvailable: 6 }, { bloodGroup: "O+", unitsAvailable: 14 }, { bloodGroup: "A+", unitsAvailable: 2 }], timing: "24/7", rating: 4.2 },
  { _id: "4", name: "Apollo Blood Center", address: "Kolar Road, Bhopal", phone: "0755-3219870", distance: 8.7, status: "approved", stock: [{ bloodGroup: "AB-", unitsAvailable: 0 }, { bloodGroup: "B+", unitsAvailable: 9 }, { bloodGroup: "O-", unitsAvailable: 1 }], timing: "9AM - 9PM", rating: 4.6 },
  { _id: "5", name: "Sainath Blood Bank", address: "TT Nagar, Bhopal", phone: "0755-6543210", distance: 11.3, status: "approved", stock: [{ bloodGroup: "A+", unitsAvailable: 20 }, { bloodGroup: "AB+", unitsAvailable: 5 }, { bloodGroup: "B-", unitsAvailable: 0 }], timing: "24/7", rating: 4.0 },
];

export default function BloodBanks() {
  const [banks, setBanks] = useState(mockBanks);
  const [filtered, setFiltered] = useState(mockBanks);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedDistance, setSelectedDistance] = useState(50);
  const [locating, setLocating] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [sortBy, setSortBy] = useState("distance");
  const searchRef = useRef();

  useEffect(() => {
    let result = [...banks];
    if (search) result = result.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.address.toLowerCase().includes(search.toLowerCase()));
    if (selectedGroup !== "All") result = result.filter(b => b.stock.some(s => s.bloodGroup === selectedGroup && s.unitsAvailable > 0));
    result = result.filter(b => b.distance <= selectedDistance);
    if (sortBy === "distance") result.sort((a, b) => a.distance - b.distance);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "stock") result.sort((a, b) => b.stock.reduce((s, x) => s + x.unitsAvailable, 0) - a.stock.reduce((s, x) => s + x.unitsAvailable, 0));
    setFiltered(result);
  }, [search, selectedGroup, selectedDistance, banks, sortBy]);

  const detectLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await axiosInstance.get(`/bloodbanks/nearby?latitude=${latitude}&longitude=${longitude}&radius=${selectedDistance}`, { withCredentials: true });
          if (res.data?.bloodBanks?.length) setBanks(res.data.bloodBanks);
        } catch {
          // fallback to mock
        }
        setLocationGranted(true);
        setLocating(false);
      },
      () => { setLocating(false); }
    );
  };

  const getStockBadge = (stock, group) => {
    if (group === "All") {
      const total = stock.reduce((s, x) => s + x.unitsAvailable, 0);
      if (total === 0) return { label: "No Stock", color: "#ff4444", bg: "#2a1010" };
      if (total < 5) return { label: "Low Stock", color: "#ffaa00", bg: "#2a1f00" };
      return { label: "Available", color: "#00e676", bg: "#0a2a15" };
    }
    const found = stock.find(s => s.bloodGroup === group);
    if (!found || found.unitsAvailable === 0) return { label: "Unavailable", color: "#ff4444", bg: "#2a1010" };
    if (found.unitsAvailable < 3) return { label: `${found.unitsAvailable} units`, color: "#ffaa00", bg: "#2a1f00" };
    return { label: `${found.unitsAvailable} units`, color: "#00e676", bg: "#0a2a15" };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet" />

      {/* Hero Header */}
      <div style={{ background: "linear-gradient(135deg, #1a0000 0%, #0d0d0d 60%)", borderBottom: "1px solid #2a0000", padding: "32px 24px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: "#e31c25", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🩸</div>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: 2, color: "#e31c25" }}>BLOOD ASSISTANT</span>
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: "clamp(36px, 6vw, 64px)", letterSpacing: 3, margin: "0 0 4px", lineHeight: 1 }}>
            FIND BLOOD BANKS <span style={{ color: "#e31c25" }}>NEARBY</span>
          </h1>
          <p style={{ color: "#888", fontSize: 14, margin: "0 0 28px" }}>Real-time availability · Verified centers · Instant location detection</p>

          {/* Search Bar — BookMyShow style */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingBottom: 24 }}>
            <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, opacity: 0.5 }}>🔍</span>
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search blood banks or area..."
                style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", borderRadius: 10, padding: "13px 16px 13px 44px", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box", transition: "border .2s" }}
                onFocus={e => e.target.style.borderColor = "#e31c25"}
                onBlur={e => e.target.style.borderColor = "#333"}
              />
            </div>
            <button
              onClick={detectLocation}
              disabled={locating}
              style={{ background: locationGranted ? "#0a2a15" : "#e31c25", border: locationGranted ? "1px solid #00e676" : "none", color: locationGranted ? "#00e676" : "#fff", borderRadius: 10, padding: "13px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", transition: "all .2s" }}
            >
              {locating ? "📡 Detecting..." : locationGranted ? "✓ Location Active" : "📍 Use My Location"}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Strip — BookMyShow horizontal scroll */}
      <div style={{ background: "#111", borderBottom: "1px solid #222", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Blood Group Filter */}
          <div style={{ overflowX: "auto", display: "flex", gap: 8, padding: "14px 0", scrollbarWidth: "none" }}>
            {BLOOD_GROUPS.map(g => (
              <button
                key={g}
                onClick={() => setSelectedGroup(g)}
                style={{
                  flexShrink: 0,
                  padding: "7px 18px",
                  borderRadius: 20,
                  border: selectedGroup === g ? "none" : "1px solid #333",
                  background: selectedGroup === g ? "#e31c25" : "transparent",
                  color: selectedGroup === g ? "#fff" : "#aaa",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all .15s",
                  fontFamily: "'DM Sans'",
                }}
              >
                {g === "All" ? "All Groups" : `🩸 ${g}`}
              </button>
            ))}
          </div>

          {/* Distance + Sort */}
          <div style={{ display: "flex", gap: 16, padding: "10px 0 14px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ color: "#555", fontSize: 13, fontWeight: 500 }}>WITHIN</span>
            <div style={{ display: "flex", gap: 6 }}>
              {DISTANCES.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDistance(d)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 6,
                    border: selectedDistance === d ? "1px solid #e31c25" : "1px solid #2a2a2a",
                    background: selectedDistance === d ? "#1a0000" : "transparent",
                    color: selectedDistance === d ? "#e31c25" : "#666",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  {d} km
                </button>
              ))}
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ color: "#555", fontSize: 12 }}>SORT</span>
              {["distance", "rating", "stock"].map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 6,
                    border: sortBy === s ? "1px solid #444" : "1px solid #222",
                    background: sortBy === s ? "#222" : "transparent",
                    color: sortBy === s ? "#fff" : "#555",
                    fontSize: 12,
                    cursor: "pointer",
                    textTransform: "capitalize",
                    transition: "all .15s",
                  }}
                >
                  {s === "distance" ? "📍 Nearest" : s === "rating" ? "⭐ Rating" : "🩸 Stock"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ color: "#666", fontSize: 13 }}>
            <span style={{ color: "#fff", fontWeight: 600 }}>{filtered.length}</span> blood banks found
            {selectedGroup !== "All" && <span> · <span style={{ color: "#e31c25" }}>{selectedGroup}</span> available</span>}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🩸</div>
            <p style={{ color: "#555", fontSize: 16 }}>No blood banks found matching your filters</p>
            <button onClick={() => { setSelectedGroup("All"); setSearch(""); setSelectedDistance(50); }} style={{ marginTop: 16, background: "#e31c25", border: "none", color: "#fff", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {filtered.map((bank, i) => {
              const badge = getStockBadge(bank.stock, selectedGroup);
              return (
                <div
                  key={bank._id}
                  onClick={() => setSelectedBank(bank)}
                  style={{
                    background: "#141414",
                    border: "1px solid #222",
                    borderRadius: 14,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all .2s",
                    animation: `fadeUp .3s ease ${i * 0.05}s both`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.border = "1px solid #e31c25"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.border = "1px solid #222"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {/* Card Top */}
                  <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid #1e1e1e" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{bank.name}</h3>
                        <p style={{ margin: "4px 0 0", color: "#666", fontSize: 12 }}>📍 {bank.address}</p>
                      </div>
                      <div style={{ background: badge.bg, border: `1px solid ${badge.color}`, borderRadius: 6, padding: "4px 10px", marginLeft: 10, flexShrink: 0 }}>
                        <span style={{ color: badge.color, fontSize: 11, fontWeight: 700 }}>{badge.label}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                      <span style={{ color: "#888", fontSize: 12 }}>📞 {bank.phone}</span>
                      <span style={{ color: "#888", fontSize: 12 }}>🕐 {bank.timing}</span>
                    </div>
                  </div>

                  {/* Stock chips */}
                  <div style={{ padding: "12px 18px 14px" }}>
                    <p style={{ color: "#444", fontSize: 11, fontWeight: 600, margin: "0 0 8px", letterSpacing: 1 }}>BLOOD STOCK</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {bank.stock.map(s => (
                        <div
                          key={s.bloodGroup}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 6,
                            background: s.unitsAvailable > 0 ? "#0a1a0a" : "#1a0a0a",
                            border: `1px solid ${s.unitsAvailable > 0 ? "#1a3a1a" : "#3a1a1a"}`,
                            fontSize: 11,
                            fontWeight: 600,
                            color: s.unitsAvailable > 0 ? "#4caf50" : "#f44336",
                          }}
                        >
                          {s.bloodGroup} {s.unitsAvailable > 0 ? `· ${s.unitsAvailable}u` : "· ✗"}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ padding: "10px 18px", borderTop: "1px solid #1e1e1e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#e31c25", fontSize: 13 }}>📍</span>
                      <span style={{ color: "#666", fontSize: 12 }}>{bank.distance} km away</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: "#ffd700", fontSize: 12 }}>★</span>
                      <span style={{ color: "#aaa", fontSize: 12, fontWeight: 600 }}>{bank.rating}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedBank && (
        <div
          onClick={() => setSelectedBank(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(4px)" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 640, padding: 28, maxHeight: "85vh", overflowY: "auto" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{selectedBank.name}</h2>
                <p style={{ color: "#666", margin: "4px 0 0", fontSize: 13 }}>📍 {selectedBank.address}</p>
              </div>
              <button onClick={() => setSelectedBank(null)} style={{ background: "#222", border: "none", color: "#fff", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Distance", value: `${selectedBank.distance} km` },
                { label: "Rating", value: `★ ${selectedBank.rating}` },
                { label: "Timing", value: selectedBank.timing },
                { label: "Phone", value: selectedBank.phone },
              ].map(item => (
                <div key={item.label} style={{ background: "#1a1a1a", borderRadius: 10, padding: "12px 16px" }}>
                  <p style={{ color: "#555", fontSize: 11, margin: "0 0 4px", fontWeight: 600, letterSpacing: 1 }}>{item.label.toUpperCase()}</p>
                  <p style={{ color: "#fff", fontSize: 14, margin: 0, fontWeight: 600 }}>{item.value}</p>
                </div>
              ))}
            </div>

            <p style={{ color: "#555", fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>FULL BLOOD STOCK</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
              {selectedBank.stock.map(s => (
                <div key={s.bloodGroup} style={{ background: s.unitsAvailable > 0 ? "#0a1a0a" : "#1a0a0a", border: `1px solid ${s.unitsAvailable > 0 ? "#2a4a2a" : "#4a2a2a"}`, borderRadius: 10, padding: "12px 8px", textAlign: "center" }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: s.unitsAvailable > 0 ? "#4caf50" : "#f44336" }}>{s.bloodGroup}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#666" }}>{s.unitsAvailable > 0 ? `${s.unitsAvailable} units` : "Not available"}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ flex: 1, background: "#e31c25", border: "none", color: "#fff", padding: "14px", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                🩸 Register to Donate
              </button>
              <button style={{ background: "#1a1a1a", border: "1px solid #333", color: "#fff", padding: "14px 20px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>
                📞 Call
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}