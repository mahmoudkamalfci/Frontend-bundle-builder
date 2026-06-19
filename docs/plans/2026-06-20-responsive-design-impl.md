# Responsive Design Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the Frontend Bundle Builder app fully responsive across mobile (< 640px), tablet (640–1023px), and desktop (≥ 1024px) using Tailwind CSS breakpoint classes only.

**Architecture:** Tailwind responsive prefixes applied directly in component JSX — no new dependencies or components. Three layout tiers: mobile (single-col stacked), tablet (multi-col product grid + horizontal review panel), desktop (two-col grid with sticky review panel). ProductCard switches between `flex-row` (mobile) and `flex-col` (tablet+) orientations.

**Tech Stack:** React 19, Tailwind CSS v4, TypeScript, Vite

---

### Task 1: App.tsx — verify layout grid is correct, remove any blocking styles

**Files:**
- Modify: `src/App.tsx`

**Step 1: Check current grid classes**

Open `src/App.tsx`. Confirm `<main>` uses `container mx-auto min-h-screen p-4 md:p-6 lg:p-8` and the inner div uses `grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8`. These are already correct — no changes needed to App.tsx layout.

**Step 2: Commit baseline**

```bash
git add -A
git commit -m "chore: note responsive baseline — App.tsx layout already correct"
```

---

### Task 2: BundleSteps.tsx — Update product card grid breakpoints

**Files:**
- Modify: `src/components/BundleSteps.tsx:70`

**Step 1: Find the product grid div**

In `BundleSteps.tsx` line 70:
```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
```

**Step 2: Replace with responsive grid**

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2">
```

**Step 3: Remove odd-last-child centering logic**

Lines 76–89 contain `isLastAndOdd` logic that centers the last card when count is odd in a 2-col grid. This no longer applies to the new responsive grid. Remove `isLastAndOdd` variable and its `className` usage:

Remove:
```tsx
const isLastAndOdd = arr.length % 2 !== 0 && idx === arr.length - 1
```

Change ProductCard `className` prop:
```tsx
// Remove this:
className={cn(
  isLastAndOdd ? 'sm:col-span-2 sm:w-[calc(50%-8px)] sm:justify-self-center' : ''
)}
// Replace with: (remove className prop entirely, or pass empty)
// No className prop needed
```

**Step 4: Verify dev server looks right at 375px and 768px**

Run: `pnpm run dev` and open browser at localhost. Check:
- At 375px: 1-col product grid ✅
- At 768px: 4-col product grid ✅
- At 1280px: 2-col product grid ✅

**Step 5: Commit**

```bash
git add src/components/BundleSteps.tsx
git commit -m "feat(responsive): update product grid to sm:3col md:4col lg:2col"
```

---

### Task 3: ProductCard.tsx — Responsive card orientation (flex-row mobile / flex-col tablet+)

**Files:**
- Modify: `src/components/ProductCard.tsx`

**Step 1: Update root card div orientation**

Current root div (line 46–53):
```tsx
<div
  className={cn(
    "relative flex w-full flex-row gap-4 rounded-[10px] p-3 text-left bg-white transition-all duration-200",
    ...
  )}
>
```

Change `flex-row` to responsive:
```tsx
<div
  className={cn(
    "relative flex w-full flex-col gap-3 rounded-[10px] p-3 text-left bg-white transition-all duration-200 max-sm:flex-row max-sm:gap-4",
    ...
  )}
