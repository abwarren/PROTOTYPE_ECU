// Diagnostics — DTC viewer and live sensor readout

import { useState } from "react";

interface Dtc {
  code: string;
  description: string;
  status: "active" | "pending" | "historic";
}

const DEMO_DTCS: Dtc[] = [
  { code: "P0030", description: "HO2S Heater Control Circuit (Bank 1, Sensor 1)", status: "historic" },
  { code: "P0101", description: "Mass or Volume Air Flow Circuit Range/Performance", status: "pending" },
];

const DEMO_SENSORS = [
  { name: "RPM", value: "0", unit: "rpm" },
  { name: "Battery", value: "13.8", unit: "V" },
  { name: "Coolant", value: "82", unit: "\u00B0C" },
  { name: "IAT", value: "35", unit: "\u00B0C" },
  { name: "TPS", value: "0", unit: "%" },
  { name: "MAP", value: "101", unit: "kPa" },
  { name: "AFR", value: "14.7", unit: "\u03BB" },
  { name: "Oil Press", value: "45", unit: "psi" },
  { name: "Fuel Press", value: "58", unit: "psi" },
  { name: "Boost", value: "0", unit: "psi" },
];

export default function Diagnostics() {
  const [dtcs, setDtcs] = useState<Dtc[]>(DEMO_DTCS);

  const clearDtc = (code: string) => {
    setDtcs((prev) => prev.filter((d) => d.code !== code));
  };

  const clearAll = () => {
    setDtcs([]);
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>Diagnostics</h1>
        <p>Fault codes and live sensor data</p>
      </div>

      <div className="diag-layout">
        {/* LEFT: DTC Panel */}
        <div className="diag-panel">
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Diagnostic Trouble Codes</h3>
            <div className="flex gap-8">
              {dtcs.length > 0 && (
                <button className="cal-btn danger" onClick={clearAll} style={{ fontSize: 11 }}>
                  Clear All
                </button>
              )}
              <button className="cal-btn" onClick={() => setDtcs([])} style={{ fontSize: 11 }}>
                Refresh
              </button>
            </div>
          </div>

          {dtcs.length === 0 ? (
            <div className="diag-empty">
              <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>\u2713</div>
              <p>No fault codes detected</p>
              <p style={{ fontSize: 11, marginTop: 4 }}>All systems nominal</p>
            </div>
          ) : (
            <ul className="dtc-list">
              {dtcs.map((dtc, i) => (
                <li key={i} className="dtc-item">
                  <span className="dtc-code">{dtc.code}</span>
                  <span className="dtc-desc">{dtc.description}</span>
                  <span className={`dtc-status ${dtc.status}`}>{dtc.status}</span>
                  <button
                    className="conn-btn"
                    onClick={() => clearDtc(dtc.code)}
                    style={{ fontSize: 10, padding: "2px 8px" }}
                  >
                    Clear
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT: Live Sensor Readout */}
        <div className="diag-panel">
          <h3>Live Sensor Values</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {DEMO_SENSORS.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "6px 8px", borderRadius: 4,
                  background: i % 2 === 0 ? "var(--bg-surface)" : "transparent",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>{s.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "var(--accent)" }}>
                  {s.value}
                  <span style={{ color: "var(--text-dim)", fontSize: 11, marginLeft: 2 }}>{s.unit}</span>
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 4 }}>System Status</h3>
            <div className="flex gap-8">
              <span className="identity-badge" style={{ color: "var(--green)" }}>
                \u25CF CAN Bus
              </span>
              <span className="identity-badge" style={{ color: "var(--green)" }}>
                \u25CF USB Link
              </span>
              <span className="identity-badge" style={{ color: "var(--text-dim)" }}>
                \u25CF WBO2 Offline
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
