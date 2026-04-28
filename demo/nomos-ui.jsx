// Nomos Analytics — Shared UI Components + Tour

// ── ICONS ──
function Icon({ path, size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {path.split(' M').map((d, i) => (
        <path key={i} d={i === 0 ? d : 'M' + d} />
      ))}
    </svg>
  );
}

// ── SIDEBAR ──
function Sidebar({ screen, setScreen, persona, setPersona, showPersonaModal, setShowPersonaModal }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: "ledger", label: "Ledger", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { id: "profile", label: "Org Profile", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { id: "scenarios", label: "Scenarios", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { id: "intelligence", label: "Intelligence", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  ];

  const currentPersona = window.NOMOS.personas.find(p => p.id === persona) || window.NOMOS.personas[0];

  return (
    <div style={sidebarStyles.wrap}>
      <a href="/" style={{ ...sidebarStyles.logo, textDecoration: "none" }}>
        <span style={{ color: "var(--cream)", fontWeight: 700, fontSize: 13, letterSpacing: "0.15em" }}>NOMOS</span>
        <span style={{ color: "var(--red)" }}>.</span>
        <span style={{ color: "var(--cream-dim)", fontSize: 10, letterSpacing: "0.1em", marginLeft: 4 }}>ANALYTICS</span>
      </a>
      <div style={sidebarStyles.liveDot} className="live-indicator">
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4a9", display: "inline-block", marginRight: 6, animation: "pulse 2s infinite" }}></span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#4a9", letterSpacing: "0.12em" }}>LIVE DATA</span>
      </div>
      <nav style={sidebarStyles.nav}>
        {navItems.map(item => (
          <button
            key={item.id}
            data-nav={item.id}
            style={{
              ...sidebarStyles.navItem,
              ...(screen === item.id ? sidebarStyles.navItemActive : {}),
            }}
            onClick={() => setScreen(item.id)}
          >
            <Icon path={item.icon} size={15} color={screen === item.id ? "var(--red)" : "var(--cream-dim)"} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={sidebarStyles.bottom}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.15em", color: "#444", marginBottom: 10, textTransform: "uppercase" }}>Active Persona</div>
        <button style={sidebarStyles.personaBtn} onClick={() => setShowPersonaModal(true)}>
          <div>
            <div style={{ color: "var(--cream)", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{currentPersona.label}</div>
            <div style={{ color: "#555", fontSize: 10, fontFamily: "var(--mono)" }}>{currentPersona.sub}</div>
          </div>
          <Icon path="M8 9l4-4 4 4m0 6l-4 4-4-4" size={12} color="#555" />
        </button>
      </div>
    </div>
  );
}

const sidebarStyles = {
  wrap: { width: 220, background: "var(--bg-1)", borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh", position: "sticky", top: 0 },
  logo: { padding: "20px 20px 12px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", letterSpacing: "0.12em" },
  liveDot: { padding: "8px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center" },
  nav: { flex: 1, padding: "12px 0" },
  navItem: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.08em", color: "var(--cream-dim)", textAlign: "left", transition: "background 0.15s, color 0.15s" },
  navItemActive: { background: "rgba(232,52,26,0.08)", color: "var(--red)", borderLeft: "2px solid var(--red)" },
  bottom: { padding: "16px 20px", borderTop: "1px solid var(--line)" },
  personaBtn: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "var(--bg-2)", border: "1px solid var(--line-light)", padding: "10px 12px", cursor: "pointer", textAlign: "left" },
};

// ── TOPBAR ──
function TopBar({ screen, onExport, onTour, searchQuery, setSearchQuery, liveCounter }) {
  const titles = {
    dashboard: "Overview Dashboard",
    ledger: "Grant Ledger",
    profile: "Organization Profile — Innovation Works, Inc.",
    scenarios: "Scenario Modeling — Innovate PA 2.0",
    intelligence: "Nomos Intelligence",
  };
  return (
    <div style={topbarStyles.wrap}>
      <div style={topbarStyles.left}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.15em", color: "#444", textTransform: "uppercase" }}>
          Nomos /
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--cream-dim)", marginLeft: 8, textTransform: "uppercase" }}>
          {titles[screen]}
        </span>
      </div>
      <div style={topbarStyles.right}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#555", letterSpacing: "0.1em" }}>
          {liveCounter} orgs indexed
        </div>
        <button style={topbarStyles.btn} onClick={onTour}>
          <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={13} />
          <span>Tour</span>
        </button>
        <button style={{ ...topbarStyles.btn, color: "var(--cream-dim)" }} onClick={onExport}>
          <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" size={13} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}

const topbarStyles = {
  wrap: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 48, borderBottom: "1px solid var(--line)", background: "var(--bg-1)", flexShrink: 0 },
  left: { display: "flex", alignItems: "center", gap: 4 },
  right: { display: "flex", alignItems: "center", gap: 20 },
  btn: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", color: "#555", padding: "4px 8px", transition: "color 0.15s" },
};

// ── PERSONA MODAL ──
function PersonaModal({ persona, setPersona, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line-light)", width: 480, padding: 40 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--red)", marginBottom: 8, textTransform: "uppercase" }}>Select Persona</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "var(--cream)", marginBottom: 8 }}>Who are you today?</div>
        <div style={{ fontSize: 14, color: "#555", marginBottom: 28 }}>The interface adapts to surface the most relevant data for your role.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {window.NOMOS.personas.map(p => (
            <button key={p.id} onClick={() => { setPersona(p.id); onClose(); }}
              style={{ display: "flex", alignItems: "center", gap: 16, background: persona === p.id ? "rgba(232,52,26,0.1)" : "var(--bg-2)", border: persona === p.id ? "1px solid var(--red)" : "1px solid var(--line)", padding: "14px 18px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
              <div style={{ width: 36, height: 36, border: "1px solid var(--line-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon path={p.icon} size={16} color={persona === p.id ? "var(--red)" : "var(--cream-dim)"} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: persona === p.id ? "var(--cream)" : "var(--cream-dim)", fontSize: 14, marginBottom: 2 }}>{p.label}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#555", letterSpacing: "0.1em" }}>{p.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TOUR ──
const TOUR_STEPS = [
  { target: null, title: "Welcome to Nomos Analytics", body: "This guided tour walks through the platform's core capabilities. We'll start with the Dashboard and move through each screen. Click Next to begin.", wide: true },
  { target: "[data-nav='dashboard']", title: "Dashboard — Live Overview", body: "The Dashboard shows real-time anomaly alerts, DCR scores across your tracked organizations, and a live feed of flagged intermediaries." },
  { target: "[data-nav='ledger']", title: "The Ledger", body: "Every intermediary, sortable by DCR score, state, disbursement rate, and risk level. Filter by state or flag type. Click any row for a full forensic profile." },
  { target: "[data-nav='profile']", title: "Organization Profile", body: "Deep-dive forensic analysis for any organization: financials, DCR breakdown, audit flags, and year-over-year trends. Exportable as a policy brief." },
  { target: "[data-nav='scenarios']", title: "Scenario Modeling", body: "Before any appropriation vote, model the alternatives. Compare outcomes, disbursement projections, and political feasibility side-by-side." },
  { target: "[data-nav='intelligence']", title: "Nomos Intelligence — AI Layer", body: "Ask anything about the grant ecosystem in plain language. The AI synthesizes across all 50 states to surface patterns invisible to manual review.", last: true },
];

function TourOverlay({ step, setStep, onClose }) {
  const s = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", pointerEvents: "auto" }} onClick={onClose} />
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", background: "var(--bg-1)", border: "1px solid var(--line-light)", padding: "28px 32px", width: s.wide ? 520 : 440, pointerEvents: "auto", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.2em", color: "var(--red)", marginBottom: 6, textTransform: "uppercase" }}>Step {step + 1} of {TOUR_STEPS.length}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--cream)" }}>{s.title}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", padding: 4 }}>
            <Icon path="M6 18L18 6M6 6l12 12" size={16} />
          </button>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--cream-dim)", marginBottom: 24 }}>{s.body}</p>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", background: "none", border: "1px solid var(--line-light)", color: "var(--cream-dim)", padding: "8px 16px", cursor: "pointer" }}>← Back</button>
          )}
          <button onClick={() => isLast ? onClose() : setStep(s => s + 1)}
            style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", background: "var(--red)", border: "none", color: "var(--bg)", padding: "8px 20px", cursor: "pointer", fontWeight: 500 }}>
            {isLast ? "Done" : "Next →"}
          </button>
          <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
            {TOUR_STEPS.map((_, i) => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i === step ? "var(--red)" : "var(--line-light)" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EXPORT MODAL ──
function ExportModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line-light)", width: 400, padding: 36 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--red)", marginBottom: 8, textTransform: "uppercase" }}>Export</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "var(--cream)", marginBottom: 24 }}>Download Report</div>
        {[
          { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", label: "Policy Brief (PDF)", sub: "Formatted for legislators" },
          { icon: "M3 10h18M3 14h18M10 10v8M14 10v8M5 6h14M7 4h10", label: "Data Export (CSV)", sub: "Full dataset with all metrics" },
          { icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", label: "API Access", sub: "JSON feed for integration" },
        ].map(item => (
          <button key={item.label} onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", background: "var(--bg-2)", border: "1px solid var(--line)", padding: "14px 16px", cursor: "pointer", marginBottom: 8, textAlign: "left" }}>
            <Icon path={item.icon} size={18} color="var(--red)" />
            <div>
              <div style={{ color: "var(--cream)", fontSize: 13, fontWeight: 600 }}>{item.label}</div>
              <div style={{ color: "#555", fontFamily: "var(--mono)", fontSize: 10 }}>{item.sub}</div>
            </div>
          </button>
        ))}
        <button onClick={onClose} style={{ fontFamily: "var(--mono)", fontSize: 11, background: "none", border: "1px solid var(--line)", color: "#555", padding: "8px 16px", cursor: "pointer", marginTop: 8 }}>Cancel</button>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, TopBar, PersonaModal, TourOverlay, ExportModal, Icon });
