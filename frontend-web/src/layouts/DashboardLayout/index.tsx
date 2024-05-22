import { UserPlus } from 'phosphor-react'
import logoPm from '../../assets/pm-white-logo.svg'

import { DashboardLayoutContainer, Aside } from './styles'
import { Outlet } from 'react-router-dom'

export function DashboardLayout() {
  return (
    <DashboardLayoutContainer>
      <Aside>
        <img src={logoPm} alt="" />

        <nav>
          <ul>
            <li>
              <UserPlus size={32} />
              <a href="#">Cadasto de indíviduo</a>
            </li>
            <li>
              <UserPlus size={32} />
              <a href="#">Banco de indíviduos</a>
            </li>
            <li>
              <UserPlus size={32} />
              <a href="#">Cadasto de PM</a>
            </li>
            <li>
              <UserPlus size={32} />
              <a href="#">Banco de PM</a>
            </li>
          </ul>
        </nav>
      </Aside>

      <main>
        <Outlet />
      </main>
    </DashboardLayoutContainer>
  )
}

/*

Terminar o componente ASIDE
*/
