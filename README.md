# Wyze Security Bundle Builder - Prototype

A responsive **React + TypeScript + Vite** smart home security bundle builder matching the provided Figma interface.

## Key Features

* **4-Step Accordion Builder**: Choose cameras, plans, sensors, and accessories with state indicators and dynamic variants.
* **Live Review Panel**: Synchronized cart summary, shipping totals, financing rates, and savings calculations.
* **Variant Selection**: Tracks quantities per SKU with dynamic real-image thumbnails.
* **Required Dependencies**: Wyze Sense Hub automatically locks to qty 1 when sensors are present.
* **Persistence**: Save configuration to `localStorage` for returning sessions.
* **Aesthetics**: Dark mode support and pixel-perfect design.

## Technical Details

* **Dynamic Thumbnails**: Uses `products.json` to map variants to real image assets, falling back to defaults.
* **Seed State**: Pre-populates cart with a $187.89 active total to match the initial Figma design.

## Getting Started

Requires **Node.js (v18+)** and **pnpm**.

```bash
pnpm install
pnpm run dev    # Start dev server at http://localhost:5173
pnpm run lint   # Lint code
pnpm run build  # Build for production
```
