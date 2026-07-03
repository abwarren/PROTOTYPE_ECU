import { useBrand } from "../core/branding/BrandProvider";
import { UsbTransport } from "../core/transport/UsbTransport";
import { EcuService } from "../core/services/EcuService";
import { RusEFIProtocolAdapter } from "../adapters/RusEFIProtocolAdapter";
import {
  EcuDevice,
  Connection,
  ConnectionState,
} from "../core/transport/EcuTransport";
import { useState, useEffect, useCallback } from "react";

// ─── Singleton instances ───────────────────────────────────────────────
// Created once, live for the app lifetime. UI never touches Transport directly.

const transport = new UsbTransport();
const adapter = new RusEFIProtocolAdapter();
const ecu = new EcuService(adapter, transport);

// ─── App ────────────────────────────────────────────────────────────────

function App() {
  const brand = useBrand();

  // ── State ─────────────────────────────────────────────────────────

  const [devices, setDevices] = useState<EcuDevice[]>([]);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [connState, setConnState] = useState<ConnectionState>(
    ConnectionState.DISCONNECTED
  );
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [identity, setIdentity] = useState<string | null>(null);

  // ── Transport state listener ──────────────────────────────────────

  useEffect(() => {
    const unsub = transport.onStateChange((state, err) => {
      setConnState(state);
      if (err) setError(err.message);
    });
    return unsub;
  }, []);

  // ── Scan for devices ──────────────────────────────────────────────

  const scan = useCallback(async () => {
    setScanning(true);
    setError(null);
    try {
      const found = await transport.discover();
      setDevices(found);
    } catch (e) {
      setError(String(e));
    }
    setScanning(false);
  }, []);

  // ── Connect to device ─────────────────────────────────────────────

  const connect = useCallback(async (device: EcuDevice) => {
    setError(null);
    try {
      const conn = await transport.connect(device);
      setConnection(conn);
      // Try handshake with rusEFI
      try {
        const id = await ecu.connect(device);
        setIdentity(`${id.board} — ${id.firmware}`);
      } catch {
        setIdentity("Connected (handshake pending)");
      }
    } catch (e) {
      setError(String(e));
    }
  }, []);

  // ── Disconnect ────────────────────────────────────────────────────

  const disconnect = useCallback(async () => {
    if (connection) {
      await transport.disconnect(connection);
      setConnection(null);
      setIdentity(null);
      setError(null);
    }
  }, [connection]);

  // ── Auto-scan on first load ───────────────────────────────────────

  useEffect(() => {
    scan();
  }, [scan]);

  // ── Status helpers ────────────────────────────────────────────────

  const statusColor = (): string => {
    switch (connState) {
      case ConnectionState.CONNECTED: return "var(--accent-green)";
      case ConnectionState.CONNECTING: return "var(--accent-orange)";
      case ConnectionState.ERROR: return "var(--accent-red)";
      default: return "var(--accent-red)";
    }
  };

  const statusLabel = (): string => {
    if (identity) return identity;
    switch (connState) {
      case ConnectionState.DISCONNECTED: return "ECU Disconnected";
      case ConnectionState.DISCOVERING: return "Scanning...";
      case ConnectionState.CONNECTING: return "Connecting...";
      case ConnectionState.CONNECTED: return "ECU Connected";
      case ConnectionState.ERROR: return error || "Connection Error";
      default: return "Unknown";
    }
  };

  // ── Loading ────────────────────────────────────────────────────────

  if (!brand) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading 7100CPT Studio...</p>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="app">
      <header className="app-header">
        <h1>{brand.productName}</h1>
        <span className="version">v{brand.productVersion}</span>
      </header>

      <main className="app-main">
        {/* ── Main content area ── */}
        <div className="content-area">
          <div className="welcome-card">
            <h2>Welcome to {brand.productName}</h2>
            <p>{brand.companyName}</p>

            {/* Status indicator */}
            <div className="status-indicators">
              <div className="status-item" style={{ borderColor: statusColor() }}>
                <span className="status-dot" style={{ background: statusColor() }} />
                {statusLabel()}
              </div>
              {connection && (
                <div className="status-item connected">
                  <span className="status-dot" />
                  {connection.device.path}
                </div>
              )}
            </div>

            {/* Error display */}
            {error && connState === ConnectionState.ERROR && (
              <div className="error-banner">{error}</div>
            )}

            {/* Connection controls */}
            <div className="connection-controls">
              {!connection ? (
                <button
                  className="btn btn-primary"
                  onClick={scan}
                  disabled={scanning}
                >
                  {scanning ? "Scanning..." : "🔍 Scan for ECU"}
                </button>
              ) : (
                <button className="btn btn-danger" onClick={disconnect}>
                  Disconnect
                </button>
              )}
            </div>

            {/* Device list */}
            {devices.length > 0 && !connection && (
              <div className="device-list">
                <h3>Available Devices</h3>
                {devices.map((d) => (
                  <div
                    key={d.id}
                    className="device-item"
                    onClick={() => connect(d)}
                  >
                    <div className="device-name">{d.name}</div>
                    <div className="device-path">{d.path}</div>
                    <span className="device-action">Connect →</span>
                  </div>
                ))}
              </div>
            )}

            {devices.length === 0 && !scanning && !connection && (
              <p className="no-devices">
                No USB ECU devices found. Connect a 7100CPT or rusEFI ECU via USB.
              </p>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <nav className="app-nav">
          <button className="nav-item active">🚗 Garage</button>
          <button className="nav-item">📊 Dashboard</button>
          <button className="nav-item">🔥 Engine</button>
          <button className="nav-item">📈 Live Charts</button>
          <button className="nav-item">🧠 AI Assistant</button>
          <button className="nav-item">📋 Diagnostics</button>
          <button className="nav-item">⚙️ Firmware</button>
          <button className="nav-item">☁️ Cloud</button>
        </nav>
      </main>

      <footer className="app-footer">
        <span>{brand.companyName}</span>
        <span>
          Studio v{brand.productVersion} · {connState}
        </span>
      </footer>
    </div>
  );
}

export default App;
