# App.tsx Refactor — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce `src/App.tsx` from 541 lines to ~40 lines by extracting seed data, business logic, and JSX into focused, single-responsibility files.

**Architecture:** Custom hook (`useBundleCart`) owns all state and memoized summary. Five new components handle display concerns. `App.tsx` becomes a thin orchestrator that wires hook output to components.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Vite

---

## Pre-flight Check

Before starting, run the dev server to confirm the current state builds and renders correctly:

```bash
pnpm run dev
```

Expected: dev server starts, no console errors, page renders with accordion + review panel.

---

### Task 1: Extract Seed Data

**Files:**
- Create: `src/data/seed.ts`
- Modify: `src/App.tsx` (remove constants, add import)

**Step 1: Create `src/data/seed.ts`**

```ts
export const SEED_CART: Record<string, number> = {
  'wyze-cam-v4::white': 1,
  'wyze-cam-pan-v3::white': 2,
  'wyze-sense-motion-sensor::default': 2,
  'wyze-sense-hub::default': 1,
  'wyze-microsd-card-256gb::default': 2,
  'cam-unlimited-plan::default': 1,
}

export const SEED_VARIANTS: Record<string, string> = {
  'wyze-cam-v4': 'white',
  'wyze-cam-pan-v3': 'white',
  'wyze-cam-floodlight-v2': 'white',
  'wyze-battery-cam-pro': 'white',
}
```

**Step 2: Remove constants from `src/App.tsx` lines 26–40, add import**

```ts
import { SEED_CART, SEED_VARIANTS } from './data/seed'
```

**Step 3: Verify — build must pass, no runtime errors**

```bash
pnpm run build 2>&1 | tail -5
```
Expected: `✓ built in Xms`

**Step 4: Commit**

```bash
git add src/data/seed.ts src/App.tsx
git commit -m "refactor: extract seed data to src/data/seed.ts"
```

---

### Task 2: Create `useBundleCart` Custom Hook

**Files:**
- Create: `src/hooks/useBundleCart.ts`
- Modify: `src/App.tsx` (remove state/handlers/summary, add import + hook call)

**Step 1: Create `src/hooks/useBundleCart.ts`**

```ts
import { useState, useMemo } from 'react'
import productsData from '../data/products.json'
import type { Product } from '@/types'
import { SEED_CART, SEED_VARIANTS } from '../data/seed'

export function useBundleCart() {
  const [expandedStepIndex, setExpandedStepIndex] = useState<number>(0)

  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('wyze_bundle_cart')
      return saved ? JSON.parse(saved) : SEED_CART
    } catch {
      return SEED_CART
    }
  })

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('wyze_bundle_variants')
      return saved ? JSON.parse(saved) : SEED_VARIANTS
    } catch {
      return SEED_VARIANTS
    }
  })

  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  const handleQuantityChange = (productId: string, variantId: string, qty: number) => {
    const cartKey = `${productId}::${variantId}`
    setCart((prev) => {
      const next = { ...prev }
      if (qty <= 0) {
        delete next[cartKey]
      } else {
        next[cartKey] = qty
      }
      return next
    })
  }

  const handleVariantChange = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }))
  }

  const isCardSelected = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.some((v) => (cart[`${product.id}::${v.id}`] || 0) > 0)
    }
    return (cart[`${product.id}::default`] || 0) > 0
  }

  const getStepSelectedCount = (products: Product[]) =>
    products.filter((p) => isCardSelected(p)).length

  const summary = useMemo(() => {
    let subtotalActive = 0
    let subtotalCompare = 0
    const cameras: Array<{ product: Product; qty: number; variantId: string; variantName?: string }> = []
    const plans: Array<{ product: Product; qty: number; variantId: string }> = []
    const sensors: Array<{ product: Product; qty: number; variantId: string }> = []
    const accessories: Array<{ product: Product; qty: number; variantId: string }> = []

    Object.entries(cart).forEach(([cartKey, qty]) => {
      if (qty <= 0) return
      const [productId, variantId] = cartKey.split('::')
      let matchedProduct: Product | undefined
      let matchedStepId = ''
      productsData.steps.forEach((step) => {
        const found = step.products.find((p) => p.id === productId)
        if (found) { matchedProduct = found as unknown as Product; matchedStepId = step.id }
      })
      if (!matchedProduct) return
      subtotalActive += matchedProduct.price * qty
      subtotalCompare += (matchedProduct.compareAtPrice ?? matchedProduct.price) * qty
      const variantName = matchedProduct.variants?.find((v) => v.id === variantId)?.name
      const item = { product: matchedProduct, qty, variantId, variantName }
      if (matchedStepId === 'cameras') cameras.push(item)
      else if (matchedStepId === 'plans') plans.push(item)
      else if (matchedStepId === 'sensors') sensors.push(item)
      else if (matchedStepId === 'accessories') accessories.push(item)
    })

    const finalTotalActive = subtotalActive
    const finalTotalCompare = subtotalCompare + 5.99
    const totalSavings = finalTotalCompare - finalTotalActive
    const financingPrice = (finalTotalActive * 0.1021).toFixed(2)
    const hasItems = cameras.length > 0 || plans.length > 0 || sensors.length > 0 || accessories.length > 0
    return { cameras, plans, sensors, accessories, finalTotalActive, finalTotalCompare, totalSavings, financingPrice, hasItems }
  }, [cart])

  const handleSaveConfiguration = (e: React.MouseEvent) => {
    e.preventDefault()
    localStorage.setItem('wyze_bundle_cart', JSON.stringify(cart))
    localStorage.setItem('wyze_bundle_variants', JSON.stringify(selectedVariants))
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3500)
  }

  const handleCheckout = () => {
    setCheckoutSuccess(true)
    setTimeout(() => setCheckoutSuccess(false), 4000)
  }

  return {
    cart,
    selectedVariants,
    expandedStepIndex,
    setExpandedStepIndex,
    showSaveSuccess,
    checkoutSuccess,
    summary,
    handleQuantityChange,
    handleVariantChange,
    isCardSelected,
    getStepSelectedCount,
    handleSaveConfiguration,
    handleCheckout,
  }
}
```

