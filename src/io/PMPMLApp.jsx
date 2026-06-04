import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const BusIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78A2.99 2.99 0 0020 16V6c0-3.5-3.58-4-8-4S4 2.5 4 6v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z"/>
  </svg>
);

const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "#111" : "#888"} width="24" height="24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

const BusesIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "#111" : "#888"} width="24" height="24">
    <path d="M12 2C8.13 2 4 2.5 4 6v10c0 1.1.45 2.1 1.17 2.83L4 20v1h1l1.5-1.5h11L19 21h1v-1l-1.17-1.17C19.55 18.1 20 17.1 20 16V6c0-3.5-4.13-4-8-4zm0 2c3.87 0 6 .5 6 2H6c0-1.5 2.13-2 6-2zm-4.5 12a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 11V8h12v3H6z"/>
  </svg>
);

const HelpIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "#111" : "#888"} width="24" height="24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="#888" width="20" height="20">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="#111" width="24" height="24">
    <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
  </svg>
);

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="#fff" width="26" height="26">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);

// Primary card icons  — match Expo emoji style with SVG equivalents
const TicketSVG = () => (
  <svg viewBox="0 0 24 24" fill="#111111" width="34" height="34">
    <path d="M22 10V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 000 4v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 000-4zm-2 5H4v-1.27l8-3.73 8 3.73V15zM4 9V6.73L12 3l8 3.73V9H4z"/>
  </svg>
);

