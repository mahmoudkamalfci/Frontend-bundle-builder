export interface ProductVariant {
  id: string
  name: string
  colorValue: string
  imageFilter: string
  image?: string
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
  image?: string
}

export interface ProductCardProps {
  product: Product
  activeVariantId: string
  quantity: number         // quantity of active variant
  isSelected: boolean      // true if any variant has quantity > 0
  onQuantityChange: (variantId: string, qty: number) => void
  onVariantChange: (variantId: string) => void
  maxQuantity?: number
  className?: string
}

export interface QuantityStepperProps {
  quantity: number
  onChange: (qty: number) => void
  max?: number
  disabled?: boolean
  className?: string
}

export interface ReviewItemProps {
  product: Product
  qty: number
  variantId: string
  isPlan?: boolean
  onQtyChange: (productId: string, variantId: string, qty: number) => void
}

export interface StepIconProps {
  iconName: string
  active: boolean
}

export interface ToastNotificationsProps {
  showSaveSuccess: boolean
  checkoutSuccess: boolean
  totalAmount: number
}

export interface BundleStepsProps {
  cart: Record<string, number>
  selectedVariants: Record<string, string>
  isCardSelected: (product: Product) => boolean
  getStepSelectedCount: (products: Product[]) => number
  onQuantityChange: (productId: string, variantId: string, qty: number) => void
  onVariantChange: (productId: string, variantId: string) => void
}

export interface SummaryItem {
  product: Product
  qty: number
  variantId: string
  variantName?: string
}

export interface ReviewPanelProps {
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

