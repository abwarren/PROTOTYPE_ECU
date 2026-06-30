#!/usr/bin/env bash
# =============================================================================
# Firmware Build Script — ECU Platform Core
# =============================================================================
# Usage:
#   ./scripts/build-firmware.sh [board]
#   ./scripts/build-firmware.sh f407-discovery  (default)
# =============================================================================
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BOARD="${1:-f407-discovery}"

# Find ARM GCC — check PATH first, then common locations
ARM_GCC=""
for candidate in arm-none-eabi-gcc \
    /opt/gcc-arm-none-eabi/bin/arm-none-eabi-gcc \
    /home/wa/tools/gcc-arm/bin/arm-none-eabi-gcc \
    /home/wa/tools/gcc-12/bin/arm-none-eabi-gcc; do
    if command -v "$candidate" &>/dev/null || [[ -x "$candidate" ]]; then
        ARM_GCC="$candidate"
        break
    fi
done

if [[ -z "$ARM_GCC" ]]; then
    echo "ERROR: ARM GCC not found. Install from ARM Developer website:"
    echo "  https://developer.arm.com/downloads/-/gnu-rm"
    echo ""
    echo "Or set ARM_GCC_PATH environment variable."
    exit 1
fi
ARM_GCC_DIR="$(dirname "$(dirname "$ARM_GCC")")"
export PATH="$ARM_GCC_DIR/bin:$PATH"

# Find Java — check env var, then PATH
if [[ -n "${JAVA_HOME:-}" ]]; then
    export JAVA_HOME
    echo "Java found at JAVA_HOME=$JAVA_HOME"
elif command -v java &>/dev/null; then
    echo "Java found at $(which java)"
else
    echo "WARNING: Java not found — the rusEFI build WILL fail at code generation."
    echo "Install with: curl -fsSL https://get.sdkman.io | bash && source \$HOME/.sdkman/bin/sdkman-init.sh && sdk install java"
    echo "Or manually: https://adoptium.net/temurin/releases/"
    exit 1
fi

echo "Building firmware for board: $BOARD"
echo "ARM GCC: $(arm-none-eabi-gcc --version | head -1)"
echo ""

cd "$PROJECT_ROOT/firmware/upstream"
make firmware "$BOARD" -j$(nproc)

echo ""
echo "Build complete. Binary at: firmware/upstream/firmware/build/"
