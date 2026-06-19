import { useBundleCart } from './hooks/useBundleCart'
import {
  Shield,
  ShoppingBag,
  Check,
  Sparkles
} from 'lucide-react'
import { ProductCard } from './components/ProductCard'
import { QuantityStepper } from './components/QuantityStepper'
import type { Product, ReviewItemProps } from '@/types'
import { cn } from '@/lib/utils'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion'
import { Button } from './components/ui/button'
import productsData from './data/products.json'
import productImg from './assets/images/products/product-2.png'
import { StepIcon } from './components/StepIcon'
import fastShippingIcon from './assets/images/icons/fast_shipping.png'
import satisfactionBadge from './assets/images/icons/satisfaction_badge.png'
import './App.css'

// ─── Seed Data ────────────────────────────────────────────────────────────────

// Imported from ./data/seed



// ─── Module-Level Sub-Components ──────────────────────────────────────────────


/** Review panel list item */

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
              <span className="font-bold text-foreground">Cam</span> <span className="font-bold text-primary">Unlimited</span>
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

// ─── App ──────────────────────────────────────────────────────────────────────

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

      {/* ── Toast Notifications ──────────────────────────────────────── */}
      {(showSaveSuccess || checkoutSuccess) ? (
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
              <p className="text-sm"><span className="font-bold">Checkout initiated!</span> Total: <span className="font-bold">${summary.finalTotalActive.toFixed(2)}</span></p>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ── Main Two-Column Layout ───────────────────────────────────── */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">

        {/* Left Column: Accordion Steps (7/12) */}

        <div className="flex flex-col gap-6 lg:col-span-8">
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
                      ? 'rounded-[10px] bg-accent'
                      : ''
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
                    {/* Product Cards */}
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
                            onQuantityChange={(vId, qty) => handleQuantityChange(product.id, vId, qty)}
                            onVariantChange={(vId) => handleVariantChange(product.id, vId)}
                            className={cn(isLastAndOdd ? 'sm:col-span-2 sm:w-[calc(50%-8px)] sm:justify-self-center' : '')}
                          />
                        )
                      })}
                    </div>

                    {/* Next step button */}
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

        {/* Right Column: Sticky Review Panel (5/12) */}
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
                    <div className="border-b border-border pb-3 pt-4">
                      <p className="pb-1 text-xs uppercase leading-4 text-muted-foreground">Sensors</p>
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
                    <div className="border-b border-border pb-3 pt-4">
                      <p className="pb-1 text-xs uppercase leading-4 text-muted-foreground">Accessories</p>
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
                    <div className="border-b border-border pb-3 pt-4">
                      <p className="pb-1 text-xs uppercase leading-4 text-muted-foreground">Plan</p>
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
                onClick={handleCheckout}
                disabled={!summary.hasItems}
                className="h-12 w-full cursor-pointer rounded bg-primary text-lg font-bold leading-4 text-white shadow-sm transition-colors duration-150 hover:bg-primary/80 active:scale-[0.98] disabled:opacity-40"
              >
                Checkout
              </Button>

              {/* Save link */}
              <button
                onClick={handleSaveConfiguration}
                className="mt-1 cursor-pointer self-center text-sm italic underline underline-offset-2 transition-colors text-muted-foreground hover:text-foreground"
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
