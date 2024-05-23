import styled from 'styled-components'

export const DashboardLayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;

  main {
    padding-bottom: 2rem;
  }
`

export const Aside = styled.aside`
  background: ${(props) => props.theme['green-300']};
  min-height: 100vh;

  padding: 3.2rem;

  svg {
    fill: white;
  }

  nav {
    margin-top: 6rem;

    ul {
      display: flex;
      flex-direction: column;
      gap: 2rem;

      li {
        display: flex;
        align-items: center;

        gap: 1rem;

        a {
          color: ${(props) => props.theme.white};

          &:hover {
            font-weight: bold;
          }
        }
      }
    }
  }
`

export const HeaderMenu = styled.header`
  background: ${(props) => props.theme.white};

  height: 10rem;
  width: 100%;

  display: flex;
  align-items: center;
  gap: 6rem;
  justify-content: flex-end;
  padding-right: 6rem;
`

export const AccountStatus = styled.div``

export const User = styled.div`
  span {
    &:last-child {
      background: #e0e0e0;
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 50%;
      padding: 1rem;
      font-weight: bold;
      margin-left: 1rem;
    }
  }
`

export const Logout = styled.button`
  cursor: pointer;
  background: ${(props) => props.theme['green-300']};
  border: none;
  height: 35px;
  padding-inline: 2rem;
  border-radius: 8px;
  color: ${(props) => props.theme.white};

  &:hover {
    filter: brightness(0.8);
  }
`
