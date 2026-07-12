// ==============================================================================
// 7100CPT ECU — Enclosure Design 1: "Classic Box"
// CNC-machined 6061-T6 aluminum, two-piece construction
// ==============================================================================
// PCB: 160mm x 110mm x 1.6mm
// Enclosure: 170mm x 120mm x 32mm (wall thickness 3mm)
// ==============================================================================

// -- Parameters --
pcb_x = 160;
pcb_y = 110;
pcb_z = 1.6;

wall = 3;
base_z = 4;        // base plate thickness
lid_z = 2;         // lid thickness
inner_z = 28;       // internal height (PCB + clearance + airflow)
total_x = pcb_x + 2*wall + 2*8;  // +8mm per side for mounting flanges
total_y = pcb_y + 2*wall + 2*8;
total_z = base_z + inner_z + lid_z;

// Mounting flange dimensions
flange_w = 8;
flange_h = 8;

// Screw holes (M4)
m4_r = 2.2;    // clearance hole for M4
m4_head_r = 4; // countersink

// Connector cutouts
main_conn_x = 65;   // 42-pin connector width
main_conn_y = 15;   // connector body depth
main_conn_z = 12;   // connector height

can_conn_w = 15;
can_conn_h = 10;

usb_c_w = 10;
usb_c_h = 4;

// ==============================================================================
// MODULE: Base (bottom half with internal cavity and connector openings)
// ==============================================================================
module base() {
    difference() {
        // Outer body
        union() {
            // Main body
            cube([total_x, total_y, base_z + inner_z]);

            // Mounting flanges (left/right)
            for (side = [0, 1]) {
                translate([side * (total_x - flange_w), flange_w, 0])
                    cube([flange_w, total_y - 2*flange_w, flange_h]);
            }
        }

        // Internal cavity
        translate([wall + flange_w, wall + flange_w, base_z])
            cube([pcb_x, pcb_y, inner_z]);

        // PCB standoff posts (4 corners)
        for (x = [flange_w + wall + 6, flange_w + wall + pcb_x - 6]) {
            for (y = [flange_w + wall + 6, flange_w + wall + pcb_y - 6]) {
                translate([x, y, base_z])
                    cylinder(h = 6, r = 2.5, $fn = 16);
                translate([x, y, base_z])
                    cylinder(h = 8, r = 1.5, $fn = 16);  // M3 threaded insert hole
            }
        }

        // Main connector cutout (left side)
        translate([
            flange_w + wall/2,
            (total_y - main_conn_y) / 2,
            base_z + 4
        ])
            cube([wall + 1, main_conn_y, main_conn_z]);

        // CAN0 connector cutout (top)
        translate([
            flange_w + wall + 30,
            total_y - wall,
            base_z + 6
        ])
            cube([can_conn_w, wall + 1, can_conn_h]);

        // CAN1 connector cutout (top)
        translate([
            flange_w + wall + 55,
            total_y - wall,
            base_z + 6
        ])
            cube([can_conn_w, wall + 1, can_conn_h]);

        // USB-C cutout (right side)
        translate([
            total_x - flange_w - wall,
            flange_w + wall + 80,
            base_z + 8
        ])
            cube([wall + 1, usb_c_w, usb_c_h]);

        // Screw holes in mounting flanges
        for (side = [0, 1]) {
            for (y = [flange_w + 15, total_y - flange_w - 15]) {
                translate([side * (total_x - flange_w) + flange_w/2, y, 0])
                    cylinder(h = flange_h, r = m4_r, $fn = 16);
            }
        }

        // Lid screw holes (around perimeter, recessed)
        // 4 per side
        for (x = [20, total_x/3, 2*total_x/3, total_x - 20]) {
            for (y = [18, total_y - 18]) {
                translate([x, y, base_z + inner_z]) {
                    cylinder(h = lid_z + 2, r = 1.8, $fn = 12);  // M2.5 clearance
                    cylinder(h = 3, r1 = 2.5, r2 = 1.8, $fn = 12); // countersink
                }
            }
        }
        // Side screw holes
        for (x = [18, total_x - 18]) {
            for (y = [40, total_y - 40]) {
                translate([x, y, base_z + inner_z]) {
                    cylinder(h = lid_z + 2, r = 1.8, $fn = 12);
                    cylinder(h = 3, r1 = 2.5, r2 = 1.8, $fn = 12);
                }
            }
        }

        // Weight reduction: pocket bottom center
        translate([
            flange_w + wall + 20,
            flange_w + wall + 20,
            1
        ])
            cube([pcb_x - 40, pcb_y - 40, base_z - 1]);

        // Branding recess on top
        translate([
            (total_x - 20) / 2,
            (total_y - 10) / 2,
            base_z + inner_z - 0.5
        ])
            cube([20, 10, 0.5]);
    }
}

// ==============================================================================
// MODULE: Lid (top cover with screw recesses)
// ==============================================================================
module lid() {
    difference() {
        // Lid plate
        translate([0, 0, base_z + inner_z])
            cube([total_x, total_y, lid_z]);

        // Screw holes matching base
        for (x = [20, total_x/3, 2*total_x/3, total_x - 20]) {
            for (y = [18, total_y - 18]) {
                translate([x, y, base_z + inner_z - 0.1])
                    cylinder(h = lid_z + 0.2, r = 1.8, $fn = 12);
            }
        }
        for (x = [18, total_x - 18]) {
            for (y = [40, total_y - 40]) {
                translate([x, y, base_z + inner_z - 0.1])
                    cylinder(h = lid_z + 0.2, r = 1.8, $fn = 12);
            }
        }
    }
}

// ==============================================================================
// MODULE: Full Assembly
// ==============================================================================
module classic_box_assembly() {
    base();
    %lid();  // transparent display
}

// Render single parts for export
// base();
// lid();

// Assembly view
classic_box_assembly();
