// DashboardLayout — the shell for all authenticated admin pages.
// Sidebar stays fixed on the left; the selected page renders on the right via <Outlet/>.

import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"

export const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-background-500 flex">
            <Sidebar />
            <main className="flex-1 min-w-0">
                <Outlet />
            </main>
        </div>
    )
}