>
```

**Step 2: Update image container**

Current (line 65):
```tsx
<div className="flex w-[100px] shrink-0 items-center justify-center bg-white">
```

Replace:
```tsx
<div className="flex w-full items-center justify-center bg-white max-sm:w-[100px] max-sm:shrink-0 sm:h-[110px]">
```

**Step 3: Ensure content area fills correctly**

Current content div (line 75):
```tsx
<div className="flex min-w-0 flex-1 flex-col">
```

This is already correct — `flex-1` works in both `flex-row` and `flex-col` parent contexts.

**Step 4: Update description — hide on very small multi-col contexts**

When cards are in a 4-col grid on `md`, descriptions may overflow. Add `line-clamp-2` (already present) and ensure it stays at 2 lines on small cards. No change needed, `line-clamp-2` already handles it.

**Step 5: Verify visually**

- At 375px: card is horizontal (image left, content right) ✅
- At 768px: card is vertical (image top, content below) ✅
- At 1280px: card is vertical in 2-col grid ✅

**Step 6: Commit**

```bash
git add src/components/ProductCard.tsx
git commit -m "feat(responsive): ProductCard flex-col on tablet+, flex-row on mobile"
```

---

### Task 4: ReviewPanel.tsx — Make sticky only on desktop, horizontal layout on tablet

**Files:**
- Modify: `src/components/ReviewPanel.tsx`

**Step 1: Fix sticky wrapper — desktop only**

Current outer wrapper (line 10):
```tsx
<div className="sticky top-6 lg:col-span-4">
```

Replace:
```tsx
<div className="lg:sticky lg:top-6 lg:col-span-4">
```

**Step 2: Change inner panel — tablet horizontal split**

Current inner panel (line 11):
```tsx
<div className="flex flex-col overflow-hidden rounded-[10px] bg-accent p-6">
```

Replace with responsive layout:
```tsx
<div className="flex flex-col overflow-hidden rounded-[10px] bg-accent p-4 sm:p-6 md:flex-row md:gap-6 lg:flex-col lg:gap-0 lg:p-6">
```

**Step 3: Wrap left side (header + items list) in a div**

Wrap the Panel Header + scrollable item list sections together in a flex div so they form the left column on tablet:

```tsx
{/* Left side: header + items — full width on mobile, flex-1 on tablet, full on desktop */}
<div className="flex flex-col md:flex-1 lg:w-full">
  {/* Panel Header */}
  <div className="mb-3 border-b border-border pb-3">
    ...header content...
  </div>

  {/* Scrollable item list */}
  <div className="flex flex-1 flex-col">
    ...items content...
  </div>
</div>
```

**Step 4: Wrap right side (totals + CTA) in a div**

Wrap the "Totals + CTA" section in a flex div forming the right column on tablet:

```tsx
{/* Right side: totals + CTA — full width on mobile, fixed width on tablet, full on desktop */}
<div className="flex flex-col gap-4 pt-4 md:w-[260px] md:shrink-0 md:pt-0 lg:w-full lg:pt-4">
  ...totals content...
</div>
```

**Step 5: Fix max-h on items list — desktop only**

Current scrollable items container (line 40):
```tsx
<div className="flex max-h-[350px] flex-col overflow-y-auto">
```

Replace:
```tsx
<div className="flex flex-col overflow-y-auto lg:max-h-[350px]">
```

**Step 6: Scale typography**

- Review panel heading (line 17): `text-[22px]` → `text-lg sm:text-[22px]`
- Big price (line 150): `text-[34px]` → `text-2xl md:text-[34px]`

**Step 7: Verify visually**

- At 375px: stacked vertically, no sticky, items not capped ✅
- At 768px: header+items on left, price+CTA on right ✅
- At 1280px: vertical layout, sticky, max-h-[350px] items ✅

**Step 8: Commit**

```bash
git add src/components/ReviewPanel.tsx
git commit -m "feat(responsive): ReviewPanel horizontal tablet layout, sticky desktop only"
```

---

### Task 5: BundleSteps.tsx — Scale accordion header typography

**Files:**
- Modify: `src/components/BundleSteps.tsx`

**Step 1: Scale step title font size**

Current (line 54):
```tsx
<span className="text-[22px] font-medium leading-tight text-foreground">
```

Replace:
```tsx
<span className="text-lg font-medium leading-tight text-foreground sm:text-[22px]">
```

**Step 2: Commit**

```bash
git add src/components/BundleSteps.tsx
git commit -m "feat(responsive): scale accordion title font on mobile"
```

---

### Task 6: Final cross-device verification pass

**Step 1: Run dev server**

```bash
pnpm run dev
```

**Step 2: Check 375px (iPhone SE)**

- Accordion: 1 step open, cards in 1-col ✅
- Cards: horizontal `flex-row` layout ✅
- Review panel: full width below, not sticky ✅
- No horizontal overflow (check `overflow-x: hidden` in browser devtools) ✅

**Step 3: Check 768px (iPad)**

- Accordion: cards in 3–4 col vertical layout ✅
- Review panel: horizontal split (left items, right totals) ✅
- No layout shift ✅

**Step 4: Check 1280px (Desktop)**

- Two-column layout: steps col-span-8, panel col-span-4 ✅
- Review panel sticky ✅
- Product cards: 2-col grid ✅

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete responsive overhaul across mobile/tablet/desktop"
```
