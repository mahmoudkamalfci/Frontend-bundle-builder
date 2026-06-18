import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import productImg from "@/assets/images/products/product-2.png"

export interface ProductVariant {
  id: string
  name: string
  colorValue: string
  imageFilter: string
}

export interface Product {
  id: string
  title: string
  description: string
  learnMoreUrl: string
  discountBadge?: string
  compareAtPrice?: number
  price: number
  variants?: ProductVariant[]
  unit?: string
}

interface ProductCardProps {
  product: Product
  activeVariantId: string
  quantity: number         // quantity of active variant
  isSelected: boolean      // true if any variant has quantity > 0
  onQuantityChange: (variantId: string, qty: number) => void
  onVariantChange: (variantId: string) => void
  className?: string
}

export function ProductCard({
  product,
  activeVariantId,
  quantity,
  isSelected,
  onQuantityChange,
  onVariantChange,
  className,
}: ProductCardProps) {
  // Find active variant
  const activeVariant = product.variants?.find((v) => v.id === activeVariantId)

  // Custom image style based on variant filter
  const imageStyle: React.CSSProperties = React.useMemo(() => {
    if (activeVariant?.imageFilter && activeVariant.imageFilter !== 'none') {
      return { filter: activeVariant.imageFilter }
    }
    return {}
  }, [activeVariant])

  return (
    <div
      className={cn(
        "relative flex flex-row p-3 gap-4 rounded-[10px] transition-all duration-200 w-full text-left bg-white",
        isSelected
          ? "border-2 border-[#4E2FD2B2] shadow-sm"
          : "border border-neutral-200 hover:border-neutral-300 hover:shadow-sm",
        className
      )}
    >
      {/* Discount Badge */}
      {product.discountBadge ? (
        <div className="absolute left-4 top-2.5 z-10">
          <span className="inline-flex items-center px-[6px] py-[2px] bg-[#4E2FD2] text-xs text-white rounded-[10px] tracking-wide shadow-sm">
            {product.discountBadge}
          </span>
        </div>
      ) : null}

      {/* Image */}
      <div className="flex shrink-0 items-center justify-center w-[100px] bg-white">
        <img
          src={productImg}
          alt={product.title}
          style={imageStyle}
          className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Title */}
        <h3 className="text-[16px] font-normal text-[#1F1F1F] leading-snug tracking-tight">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#1F1F1FBF] leading-relaxed mt-1 line-clamp-2">
          {product.description}
        </p>

        {/* Learn More */}
        <a
          href={product.learnMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2 font-medium inline-block transition-colors"
        >
          Learn More
        </a>

        {/* Color / Variant Selector */}
        {product.variants && product.variants.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {product.variants.map((variant) => {
              const isActive = variant.id === activeVariantId
              return (
                <button
                  key={variant.id}
                  onClick={() => onVariantChange(variant.id)}
                  title={variant.name}
                  className={cn(
                    "flex items-center gap-1 px-1 py-px rounded-[2px] text-[10px] transition-all duration-150 cursor-pointer border select-none",
                    isActive
                      ? "border-[#0AA288] bg-[#1DF0BB0A] text-[#1F1F1F]"
                      : "border-[#E5E7EB] bg-[#FFFFFF] text-[#1F1F1F] hover:border-[#C7C7C8]"
                  )}
                  aria-selected={isActive}
                >
                  <img
                    src={productImg}
                    alt={variant.name}
                    className="w-7 h-7 object-contain"
                    style={{ filter: variant.imageFilter !== 'none' ? variant.imageFilter : undefined }}
                  />
                  {variant.name}
                </button>
              )
            })}
          </div>
        ) : null}

        {/* Bottom: Stepper + Price */}
        <div className="flex items-end justify-between gap-3 mt-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              onClick={() => onQuantityChange(activeVariantId || "default", Math.max(0, quantity - 1))}
              disabled={quantity === 0}
              className="size-5 p-0 flex items-center justify-center bg-white border-2 border-[#E6EBF0] text-neutral-400 hover:text-neutral-600 disabled:opacity-35 rounded-sm transition-all cursor-pointer hover:bg-neutral-50 active:scale-95 shadow-none"
              aria-label="Decrease quantity"
            >
              <Minus className="size-2 stroke-[3px]" />
            </Button>

            <span className="w-5 text-center text-[#0B0D10] text-sm tabular-nums leading-4 select-none">
              {quantity}
            </span>

            <Button
              variant="outline"
              onClick={() => onQuantityChange(activeVariantId || "default", quantity + 1)}
              className="size-5 p-0 flex items-center justify-center bg-white border-2 border-[#E6EBF0] text-neutral-600 hover:text-neutral-800 rounded-sm transition-all cursor-pointer hover:bg-neutral-200 active:scale-95 shadow-none"
              aria-label="Increase quantity"
            >
              <Plus className="size-2 stroke-[3px]" />
            </Button>
          </div>

          {/* Pricing */}
          <div className="flex flex-col items-end leading-none">
            {product.compareAtPrice ? (
              <span className="text-[16px] text-[#D8392B] line-through mb-1.5 tabular-nums decoration-[#D8392B]">
                ${product.compareAtPrice.toFixed(2)}{product.unit ?? ""}
              </span>
            ) : null}
            <span className="text-[16px] text-[#575757] tabular-nums">
              ${product.price.toFixed(2)}{product.unit ?? ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
