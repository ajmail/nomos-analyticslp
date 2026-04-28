// Nomos Analytics — All Screens

// ── UTILS ──
function fmt(n) { return "$" + (n >= 1e6 ? (n/1e6).toFixed(1) + "M" : (n/1e3).toFixed(0) + "K"); }
function DCRBadge({ dcr, label }) {
  const cls = dcr < 0.3 ? { color: "var(--red)", bg: "rgba(232,52,26,0.12)", border: "var(--red)" }
    : dcr < 0.5 ? { color: "var(--orange)", bg: "rgba(249,115,22,0.1)", border: "var(--orange)" }
    : { color: "#4a9", bg: "rgba(68,170,136,0.08)", border: "#4a9" };
  return (
    <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: cls.color, background: cls.bg, border: `1px solid ${cls.border}`, padding: "2px 8px", letterSpacing: "0.06em" }}>
      {label || (dcr * 100).toFixed(0) + "%"}{dcr < 0.3 ? " ⚑" : ""}
    </span>
  );
}
function RiskBadge({ risk }) {
  const map = { HIGH: "var(--red)", MEDIUM: "var(--orange)", LOW: "#4a9" };
  return (
    <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", color: map[risk], textTransform: "uppercase" }}>{risk}</span>
  );
}
function BarMeter({ pct, color = "var(--red)" }) {
  return (
    <div style={{ height: 3, background: "var(--line-light)", marginTop: 6 }}>
      <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, transition: "width 0.8s ease" }} />
    </div>
  );
}

