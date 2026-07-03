mod serial;

use serial::SerialState;
use std::collections::HashMap;
use std::sync::Mutex;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to Prototype Studio.", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(SerialState {
            ports: Mutex::new(HashMap::new()),
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            serial::list_ports,
            serial::open_port,
            serial::close_port,
            serial::write_raw,
            serial::read_raw,
            serial::send_frame,
            serial::query_ecu,
            serial::query_ecu_crc,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Prototype Studio");
}
