import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/Login'
import { DashboardLayout } from './layouts/DashboardLayout'
import { ConvictsRegistrationPage } from './pages/ConvictsRegistration'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="" element={<ConvictsRegistrationPage />} />
      </Route>
    </Routes>
  )
}
