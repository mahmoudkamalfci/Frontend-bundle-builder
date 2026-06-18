import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
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
        "relative flex flex-col p-4 rounded-2xl transition-all duration-200 w-full text-left bg-white",
        isSelected
          ? "border-2 border-[#7C3AED] shadow-[0_2px_16px_rgba(124,58,237,0.12)]"
          : "border border-neutral-200 hover:border-neutral-300 hover:shadow-sm",
        className
      )}
    >
      {/* Discount Badge */}
      {product.discountBadge ? (
        <div className="self-start mb-3">
          <span className="inline-flex items-center px-2 py-0.5 bg-[#7C3AED] text-[10px] font-extrabold text-white rounded-md tracking-wider uppercase leading-none shadow-sm">
            {product.discountBadge}
          </span>
        </div>
      ) : (
        <div className="h-5 mb-3" />
      )}

      {/* Image */}
      <div className="flex items-center justify-center h-[110px] w-full mb-4 bg-neutral-50 rounded-xl">
        <img
          src={productImg}
          alt={product.title}
          style={imageStyle}
          className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-1">
        {/* Title */}
        <h3 className="text-[15px] font-bold text-neutral-900 leading-tight tracking-tight">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-[12px] text-neutral-500 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Learn More */}
        <a
          href={product.learnMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-[#7C3AED] hover:text-[#6D28D9] font-semibold mt-0.5 inline-block transition-colors"
        >
          Learn More →
        </a>

        {/* Color / Variant Selector */}
        {product.variants && product.variants.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {product.variants.map((variant) => {
              const isActive = variant.id === activeVariantId
              return (
                <button
                  key={variant.id}
                  onClick={() => onVariantChange(variant.id)}
                  title={variant.name}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all duration-150 cursor-pointer border select-none",
                    isActive
                      ? "border-[#7C3AED] bg-[#7C3AED]/5 text-[#7C3AED]"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                  )}
                >
                  <span
                    style={{ backgroundColor: variant.colorValue }}
                    className={cn(
                      "size-3 rounded-full shrink-0 border",
                      variant.colorValue.toUpperCase() === "#FFFFFF"
                        ? "border-neutral-300"
                        : "border-transparent"
                    )}
                  />
                  {variant.name}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>

      {/* Bottom: Stepper + Price */}
      <div className="flex items-center justify-between gap-3 mt-4 pt-3.5 border-t border-neutral-100">
        {/* Quantity Stepper */}
        <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => onQuantityChange(activeVariantId || "default", Math.max(0, quantity - 1))}
            disabled={quantity === 0}
            className="size-7 flex items-center justify-center bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-800 disabled:opacity-35 rounded-md transition-all cursor-pointer hover:bg-neutral-50 active:scale-95"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3 stroke-[3px]" />
          </button>

          <span className="w-6 text-center font-bold text-neutral-900 text-[13px] tabular-nums select-none">
            {quantity}
          </span>

          <button
            onClick={() => onQuantityChange(activeVariantId || "default", quantity + 1)}
            className="size-7 flex items-center justify-center bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-800 rounded-md transition-all cursor-pointer hover:bg-neutral-50 active:scale-95"
            aria-label="Increase quantity"
          >
            <Plus className="size-3 stroke-[3px]" />
          </button>
        </div>

        {/* Pricing */}
        <div className="flex flex-col items-end leading-none">
          {product.compareAtPrice ? (
            <span className="text-[11px] text-neutral-400 line-through font-medium mb-0.5 tabular-nums">
              ${product.compareAtPrice.toFixed(2)}{product.unit ?? ""}
            </span>
          ) : null}
          <span className="text-[17px] font-extrabold text-neutral-900 tabular-nums">
            ${product.price.toFixed(2)}{product.unit ?? ""}
          </span>
        </div>
      </div>
    </div>
  )
}
