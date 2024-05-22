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
} from './styles'
import { Outlet } from 'react-router-dom'

export function DashboardLayout() {
  return (
    <DashboardLayoutContainer>
      <Aside>
        <img src={logoPm} alt="" />

        <nav>
          <ul>
            <li>
              <UserPlus color="#FFFFFF" size={32} />
              <a href="#">Cadasto de indíviduo</a>
            </li>
            <li>
              <ScanSmiley color="#FFFFFF" size={32} />
              <a href="#">Banco de indíviduos</a>
            </li>
            <li>
              <UserPlus color="#FFFFFF" size={32} />
              <a href="#">Cadasto de PM</a>
            </li>
            <li>
              <PoliceCar color="#FFFFFF" size={32} />
              <a href="#">Banco de PM</a>
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
            <span>Super Usuário</span>

            <span>U</span>
          </User>
        </HeaderMenu>
        <Outlet />
      </main>
    </DashboardLayoutContainer>
  )
}

/*

Terminar o componente ASIDE
*/
