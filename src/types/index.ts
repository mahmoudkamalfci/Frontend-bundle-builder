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

export interface ProductCardProps {
  product: Product
  activeVariantId: string
  quantity: number         // quantity of active variant
  isSelected: boolean      // true if any variant has quantity > 0
  onQuantityChange: (variantId: string, qty: number) => void
  onVariantChange: (variantId: string) => void
  className?: string
}

export interface QuantityStepperProps {
  quantity: number
  onChange: (qty: number) => void
  disabled?: boolean
  className?: string
}

export interface ReviewItemProps {
  product: Product
  qty: number
  variantId: string
  isHub?: boolean
  isPlan?: boolean
  onQtyChange: (productId: string, variantId: string, qty: number) => void
}
