interface BarGaugeProps {
  label: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  warning?: number;
  danger?: number;
  decimals?: number;
}

export default function BarGauge({
  label, value, unit, min = 0, max = 100,
  warning = 80, danger = 90, decimals = 1,
}: BarGaugeProps) {
  const pct = Math.max(0, Math.min((value - min) / (max - min) * 100, 100));
  const cls = value >= danger ? "danger" : value >= warning ? "warning" : "";

  return (
    <div className="gauge-card">
      <div className="gauge-mini-row">
        <span className="gauge-label" style={{ flex: 1 }}>{label}</span>
        <span className="gauge-value" style={{ fontSize: 16 }}>
          {value.toFixed(decimals)}
          <span className="gauge-unit">{unit}</span>
        </span>
      </div>
      <div className="bar-gauge">
        <div className={`bar-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
