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
          <span className="mb-4 inline-block text-xs uppercase leading-none tracking-widest text-muted-foreground">
            Review
          </span>
          <h2 className="text-[22px] font-medium leading-tight text-foreground">
            Your security system
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/75">
            Review your personalized protection system designed to keep what matters most safe.
          </p>
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
                        onQtyChange={onQtyChange}
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
                        onQtyChange={onQtyChange}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {summary.accessories.length > 0 ? (
                <div className="border-b border-border pb-3 pt-4">
                  <p className="pb-1 text-xs uppercase leading-4 text-muted-foreground">
                    Accessories
                  </p>
                  <div className="flex flex-col gap-4">
                    {summary.accessories.map(({ product, qty, variantId }) => (
                      <ReviewItem
                        key={`${product.id}::${variantId}`}
                        product={product}
                        qty={qty}
                        variantId={variantId}
                        onQtyChange={onQtyChange}
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
                        onQtyChange={onQtyChange}
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
            <img
              src={satisfactionBadge}
              alt="100% Satisfaction Guarantee"
              className="size-[78px] shrink-0 object-contain"
            />
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
