// Details step — review account info (read-only) and edit shipping information.
// On submit it hands the collected shipping values up to the page, which assembles the
// order payload (shipping + cart items) and creates the order / payment intent.

import { useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import type { User } from "../../types/auth.types"

export interface ShippingFormValues {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    country: string
    pincode: string
}

interface ShippingDetailsFormProps {
    user: User | null
    isSubmitting: boolean
    onContinue: (values: ShippingFormValues) => void
}

const inputClasses =
    "w-full bg-component-background-500 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors duration-200"

const labelClasses = "text-gray-400 text-xs font-medium uppercase tracking-wider"

export const ShippingDetailsForm = ({ user, isSubmitting, onContinue }: ShippingDetailsFormProps) => {
    const [values, setValues] = useState<ShippingFormValues>({
        fullName: user?.name ?? "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    })
    const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormValues, boolean>>>({})

    const handleChange = (field: keyof ShippingFormValues) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setValues((prev) => ({ ...prev, [field]: e.target.value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // every field is required
        const nextErrors: Partial<Record<keyof ShippingFormValues, boolean>> = {}
        ;(Object.keys(values) as (keyof ShippingFormValues)[]).forEach((field) => {
            if (!values[field].trim()) nextErrors[field] = true
        })

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors)
            return
        }

        onContinue(values)
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

            {/* ── Account info (read-only) ── */}
            <div className="flex flex-col gap-4">
                <h2 className="text-white text-xl font-bold">Account</h2>
                <div className="flex items-center gap-4 bg-component-background-500 border border-white/10 rounded-2xl p-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
                        {(user?.name ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-white text-sm font-semibold truncate">{user?.name ?? "Guest"}</span>
                        <span className="text-gray-500 text-xs truncate">{user?.email ?? ""}</span>
                    </div>
                </div>
            </div>

            {/* ── Shipping information (editable) ── */}
            <div className="flex flex-col gap-4">
                <h2 className="text-white text-xl font-bold">Shipping Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className={labelClasses}>Full Name</label>
                        <input
                            type="text"
                            value={values.fullName}
                            onChange={handleChange("fullName")}
                            placeholder="John Doe"
                            className={`${inputClasses} ${errors.fullName ? "border-red-500/60" : ""}`}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className={labelClasses}>Phone</label>
                        <input
                            type="tel"
                            value={values.phone}
                            onChange={handleChange("phone")}
                            placeholder="+1 555 000 1234"
                            className={`${inputClasses} ${errors.phone ? "border-red-500/60" : ""}`}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className={labelClasses}>Address</label>
                        <input
                            type="text"
                            value={values.address}
                            onChange={handleChange("address")}
                            placeholder="123 Main Street, Apt 4B"
                            className={`${inputClasses} ${errors.address ? "border-red-500/60" : ""}`}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelClasses}>City</label>
                        <input
                            type="text"
                            value={values.city}
                            onChange={handleChange("city")}
                            placeholder="New York"
                            className={`${inputClasses} ${errors.city ? "border-red-500/60" : ""}`}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelClasses}>State</label>
                        <input
                            type="text"
                            value={values.state}
                            onChange={handleChange("state")}
                            placeholder="NY"
                            className={`${inputClasses} ${errors.state ? "border-red-500/60" : ""}`}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelClasses}>Country</label>
                        <input
                            type="text"
                            value={values.country}
                            onChange={handleChange("country")}
                            placeholder="United States"
                            className={`${inputClasses} ${errors.country ? "border-red-500/60" : ""}`}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelClasses}>Pincode</label>
                        <input
                            type="text"
                            value={values.pincode}
                            onChange={handleChange("pincode")}
                            placeholder="10001"
                            className={`${inputClasses} ${errors.pincode ? "border-red-500/60" : ""}`}
                        />
                    </div>
                </div>
            </div>

            {/* ── Continue to payment ── */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Preparing payment…
                    </>
                ) : (
                    <>
                        Continue to Payment
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
        </form>
    )
}
