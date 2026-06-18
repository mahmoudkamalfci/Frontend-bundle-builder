# Design Doc: Replace Accordion Icons with PNG Images

## Goal
Replace the existing Lucide React SVG icons in the Accordion Steps of the Bundle Builder with the custom PNG icons located in `src/assets/images/icons/`.

## Selected Approach
Use static Vite imports at the top of `src/App.tsx` and refactor the `StepIcon` component to output a styled `<img />` tag.

### Mappings
- **Step 1 (cameras, icon 'camera')** -> `camera-accordion-icon.png`
- **Step 2 (plans, icon 'shield')** -> `security-accordion-icon.png`
- **Step 3 (sensors, icon 'bell')** -> `sensor-accordion-icon.png`
- **Step 4 (accessories, icon 'grid')** -> `protection-accordion-icon.png`

### Stylings
- **Active State**: Fully opaque (`opacity-100`), scaled up slightly (`scale-105`).
- **Inactive State**: Semi-transparent and grayscale (`opacity-60 grayscale`) to indicate inactive step, transitioning smoothly (`transition-all duration-200`).
