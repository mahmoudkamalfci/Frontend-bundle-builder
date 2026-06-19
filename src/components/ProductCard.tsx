import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cva } from "class-variance-authority"
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

const variantSelectorVariants = cva(
  "flex items-center gap-1 rounded-[2px] border px-1 py-px text-[10px] select-none transition-all duration-150 cursor-pointer",
  {
    variants: {
      isActive: {
        true: "border-success bg-success/5 text-foreground",
        false: "border-neutral-200 bg-white text-foreground hover:border-neutral-300",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
)

const quantityButtonVariants = cva(
  "flex size-5 items-center justify-center rounded-sm border-2 border-neutral-200 bg-white p-0 shadow-none transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-35",
  {
    variants: {
      action: {
        decrease: "text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600",
        increase: "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800",
      },
    },
  }
)

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
        "relative flex w-full flex-row gap-4 rounded-[10px] p-3 text-left bg-white transition-all duration-200",
        isSelected
          ? "border-2 border-primary/70 shadow-sm"
          : "border border-neutral-200 hover:border-neutral-300 hover:shadow-sm",
        className
      )}
    >
      {/* Discount Badge */}
      {product.discountBadge ? (
        <div className="absolute left-4 top-2.5 z-10">
          <span className="inline-flex items-center rounded-[10px] bg-primary px-[6px] py-[2px] text-xs tracking-wide text-white shadow-sm">
            {product.discountBadge}
          </span>
        </div>
      ) : null}

      {/* Image */}
      <div className="flex w-[100px] shrink-0 items-center justify-center bg-white">
        <img
          src={productImg}
          alt={product.title}
          style={imageStyle}
          className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Title */}
        <h3 className="text-[16px] font-normal leading-snug tracking-tight text-foreground/90">
          {product.title}
        </h3>

        {/* Description */}
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-foreground/75">
          {product.description}
        </p>

        {/* Learn More */}
        <a
          href={product.learnMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-700"
        >
          Learn More
        </a>

        {/* Color / Variant Selector */}
        {product.variants && product.variants.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((variant) => {
              const isActive = variant.id === activeVariantId
              return (
                <button
                  key={variant.id}
                  onClick={() => onVariantChange(variant.id)}
                  title={variant.name}
                  className={variantSelectorVariants({ isActive })}
                  aria-selected={isActive}
                >
                  <img
                    src={productImg}
                    alt={variant.name}
                    className="size-7 object-contain"
                    style={{ filter: variant.imageFilter !== 'none' ? variant.imageFilter : undefined }}
                  />
                  {variant.name}
                </button>
              )
            })}
          </div>
        ) : null}

        {/* Bottom: Stepper + Price */}
        <div className="mt-4 flex items-end justify-between gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              onClick={() => onQuantityChange(activeVariantId || "default", Math.max(0, quantity - 1))}
              disabled={quantity === 0}
              className={quantityButtonVariants({ action: "decrease" })}
              aria-label="Decrease quantity"
            >
              <Minus className="size-2 stroke-[3px]" />
            </Button>

            <span className="w-5 select-none text-center text-sm leading-4 tabular-nums text-foreground">
              {quantity}
            </span>

            <Button
              variant="outline"
              onClick={() => onQuantityChange(activeVariantId || "default", quantity + 1)}
              className={quantityButtonVariants({ action: "increase" })}
              aria-label="Increase quantity"
            >
              <Plus className="size-2 stroke-[3px]" />
            </Button>
          </div>

          {/* Pricing */}
          <div className="flex flex-col items-end leading-none">
            {product.compareAtPrice ? (
              <span className="mb-1.5 text-[16px] tabular-nums line-through decoration-destructive text-destructive">
                ${product.compareAtPrice.toFixed(2)}{product.unit ?? ""}
              </span>
            ) : null}
            <span className="text-[16px] tabular-nums text-muted-foreground">
              ${product.price.toFixed(2)}{product.unit ?? ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
