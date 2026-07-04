// ============================================================================
// 7100CPT-S "Sleek Modern" — Dark charcoal + blue accent design
// Matches the ChatGPT tall ECU render style
// ============================================================================
// Envelope: 170mm x 120mm x 34mm

pcb_x = 160;
pcb_y = 110;
wall = 3;
clearance = 2;

encl_x = pcb_x + 2*wall + 2*clearance; // 170
encl_y = pcb_y + 2*wall + 2*clearance; // 120
encl_z = 34;  // total height
base_z = 4;

// Taper / chamfer
chamfer = 2;
taper_angle = 3; // degrees inward

// ---- Accent grooves ----
groove_w = 3;
groove_d = 1.5;
groove_gap = 8;

// LED light pipe position
led_lg = 6;  // light guide length

$fn = 32;

// ====================================================================
// BODY — chamfered box with tapered sidewalls
// ====================================================================
module body() {
  difference() {
    hull() {
      // Bottom (slightly larger)
      translate([chamfer, chamfer, 0])
        minkowski() {
          cube([encl_x - 2*chamfer, encl_y - 2*chamfer, encl_z - chamfer]);
          sphere(r = chamfer, $fn = 16);
        }
    }
    // Interior cavity
    translate([wall + clearance, wall + clearance, base_z])
      cube([pcb_x, pcb_y, encl_z]);

    // ---- Accent grooves (top) ----
    // 3 parallel grooves across the top
    for (i = [0:2]) {
      translate([
        encl_x/4 + i * (encl_x/3),
        encl_y/2 - groove_w*3,
        encl_z - groove_d
      ])
        cube([groove_w, groove_w*6, groove_d + 0.1]);
    }

    // ---- Side accent grooves (left edge) ----
    for (i = [0:4]) {
      translate([
        -0.1,
        encl_y/2 - 3*groove_gap/2 + i * groove_gap,
        base_z + 6 + i * 5
      ])
        cube([wall + 0.2, groove_w, groove_d]);
    }

    // ---- Vents (right side) ----
    for (i = [0:5]) {
      translate([
        encl_x - wall/2,
        encl_y/2 - 5*4 + i * 8,
        base_z + 4
      ])
        cube([wall + 0.2, 2.5, 6]);
    }

    // ---- LED light pipe recess (front) ----
    translate([encl_x/2 - 6, -0.1, base_z + 8])
      cube([12, wall + 0.2, 3]);

    // ---- Connector cutouts ----
    // Main 42-pin (left edge)
    translate([-0.1, (encl_y - 65)/2, base_z + 4])
      cube([wall + 0.2, 65, 14]);

    // CAN0 (top-right)
    translate([encl_x - 40, encl_y - 0.1, base_z + 5])
      cube([20, wall + 0.2, 10]);

    // CAN1 (top-left of right)
    translate([encl_x - 70, encl_y - 0.1, base_z + 5])
      cube([20, wall + 0.2, 10]);

    // USB-C (right edge)
    translate([encl_x - 0.1, encl_y/2 + 15, base_z + 8])
      cube([wall + 0.2, 12, 5]);

    // Debug/SWD (bottom edge)
    translate([encl_x/2 - 10, -0.1, base_z + 6])
      cube([20, wall + 0.2, 8]);
  }
}

// ====================================================================
// DECORATIVE BLUE ACCENT RING (around the top edge)
// ====================================================================
module accent_ring() {
  difference() {
    linear_extrude(height = 2)
      offset(r = 2)
        square([encl_x - 2*wall, encl_y - 2*wall]);
    linear_extrude(height = 2.1)
      offset(r = 1)
        square([encl_x - 2*wall - 2, encl_y - 2*wall - 2]);
  }
}

// ====================================================================
// BRANDING PLATE (raised text area on top)
// ====================================================================
module branding_plate() {
  translate([encl_x/2 - 15, encl_y/2 - 5, encl_z - 0.5])
    cube([30, 10, 0.5]);
  // Accent strip under brand
  color("#5CA5E7")
  translate([encl_x/2 - 20, encl_y/2 + 6, encl_z - 0.3])
    cube([40, 1.5, 0.3]);
}

// ====================================================================
// MOUNTING FEET (4 rubber pads)
// ====================================================================
module feet() {
  color("#222")
  for (x = [12, encl_x - 12])
    for (y = [12, encl_y - 12])
      translate([x - 5, y - 5, 0])
        cube([10, 10, 1.5]);
}

// ====================================================================
// FULL ASSEMBLY
// ====================================================================
module full_assembly() {
  color("#141C25") body();    // Dark charcoal body
  color("#5CA5E7", 0.7) accent_ring(); // Blue accent ring
  color("#0A1118") branding_plate();
  feet();
}

// Preview
full_assembly();

// Isometric view hint for OpenSCAD camera
// openscad --camera 85,60,70,45,20,0,350 --imgsize 1200,900
