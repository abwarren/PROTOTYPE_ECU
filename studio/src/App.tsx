import { useBrand } from "../core/branding/BrandProvider";
import { useState, useEffect, useCallback } from "react";
import { UsbTransport } from "../core/transport/UsbTransport";
import { RusEfiProtocol } from "../core/transport/RusEfiProtocol";
import { EcuIdentity } from "../core/transport/EcuProtocol";
import {
  EcuDevice,
  Connection,
  ConnectionState,
} from "../core/transport/EcuTransport";

type AppPhase = "idle" | "discovering" | "connecting" | "connected" | "error";

function App() {
  const brand = useBrand();
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [ports, setPorts] = useState<EcuDevice[]>([]);
  const [identity, setIdentity] = useState<EcuIdentity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [connState, setConnState] = useState<ConnectionState>(
    ConnectionState.DISCONNECTED
  );

  // Initialize transport + protocol + service once
  const [ecu] = useState(() => {
    const transport = new UsbTransport();
    const protocol = new RusEfiProtocol(transport);
    return { transport, protocol };
  });

  useEffect(() => {
    // Listen for state changes
    ecu.transport.onStateChange((state, err) => {
      setConnState(state);
      if (err) setError(`Transport: ${err.message}`);
    });
  }, []);

  // ---- Actions ----

  const handleDiscover = useCallback(async () => {
    setPhase("discovering");
    setError(null);

    try {
      const devices = await ecu.transport.discover();
      setPorts(devices);
      setPhase(devices.length > 0 ? "idle" : "error");
      if (devices.length === 0) {
        setError(
          "No serial ports found. Is the ECU connected via USB?"
        );
      }
    } catch (err) {
      setPhase("error");
      setError(`Discovery failed: ${err}`);
    }
  }, []);

  const handleConnect = useCallback(
    async (device: EcuDevice) => {
      setPhase("connecting");
      setError(null);

      try {
        const conn = await ecu.transport.connect(device);
        setConnection(conn);

        // Handshake — get ECU identity
        const id = await ecu.protocol.handshake(ecu.transport, conn);
        setIdentity(id);
        setPhase("connected");
      } catch (err) {
        setPhase("error");
        setError(`Connection failed: ${err}`);
      }
    },
    [ecu]
  );

  const handleDisconnect = useCallback(async () => {
    if (!connection) return;

    try {
      await ecu.transport.disconnect(connection);
    } catch (err) {
      console.error("Disconnect error:", err);
    }

    setIdentity(null);
    setConnection(null);
    setPhase("idle");
  }, [connection, ecu]);

  // ---- Loading State ----

  if (!brand) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading Prototype Studio...</p>
      </div>
    );
  }

  // ---- Layout ----

  return (
    <div className="app">
      <header className="app-header">
        <h1>{brand.productName}</h1>
        <span className="version">v{brand.productVersion}</span>
      </header>

      <main className="app-main">
        {/* Connection Panel */}
        <div className="connection-panel">
          <div className="panel-header">
            <h2>ECU Connection</h2>
            <span
              className={`connection-badge ${
                phase === "connected"
                  ? "connected"
                  : phase === "connecting"
                    ? "connecting"
                    : "disconnected"
              }`}
            >
              {phase === "connected"
                ? "Connected"
                : phase === "connecting"
                  ? "Connecting..."
                  : "Disconnected"}
            </span>
          </div>

          {/* Actions */}
          <div className="connection-actions">
            <button
              className="btn btn-primary"
              onClick={handleDiscover}
              disabled={phase === "discovering" || phase === "connecting"}
            >
              {phase === "discovering"
                ? "Scanning..."
                : "Discover ECUs"}
            </button>

            {connection && (
              <button
                className="btn btn-secondary"
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="error-box">
              <span className="error-icon">{'\u26A0'}</span>
              <span>{error}</span>
            </div>
          )}

          {/* Port List */}
          {ports.length > 0 && phase !== "connected" && (
            <div className="port-list">
              <h3>Available Ports ({ports.length})</h3>
              {ports.map((p) => (
                <div
                  key={p.id}
                  className="port-item"
                  onClick={() => handleConnect(p)}
                >
                  <div className="port-name">{p.name}</div>
                  <div className="port-details">
                    {p.path}
                    <span className="port-badge">{p.transport}</span>
                  </div>
                  <button
                    className="btn btn-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnect(p);
                    }}
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ECU Identity Panel — visible when connected */}
        {phase === "connected" && identity && (
          <div className="identity-panel">
            <h2>ECU Identity</h2>
            <table className="identity-table">
              <tbody>
                <tr>
                  <td>Vendor</td>
                  <td>{identity.vendor}</td>
                </tr>
                <tr>
                  <td>Board</td>
                  <td className="highlight">{identity.board}</td>
                </tr>
                <tr>
                  <td>Firmware</td>
                  <td>{identity.firmware}</td>
                </tr>
                <tr>
                  <td>Protocol</td>
                  <td>v{identity.protocol}</td>
                </tr>
                <tr>
                  <td>Signature</td>
                  <td className="mono">{identity.serial}</td>
                </tr>
                <tr>
                  <td>Features</td>
                  <td>
                    {identity.features.map((f: string) => (
                      <span key={f} className="feature-tag">
                        {f}
                      </span>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Navigation (keep existing) */}
        {phase !== "connected" && (
          <nav className="app-nav">
            <button className="nav-item active">{'\uD83D\uDE97'} Garage</button>
            <button className="nav-item">{'\uD83D\uDCCA'} Dashboard</button>
            <button className="nav-item">{'\uD83D\uDD25'} Engine</button>
            <button className="nav-item">{'\uD83D\uDCC8'} Live Charts</button>
            <button className="nav-item">{'\uD83E\uDDE0'} AI Assistant</button>
            <button className="nav-item">{'\uD83D\uDCCB'} Diagnostics</button>
            <button className="nav-item">{'\u2699\uFE0F'} Firmware</button>
            <button className="nav-item">{'\u2601\uFE0F'} Cloud</button>
          </nav>
        )}
      </main>

      <footer className="app-footer">
        <span>{brand.companyName}</span>
        <span>
          Studio v{brand.productVersion}
          {connState === ConnectionState.CONNECTED && " \u00B7 ECU Connected"}
        </span>
      </footer>
    </div>
  );
}

export default App;