**Step 2: In `src/App.tsx`, replace all state/handlers/summary with the hook call**

Remove lines 150–248 (everything from `const [expandedStepIndex...]` through `handleCheckout`).  
Add at the top of the `App` function body:

```ts
const {
  cart,
  selectedVariants,
  expandedStepIndex,
  setExpandedStepIndex,
  showSaveSuccess,
  checkoutSuccess,
  summary,
  handleQuantityChange,
  handleVariantChange,
  isCardSelected,
  getStepSelectedCount,
  handleSaveConfiguration,
  handleCheckout,
} = useBundleCart()
```

Add import at top of file:

```ts
import { useBundleCart } from './hooks/useBundleCart'
```

**Step 3: Verify build**

```bash
pnpm run build 2>&1 | tail -5
```
Expected: `✓ built in Xms`

**Step 4: Commit**

```bash
git add src/hooks/useBundleCart.ts src/App.tsx
git commit -m "refactor: extract cart logic into useBundleCart hook"
```

---

### Task 3: Extract `StepIcon` Component

**Files:**
- Create: `src/components/StepIcon.tsx`
- Modify: `src/App.tsx` (remove function, add import)

**Step 1: Create `src/components/StepIcon.tsx`**

```tsx
import cameraIcon from '../assets/images/icons/camera-accordion-icon.png'
import securityIcon from '../assets/images/icons/security-accordion-icon.png'
import sensorIcon from '../assets/images/icons/sensor-accordion-icon.png'
import protectionIcon from '../assets/images/icons/protection-accordion-icon.png'
import { cn } from '@/lib/utils'

interface StepIconProps {
  iconName: string
  active: boolean
}

export function StepIcon({ iconName, active }: StepIconProps) {
  const cls = cn('size-6 shrink-0 transition-all duration-200', active ? 'opacity-100 scale-105' : 'grayscale hover:opacity-80')

  let src = securityIcon
  switch (iconName) {
    case 'camera': src = cameraIcon; break
    case 'shield': src = securityIcon; break
    case 'bell':   src = sensorIcon; break
    case 'grid':   src = protectionIcon; break
  }

  return <img src={src} className={cls} alt={`${iconName} icon`} />
}
```

**Step 2: In `src/App.tsx`**

- Remove lines 46–64 (`StepIcon` function)
- Remove the four icon imports (lines 16–19)
- Add: `import { StepIcon } from './components/StepIcon'`

**Step 3: Verify build**

```bash
pnpm run build 2>&1 | tail -5
```

**Step 4: Commit**

