import { useState, useCallback } from "react";
import {
  EcuService,
  EcuIdentity,
  EcuProtocol,
} from "../core/transport/EcuProtocol";
import { EcuTransport, ConnectionState, EcuDevice } from "../core/transport/EcuTransport";
import { UsbTransport } from "../core/transport/UsbTransport";
import { RusEFIProtocol } from "../core/transport/RusEFIProtocol";

// ---- Initialize services ----
let ecuService: EcuService | null = null;

function getEcuService(): EcuService {
  if (!ecuService) {
    const transport: EcuTransport = new UsbTransport();
    const protocol: EcuProtocol = new RusEFIProtocol();
    ecuService = new EcuService(protocol, transport);
  }
  return ecuService;
}

// ---- ECU Connection Panel ----
export function EcuConnectionPanel() {
  const service = getEcuService();
  const [state, setState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [identity, setIdentity] = useState<EcuIdentity | null>(null);
  const [devices, setDevices] = useState<EcuDevice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const handleDiscover = useCallback(async () => {
    setError(null);
    try {
      const found = await service.discover();
      setDevices(found);
    } catch (e) {
      setError(String(e));
    }
  }, [service]);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      let deviceList = devices;
      if (deviceList.length === 0) {
        deviceList = await service.discover();
        setDevices(deviceList);
      }

      if (deviceList.length === 0) {
        setError("No ECU devices found. Connect ECU via USB and try again.");
        setConnecting(false);
        return;
      }

      const id = await service.connect(deviceList[0]);
      setIdentity(id);
      setState(ConnectionState.CONNECTED);
    } catch (e) {
      setError(`Connection failed: ${e}`);
    } finally {
      setConnecting(false);
    }
  }, [service, devices]);

  const handleDisconnect = useCallback(async () => {
    try {
      await service.disconnect({ id: "", device: {} as EcuDevice, connectedAt: 0 });
    } catch {
      // best-effort
    }
    setIdentity(null);
    setState(ConnectionState.DISCONNECTED);
    setError(null);
  }, [service]);

  const isConnected = state === ConnectionState.CONNECTED;
  const isConnecting = connecting || state === ConnectionState.CONNECTING || state === ConnectionState.DISCOVERING;

  return (
    <div className="ecu-panel">
      <div className="ecu-header">
        <div className={`connection-indicator ${isConnected ? "connected" : "disconnected"}`}>
          <span className="status-dot" />
          <span>{isConnected ? "ECU Connected" : "ECU Disconnected"}</span>
        </div>
        <div className="ecu-actions">
          {!isConnected ? (
            <div className="button-group">
              <button
                className="btn btn-secondary"
                onClick={handleDiscover}
                disabled={isConnecting}
              >
                🔍 Scan
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? "⏳ Connecting..." : "📡 Connect"}
              </button>
            </div>
          ) : (
            <button className="btn btn-danger" onClick={handleDisconnect}>
              ⏏ Disconnect
            </button>
          )}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="ecu-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button className="btn-text" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Devices found */}
      {devices.length > 0 && !isConnected && (
        <div className="ecu-devices">
          <div className="devices-label">Found {devices.length} device(s):</div>
          {devices.map((d) => (
            <div key={d.id} className="device-item">
              <span className="device-icon">🔌</span>
              <span className="device-name">{d.name}</span>
              <span className="device-path">{d.path}</span>
              {d.serialNumber && (
                <span className="device-serial">SN: {d.serialNumber}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ECU Identity */}
      {identity && (
        <div className="ecu-identity">
          <div className="identity-header">ECU Identity</div>
          <div className="identity-grid">
            <div className="identity-row">
              <span className="identity-label">Vendor</span>
              <span className="identity-value">{identity.vendor}</span>
            </div>
            <div className="identity-row">
              <span className="identity-label">Board</span>
              <span className="identity-value">{identity.board}</span>
            </div>
            <div className="identity-row">
              <span className="identity-label">Firmware</span>
              <span className="identity-value">{identity.firmware}</span>
            </div>
            <div className="identity-row">
              <span className="identity-label">Protocol</span>
              <span className="identity-value">v{identity.protocol}</span>
            </div>
            <div className="identity-row">
              <span className="identity-label">Serial</span>
              <span className="identity-value mono">{identity.serial}</span>
            </div>
            <div className="identity-row">
              <span className="identity-label">Git SHA</span>
              <span className="identity-value mono">{identity.gitSha.slice(0, 7)}</span>
            </div>
            {identity.features.length > 0 && (
              <div className="identity-row">
                <span className="identity-label">Features</span>
                <span className="identity-value">
                  {identity.features.map((f) => (
                    <span key={f} className="feature-tag">{f}</span>
                  ))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
