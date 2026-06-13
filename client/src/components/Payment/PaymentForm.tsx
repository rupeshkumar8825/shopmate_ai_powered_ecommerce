// PaymentForm — Stripe payment step.
// Rendered inside a <Elements> provider (initialised with the PaymentIntent clientSecret
// in PaymentsPage). Collects card / payment details via Stripe's PaymentElement and
// confirms the payment.

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Loader2, Lock } from "lucide-react"

interface PaymentFormProps {
    // total to display on the pay button
    amount: number
    // called once the payment intent is confirmed successfully
    onSuccess: () => void
}

export const PaymentForm = ({ amount, onSuccess }: PaymentFormProps) => {
    const stripe = useStripe()
    const elements = useElements()

    const [processing, setProcessing] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Stripe.js has not loaded yet — disable submission until it does.
        if (!stripe || !elements) return

        setProcessing(true)
        setErrorMessage(null)

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // fallback redirect target for payment methods that require it
                return_url: `${window.location.origin}/orders`,
            },
            // keep card payments inline instead of forcing a redirect
            redirect: "if_required",
        })

        if (error) {
            setErrorMessage(error.message ?? "Something went wrong with your payment.")
            setProcessing(false)
            return
        }

        if (paymentIntent && paymentIntent.status === "succeeded") {
            setProcessing(false)
            onSuccess()
            return
        }

        // any other status (processing / requires_action handled by redirect, etc.)
        setProcessing(false)
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <div className="flex flex-col gap-1">
                <h2 className="text-white text-xl font-bold">Payment</h2>
                <p className="text-gray-400 text-sm">
                    Enter your payment details to complete the order.
                </p>
            </div>

            {/* Stripe payment element */}
            <div className="bg-component-background-500 border border-white/10 rounded-2xl p-6">
                <PaymentElement />
            </div>

            {/* Error message */}
            {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                    {errorMessage}
                </div>
            )}

            {/* Pay button */}
            <button
                type="submit"
                disabled={!stripe || !elements || processing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
                {processing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing…
                    </>
                ) : (
                    <>
                        <Lock className="w-5 h-5" />
                        Pay ${amount.toFixed(2)}
                    </>
                )}
            </button>

            {/* Secure note */}
            <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
                <Lock className="w-3.5 h-3.5" />
                Payments are securely processed by Stripe
            </div>
        </form>
    )
}
