# 🎛️ Tuning Guide

> **Audience:** Workshop technicians and experienced tuners
> **Last updated:** 2026-06-30

---

## Tuning Process Overview

1. **Base Configuration** — Set engine parameters, trigger pattern, injectors, ignition
2. **Startup** — Get the engine running with safe base settings
3. **Idle Tuning** — Smooth, stable idle at target RPM
4. **Part Throttle** — Drivability tuning for everyday operation
5. **Full Throttle** — Performance tuning for maximum power
6. **Knock Management** — Verify knock control and adjust timing
7. **Cold Start** — Enrichment tuning for cold operation
8. **Hot Restart** — Verify hot restart behavior
9. **Validation** — Road test with datalogging

## Safety First

| Setting | Safe Default | Max | Notes |
|---------|-------------|-----|-------|
| AFR target (idle) | 14.7 (stoich) | 12.5-16.0 | Rich = safe, lean = power |
| AFR target (WOT) | 12.5 | 11.5-13.0 | Rich for safety |
| Ignition timing (idle) | 10° BTDC | 5-20° | Advanced too far = knock |
| Ignition timing (WOT) | 24° BTDC | 18-35° | Depends on fuel and boost |
| Boost (if applicable) | 5 psi | Engine limits | Increase in 1 psi steps |
| Rev limit | 500 RPM below max | Engine limits | Set with safety margin |

## Tuning Workflow

### Step 1: Get It Running
1. Load base map for engine type
2. Set trigger pattern correctly (critical!)
3. Set injector flow rate and dead time
4. Set base timing with timing light (verify)
5. Set cranking fuel and prime pulse
6. Start engine — adjust idle air and fuel as needed

### Step 2: Idle Tuning with Auto-Tune
- Enable closed-loop lambda control
- Let auto-tune adjust VE table at idle
- Target: stable idle within ±0.05 AFR
- Set idle speed control (IAC/stepper)

### Step 3: Part-Throttle Tuning
- Drive at steady RPM/load points
- Auto-tune adjusts VE in real-time
- Focus on: light cruise, moderate acceleration, deceleration
- Verify transients (tip-in, tip-out)

### Step 4: Full-Throttle Tuning
- Safe AFR (12.5:1 or richer)
- Gradually increase load
- Monitor: AFR, knock, EGT, fuel pressure
- Log every pull for analysis

### Step 5: Ignition Timing
- Start conservative (retarded)
- Advance in 1° increments
- Watch for knock (listen + sensors)
- Stop advancing when knock detected or power stops increasing

## Common Issues

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Won't start | Trigger pattern wrong | Verify with timing light |
| Rough idle | VE table, idle air | Auto-tune idle cells |
| Lean at WOT | VE table, fuel pressure | Check fuel pump, increase VE |
| Rich at cruise | VE table, O2 sensor | Check O2 sensor calibration |
| Overheating | Timing too retarded | Advance timing 2-5° |
| Knocking at light throttle | Timing too advanced | Retard timing 2-3°, improve fuel |
