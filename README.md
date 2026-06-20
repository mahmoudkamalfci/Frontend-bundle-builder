# Wyze Security Bundle Builder - Prototype

A premium, interactive, responsive **React + TypeScript + Vite** smart home security bundle builder designed to match the provided Figma interface exactly.

---

## Features Implemented

### 1. 4-Step Accordion Builder (Left Column)
* **Step 1: Choose your cameras** (5 dynamic product cards with color selectors and steppers).
* **Step 2: Choose your plan** (Cloud plans list).
* **Step 3: Choose your sensors** (Pre-populated Wyze sensors, enforcing dependencies).
* **Step 4: Add extra protection** (Accessory add-ons).
* **Accordion Animations & State Indicators**: Shows `N selected` badge and up/down chevrons per step. Step 1 is open by default.
* **Next Steps Buttons**: Advances the shopper sequentially through the accordion.

### 2. Live Synchronized Review Panel (Right Column)
* Summarizes and groups chosen items by category (**Cameras, Sensors, Accessories, Plan**).
* **Synchronized Steppers**: Changing quantities in either the builder card or the summary list row immediately keeps the other in sync.
* Shows shipping totals (`FREE` compare-at `$5.99`) and calculated monthly financing rates (`as low as $19.19/mo` at `$187.89`).
* Displays a wavy circular **100% Satisfaction Guarantee badge** designed entirely in SVG.
* Showcases real-time subtotal calculations, compare-at subtotals, and a dynamic green congratulations savings callout.

### 3. Detailed Variant Selection
* Tracks quantities **separately per variant SKU** (e.g. 1 White camera and 2 Black cameras are individual line items in the summary).
* Card steppers automatically bind to the currently active variant chip.
* Visual variant swatches match the design (grey border for White, dark grey for Grey, black for Black).

### 4. Required Locked Dependencies
* **Wyze Sense Hub (Required)** is locked at quantity `1` as long as any sensors are present in the cart. The stepper buttons are disabled, and it automatically removes itself if all sensors are removed.

### 5. Config Persistence ("Save my system for later")
* Clicking the **Save my system for later** link writes the current quantities and variant selections to `localStorage`.
* Restores the shopper's configuration automatically on returning or reloading the page.
* Shows a customized green confirmation notification toast upon successful save.

### 6. Design and Aesthetics
* Curated dark mode toggle support using Tailwind CSS v4 class-based overrides.
* Pixel-perfect borders, shadows, HSL selections, typography scaling, and smooth interaction transitions.

---

## Technical Decisions & Tradeoffs

### Dynamic Product Thumbnails
Product variant thumbnails are managed dynamically using the `products.json` data configuration and the `getProductImage` helper. 
Instead of relying on CSS filters, each product variant is mapped directly to a specific real image asset (e.g., `Wyze_Cam_v4_white.png`, `Wyze_Cam_v4_black.png`) when available, while gracefully falling back to the default product image if a variant image is not provided. This ensures an exact, high-fidelity representation of different product colors without needing complex CSS color manipulations.

### Seeding Initial Load State
The app loads pre-populated with:
* 1 White Wyze Cam v4
* 2 White Wyze Cam Pan v3
* 2 Wyze Sense Motion Sensors
* 1 Wyze Sense Hub (Locked)
* 2 Wyze MicroSD Cards (256GB)
* 1 Cam Unlimited Plan

This matches the Figma's totals (`$187.89` active, `$238.81` compare-at, `$50.92` savings) exactly upon first load.

---

## How to Build and Run

### Prerequisites
* **Node.js** (v18+)
* **pnpm** (Package manager, mandated by the project guidelines)

### Steps

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start the development server**:
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Verify linting**:
   ```bash
   pnpm run lint
   ```

4. **Build for production**:
   ```bash
   pnpm run build
   ```
