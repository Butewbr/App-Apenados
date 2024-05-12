import 'styled-components'
import { DefaultTheme } from '../styles/theme/default'

type ThemeType = typeof DefaultTheme

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
