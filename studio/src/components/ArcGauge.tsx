// ArcGauge — Small circular gauge for temps, pressure, voltage
// Unique: compact neon arc with digital readout

interface ArcGaugeProps {
  label: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  warning?: number;
  danger?: number;
  decimals?: number;
}

export default function ArcGauge({
  label, value, unit, min = 0, max = 100,
  warning = 80, danger = 90, decimals = 0,
}: ArcGaugeProps) {
  const pct = Math.max(0, Math.min((value - min) / (max - min), 1));
  const angle = -120 + pct * 240;
  const cx = 60; const cy = 65; const r = 50;

  const color = value >= danger ? "#ef4444" : value >= warning ? "#f5a623" : "#00d4b0";

  const needleX = cx + r * 0.7 * Math.cos((angle - 90) * (Math.PI / 180));
  const needleY = cy + r * 0.7 * Math.sin((angle - 90) * (Math.PI / 180));

  return (
    <div className="gauge-card text-center" style={{ minHeight: 180 }}>
      <div className="gauge-label" style={{ textAlign: "center", marginBottom: 2 }}>{label}</div>
      <svg viewBox="0 0 120 100" style={{ width: "100%", maxWidth: 140, margin: "0 auto" }}>
        {/* Track */}
        <path
          d={describeArc(cx, cy, r, -120, 120)}
          fill="none" stroke="#1a2640" strokeWidth="6" strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={describeArc(cx, cy, r, -120, angle)}
          fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 3px ${color}80)`, transition: "all 0.3s ease" }}
        />
        {/* Needle */}
        <line
          x1={cx} y1={cy} x2={needleX} y2={needleY}
          stroke={color} strokeWidth="2" strokeLinecap="round"
          style={{ transition: "all 0.3s ease" }}
        />
        <circle cx={cx} cy={cy} r="3" fill={color} />
      </svg>
      <div style={{ fontSize: 18, fontWeight: 700, color: color, transition: "color 0.3s", marginTop: -4 }}>
        {value.toFixed(decimals)}
        <span style={{ fontSize: 11, color: "#4a5a78", marginLeft: 2 }}>{unit}</span>
      </div>
    </div>
  );
}

function describeArc(cx: number, cy: number, r: number, s: number, e: number): string {
  const p1 = polar(cx, cy, r, e);
  const p2 = polar(cx, cy, r, s);
  const la = e - s <= 180 ? "0" : "1";
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${la} 0 ${p2.x} ${p2.y}`;
}
function polar(cx: number, cy: number, r: number, a: number) {
  const rad = ((a - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
