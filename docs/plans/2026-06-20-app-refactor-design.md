# App.tsx Refactor — Design Document

**Date:** 2026-06-20  
**Status:** Approved  
**Option:** A — Custom Hook + Feature-Sliced Components

---

## Problem

`src/App.tsx` is 541 lines and mixes four distinct concerns:
1. Seed data constants
2. Sub-components (`StepIcon`, `ReviewItem`)
3. Business logic state + handlers + memoized summary
4. Full page layout JSX (two columns, accordion, review panel)

This violates the single-responsibility principle and makes the file hard to navigate, test, or extend.

---

## Goal

Reduce `App.tsx` to a thin orchestrator (~40 lines) by extracting each concern into a dedicated, focused file. Apply Vercel React best-practice rules (`rerender-no-inline-components`, `rerender-functional-setstate`, `rerender-lazy-state-init`, `bundle-barrel-imports`).

---

## Approved Architecture

### File Map

```
src/
├── App.tsx                          (~40 lines — thin orchestrator)
├── data/
│   └── seed.ts                      [NEW] SEED_CART + SEED_VARIANTS constants
├── hooks/
│   └── useBundleCart.ts             [NEW] state, handlers, useMemo summary
├── components/
│   ├── StepIcon.tsx                 [NEW] icon switcher
│   ├── ReviewItem.tsx               [NEW] single line-item in review panel
│   ├── ToastNotifications.tsx       [NEW] save/checkout success toasts
│   ├── BundleSteps.tsx              [NEW] Accordion left column
│   ├── ReviewPanel.tsx              [NEW] sticky right panel
│   ├── ProductCard.tsx              (existing — untouched)
│   ├── QuantityStepper.tsx          (existing — untouched)
│   └── ui/                          (untouched)
└── types/index.ts                   (existing — add StepIconName alias)
```

### Data Flow

```
App.tsx
  └─ useBundleCart()
       returns: { cart, selectedVariants, summary,
                  handleQuantityChange, handleVariantChange,
                  handleSaveConfiguration, handleCheckout,
                  showSaveSuccess, checkoutSuccess,
                  expandedStepIndex, setExpandedStepIndex }
           ├─► <ToastNotifications />
           ├─► <BundleSteps />
           └─► <ReviewPanel />
                  └─► <ReviewItem />
```

---

## Vercel Rules Applied

| Rule | How |
|---|---|
| `rerender-no-inline-components` | `StepIcon` & `ReviewItem` lifted to module-level files |
| `rerender-functional-setstate` | `setCart(prev => ...)` preserved |
| `rerender-lazy-state-init` | `useState(() => ...)` for localStorage preserved |
| `bundle-barrel-imports` | Each component imported directly, no barrel `index.ts` |
