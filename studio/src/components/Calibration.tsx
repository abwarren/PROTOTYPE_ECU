// Calibration — Fuel VE and ignition table editor
// Unique: dark heat-map table with cell editing

import { useState, useCallback } from "react";

// Demo fuel VE table — 8x8 typical for rusEFI
function makeDemoTable(): number[][] {
  const rows = 8;
  const cols = 8;
  const data: number[][] = [];
  for (let y = 0; y < rows; y++) {
    const row: number[] = [];
    for (let x = 0; x < cols; x++) {
      // Create a realistic VE curve: higher in center, lower at edges
      const cy = y / (rows - 1);
      const cx = x / (cols - 1);
      const base = 60 + 40 * Math.sin(cx * Math.PI) * Math.sin(cy * Math.PI);
      row.push(Math.round(base));
    }
    data.push(row);
  }
  return data;
}

const RPM_AXIS = [800, 1200, 2000, 3000, 4000, 5000, 6000, 7000];
const MAP_AXIS = [30, 45, 60, 75, 90, 105, 120, 140];

function heatColor(val: number): string {
  if (val < 50) return "rgba(0, 212, 176, 0.15)";
  if (val < 70) return "rgba(0, 212, 176, 0.25)";
  if (val < 85) return "rgba(0, 168, 232, 0.35)";
  if (val < 100) return "rgba(245, 166, 35, 0.3)";
  return "rgba(239, 68, 68, 0.3)";
}

type TableType = "ve" | "ignition";

export default function Calibration() {
  const [activeTable, setActiveTable] = useState<TableType>("ve");
  const [veTable, setVeTable] = useState<number[][]>(makeDemoTable);
  const [selected, setSelected] = useState<{ x: number; y: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleCellClick = useCallback((x: number, y: number) => {
    setSelected({ x, y });
    setEditValue(String(veTable[y][x]));
  }, [veTable]);

  const handleCellEdit = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  }, []);

  const commitEdit = useCallback(() => {
    if (!selected) return;
    const val = parseFloat(editValue);
    if (isNaN(val)) return;
    setVeTable((prev) => {
      const next = prev.map((r) => [...r]);
      next[selected.y][selected.x] = val;
      return next;
    });
    setSelected(null);
  }, [selected, editValue]);

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>Calibration</h1>
        <p>Fuel & ignition table editor — click a cell to edit</p>
      </div>

      <div className="cal-container">
        {/* LEFT: VE Table */}
        <div className="cal-panel">
          <h3>
            Fuel VE Table
            {activeTable !== "ve" && (
              <span style={{ color: "#4a5a78", fontSize: 11, marginLeft: 8 }}>
                (click to switch)
              </span>
            )}
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table className="cal-table">
              <thead>
                <tr>
                  <th>MAP \ RPM</th>
                  {RPM_AXIS.map((rpm, i) => (
                    <th key={i}>{rpm}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {veTable.map((row, y) => (
                  <tr key={y}>
                    <th>{MAP_AXIS[y]}</th>
                    {row.map((val, x) => (
                      <td
                        key={x}
                        style={{ backgroundColor: heatColor(val) }}
                        className={selected?.x === x && selected?.y === y ? "selected" : ""}
                        onClick={() => handleCellClick(x, y)}
                      >
                        {selected?.x === x && selected?.y === y ? (
                          <input
                            className="cell-edit"
                            value={editValue}
                            onChange={handleCellEdit}
                            onBlur={commitEdit}
                            onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setSelected(null); }}
                            autoFocus
                          />
                        ) : (
                          val
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cal-controls">
            <span style={{ fontSize: 11, color: "#4a5a78", alignSelf: "center" }}>
              Click cell to edit · Enter to commit · Esc to cancel
            </span>
          </div>
        </div>

        {/* RIGHT: Table info & controls */}
        <div className="cal-panel">
          <h3>Table Controls</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "#8899b4", display: "block", marginBottom: 4 }}>Active Table</label>
            <div className="flex gap-8">
              <button
                className={`cal-btn ${activeTable === "ve" ? "primary" : ""}`}
                onClick={() => setActiveTable("ve")}
              >
                Fuel VE
              </button>
              <button
                className={`cal-btn ${activeTable === "ignition" ? "primary" : ""}`}
                onClick={() => setActiveTable("ignition")}
              >
                Ignition Timing
              </button>
            </div>
          </div>

          <div className="cal-controls" style={{ flexDirection: "column", gap: 8 }}>
            <button className="cal-btn primary" style={{ width: "100%" }}>
              Read from ECU
            </button>
            <button className="cal-btn" style={{ width: "100%" }}>
              Write to ECU
            </button>
            <button className="cal-btn" style={{ width: "100%" }}>
              Save to File
            </button>
            <button className="cal-btn" style={{ width: "100%" }}>
              Load from File
            </button>
            <button className="cal-btn danger" style={{ width: "100%" }}>
              Reset to Default
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 11, marginBottom: 4 }}>Heat Map Legend</h3>
            <div className="flex gap-8 items-center" style={{ fontSize: 11, color: "#4a5a78" }}>
              <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 2, background: "rgba(0,212,176,0.15)" }} />
              <span>Lean</span>
              <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 2, background: "rgba(245,166,35,0.3)" }} />
              <span>Rich</span>
              <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 2, background: "rgba(239,68,68,0.3)" }} />
              <span>Danger</span>
            </div>
          </div>

          {selected && (
            <div style={{ marginTop: 16, padding: 8, background: "var(--accent-glow)", borderRadius: 6 }}>
              <span style={{ fontSize: 12, color: "#00d4b0" }}>
                Editing: RPM {RPM_AXIS[selected.x]} · MAP {MAP_AXIS[selected.y]} kPa
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
