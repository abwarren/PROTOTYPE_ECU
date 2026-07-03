// Serial port management for ECU communication
// Provides Tauri commands: list_ports, open_port, close_port, write_raw, read_raw,
// send_command, query_ecu, query_ecu_crc

use serde::Serialize;
use serialport::SerialPort;
use std::collections::HashMap;
use std::sync::Mutex;
use std::time::Duration;
use tauri::State;

/// Represents a serial port available on the system
#[derive(Debug, Clone, Serialize)]
pub struct PortInfo {
    pub path: String,
    pub name: String,
    pub serial_number: Option<String>,
    pub vendor_id: Option<u16>,
    pub product_id: Option<u16>,
    pub transport: String, // "usb" or "serial"
}

/// Error type for serial operations
#[derive(Debug, Clone, Serialize)]
pub struct TransportError {
    pub code: String,
    pub message: String,
    pub recoverable: bool,
}

impl From<&str> for TransportError {
    fn from(msg: &str) -> Self {
        TransportError {
            code: "ERR_SERIAL".to_string(),
            message: msg.to_string(),
            recoverable: true,
        }
    }
}

/// Thread-safe map of open port names → Box<dyn SerialPort>
pub struct SerialState {
    pub ports: Mutex<HashMap<String, Box<dyn SerialPort>>>,
}

// ---- Tauri Commands ----

/// List all available serial ports on the system
#[tauri::command]
pub fn list_ports() -> Result<Vec<PortInfo>, String> {
    let ports = serialport::available_ports().map_err(|e| e.to_string())?;

    Ok(ports
        .into_iter()
        .map(|p| {
            let transport = if p.port_name.contains("ttyACM") || p.port_name.contains("COM") {
                "usb".to_string()
            } else if p.port_name.contains("ttyUSB") {
                "serial".to_string()
            } else {
                "serial".to_string()
            };

            PortInfo {
                path: p.port_name.clone(),
                name: p.port_name,
                serial_number: p.serial_number,
                vendor_id: p.vid,
                product_id: p.pid,
                transport,
            }
        })
        .collect())
}

/// Open a serial port and store it in the global port map
#[tauri::command]
pub fn open_port(state: State<SerialState>, path: String, baud_rate: u32) -> Result<(), String> {
    let mut ports = state.ports.lock().map_err(|e| e.to_string())?;

    // Don't re-open if already open
    if ports.contains_key(&path) {
        return Ok(());
    }

    let port = serialport::new(&path, baud_rate)
        .timeout(Duration::from_millis(500))
        .open()
        .map_err(|e| format!("Failed to open {}: {}", path, e))?;

    ports.insert(path, port);
    Ok(())
}

/// Close a serial port and remove it from the global port map
#[tauri::command]
pub fn close_port(state: State<SerialState>, path: String) -> Result<(), String> {
    let mut ports = state.ports.lock().map_err(|e| e.to_string())?;
    ports.remove(&path);
    Ok(())
}

/// Write raw bytes to an open port
#[tauri::command]
pub fn write_raw(state: State<SerialState>, path: String, data: Vec<u8>) -> Result<(), String> {
    let mut ports = state.ports.lock().map_err(|e| e.to_string())?;
    let port = ports
        .get_mut(&path)
        .ok_or_else(|| format!("Port not open: {}", path))?;

    port.write_all(&data)
        .map_err(|e| format!("Write error on {}: {}", path, e))?;
    port.flush()
        .map_err(|e| format!("Flush error on {}: {}", path, e))?;
    Ok(())
}

/// Read raw bytes from an open port (up to max_bytes, with timeout)
#[tauri::command]
pub fn read_raw(
    state: State<SerialState>,
    path: String,
    max_bytes: usize,
    timeout_ms: u64,
) -> Result<Vec<u8>, String> {
    let mut ports = state.ports.lock().map_err(|e| e.to_string())?;
    let port = ports
        .get_mut(&path)
        .ok_or_else(|| format!("Port not open: {}", path))?;

    // Set a shorter timeout for this read
    port.set_timeout(Duration::from_millis(timeout_ms))
        .map_err(|e| e.to_string())?;

    let mut buf = vec![0u8; max_bytes];
    match port.read(&mut buf) {
        Ok(n) => {
            buf.truncate(n);
            Ok(buf)
        }
        Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => Ok(vec![]),
        Err(e) => Err(format!("Read error on {}: {}", path, e)),
    }
}

// ---- Protocol-Level Commands ----

