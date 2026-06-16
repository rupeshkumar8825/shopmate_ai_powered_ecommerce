// Users management page (admin).
// Lists every registered customer (the backend `/v1/admin/users` route returns only
// "User" role accounts, paginated 10 at a time) one-per-row, and lets the admin delete
// a user with an inline confirmation step.
//
// Note: the backend paginates but does not hand back a total count in a form the atom
// keeps, so paging is driven locally — "Next" is disabled once a page comes back with
// fewer than a full page of users (i.e. we've reached the end).

import { useEffect, useState } from "react"
import { Check, ChevronLeft, ChevronRight, Loader2, RefreshCw, Trash2, Users, X } from "lucide-react"
import { useUser } from "../hooks/use.user.hook"
import type { User } from "../types/auth.types"

// how many users the backend returns per page (see AdminService.getAllUsersService)
const PAGE_SIZE = 10

// short, human-friendly date e.g. "Jun 14, 2026"
const formatDate = (date: Date | string): string =>
    new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })

// up-to-two-letter initials for the avatar fallback
const initials = (name: string): string =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "?"


export const UsersPage = () => {
    // ── custom hook ──
    const { users, userOperationInProgress, error, fetchAllUsers, deleteUser } = useUser()

    // ── local state ──
    const [page, setPage] = useState(1)
    // the user currently being deleted — scopes the spinner/disabled state to one row
    // (the hook's userOperationInProgress is global)
    const [pendingUserId, setPendingUserId] = useState<string | null>(null)
    // the user whose delete button has been clicked and is awaiting confirmation
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)

    // (re)load the current page whenever it changes (and once on mount)
    useEffect(() => {
        fetchAllUsers({ pages: page })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    // delete a user after the inline confirmation has been accepted
    const handleDelete = async (userId: string) => {
        setPendingUserId(userId)
        await deleteUser({ userId })
        setPendingUserId(null)
        setConfirmingDeleteId(null)
    }

    // first load (no data yet) → full-page spinner
    const isInitialLoading = userOperationInProgress && users.length === 0
    // a short page means there is nothing after it
    const hasNextPage = users.length === PAGE_SIZE

    return (
        <div className="px-8 py-10 flex flex-col gap-6">
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-white text-4xl font-bold">Users</h1>
                    <p className="text-gray-400 text-sm">Browse and manage registered users.</p>
                </div>
                <button
                    type="button"
                    onClick={() => fetchAllUsers({ pages: page })}
                    disabled={userOperationInProgress}
                    className="bg-component-background-500 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 transition-colors duration-200"
                >
                    <RefreshCw className={`w-4 h-4 ${userOperationInProgress ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {/* ── Content ── */}
            {isInitialLoading ? (
                <div className="flex items-center justify-center gap-2 text-gray-400 py-20">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading users…
                </div>
            ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 text-gray-500 py-20">
                    <Users className="w-10 h-10" />
                    <p className="text-sm">
                        {page === 1 ? "No users have registered yet." : "No more users on this page."}
                    </p>
                </div>
            ) : (
                <div className="bg-component-background-500 border border-white/10 rounded-2xl overflow-hidden">
                    {/* table header */}
                    <div className="hidden md:grid grid-cols-[2fr_1.2fr_1fr_auto] gap-4 px-5 py-3 border-b border-white/10 text-gray-400 text-xs font-medium uppercase tracking-wider">
                        <span>User</span>
                        <span>Role</span>
                        <span>Joined</span>
                        <span className="text-right">Actions</span>
                    </div>

                    {/* one user per row */}
                    {users.map((user: User) => (
                        <div
                            key={user.id}
                            className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr_1fr_auto] gap-4 px-5 py-4 border-b border-white/5 last:border-b-0 items-center hover:bg-white/2 transition-colors duration-200"
                        >
                            {/* avatar + name + email */}
                            <div className="flex items-center gap-3 min-w-0">
                                {user.avatar?.url ? (
                                    <img
                                        src={user.avatar.url}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold flex items-center justify-center shrink-0">
                                        {initials(user.name)}
                                    </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                    <span className="text-white text-sm font-medium truncate">{user.name}</span>
                                    <span className="text-gray-500 text-xs truncate">{user.email}</span>
                                </div>
                            </div>

                            {/* role badge */}
                            <div>
                                <span className="text-xs font-medium rounded-full border px-2.5 py-1 bg-blue-500/10 border-blue-500/30 text-blue-400">
                                    {user.role}
                                </span>
                            </div>

                            {/* joined date */}
                            <span className="text-gray-400 text-sm">{formatDate(user.createdAt)}</span>

                            {/* actions: delete with inline confirm */}
                            <div className="flex justify-start md:justify-end">
                                {pendingUserId === user.id ? (
                                    <div className="flex items-center justify-center w-9 h-9 text-gray-400">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                                ) : confirmingDeleteId === user.id ? (
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            title="Confirm delete"
                                            onClick={() => handleDelete(user.id)}
                                            className="flex items-center justify-center w-9 h-9 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl transition-colors duration-200"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            title="Cancel"
                                            onClick={() => setConfirmingDeleteId(null)}
                                            className="flex items-center justify-center w-9 h-9 bg-component-background-500 hover:bg-white/5 border border-white/10 text-gray-400 rounded-xl transition-colors duration-200"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        title="Delete user"
                                        onClick={() => setConfirmingDeleteId(user.id)}
                                        className="flex items-center justify-center w-9 h-9 bg-component-background-500 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 rounded-xl transition-colors duration-200"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Pagination ── */}
            {!isInitialLoading && (page > 1 || hasNextPage) && (
                <div className="flex items-center justify-end gap-3">
                    <span className="text-gray-500 text-sm">Page {page}</span>
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page === 1 || userOperationInProgress}
                        className="bg-component-background-500 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 text-gray-300 text-sm rounded-xl px-3 py-2 flex items-center gap-1 transition-colors duration-200"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                    </button>
                    <button
                        type="button"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={!hasNextPage || userOperationInProgress}
                        className="bg-component-background-500 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 text-gray-300 text-sm rounded-xl px-3 py-2 flex items-center gap-1 transition-colors duration-200"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
