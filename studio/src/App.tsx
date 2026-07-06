// App.tsx — Main application shell
// Wires together: Sidebar, ConnectionBar, and page content

import { useState, useCallback } from "react";
import { useBrand } from "./core/branding/BrandProvider";
import { UsbTransport } from "./core/transport/UsbTransport";
import { RusEfiProtocol } from "./core/transport/RusEfiProtocol";
import { EcuIdentity } from "./core/transport/EcuProtocol";
import { EcuDevice, Connection, ConnectionState } from "./core/transport/EcuTransport";

import Sidebar from "./components/Sidebar";
import ConnectionBar from "./components/ConnectionBar";
import Dashboard from "./components/Dashboard";
import Calibration from "./components/Calibration";
import Diagnostics from "./components/Diagnostics";
import Settings from "./components/Settings";

type PageTab = "dashboard" | "calibration" | "diagnostics" | "settings";
type AppPhase = "idle" | "discovering" | "connecting" | "connected" | "error";

function App() {
  const brand = useBrand();
  const [page, setPage] = useState<PageTab>("dashboard");
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [identity, setIdentity] = useState<EcuIdentity | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<EcuDevice | null>(null);

  // Initialize transport + protocol once
  const [ecu] = useState(() => {
    const transport = new UsbTransport();
    const protocol = new RusEfiProtocol(transport);
    return { transport, protocol };
  });

  // ---- Actions ----
  const handleDiscover = useCallback(async () => {
    setPhase("discovering");
    setError(null);
    try {
      const devices = await ecu.transport.discover();
      if (devices.length === 0) {
        setPhase("idle");
        setError("No ECU found — connect via USB");
      } else {
        // Auto-connect to first device
        await handleConnect(devices[0]);
      }
    } catch (err) {
      setPhase("error");
      setError(String(err));
    }
  }, [ecu]);

  const handleConnect = useCallback(async (dev: EcuDevice) => {
    setPhase("connecting");
    setError(null);
    setDevice(dev);
    try {
      const conn = await ecu.transport.connect(dev);
      setConnection(conn);
      const id = await ecu.protocol.handshake(ecu.transport, conn);
      setIdentity(id);
      setPhase("connected");
    } catch (err) {
      setPhase("error");
      setError(String(err));
    }
  }, [ecu]);

  const handleDisconnect = useCallback(async () => {
    if (!connection) return;
    try {
      await ecu.transport.disconnect(connection);
    } catch { /* ignore */ }
    setIdentity(null);
    setConnection(null);
    setDevice(null);
    setPhase("idle");
  }, [connection, ecu]);

  // Loading state
  if (!brand) {
    return (
      <div style={{
        height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg-deep)", color: "var(--text-secondary)", flexDirection: "column", gap: 16,
      }}>
        <div style={{
          width: 48, height: 48, border: "3px solid var(--border)",
          borderTopColor: "var(--accent)", borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
          Loading {brand ? brand.productName + " Studio" : "ECU Studio"}...
        </span>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar active={page} onNavigate={setPage} />
      <div className="main">
        <ConnectionBar
          connState={phase === "connected" ? ConnectionState.CONNECTED : phase === "connecting" || phase === "discovering" ? ConnectionState.CONNECTING : ConnectionState.DISCONNECTED}
          identity={identity}
          device={device}
          phase={phase}
          onDiscover={handleDiscover}
          onDisconnect={handleDisconnect}
        />
        <div className="content">
          {error && (
            <div style={{
              padding: "8px 16px", marginBottom: 16,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, fontSize: 13, color: "#ef4444",
            }}>
              {error}
            </div>
          )}
          {page === "dashboard" && <Dashboard connected={phase === "connected"} />}
          {page === "calibration" && <Calibration />}
          {page === "diagnostics" && <Diagnostics />}
          {page === "settings" && <Settings />}
        </div>
      </div>
    </div>
  );
}

export default App;