/// rusEFI TunerStudio response codes
const TS_RESPONSE_OK: u8 = 0x00;
const TS_RESPONSE_BURN_OK: u8 = 0x04;
const TS_RESPONSE_CRC_ERROR: u8 = 0x82;
const TS_RESPONSE_UNDERRUN: u8 = 0x80;
const TS_RESPONSE_OVERRUN: u8 = 0x81;
const TS_RESPONSE_OUT_OF_RANGE: u8 = 0x84;

/// TS_HELLO_COMMAND = 'S' — queries the ECU for its signature
const TS_HELLO_COMMAND: u8 = b'S';

/// Send a single byte (the plain-text 'S' query) and read the ECU signature.
/// This is the simplest possible handshake — no CRC framing.
#[tauri::command]
pub fn query_ecu(state: State<SerialState>, path: String) -> Result<String, String> {
    let mut ports = state.ports.lock().map_err(|e| e.to_string())?;
    let port = ports
        .get_mut(&path)
        .ok_or_else(|| format!("Port not open: {}", path))?;

    // Send the hello byte 'S'
    port.write_all(&[TS_HELLO_COMMAND])
        .map_err(|e| format!("Write error: {}", e))?;
    port.flush().map_err(|e| format!("Flush error: {}", e))?;

    // Read the plain-text response (ECU sends signature string, null-terminated)
    port.set_timeout(Duration::from_millis(2000))
        .map_err(|e| e.to_string())?;

    let mut buf = vec![0u8; 1024];
    let mut total = 0usize;
    loop {
        match port.read(&mut buf[total..]) {
            Ok(n) if n > 0 => {
                total += n;
                // Stop at null terminator or if we've read a reasonable amount
                if buf[..total].contains(&b'\0') || total >= 256 {
                    break;
                }
            }
            Ok(_) => break, // 0 bytes = timeout/EOF
            Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => break,
            Err(e) => return Err(format!("Read error: {}", e)),
        }
    }

    if total == 0 {
        return Err("No response from ECU".to_string());
    }

    // Extract up to null terminator
    let null_pos = buf[..total].iter().position(|&b| b == 0);
    let signature = match null_pos {
        Some(pos) => String::from_utf8_lossy(&buf[..pos]).to_string(),
        None => String::from_utf8_lossy(&buf[..total]).to_string(),
    };

    Ok(signature)
}

/// Send a CRC32-framed TunerStudio protocol command and read the response
/// Packet format (both directions):
///   [size_hi, size_lo, command_byte, payload..., crc32_be]
///   size field = payload_size + 1 (includes command byte)
///   CRC32 covers command_byte + payload (not the size header)
#[tauri::command]
pub fn send_frame(
    state: State<SerialState>,
    path: String,
    command: u8,
    payload: Vec<u8>,
) -> Result<Vec<u8>, String> {
    let mut ports = state.ports.lock().map_err(|e| e.to_string())?;
    let port = ports
        .get_mut(&path)
        .ok_or_else(|| format!("Port not open: {}", path))?;

    let payload_len = payload.len();
    let size_field = (payload_len + 1) as u16; // 1 byte for command

    // Compute CRC32 over command byte + payload
    let mut hasher = crc32fast::Hasher::new();
    hasher.update(&[command]);
    if payload_len > 0 {
        hasher.update(&payload);
    }
    let crc = hasher.finalize().to_be_bytes();

    // Build the packet
    let mut packet = Vec::with_capacity(2 + 1 + payload_len + 4);
    packet.extend_from_slice(&size_field.to_be_bytes());
    packet.push(command);
    if payload_len > 0 {
        packet.extend_from_slice(&payload);
    }
    packet.extend_from_slice(&crc);

    // Send the packet
    port.write_all(&packet)
        .map_err(|e| format!("Write error: {}", e))?;
    port.flush().map_err(|e| format!("Flush error: {}", e))?;

    // Read the response header: 2 bytes size + 1 byte response code
    port.set_timeout(Duration::from_millis(2000))
        .map_err(|e| e.to_string())?;

    let mut header = [0u8; 3];
    read_exact(port.as_mut(), &mut header)?;

    let resp_size = u16::from_be_bytes([header[0], header[1]]) as usize;
    let resp_code = header[2];

    if resp_size == 0 {
        return Err("Received empty response".to_string());
    }

    // resp_size includes the response code byte, so payload = resp_size - 1
    let resp_payload_len = resp_size.saturating_sub(1);
    let mut resp_payload = vec![0u8; resp_payload_len];
    if resp_payload_len > 0 {
        read_exact(port.as_mut(), &mut resp_payload)?;
    }

    // Read CRC32 tail
    let mut crc_buf = [0u8; 4];
    read_exact(port.as_mut(), &mut crc_buf)?;
    let received_crc = u32::from_be_bytes(crc_buf);

    // Verify CRC32 over response_code + payload
    let mut hasher = crc32fast::Hasher::new();
    hasher.update(&[resp_code]);
    hasher.update(&resp_payload);
    let computed_crc = hasher.finalize();

    if computed_crc != received_crc {
        return Err(format!(
            "CRC mismatch: computed 0x{:08x}, received 0x{:08x}",
            computed_crc, received_crc
        ));
    }

    match resp_code {
        TS_RESPONSE_OK | TS_RESPONSE_BURN_OK => Ok(resp_payload),
        TS_RESPONSE_CRC_ERROR => Err("ECU: CRC error".to_string()),
        TS_RESPONSE_UNDERRUN => Err("ECU: Buffer underrun".to_string()),
        TS_RESPONSE_OVERRUN => Err("ECU: Buffer overrun".to_string()),
        TS_RESPONSE_OUT_OF_RANGE => Err("ECU: Out of range".to_string()),
        _ => Ok(resp_payload), // unknown code — return raw payload
    }
}

