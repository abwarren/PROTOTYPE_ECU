// ==============================================================================
// 7100CPT ECU — Enclosure Design 2: "Slim Racing"
// Extruded aluminum profile with integral heat sink fins
// Low-profile: ideal for engine bay or cabin mounting
// ==============================================================================
// PCB: 160mm x 110mm x 1.6mm
// Enclosure: 180mm x 125mm x 24mm (low profile!)
// ==============================================================================

// -- Parameters --
pcb_x = 160;
pcb_y = 110;
pcb_z = 1.6;

// Envelope
clearance = 3;           // gap around PCB
base_thick = 2.5;        // bottom wall
lid_thick = 1.5;         // top cover
fin_height = 10;         // heat sink fin height
fin_pitch = 6;           // spacing between fins
fin_thick = 1.5;         // fin wall thickness
inner_h = 15;            // internal height (PCB + clearance)

encl_x = pcb_x + 2*clearance + 4;  // 170
encl_y = pcb_y + 2*clearance + 4;  // 120
encl_z = base_thick + inner_h + lid_thick;  // 19mm + fins

// Number of fins
num_fins = floor((encl_y - 10) / fin_pitch);

// Mounting tabs
tab_x = 15;
tab_y = 12;
tab_h = 4;

// Screws
m4_r = 2.2;

// Connector cutouts (matching classic box)
main_conn_w = 65;
main_conn_h = 12;
can_conn_w = 15;
can_conn_h = 10;
usb_c_w = 10;
usb_c_h = 4;

// ==============================================================================
// MODULE: Base with heat sink fins
// ==============================================================================
module base_with_fins() {
    difference() {
        union() {
            // Extruded base plate
            cube([encl_x, encl_y, base_thick + inner_h]);

            // Heat sink fins (on bottom, facing away from PCB)
            // Fins run lengthwise (X axis)
            for (i = [0:num_fins-1]) {
                translate([0, 5 + i * fin_pitch, base_thick + inner_h])
                    cube([encl_x, fin_thick, fin_height]);
            }

            // Mounting tabs (4 corners, protruding)
            for (x = [-tab_x, encl_x]) {
                for (y = [-tab_y, encl_y]) {
                    translate([x, y, base_thick])
                        cube([tab_x, tab_y, tab_h]);
                }
            }
        }

        // Internal cavity
        translate([2 + clearance, 2 + clearance, base_thick])
            cube([pcb_x, pcb_y, inner_h]);

        // Standoff posts (M3 threaded inserts)
        for (x = [2 + clearance + 6, 2 + clearance + pcb_x - 6]) {
            for (y = [2 + clearance + 6, 2 + clearance + pcb_y - 6]) {
                translate([x, y, base_thick])
                    cylinder(h = 5, r = 2.5, $fn = 16);
                translate([x, y, base_thick])
                    cylinder(h = 7, r = 1.5, $fn = 16);
            }
        }

        // Main connector cutout (left side)
        translate([0, (encl_y - main_conn_w) / 2, base_thick + 4])
            cube([clearance + 2, main_conn_w, main_conn_h]);

        // CAN0 cutout (top-right)
        translate([encl_x - clearance - can_conn_w - 5, encl_y - clearance - 1, base_thick + 4])
            cube([can_conn_w, clearance + 2, can_conn_h]);

        // CAN1 cutout
        translate([encl_x - clearance - can_conn_w - 25, encl_y - clearance - 1, base_thick + 4])
            cube([can_conn_w, clearance + 2, can_conn_h]);

        // USB-C cutout (right side)
        translate([encl_x - clearance - 1, clearance + 50, base_thick + 6])
            cube([clearance + 2, usb_c_w, usb_c_h]);

        // Mounting screw holes (M4 in tabs)
        for (x = [-tab_x, encl_x]) {
            for (y = [-tab_y, encl_y]) {
                translate([x + tab_x/2, y + tab_y/2, base_thick])
                    cylinder(h = tab_h + 2, r = m4_r, $fn = 16);
            }
        }

        // Lid screw holes (M2.5, 8 around perimeter)
        for (x = [12, encl_x/4, 3*encl_x/4, encl_x - 12]) {
            for (y = [10, encl_y - 10]) {
                translate([x, y, base_thick + inner_h]) {
                    cylinder(h = lid_thick + 2, r = 1.8, $fn = 12);
                }
            }
        }

        // Weight reduction pocket in base
        translate([clearance + 10, clearance + 10, 0.5])
            cube([pcb_x - 20, pcb_y - 20, base_thick - 0.5]);

        // Brand engraving on side
        translate([encl_x/2 - 15, encl_y, base_thick + 4])
            cube([30, 1, 6]);
    }
}

// ==============================================================================
// MODULE: Lid (screwless clip-on or screw-down)
// ==============================================================================
module lid() {
    difference() {
        translate([0, 0, base_thick + inner_h])
            cube([encl_x, encl_y, lid_thick]);

        // Screw holes
        for (x = [12, encl_x/4, 3*encl_x/4, encl_x - 12]) {
            for (y = [10, encl_y - 10]) {
                translate([x, y, base_thick + inner_h - 0.1])
                    cylinder(h = lid_thick + 0.2, r = 2.2, $fn = 12);  // M2.5 clearance
            }
        }
    }
}

// ==============================================================================
// Full Assembly
// ==============================================================================
module slim_racing_assembly() {
    color("silver") base_with_fins();
    %translate([0, 0, 0]) color([0.3, 0.3, 0.3, 0.3]) lid();
}

slim_racing_assembly();
