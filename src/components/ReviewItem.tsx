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
            <img
              src={productImg}
              alt={product.title}
              style={imageStyle}
              className="max-h-full max-w-full object-contain"
            />
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
