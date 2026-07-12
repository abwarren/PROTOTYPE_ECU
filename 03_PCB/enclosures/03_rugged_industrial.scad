// ==============================================================================
// 7100CPT ECU — Enclosure Design 3: "Rugged Industrial"
// IP67 sealed die-cast aluminum with O-ring groove
// Heavy-duty for extreme environments (off-road, marine, industrial)
// ==============================================================================
// PCB: 160mm x 110mm x 1.6mm
// Enclosure: 185mm x 135mm x 40mm (larger for potting + sealing)
// ==============================================================================

// -- Parameters --
pcb_x = 160;
pcb_y = 110;
pcb_z = 1.6;

wall = 4;              // thicker walls for ruggedness
base_floor = 5;        // thick base for thermal mass + threaded inserts
inner_h = 28;          // tall enough for tall components + potting allowance
lid_thick = 4;

// Overall envelope (larger — potting compound needs space)
encl_x = pcb_x + 2*wall + 12;   // 184mm
encl_y = pcb_y + 2*wall + 12;   // 134mm
encl_z = base_floor + inner_h + lid_thick;  // 37mm

// O-ring parameters
o_ring_groove_w = 3;
o_ring_groove_d = 1.8;
o_ring_offset = 5;  // from outer edge

// Potting allowance around PCB
potting_gap = 6;

// Ribs for grip + heat dissipation (on exterior)
rib_count = 8;
rib_depth = 2;
rib_width = 3;
rib_pitch = 16;

// Threaded brass insert specs
m4_insert_r = 3.5;    // hole for M4 brass insert
m4_insert_depth = 6;

// Mounting feet
foot_w = 18;
foot_l = 14;
foot_h = 4;

// Connector panel (recessed, gasketed)
conn_panel_x = 100;
conn_panel_y = 50;
conn_panel_z = 25;

