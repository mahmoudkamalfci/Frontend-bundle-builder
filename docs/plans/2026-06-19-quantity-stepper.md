# Quantity Stepper Extraction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract the duplicated quantity stepper UI from `ProductCard.tsx` and `App.tsx` into a reusable `QuantityStepper` component, and integrate it into both places.

**Architecture:** Create a standalone controlled `QuantityStepper` component inside `src/components/QuantityStepper.tsx`. Replace the inline logic and styling variants in `ProductCard.tsx` first, then in `App.tsx`'s `ReviewItem`.

**Tech Stack:** React, Tailwind CSS v4, shadcn UI.

---

## Proposed Changes

### Task 1: Create QuantityStepper Component

**Files:**
- Create: [QuantityStepper.tsx](file:///home/mahmoud/frontend-projects/practise-projects/Frontend-bundle-builder/src/components/QuantityStepper.tsx)

**Step 1: Write the minimal implementation**
Create the component with the following code:
```tsx
import { Minus, Plus } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface QuantityStepperProps {
  quantity: number
  onChange: (qty: number) => void
  disabled?: boolean
  className?: string
}

const quantityButtonVariants = cva(
  "flex size-5 items-center justify-center rounded-sm border-2 border-neutral-200 bg-white p-0 shadow-none transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-35",
  {
    variants: {
      action: {
        decrease: "text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600",
        increase: "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800",
      },
    },
  }
)

export function QuantityStepper({
  quantity,
  onChange,
  disabled = false,
  className,
}: QuantityStepperProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Button
        variant="outline"
        onClick={() => onChange(Math.max(0, quantity - 1))}
        disabled={disabled || quantity === 0}
        className={quantityButtonVariants({ action: "decrease" })}
        aria-label="Decrease quantity"
      >
        <Minus className="size-2 stroke-[3px]" />
      </Button>

      <span className="w-5 select-none text-center text-sm leading-4 tabular-nums text-foreground">
        {quantity}
      </span>

      <Button
        variant="outline"
        onClick={() => onChange(quantity + 1)}
        disabled={disabled}
        className={quantityButtonVariants({ action: "increase" })}
        aria-label="Increase quantity"
      >
        <Plus className="size-2 stroke-[3px]" />
      </Button>
    </div>
  )
}
```

**Step 2: Verify the component compiles**
Run: `pnpm run build`
Expected: Successful compile of the build target.

---

### Task 2: Update ProductCard Component

**Files:**
- Modify: [ProductCard.tsx](file:///home/mahmoud/frontend-projects/practise-projects/Frontend-bundle-builder/src/components/ProductCard.tsx)

**Step 1: Update Imports and Component Code**
- Import `QuantityStepper` from `@/components/QuantityStepper` (or `./QuantityStepper`).
- Remove the local `quantityButtonVariants` definition.
- Replace the quantity stepper `div` in the return structure:
```diff
-          <div className="flex items-center gap-1.5">
-            <Button
-              variant="outline"
-              onClick={() => onQuantityChange(activeVariantId || "default", Math.max(0, quantity - 1))}
-              disabled={quantity === 0}
-              className={quantityButtonVariants({ action: "decrease" })}
-              aria-label="Decrease quantity"
-            >
-              <Minus className="size-2 stroke-[3px]" />
-            </Button>
-
-            <span className="w-5 select-none text-center text-sm leading-4 tabular-nums text-foreground">
-              {quantity}
-            </span>
-
-            <Button
-              variant="outline"
-              onClick={() => onQuantityChange(activeVariantId || "default", quantity + 1)}
-              className={quantityButtonVariants({ action: "increase" })}
-              aria-label="Increase quantity"
-            >
-              <Plus className="size-2 stroke-[3px]" />
-            </Button>
-          </div>
+          <QuantityStepper
+            quantity={quantity}
+            onChange={(qty) => onQuantityChange(activeVariantId || "default", qty)}
+          />
```

**Step 2: Run verification**
Run: `pnpm run lint` and `pnpm run build`
Expected: Passes both checks.

---

### Task 3: Update App Component (ReviewItem)

**Files:**
- Modify: [App.tsx](file:///home/mahmoud/frontend-projects/practise-projects/Frontend-bundle-builder/src/App.tsx)

**Step 1: Update Imports and Component Code**
- Import `QuantityStepper` from `./components/QuantityStepper`.
- Replace the stepper element inside the `ReviewItem` component with:
```diff
-      {/* Stepper */}
-      {!isPlan && (
-        <div className="flex shrink-0 items-center gap-1.5">
-          <Button
-            variant="outline"
-            disabled={isHub}
-            onClick={() => onQtyChange(product.id, variantId, qty - 1)}
-            className="flex size-5 cursor-pointer items-center justify-center rounded-sm border-2 border-border bg-white p-0 text-neutral-400 shadow-none transition-all hover:bg-neutral-50 hover:text-neutral-600 active:scale-95 disabled:opacity-35"
-            aria-label="Decrease quantity"
-          >
-            <Minus className="size-2 stroke-[3px]" />
-          </Button>
-          <span className="w-5 select-none text-center text-sm leading-4 tabular-nums text-foreground">{qty}</span>
-          <Button
-            variant="outline"
-            disabled={isHub}
-            onClick={() => onQtyChange(product.id, variantId, qty + 1)}
-            className="flex size-5 cursor-pointer items-center justify-center rounded-sm border-2 border-border bg-white p-0 text-neutral-600 shadow-none transition-all hover:bg-neutral-200 hover:text-neutral-800 active:scale-95 disabled:opacity-35"
-            aria-label="Increase quantity"
-          >
-            <Plus className="size-2 stroke-[3px]" />
-          </Button>
-        </div>
-      )}
+      {/* Stepper */}
+      {!isPlan && (
+        <QuantityStepper
+          quantity={qty}
+          onChange={(newQty) => onQtyChange(product.id, variantId, newQty)}
+          disabled={isHub}
+          className="shrink-0"
+        />
+      )}
```

**Step 2: Run verification**
Run: `pnpm run lint` and `pnpm run build`
Expected: Passes both checks.

---

## Verification Plan

### Automated Tests
- Run `pnpm run lint` to ensure no linting errors.
- Run `pnpm run build` to verify standard production compiles.

### Manual Verification
- Deploy local dev server via `pnpm run dev`.
- Ensure interaction with the plus and minus buttons on `ProductCard` works exactly as expected.
- Ensure interaction with the plus and minus buttons in the `ReviewItem` panel works exactly as expected.