/// Query ECU with CRC32-framed protocol and return the signature string
#[tauri::command]
pub fn query_ecu_crc(state: State<SerialState>, path: String) -> Result<String, String> {
    let data = send_frame_inner(&state, &path, TS_HELLO_COMMAND, vec![])?;
    Ok(String::from_utf8_lossy(&data).to_string())
}

// Helper: reads exactly `buf.len()` bytes or returns an error
fn read_exact(port: &mut Box<dyn SerialPort>, buf: &mut [u8]) -> Result<(), String> {
    let mut offset = 0;
    while offset < buf.len() {
        match port.read(&mut buf[offset..]) {
            Ok(0) => return Err("Connection closed by ECU".to_string()),
            Ok(n) => offset += n,
            Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => {
                return Err(format!(
                    "Timeout after reading {}/{} bytes",
                    offset,
                    buf.len()
                ));
            }
            Err(e) => return Err(format!("Read error: {}", e)),
        }
    }
    Ok(())
}

// Internal helper to send a frame without going through Tauri command serialization
fn send_frame_inner(
    state: &State<SerialState>,
    path: &str,
    command: u8,
    payload: Vec<u8>,
) -> Result<Vec<u8>, String> {
    let mut ports = state.ports.lock().map_err(|e| e.to_string())?;
    let port = ports
        .get_mut(path)
        .ok_or_else(|| format!("Port not open: {}", path))?;

    let payload_len = payload.len();
    let size_field = (payload_len + 1) as u16;

    let mut hasher = crc32fast::Hasher::new();
    hasher.update(&[command]);
    if payload_len > 0 {
        hasher.update(&payload);
    }
    let crc = hasher.finalize().to_be_bytes();

    let mut packet = Vec::with_capacity(2 + 1 + payload_len + 4);
    packet.extend_from_slice(&size_field.to_be_bytes());
    packet.push(command);
    if payload_len > 0 {
        packet.extend_from_slice(&payload);
    }
    packet.extend_from_slice(&crc);

    port.write_all(&packet)
        .map_err(|e| format!("Write error: {}", e))?;
    port.flush().map_err(|e| format!("Flush error: {}", e))?;

    port.set_timeout(Duration::from_millis(2000))
        .map_err(|e| e.to_string())?;

    let mut header = [0u8; 3];
    read_exact(port, &mut header)?;

    let resp_size = u16::from_be_bytes([header[0], header[1]]) as usize;
    let resp_code = header[2];

    if resp_size == 0 {
        return Err("Received empty response".to_string());
    }

    let resp_payload_len = resp_size.saturating_sub(1);
    let mut resp_payload = vec![0u8; resp_payload_len];
    if resp_payload_len > 0 {
        read_exact(port, &mut resp_payload)?;
    }

    let mut crc_buf = [0u8; 4];
    read_exact(port, &mut crc_buf)?;
    let received_crc = u32::from_be_bytes(crc_buf);

    let mut hasher = crc32fast::Hasher::new();
    hasher.update(&[resp_code]);
    hasher.update(&resp_payload);
    let computed_crc = hasher.finalize();

    if computed_crc != received_crc {
        return Err(format!(
            "CRC mismatch: computed 0x{:08x}, received 0x{:08x}",
            computed_crc, received_crc
        ));
    }

    match resp_code {
        TS_RESPONSE_OK | TS_RESPONSE_BURN_OK => Ok(resp_payload),
        _ => Ok(resp_payload),
    }
}
