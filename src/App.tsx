import { useBundleCart } from './hooks/useBundleCart'
import { ToastNotifications } from './components/ToastNotifications'
import { BundleSteps } from './components/BundleSteps'
import { ReviewPanel } from './components/ReviewPanel'
import './App.css'

function App() {
  const {
    cart,
    selectedVariants,
    showSaveSuccess,
    checkoutSuccess,
    summary,
    isLoading,
    error,
    handleQuantityChange,
    handleVariantChange,
    isCardSelected,
    getStepSelectedCount,
    handleSaveConfiguration,
    handleCheckout,
  } = useBundleCart()

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl text-red-500">Failed to load products: {error.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
      </div>
    )
  }

  return (
    <main className="container mx-auto min-h-screen p-4 md:p-6 lg:p-8">

      {/* ── Toast Notifications ──────────────────────────────────────── */}
      <ToastNotifications
        showSaveSuccess={showSaveSuccess}
        checkoutSuccess={checkoutSuccess}
        totalAmount={summary.finalTotalActive}
      />

      {/* ── Main Two-Column Layout ───────────────────────────────────── */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">

        {/* Left Column: Accordion Steps (7/12) */}

        <BundleSteps
          cart={cart}
          selectedVariants={selectedVariants}
          isCardSelected={isCardSelected}
          getStepSelectedCount={getStepSelectedCount}
          onQuantityChange={handleQuantityChange}
          onVariantChange={handleVariantChange}
        />

        {/* Right Column: Review Panel (5/12) */}
        <ReviewPanel
          summary={summary}
          onQtyChange={handleQuantityChange}
          onSave={handleSaveConfiguration}
          onCheckout={handleCheckout}
        />

      </div>
    </main>
  )
}

export default App