```bash
git add src/components/StepIcon.tsx src/App.tsx
git commit -m "refactor: extract StepIcon component"
```

---

### Task 4: Extract `ReviewItem` Component

**Files:**
- Create: `src/components/ReviewItem.tsx`
- Modify: `src/App.tsx` (remove function, add import)
- Modify: `src/types/index.ts` — already has `ReviewItemProps`, no change needed

**Step 1: Create `src/components/ReviewItem.tsx`**

```tsx
import { Shield } from 'lucide-react'
import { QuantityStepper } from './QuantityStepper'
import productImg from '../assets/images/products/product-2.png'
import type { ReviewItemProps } from '@/types'

export function ReviewItem({
  product,
  qty,
  variantId,
  isHub = false,
  isPlan = false,
  onQtyChange,
}: ReviewItemProps) {
  const activeVariant = product.variants?.find((v) => v.id === variantId)
  const imageStyle =
    activeVariant?.imageFilter && activeVariant.imageFilter !== 'none'
      ? { filter: activeVariant.imageFilter }
      : {}

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Thumbnail + name */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {isPlan ? (
          <div className="flex size-10 shrink-0 items-center justify-center bg-transparent">
            <Shield className="size-6 text-primary" strokeWidth={1.5} />
          </div>
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[5px] bg-white p-1 shadow-sm">
            <img src={productImg} alt={product.title} style={imageStyle} className="max-h-full max-w-full object-contain" />
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          {isPlan && product.id === 'cam-unlimited-plan' ? (
            <span className="truncate text-[15px] font-medium leading-tight">
              <span className="font-bold text-foreground">Cam</span>{' '}
              <span className="font-bold text-primary">Unlimited</span>
            </span>
          ) : (
            <span className="truncate text-sm font-medium leading-4 text-foreground">{product.title}</span>
          )}
        </div>
      </div>

      {/* Stepper */}
      {!isPlan && (
        <QuantityStepper
          quantity={qty}
          onChange={(newQty) => onQtyChange(product.id, variantId, newQty)}
          disabled={isHub}
          className="shrink-0"
        />
      )}

      {/* Price */}
      <div className="flex w-[64px] shrink-0 flex-col items-end justify-center leading-none text-right">
        {isHub ? (
          <>
            <span className="mb-0.5 block text-[12px] line-through text-muted-foreground">$29.92</span>
            <span className="text-[14px] font-bold text-primary">FREE</span>
          </>
        ) : isPlan ? (
          <>
            {product.compareAtPrice ? (
              <span className="mb-0.5 block text-[12px] line-through text-muted-foreground">
                ${(product.compareAtPrice * qty).toFixed(2)}/mo
              </span>
            ) : null}
            <span className="text-[14px] font-semibold text-primary">${(product.price * qty).toFixed(2)}/mo</span>
          </>
        ) : (
          <>
            {product.compareAtPrice ? (
              <span className="mb-0.5 block text-sm leading-4 line-through text-muted-foreground">
                ${(product.compareAtPrice * qty).toFixed(2)}
              </span>
            ) : null}
            <span className="text-sm font-semibold leading-4 text-primary">${(product.price * qty).toFixed(2)}</span>
          </>
        )}
      </div>
    </div>
  )
}
```

**Step 2: In `src/App.tsx`**

- Remove lines 68–145 (`ReviewItem` function)
- Remove `import { Shield, ... }` — keep `Check` and `Sparkles` (still used for toasts), remove `Shield`
- Remove `import productImg from ...` (line 15)
- Add: `import { ReviewItem } from './components/ReviewItem'`

**Step 3: Verify build**

```bash
pnpm run build 2>&1 | tail -5
```

**Step 4: Commit**

```bash
git add src/components/ReviewItem.tsx src/App.tsx
git commit -m "refactor: extract ReviewItem component"
```

---

### Task 5: Extract `ToastNotifications` Component

**Files:**
- Create: `src/components/ToastNotifications.tsx`
- Modify: `src/App.tsx` (remove toast JSX, add import)

**Step 1: Create `src/components/ToastNotifications.tsx`**