// ── DASHBOARD ──
function Dashboard({ persona, setScreen, liveCounter }) {
  const flagged = window.NOMOS.orgs.filter(o => o.status === "flagged");
  const { avgDCRLabel, statesAnalyzed, orgsAnalyzed, worstDCR, bestDCR } = window.NOMOS.keyStats;

  const personaContexts = {
    legislator: { label: "Your Oversight View", hint: `${flagged.length} intermediaries flagged for DCR anomalies. Average DCR across ${statesAnalyzed} states: ${avgDCRLabel} on the dollar. The 75% mandate would nearly triple founder capital without new appropriations.` },
    foundation: { label: "Due Diligence Summary", hint: `${flagged.length} prospective grantee partners flag for sub-30% direct disbursement rates. Worst performer: ${worstDCR.org} at ${worstDCR.val}.` },
    federal: { label: "Audit Priority Queue", hint: `${flagged.length} organizations flagged for GAGAS scope gaps, unverifiable capital claims, or DCR below 25%. BFTP-SEP (0.2%) warrants immediate review.` },
    journalist: { label: "Story Leads", hint: `${flagged.length} active anomalies with public audit documentation. BFTP-SEP: 0.2% DCR — 99.8¢ of every dollar absorbed by overhead.` },
  };
  const ctx = personaContexts[persona] || personaContexts.legislator;

  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 4000);
    return () => clearInterval(t);
  }, []);

  const liveStats = [
    { label: "Avg. Direct Capital Ratio", val: avgDCRLabel, sub: `across ${statesAnalyzed} Rust Belt states — ${orgsAnalyzed} orgs analyzed` },
    { label: "Orgs Flagged (<30% DCR)", val: flagged.length, sub: "Immediate review recommended" },
    { label: "Best-in-Class Benchmark", val: bestDCR.val, sub: bestDCR.org },
  ];

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--red)", marginBottom: 8, textTransform: "uppercase" }}>{ctx.label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "var(--cream)", marginBottom: 8, letterSpacing: "-0.02em" }}>Grant Economy Intelligence</div>
        <div style={{ fontSize: 14, color: "var(--cream-dim)", maxWidth: 600 }}>{ctx.hint}</div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {liveStats.map(stat => (
          <div key={stat.label} style={{ background: "var(--bg-1)", border: "1px solid var(--line)", padding: "24px 24px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.15em", color: "#555", marginBottom: 8, textTransform: "uppercase" }}>{stat.label}</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "var(--cream)", letterSpacing: "-0.03em", lineHeight: 1 }}>{stat.val}</div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 6 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Alerts + Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--red)", marginBottom: 14, textTransform: "uppercase" }}>Active Alerts</div>
          {window.NOMOS.orgs.filter(o => o.status !== "compliant").map(org => (
            <div key={org.id} onClick={() => setScreen("profile")}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", border: "1px solid var(--line)", borderLeft: org.status === "flagged" ? "3px solid var(--red)" : "3px solid var(--orange)", background: "var(--bg-1)", marginBottom: 8, cursor: "pointer", transition: "background 0.15s" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "var(--cream)", fontSize: 13, marginBottom: 3 }}>{org.name}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#555" }}>{org.state} · {org.type}</div>
              </div>
              <DCRBadge dcr={org.dcr} label={org.dcrLabel} />
              <RiskBadge risk={org.risk} />
              <Icon path="M9 5l7 7-7 7" size={14} color="#555" />
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", color: "#555", marginBottom: 14, textTransform: "uppercase" }}>Quick Actions</div>
          {[
            { label: "View Full Ledger", sub: "All 5 orgs, sortable", screen: "ledger", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
            { label: "Innovation Works Profile", sub: "Forensic deep-dive", screen: "profile", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
            { label: "Model Innovate PA 2.0", sub: "3 scenarios ready", screen: "scenarios", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
            { label: "Ask Nomos Intelligence", sub: "AI-powered analysis", screen: "intelligence", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
          ].map(action => (
            <button key={action.label} onClick={() => setScreen(action.screen)}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", padding: "12px 14px", cursor: "pointer", marginBottom: 8, textAlign: "left", transition: "background 0.15s" }}>
              <Icon path={action.icon} size={14} color="var(--red)" />
              <div>
                <div style={{ color: "var(--cream)", fontSize: 12, fontWeight: 600 }}>{action.label}</div>
                <div style={{ color: "#555", fontFamily: "var(--mono)", fontSize: 10 }}>{action.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── LEDGER ──
function Ledger({ setScreen, setSelectedOrg }) {
  const [sort, setSort] = React.useState({ key: "dcr", dir: "desc" });
  const [stateFilter, setStateFilter] = React.useState("ALL");
  const [search, setSearch] = React.useState("");

  const orgs = window.NOMOS.orgs
    .filter(o => stateFilter === "ALL" || o.state === stateFilter)
    .filter(o => !search || o.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const va = a[sort.key], vb = b[sort.key];
      return sort.dir === "desc" ? (vb > va ? 1 : -1) : (va > vb ? 1 : -1);
    });

  function toggleSort(key) {
    setSort(s => s.key === key ? { key, dir: s.dir === "desc" ? "asc" : "desc" } : { key, dir: "desc" });
  }

  const cols = [
    { key: "name", label: "Organization", flex: 3 },
    { key: "state", label: "State", flex: 1 },
    { key: "totalGrants", label: "Total Grants", flex: 1.5 },
    { key: "dcr", label: "DCR", flex: 1 },
    { key: "directDisbursementRate", label: "Direct %", flex: 1 },
    { key: "risk", label: "Risk", flex: 1 },
  ];

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--red)", marginBottom: 6, textTransform: "uppercase" }}>Grant Ledger</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--cream)" }}>{orgs.length} Organizations</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
            style={{ background: "var(--bg-2)", border: "1px solid var(--line-light)", color: "var(--cream)", fontFamily: "var(--mono)", fontSize: 12, padding: "7px 12px", outline: "none", width: 180 }} />
          {["ALL","PA","OH","MI","IN"].map(st => (
            <button key={st} onClick={() => setStateFilter(st)}
              style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", padding: "6px 12px", background: stateFilter === st ? "var(--red)" : "var(--bg-2)", border: "1px solid var(--line-light)", color: stateFilter === st ? "var(--bg)" : "var(--cream-dim)", cursor: "pointer", transition: "all 0.15s" }}>
              {st}
            </button>
          ))}
        </div>
      </div>

      <div style={{ border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", background: "var(--bg-1)", borderBottom: "1px solid var(--line)", padding: "10px 18px" }}>
          {cols.map(c => (
            <div key={c.key} style={{ flex: c.flex, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.15em", color: sort.key === c.key ? "var(--red)" : "#555", cursor: "pointer", textTransform: "uppercase", userSelect: "none" }} onClick={() => toggleSort(c.key)}>
              {c.label}{sort.key === c.key ? (sort.dir === "desc" ? " ↓" : " ↑") : ""}
            </div>
          ))}
        </div>
        {orgs.map(org => (
          <div key={org.id} onClick={() => { setSelectedOrg(org.id); setScreen("profile"); }}
            style={{ display: "flex", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid var(--line)", cursor: "pointer", transition: "background 0.12s", borderLeft: org.status === "flagged" ? "2px solid var(--red)" : org.status === "review" ? "2px solid var(--orange)" : "2px solid transparent" }}>
            <div style={{ flex: 3 }}>
              <div style={{ color: "var(--cream)", fontWeight: 600, fontSize: 13 }}>{org.name}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#555", marginTop: 2 }}>{org.type}</div>
            </div>
            <div style={{ flex: 1, fontFamily: "var(--mono)", fontSize: 12, color: "var(--cream-dim)" }}>{org.state}</div>
            <div style={{ flex: 1.5, fontFamily: "var(--mono)", fontSize: 12, color: "var(--cream-dim)" }}>{org.totalGrantsLabel}</div>
            <div style={{ flex: 1 }}><DCRBadge dcr={org.dcr} label={org.dcrLabel} /></div>
            <div style={{ flex: 1, fontFamily: "var(--mono)", fontSize: 12, color: org.directDisbursementRate < 30 ? "var(--red)" : org.directDisbursementRate < 50 ? "var(--orange)" : "#4a9" }}>{org.directDisbursementRate}%</div>
            <div style={{ flex: 1 }}><RiskBadge risk={org.risk} /></div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#444", marginTop: 12, lineHeight: 1.6 }}>
        Source: Matin (2026), "The Capital Velocity Gap" — IRS Form 990 (ProPublica Nonprofit Explorer) &amp; Federal Audit Clearinghouse Single Audit data. All figures audited FY2024–2025.
      </div>
    </div>
  );
}

// ── ORG PROFILE ──
function OrgProfile({ orgId }) {
  const org = window.NOMOS.orgs.find(o => o.id === orgId) || window.NOMOS.orgs[0];
  const [tab, setTab] = React.useState("overview");

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--line)" }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--red)", marginBottom: 6, textTransform: "uppercase" }}>{org.state} · {org.sector}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--cream)", marginBottom: 4 }}>{org.name}</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#555" }}>{org.city} · {org.type} · {org.fy}</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <DCRBadge dcr={org.dcr} label={`DCR ${org.dcrLabel}`} />
          <div style={{ background: org.risk === "HIGH" ? "rgba(232,52,26,0.1)" : org.risk === "MEDIUM" ? "rgba(249,115,22,0.1)" : "rgba(68,170,136,0.08)", border: `1px solid ${org.risk === "HIGH" ? "var(--red)" : org.risk === "MEDIUM" ? "var(--orange)" : "#4a9"}`, padding: "4px 12px", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", color: org.risk === "HIGH" ? "var(--red)" : org.risk === "MEDIUM" ? "var(--orange)" : "#4a9" }}>
            {org.risk} RISK
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--line)", marginBottom: 24 }}>
        {["overview","financials","flags"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", background: "none", border: "none", borderBottom: tab === t ? "2px solid var(--red)" : "2px solid transparent", color: tab === t ? "var(--red)" : "var(--cream-dim)", cursor: "pointer", marginBottom: -1 }}>
            {t}{t === "flags" && org.flags.length ? ` (${org.flags.length})` : ""}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--cream-dim)", marginBottom: 24, maxWidth: 680 }}>{org.description}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Total Grants", val: org.totalGrantsLabel, color: "var(--cream)" },
              { label: "Direct to Founders", val: `${org.directDisbursementRate}%`, color: org.directDisbursementRate < 40 ? "var(--red)" : "var(--orange)" },
              { label: "Personnel Share", val: `${org.personnelCostShare}%`, color: org.personnelCostShare > 35 ? "var(--red)" : "var(--cream)" },
              { label: "Board Reserves", val: org.boardReservesLabel, color: org.boardReserves > 10000000 ? "var(--red)" : "var(--cream)" },
            ].map(m => (
              <div key={m.label} style={{ background: "var(--bg-1)", border: "1px solid var(--line)", padding: "20px 18px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#555", marginBottom: 8, letterSpacing: "0.12em", textTransform: "uppercase" }}>{m.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.val}</div>
                <BarMeter pct={typeof m.val === "string" && m.val.includes("%") ? parseInt(m.val) : 50} color={m.color} />
              </div>
            ))}
          </div>
          {org.subsidiaries.length > 0 && (
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.15em", color: "#555", marginBottom: 10, textTransform: "uppercase" }}>Subsidiaries</div>
              <div style={{ display: "flex", gap: 10 }}>
                {org.subsidiaries.map(s => (
                  <div key={s} style={{ background: "var(--bg-2)", border: "1px solid var(--line)", padding: "6px 12px", fontFamily: "var(--mono)", fontSize: 11, color: "var(--cream-dim)" }}>{s}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "financials" && (
        <div>
          <div style={{ border: "1px solid var(--line)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "10px 18px", background: "var(--bg-1)", borderBottom: "1px solid var(--line)" }}>
              {["Fiscal Year","Total Receipts","Direct Disbursed","Personnel","Overhead"].map(h => (
                <div key={h} style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.12em" }}>{h}</div>
              ))}
            </div>
            {org.financials.map(row => (
              <div key={row.year} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--cream)", fontWeight: 600 }}>{row.year}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--cream-dim)" }}>{fmt(row.receipts)}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: row.disbursed / row.receipts < 0.3 ? "var(--red)" : row.disbursed / row.receipts < 0.5 ? "var(--orange)" : "#4a9" }}>{fmt(row.disbursed)} ({Math.round(row.disbursed/row.receipts*100)}%)</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: row.personnel / row.receipts > 0.35 ? "var(--red)" : "var(--cream-dim)" }}>{fmt(row.personnel)} ({Math.round(row.personnel/row.receipts*100)}%)</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--cream-dim)" }}>{fmt(row.overhead)}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#444", marginTop: 12 }}>Source: {org.source} · Figures in USD</div>
        </div>
      )}

      {tab === "flags" && (
        <div>
          {org.flags.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#4a9", fontFamily: "var(--mono)", fontSize: 13 }}>✓ No anomalies detected — organization meets all DCR thresholds.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {org.flags.map(flag => (
                <div key={flag.code} style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderLeft: "3px solid var(--red)", padding: "18px 22px" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--red)", letterSpacing: "0.12em" }}>{flag.code}</span>
                    <span style={{ fontWeight: 700, color: "var(--cream)", fontSize: 13 }}>{flag.label}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--cream-dim)", lineHeight: 1.6 }}>{flag.detail}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── SCENARIOS ──
function Scenarios() {
  const { programName, proposedBudget, proposedBudgetLabel, scenarios, context } = window.NOMOS.scenarios;
  const [selected, setSelected] = React.useState("B");
  const sel = scenarios.find(s => s.id === selected);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--red)", marginBottom: 6, textTransform: "uppercase" }}>Scenario Modeling</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--cream)", marginBottom: 4 }}>{programName} — {proposedBudgetLabel} Proposed</div>
        <div style={{ fontSize: 14, color: "var(--cream-dim)", marginBottom: context ? 16 : 0 }}>AI generates options. The human owns the decision.</div>
        {context && (
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#555", background: "var(--bg-1)", border: "1px solid var(--line)", padding: "10px 14px", lineHeight: 1.6, maxWidth: 720 }}>
            <span style={{ color: "var(--red)" }}>Context — </span>{context}
          </div>
        )}
      </div>

      {/* Scenario cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        {scenarios.map(s => (
          <div key={s.id} onClick={() => setSelected(s.id)}
            style={{ background: "var(--bg-1)", border: selected === s.id ? `2px solid ${s.color}` : "1px solid var(--line)", padding: "22px 22px", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.15em", color: s.color, marginBottom: 8, textTransform: "uppercase" }}>Scenario {s.id}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--cream)", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: "var(--cream-dim)", marginBottom: 18, lineHeight: 1.5 }}>{s.structure}</div>
            <div style={{ fontSize: 38, fontWeight: 700, color: s.color, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>{s.dcrLabel}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#555" }}>Direct to founders</div>
            <BarMeter pct={s.dcr * 100} color={s.color} />
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {sel && (
        <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", padding: "28px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 24, marginBottom: 24 }}>
            {[
              { label: "Direct to Founders", val: sel.directLabel, color: sel.color },
              { label: "Feasibility", val: sel.feasibility, color: "var(--cream)" },
              { label: "Primary Risk", val: sel.risk, color: "var(--orange)" },
              { label: "Timeline", val: sel.timeline, color: "var(--cream-dim)" },
            ].map(m => (
              <div key={m.label}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#555", marginBottom: 8, letterSpacing: "0.12em", textTransform: "uppercase" }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: m.color, letterSpacing: "-0.01em" }}>{m.val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--cream-dim)", borderTop: "1px solid var(--line)", paddingTop: 20 }}>{sel.detail}</div>
          <div style={{ marginTop: 20, padding: "14px 18px", background: "rgba(232,52,26,0.05)", border: "1px solid var(--line)", fontFamily: "var(--mono)", fontSize: 11, color: "#666", letterSpacing: "0.06em" }}>
            Each scenario includes: implementation timeline · staffing requirements · risk factors · stakeholder impact · political feasibility. The AI generates options. The human owns the decision.
          </div>
        </div>
      )}

      {/* Benchmark */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.15em", color: "#555", marginBottom: 12, textTransform: "uppercase" }}>Benchmark: Elevate Ventures, Indiana (Best-in-class)</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", background: "var(--bg-1)", border: "1px solid var(--line)", borderLeft: "2px solid #4a9" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 24, fontWeight: 700, color: "#4a9" }}>55%</span>
          <div style={{ fontSize: 13, color: "var(--cream-dim)" }}>Direct disbursement rate · FY2024 · $10.8M expenses, $18.9M capital committed · Single statewide vehicle, unified reporting</div>
        </div>
      </div>
        <div style={{ marginTop: 16, fontFamily: "var(--mono)", fontSize: 10, color: "#3a3a3a", lineHeight: 1.6 }}>
        Source: Matin (2026), "The Capital Velocity Gap" — scenario projections modeled on documented BFTP DCR methodology. Elevate Ventures (IN) benchmark from IRS Form 990 FY2024.
      </div>
    </div>
  );
}
function Intelligence({ persona }) {
  const [messages, setMessages] = React.useState([
    { role: "assistant", content: "Welcome to Nomos Intelligence. I have access to forensic data on 5 grant intermediaries across Pennsylvania, Ohio, Michigan, and Indiana. Ask me anything about the grant economy — anomalies, comparisons, scenarios, or policy implications." }
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const endRef = React.useRef(null);

  React.useEffect(() => {
    if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight;
  }, [messages]);

  const cannedResponses = {
    "Which intermediaries have a DCR below 25%": "Four organizations in the dataset fall below the 25% DCR threshold:\n\n1. BFTP of Southeastern PA — 0.2% DCR. The most extreme case: $99.80 of every $100 absorbed by overhead. Personnel costs at 62% of total expenditure.\n\n2. JumpStart Inc. (OH) — 21% DCR. $14.9M in receipts, only $3.1M reaching founders. Internal service credits inflate reported program activity.\n\n3. Rev1 Ventures (OH) — 24% DCR. $11.1M total grants. 41% personnel cost share.\n\n4. Innovation Works (PA) — 25% DCR. Staff compensation ($7M+) exceeds total disbursements to founders. $29M in board-designated reserves with no public deployment timeline.\n\nPattern: The intermediary model consistently retains 75-80 cents of every public dollar for internal operations.",
    "Compare BFTP-SEP to Elevate Ventures": "The gap between BFTP of Southeastern PA and Elevate Ventures (Indiana) represents the full spectrum of intermediary performance:\n\nBFTP-SEP: 0.2% DCR — $99.80 of every $100 retained internally. 62% personnel cost share. $8.4M reserves. $11.8M in receipts, $24K disbursed to founders.\n\nElevate Ventures: 55% DCR — $10.4M reaching founders from $18.9M in capital committed. 19% personnel cost share. $2.2M reserves. Single statewide vehicle with unified reporting.\n\nThe structural difference: Indiana consolidated into one statewide vehicle. Pennsylvania fragments across four regional centers, each maintaining independent overhead structures. BFTP-SEP's near-zero disbursement rate is the logical endpoint of an intermediary model with no accountability mechanism.",
    "What would Innovate in PA 2.0 deliver": "Three scenarios for the proposed $100M Innovate in PA 2.0 appropriation:\n\nScenario A — Status Quo: ~$23M reaches founders. $77M absorbed by intermediary overhead, reserves, and personnel. Replicates current BFTP network average DCR of 23%.\n\nScenario B — 75% Direct Capital Mandate (Pittsburgh Compact): $75M reaches founders. Nearly triples capital deployment without increasing the appropriation. Compliance verifiable via annual FAC filings. Requires intermediary restructuring.\n\nScenario C — Performance-Based + First Customer: ~$52M reaches founders. Ties disbursement tranches to verified DCR scores. Adds First Customer Clause requiring corporations receiving >$10M in state tax incentives to pilot from state-HQ'd startups.\n\nThe delta between Scenario A and B is $52M — that's real founder capital left on the table by maintaining the status quo.",
    "Which state has the most efficient": "Indiana. Elevate Ventures operates at a 55% DCR — the highest in our five-state Rust Belt dataset. Key structural factors:\n\n1. Single statewide vehicle — no fragmented regional overhead\n2. 19% personnel cost share (vs. 49% at Innovation Works)\n3. $2.2M reserves (vs. $29M at Innovation Works)\n4. Unified reporting and accountability\n\nThe Indiana model demonstrates that a 75% mandate is structurally achievable. Elevate already operates at 55% without any statutory requirement — a mandate would push them to benchmark, not break them.\n\nWorst performer: BFTP of Southeastern PA at 0.2% DCR. The spread between best and worst is 54.8 percentage points — entirely explained by intermediary structure, not market conditions.",
    "What are the red flags in the Innovation Works": "Innovation Works (PA) carries four active audit flags:\n\n1. OVERHEAD-01 — Staff compensation ($7M+) now exceeds total disbursements to founders. This is a structural inversion: the intermediary costs more to operate than it delivers in capital.\n\n2. RESERVE-01 — $29M in board-designated reserves against $14.2M annual receipts — a 204% reserve ratio with no public deployment timeline.\n\n3. AUDIT-01 — Subsidiary VC fund (AlphaLab Gear, IW Capital Partners) not audited under GAGAS standards. This limits independent verification of capital deployment claims.\n\n4. CAPITAL-01 — Recycled capital claims are unverifiable under current audit scope. Cannot be independently confirmed from public filings.\n\nThe combination of excessive reserves, unverifiable claims, and personnel costs exceeding disbursements constitutes a HIGH risk classification.",
    "How does Pennsylvania's dual-track system compare": "Pennsylvania operates a fragmented four-center BFTP model. Indiana uses a single statewide vehicle. The structural consequences:\n\nPA BFTP Network:\n• 4 regional centers, each with independent overhead\n• Average DCR: ~23% (Innovation Works 25%, BFTP-SEP 0.2%, BFTP-NEP 36%)\n• Combined personnel costs exceed combined founder disbursements\n• $29M+ in board reserves across centers\n\nIndiana (Elevate Ventures):\n• Single vehicle, unified reporting\n• DCR: 55%\n• 19% personnel cost share\n• $2.2M reserves\n\nThe fragmentation multiplies fixed costs — four executive teams, four boards, four compliance structures, four facilities. Each center maintains overhead regardless of deployment volume. Indiana's consolidation eliminates this structural inefficiency.\n\nConclusion: Pennsylvania's intermediary architecture is optimized for intermediary survival, not founder capital deployment."
  };

  async function sendMessage(text) {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages(m => [...m, { role: "user", content: q }]);
    setLoading(true);

    // Demo mode: match canned responses by keyword
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const qLower = q.toLowerCase();
    let reply = null;
    for (const [key, val] of Object.entries(cannedResponses)) {
      if (qLower.includes(key.toLowerCase().slice(0, 20))) { reply = val; break; }
    }
    if (!reply) {
      reply = "Nomos Intelligence is processing your query across " + window.NOMOS.orgs.length + " indexed organizations in " + window.NOMOS.keyStats.statesAnalyzed + " states.\n\nIn the full platform, this query would synthesize Federal Audit Clearinghouse filings, IRS Form 990 data, and state appropriation records to generate a forensic response.\n\nFor the demo, try one of the suggested queries below — or explore the Ledger, Org Profile, and Scenarios screens for the full dataset.";
    }
    setMessages(m => [...m, { role: "assistant", content: reply }]);
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 48px)", padding: 0 }}>
      {/* Header */}
      <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--line)", background: "var(--bg-1)", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--red)", marginBottom: 4, textTransform: "uppercase" }}>Nomos Intelligence — AI Layer</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--cream)" }}>Cross-state pattern analysis, in plain language.</div>
      </div>

      {/* Messages */}
      <div ref={endRef} style={{ flex: 1, overflowY: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 12 }}>
            {m.role === "assistant" && (
              <div style={{ width: 28, height: 28, background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--bg)", fontWeight: 700 }}>N</span>
              </div>
            )}
            <div style={{ maxWidth: "72%", background: m.role === "user" ? "var(--bg-2)" : "var(--bg-1)", border: "1px solid var(--line)", padding: "14px 18px", fontSize: 14, lineHeight: 1.7, color: m.role === "user" ? "var(--cream)" : "var(--cream-dim)", whiteSpace: "pre-wrap" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 28, height: 28, background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--bg)", fontWeight: 700 }}>N</span>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#555" }}>Analyzing<span style={{ animation: "ellipsis 1.4s infinite" }}>...</span></div>
          </div>
        )}
      </div>

      {/* Suggested */}
      <div style={{ padding: "12px 32px", borderTop: "1px solid var(--line)", display: "flex", gap: 8, flexWrap: "wrap", background: "var(--bg-1)", flexShrink: 0 }}>
        {window.NOMOS.suggestedQueries.slice(0, 3).map(q => (
          <button key={q} onClick={() => sendMessage(q)}
            style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.06em", background: "var(--bg-2)", border: "1px solid var(--line-light)", color: "var(--cream-dim)", padding: "5px 10px", cursor: "pointer", transition: "all 0.15s" }}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: "16px 32px", borderTop: "1px solid var(--line)", display: "flex", gap: 10, flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask anything about the grant economy…"
          style={{ flex: 1, background: "var(--bg-2)", border: "1px solid var(--line-light)", color: "var(--cream)", fontFamily: "var(--mono)", fontSize: 13, padding: "12px 16px", outline: "none" }} />
        <button onClick={() => sendMessage()} disabled={loading}
          style={{ background: loading ? "#333" : "var(--red)", border: "none", color: "var(--bg)", fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.12em", padding: "12px 24px", cursor: loading ? "not-allowed" : "pointer", fontWeight: 500 }}>
          {loading ? "…" : "Ask →"}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, Ledger, OrgProfile, Scenarios, Intelligence, DCRBadge, RiskBadge, BarMeter, Icon, fmt });
