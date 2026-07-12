// TachGauge — Large RPM tachometer with sweep animation
// Unique: Neon-cyan arc, digital readout, LED-style shift lights

import { useMemo } from "react";

interface TachGaugeProps {
  rpm: number;
  maxRpm?: number;
  redline?: number;
}

export default function TachGauge({ rpm, maxRpm = 8000, redline = 7000 }: TachGaugeProps) {
  const angle = useMemo(() => {
    const pct = Math.min(rpm / maxRpm, 1);
    return -135 + pct * 270; // sweep from -135° to +135°
  }, [rpm, maxRpm]);

  const redlineAngle = useMemo(() => -135 + (redline / maxRpm) * 270, [redline, maxRpm]);

  // Shift light logic
  const shiftLight = rpm > redline;
  const nearRedline = rpm > redline - 500 && rpm <= redline;

  // Arc path
  const cx = 140;
  const cy = 140;
  const needleLen = 95;

  const needleX = cx + needleLen * Math.cos((angle - 90) * (Math.PI / 180));
  const needleY = cy + needleLen * Math.sin((angle - 90) * (Math.PI / 180));

  return (
    <div className="tach-container">
      <svg viewBox="0 0 280 190" className="tach-svg">
        {/* Background arc (track) */}
        <path
          d="M 30 160 A 110 110 0 1 1 250 160"
          fill="none"
          stroke="#1a2640"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Redline zone */}
        <path
          d={describeArc(cx, cy, 110, -135, redlineAngle)}
          fill="none"
          stroke="#ef4444"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.3"
        />
        {/* Fill arc */}
        <path
          d={describeArc(cx, cy, 110, -135, angle)}
          fill="none"
          stroke={shiftLight ? "#ef4444" : nearRedline ? "#f5a623" : "#00d4b0"}
          strokeWidth="8"
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${shiftLight ? "#ef4444" : nearRedline ? "#f5a623" : "#00d4b080"})`,
            transition: "all 0.15s ease",
          }}
        />
        {/* Tick marks */}
        {[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000].map((val, i) => {
          const a = -135 + (val / maxRpm) * 270;
          const innerR = 100;
          const outerR = val % 2000 === 0 ? 112 : 107;
          const x1 = cx + innerR * Math.cos((a - 90) * (Math.PI / 180));
          const y1 = cy + innerR * Math.sin((a - 90) * (Math.PI / 180));
          const x2 = cx + outerR * Math.cos((a - 90) * (Math.PI / 180));
          const y2 = cy + outerR * Math.sin((a - 90) * (Math.PI / 180));
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={val >= redline ? "#ef4444" : "#4a5a78"}
              strokeWidth={val % 2000 === 0 ? 2 : 1}
            />
          );
        })}
        {/* Numeric labels */}
        {[0, 2, 4, 6, 8].map((val) => {
          const a = -135 + ((val * 1000) / maxRpm) * 270;
          const r = 80;
          const x = cx + r * Math.cos((a - 90) * (Math.PI / 180));
          const y = cy + r * Math.sin((a - 90) * (Math.PI / 180));
          return (
            <text
              key={val}
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={val * 1000 >= redline ? "#ef4444" : "#4a5a78"}
              fontSize="10"
              fontFamily="'JetBrains Mono', monospace"
            >
              {val}
            </text>
          );
        })}
        {/* Needle */}
        <g style={{ transition: "all 0.15s ease" }}>
          <line
            x1={cx} y1={cy}
            x2={needleX} y2={needleY}
            stroke={shiftLight ? "#ef4444" : "#00d4b0"}
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 4px ${shiftLight ? "#ef4444" : "#00d4b0"})`,
            }}
          />
          {/* Center dot */}
          <circle cx={cx} cy={cy} r="6" fill="#00d4b0" />
          <circle cx={cx} cy={cy} r="3" fill="#080c12" />
        </g>
        {/* Shift light indicator */}
        {shiftLight && (
          <g>
            <text
              x={cx} y={24}
              textAnchor="middle"
              fill="#ef4444"
              fontSize="14"
              fontWeight="800"
              fontFamily="'JetBrains Mono', monospace"
              style={{ animation: "pulse 0.4s infinite" }}
            >
              SHIFT
            </text>
          </g>
        )}
      </svg>

      {/* Digital readout */}
      <div
        className="tach-value"
        style={{
          color: shiftLight ? "#ef4444" : nearRedline ? "#f5a623" : "#e8edf5",
          transition: "color 0.15s",
        }}
      >
        {Math.round(rpm)}
      </div>
      <div className="tach-unit">RPM</div>
    </div>
  );
}

// Helper: SVG arc path
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}