const PassSVG = () => (
  <svg viewBox="0 0 24 24" fill="#111111" width="34" height="34">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

// Mini card icons — #f5a623 for ticket, black for route
const ViewTicketSVG = () => (
  <svg viewBox="0 0 24 24" fill="#f5a623" width="26" height="26">
    <path d="M22 10V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 000 4v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 000-4zm-2 5H4v-1.27l8-3.73 8 3.73V15zM4 9V6.73L12 3l8 3.73V9H4z"/>
  </svg>
);

const RouteSVG = () => (
  <svg viewBox="0 0 24 24" fill="#111111" width="26" height="26">
    <path d="M9.5 15.5L7 13l-4 4 4 4 2.5-2.5L7 16l2.5-2.5zm5-7L17 11l4-4-4-4-2.5 2.5L17 8l-2.5 2.5zM3 8h18v2H3zm0 8h18v2H3z"/>
  </svg>
);

const MetroIconMini = () => (
  <div style={{
    width: 36, height: 36,
    borderRadius: 10,
    overflow: "hidden",
    background: "linear-gradient(135deg,#ff8c00,#ff5c00)",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 1,
  }}>
    {/* Simplified metro ring */}
    <div style={{
      width: 20, height: 20, borderRadius: "50%",
      border: "3px solid #fff",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ fontSize: 7, fontWeight: 900, color: "#fff" }}>M</span>
    </div>
    <span style={{ fontSize: 5, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>PUNE</span>
  </div>
);

const NavArrowIcon = () => (
  <div style={{
    background: "#e53935", borderRadius: 8,
    width: 30, height: 30,
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <svg viewBox="0 0 24 24" fill="#fff" width="18" height="18">
      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
    </svg>
  </div>
);

// ─── Map ──────────────────────────────────────────────────────────────────────

const MapView = () => (
  <div style={{ width: "100%", height: 220, background: "#e8ecef", position: "relative", overflow: "hidden" }}>
    <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
      <line x1="0" y1="180" x2="100%" y2="80" stroke="#fff" strokeWidth="9"/>
      <line x1="0" y1="180" x2="100%" y2="80" stroke="#d8dde3" strokeWidth="7"/>
      <line x1="0" y1="130" x2="100%" y2="130" stroke="#fff" strokeWidth="7"/>
      <line x1="0" y1="130" x2="100%" y2="130" stroke="#d8dde3" strokeWidth="5"/>
      <line x1="50" y1="0" x2="28" y2="220" stroke="#fff" strokeWidth="6"/>
      <line x1="50" y1="0" x2="28" y2="220" stroke="#d8dde3" strokeWidth="4"/>
      <line x1="200" y1="0" x2="420" y2="60" stroke="#fff" strokeWidth="5"/>
      <line x1="200" y1="0" x2="420" y2="60" stroke="#d8dde3" strokeWidth="4"/>
    </svg>

    {/* Place labels */}
    <div style={{ position:"absolute", top:18, right:58, fontSize:11, color:"#444", fontWeight:600 }}>McDonald's</div>
    <div style={{ position:"absolute", top:30, right:56, fontSize:9,  color:"#777" }}>मॅकडोनाल्ड्स</div>
    <div style={{ position:"absolute", top:14, right:8,  fontSize:10, color:"#888" }}>Bakori Rd</div>
    <div style={{ position:"absolute", top:54, right:26, fontSize:11, color:"#3473c4", fontWeight:600 }}>Lifeline Hospital</div>
    <div style={{ position:"absolute", top:66, right:24, fontSize:9,  color:"#777" }}>लाईफलाईन रुग्णालय</div>
    <div style={{ position:"absolute", top:102, left:"39%", fontSize:12, color:"#3473c4", fontWeight:700 }}>W</div>
    <div style={{ position:"absolute", top:116, left:"36%", fontSize:10, color:"#777" }}>वाघोळि</div>
    <div style={{ position:"absolute", bottom:26, left:52, fontSize:11, color:"#3473c4", fontWeight:600 }}>Barclays LTS Campus</div>
    <div style={{ position:"absolute", bottom:13, left:52, fontSize:9,  color:"#777" }}>बार्कलेस एलटीएस कॅम्पस</div>
    <div style={{ position:"absolute", left:6, top:"48%", fontSize:9, color:"#777", transform:"rotate(-90deg) translateX(-28px)", transformOrigin:"left center" }}>Grant Rd</div>

    {/* Bus markers */}
    <div style={{ position:"absolute", top:88, left:86, background:"#2e7d32", color:"#fff", fontSize:11, fontWeight:700, padding:"2px 7px", borderRadius:3, boxShadow:"0 1px 3px rgba(0,0,0,0.25)" }}>159</div>
    <div style={{ position:"absolute", top:70, left:"41%", background:"#fff", color:"#222", fontSize:11, fontWeight:600, padding:"2px 6px", border:"1.5px dashed #666", borderRadius:2 }}>346</div>
    <div style={{ position:"absolute", top:70, left:"55%", background:"#fff", color:"#222", fontSize:11, fontWeight:600, padding:"2px 6px", border:"1.5px dashed #666", borderRadius:2 }}>346</div>

    {/* Road badge */}
    <div style={{ position:"absolute", top:112, left:72, background:"#c8960a", color:"#fff", fontSize:9, fontWeight:700, padding:"1px 4px", borderRadius:2 }}>753F</div>

    {/* Location dot */}
    <div style={{ position:"absolute", top:116, left:"46%", width:14, height:14, background:"#1565c0", borderRadius:"50%", border:"3px solid #fff", boxShadow:"0 0 0 4px rgba(21,101,192,0.18)" }}/>

    {/* Hospital H */}
    <div style={{ position:"absolute", top:56, right:92, width:18, height:18, background:"#1565c0", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:10, fontWeight:800 }}>H</div>

    {/* Fork pin */}
    <div style={{ position:"absolute", top:16, right:97, width:22, height:22, background:"#9e9e9e", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11 }}>🍴</div>

    {/* Google */}
    <div style={{ position:"absolute", bottom:5, left:5, fontSize:9, color:"#777", display:"flex", alignItems:"center", gap:2 }}>
      <div style={{ width:13, height:13, borderRadius:"50%", background:"#ddd", display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, color:"#666" }}>©</div>
      Google
    </div>

    {/* Tale label (partial, right edge) */}
    <div style={{ position:"absolute", bottom:28, right:2, fontSize:11, color:"#3473c4", fontWeight:600 }}>Tale</div>
    <div style={{ position:"absolute", bottom:14, right:2, fontSize:9, color:"#777" }}>तवे</div>
  </div>
);

// ─── Share illustration ────────────────────────────────────────────────────────

const ShareIllustration = () => (
  <div style={{ display:"flex", alignItems:"flex-end", gap:2 }}>
    {/* Person 1 – yellow hoodie */}
    <div style={{ position:"relative", width:56, height:88 }}>
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:18, height:18, borderRadius:"50%", background:"#3d2b1f" }}/>
      <div style={{ position:"absolute", top:16, left:"50%", transform:"translateX(-50%)", width:28, height:34, borderRadius:"6px 6px 4px 4px", background:"#f5c518" }}/>
      <div style={{ position:"absolute", top:20, left:3, width:11, height:20, borderRadius:6, background:"#f5c518", transform:"rotate(18deg)" }}/>
      <div style={{ position:"absolute", top:20, right:3, width:11, height:20, borderRadius:6, background:"#f5c518", transform:"rotate(-18deg)" }}/>
      <div style={{ position:"absolute", top:48, left:"28%", width:11, height:28, borderRadius:4, background:"#2a1a0e" }}/>
      <div style={{ position:"absolute", top:48, left:"52%", width:11, height:28, borderRadius:4, background:"#2a1a0e" }}/>
      <div style={{ position:"absolute", top:26, right:-3, width:9, height:13, borderRadius:2, background:"#222" }}/>
    </div>
    {/* Person 2 – orange top */}
    <div style={{ position:"relative", width:56, height:88, marginLeft:-6 }}>
      <div style={{ position:"absolute", top:-5, left:"54%", width:10, height:10, borderRadius:"50%", background:"#2a1a0e" }}/>
      <div style={{ position:"absolute", top:2, left:"44%", transform:"translateX(-50%)", width:17, height:17, borderRadius:"50%", background:"#d4956a" }}/>
      <div style={{ position:"absolute", top:17, left:"50%", transform:"translateX(-50%)", width:26, height:34, borderRadius:"6px 6px 4px 4px", background:"#e8631a" }}/>
      <div style={{ position:"absolute", top:21, left:5, width:10, height:19, borderRadius:6, background:"#e8631a", transform:"rotate(14deg)" }}/>
      <div style={{ position:"absolute", top:21, right:3, width:10, height:19, borderRadius:6, background:"#e8631a", transform:"rotate(-14deg)" }}/>
      <div style={{ position:"absolute", top:49, left:"28%", width:10, height:27, borderRadius:4, background:"#1a1a2e" }}/>
      <div style={{ position:"absolute", top:49, left:"52%", width:10, height:27, borderRadius:4, background:"#1a1a2e" }}/>
      <div style={{ position:"absolute", top:29, left:-1, width:9, height:13, borderRadius:2, background:"#222" }}/>
    </div>
  </div>
);

// ─── Data (mirrors Expo primaryCards / secondaryCards) ─────────────────────────

const primaryCards = [
  { label: "Bus Ticket",  icon: <TicketSVG /> },
  { label: "Daily Pass",  icon: <PassSVG />   },
];

const secondaryCards = [
  { label: "View\nTicket",    icon: <ViewTicketSVG /> },
  { label: "View\nPass",      icon: <ViewTicketSVG /> },
  { label: "Route Ti\nmetable", icon: <RouteSVG />    },
  { label: "Metro\nTicket",   icon: <MetroIconMini /> },
];

// ─── Sub-components (mirrors Expo ActionCard / MiniActionCard) ─────────────────

function ActionCard({ icon, label, onPress }) {
  return (
    <button
      onClick={onPress}
      style={{
        flex: 1,
        background: "#D8EEFF",           // actionCard.backgroundColor
        borderRadius: 14,                // actionCard.borderRadius
        padding: "22px 16px 14px",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 10,
        cursor: "pointer",
        border: "none",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)", // elevation:2
      }}
    >
      {icon}
      <span style={{ fontSize: 15, lineHeight: "20px", textAlign: "center", color: "#111111" }}>
        {label}
      </span>
    </button>
  );
}

function MiniActionCard({ icon, label, onPress }) {
  return (
    <button
      onClick={onPress}
      style={{
        width: "22%",
        minWidth: 78,                    // miniGroup.minWidth
        background: "#D8EEFF",           // miniCard.backgroundColor
        borderRadius: 12,               // miniCard.borderRadius
        padding: "13px 6px 10px",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 8,
        cursor: onPress ? "pointer" : "default",
        border: "none",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      {icon}
      <span style={{
        fontSize: 13, lineHeight: "16px",  // miniLabel
        textAlign: "center",
        color: "#111111",
        whiteSpace: "pre-line",
      }}>
        {label}
      </span>
    </button>
  );
}

// ─── Header (mirrors Expo Header component) ────────────────────────────────────

function Header() {
  return (
    <div style={{
      background: "#fff",
      padding: "12px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #eee",
    }}>
      {/* PMPML logo */}
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        border: "1.5px solid #ccc",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#fff", overflow: "hidden",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 6, fontWeight: 900, color: "#c62828", letterSpacing: 0.3 }}>PMPML</div>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "radial-gradient(circle,#ef5350 30%,#b71c1c 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "1px auto", color: "#fff",
          }}>
            <BusIcon />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <BellIcon />
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "#333",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <PersonIcon />
        </div>
      </div>
    </div>
  );
}

// ─── SearchBar (mirrors Expo SearchBar) ───────────────────────────────────────

function SearchBar() {
  return (
    <div style={{ padding: "0" }}>
      <div style={{
        background: "#ebebeb",
        borderRadius: 30,
        padding: "13px 18px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <SearchIcon />
        <span style={{ color: "#888", fontSize: 15 }}>कुठे जायचे आहे?</span>
      </div>
    </div>
  );
}

// ─── NearMe (mirrors Expo NearMe) ─────────────────────────────────────────────

function NearMe() {
  return (
    <div>
      {/* Section title row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#111111" }}>Near Me</span>
        <span style={{ fontSize: 13, color: "#111111", fontWeight: 500, textDecoration: "underline", cursor: "pointer" }}>Show all</span>
      </div>

      {/* Fetching card */}
      <div style={{
        background: "#e0e0e0",
        borderRadius: 10,
        padding: "14px 16px",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 8 }}>
          <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#222",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
            }}>
              <BusIcon />
            </div>
            <span style={{ fontSize: 15, fontWeight: 500, color: "#333" }}>Fetching...</span>
          </div>
          <NavArrowIcon />
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 14, color: "#555", cursor: "pointer" }}>See More Buses</span>
        </div>
      </div>
    </div>
  );
}

