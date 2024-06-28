import {
  UserPlus,
  ScanSmiley,
  PoliceCar,
  Bell,
  EnvelopeSimple,
} from '@phosphor-icons/react'
import logoPm from '../../assets/pm-white-logo.svg'

import {
  DashboardLayoutContainer,
  Aside,
  HeaderMenu,
  AccountStatus,
  User,
  Logout,
} from './styles'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export function DashboardLayout() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem('usuario') || ''),
  )

  useEffect(() => {
    const handleStorageChange = () => {
      setUsuario(JSON.parse(localStorage.getItem('usuario') || ''));
    }

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    }
  }, [])

  function handleLogout() {
    navigate('/')
  }

  const firstName = usuario?.nome?.split(' ')[0] || '';
  const lastName = usuario?.nome?.split(' ')[1] || '';

  return (
    <DashboardLayoutContainer>
      <Aside>
        <img src={logoPm} alt="" />

        <nav>
          <ul>
            <li>
              <UserPlus color="#FFFFFF" size={32} />
              <Link to="/dashboard/cadastro-apenados">
                Cadasto de indíviduo
              </Link>
            </li>
            <li>
              <ScanSmiley color="#FFFFFF" size={32} />
              <Link to="/dashboard/lista-apenados">Banco de indíviduos</Link>
            </li>
            <li>
              <UserPlus color="#FFFFFF" size={32} />
              <Link to="/dashboard/cadastro-pm">Cadasto de PM</Link>
            </li>
            <li>
              <PoliceCar color="#FFFFFF" size={32} />
              <Link to="/dashboard/lista-pm">Banco de PM</Link>
            </li>
          </ul>
        </nav>
      </Aside>

      <main>
        <HeaderMenu>
          <AccountStatus>
            <Bell color="#666666" size={32} />
            <EnvelopeSimple fill="#666666" size={32} />
          </AccountStatus>

          <User>
            <span>{firstName}</span>

            {<span>{firstName[0] + (lastName ? lastName[0] : firstName[1])}</span>}
          </User>

          <Logout onClick={handleLogout}>Sair</Logout>
        </HeaderMenu>
        <Outlet />
      </main>
    </DashboardLayoutContainer>
  )
}

/*

Terminar o componente ASIDE
*/
