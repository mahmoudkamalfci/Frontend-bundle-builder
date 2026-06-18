import { useState, useMemo } from 'react'
import {
  Shield,
  ShoppingBag,
  Check,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react'
import { ProductCard } from './components/ProductCard'
import type { Product } from './components/ProductCard'
import { cn } from '@/lib/utils'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion'
import { Button } from './components/ui/button'
import productsData from './data/products.json'
import productImg from './assets/images/products/product-2.png'
import cameraIcon from './assets/images/icons/camera-accordion-icon.png'
import securityIcon from './assets/images/icons/security-accordion-icon.png'
import sensorIcon from './assets/images/icons/sensor-accordion-icon.png'
import protectionIcon from './assets/images/icons/protection-accordion-icon.png'
import fastShippingIcon from './assets/images/icons/fast_shipping.png'
import satisfactionBadge from './assets/images/icons/satisfaction_badge.png'
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


/** Step icon renderer */
function StepIcon({ iconName, active }: { iconName: string; active: boolean }) {
  const cls = cn('size-6 shrink-0 transition-all duration-200', active ? 'opacity-100 scale-105' : 'grayscale hover:opacity-80')
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

/** Review panel list item */
interface ReviewItemProps {
  product: Product
  qty: number
  variantId: string
  isHub?: boolean
  isPlan?: boolean
  onQtyChange: (productId: string, variantId: string, qty: number) => void
}

function ReviewItem({
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
      <div className="flex items-center flex-1 min-w-0 gap-3">
        {isPlan ? (
          <div className="size-10 shrink-0 bg-transparent flex items-center justify-center">
            <Shield className="size-6 text-[#4E2FD2]" strokeWidth={1.5} />
          </div>
        ) : (
          <div className="size-10 shrink-0 bg-white rounded-[5px] flex items-center justify-center p-1 shadow-sm">
            <img src={productImg} alt={product.title} style={imageStyle} className="max-h-full max-w-full object-contain" />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          {isPlan && product.id === 'cam-unlimited-plan' ? (
            <span className="text-[15px] leading-tight truncate">
              <span className="font-bold text-[#1F1F1F]">Cam</span> <span className="font-bold text-[#4E2FD2]">Unlimited</span>
            </span>
          ) : (
            <span className="text-sm text-[#0B0D10] leading-4 truncate">{product.title}</span>
          )}
        </div>
      </div>

      {/* Stepper */}
      {!isPlan && (
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="outline"
            disabled={isHub}
            onClick={() => onQtyChange(product.id, variantId, qty - 1)}
            className="size-5 p-0 flex items-center justify-center bg-white border-2 border-[#E6EBF0] text-neutral-400 hover:text-neutral-600 disabled:opacity-35 rounded-sm transition-all cursor-pointer hover:bg-neutral-50 active:scale-95 shadow-none"
            aria-label="Decrease quantity"
          >
            <Minus className="size-2 stroke-[3px]" />
          </Button>
          <span className="w-5 text-center text-[#0B0D10] text-sm leading-4 tabular-nums select-none">{qty}</span>
          <Button
            variant="outline"
            disabled={isHub}
            onClick={() => onQtyChange(product.id, variantId, qty + 1)}
            className="size-5 p-0 flex items-center justify-center bg-white border-2 border-[#E6EBF0] text-neutral-600 hover:text-neutral-800 rounded-sm transition-all cursor-pointer hover:bg-neutral-200 active:scale-95 shadow-none"
            aria-label="Increase quantity"
          >
            <Plus className="size-2 stroke-[3px]" />
          </Button>
        </div>
      )}

      {/* Price */}
      <div className="w-[64px] text-right shrink-0 leading-none flex flex-col items-end justify-center">
        {isHub ? (
          <>
            <span className="block text-[12px] text-[#575757] line-through mb-0.5">$29.92</span>
            <span className="font-bold text-[14px] text-[#4E2FD2]">FREE</span>
          </>
        ) : isPlan ? (
          <>
            {product.compareAtPrice ? (
              <span className="block text-[12px] text-[#575757] line-through mb-0.5">
                ${(product.compareAtPrice * qty).toFixed(2)}/mo
              </span>
            ) : null}
            <span className="font-semibold text-[14px] text-[#4E2FD2]">${(product.price * qty).toFixed(2)}/mo</span>
          </>
        ) : (
          <>
            {product.compareAtPrice ? (
              <span className="block text-sm text-[#6F7882] line-through leading-4 mb-0.5">
                ${(product.compareAtPrice * qty).toFixed(2)}
              </span>
            ) : null}
            <span className="font-semibold text-sm text-[#4E2FD2] leading-4">${(product.price * qty).toFixed(2)}</span>
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
    <main className="container mx-auto min-h-screen p-4 md:p-6 lg:p-8">

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* Left Column: Accordion Steps (7/12) */}

        <div className="lg:col-span-8 flex flex-col gap-6">
          <Accordion
            type="single"
            collapsible
            value={expandedStepIndex >= 0 ? `step-${expandedStepIndex}` : ''}
            onValueChange={(val) => {
              setExpandedStepIndex(val ? parseInt(val.replace('step-', ''), 10) : -1)
            }}
            className=""
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
                    isOpen
                      ? 'bg-[#EDF4FF] rounded-[10px]'
                      : ''
                  )}
                >
                  <AccordionTrigger className="w-full flex flex-col gap-3 [&_svg]:absolute [&_svg]:right-4 [&_svg]:bottom-[20px]">
                    <div className="flex flex-col w-full gap-1">
                      <span className="text-[#484848] text-xs font-normal uppercase tracking-widest leading-none px-4">
                        Step {step.number} of 4
                      </span>
                      <hr className="flex-1 border-t border-[#1F1F1F]" />
                    </div>
                    <div className="flex items-center justify-between w-full pl-4 pr-10">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2.5">
                          <StepIcon iconName={step.icon} active={isOpen} />
                          <div className="flex flex-col text-left">
                            <span className="text-[#0B0D10] text-[22px] font-normal leading-tight">
                              {step.title}
                            </span>
                          </div>
                        </div>
                      </div>
                      {selectedCount > 0 ? (
                        <span className="text-sm font-normal text-[#4E2FD2]">
                          {selectedCount} selected
                        </span>
                      ) : null}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="bg-[#EDF4FF] px-5 pt-4 pb-5 flex flex-col gap-4 border-t border-neutral-100">
                    {/* Product Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            onQuantityChange={(vId, qty) => handleQuantityChange(product.id, vId, qty)}
                            onVariantChange={(vId) => handleVariantChange(product.id, vId)}
                            className={cn(isLastAndOdd ? 'sm:col-span-2 sm:justify-self-center sm:w-[calc(50%-8px)]' : '')}
                          />
                        )
                      })}
                    </div>

                    {/* Next step button */}
                    {stepIdx < 3 ? (
                      <Button
                        variant="outline"
                        onClick={() => setExpandedStepIndex(stepIdx + 1)}
                        className="self-center border-[#4E2FD2] text-lg text-[#4E2FD2] bg-transparent hover:bg-[#4E2FD2]/5 h-10 px-6 rounded-[8px] transition-colors duration-150 cursor-pointer active:scale-[0.97]"
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

        {/* Right Column: Sticky Review Panel (5/12) */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="bg-[#EDF4FF] rounded-[10px] flex flex-col p-6 overflow-hidden">

            {/* Panel Header */}
            <div className="pb-3 mb-3 border-b border-[#CED6DE]">
              <span className="inline-block text-[#484848] text-xs uppercase tracking-widest leading-none mb-4">Review</span>
              <h2 className="text-[22px] text-[#1F1F1F] leading-tight">Your security system</h2>
              <p className="text-sm text-[#1F1F1FBF] mt-2 leading-relaxed">Review your personalized protection system designed to keep what matters most safe.</p>
            </div>

            {/* Scrollable item list */}
            <div className="flex flex-col flex-1">
              {!summary.hasItems ? (
                <div className="py-10 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="bg-white p-4 rounded-2xl text-neutral-300">
                    <ShoppingBag className="size-6 text-[#A8B2BD]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1F1F1F]">Your system is empty</p>
                    <p className="text-xs text-[#1F1F1FBF] mt-1 max-w-[200px] mx-auto leading-relaxed">
                      Select products from the steps on the left to start building.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col max-h-[350px] overflow-y-auto">
                  {summary.cameras.length > 0 ? (
                    <div className="pb-3 border-b border-[#CED6DE]">
                      <p className="text-xs uppercase text-[#A8B2BD] leading-4 pb-1">Cameras</p>
                      <div className="flex flex-col gap-4">
                        {summary.cameras.map(({ product, qty, variantId }) => (
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

                  {summary.sensors.length > 0 ? (
                    <div className="pt-4 pb-3 border-b border-[#CED6DE]">
                      <p className="text-xs uppercase text-[#A8B2BD] leading-4 pb-1">Sensors</p>
                      <div className="flex flex-col gap-4">
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
                    <div className="pt-4 pb-3 border-b border-[#CED6DE]">
                      <p className="text-xs uppercase text-[#A8B2BD] leading-4 pb-1">Accessories</p>
                      <div className="flex flex-col gap-4">
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

                  {summary.plans.length > 0 ? (
                    <div className="pt-4 pb-3 border-b border-[#CED6DE]">
                      <p className="text-xs uppercase text-[#A8B2BD] leading-4 pb-1">Plan</p>
                      <div className="flex flex-col gap-4">
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
                </div>
              )}
            </div>

            {/* Totals + CTA */}
            <div className="flex flex-col gap-4 pt-4">

              {/* Shipping */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="size-10 bg-white rounded-[5px] flex items-center justify-center shrink-0 shadow-sm">
                    <img src={fastShippingIcon} alt="Fast Shipping" className="size-8 object-contain" />
                  </span>
                  <span className="text-sm leading-4 text-[#0B0D10]">Fast Shipping</span>
                </div>
                <div className="flex flex-col justify-center items-end leading-none">
                  <span className="text-sm text-[#575757] line-through leading-4">$5.99</span>
                  <span className="text-sm text-[#4E2FD2] leading-4 font-bold">FREE</span>
                </div>
              </div>

              {/* Seal + price block */}
              <div className="flex items-center justify-between gap-3 pt-6 mt-2">
                <img src={satisfactionBadge} alt="100% Satisfaction Guarantee" className="size-[78px] shrink-0 object-contain" />
                <div className="flex flex-col items-end text-right">
                  {summary.hasItems ? (
                    <span className="bg-[#4E2FD2] text-white px-2 py-0.5 rounded text-sm mb-2">
                      as low as ${summary.financingPrice}/mo
                    </span>
                  ) : null}
                  <div className="flex items-center gap-2">
                    {summary.totalSavings > 0.01 ? (
                      <span className="text-[#6F7882] line-through text-lg leading-5 tabular-nums">
                        ${summary.finalTotalCompare.toFixed(2)}
                      </span>
                    ) : null}
                    <span className="text-[34px] font-bold text-[#4E2FD2] leading-none tabular-nums tracking-tight">
                      ${summary.finalTotalActive.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Savings message */}
              {summary.totalSavings > 0.01 ? (
                <div className="text-center text-xs leading-4 text-[#0AA288] ">
                  Congrats! You're saving ${summary.totalSavings.toFixed(2)} on your security bundle!
                </div>
              ) : null}

              {/* Checkout */}
              <Button
                onClick={handleCheckout}
                disabled={!summary.hasItems}
                className="w-full bg-[#4E2FD2] hover:bg-[#4E2FD2]/80 disabled:opacity-40 text-white h-12 rounded text-lg font-bold leading-4 transition-colors duration-150 cursor-pointer active:scale-[0.98] shadow-sm"
              >
                Checkout
              </Button>

              {/* Save link */}
              <button
                onClick={handleSaveConfiguration}
                className="self-center text-sm text-[#484848] hover:text-[#1F1F1F] italic underline underline-offset-2 transition-colors cursor-pointer mt-1"
              >
                Save my system for later
              </button>
            </div>

          </div>
        </div>

      </div>
    </main>
  )
}

export default App
