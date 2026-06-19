# Tailwind Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a semantic design system and refactor Tailwind classes for clarity using `cva` and `cn()`.

**Architecture:** Move hard-coded hex color values to semantic CSS variables inside the `@theme` block in `src/index.css`. Extract reusable UI component variants via `cva` and organize inline class names logically via `cn()` inside `src/components/ProductCard.tsx` and `src/App.tsx`.

**Tech Stack:** React, Tailwind CSS v4, shadcn UI.

---

### Task 1: Update `index.css` with semantic color tokens

**Files:**
- Modify: `src/index.css:85-90`

**Step 1: Write minimal implementation**

```css
  /* Brand color tokens */
  --color-brand: #7C3AED;
  --color-brand-hover: #6D28D9;
  --color-brand-light: rgba(124, 58, 237, 0.08);
  --color-brand-muted: rgba(124, 58, 237, 0.1);
  --color-success: #0AA288;
  --color-destructive: #D8392B;
```
*Note: Update usages of `#4E2FD2` to `--color-primary` (which may require setting `--primary` to that color or keeping the current shadcn primary if appropriate, actually since shadcn uses oklch, we'll redefine the `--primary` oklch to match `#4E2FD2`, or simply add `--color-brand-purple: #4E2FD2`). Based on our design, `#4E2FD2` becomes the primary token.

**Step 2: Run test to verify it passes**
Run: `pnpm run build`
Expected: Build passes with no CSS syntax errors.

**Step 3: Commit**
```bash
git add src/index.css
git commit -m "style: add semantic color tokens to theme"
```

---

### Task 2: Refactor `ProductCard.tsx`

**Files:**
- Modify: `src/components/ProductCard.tsx`

**Step 1: Write minimal implementation**
Extract button logic, refactor the main container class to use `cn()` with logical grouped ordering (Layout -> Spacing -> Typography -> Colors). Replace inline colors like `#D8392B` with `text-destructive`, `#4E2FD2B2` with `border-primary/70`, `#1F1F1F` with `text-foreground`, etc.

**Step 2: Run test to verify it passes**
Run: `pnpm run lint` and `pnpm run build`
Expected: Build and lint pass.

**Step 3: Commit**
```bash
git add src/components/ProductCard.tsx
git commit -m "refactor: organize ProductCard tailwind classes and use semantic tokens"
```

---

### Task 3: Refactor `App.tsx`

**Files:**
- Modify: `src/App.tsx`

**Step 1: Write minimal implementation**
Review inline hex strings in `App.tsx` (e.g., `#EDF4FF`, `#A8B2BD`, `#CED6DE`, `#1F1F1FBF`). Map to appropriate semantic tailwind classes (e.g., `bg-accent`, `text-muted-foreground`, `border-border`, `text-foreground/75`). Reorder long class strings using `cn()`.

**Step 2: Run test to verify it passes**
Run: `pnpm run lint` and `pnpm run build`
Expected: Build and lint pass.

**Step 3: Commit**
```bash
git add src/App.tsx
git commit -m "refactor: organize App tailwind classes and use semantic tokens"
```