```tsx
import { Check, Sparkles } from 'lucide-react'

interface ToastNotificationsProps {
  showSaveSuccess: boolean
  checkoutSuccess: boolean
  totalAmount: number
}

export function ToastNotifications({ showSaveSuccess, checkoutSuccess, totalAmount }: ToastNotificationsProps) {
  if (!showSaveSuccess && !checkoutSuccess) return null

  return (
    <div className="mx-auto mt-4 w-full max-w-[1200px] px-4 sm:px-6">
      {showSaveSuccess ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-sm">
          <Check className="size-4 shrink-0 stroke-[3px] text-emerald-500" />
          <p className="text-sm"><span className="font-bold">Configuration saved!</span> Your setup will be restored on your next visit.</p>
        </div>
      ) : null}
      {checkoutSuccess ? (
        <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-violet-800 shadow-sm">
          <Sparkles className="size-4 shrink-0 text-brand" />
          <p className="text-sm"><span className="font-bold">Checkout initiated!</span> Total: <span className="font-bold">${totalAmount.toFixed(2)}</span></p>
        </div>
      ) : null}
    </div>
  )
}
```

**Step 2: In `src/App.tsx`**

- Remove toast JSX block (lines 254–269)
- Remove `Check` and `Sparkles` from lucide-react imports (now in toast component)
- Add: `import { ToastNotifications } from './components/ToastNotifications'`
- Replace removed JSX with:

```tsx
<ToastNotifications
  showSaveSuccess={showSaveSuccess}
  checkoutSuccess={checkoutSuccess}
  totalAmount={summary.finalTotalActive}
/>
```

**Step 3: Verify build**

```bash
pnpm run build 2>&1 | tail -5
```

**Step 4: Commit**

```bash
git add src/components/ToastNotifications.tsx src/App.tsx
git commit -m "refactor: extract ToastNotifications component"
```

---

### Task 6: Extract `BundleSteps` Component (Left Accordion Column)

**Files:**
- Create: `src/components/BundleSteps.tsx`
- Modify: `src/App.tsx` (remove accordion JSX, add import)

**Step 1: Create `src/components/BundleSteps.tsx`**

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion'
import { Button } from './ui/button'
import { ProductCard } from './ProductCard'
import { StepIcon } from './StepIcon'
import { cn } from '@/lib/utils'
import productsData from '../data/products.json'
import type { Product } from '@/types'

interface BundleStepsProps {
  expandedStepIndex: number
  setExpandedStepIndex: (index: number) => void
  cart: Record<string, number>
  selectedVariants: Record<string, string>
  isCardSelected: (product: Product) => boolean
  getStepSelectedCount: (products: Product[]) => number
  onQuantityChange: (productId: string, variantId: string, qty: number) => void
  onVariantChange: (productId: string, variantId: string) => void
}

