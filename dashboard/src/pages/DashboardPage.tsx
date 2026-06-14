// this is the dashboard page 

import { useEffect } from "react"

export const DashboardPage = () => {

    // this useeffect was only meant for debugging purposes feel free to remove
    // this after the debugging is done for this purpose
    useEffect(() => {
        console.log("DASHBOARD PAGE RENDERED IN DEFAULT USEEFFECT")
    }, [])

    return (
        <div>
            Welcome to the dashboard page 
        </div>
    )
}