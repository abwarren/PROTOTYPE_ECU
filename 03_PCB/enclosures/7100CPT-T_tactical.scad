// ============================================================================
// 7100CPT-T "Tactical" — Olive drab military-style with heatsink fins
// Matches the landscape military-green render style
// ============================================================================
// Envelope: 180mm x 130mm x 42mm (larger, rugged)

pcb_x = 160;
pcb_y = 110;
wall = 4;
clearance = 3;

encl_x = pcb_x + 2*wall + 2*clearance; // 180
encl_y = pcb_y + 2*wall + 2*clearance; // 130
encl_z = 42;
base_z = 5;
inner_h = encl_z - base_z - 3; // lid height = 3

// Heat sink fins
fin_count = 12;
fin_height = 8;
fin_thick = 2;
fin_gap = (encl_y - 20) / fin_count;

// Corner bumpers
bumper_r = 12;
bumper_h = 6;

// Olive drab palette (military green / khaki)
// Body: dark olive #3C3A2E
// Accent: lighter olive #5B5230
// Highlight: bright green #769728 (small accents)
// Hardware: flat gray #625E57

$fn = 32;

// ====================================================================
// MAIN BODY — trapezoidal cross-section with corner bumpers
// ====================================================================
module body() {
  difference() {
    union() {
      // Main body with slight taper
      hull() {
        translate([wall, wall, base_z])
          cube([encl_x - 2*wall, encl_y - 2*wall, inner_h]);
        // Slightly wider at bottom for taper
        translate([wall - 1, wall - 1, base_z])
          cube([encl_x - 2*wall + 2, encl_y - 2*wall + 2, 1]);
      }

      // Corner bumpers
      for (x = [bumper_r, encl_x - bumper_r])
        for (y = [bumper_r, encl_y - bumper_r])
          translate([x, y, base_z])
            cylinder(r = bumper_r, h = bumper_h, $fn = 20);
    }

    // Interior cavity
    translate([wall + clearance, wall + clearance, base_z + 1])
      cube([pcb_x, pcb_y, inner_h + 2]);

    // PCB standoffs (M3)
    for (x = [wall + clearance + 6, wall + clearance + pcb_x - 6])
      for (y = [wall + clearance + 6, wall + clearance + pcb_y - 6])
        translate([x, y, base_z]) {
          cylinder(h = 4, r = 3, $fn = 16);
          cylinder(h = 8, r = 1.6, $fn = 16);
        }

    // Connector cutouts - recessed in olive-drab gasket panels
    // Main connector (left, recessed panel)
    translate([wall - 2, (encl_y - 70)/2, base_z + 5])
      cube([wall + 4, 70, 16]);

    // CAN connectors (top, recessed)
    for (d = [25, 55]) {
      translate([wall + clearance + d, encl_y - wall/2, base_z + 6])
        cube([22, wall + 2, 12]);
    }

    // USB-C (right side)
    translate([encl_x - wall/2, encl_y - 40, base_z + 9])
      cube([wall + 2, 12, 5]);

    // Power LED indicator
    translate([encl_x/2 - 5, encl_y - wall - 6, base_z + 3])
      cube([10, 4, 2]);

    // Side recessed grip grooves (both sides)
    for (side_x = [2, encl_x - wall - 2]) {
      for (i = [0:5]) {
        translate([side_x, 15 + i * 17, base_z + inner_h/2])
          cube([wall, 8, 3]);
      }
    }

    // Weight reduction: bottom pocket
    translate([wall + 8, wall + 8, 0.5])
      cube([encl_x - 2*wall - 16, encl_y - 2*wall - 16, base_z - 0.5]);

    // Brand plate recess
    translate([encl_x/2 - 18, encl_y/2 - 5, base_z + inner_h])
      cube([36, 10, 0.5]);
  }
}

// ====================================================================
// HEAT SINK FINS (top, military-green)
// ====================================================================
module fins() {
  for (i = [0:fin_count-1]) {
    translate([wall + 5, 10 + i * fin_gap, base_z + inner_h])
      cube([encl_x - 2*wall - 10, fin_thick, fin_height]);
  }
}

// ====================================================================
// LID PLATE
// ====================================================================
module lid() {
  difference() {
    translate([wall, wall, base_z + inner_h])
      cube([encl_x - 2*wall, encl_y - 2*wall, 3]);

    // Screw holes (8x M3)
    for (x = [18, encl_x/3, 2*encl_x/3, encl_x - 18])
      for (y = [15, encl_y - 15])
        translate([x, y, base_z + inner_h - 0.1])
          cylinder(h = 3.2, r = 1.6, $fn = 12);
  }
}

// ====================================================================
// MOUNTING BRACKETS (integrated, heavy-duty)
// ====================================================================
module mounting_brackets() {
  color("#4A483B")
  for (side = [-1, 1]) {
    translate([encl_x/2 - 35, side > 0 ? encl_y : -6, base_z])
      cube([70, 6, 3]);
    translate([encl_x/2 - 35, side > 0 ? encl_y : -6, base_z + 3])
      cube([70, 4, 5]);
    // Slotted mounting holes
    for (x = [encl_x/2 - 15, encl_x/2 + 15]) {
      translate([x, side > 0 ? encl_y - 8 : -2, base_z + 3])
        cube([8, 4, 5]);
    }
  }
}

// ====================================================================
// FULL ASSEMBLY
// ====================================================================
module full_assembly() {
  color("#3C3A2E") body();          // Dark olive body
  color("#5B5230") fins();          // Lighter olive fins
  color("#4A483B") lid();           // Medium olive lid
  mounting_brackets();

  // Bright green accent stripe
  color("#769728", 0.8) {
    translate([wall + 10, encl_y/2 - 3, base_z + 2])
      cube([4, 6, 1]);
    translate([encl_x - wall - 14, encl_y/2 - 3, base_z + 2])
      cube([4, 6, 1]);
  }
}

full_assembly();

// Isometric camera hint
// openscad --camera 90,65,60,40,25,0,380 --imgsize 1200,900
