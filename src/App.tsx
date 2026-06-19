import { useBundleCart } from './hooks/useBundleCart'
import { ToastNotifications } from './components/ToastNotifications'
import { BundleSteps } from './components/BundleSteps'
import { ReviewPanel } from './components/ReviewPanel'
import './App.css'

// ─── Seed Data ────────────────────────────────────────────────────────────────

// Imported from ./data/seed



// ─── Module-Level Sub-Components ──────────────────────────────────────────────

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const {
    cart,
    selectedVariants,
    expandedStepIndex,
    setExpandedStepIndex,
    showSaveSuccess,
    checkoutSuccess,
    summary,
    handleQuantityChange,
    handleVariantChange,
    isCardSelected,
    getStepSelectedCount,
    handleSaveConfiguration,
    handleCheckout,
  } = useBundleCart()

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
          expandedStepIndex={expandedStepIndex}
          setExpandedStepIndex={setExpandedStepIndex}
          cart={cart}
          selectedVariants={selectedVariants}
          isCardSelected={isCardSelected}
          getStepSelectedCount={getStepSelectedCount}
          onQuantityChange={handleQuantityChange}
          onVariantChange={handleVariantChange}
        />

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
