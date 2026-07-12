// Calibration — Fuel VE and ignition table editor
// Unique: dark heat-map table with cell editing
// Reads/writes from ECU via protocol, saves/loads from file

import { useState, useCallback, useRef } from "react";
import { RusEfiProtocol } from "../core/transport/RusEfiProtocol";
import { Connection } from "../core/transport/EcuTransport";

// Demo fuel VE table — 8x8 typical for rusEFI
function makeDemoTable(): number[][] {
  const rows = 8;
  const cols = 8;
  const data: number[][] = [];
  for (let y = 0; y < rows; y++) {
    const row: number[] = [];
    for (let x = 0; x < cols; x++) {
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

interface CalibrationProps {
  ecu?: { transport: any; protocol: RusEfiProtocol };
  connection?: Connection | null;
}

export default function Calibration({ ecu, connection }: CalibrationProps) {
  const [activeTable, setActiveTable] = useState<TableType>("ve");
  const [veTable, setVeTable] = useState<number[][]>(makeDemoTable);
  const [ignTable, setIgnTable] = useState<number[][]>(makeDemoTable);
  const [selected, setSelected] = useState<{ x: number; y: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = useCallback((msg: string, _isError?: boolean) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const currentTable = activeTable === "ve" ? veTable : ignTable;
  const setCurrentTable = activeTable === "ve" ? setVeTable : setIgnTable;

  const handleCellClick = useCallback((x: number, y: number) => {
    setSelected({ x, y });
    setEditValue(String(currentTable[y][x]));
  }, [currentTable]);

  const handleCellEdit = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  }, []);

  const commitEdit = useCallback(() => {
    if (!selected) return;
    const val = parseFloat(editValue);
    if (isNaN(val)) return;
    setCurrentTable((prev) => {
      const next = prev.map((r) => [...r]);
      next[selected.y][selected.x] = val;
      return next;
    });
    setSelected(null);
  }, [selected, editValue, setCurrentTable]);

  // ---- Read from ECU ----
  const handleReadFromECU = useCallback(async () => {
    if (!ecu || !connection) {
      showMessage("Connect to ECU first", true);
      return;
    }
    setLoading(true);
    try {
      const cal = await ecu.protocol.readCalibration(
        ecu.transport,
        connection,
        activeTable === "ve" ? "ve_table" : "ignition_table"
      );
      // Convert flat data array back to 8x8 grid
      if (cal.data && cal.data.length > 0) {
        const raw = cal.data[0]; // Comes as [[length]]
        if (Array.isArray(raw)) {
          // Raw binary — rebuild from parsed values
          const grid: number[][] = [];
          for (let y = 0; y < 8; y++) {
            const row: number[] = [];
            for (let x = 0; x < 8; x++) {
              const idx = y * 8 + x;
              row.push(raw[idx] ?? 50);
            }
            grid.push(row);
          }
          setCurrentTable(grid);
        }
      }
      showMessage("Read from ECU — table loaded");
    } catch (err) {
      showMessage(`Read failed: ${err}`, true);
    } finally {
      setLoading(false);
    }
  }, [ecu, connection, activeTable, setCurrentTable, showMessage]);

  // ---- Write to ECU ----
  const handleWriteToECU = useCallback(async () => {
    if (!ecu || !connection) {
      showMessage("Connect to ECU first", true);
      return;
    }
    setLoading(true);
    try {
      const tableData: number[][] = currentTable;
      await ecu.protocol.writeCalibration(
        ecu.transport,
        connection,
        {
          id: activeTable === "ve" ? "ve_table" : "ignition_table",
          name: activeTable === "ve" ? "Fuel VE Table" : "Ignition Timing Table",
          type: activeTable === "ve" ? "fuel_ve" : "ignition",
          axisX: { label: "RPM", values: RPM_AXIS },
          axisY: { label: "MAP", values: MAP_AXIS },
          data: tableData,
        }
      );
      showMessage("Written to ECU — burn complete");
    } catch (err) {
      showMessage(`Write failed: ${err}`, true);
    } finally {
      setLoading(false);
    }
  }, [ecu, connection, activeTable, currentTable, showMessage]);

  // ---- Save to File ----
  const handleSaveToFile = useCallback(() => {
    try {
      const payload = {
        type: activeTable,
        axisRPM: RPM_AXIS,
        axisMAP: MAP_AXIS,
        data: currentTable,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeTable}_table_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage("Saved to file");
    } catch (err) {
      showMessage(`Save failed: ${err}`, true);
    }
  }, [activeTable, currentTable, showMessage]);

  // ---- Load from File ----
  const handleLoadFromFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      if (payload.data && Array.isArray(payload.data) && payload.data.length === 8) {
        setCurrentTable(payload.data);
        showMessage("Loaded from file");
      } else {
        showMessage("Invalid table file format", true);
      }
    } catch (err) {
      showMessage(`Load failed: ${err}`, true);
    }
    // Reset so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [setCurrentTable, showMessage]);

  // ---- Reset to Default ----
  const handleReset = useCallback(() => {
    setCurrentTable(makeDemoTable());
    showMessage("Reset to default values");
  }, [setCurrentTable, showMessage]);

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>Calibration</h1>
        <p>Fuel & ignition table editor — click a cell to edit</p>
      </div>

      {/* Status message */}
      {message && (
        <div style={{
          padding: "8px 16px", marginBottom: 16,
          background: message.includes("failed") ? "rgba(239,68,68,0.1)" : "rgba(52,211,153,0.1)",
          border: `1px solid ${message.includes("failed") ? "rgba(239,68,68,0.3)" : "rgba(52,211,153,0.3)"}`,
          borderRadius: 8, fontSize: 13,
          color: message.includes("failed") ? "#ef4444" : "#34d399",
        }}>
          {message}
        </div>
      )}

      <div className="cal-container">
        {/* LEFT: Table */}
        <div className="cal-panel">
          <h3>
            {activeTable === "ve" ? "Fuel VE Table" : "Ignition Timing Table"}
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
                {currentTable.map((row, y) => (
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
            {loading && (
              <span style={{ fontSize: 11, color: "#00d4b0", marginLeft: "auto" }}>
                Communicating with ECU...
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Table Controls */}
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
            <button
              className="cal-btn primary"
              style={{ width: "100%" }}
              onClick={handleReadFromECU}
              disabled={loading}
            >
              {loading ? "Reading..." : "Read from ECU"}
            </button>
            <button
              className="cal-btn"
              style={{ width: "100%" }}
              onClick={handleWriteToECU}
              disabled={loading}
            >
              {loading ? "Writing..." : "Write to ECU"}
            </button>
            <button
              className="cal-btn"
              style={{ width: "100%" }}
              onClick={handleSaveToFile}
            >
              Save to File
            </button>
            <button
              className="cal-btn"
              style={{ width: "100%" }}
              onClick={handleLoadFromFile}
            >
              Load from File
            </button>
            <button
              className="cal-btn danger"
              style={{ width: "100%" }}
              onClick={handleReset}
            >
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

      {/* Hidden file input for loading calibration files */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />
    </div>
  );
}
