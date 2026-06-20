import { QuantityStepper } from './QuantityStepper'
import { getProductImage } from '@/lib/images'
import type { ReviewItemProps } from '@/types'

export function ReviewItem({
  product,
  qty,
  variantId,
  isPlan = false,
  onQtyChange,
}: ReviewItemProps) {

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Thumbnail + name */}
      <div className="flex min-w-0 flex-1 items-center gap-3">

        <div className="flex size-10 shrink-0 items-center justify-center rounded-[5px] bg-white p-1 shadow-sm">
          <img
            src={getProductImage(product, variantId)}
            alt={product.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="flex min-w-0 flex-col">

          <span className="truncate text-sm font-medium leading-4 text-foreground">{product.title}</span>
        </div>
      </div>

      {/* Stepper */}
      {!isPlan && (
        <QuantityStepper
          quantity={qty}
          onChange={(newQty) => onQtyChange(product.id, variantId, newQty)}
          className="shrink-0"
        />
      )}

      {/* Price */}
      <div className="flex w-[64px] shrink-0 flex-col items-end justify-center leading-none text-right">
        {isPlan ? (
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
