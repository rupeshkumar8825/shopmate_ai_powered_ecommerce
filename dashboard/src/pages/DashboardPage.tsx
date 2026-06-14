// this is the dashboard page 

import { useEffect } from "react"

export const DashboardPage = () => {

    // this useeffect was only meant for debugging purposes feel free to remove
    // this after the debugging is done for this purpose
    useEffect(() => {
        console.log("DASHBOARD PAGE RENDERED IN DEFAULT USEEFFECT")
    }, [])

    return (
        <div className="px-8 py-10 flex flex-col gap-2">
            <h1 className="text-white text-4xl font-bold">Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome back — here's an overview of your store.</p>
        </div>
    )
}