// ─── NearbyMap (mirrors Expo NearbyMap) ───────────────────────────────────────

function NearbyMap() {
  return (
    <div>
      <span style={{ fontSize: 18, fontWeight: 700, color: "#111111", display: "block", marginBottom: 8 }}>Nearby</span>
      <div style={{
        background: "#fff", borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}>
        <MapView />
      </div>
    </div>
  );
}

// ─── ShareCard (mirrors Expo ShareCard) ───────────────────────────────────────

function ShareCard() {
  return (
    <div style={{
      background: "#fce4ec",
      borderRadius: 12,
      padding: "18px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <div>
        <p style={{ fontSize: 15, color: "#222", margin: "0 0 4px", lineHeight: 1.55 }}>
          Apli PMPML चा आनंद घेत<br />आहात 😍?<br />
          तुमच्या मित्रांसोबत शेअर करा
        </p>
        <button style={{
          marginTop: 12, background: "#fff",
          border: "1px solid #ddd", borderRadius: 6,
          padding: "10px 18px", fontSize: 13,
          color: "#3bbfbf", fontWeight: 600, cursor: "pointer",
        }}>
          आता शेअर करा
        </button>
      </div>
      <ShareIllustration />
    </div>
  );
}

// ─── BottomNav (mirrors Expo BottomNav) ───────────────────────────────────────

function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "home",  label: "Home",  Icon: HomeIcon  },
    { id: "buses", label: "Buses", Icon: BusesIcon },
    { id: "help",  label: "Help",  Icon: HelpIcon  },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 390,
      background: "#fff",
      borderTop: "1px solid #e0e0e0",
      display: "flex", justifyContent: "space-around",
      padding: "10px 0 16px",
      zIndex: 100,
    }}>
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            padding: "0 22px",
          }}
        >
          <Icon active={activeTab === id} />
          <span style={{
            fontSize: 11,
            color: activeTab === id ? "#111111" : "#888",
            fontWeight: activeTab === id ? 700 : 400,
          }}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── ThemedView (mirrors Expo ThemedView) ─────────────────────────────────────

