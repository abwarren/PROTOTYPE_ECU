import struct, zlib, os
d = "/home/wa/projects/ECU_PLATFORM/studio/src-tauri/icons"
os.makedirs(d, exist_ok=True)

def mkpng(path, w, h):
    raw = b''
    for y in range(h):
        raw += b'\x00'
        for x in range(w):
            raw += b'\x1a\x1a\x2e\xff'
    def chunk(t, data):
        c = t + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    with open(path, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n')
        f.write(chunk(b'IHDR', ihdr))
        f.write(chunk(b'IDAT', zlib.compress(raw)))
        f.write(chunk(b'IEND', b''))

mkpng(f"{d}/32x32.png", 32, 32)
mkpng(f"{d}/128x128.png", 128, 128)
mkpng(f"{d}/128x128@2x.png", 256, 256)

# minimal valid .ico with 32x32 PNG entry
p32 = open(f"{d}/32x32.png", 'rb').read()
psz = len(p32)
hdr = struct.pack('<HHH', 0, 1, 1)
ent = struct.pack('<BBBBHHII', 32, 32, 0, 0, 1, 32, psz, 22)
with open(f"{d}/icon.ico", 'wb') as f:
    f.write(hdr + ent + p32)

# minimal .icns (macOS)
with open(f"{d}/icon.icns", 'wb') as f:
    f.write(b'icns' + struct.pack('>I', 8))

print("All icons created")
