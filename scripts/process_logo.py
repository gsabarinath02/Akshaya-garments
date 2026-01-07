import sys
import os

try:
    from PIL import Image
except ImportError:
    print("PIL not installed. Installing Pillow...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def process_logo():
    source_path = r"c:\abhishek\AG LOGO.jpeg"
    dest_png = r"c:\abhishek\clothing-brand\public\logo.png"
    dest_svg = r"c:\abhishek\clothing-brand\public\logo.svg"

    print(f"Processing {source_path}...")
    
    if not os.path.exists(source_path):
        print(f"Error: Source file not found at {source_path}")
        return

    img = Image.open(source_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Check for white (or near white)
        # item is (R, G, B, A)
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0)) # Transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # Save PNG
    img.save(dest_png, "PNG")
    print(f"Saved transparent PNG to {dest_png}")
    
    # Save SVG wrapper
    # We need to base64 encode the PNG to embed it
    import base64
    from io import BytesIO
    
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    svg_content = f'''<svg width="{img.width}" height="{img.height}" viewBox="0 0 {img.width} {img.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <image width="{img.width}" height="{img.height}" xlink:href="data:image/png;base64,{img_str}"/>
</svg>'''
    
    with open(dest_svg, "w") as f:
        f.write(svg_content)
    print(f"Saved SVG to {dest_svg}")

if __name__ == "__main__":
    process_logo()
