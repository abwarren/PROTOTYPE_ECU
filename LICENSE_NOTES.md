# License Information

## Overview

The ECU Platform Core is a composite project containing components under different licenses.

## Original Platform Code

All original code, documentation, designs, and assets created specifically for this platform are:

**Proprietary** — All rights reserved.

Copyright (c) 2024 ECU Platform Inc.

## Third-Party and Open-Source Components

### Firmware

The firmware is based on a fork of [rusEFI](https://github.com/rusefi/rusefi), which is licensed under:

- **GNU General Public License v3.0 (GPL-3.0)** — Firmware source code
- Refer to `firmware/upstream/LICENSE` for the full license text

**Implications:**
- Modifications to the GPL-3.0 firmware must be distributed under GPL-3.0
- The desktop application, cloud services, and mobile app are separate works and not subject to the firmware's GPL license
- Proprietary modules that communicate with the firmware via standard protocols (CAN, USB, etc.) are considered independent works

### Other Components

| Component | License | Location |
|-----------|---------|----------|
| FreeRTOS | MIT | firmware/ |
| STM32 HAL | BSD-3-Clause | firmware/ |
| Lua (if used) | MIT | firmware/ |
| OpenOCD | GPL-2.0 | tools/ (developer use only) |
| Electron | MIT | studio/ |
| React | MIT | studio/ |
| Flutter | BSD-3-Clause | mobile/ |

## Branding Assets

All branding assets in `branding/` (logos, icons, themes, fonts) are proprietary and may not be used without permission.

## Compliance

This project respects all upstream licenses. For any questions about license compatibility or commercial use, contact the project maintainers.

## License Strategy

The platform is structured so that:
1. The GPL-3.0 firmware can be progressively rewritten into proprietary modules
2. The desktop application (Studio) is MIT-licensed or proprietary
3. Cloud services are proprietary
4. Mobile app is proprietary
5. No customer-facing component is encumbered by the firmware's GPL license
