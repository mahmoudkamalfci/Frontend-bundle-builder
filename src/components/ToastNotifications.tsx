import { Check, Sparkles } from 'lucide-react'

interface ToastNotificationsProps {
  showSaveSuccess: boolean
  checkoutSuccess: boolean
  totalAmount: number
}

export function ToastNotifications({
  showSaveSuccess,
  checkoutSuccess,
  totalAmount,
}: ToastNotificationsProps) {
  if (!showSaveSuccess && !checkoutSuccess) return null

  return (
    <div className="mx-auto mt-4 w-full max-w-[1200px] px-4 sm:px-6">
      {showSaveSuccess ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-sm">
          <Check className="size-4 shrink-0 stroke-[3px] text-emerald-500" />
          <p className="text-sm">
            <span className="font-bold">Configuration saved!</span> Your setup will be restored on
            your next visit.
          </p>
        </div>
      ) : null}
      {checkoutSuccess ? (
        <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-violet-800 shadow-sm">
          <Sparkles className="size-4 shrink-0 text-brand" />
          <p className="text-sm">
            <span className="font-bold">Checkout initiated!</span> Total:{' '}
            <span className="font-bold">${totalAmount.toFixed(2)}</span>
          </p>
        </div>
      ) : null}
    </div>
  )
}
