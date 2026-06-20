import type { Product } from "@/types"

export function getProductImage(product: Product, variantId?: string): string {
  console.log(product.id, variantId);
  let imageName = product.image;
  
  if (variantId && product.variants) {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant?.image) {
      imageName = variant.image;
    }
  }
  
  if (!imageName) return '';
  
  return new URL(`../assets/images/products/${imageName}`, import.meta.url).href;
}
