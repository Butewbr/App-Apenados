import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/Login'
import { DashboardLayout } from './layouts/DashboardLayout'
import { PMsRegistrationPage } from './pages/PMsRegistration'
import { ConvictsRegistrationPage } from './pages/ConvictsRegistration'
import { ConvictsDatasPage } from './pages/ConvictsDatas/indext'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="cadastro-pm" element={<PMsRegistrationPage />} />
        <Route
          path="cadastro-apenados"
          element={<ConvictsRegistrationPage />}
        />
        <Route path="lista-apenados" element={<ConvictsDatasPage />} />
      </Route>
    </Routes>
  )
}
