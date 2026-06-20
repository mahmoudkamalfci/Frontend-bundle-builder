import { useState, useMemo, useEffect } from 'react'
import type { Product, BundleStepType } from '@/types'
import { SEED_CART, SEED_VARIANTS } from '../data/seed'

export function useBundleCart() {
  const [productsData, setProductsData] = useState<{ steps: BundleStepType[] } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products')
        return res.json()
      })
      .then(data => {
        setProductsData(data)
        setIsLoading(false)
      })
      .catch(err => {
        setError(err)
        setIsLoading(false)
      })
  }, [])

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

    if (!productsData) {
      return { cameras, plans, sensors, accessories, finalTotalActive: 0, finalTotalCompare: 0, totalSavings: 0, financingPrice: '0.00', hasItems: false }
    }

    Object.entries(cart).forEach(([cartKey, qty]) => {
      if (qty <= 0) return
      const [productId, variantId] = cartKey.split('::')
      let matchedProduct: Product | undefined
      let matchedStepId = ''
      productsData.steps.forEach((step: BundleStepType) => {
        const found = step.products.find((p) => p.id === productId)
        if (found) { matchedProduct = found; matchedStepId = step.id }
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
  }, [cart, productsData])

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

  return {
    cart,
    selectedVariants,
    showSaveSuccess,
    checkoutSuccess,
    summary,
    productsData,
    isLoading,
    error,
    handleQuantityChange,
    handleVariantChange,
    isCardSelected,
    getStepSelectedCount,
    handleSaveConfiguration,
    handleCheckout,
  }
}
