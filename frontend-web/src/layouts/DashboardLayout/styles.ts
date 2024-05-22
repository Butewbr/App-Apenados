import styled from 'styled-components'

export const DashboardLayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
`

export const Aside = styled.aside`
  background: ${(props) => props.theme['green-300']};
  height: 100vh;
`
