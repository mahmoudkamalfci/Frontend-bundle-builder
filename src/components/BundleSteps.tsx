import { useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion'
import { Button } from './ui/button'
import { ProductCard } from './ProductCard'
import { StepIcon } from './StepIcon'
import { cn } from '@/lib/utils'
import productsData from '../data/products.json'
import type { Product, BundleStepsProps } from '@/types'

export function BundleSteps({
  cart,
  selectedVariants,
  isCardSelected,
  getStepSelectedCount,
  onQuantityChange,
  onVariantChange,
}: BundleStepsProps) {
  const [expandedStepIndex, setExpandedStepIndex] = useState<number>(0)
  return (
    <div className="flex flex-col gap-6 lg:col-span-8">
      <Accordion
        type="single"
        collapsible
        value={expandedStepIndex >= 0 ? `step-${expandedStepIndex}` : ''}
        onValueChange={(val) => {
          setExpandedStepIndex(val ? parseInt(val.replace('step-', ''), 10) : -1)
        }}
      >
        {productsData.steps.map((step, stepIdx) => {
          const isOpen = expandedStepIndex === stepIdx
          const selectedCount = getStepSelectedCount(step.products as unknown as Product[])

          return (
            <AccordionItem
              key={step.id}
              value={`step-${stepIdx}`}
              className={cn(
                'bg-white not-last:border-b-0',
                isOpen ? 'rounded-[10px] bg-accent' : ''
              )}
            >
              <AccordionTrigger className="flex w-full flex-col gap-3 [&_svg]:absolute [&_svg]:bottom-[20px] [&_svg]:right-4">
                <div className="flex w-full flex-col gap-1">
                  <span className="px-4 text-xs font-normal uppercase leading-none tracking-widest text-muted-foreground">
                    Step {step.number} of 4
                  </span>
                  <hr className="flex-1 border-t border-foreground" />
                </div>
                <div className="flex w-full items-center justify-between pl-4 pr-10">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5">
                      <StepIcon iconName={step.icon} active={isOpen} />
                      <div className="flex flex-col text-left">
                        <span className="text-lg font-medium leading-tight text-foreground sm:text-[22px]">
                          {step.title}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedCount > 0 ? (
                    <span className="text-sm font-normal text-primary">
                      {selectedCount} selected
                    </span>
                  ) : null}
                </div>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-4 border-t border-neutral-100 bg-accent px-5 pb-5 pt-4">
                {/* Product Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2">
                  {(step.products as unknown as Product[]).map((product) => {
                    const activeVarId =
                      selectedVariants[product.id] || product.variants?.[0]?.id || 'default'
                    const variantQty = cart[`${product.id}::${activeVarId}`] || 0
                    const isSelected = isCardSelected(product)
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        activeVariantId={activeVarId}
                        quantity={variantQty}
                        isSelected={isSelected}
                        onQuantityChange={(vId, qty) => onQuantityChange(product.id, vId, qty)}
                        onVariantChange={(vId) => onVariantChange(product.id, vId)}
                        maxQuantity={step.id === 'plans' ? 1 : undefined}
                      />
                    )
                  })}
                </div>

                {/* Next step button */}
                {stepIdx < 3 ? (
                  <Button
                    variant="outline"
                    onClick={() => setExpandedStepIndex(stepIdx + 1)}
                    className="h-10 cursor-pointer self-center rounded-[8px] border border-primary bg-transparent px-6 text-lg text-primary transition-colors duration-150 hover:bg-primary/5 active:scale-[0.97]"
                  >
                    Next: {productsData.steps[stepIdx + 1].title}
                  </Button>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
