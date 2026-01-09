# Quick python script to stitch Xaero's World map tiles into a single large image.
# Place this script in the directory with the tiles and run it.

from PIL import Image
import os

# Grid settings
TILE_SIZE = 1024
GRID_SIZE = 13  # 13x13 grid (0-12)
OUTPUT_SIZE = TILE_SIZE * GRID_SIZE  # 13312x13312

# Create output image (black background)
output = Image.new('RGBA', (OUTPUT_SIZE, OUTPUT_SIZE), (0, 0, 0, 255))

# Get all files in current directory
files = os.listdir('.')

# Build a lookup dictionary for tiles
tile_lookup = {}
for f in files:
    if f.endswith('.png') and '_x' in f:
        # Parse "0_0_x-2560_z-6656.png" format
        parts = f.split('_')
        if len(parts) >= 2:
            try:
                col = int(parts[0])
                row = int(parts[1])
                tile_lookup[(col, row)] = f
            except ValueError:
                continue

print(f"Found {len(tile_lookup)} tiles")

# Place tiles
for row in range(GRID_SIZE):
    for col in range(GRID_SIZE):
        x = col * TILE_SIZE
        y = row * TILE_SIZE
        
        if (col, row) in tile_lookup:
            tile_path = tile_lookup[(col, row)]
            tile = Image.open(tile_path)
            output.paste(tile, (x, y))
            print(f"Placed {tile_path} at ({x}, {y})")
        else:
            # Missing tile - already black from background
            print(f"Missing tile at col {col}, row {row} - filling with black")

# Save the stitched image
output.save('stitched_map.png', 'PNG')
print(f"Saved stitched_map.png ({OUTPUT_SIZE}x{OUTPUT_SIZE})")

input()