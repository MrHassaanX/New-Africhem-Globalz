"""Bake the client-side Natural Earth canvas work into static globe textures.

Run with the bundled workspace Python (Pillow and NumPy); these are QA tools,
not production dependencies. The source geometry remains in assets/geo.
"""

from pathlib import Path
import json

import numpy as np
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
RINGS = json.loads((ROOT / "assets/geo/natural-earth-110m.json").read_text())
OUT = ROOT / "public/globe"
OUT.mkdir(parents=True, exist_ok=True)


def rgb(value):
    return tuple(bytes.fromhex(value.removeprefix("#")))


def sea_gradient(width, height, dark):
    stops = ("#092b42", "#0a3b56", "#071c31") if dark else ("#194e67", "#266b80", "#123f59")
    colors = [np.asarray(rgb(stop), dtype=np.float32) for stop in stops]
    # Canvas' linear gradient runs along the diagonal of the canvas.
    x = np.linspace(0, 1, width, dtype=np.float32)[None, :]
    y = np.linspace(0, 1, height, dtype=np.float32)[:, None]
    t = (x + y) * .5
    split = .52
    first = np.clip(t / split, 0, 1)[..., None]
    second = np.clip((t - split) / (1 - split), 0, 1)[..., None]
    pixels = np.where(t[..., None] <= split,
                      colors[0] * (1 - first) + colors[1] * first,
                      colors[1] * (1 - second) + colors[2] * second)
    return Image.fromarray(np.uint8(np.round(pixels)), "RGB")


def bake(dark, mobile):
    width, height = (1024, 512) if mobile else (2048, 1024)
    image = sea_gradient(width, height, dark)
    draw = ImageDraw.Draw(image, "RGBA")
    fill = (*rgb("#286a83" if dark else "#9fc3c3"), 255)
    line = (*rgb("#75cce1" if dark else "#e3f2ee"), 115 if dark else 178)
    for ring in RINGS:
        points = []
        previous_x = 0
        for longitude, latitude in ring:
            x = (longitude + 180) / 360 * width
            if points:
                while x - previous_x > width / 2:
                    x -= width
                while previous_x - x > width / 2:
                    x += width
            points.append((x, (90 - latitude) / 180 * height))
            previous_x = x
        if len(points) < 3:
            continue
        for shift in (-width, 0, width):
            shifted = [(x + shift, y) for x, y in points]
            draw.polygon(shifted, fill=fill)
            draw.line(shifted + [shifted[0]], fill=line, width=1 if mobile else 2, joint="curve")
    name = f"earth-{'dark' if dark else 'light'}-{'mobile' if mobile else 'desktop'}.webp"
    image.save(OUT / name, "WEBP", quality=90, method=6)
    print(name, (OUT / name).stat().st_size)


for dark in (True, False):
    for mobile in (True, False):
        bake(dark, mobile)
