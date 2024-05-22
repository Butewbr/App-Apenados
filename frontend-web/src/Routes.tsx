import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/Login'
import { DashboardLayout } from './layouts/DashboardLayout'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="" element={<h1>Cadastro de individuos</h1>} />
      </Route>
    </Routes>
  )
}
