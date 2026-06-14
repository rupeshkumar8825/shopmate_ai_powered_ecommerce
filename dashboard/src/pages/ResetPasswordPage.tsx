// Admin reset-password page — reached via the emailed link `/password/reset/:token`.

import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { useAuth } from "../hooks/use.auth.hook"

export const ResetPasswordPage = () => {
    // ── route param: the reset token from the email link ──
    const { token } = useParams<{ token: string }>()

    // ── custom hook ──
    const { resetPassword, loading, error, clearError } = useAuth()

    // ── inbuilt hooks ──
    const navigate = useNavigate()

    // ── local state ──
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [done, setDone] = useState(false)
    const [mismatch, setMismatch] = useState(false)

    useEffect(() => {
        clearError()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // basic client-side check before hitting the api
        if (newPassword !== confirmPassword) {
            setMismatch(true)
            return
        }
        setMismatch(false)

        const ok = await resetPassword({
            token: token ?? "",
            newPassword,
            confirmPassword,
        })
        if (ok) setDone(true)
    }

    return (
        <div className="min-h-screen bg-background-500 flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-md flex flex-col gap-8">

                {/* ── Heading ── */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="bg-blue-600/15 border border-blue-500/30 rounded-2xl p-3">
                        <Lock className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-white text-3xl font-bold">Reset Password</h1>
                        <p className="text-gray-400 text-sm">Choose a new password for your admin account.</p>
                    </div>
                </div>

                {/* ── Card ── */}
                <div className="bg-component-background-500 border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
                    {done ? (
                        // success state
                        <div className="flex flex-col items-center gap-4 text-center py-2">
                            <CheckCircle2 className="w-12 h-12 text-green-400" />
                            <div className="flex flex-col gap-1">
                                <h2 className="text-white text-lg font-bold">Password updated</h2>
                                <p className="text-gray-400 text-sm">
                                    Your password has been reset. Please sign in with your new password.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors duration-200 mt-2"
                            >
                                Go to Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {/* Error */}
                            {(error || mismatch) && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                                    {mismatch ? "Passwords do not match." : error}
                                </div>
                            )}

                            {/* New password */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">New Password</label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-background-500 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="text-gray-500 hover:text-gray-300 absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm password */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
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
                                        Resetting…
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* ── Back to login ── */}
                {!done && (
                    <Link
                        to="/login"
                        className="self-center flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                    </Link>
                )}
            </div>
        </div>
    )
}
