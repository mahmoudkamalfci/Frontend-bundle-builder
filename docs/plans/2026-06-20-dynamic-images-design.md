# Dynamic Product Images and Variant Thumbnails Design

## Goal
To handle product images and color variants dynamically on the frontend. The static placeholder `product-2.png` will be replaced by actual high-quality product images, and camera variant thumbnails will be pre-generated physically with filters applied.

## Architecture

### 1. Asset Generation
- **New Product Images**: Using the `generate_image` tool, we will create high-quality product images for the non-camera products:
  - `Wyze_Sense_Motion_Sensor.png`
  - `Wyze_Sense_Hub.png`
  - `Wyze_MicroSD_Card_256GB.png`
  - `Cam_Unlimited.png`
  - `Cam_Plus.png`
- **Variant Processing**: A Python script `scripts/generate_variants.py` will process camera images in `src/assets/images/products` using Pillow to apply variant filters (grayscale and brightness changes) and output separate PNG files.
  - **White**: Identical copy of original.
  - **Grey**: Grayscale + 65% brightness.
  - **Black**: Grayscale + 25% brightness.

### 2. React Dynamic Resolution
- We will define `src/lib/images.ts` to statically import all assets (so Vite maps their bundle paths correctly) and map them by product ID and variant ID.
- Helper `getProductImage(productId, variantId)` will resolve image paths dynamically.
- `ProductCard.tsx` and `ReviewItem.tsx` will display these images without needing CSS filter styles.

## Verification Plan
1. Run local dev server and ensure all product cards display correct images.
2. Select different color variants and verify the product card image changes immediately.
3. Verify that thumbnails in the accordion/selectors and `ReviewItem` show the colored variants correctly.
4. Run `pnpm run build` to verify clean build output.
