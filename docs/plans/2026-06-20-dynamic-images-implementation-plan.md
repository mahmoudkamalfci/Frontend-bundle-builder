# Dynamic Product Images and Variant Thumbnails Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Handle product images and variants dynamically on the frontend. Generating physical variant thumbnails for cameras and missing product images, then refactoring `ProductCard` and `ReviewItem` to resolve them dynamically.

**Architecture:** 
1. Generate missing main images using `generate_image`.
2. Generate grayscale and black variant PNG files on the filesystem using a Python PIL script.
3. Centralize dynamic resolution in a registry `src/lib/images.ts`.
4. Update React components to use `getProductImage(productId, variantId)` and remove CSS filter wrappers.

**Tech Stack:** React 19, Vite 8, Python 3 + Pillow.

---

### Task 1: Generate Missing Product Images

**Files:**
- Create: `src/assets/images/products/Wyze_Sense_Motion_Sensor.png`
- Create: `src/assets/images/products/Wyze_Sense_Hub.png`
- Create: `src/assets/images/products/Wyze_MicroSD_Card_256GB.png`
- Create: `src/assets/images/products/Cam_Unlimited.png`
- Create: `src/assets/images/products/Cam_Plus.png`

**Step 1: Generate images**
Use the `generate_image` tool to create the 5 missing images on the filesystem.

**Step 2: Verify files exist**
Run: `ls src/assets/images/products`
Expected: The 5 new PNG files are listed alongside the 5 camera files.

---

### Task 2: Setup Python Script to Generate Variant Images

**Files:**
- Create: `scripts/generate_variants.py`

**Step 1: Write Python script**
Create `scripts/generate_variants.py` with the following content:
```python
import os
import shutil
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
        img = img.convert("LA").convert("RGBA")  # convert to grayscale but keep alpha channel
        
    if brightness != 1.0:
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(brightness)
        
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
```

**Step 2: Install Pillow and run script**
Run:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install pillow
python3 scripts/generate_variants.py
deactivate
```
Expected: Files like `Wyze_Cam_v4_white.png`, `Wyze_Cam_v4_grey.png`, and `Wyze_Cam_v4_black.png` are created in `src/assets/images/products`.

**Step 3: Commit files**
Commit the generated variant images and script.

---

### Task 3: Create Dynamic Image Loader Module

**Files:**
- Create: `src/lib/images.ts`

**Step 1: Write `src/lib/images.ts`**
Create the file importing all products/variants and mapping them:
```typescript
// Main images
import Wyze_Battery_Cam_Pro from '@/assets/images/products/Wyze_Battery_Cam_Pro.png'
import Wyze_Cam_Floodlight_v2 from '@/assets/images/products/Wyze_Cam_Floodlight_v2.png'
import Wyze_Cam_Pan_v3 from '@/assets/images/products/Wyze_Cam_Pan_v3.png'
import Wyze_Cam_v4 from '@/assets/images/products/Wyze_Cam_v4.png'
import Wyze_Duo_Cam_Doorbell from '@/assets/images/products/Wyze_Duo_Cam_Doorbell.png'
import Wyze_Sense_Motion_Sensor from '@/assets/images/products/Wyze_Sense_Motion_Sensor.png'
import Wyze_Sense_Hub from '@/assets/images/products/Wyze_Sense_Hub.png'
import Wyze_MicroSD_Card_256GB from '@/assets/images/products/Wyze_MicroSD_Card_256GB.png'
import Cam_Unlimited from '@/assets/images/products/Cam_Unlimited.png'
import Cam_Plus from '@/assets/images/products/Cam_Plus.png'

