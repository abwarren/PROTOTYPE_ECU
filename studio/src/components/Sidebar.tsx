type PageTab = "dashboard" | "calibration" | "diagnostics" | "settings";

interface SidebarProps {
  active: PageTab;
  onNavigate: (tab: PageTab) => void;
}

const icons: Record<PageTab, string> = {
  dashboard: "\u25B6",
  calibration: "\u2699",
  diagnostics: "\u26A0",
  settings: "\u22EF",
};

const labels: Record<PageTab, string> = {
  dashboard: "Dash",
  calibration: "Tune",
  diagnostics: "Diag",
  settings: "Setup",
};

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  const tabs: PageTab[] = ["dashboard", "calibration", "diagnostics", "settings"];

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">7</div>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`nav-btn ${active === tab ? "active" : ""}`}
          onClick={() => onNavigate(tab)}
          title={labels[tab]}
        >
          {tab === "settings" ? "\u22EF" : icons[tab]}
        </button>
      ))}
    </nav>
  );
}
