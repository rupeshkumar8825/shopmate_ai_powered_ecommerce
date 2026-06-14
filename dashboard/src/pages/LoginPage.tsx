// Admin login page (a full page, not a modal like the client app).

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react"
import { useAuth } from "../hooks/use.auth.hook"

export const LoginPage = () => {
    // ── custom hook ──
    const { loginAdmin, isAuthenticated, user, loading, error, clearError } = useAuth()

    // ── inbuilt hooks ──
    const navigate = useNavigate()

    // ── local state ──
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // clear any stale auth error when the page mounts
    useEffect(() => {
        console.log("LOGIN PAGE RENDERED IN DEFAULT USEEFFECT")
        clearError()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // already logged in → straight to the dashboard
    useEffect(() => {
        console.log("INSIDE THE LOGIN PAGE USEEFFECT : - the value of isauthenticated and the user is ")
        console.log(isAuthenticated)
        console.log(user)
        if (isAuthenticated) navigate("/")
    }, [isAuthenticated, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const ok = await loginAdmin({ email, password })
        if (ok) navigate("/")
    }

    return (
        <div className="min-h-screen bg-background-500 flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-md flex flex-col gap-8">

                {/* ── Brand ── */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="bg-blue-600/15 border border-blue-500/30 rounded-2xl p-3">
                        <ShieldCheck className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-white text-3xl font-bold">Admin Login</h1>
                        <p className="text-gray-400 text-sm">Sign in to manage your ShopMate store</p>
                    </div>
                </div>

                {/* ── Card ── */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-component-background-500 border border-white/10 rounded-2xl p-8 flex flex-col gap-5"
                >
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

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Password</label>
                            <Link
                                to="/password/forgot"
                                className="text-blue-400 hover:text-blue-300 text-xs transition-colors duration-200"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mt-1"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Signing in…
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <p className="text-gray-600 text-xs text-center">
                    Restricted area — authorized administrators only.
                </p>
            </div>
        </div>
    )
}
