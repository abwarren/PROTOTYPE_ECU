import { useState, useEffect } from "react";

interface BrandConfig {
  brand: {
    product_name: string;
    product_short_name: string;
    company_name: string;
    product_version: string;
  };
  studio: {
    window_title: string;
    default_theme: string;
  };
}

function App() {
  const [brand, setBrand] = useState<BrandConfig | null>(null);

  useEffect(() => {
    // Load branding from brand.json (relative to project root)
    fetch("/branding/brand.json")
      .then((res) => res.json())
      .then((data: BrandConfig) => {
        setBrand(data);
        document.title = data.brand.product_name;
      })
      .catch(() => {
        // Fallback if brand.json not accessible in dev mode
        setBrand({
          brand: {
            product_name: "Prototype ECU",
            product_short_name: "ProtoECU",
            company_name: "ECU Platform",
            product_version: "0.1.0-dev",
          },
          studio: { window_title: "Prototype Studio", default_theme: "dark" },
        });
      });
  }, []);

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
        <h1>{brand.brand.product_name}</h1>
        <span className="version">v{brand.brand.product_version}</span>
      </header>
      <main className="app-main">
        <div className="welcome-card">
          <h2>Welcome to {brand.brand.product_name}</h2>
          <p>{brand.brand.company_name}</p>
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
        <span>{brand.brand.company_name}</span>
        <span>Studio v{brand.brand.product_version}</span>
      </footer>
    </div>
  );
}

export default App;