export function BundleSteps({
  expandedStepIndex,
  setExpandedStepIndex,
  cart,
  selectedVariants,
  isCardSelected,
  getStepSelectedCount,
  onQuantityChange,
  onVariantChange,
}: BundleStepsProps) {
  return (
    <div className="flex flex-col gap-6 lg:col-span-8">
      <Accordion
        type="single"
        collapsible
        value={expandedStepIndex >= 0 ? `step-${expandedStepIndex}` : ''}
        onValueChange={(val) => {
          setExpandedStepIndex(val ? parseInt(val.replace('step-', ''), 10) : -1)
        }}
      >
        {productsData.steps.map((step, stepIdx) => {
          const isOpen = expandedStepIndex === stepIdx
          const selectedCount = getStepSelectedCount(step.products as unknown as Product[])

          return (
            <AccordionItem
              key={step.id}
              value={`step-${stepIdx}`}
              className={cn(
                'bg-white not-last:border-b-0',
                isOpen ? 'rounded-[10px] bg-accent' : ''
              )}
            >
              <AccordionTrigger className="flex w-full flex-col gap-3 [&_svg]:absolute [&_svg]:bottom-[20px] [&_svg]:right-4">
                <div className="flex w-full flex-col gap-1">
                  <span className="px-4 text-xs font-normal uppercase leading-none tracking-widest text-muted-foreground">
                    Step {step.number} of 4
                  </span>
                  <hr className="flex-1 border-t border-foreground" />
                </div>
                <div className="flex w-full items-center justify-between pl-4 pr-10">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5">
                      <StepIcon iconName={step.icon} active={isOpen} />
                      <div className="flex flex-col text-left">
                        <span className="text-[22px] font-medium leading-tight text-foreground">
                          {step.title}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedCount > 0 ? (
                    <span className="text-sm font-normal text-primary">
                      {selectedCount} selected
                    </span>
                  ) : null}
                </div>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-4 border-t border-neutral-100 bg-accent px-5 pb-5 pt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(step.products as unknown as Product[]).map((product, idx, arr) => {
                    const activeVarId = selectedVariants[product.id] || product.variants?.[0]?.id || 'default'
                    const variantQty = cart[`${product.id}::${activeVarId}`] || 0
                    const isSelected = isCardSelected(product)
                    const isLastAndOdd = arr.length % 2 !== 0 && idx === arr.length - 1
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        activeVariantId={activeVarId}
                        quantity={variantQty}
                        isSelected={isSelected}
                        onQuantityChange={(vId, qty) => onQuantityChange(product.id, vId, qty)}
                        onVariantChange={(vId) => onVariantChange(product.id, vId)}
                        className={cn(isLastAndOdd ? 'sm:col-span-2 sm:w-[calc(50%-8px)] sm:justify-self-center' : '')}
                      />
                    )
                  })}
                </div>

                {stepIdx < 3 ? (
                  <Button
                    variant="outline"
                    onClick={() => setExpandedStepIndex(stepIdx + 1)}
                    className="h-10 cursor-pointer self-center rounded-[8px] border border-primary bg-transparent px-6 text-lg text-primary transition-colors duration-150 hover:bg-primary/5 active:scale-[0.97]"
                  >
                    Next: {productsData.steps[stepIdx + 1].title}
                  </Button>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
```

**Step 2: In `src/App.tsx`**

- Remove accordion JSX block (lines 276–366)
- Remove accordion and button imports (they're now in BundleSteps)
- Add: `import { BundleSteps } from './components/BundleSteps'`
- Replace removed JSX with:

```tsx
<BundleSteps
  expandedStepIndex={expandedStepIndex}
  setExpandedStepIndex={setExpandedStepIndex}
  cart={cart}
  selectedVariants={selectedVariants}
  isCardSelected={isCardSelected}
  getStepSelectedCount={getStepSelectedCount}
  onQuantityChange={handleQuantityChange}
  onVariantChange={handleVariantChange}
/>
```

**Step 3: Verify build**

```bash
pnpm run build 2>&1 | tail -5
```

**Step 4: Commit**

```bash
git add src/components/BundleSteps.tsx src/App.tsx
git commit -m "refactor: extract BundleSteps accordion component"
```

---

### Task 7: Extract `ReviewPanel` Component (Right Sticky Column)

**Files:**
- Create: `src/components/ReviewPanel.tsx`
- Modify: `src/App.tsx` (remove review panel JSX, add import)

**Step 1: Create `src/components/ReviewPanel.tsx`**

```tsx
import { ShoppingBag } from 'lucide-react'
import { Button } from './ui/button'
import { ReviewItem } from './ReviewItem'
import fastShippingIcon from '../assets/images/icons/fast_shipping.png'
import satisfactionBadge from '../assets/images/icons/satisfaction_badge.png'
import type { Product } from '@/types'

interface SummaryItem {
  product: Product
  qty: number
  variantId: string
  variantName?: string
}

interface ReviewPanelProps {
  summary: {
    cameras: SummaryItem[]
    plans: SummaryItem[]
    sensors: SummaryItem[]
    accessories: SummaryItem[]
    finalTotalActive: number
    finalTotalCompare: number
    totalSavings: number
    financingPrice: string
    hasItems: boolean
  }
  onQtyChange: (productId: string, variantId: string, qty: number) => void
  onSave: (e: React.MouseEvent) => void
  onCheckout: () => void
}

export function ReviewPanel({ summary, onQtyChange, onSave, onCheckout }: ReviewPanelProps) {
  return (
    <div className="sticky top-6 lg:col-span-4">
      <div className="flex flex-col overflow-hidden rounded-[10px] bg-accent p-6">

        {/* Panel Header */}
        <div className="mb-3 border-b border-border pb-3">
          <span className="mb-4 inline-block text-xs uppercase leading-none tracking-widest text-muted-foreground">Review</span>
          <h2 className="text-[22px] font-medium leading-tight text-foreground">Your security system</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/75">Review your personalized protection system designed to keep what matters most safe.</p>
        </div>

        {/* Scrollable item list */}
        <div className="flex flex-1 flex-col">
          {!summary.hasItems ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="rounded-2xl bg-white p-4 text-neutral-300">
                <ShoppingBag className="size-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Your system is empty</p>
                <p className="mx-auto mt-1 max-w-[200px] text-xs leading-relaxed text-foreground/75">
                  Select products from the steps on the left to start building.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex max-h-[350px] flex-col overflow-y-auto">
              {summary.cameras.length > 0 ? (
                <div className="border-b border-border pb-3">
                  <p className="pb-1 text-xs uppercase leading-4 text-muted-foreground">Cameras</p>
                  <div className="flex flex-col gap-4">
                    {summary.cameras.map(({ product, qty, variantId }) => (
                      <ReviewItem key={`${product.id}::${variantId}`} product={product} qty={qty} variantId={variantId} onQtyChange={onQtyChange} />
                    ))}
                  </div>
                </div>
              ) : null}

              {summary.sensors.length > 0 ? (
                <div className="border-b border-border pb-3 pt-4">
                  <p className="pb-1 text-xs uppercase leading-4 text-muted-foreground">Sensors</p>
                  <div className="flex flex-col gap-4">
                    {summary.sensors.map(({ product, qty, variantId }) => (
                      <ReviewItem key={`${product.id}::${variantId}`} product={product} qty={qty} variantId={variantId} isHub={product.id === 'wyze-sense-hub'} onQtyChange={onQtyChange} />
                    ))}
                  </div>
                </div>
              ) : null}

              {summary.accessories.length > 0 ? (
                <div className="border-b border-border pb-3 pt-4">
                  <p className="pb-1 text-xs uppercase leading-4 text-muted-foreground">Accessories</p>
                  <div className="flex flex-col gap-4">
                    {summary.accessories.map(({ product, qty, variantId }) => (
                      <ReviewItem key={`${product.id}::${variantId}`} product={product} qty={qty} variantId={variantId} onQtyChange={onQtyChange} />
                    ))}
                  </div>
                </div>
              ) : null}

              {summary.plans.length > 0 ? (
                <div className="border-b border-border pb-3 pt-4">
                  <p className="pb-1 text-xs uppercase leading-4 text-muted-foreground">Plan</p>
                  <div className="flex flex-col gap-4">
                    {summary.plans.map(({ product, qty, variantId }) => (
                      <ReviewItem key={`${product.id}::${variantId}`} product={product} qty={qty} variantId={variantId} isPlan onQtyChange={onQtyChange} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Totals + CTA */}
        <div className="flex flex-col gap-4 pt-4">

          {/* Shipping */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[5px] bg-white shadow-sm">
                <img src={fastShippingIcon} alt="Fast Shipping" className="size-8 object-contain" />
              </span>
              <span className="text-sm leading-4 text-foreground">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-end justify-center leading-none">
              <span className="text-sm leading-4 line-through text-muted-foreground">$5.99</span>
              <span className="text-sm font-bold leading-4 text-primary">FREE</span>
            </div>
          </div>

          {/* Seal + price block */}
          <div className="mt-2 flex items-center justify-between gap-3 pt-6">
            <img src={satisfactionBadge} alt="100% Satisfaction Guarantee" className="size-[78px] shrink-0 object-contain" />
            <div className="flex flex-col items-end text-right">
              {summary.hasItems ? (
                <span className="mb-2 rounded bg-primary px-2 py-0.5 text-sm text-white">
                  as low as ${summary.financingPrice}/mo
                </span>
              ) : null}
              <div className="flex items-center gap-2">
                {summary.totalSavings > 0.01 ? (
                  <span className="text-lg leading-5 tabular-nums line-through text-muted-foreground">
                    ${summary.finalTotalCompare.toFixed(2)}
                  </span>
                ) : null}
                <span className="text-[34px] font-bold leading-none tracking-tight tabular-nums text-primary">
                  ${summary.finalTotalActive.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Savings message */}
          {summary.totalSavings > 0.01 ? (
            <div className="text-center text-xs font-medium leading-4 text-success">
              Congrats! You're saving ${summary.totalSavings.toFixed(2)} on your security bundle!
            </div>
          ) : null}

          {/* Checkout */}
          <Button
            onClick={onCheckout}
            disabled={!summary.hasItems}
            className="h-12 w-full cursor-pointer rounded bg-primary text-lg font-bold leading-4 text-white shadow-sm transition-colors duration-150 hover:bg-primary/80 active:scale-[0.98] disabled:opacity-40"
          >
            Checkout
          </Button>

          {/* Save link */}
          <button
            onClick={onSave}
            className="mt-1 cursor-pointer self-center text-sm italic underline underline-offset-2 transition-colors text-muted-foreground hover:text-foreground"
          >
            Save my system for later
          </button>
        </div>

      </div>
    </div>
  )
}
```

**Step 2: In `src/App.tsx`**

- Remove review panel JSX block (lines 369–533)
- Remove remaining unused imports (`ShoppingBag`, `fastShippingIcon`, `satisfactionBadge`, `productImg`, `ProductCard`)
- Add: `import { ReviewPanel } from './components/ReviewPanel'`
- Replace removed JSX with:

```tsx
<ReviewPanel
  summary={summary}
  onQtyChange={handleQuantityChange}
  onSave={handleSaveConfiguration}
  onCheckout={handleCheckout}
/>
```

**Step 3: Verify build**

```bash
pnpm run build 2>&1 | tail -5
```

**Step 4: Commit**

```bash
git add src/components/ReviewPanel.tsx src/App.tsx
git commit -m "refactor: extract ReviewPanel component"
```

---

### Task 8: Final App.tsx Cleanup & Verification

**Files:**
- Modify: `src/App.tsx` — remove `App.css` import if empty, clean up unused imports

**Step 1: Check `src/App.css`**

```bash
cat src/App.css
```

If it's empty or just a comment, it can stay (harmless). If it imports something, keep the import.

**Step 2: Final `src/App.tsx` should look like this:**

```tsx
import { useBundleCart } from './hooks/useBundleCart'
import { BundleSteps } from './components/BundleSteps'
import { ReviewPanel } from './components/ReviewPanel'
import { ToastNotifications } from './components/ToastNotifications'
import './App.css'

function App() {
  const {
    cart,
    selectedVariants,
    expandedStepIndex,
    setExpandedStepIndex,
    showSaveSuccess,
    checkoutSuccess,
    summary,
    handleQuantityChange,
    handleVariantChange,
    isCardSelected,
    getStepSelectedCount,
    handleSaveConfiguration,
    handleCheckout,
  } = useBundleCart()

  return (
    <main className="container mx-auto min-h-screen p-4 md:p-6 lg:p-8">
      <ToastNotifications
        showSaveSuccess={showSaveSuccess}
        checkoutSuccess={checkoutSuccess}
        totalAmount={summary.finalTotalActive}
      />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <BundleSteps
          expandedStepIndex={expandedStepIndex}
          setExpandedStepIndex={setExpandedStepIndex}
          cart={cart}
          selectedVariants={selectedVariants}
          isCardSelected={isCardSelected}
          getStepSelectedCount={getStepSelectedCount}
          onQuantityChange={handleQuantityChange}
          onVariantChange={handleVariantChange}
        />
        <ReviewPanel
          summary={summary}
          onQtyChange={handleQuantityChange}
          onSave={handleSaveConfiguration}
          onCheckout={handleCheckout}
        />
      </div>
    </main>
  )
}

export default App
```

**Step 3: Run lint**

```bash
pnpm run lint
```
Expected: 0 errors (fix any unused import warnings).

**Step 4: Final build + smoke test**

```bash
pnpm run build && pnpm run preview
```

Manually verify in browser:
- [ ] Accordion opens/closes
- [ ] Product cards add/remove from review panel
- [ ] Variant switcher works
- [ ] Quantity stepper works
- [ ] "Save my system" toast appears
- [ ] "Checkout" button triggers checkout toast
- [ ] Totals update correctly

**Step 5: Final commit**

```bash
git add -A
git commit -m "refactor: finalize App.tsx split — thin orchestrator (~55 lines)"
```

---

## Result

| File | Before | After |
|---|---|---|
| `App.tsx` | 541 lines | ~55 lines |
| `hooks/useBundleCart.ts` | — | ~90 lines |
| `components/BundleSteps.tsx` | — | ~90 lines |
| `components/ReviewPanel.tsx` | — | ~120 lines |
| `components/ReviewItem.tsx` | — | ~65 lines |
| `components/StepIcon.tsx` | — | ~25 lines |
| `components/ToastNotifications.tsx` | — | ~25 lines |
| `data/seed.ts` | — | ~15 lines |
