// Dashboard — Main monitoring view
// Unique design: center tachometer surrounded by arc gauges and bar gauges

import { useEffect, useState } from "react";
import TachGauge from "./TachGauge";
import ArcGauge from "./ArcGauge";
import BarGauge from "./BarGauge";

interface SensorData {
  rpm: number;
  coolantTemp: number;
  intakeAirTemp: number;
  throttlePos: number;
  batteryVoltage: number;
  map: number;
  oilPressure: number;
  fuelPressure: number;
  afr: number;
  boost: number;
}

const DEFAULT_DATA: SensorData = {
  rpm: 0, coolantTemp: 82, intakeAirTemp: 35, throttlePos: 0,
  batteryVoltage: 13.8, map: 101, oilPressure: 45, fuelPressure: 58,
  afr: 14.7, boost: 0,
};

// Demo mode: simulates live data when no ECU connected
function simulateData(data: SensorData): SensorData {
  return {
    ...data,
    rpm: Math.max(0, data.rpm + (Math.random() - 0.5) * 200),
    coolantTemp: Math.max(70, Math.min(105, data.coolantTemp + (Math.random() - 0.5) * 2)),
    intakeAirTemp: Math.max(20, Math.min(50, data.intakeAirTemp + (Math.random() - 0.5) * 1.5)),
    throttlePos: Math.max(0, Math.min(100, data.throttlePos + (Math.random() - 0.5) * 3)),
    batteryVoltage: Math.max(12, Math.min(15, data.batteryVoltage + (Math.random() - 0.5) * 0.3)),
    map: Math.max(50, Math.min(150, data.map + (Math.random() - 0.5) * 3)),
    oilPressure: Math.max(0, Math.min(80, data.oilPressure + (Math.random() - 0.5) * 2)),
    fuelPressure: Math.max(40, Math.min(70, data.fuelPressure + (Math.random() - 0.5) * 1.5)),
    afr: Math.max(10, Math.min(20, data.afr + (Math.random() - 0.5) * 0.3)),
    boost: Math.max(-10, Math.min(30, data.boost + (Math.random() - 0.5) * 1)),
  };
}

interface DashboardProps {
  connected: boolean;
  // In future: receive live data from ECU service
}

export default function Dashboard({ connected }: DashboardProps) {
  const [data, setData] = useState<SensorData>(DEFAULT_DATA);
  const [demoMode, setDemoMode] = useState(!connected);

  useEffect(() => {
    setDemoMode(!connected);
  }, [connected]);

  useEffect(() => {
    if (!demoMode) return;
    const interval = setInterval(() => {
      setData((prev) => simulateData(prev));
    }, 200);
    return () => clearInterval(interval);
  }, [demoMode]);

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>{demoMode ? "DEMO MODE — connect to ECU for live data" : "Live telemetry"}</p>
      </div>

      {/* Main tachometer row */}
      <div className="gauge-grid">
        <div className="gauge-card wide" style={{ padding: "12px 24px" }}>
          <TachGauge rpm={data.rpm} maxRpm={8000} redline={7000} />
        </div>
      </div>

      {/* Arc gauges row */}
      <div className="gauge-grid">
        <ArcGauge label="Coolant" value={data.coolantTemp} unit="\u00B0C" max={130} warning={95} danger={105} />
        <ArcGauge label="Intake Air" value={data.intakeAirTemp} unit="\u00B0C" max={70} warning={55} danger={65} />
        <ArcGauge label="MAP" value={data.map} unit="kPa" min={50} max={150} warning={130} danger={145} />
        <ArcGauge label="Oil Press" value={data.oilPressure} unit="psi" max={80} warning={20} danger={10} />
      </div>

      {/* Bar gauges row */}
      <div className="gauge-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        <BarGauge label="Throttle" value={data.throttlePos} unit="%" warning={85} danger={95} />
        <BarGauge label="Boost" value={data.boost} unit="psi" max={30} warning={20} danger={28} />
        <BarGauge label="Battery" value={data.batteryVoltage} unit="V" min={11} max={15} warning={12.2} danger={11.5} />
        <BarGauge label="AFR" value={data.afr} unit="\u03BB" min={10} max={20} warning={16} danger={18} />
        <BarGauge label="Fuel Press" value={data.fuelPressure} unit="psi" max={80} warning={68} danger={75} />
      </div>
    </div>
  );
}
