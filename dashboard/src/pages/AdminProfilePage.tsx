// this is the profile page for the admin users of the shopmate application
// it is the dashboard equivalent of the client's ProfilePanelLayout, but rendered as a
// full page (not a slide-in panel).
// Features: view account info, update profile (name / email / avatar), change password
// and logout.

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    LogOut,
    Mail,
    Upload,
    User as UserIcon,
} from "lucide-react"
import { useAuth } from "../hooks/use.auth.hook"

const inputClasses =
    "w-full bg-background-500 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors duration-200"
const labelClasses = "text-gray-400 text-xs font-medium uppercase tracking-wider"

export const AdminProfilePage = () => {
    // ── custom hook ──
    const {
        user,
        isAuthenticated,
        loading,
        error,
        updateProfile,
        updatePassword,
        logoutAdmin,
        fetchAdminDetails,
        clearError,
    } = useAuth()

    // ── inbuilt hooks ──
    const navigate = useNavigate()

    // ── profile form state ──
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState("")

    // ── password form state ──
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPasswords, setShowPasswords] = useState(false)

    // ── ui feedback ──
    // tracks which form is currently submitting so only its spinner shows
    const [pendingAction, setPendingAction] = useState<"profile" | "password" | null>(null)
    const [profileSaved, setProfileSaved] = useState(false)
    const [passwordError, setPasswordError] = useState<string | null>(null)

    // hydrate the session on mount if the user isn't loaded yet
    useEffect(() => {
        clearError()
        console.log("INSIDE THE ADMIN PROFILE PAGE FIRST RENDERS HAPPENS HERE")
        if (!user){
            console.log("INSIDE THE ADMIN PROFILE USEFFECT: - it seems that the user is not there");
            console.log("lets try to again fetch the details of the admin user")
            fetchAdminDetails()

        } else {
            console.log("It seems user value is already set and hence user is already logged in");
            console.log("lets not try to fetch the admin details again as admin user is already logged in for this purpose");

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // bounce to login if we know the admin isn't authenticated
    useEffect(() => {
        console.log("ADMIN PROFILE PAGE USEEFFECT : - the value of the auth state atom is : ")
        console.log(loading)
        console.log(isAuthenticated)
        console.log(user)
        if (!loading && !isAuthenticated && !user) navigate("/login")
    }, [loading, isAuthenticated, user, navigate])

    // sync the editable fields whenever the user object changes
    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setAvatarPreview(user.avatar?.url ?? "")
        }
    }, [user])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        setAvatarFile(file)
        if (file) setAvatarPreview(URL.createObjectURL(file))
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setProfileSaved(false)
        setPendingAction("profile")
        const ok = await updateProfile({ name, email, avatar: avatarFile })
        setPendingAction(null)
        if (ok) {
            setProfileSaved(true)
            setAvatarFile(null)
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError(null)

        if (newPassword !== confirmPassword) {
            setPasswordError("New password and confirm password do not match.")
            return
        }

        setPendingAction("password")
        const ok = await updatePassword({ currentPassword, newPassword, confirmPassword })
        setPendingAction(null)
        // updatePassword logs the admin out on success → send them to login
        if (ok) navigate("/login")
    }

    const handleLogout = async () => {
        await logoutAdmin()
        navigate("/login")
    }

    // initial hydration / not yet loaded
    if (!user) {
        return (
            <div className="min-h-screen bg-background-500 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background-500">
            <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">

                {/* ── Header ── */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="self-start flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center justify-between">
                        <h1 className="text-white text-4xl font-bold">My Profile</h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-200"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* ── Identity card ── */}
                <div className="bg-component-background-500 border border-white/10 rounded-2xl p-6 flex items-center gap-5">
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt={user.name}
                            className="w-20 h-20 rounded-full object-cover border border-white/10"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-2xl">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col gap-1 min-w-0">
                        <h2 className="text-white text-xl font-bold truncate">{user.name}</h2>
                        <span className="text-gray-400 text-sm truncate">{user.email}</span>
                        <span className="self-start mt-1 text-xs font-semibold px-3 py-1 rounded-full text-blue-400 bg-blue-600/15">
                            {user.role}
                        </span>
                    </div>
                </div>

                {/* ── Update profile ── */}
                <form
                    onSubmit={handleUpdateProfile}
                    className="bg-component-background-500 border border-white/10 rounded-2xl p-6 flex flex-col gap-5"
                >
                    <h2 className="text-white text-xl font-bold">Profile Information</h2>

                    {profileSaved && (
                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3">
                            <CheckCircle2 className="w-4 h-4" />
                            Profile updated successfully.
                        </div>
                    )}

                    {/* error banner only relevant while editing the profile */}
                    {error && pendingAction === null && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClasses}>Name</label>
                            <div className="relative">
                                <UserIcon className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    className={`${inputClasses} pl-11`}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={labelClasses}>Email</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@shopmate.com"
                                    className={`${inputClasses} pl-11`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Avatar upload */}
                    <div className="flex flex-col gap-1.5">
                        <label className={labelClasses}>Avatar</label>
                        <label className="flex items-center gap-3 bg-background-500 border border-dashed border-white/15 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-500/50 transition-colors duration-200">
                            <Upload className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-400 text-sm truncate">
                                {avatarFile ? avatarFile.name : "Upload a new profile picture"}
                            </span>
                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={pendingAction === "profile"}
                        className="self-start bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        {pendingAction === "profile" ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving…
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </form>

                {/* ── Change password ── */}
                <form
                    onSubmit={handleUpdatePassword}
                    className="bg-component-background-500 border border-white/10 rounded-2xl p-6 flex flex-col gap-5"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-white text-xl font-bold">Change Password</h2>
                        <button
                            type="button"
                            onClick={() => setShowPasswords((prev) => !prev)}
                            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-xs transition-colors duration-200"
                        >
                            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showPasswords ? "Hide" : "Show"}
                        </button>
                    </div>

                    {passwordError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                            {passwordError}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className={labelClasses}>Current Password</label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className={inputClasses}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClasses}>New Password</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className={inputClasses}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClasses}>Confirm New Password</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    <p className="text-gray-600 text-xs">
                        For security, you'll be signed out after changing your password.
                    </p>

                    <button
                        type="submit"
                        disabled={pendingAction === "password"}
                        className="self-start bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        {pendingAction === "password" ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Updating…
                            </>
                        ) : (
                            "Update Password"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
