import { useState, useMemo } from 'react'
import {
  Camera,
  Shield,
  Bell,
  Grid,
  ShoppingBag,
  Check,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Truck,
  ChevronRight
} from 'lucide-react'
import { ProductCard } from './components/ProductCard'
import type { Product } from './components/ProductCard'
import { cn } from '@/lib/utils'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion'
import productsData from './data/products.json'
import productImg from './assets/images/products/product-2.png'
import './App.css'

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_CART: Record<string, number> = {
  'wyze-cam-v4::white': 1,
  'wyze-cam-pan-v3::white': 2,
  'wyze-sense-motion-sensor::default': 2,
  'wyze-sense-hub::default': 1,
  'wyze-microsd-card-256gb::default': 2,
  'cam-unlimited-plan::default': 1,
}

const SEED_VARIANTS: Record<string, string> = {
  'wyze-cam-v4': 'white',
  'wyze-cam-pan-v3': 'white',
  'wyze-cam-floodlight-v2': 'white',
  'wyze-battery-cam-pro': 'white',
}

// ─── Module-Level Sub-Components ──────────────────────────────────────────────

/** Scalloped satisfaction seal */
const ScallopSeal = () => {
  const points = 24
  const innerR = 41
  const outerR = 50
  const cx = 50
  let d = ''
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points
    const r = i % 2 === 0 ? outerR : innerR
    const x = cx + r * Math.cos(angle)
    const y = cx + r * Math.sin(angle)
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  d += ' Z'
  return (
    <div className="relative size-[72px] shrink-0 flex items-center justify-center select-none">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full text-[#4C1D95] fill-current">
        <path d={d} />
      </svg>
      <div className="relative z-10 flex flex-col items-center text-center text-white leading-[1.15] px-2">
        <span className="text-[12px] font-black tracking-tight">100%</span>
        <span className="text-[5px] font-bold tracking-widest uppercase">WYZE</span>
        <span className="text-[5px] tracking-tight leading-none font-medium opacity-90 mt-0.5">satisfaction</span>
        <span className="text-[5.5px] font-extrabold uppercase mt-0.5 border border-white px-0.5 rounded-[1px]">GUARANTEE</span>
      </div>
    </div>
  )
}

/** Accordion step number badge */
const StepBadge = ({ number, active }: { number: number; active: boolean }) => (
  <span
    className={cn(
      'size-7 rounded-full flex items-center justify-center text-[12px] font-extrabold shrink-0 transition-colors duration-200',
      active ? 'bg-[#7C3AED] text-white' : 'bg-neutral-100 text-neutral-400'
    )}
  >
    {number}
  </span>
)

/** Step icon renderer */
function StepIcon({ iconName, active }: { iconName: string; active: boolean }) {
  const cls = cn('size-5 shrink-0', active ? 'text-[#7C3AED]' : 'text-neutral-400')
  switch (iconName) {
    case 'camera': return <Camera className={cls} />
    case 'shield': return <Shield className={cls} />
    case 'bell': return <Bell className={cls} />
    case 'grid': return <Grid className={cls} />
    default: return <Shield className={cls} />
  }
}

/** Review panel list item */
interface ReviewItemProps {
  product: Product
  qty: number
  variantId: string
  variantName?: string
  isHub?: boolean
  isPlan?: boolean
  onQtyChange: (productId: string, variantId: string, qty: number) => void
}

function ReviewItem({
  product,
  qty,
  variantId,
  variantName,
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
      <div className="flex items-center flex-1 min-w-0 gap-2.5">
        {isPlan ? (
          <div className="size-10 shrink-0 bg-violet-50 border border-violet-100 rounded-xl flex items-center justify-center">
            <Shield className="size-5 text-[#7C3AED]" />
          </div>
        ) : (
          <div className="size-10 shrink-0 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center justify-center p-1">
            <img src={productImg} alt={product.title} style={imageStyle} className="max-h-full max-w-full object-contain" />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-[11px] text-neutral-900 leading-tight truncate">{product.title}</span>
          {variantName ? (
            <span className="text-[10px] font-bold text-[#7C3AED] mt-0.5 leading-none">{variantName}</span>
          ) : null}
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-lg p-0.5 gap-0.5 shrink-0">
        <button
          disabled={isHub}
          onClick={() => onQtyChange(product.id, variantId, qty - 1)}
          className="size-5.5 flex items-center justify-center bg-white border border-neutral-200 text-neutral-500 rounded-md hover:bg-neutral-50 transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
        >
          <Minus className="size-2.5 stroke-[3px]" />
        </button>
        <span className="w-5 text-center font-bold text-[11px] text-neutral-900 tabular-nums">{qty}</span>
        <button
          disabled={isHub}
          onClick={() => onQtyChange(product.id, variantId, qty + 1)}
          className="size-5.5 flex items-center justify-center bg-white border border-neutral-200 text-neutral-500 rounded-md hover:bg-neutral-50 transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
        >
          <Plus className="size-2.5 stroke-[3px]" />
        </button>
      </div>

      {/* Price */}
      <div className="w-[64px] text-right shrink-0 leading-none">
        {isHub ? (
          <>
            <span className="block text-[9px] text-neutral-400 line-through font-normal mb-0.5">$29.92</span>
            <span className="font-extrabold text-[11px] text-emerald-600">FREE</span>
          </>
        ) : isPlan ? (
          <>
            {product.compareAtPrice ? (
              <span className="block text-[9px] text-neutral-400 line-through font-normal mb-0.5">
                ${(product.compareAtPrice * qty).toFixed(2)}/mo
              </span>
            ) : null}
            <span className="font-extrabold text-[11px] text-[#7C3AED]">${(product.price * qty).toFixed(2)}/mo</span>
          </>
        ) : (
          <>
            {product.compareAtPrice ? (
              <span className="block text-[9px] text-neutral-400 line-through font-normal mb-0.5">
                ${(product.compareAtPrice * qty).toFixed(2)}
              </span>
            ) : null}
            <span className="font-extrabold text-[11px] text-[#7C3AED]">${(product.price * qty).toFixed(2)}</span>
          </>
        )}
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
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
      // Auto-add/remove Sense Hub when motion sensor is toggled
      if (productId === 'wyze-sense-motion-sensor') {
        if (qty > 0 && !('wyze-sense-hub::default' in next)) {
          next['wyze-sense-hub::default'] = 1
        } else if (qty <= 0 && 'wyze-sense-hub::default' in next) {
          delete next['wyze-sense-hub::default']
        }
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

  return (
    <div className="grow flex flex-col w-full text-left bg-white text-neutral-800 min-h-screen">



      {/* ── Toast Notifications ──────────────────────────────────────── */}
      {(showSaveSuccess || checkoutSuccess) ? (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full mt-4">
          {showSaveSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
              <Check className="size-4 text-emerald-500 shrink-0 stroke-[3px]" />
              <p className="text-sm"><span className="font-bold">Configuration saved!</span> Your setup will be restored on your next visit.</p>
            </div>
          ) : null}
          {checkoutSuccess ? (
            <div className="bg-violet-50 border border-violet-200 text-violet-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
              <Sparkles className="size-4 text-[#7C3AED] shrink-0" />
              <p className="text-sm"><span className="font-bold">Checkout initiated!</span> Total: <span className="font-bold">${summary.finalTotalActive.toFixed(2)}</span></p>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ── Main Two-Column Layout ───────────────────────────────────── */}
      <main className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Accordion Steps (7/12) */}
          <Accordion
            type="single"
            collapsible
            value={expandedStepIndex >= 0 ? `step-${expandedStepIndex}` : ''}
            onValueChange={(val) => {
              setExpandedStepIndex(val ? parseInt(val.replace('step-', ''), 10) : -1)
            }}
            className="lg:col-span-7 flex flex-col gap-3"
          >
            {productsData.steps.map((step, stepIdx) => {
              const isOpen = expandedStepIndex === stepIdx
              const selectedCount = getStepSelectedCount(step.products as unknown as Product[])

              return (
                <AccordionItem
                  key={step.id}
                  value={`step-${stepIdx}`}
                  className={cn(
                    'rounded-2xl overflow-hidden bg-white transition-all duration-200',
                    isOpen
                      ? 'border-2 border-[#7C3AED] shadow-[0_4px_20px_rgba(124,58,237,0.12)]'
                      : 'border border-neutral-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-neutral-300'
                  )}
                >
                  <AccordionTrigger className="px-5 py-4 w-full">
                    <div className="flex items-center justify-between w-full pr-2 gap-3">
                      <div className="flex items-center gap-3">
                        <StepBadge number={step.number} active={isOpen} />
                        <div className="flex items-center gap-2.5">
                          <StepIcon iconName={step.icon} active={isOpen} />
                          <div className="flex flex-col text-left">
                            <span className={cn('text-[10px] font-extrabold uppercase tracking-widest leading-none', isOpen ? 'text-[#7C3AED]' : 'text-neutral-400')}>
                              Step {step.number} of 4
                            </span>
                            <span className={cn('text-[15px] font-bold mt-0.5 leading-tight', isOpen ? 'text-neutral-900' : 'text-neutral-600')}>
                              {step.title}
                            </span>
                          </div>
                        </div>
                      </div>
                      {selectedCount > 0 ? (
                        <span className="text-[11px] font-bold text-[#7C3AED] bg-[#7C3AED]/10 px-2.5 py-1 rounded-full shrink-0 mr-1">
                          {selectedCount} selected
                        </span>
                      ) : null}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="bg-[#F8FAFC] px-5 pt-4 pb-5 flex flex-col gap-4 border-t border-neutral-100">
                    {/* Product Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {(step.products as unknown as Product[]).map((product) => {
                        const activeVarId = selectedVariants[product.id] || product.variants?.[0]?.id || 'default'
                        const variantQty = cart[`${product.id}::${activeVarId}`] || 0
                        const isSelected = isCardSelected(product)
                        return (
                          <ProductCard
                            key={product.id}
                            product={product}
                            activeVariantId={activeVarId}
                            quantity={variantQty}
                            isSelected={isSelected}
                            onQuantityChange={(vId, qty) => handleQuantityChange(product.id, vId, qty)}
                            onVariantChange={(vId) => handleVariantChange(product.id, vId)}
                            className={cn(product.id === 'wyze-battery-cam-pro' ? 'sm:col-span-2' : '')}
                          />
                        )
                      })}
                    </div>

                    {/* Next step button */}
                    {stepIdx < 3 ? (
                      <button
                        onClick={() => setExpandedStepIndex(stepIdx + 1)}
                        className="self-center mt-1 flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors duration-150 cursor-pointer active:scale-[0.97] shadow-sm"
                      >
                        Next: {productsData.steps[stepIdx + 1].title}
                        <ArrowRight className="size-4 stroke-[2.5px]" />
                      </button>
                    ) : null}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>

          {/* Right Column: Sticky Review Panel (5/12) */}
          <div className="lg:col-span-5 lg:sticky lg:top-[72px]">
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">

              {/* Panel Header */}
              <div className="px-5 pt-5 pb-4 border-b border-neutral-100">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Review</p>
                <h2 className="text-[17px] font-bold text-neutral-900 mt-0.5 leading-tight">Your security system</h2>
                <p className="text-[11.5px] text-neutral-400 mt-1 leading-relaxed">Review your personalized protection plan.</p>
              </div>

              {/* Scrollable item list */}
              <div className="px-5">
                {!summary.hasItems ? (
                  <div className="py-10 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="bg-neutral-50 p-3.5 rounded-2xl text-neutral-300">
                      <ShoppingBag className="size-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-500">Your system is empty</p>
                      <p className="text-xs text-neutral-400 mt-0.5 max-w-[200px] mx-auto leading-relaxed">
                        Select products from the steps on the left to start building.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col max-h-[340px] overflow-y-auto -mx-1 px-1">
                    {summary.cameras.length > 0 ? (
                      <div className="pt-4 pb-3">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-2.5">Cameras</p>
                        <div className="flex flex-col gap-3">
                          {summary.cameras.map(({ product, qty, variantId, variantName }) => (
                            <ReviewItem
                              key={`${product.id}::${variantId}`}
                              product={product}
                              qty={qty}
                              variantId={variantId}
                              variantName={variantName}
                              onQtyChange={handleQuantityChange}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {summary.plans.length > 0 ? (
                      <div className="pt-3 pb-3 border-t border-neutral-100">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-2.5">Plan</p>
                        <div className="flex flex-col gap-3">
                          {summary.plans.map(({ product, qty, variantId }) => (
                            <ReviewItem
                              key={`${product.id}::${variantId}`}
                              product={product}
                              qty={qty}
                              variantId={variantId}
                              isPlan
                              onQtyChange={handleQuantityChange}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {summary.sensors.length > 0 ? (
                      <div className="pt-3 pb-3 border-t border-neutral-100">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-2.5">Sensors</p>
                        <div className="flex flex-col gap-3">
                          {summary.sensors.map(({ product, qty, variantId }) => (
                            <ReviewItem
                              key={`${product.id}::${variantId}`}
                              product={product}
                              qty={qty}
                              variantId={variantId}
                              isHub={product.id === 'wyze-sense-hub'}
                              onQtyChange={handleQuantityChange}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {summary.accessories.length > 0 ? (
                      <div className="pt-3 pb-3 border-t border-neutral-100">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-2.5">Accessories</p>
                        <div className="flex flex-col gap-3">
                          {summary.accessories.map(({ product, qty, variantId }) => (
                            <ReviewItem
                              key={`${product.id}::${variantId}`}
                              product={product}
                              qty={qty}
                              variantId={variantId}
                              onQtyChange={handleQuantityChange}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Totals + CTA */}
              <div className="px-5 pb-5 pt-4 border-t border-neutral-100 flex flex-col gap-3">

                {/* Shipping */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-7 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                      <Truck className="size-3.5" />
                    </span>
                    <span className="font-semibold text-neutral-700">Fast Shipping</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 line-through font-normal mr-1">$5.99</span>
                    <span className="font-extrabold text-emerald-600">FREE</span>
                  </div>
                </div>

                {/* Seal + price block */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-dashed border-neutral-100">
                  <ScallopSeal />
                  <div className="flex flex-col items-end text-right">
                    {summary.hasItems ? (
                      <span className="bg-[#7C3AED] text-white px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide tabular-nums">
                        as low as ${summary.financingPrice}/mo
                      </span>
                    ) : null}
                    {summary.totalSavings > 0.01 ? (
                      <span className="text-neutral-400 line-through text-[13px] font-bold mt-1 tabular-nums">
                        ${summary.finalTotalCompare.toFixed(2)}
                      </span>
                    ) : null}
                    <span className="text-[28px] font-black text-[#7C3AED] leading-none mt-0.5 tabular-nums">
                      ${summary.finalTotalActive.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Savings pill */}
                {summary.totalSavings > 0.01 ? (
                  <div className="text-center text-[12px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl py-2 px-3">
                    🎉 You're saving ${summary.totalSavings.toFixed(2)} on your bundle!
                  </div>
                ) : null}

                {/* Checkout */}
                <button
                  onClick={handleCheckout}
                  disabled={!summary.hasItems}
                  className="w-full mt-1 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white font-extrabold py-3.5 rounded-xl text-[14px] tracking-wide transition-colors duration-150 cursor-pointer active:scale-[0.98] shadow-sm"
                >
                  Checkout — ${summary.finalTotalActive.toFixed(2)}
                </button>

                {/* Save link */}
                <button
                  onClick={handleSaveConfiguration}
                  className="self-center text-[11.5px] text-neutral-400 hover:text-neutral-600 font-medium underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Save my system for later
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default App