function ThemedView({ children, style }) {
  return (
    <div style={{ background: "#FBF7F7", minHeight: "100vh", ...style }}>
      {children}
    </div>
  );
}

// ─── Home Screen (mirrors Expo HomeScreen) ────────────────────────────────────

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("home");

  // Mirrors router.push — no-op in web demo
  const handleRoute = (route) => {
    console.log("Navigate to:", route);
  };

  return (
    <ThemedView style={{ position: "relative" }}>
      <div style={{ maxWidth: 390, margin: "0 auto", position: "relative" }}>

        {/* ScrollView */}
        <div style={{
          overflowY: "auto",
          paddingLeft: 16,   // Spacing.four = 16
          paddingRight: 16,
          paddingBottom: 112, // content.paddingBottom
          display: "flex",
          flexDirection: "column",
          gap: 16,            // content.gap = Spacing.four
        }}>

          {/* <Header /> */}
          <Header />

          {/* <SearchBar /> */}
          <SearchBar />

          {/* primaryGrid */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 18,           // primaryGrid.gap
            marginTop: 8,      // Spacing.two = 8
          }}>
            {primaryCards.map((card) => (
              <ActionCard
                key={card.label}
                icon={card.icon}
                label={card.label}
                onPress={() => handleRoute(card.label)}
              />
            ))}
          </div>

          {/* secondaryGrid */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 16,           // secondaryGrid.gap
            marginTop: 8,
          }}>
            {secondaryCards.map((card) => (
              <MiniActionCard
                key={card.label}
                icon={card.icon}
                label={card.label}
                onPress={() => handleRoute(card.label)}
              />
            ))}
          </div>

          {/* <NearMe /> */}
          <NearMe />

          {/* <NearbyMap /> */}
          <NearbyMap />

          {/* <ShareCard /> */}
          <ShareCard />

          {/* poweredRow */}
          <div style={{
            display: "flex", flexDirection: "row",
            justifyContent: "center", alignItems: "center",
            gap: 6,
            paddingBottom: 18,  // poweredRow.paddingBottom
          }}>
            <span style={{ fontSize: 14, color: "#7C7C7C" }}>Powered by</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#305AA6" }}>Chartr</span>
            <span style={{ fontSize: 14, color: "#7C7C7C" }}>for PMPML.</span>
          </div>

        </div>

        {/* <BottomNav /> */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      </div>
    </ThemedView>
  );
}
