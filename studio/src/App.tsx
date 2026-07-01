import { useBrand } from "../core/branding/BrandProvider";
import { useState } from "react";

function App() {
  const brand = useBrand();

  if (!brand) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading Prototype Studio...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>{brand.productName}</h1>
        <span className="version">v{brand.productVersion}</span>
      </header>
      <main className="app-main">
        <div className="welcome-card">
          <h2>Welcome to {brand.productName}</h2>
          <p>{brand.companyName}</p>
          <div className="status-indicators">
            <div className="status-item disconnected">
              <span className="status-dot" />
              ECU Disconnected
            </div>
            <div className="status-item offline">
              <span className="status-dot" />
              Working Offline
            </div>
          </div>
        </div>
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
        <span>Studio v{brand.productVersion}</span>
      </footer>
    </div>
  );
}

export default App;
