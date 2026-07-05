import { EcuDevice, ConnectionState } from "../core/transport/EcuTransport";
import { EcuIdentity } from "../core/transport/EcuProtocol";

interface ConnectionBarProps {
  connState: ConnectionState;
  identity: EcuIdentity | null;
  device: EcuDevice | null;
  onDiscover: () => void;
  onDisconnect: () => void;
  phase: string;
}

export default function ConnectionBar({
  identity, device, onDiscover, onDisconnect, phase,
}: ConnectionBarProps) {
  const isConnecting = phase === "discovering" || phase === "connecting";
  const isConnected = phase === "connected";

  const stateClass =
    isConnected ? "connected" :
    isConnecting ? "connecting" :
    phase === "error" ? "error" : "";

  return (
    <div className="conn-bar">
      <span className={`conn-indicator ${stateClass}`} />
      <span className="conn-status">
        {isConnected ? "ECU Connected" :
         isConnecting ? phase === "discovering" ? "Scanning..." : "Connecting..." :
         phase === "error" ? "Connection Error" :
         "Disconnected"}
      </span>

      {identity && (
        <span className="identity-badge">
          {identity.board} · v{identity.firmware}
        </span>
      )}
      {device && <span className="conn-identity">{device.path}</span>}

      <div className="conn-bar-spacer" />

      <span className="brand-text">7100CPT Studio</span>

      <div style={{ flex: 1 }} />

      {isConnected ? (
        <button className="conn-btn" onClick={onDisconnect}>Disconnect</button>
      ) : (
        <button
          className="conn-btn primary"
          onClick={onDiscover}
          disabled={isConnecting}
        >
          {isConnecting ? "Scanning..." : "Find ECU"}
        </button>
      )}
    </div>
  );
}
