# Tailwind Design System Refactoring

## Overview
This document outlines the design for standardizing the Tailwind CSS usage across the project by mapping inline hard-coded hex colors to a semantic design system, and organizing component classes using `cva` and `cn()`. The goal is to make the styling clearer, more scalable, and fully compliant with Tailwind v4 best practices, without modifying the underlying React logic or state flow.

## 1. CSS-First Theme Configuration (Tailwind v4)
The current UI uses several distinct hex values directly in component classes. We will abstract these into semantic CSS variables (using `oklch` formatting where applicable, or standard hex) within the `@theme` block in `src/index.css`.

### Token Mapping:
- **Brand/Primary (`#4E2FD2`)**: Maps to `--color-primary` (backgrounds, primary text, prominent borders).
- **Success/Savings (`#0AA288`)**: Maps to a new token `--color-success` (success messages, savings highlights).
- **Destructive/Sale (`#D8392B`)**: Maps to `--color-destructive` (strikethrough prices).
- **Accent Backgrounds (`#EDF4FF`)**: Maps to `--color-accent` or `--color-primary-muted` (accordion backgrounds, panel backgrounds).
- **Neutrals/Greys (`#0B0D10`, `#1F1F1F`, `#E6EBF0`, `#CED6DE`, `#A8B2BD`)**: Maps to standard `foreground`, `muted`, `border`, and `muted-foreground` tokens.

## 2. Component Class Refactoring
Currently, components like `App.tsx` and `ProductCard.tsx` feature very long, unstructured inline class strings.

### Strategy:
1. **Class Variance Authority (`cva`)**: We will extract heavily repeated UI element variants (such as badges, buttons, typography) using `cva` to define their base styles and their variants (e.g., active vs. inactive states).
2. **Logical Grouping**: Inside components, we will organize `className` attributes using `cn()` and logical groupings: `Layout -> Spacing -> Typography -> Colors`.
3. **Logic Preservation**: We will bypass any logic refactoring (React state, `useEffect` hooks, array mapping) and focus strictly on the `className` string manipulations and JSX structure related to styling.
