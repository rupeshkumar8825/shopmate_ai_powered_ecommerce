import { Route, Routes } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { DashboardPage } from "./pages/DashboardPage"

function App() {

  return (
    <div>
      {/* add the routes here for the application  */}
      <Routes>
        <Route path="/login" element={<LoginPage></LoginPage>}></Route>
        <Route path="/" element={<DashboardPage></DashboardPage>}></Route>
      </Routes>
    </div>    
  )
}

export default App
