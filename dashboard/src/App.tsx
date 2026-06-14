import { Route, Routes } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage"
import { ResetPasswordPage } from "./pages/ResetPasswordPage"
import { DashboardPage } from "./pages/DashboardPage"

function App() {

  return (
    <div>
      {/* add the routes here for the application  */}
      <Routes>
        <Route path="/login" element={<LoginPage></LoginPage>}></Route>
        <Route path="/password/forgot" element={<ForgotPasswordPage></ForgotPasswordPage>}></Route>
        <Route path="/password/reset/:token" element={<ResetPasswordPage></ResetPasswordPage>}></Route>
        <Route path="/" element={<DashboardPage></DashboardPage>}></Route>
      </Routes>
    </div>
  )
}

export default App
