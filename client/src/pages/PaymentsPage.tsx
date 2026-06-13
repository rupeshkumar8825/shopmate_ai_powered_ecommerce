// Checkout / Payments page.
// Two-step flow — (1) Details (account + shipping) and (2) Payment (Stripe).
// Left column holds the step content, right column holds the order summary.

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Check } from "lucide-react"
import { Elements } from "@stripe/react-stripe-js"
import type { StripeElementsOptions } from "@stripe/stripe-js"

import { useCart } from "../hooks/useCart"
import { useAuth } from "../hooks/useAuth"
import { useOrder } from "../hooks/useOrder"
import { stripePromise } from "../utils/stripe"
import { OrderSummaryComponent, computePricing } from "../components/Payment/OrderSummaryComponent"
import { ShippingDetailsForm } from "../components/Payment/ShippingDetailsForm"
import type { ShippingFormValues } from "../components/Payment/ShippingDetailsForm"
import { PaymentForm } from "../components/Payment/PaymentForm"
import type { PlaceNewOrderRequestPayload } from "../types/order.types"

const STEPS = [
    { id: 1, label: "Details" },
    { id: 2, label: "Payment" },
] as const

export const PaymentsPage = () => {
    // ── custom hooks ──
    const { cartItems, clearCart } = useCart()
    const { user } = useAuth()
    const {
        orderStep,
        setOrderStep,
        placeNewOrder,
        placingOrder,
        paymentIntent,
        setFinalPrice,
    } = useOrder()

    // ── inbuilt hooks ──
    const navigate = useNavigate()

    // always start the checkout from the details step
    useEffect(() => {
        setOrderStep(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { total } = computePricing(cartItems)

    // ── Details step → create order + payment intent, then advance ──────────────
    const handleContinueToPayment = async (shipping: ShippingFormValues) => {
        const payload: PlaceNewOrderRequestPayload = {
            fullName: shipping.fullName,
            phone: shipping.phone,
            address: shipping.address,
            city: shipping.city,
            state: shipping.state,
            country: shipping.country,
            pincode: shipping.pincode,
            orderItems: cartItems.map((item) => ({
                productId: item.id,
                quantity: String(item.quantity),
            })),
        }

        setFinalPrice(total)
        const response = await placeNewOrder(payload)

        if (response?.paymentDetails?.clientSecret) {
            setOrderStep(2)
        }
    }

    // ── Payment success → clear cart and head to orders ─────────────────────────
    const handlePaymentSuccess = () => {
        clearCart()
        navigate("/orders")
    }

    // ── Empty cart guard (only relevant on the details step) ────────────────────
    if (cartItems.length === 0 && orderStep === 1) {
        return (
            <div className="min-h-screen bg-background-500 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 text-center px-6">
                    <h2 className="text-white text-2xl font-bold">Your cart is empty</h2>
                    <p className="text-gray-400 text-sm max-w-xs">
                        Add some products to your cart before heading to checkout.
                    </p>
                    <button
                        onClick={() => navigate("/products")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        )
    }

    const clientSecret = paymentIntent?.clientSecret ?? undefined

    const elementsOptions: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: "night",
            variables: {
                colorPrimary: "#2563eb",
                colorBackground: "#011236",
                borderRadius: "12px",
            },
        },
    }

    return (
        <div className="min-h-screen bg-background-500">
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">

                {/* ── Header with back to cart ── */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate("/cart")}
                        className="self-start flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Cart
                    </button>
                    <h1 className="text-white text-4xl font-bold">Checkout</h1>
                </div>

                {/* ── Progress bar (2 steps) ── */}
                <div className="flex items-center gap-4 max-w-md">
                    {STEPS.map((step, index) => {
                        const isComplete = orderStep > step.id
                        const isActive = orderStep === step.id
                        return (
                            <div key={step.id} className="flex items-center gap-4 flex-1 last:flex-none">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border transition-colors duration-200 ${
                                            isComplete
                                                ? "bg-green-500/20 border-green-500/40 text-green-400"
                                                : isActive
                                                ? "bg-blue-600 border-blue-600 text-white"
                                                : "bg-component-background-500 border-white/10 text-gray-500"
                                        }`}
                                    >
                                        {isComplete ? <Check className="w-4 h-4" /> : step.id}
                                    </div>
                                    <span
                                        className={`text-sm font-semibold ${
                                            isActive || isComplete ? "text-white" : "text-gray-500"
                                        }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
                                        <div
                                            className={`absolute inset-0 bg-blue-500 transition-transform duration-300 origin-left ${
                                                orderStep > step.id ? "scale-x-100" : "scale-x-0"
                                            }`}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* ── Main layout: left = step content, right = order summary ── */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* LEFT */}
                    <div className="flex-1 min-w-0 w-full">
                        {orderStep === 1 ? (
                            <ShippingDetailsForm
                                user={user}
                                isSubmitting={placingOrder}
                                onContinue={handleContinueToPayment}
                            />
                        ) : clientSecret ? (
                            <Elements stripe={stripePromise} options={elementsOptions}>
                                <PaymentForm amount={total} onSuccess={handlePaymentSuccess} />
                            </Elements>
                        ) : (
                            <div className="text-gray-400 text-sm">
                                Unable to start payment. Please go back and try again.
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <OrderSummaryComponent cartItems={cartItems} />
                </div>
            </div>
        </div>
    )
}
