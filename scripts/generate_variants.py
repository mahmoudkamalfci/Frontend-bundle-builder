import os
from PIL import Image, ImageEnhance

PRODUCTS_DIR = "src/assets/images/products"
CAMERAS = [
    "Wyze_Cam_v4",
    "Wyze_Cam_Pan_v3",
    "Wyze_Cam_Floodlight_v2",
    "Wyze_Battery_Cam_Pro"
]

def make_variant(base_name, variant_id, make_grayscale, brightness):
    src_path = os.path.join(PRODUCTS_DIR, f"{base_name}.png")
    dest_path = os.path.join(PRODUCTS_DIR, f"{base_name}_{variant_id}.png")
    
    if not os.path.exists(src_path):
        print(f"Source file {src_path} not found.")
        return
        
    img = Image.open(src_path)
    
    # Process image
    if make_grayscale:
        # Convert to grayscale (L) and back to RGBA to preserve transparency correctly
        alpha = img.split()[-1] if len(img.split()) == 4 else None
        gray = img.convert("L").convert("RGBA")
        if alpha:
            gray.putalpha(alpha)
        img = gray
        
    if brightness != 1.0:
        # Enhancing brightness of RGBA image while keeping transparency
        alpha = img.split()[-1] if len(img.split()) == 4 else None
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(brightness)
        if alpha:
            img.putalpha(alpha)
        
    img.save(dest_path)
    print(f"Created variant: {dest_path}")

def main():
    for cam in CAMERAS:
        # White variant (copy of main)
        make_variant(cam, "white", make_grayscale=False, brightness=1.0)
        # Black variant
        make_variant(cam, "black", make_grayscale=True, brightness=0.25)
        # Grey variant (only for v4)
        if cam == "Wyze_Cam_v4":
            make_variant(cam, "grey", make_grayscale=True, brightness=0.65)

if __name__ == "__main__":
    main()
