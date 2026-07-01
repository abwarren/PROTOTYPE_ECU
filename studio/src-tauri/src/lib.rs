use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

// ---- Types ----
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SerialDevice {
    pub name: String,
    pub path: String,
    pub vid: u16,
    pub pid: u16,
    pub serial_number: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ConnectionInfo {
    pub id: String,
    pub path: String,
}

// ---- State ----
struct SerialState {
    port: Mutex<Option<Box<dyn serialport::SerialPort>>>,
}

// ---- Tauri Commands ----
#[tauri::command]
fn list_serial_ports() -> Result<Vec<SerialDevice>, String> {
    let ports = serialport::available_ports().map_err(|e| e.to_string())?;
    Ok(ports
        .into_iter()
        .filter_map(|p| {
            let info = p.port_type;
            match info {
                serialport::SerialPortType::UsbPort(usb) => Some(SerialDevice {
                    name: p.port_name.clone(),
                    path: p.port_name,
                    vid: usb.vid,
                    pid: usb.pid,
                    serial_number: usb.serial_number,
                }),
                _ => Some(SerialDevice {
                    name: p.port_name.clone(),
                    path: p.port_name,
                    vid: 0,
                    pid: 0,
                    serial_number: None,
                }),
            }
        })
        .collect())
}

#[tauri::command]
fn connect_serial(
    state: State<SerialState>,
    path: String,
    baud_rate: u32,
) -> Result<ConnectionInfo, String> {
    let port = serialport::new(&path, baud_rate)
        .timeout(std::time::Duration::from_millis(100))
        .data_bits(serialport::DataBits::Eight)
        .stop_bits(serialport::StopBits::One)
        .parity(serialport::Parity::None)
        .flow_control(serialport::FlowControl::None)
        .open()
        .map_err(|e| format!("Failed to open {}: {}", path, e))?;

    let id = format!("conn-{}", std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis());

    let conn = ConnectionInfo {
        id: id.clone(),
        path: path.clone(),
    };

    let mut guard = state.port.lock().map_err(|e| e.to_string())?;
    *guard = Some(port);

    Ok(conn)
}

#[tauri::command]
fn disconnect_serial(state: State<SerialState>) -> Result<(), String> {
    let mut guard = state.port.lock().map_err(|e| e.to_string())?;
    *guard = None;
    Ok(())
}

#[tauri::command]
fn send_frame(state: State<SerialState>, data: Vec<u8>) -> Result<Vec<u8>, String> {
    use std::io::Write;
    let mut guard = state.port.lock().map_err(|e| e.to_string())?;
    let port = guard.as_mut().ok_or("Not connected")?;

    // Write frame
    port.write_all(&data).map_err(|e| format!("Write error: {}", e))?;

    // Read response — wait for at least a header
    let mut buf = vec![0u8; 4096];
    let mut total = 0;
    let start = std::time::Instant::now();

    // Read header first (at least 6 bytes for magic+length+type+seq)
    while total < 6 {
        if start.elapsed() > std::time::Duration::from_secs(2) {
            return Err("Timeout waiting for response header".into());
        }
        match port.read(&mut buf[total..total + 1]) {
            Ok(1) => {
                total += 1;
                // After 2 bytes of magic, read 2 bytes of length
                if total == 2 && buf[0] == 0xAA && buf[1] == 0x55 {
                    // Need length field
                    return Err("Protocol handshake expected".into());
                }
            }
            Ok(_) => {}
            Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => continue,
            Err(e) => return Err(format!("Read error: {}", e)),
        }
    }

    buf.truncate(total);
    Ok(buf)
}

#[tauri::command]
fn heartbeat_serial(state: State<SerialState>) -> Result<bool, String> {
    use std::io::Write;
    let mut guard = state.port.lock().map_err(|e| e.to_string())?;
    let port = match guard.as_mut() {
        Some(p) => p,
        None => return Ok(false),
    };

    // Send ping byte
    port.write_all(&[0xFF]).map_err(|e| format!("Write error: {}", e))?;

    let mut buf = [0u8; 1];
    match port.read(&mut buf) {
        Ok(1) if buf[0] == 0xFE => Ok(true),
        Ok(_) => Ok(false),
        Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => Ok(false),
        Err(e) => Err(format!("Read error: {}", e)),
    }
}

// ---- Entry Point ----
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(SerialState {
            port: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            list_serial_ports,
            connect_serial,
            disconnect_serial,
            send_frame,
            heartbeat_serial,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Prototype Studio");
}
