// ============================================================================
// 7100CPT-R "Racing" — Aggressive black + red performance style
// Matches the copper/red pasted image aesthetic
// ============================================================================
// Envelope: 165mm x 115mm x 28mm (low profile!)

pcb_x = 160;
pcb_y = 110;
wall = 2.5;
clearance = 1.5;

encl_x = pcb_x + 2*wall + 2*clearance; // 165
encl_y = pcb_y + 2*wall + 2*clearance; // 115
encl_z = 28;  // very slim
base_z = 3;
inner_h = encl_z - base_z - 2;

// Aggressive angle cuts
angle = 15;  // degrees
cut_depth = 8;

// Red accent stripe
stripe_w = 4;
stripe_d = 1;

// Vent slots (top)
vent_count = 6;
vent_w = 3;
vent_l = 30;
vent_pitch = (encl_x - 40) / (vent_count - 1);

// Red accent color from reference: #C92E31
red_accent = "#C92E31";
body_color = "#131313";
body_alt = "#1A1919";

$fn = 32;

// ====================================================================
// MAIN BODY — low profile with aggressive chamfers
// ====================================================================
module body() {
  difference() {
    hull() {
      // Main block with chamfered edges
      translate([6, 6, 1])
        cube([encl_x - 12, encl_y - 12, encl_z - 1]);
      // Sharp chamfer top
      translate([8, 8, 0])
        cube([encl_x - 16, encl_y - 16, encl_z]);
    }

    // Interior cavity
    translate([wall + clearance, wall + clearance, base_z])
      cube([pcb_x, pcb_y, inner_h + 2]);

    // ---- Aggressive edge cuts (front-left corner) ----
    rotate([0, 0, angle])
      translate([-10, -10, base_z + 4])
        cube([cut_depth, cut_depth + 40, encl_z]);

    // ---- Aggressive edge cuts (rear-right corner) ----
    rotate([0, 0, -(90 - angle)])
      translate([-encl_x - 5, encl_y - 10, base_z + 4])
        cube([cut_depth + 20, cut_depth, encl_z]);

    // ---- Top vent slots ----
    for (i = [0:vent_count-1]) {
      translate([
        20 + i * vent_pitch,
        (encl_y - vent_l) / 2,
        encl_z - 1
      ])
        cube([vent_w, vent_l, 2]);
    }

    // ---- Red accent groove trenches (top, parallel) ----
    translate([15, encl_y/2 - 30, encl_z - stripe_d])
      cube([encl_x - 30, stripe_w, stripe_d + 0.1]);
    translate([15, encl_y/2 + 26, encl_z - stripe_d])
      cube([encl_x - 30, stripe_w, stripe_d + 0.1]);

    // ---- Side gills (left edge) ----
    for (i = [0:4]) {
      translate([
        -0.1,
        encl_y/2 - 35 + i * 15,
        base_z + 4 + i * 3
      ])
        cube([wall + 0.2, 8, 2]);
    }

    // ---- Connector cutouts ----
    // Main connector (left)
    translate([-0.1, (encl_y - 60)/2, base_z + 3])
      cube([wall + 0.2, 60, 14]);

    // CAN connectors (top)
    for (d = [20, 50]) {
      translate([wall + clearance + d, encl_y - 0.1, base_z + 4])
        cube([18, wall + 0.2, 10]);
    }

    // USB-C (right)
    translate([encl_x - 0.1, encl_y - 55, base_z + 7])
      cube([wall + 0.2, 12, 5]);

    // SWD (bottom)
    translate([encl_x/2 - 8, -0.1, base_z + 5])
      cube([16, wall + 0.2, 7]);

    // Status LED cutouts (front edge)
    for (i = [0:2]) {
      translate([
        encl_x/2 - 15 + i * 12,
        -0.1,
        base_z + 2
      ])
        cube([5, wall + 0.2, 2.5]);
    }

    // PCB standoffs
    for (x = [wall + clearance + 6, wall + clearance + pcb_x - 6])
      for (y = [wall + clearance + 6, wall + clearance + pcb_y - 6])
        translate([x, y, base_z]) {
          cylinder(h = 4, r = 2.5, $fn = 12);
          cylinder(h = 6, r = 1.5, $fn = 12);
        }

    // Weight reduction
    translate([wall + clearance + 12, wall + clearance + 12, 0.3])
      cube([pcb_x - 24, pcb_y - 24, base_z - 0.3]);

    // Branding recess
    translate([encl_x/2 - 16, encl_y/2 - 4, encl_z - 0.3])
      cube([32, 8, 0.3]);
  }
}

// ====================================================================
// RED ACCENT INSERTS
// ====================================================================
module red_accents() {
  color(red_accent)
  {
    // Accent strips in the groove trenches
    translate([15, encl_y/2 - 30, encl_z - stripe_d - 0.1])
      cube([encl_x - 30, stripe_w, 0.3]);
    translate([15, encl_y/2 + 26, encl_z - stripe_d - 0.1])
      cube([encl_x - 30, stripe_w, 0.3]);

    // Side gill accent edges
    for (i = [0:4]) {
      translate([
        -0.1,
        encl_y/2 - 35 + i * 15,
        base_z + 4 + i * 3
      ])
        cube([0.5, 8, 2]);
    }

    // Corner accent - small triangle badge
    linear_extrude(height = 0.5)
      polygon(points = [[8, 8], [8 + 8, 8], [8, 8 + 8]]);
    translate([encl_x - 8, encl_y - 8, encl_z - 0.5])
      linear_extrude(height = 0.5)
        polygon(points = [[-8, 0], [0, 0], [0, -8]]);
  }
}

// ====================================================================
// INTEGRATED MOUNTING (screw-down flanges)
// ====================================================================
module mounting() {
  color("#222")
  for (x = [8, encl_x - 8])
    for (y = [8, encl_y - 8])
      translate([x - 3, y - 3, 0])
        cube([6, 6, 1.5]);
}

// ====================================================================
// FULL ASSEMBLY
// ====================================================================
module full_assembly() {
  color(body_color) body();
  color(body_alt, 0.9) translate([0, 0, 0]) body();
  red_accents();
  mounting();
}

full_assembly();

// Camera hint
// openscad --camera 82,57,45,55,15,0,320 --imgsize 1200,900
