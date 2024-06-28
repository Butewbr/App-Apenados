import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/Login'
import { DashboardLayout } from './layouts/DashboardLayout'
import { PMsRegistrationPage } from './pages/PMsRegistration'
import { ConvictsRegistrationPage } from './pages/ConvictsRegistration'
import { ConvictsDatasPage } from './pages/ConvictsDatas/indext'
import { ConvictPage } from './pages/Convict/indext'
import api from './pages/api'

export function Router() {
  let isLoggedIn = localStorage.getItem('usuario') !== null
  if (isLoggedIn)
    api
      .get('/api/syncdata')
      .then(async (response) => {
        console.log(response.data)
      })
      .catch((error) => {
        localStorage.removeItem('usuario')
        isLoggedIn = false
        console.log(error)
      })
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={isLoggedIn ? <DashboardLayout /> : <Navigate to="/" replace />}
      >
        <Route
          path="cadastro-pm"
          element={
            isLoggedIn ? <PMsRegistrationPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="cadastro-apenados"
          element={
            isLoggedIn ? (
              <ConvictsRegistrationPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="editar-apenado/:id"
          element={
            isLoggedIn ? (
              <ConvictsRegistrationPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="lista-apenados"
          element={
            isLoggedIn ? <ConvictsDatasPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="lista-apenados/:id"
          element={isLoggedIn ? <ConvictPage /> : <Navigate to="/" replace />}
        />
      </Route>
    </Routes>
  );
}
