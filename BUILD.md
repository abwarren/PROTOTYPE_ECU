# Build Instructions

## Prerequisites

### Firmware

| Tool | Version | Purpose |
|------|---------|---------|
| GCC ARM Embedded | 10.3-2021.10+ | ARM Cortex-M cross-compiler |
| GNU Make | 4.0+ | Build system |
| Python 3 | 3.8+ | Build scripts and code generation |
| OpenOCD | 0.11+ | Flashing and debugging |
| Docker | 20.10+ | Reproducible builds (optional) |

### Studio

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Runtime |
| npm / pnpm | latest | Package management |
| Electron | 28+ | Desktop framework |

### Mobile

| Tool | Version | Purpose |
|------|---------|---------|
| Flutter | 3.16+ | Cross-platform mobile framework |
| Dart SDK | 3.2+ | Language runtime |

### Cloud

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | API runtime |
| Docker Compose | 2.0+ | Local development environment |

## Building Firmware

```bash
# Navigate to firmware directory
cd firmware

# Build firmware
make -j$(nproc)

# The output binary will be at:
# firmware/build/<product_name>.bin
# firmware/build/<product_name>.elf
```

### Build Options

```bash
make BOARD=<board_id>    # Select target board
make DEBUG=1              # Build with debug symbols
make RELEASE=1            # Optimized release build
make VERBOSE=1            # Verbose output
```

### Branding Injection

Firmware branding strings are injected at compile time from `branding/brand.json`:

```bash
make BRAND_CONFIG=../branding/brand.json
```

## Building Studio

```bash
cd studio
npm install
npm run dev     # Development mode
npm run build   # Production build
npm run package # Package for distribution
```

### Branding in Studio

Studio loads branding dynamically from `branding/brand.json` at runtime. No rebuild needed for brand changes.

## Flashing Firmware

### Via OpenOCD (Development)

```bash
cd firmware
make flash
```

### Via DFU (USB)

```bash
cd firmware
make dfu
```

### Via Studio (User)

1. Connect ECU via USB
2. Open Studio → Firmware tab
3. Select firmware binary
4. Click "Update"

## Recovery Process

If the ECU becomes unresponsive after a firmware update:

1. Press and hold the BOOT button while powering on
2. Connect via USB
3. Use DFU mode to flash known-good firmware:

```bash
cd firmware
make dfu-recovery
```

## Supported Hardware

| Board ID | MCU | Flash | RAM | Status |
|----------|-----|-------|-----|--------|
| EPC-BASE-01 | STM32H743 | 2MB | 1MB | Development |
| EPC-BASE-02 | STM32H753 | 2MB | 1MB | Planned |

## Docker Build

```bash
# Build firmware in Docker
cd firmware
docker build -t ecu-firmware-builder .
docker run --rm -v $(pwd):/build ecu-firmware-builder
```
