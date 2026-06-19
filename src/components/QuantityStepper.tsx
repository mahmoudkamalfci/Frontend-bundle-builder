import { Minus, Plus } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { QuantityStepperProps } from "@/types"

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

export function QuantityStepper({
  quantity,
  onChange,
  max,
  disabled = false,
  className,
}: QuantityStepperProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Button
        variant="outline"
        onClick={() => onChange(Math.max(0, quantity - 1))}
        disabled={disabled || quantity === 0}
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
        onClick={() => onChange(quantity + 1)}
        disabled={disabled || (max !== undefined && quantity >= max)}
        className={quantityButtonVariants({ action: "increase" })}
        aria-label="Increase quantity"
      >
        <Plus className="size-2 stroke-[3px]" />
      </Button>
    </div>
  )
}
