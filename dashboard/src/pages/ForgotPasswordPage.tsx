// Admin forgot-password page — requests a reset link be emailed.

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react"
import { useAuth } from "../hooks/use.auth.hook"

export const ForgotPasswordPage = () => {
    // ── custom hook ──
    const { forgotPassword, loading, error, clearError } = useAuth()

    // ── local state ──
    const [email, setEmail] = useState("")
    const [sent, setSent] = useState(false)

    useEffect(() => {
        clearError()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // the backend builds the reset link as `${frontEndUrl}/password/reset/<token>`,
        // so we hand it this dashboard's origin
        const ok = await forgotPassword({ email, frontEndUrl: window.location.origin })
        if (ok) setSent(true)
    }

    return (
        <div className="min-h-screen bg-background-500 flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-md flex flex-col gap-8">

                {/* ── Heading ── */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="bg-blue-600/15 border border-blue-500/30 rounded-2xl p-3">
                        <Mail className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-white text-3xl font-bold">Forgot Password</h1>
                        <p className="text-gray-400 text-sm">
                            Enter your account email and we'll send you a reset link.
                        </p>
                    </div>
                </div>

                {/* ── Card ── */}
                <div className="bg-component-background-500 border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
                    {sent ? (
                        // success state
                        <div className="flex flex-col items-center gap-4 text-center py-2">
                            <CheckCircle2 className="w-12 h-12 text-green-400" />
                            <div className="flex flex-col gap-1">
                                <h2 className="text-white text-lg font-bold">Check your inbox</h2>
                                <p className="text-gray-400 text-sm">
                                    If an admin account exists for{" "}
                                    <span className="text-white">{email}</span>, a password reset link is on its way.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {/* Error */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                                    {error}
                                </div>
                            )}

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@shopmate.com"
                                        className="w-full bg-background-500 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* ── Back to login ── */}
                <Link
                    to="/login"
                    className="self-center flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </Link>
            </div>
        </div>
    )
}
