use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

// ─── Types ─────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PortInfo {
    pub path: String,
    pub name: String,
}

#[derive(Debug, Serialize)]
pub struct DiscoverResult {
    pub ports: Vec<PortInfo>,
}

#[derive(Debug, Serialize)]
pub struct OpenResult {
    pub handle: String,
}

// ─── State ─────────────────────────────────────────────────────────────

struct SerialState {
    active_ports: Mutex<std::collections::HashMap<String, Box<dyn serialport::SerialPort>>>,
}

// ─── Commands ──────────────────────────────────────────────────────────

#[tauri::command]
fn discover_ports() -> Result<DiscoverResult, String> {
    let ports = serialport::available_ports().map_err(|e| e.to_string())?;

    let result: Vec<PortInfo> = ports
        .into_iter()
        .filter(|p| {
            // Filter for USB CDC / serial devices
            let name = p.port_name.to_lowercase();
            name.contains("ttyacm")
                || name.contains("ttyusb")
                || name.contains("usbmodem")
                || name.contains("cu.")
                || name.contains("com")
                || p.port_type == serialport::SerialPortType::UsbPort(Default::default())
        })
        .map(|p| PortInfo {
            path: p.port_name.clone(),
            name: format!(
                "{} ({})",
                p.port_name
                    .split('/')
                    .last()
                    .unwrap_or(&p.port_name),
                p.port_name
            ),
        })
        .collect();

    Ok(DiscoverResult { ports: result })
}

#[tauri::command]
fn open_port(path: String, baud_rate: u32, state: State<SerialState>) -> Result<OpenResult, String> {
    let port = serialport::new(&path, baud_rate)
        .timeout(std::time::Duration::from_millis(500))
        .open()
        .map_err(|e| format!("Failed to open {}: {}", path, e))?;

    let handle = path.clone();
    state.active_ports.lock().unwrap().insert(handle.clone(), port);

    Ok(OpenResult { handle })
}

#[tauri::command]
fn close_port(handle: String, state: State<SerialState>) -> Result<(), String> {
    state
        .active_ports
        .lock()
        .unwrap()
        .remove(&handle)
        .ok_or_else(|| format!("Port {} not found", handle))?;
    Ok(())
}

#[tauri::command]
fn write_port(handle: String, data: Vec<u8>, state: State<SerialState>) -> Result<(), String> {
    let mut ports = state.active_ports.lock().unwrap();
    let port = ports
        .get_mut(&handle)
        .ok_or_else(|| format!("Port {} not found", handle))?;
    port.write_all(&data).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn read_port(handle: String, timeout_ms: u64, state: State<SerialState>) -> Result<Vec<u8>, String> {
    let mut ports = state.active_ports.lock().unwrap();
    let port = ports
        .get_mut(&handle)
        .ok_or_else(|| format!("Port {} not found", handle))?;

    let mut buf = vec![0u8; 4096];
    let start = std::time::Instant::now();

    loop {
        match port.read(&mut buf[..]) {
            Ok(n) if n > 0 => {
                buf.truncate(n);
                return Ok(buf);
            }
            Ok(_) => {
                if start.elapsed() > std::time::Duration::from_millis(timeout_ms) {
                    return Ok(vec![]);
                }
                std::thread::sleep(std::time::Duration::from_millis(1));
            }
            Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => {
                if start.elapsed() > std::time::Duration::from_millis(timeout_ms) {
                    return Ok(vec![]);
                }
            }
            Err(e) => return Err(e.to_string()),
        }
    }
}

// ─── App Entry ─────────────────────────────────────────────────────────

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(SerialState {
            active_ports: Mutex::new(std::collections::HashMap::new()),
        })
        .invoke_handler(tauri::generate_handler![
            discover_ports,
            open_port,
            close_port,
            write_port,
            read_port
        ])
        .run(tauri::generate_context!())
        .expect("error while running 7100CPT Studio");
}
