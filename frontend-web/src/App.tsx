import { ThemeProvider } from 'styled-components'
import { DefaultTheme } from './styles/theme/default'
import { GlobalStyle } from './styles/global'

import { BrowserRouter } from 'react-router-dom'
import { Router } from './Routes'
import { ConvictProvider } from './context/ConvictContext'

export function App() {
  return (
    <ConvictProvider>
    <ThemeProvider theme={DefaultTheme}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
    </ConvictProvider>
  )
}