// ==============================================================================
// MODULE: Base (lower housing with O-ring groove + ribs)
// ==============================================================================
module base() {
    difference() {
        union() {
            // Main body
            cube([encl_x, encl_y, base_floor + inner_h]);

            // Exterior grip ribs (on long sides)
            for (i = [0:rib_count-1]) {
                // Left side ribs
                translate([-rib_depth, 10 + i * rib_pitch, base_floor])
                    cube([rib_depth, rib_width, inner_h]);
                // Right side ribs
                translate([encl_x, 10 + i * rib_pitch, base_floor])
                    cube([rib_depth, rib_width, inner_h]);
            }

            // Mounting feet (2 on each long side)
            for (x = [10, encl_x - foot_w - 10]) {
                translate([x, -foot_l, 0])
                    cube([foot_w, foot_l, foot_h]);
                translate([x, encl_y, 0])
                    cube([foot_w, foot_l, foot_h]);
            }
        }

        // Internal cavity (with potting allowance)
        translate([wall + potting_gap, wall + potting_gap, base_floor])
            cube([pcb_x, pcb_y, inner_h]);

        // O-ring groove (on top face, around perimeter)
        hull() {
            translate([o_ring_offset + 1, o_ring_offset + 1, base_floor + inner_h - o_ring_groove_d])
                cube([1, 1, o_ring_groove_d + 0.2]);
            translate([encl_x - o_ring_offset - 2, encl_y - o_ring_offset - 2, base_floor + inner_h - o_ring_groove_d])
                cube([1, 1, o_ring_groove_d + 0.2]);
        }
        // Actually, let's use a simpler rectangular groove
        // Better: 4 straight groove segments
        groove_inset = o_ring_offset;
        translate([groove_inset, groove_inset, base_floor + inner_h - o_ring_groove_d])
            cube([encl_x - 2*groove_inset, o_ring_groove_w, o_ring_groove_d + 0.2]);
        translate([groove_inset, encl_y - groove_inset - o_ring_groove_w, base_floor + inner_h - o_ring_groove_d])
            cube([encl_x - 2*groove_inset, o_ring_groove_w, o_ring_groove_d + 0.2]);
        translate([groove_inset, groove_inset, base_floor + inner_h - o_ring_groove_d])
            cube([o_ring_groove_w, encl_y - 2*groove_inset, o_ring_groove_d + 0.2]);
        translate([encl_x - groove_inset - o_ring_groove_w, groove_inset, base_floor + inner_h - o_ring_groove_d])
            cube([o_ring_groove_w, encl_y - 2*groove_inset, o_ring_groove_d + 0.2]);

        // PCB standoffs with M4 brass insert holes (8 points)
        for (x = [wall + potting_gap + 6, wall + potting_gap + pcb_x - 6]) {
            for (y = [wall + potting_gap + 6, wall + potting_gap + pcb_y - 6]) {
                translate([x, y, base_floor]) {
                    cylinder(h = 7, r = 3, $fn = 16);
                    cylinder(h = m4_insert_depth, r = m4_insert_r, $fn = 16);
                }
            }
        }

        // Connector panel cutout (left end, recessed)
        translate([
            -1,
            (encl_y - conn_panel_x) / 2,
            base_floor + 3
        ])
            cube([wall + 2, conn_panel_x, conn_panel_y]);

        // CAN connectors (top edge)
        can_w = 20; can_h = 12;
        translate([wall + potting_gap + 25, encl_y, base_floor + 8])
            cube([can_w, wall + 2, can_h]);
        translate([wall + potting_gap + 55, encl_y, base_floor + 8])
            cube([can_w, wall + 2, can_h]);

        // USB-C (right edge)
        usb_w = 12; usb_h = 6;
        translate([encl_x, wall + potting_gap + 65, base_floor + 10])
            cube([wall + 2, usb_w, usb_h]);

        // Mounting foot holes
        for (x = [10, encl_x - foot_w - 10]) {
            translate([x + foot_w/2, -foot_l/2, 0])
                cylinder(h = foot_h + 2, r = m4_r, $fn = 16);
            translate([x + foot_w/2, encl_y + foot_l/2, 0])
                cylinder(h = foot_h + 2, r = m4_r, $fn = 16);
        }

        // Lid screw holes (8x M4, around perimeter)
        // Top/bottom rows
        for (x = [15, encl_x/3, 2*encl_x/3, encl_x - 15]) {
            for (y = [12, encl_y - 12]) {
                translate([x, y, base_floor + inner_h - o_ring_groove_d]) {
                    cylinder(h = lid_thick + o_ring_groove_d + 2, r = 2, $fn = 12);
                    // Countersink for flat-head screws
                    cylinder(h = 3, r1 = 3.5, r2 = 2, $fn = 12);
                }
            }
        }

        // Weight reduction: corner pockets (not through)
        for (x = [8, encl_x - 8]) {
            for (y = [8, encl_y - 8]) {
                translate([x, y, 1])
                    cylinder(h = base_floor - 1, r = 12, $fn = 24);
            }
        }
    }
}

// ==============================================================================
// MODULE: Lid (sealed with O-ring compression)
// ==============================================================================
module lid() {
    difference() {
        union() {
            // Lid plate
            translate([0, 0, base_floor + inner_h])
                cube([encl_x, encl_y, lid_thick]);

            // Heat dissipation ribs (on top of lid)
            for (i = [0:5]) {
                translate([5 + i * 28, 8, base_floor + inner_h + lid_thick])
                    cube([2, encl_y - 16, 6]);
            }
        }

        // Screw holes (matching base)
        for (x = [15, encl_x/3, 2*encl_x/3, encl_x - 15]) {
            for (y = [12, encl_y - 12]) {
                translate([x, y, base_floor + inner_h - 0.1])
                    cylinder(h = lid_thick + 0.2, r = 2.2, $fn = 12);
            }
        }

        // Brand engraving recess
        translate([
            (encl_x - 40) / 2,
            (encl_y - 8) / 2,
            base_floor + inner_h + lid_thick - 0.5
        ])
            cube([40, 8, 0.5]);
    }
}

// ==============================================================================
// Full Assembly
// ==============================================================================
module rugged_industrial_assembly() {
    color("dimgray") base();
    %color([0.5, 0.5, 0.5, 0.3]) lid();
}

rugged_industrial_assembly();
