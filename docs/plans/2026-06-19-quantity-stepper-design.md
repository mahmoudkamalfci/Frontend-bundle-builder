# Quantity Stepper Extraction Design

## Overview
Extract the duplicated quantity stepper component from `src/components/ProductCard.tsx` and `src/App.tsx` into a single standalone component `src/components/QuantityStepper.tsx`.

## Design Details
- Props structure:
  - `quantity`: Current quantity value.
  - `onChange`: Callback triggered with the new quantity when the buttons are clicked.
  - `disabled`: Option to disable interactions.
  - `className`: Custom container classes.
- UI details:
  - Button styling using class-variance-authority (`quantityButtonVariants`).
  - Icons `Minus` and `Plus` from `lucide-react`.
  - Reuses the shadcn `Button` component.

## Integration Plan
1. Implement `QuantityStepper` in `src/components/QuantityStepper.tsx`.
2. Update `ProductCard.tsx` to import and use `QuantityStepper`.
3. Verify that `ProductCard` works exactly as before.
4. Update `App.tsx` (the `ReviewItem` component) to import and use `QuantityStepper`.
5. Run lint and build to verify.
