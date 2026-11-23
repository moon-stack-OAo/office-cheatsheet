#!/usr/bin/env python3
"""用标准库生成 favicon.ico（内嵌 32x32 PNG），无需 Pillow / ImageMagick。
图标与 public/icon.svg 保持一致：渐变圆角方块 + 白色闪电。"""
import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "favicon.ico"
SIZE = 32


def lerp(a, b, t):
    return int(a + (b - a) * t)


def in_polygon(x, y, points):
    inside = False
    n = len(points)
    for i in range(n):
        x1, y1 = points[i]
        x2, y2 = points[(i + 1) % n]
        if (y1 > y) != (y2 > y):
            xi = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
            if x < xi:
                inside = not inside
    return inside


# 闪电路径（来自 icon.svg 的 viewBox 512 -> 32）
bolt = [(p[0] * SIZE / 512, p[1] * SIZE / 512) for p in [
    (286, 96), (150, 282), (244, 282), (206, 432), (362, 224), (268, 224),
]]
radius = 7.0  # 圆角半径

pixels = bytearray()
for py in range(SIZE):
    row = bytearray()
    for px in range(SIZE):
        # 圆角矩形判定
        cx = min(max(px + 0.5, radius), SIZE - radius)
        cy = min(max(py + 0.5, radius), SIZE - radius)
        dx, dy = px + 0.5 - cx, py + 0.5 - cy
        corner = dx * dx + dy * dy <= radius * radius if (px < radius or px >= SIZE - radius) and (py < radius or py >= SIZE - radius) else True
        if not corner:
            row += b"\x00\x00\x00\x00"
            continue
        if in_polygon(px + 0.5, py + 0.5, bolt):
            row += b"\xff\xff\xff\xff"
            continue
        # 蓝 -> 绿 对角渐变
        t = (px + py) / (2 * (SIZE - 1))
        r = lerp(0x25, 0x16, t)
        g = lerp(0x63, 0xa3, t)
        b = lerp(0xeb, 0x4a, t)
        row += bytes((r, g, b, 0xff))
    pixels += b"\x00" + row  # PNG 每行前加 filter byte 0


def chunk(tag, data):
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)


png = b"\x89PNG\r\n\x1a\n"
png += chunk(b"IHDR", struct.pack(">IIBBBBB", SIZE, SIZE, 8, 6, 0, 0, 0))
png += chunk(b"IDAT", zlib.compress(bytes(pixels), 9))
png += chunk(b"IEND", b"")

# ICO 容器：1 个条目，内嵌 PNG
ico = struct.pack("<HHH", 0, 1, 1)
ico += struct.pack("<BBBBHHII", SIZE, SIZE, 0, 0, 1, 32, len(png), 6 + 16)
ico += png

OUT.write_bytes(ico)
print(f"生成 {OUT} ({len(ico)} bytes)")
