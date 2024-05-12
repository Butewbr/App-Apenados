import { ThemeProvider } from 'styled-components'
import { DefaultTheme } from './styles/theme/default'
import { GlobalStyle } from './styles/global'
import { LoginPage } from './pages/Login'

export function App() {
  return (
    <ThemeProvider theme={DefaultTheme}>
      <LoginPage />
      <GlobalStyle />
    </ThemeProvider>
  )
}
