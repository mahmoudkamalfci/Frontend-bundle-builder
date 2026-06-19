# Responsive Design Overhaul — Design Doc

**Date:** 2026-06-20  
**Approach:** Tailwind Breakpoint Overhaul (Approach A)

## Goal

Make the Frontend Bundle Builder app fit correctly on all screen sizes — mobile phones, tablets, and desktops — using only Tailwind CSS responsive prefixes and no new dependencies.

## Breakpoint Strategy

| Breakpoint | Width     | Intent             |
|------------|-----------|--------------------|
| (default)  | < 640px   | Mobile             |
| `sm`       | ≥ 640px   | Tablet (landscape start) |
| `md`       | ≥ 768px   | Tablet (wider)     |
| `lg`       | ≥ 1024px  | Desktop two-column |

## Layout Per Breakpoint

### Mobile (< lg)
- Single-column grid (`grid-cols-1`)
- BundleSteps full width → ReviewPanel full width below
- ReviewPanel is **not** sticky

### Tablet (sm–lg)
- Still single-column grid
- Product cards switch to multi-column horizontal grid (`sm:grid-cols-3 md:grid-cols-4`)
- ProductCard flips from `flex-row` → `flex-col` (vertical card layout)
- ReviewPanel has a **horizontal split**: items list left, price+CTA right

### Desktop (lg+)
- Two-column `grid-cols-12`: BundleSteps `col-span-8`, ReviewPanel `col-span-4`
- ReviewPanel is `sticky top-6`
- ProductCard grid: `lg:grid-cols-2`
- ProductCard orientation back to `flex-col` in narrower 2-col grid

## Component Changes

### `App.tsx`
- No layout class changes needed (already uses `grid-cols-1 lg:grid-cols-12`)
- ReviewPanel sticky wrapper is managed inside ReviewPanel itself

### `BundleSteps.tsx`
- Product grid: `grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2`
- Remove odd-last-child `sm:col-span-2` trick (not needed in new grid)

### `ProductCard.tsx`
- Root: `flex-col sm:flex-col` always vertical (works in multi-col grid)
  - At mobile single-col, switch to `flex-row` using `max-sm:flex-row`
- Image container: `max-sm:w-[100px] sm:w-full sm:h-[120px]`
- Content area: `max-sm:flex-1 sm:w-full`
- Bottom (stepper + price): stays `flex items-end justify-between`

### `ReviewPanel.tsx`
- Remove `sticky top-6` from wrapper — move to `lg:sticky lg:top-6`
- Remove hardcoded `max-h-[350px]` on items list — use `lg:max-h-[350px]`
- At `md` breakpoint: inner panel uses `md:flex-row md:gap-6` split:
  - Left: header + scrollable items list (`md:flex-1`)
  - Right: totals, badge, checkout, save link (`md:w-[280px]`)

### Typography
- Step accordion title: `text-lg sm:text-[22px]`
- Review panel heading: `text-lg sm:text-[22px]`
- Big price: `text-2xl md:text-[34px]`

## Success Criteria
- [ ] Mobile (375px): single-column, cards stacked vertically, review panel below
- [ ] Tablet (768px): product cards in 3–4 col grid, review panel horizontal split
- [ ] Desktop (1280px): two-column layout, sticky review panel, 2-col product grid
- [ ] No content overflow / horizontal scroll on any breakpoint
- [ ] All interactive elements (buttons, steppers) remain comfortably tappable
