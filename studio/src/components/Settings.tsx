// Settings — App configuration

export default function Settings() {
  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Studio application configuration</p>
      </div>

      <div className="settings-grid">
        {/* Connection */}
        <div className="settings-card">
          <h3>Connection</h3>
          <div className="setting-row">
            <div>
              <div className="setting-label">Auto-connect on startup</div>
              <div className="setting-desc">Automatically connect to last ECU</div>
            </div>
            <span className="setting-value">Off</span>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Default baud rate</div>
              <div className="setting-desc">Serial port speed</div>
            </div>
            <span className="setting-value">115200</span>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Heartbeat interval</div>
              <div className="setting-desc">Connection health check period</div>
            </div>
            <span className="setting-value">1000ms</span>
          </div>
        </div>

        {/* Display */}
        <div className="settings-card">
          <h3>Display</h3>
          <div className="setting-row">
            <div>
              <div className="setting-label">Theme</div>
              <div className="setting-desc">Color scheme</div>
            </div>
            <span className="setting-value">Dark (default)</span>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Gauge refresh rate</div>
              <div className="setting-desc">UI update frequency</div>
            </div>
            <span className="setting-value">50ms</span>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Dashboard layout</div>
              <div className="setting-desc">Gauge arrangement preset</div>
            </div>
            <span className="setting-value">Full</span>
          </div>
        </div>

        {/* Data */}
        <div className="settings-card">
          <h3>Data & Logging</h3>
          <div className="setting-row">
            <div>
              <div className="setting-label">Data logging</div>
              <div className="setting-desc">Record telemetry to disk</div>
            </div>
            <span className="setting-value">Off</span>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Log directory</div>
              <div className="setting-desc">Data file location</div>
            </div>
            <span className="setting-value" style={{ fontSize: 10 }}>
              ~/7100CPT/logs/
            </span>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Auto-save tunes</div>
              <div className="setting-desc">Save calibration on write</div>
            </div>
            <span className="setting-value">On</span>
          </div>
        </div>

        {/* About */}
        <div className="settings-card">
          <h3>About</h3>
          <div className="setting-row">
            <div>
              <div className="setting-label">Studio Version</div>
              <div className="setting-desc">Current build</div>
            </div>
            <span className="setting-value">0.1.0-dev</span>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Protocol</div>
              <div className="setting-desc">ECU communication standard</div>
            </div>
            <span className="setting-value">rusEFI TS v1</span>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Target Platform</div>
              <div className="setting-desc">Hardware architecture</div>
            </div>
            <span className="setting-value">NXP S32K344</span>
          </div>
          <div style={{ marginTop: 16, fontSize: 11, color: "var(--text-dim)", textAlign: "center" }}>
            \u00A9 2026 7100CPT Engineering
          </div>
        </div>
      </div>
    </div>
  );
}