// Camera variants
import Wyze_Battery_Cam_Pro_white from '@/assets/images/products/Wyze_Battery_Cam_Pro_white.png'
import Wyze_Battery_Cam_Pro_black from '@/assets/images/products/Wyze_Battery_Cam_Pro_black.png'
import Wyze_Cam_Floodlight_v2_white from '@/assets/images/products/Wyze_Cam_Floodlight_v2_white.png'
import Wyze_Cam_Floodlight_v2_black from '@/assets/images/products/Wyze_Cam_Floodlight_v2_black.png'
import Wyze_Cam_Pan_v3_white from '@/assets/images/products/Wyze_Cam_Pan_v3_white.png'
import Wyze_Cam_Pan_v3_black from '@/assets/images/products/Wyze_Cam_Pan_v3_black.png'
import Wyze_Cam_v4_white from '@/assets/images/products/Wyze_Cam_v4_white.png'
import Wyze_Cam_v4_grey from '@/assets/images/products/Wyze_Cam_v4_grey.png'
import Wyze_Cam_v4_black from '@/assets/images/products/Wyze_Cam_v4_black.png'

export const PRODUCT_IMAGES: Record<string, string> = {
  'wyze-cam-v4': Wyze_Cam_v4,
  'wyze-cam-pan-v3': Wyze_Cam_Pan_v3,
  'wyze-cam-floodlight-v2': Wyze_Cam_Floodlight_v2,
  'wyze-duo-cam-doorbell': Wyze_Duo_Cam_Doorbell,
  'wyze-battery-cam-pro': Wyze_Battery_Cam_Pro,
  'wyze-sense-motion-sensor': Wyze_Sense_Motion_Sensor,
  'wyze-sense-hub': Wyze_Sense_Hub,
  'wyze-microsd-card-256gb': Wyze_MicroSD_Card_256GB,
  'cam-unlimited-plan': Cam_Unlimited,
  'cam-plus-plan': Cam_Plus,
}

export const VARIANT_IMAGES: Record<string, Record<string, string>> = {
  'wyze-cam-v4': {
    'white': Wyze_Cam_v4_white,
    'grey': Wyze_Cam_v4_grey,
    'black': Wyze_Cam_v4_black,
  },
  'wyze-cam-pan-v3': {
    'white': Wyze_Cam_Pan_v3_white,
    'black': Wyze_Cam_Pan_v3_black,
  },
  'wyze-cam-floodlight-v2': {
    'white': Wyze_Cam_Floodlight_v2_white,
    'black': Wyze_Cam_Floodlight_v2_black,
  },
  'wyze-battery-cam-pro': {
    'white': Wyze_Battery_Cam_Pro_white,
    'black': Wyze_Battery_Cam_Pro_black,
  },
}

export function getProductImage(productId: string, variantId?: string): string {
  if (variantId && VARIANT_IMAGES[productId]?.[variantId]) {
    return VARIANT_IMAGES[productId][variantId]
  }
  return PRODUCT_IMAGES[productId] || ''
}
```

**Step 2: Commit file**
Commit `src/lib/images.ts`.

---

### Task 4: Refactor ProductCard Component

**Files:**
- Modify: `src/components/ProductCard.tsx`

**Step 1: Replace imports and use dynamic getProductImage**
Remove:
```typescript
import productImg from "@/assets/images/products/product-2.png"
```
And add:
```typescript
import { getProductImage } from "@/lib/images"
```
Update image tag `src={productImg}` to `src={getProductImage(product.id, activeVariantId)}` and variant thumbnail `src={productImg}` to `src={getProductImage(product.id, variant.id)}`.

Remove the inline filters / imageStyle from the main `<img>` and color variant button `<img>`.

**Step 2: Verify the component compiles**
Run: `pnpm run build`
Expected: Compile succeeds or only complains about `ReviewItem.tsx` still importing `product-2.png`.

---

### Task 5: Refactor ReviewItem Component

**Files:**
- Modify: `src/components/ReviewItem.tsx`

**Step 1: Replace imports and use dynamic getProductImage**
Remove:
```typescript
import productImg from '../assets/images/products/product-2.png'
```
And add:
```typescript
import { getProductImage } from '@/lib/images'
```
Update the thumbnail image src to:
```typescript
src={getProductImage(product.id, variantId)}
```
Remove `imageStyle` logic and style properties.

---

### Task 6: Final Verification and App Build

**Step 1: Run standard build**
Run: `pnpm run build`
Expected: Clean build with no errors.

**Step 2: Verify UI visually**
Launch dev server: `pnpm run dev`
Verify in browser that camera cards display variant-colored images correctly on selection and checkout summary.
