# Replace Accordion Icons Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the SVG Lucide icons in the step accordion with custom PNG icon images.

**Architecture:** We will statically import the 4 PNG icon images at the top of `src/App.tsx` and refactor the `StepIcon` component to return an `<img />` tag instead of Lucide React component instances, mapping them appropriately.

**Tech Stack:** React 19, Vite 8, Tailwind CSS v4

---

### Task 1: Static imports and mapping in App.tsx

**Files:**
- Modify: `src/App.tsx:1-23` (Add PNG image imports)
- Modify: `src/App.tsx:86-97` (Refactor `StepIcon` component to output `<img />` tags)

**Step 1: Import the icon images**
Add the following imports at the top of `src/App.tsx` (around line 21, near the other image imports):
```typescript
import cameraIcon from './assets/images/icons/camera-accordion-icon.png'
import securityIcon from './assets/images/icons/security-accordion-icon.png'
import sensorIcon from './assets/images/icons/sensor-accordion-icon.png'
import protectionIcon from './assets/images/icons/protection-accordion-icon.png'
```

**Step 2: Refactor StepIcon component**
Update `StepIcon` to match the following implementation:
```typescript
function StepIcon({ iconName, active }: { iconName: string; active: boolean }) {
  const cls = cn('size-5 shrink-0 transition-all duration-200', active ? 'opacity-100 scale-105' : 'opacity-60 grayscale hover:opacity-80')
  let src = securityIcon
  switch (iconName) {
    case 'camera':
      src = cameraIcon
      break
    case 'shield':
      src = securityIcon
      break
    case 'bell':
      src = sensorIcon
      break
    case 'grid':
      src = protectionIcon
      break
  }
  return <img src={src} className={cls} alt={`${iconName} icon`} />
}
```

**Step 3: Verify build**
Run: `pnpm run build`
Expected output: Build succeeds without any errors.

**Step 4: Commit**
```bash
git add src/App.tsx
git commit -m "feat: replace accordion step SVG icons with custom PNG images"
```
