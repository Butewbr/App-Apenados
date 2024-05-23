import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }


  :focus {
    outline: 0;
   // box-shadow: 0 0 0 2px ${(props) => props.theme['green-500']};
  }

  html {
    font-size: 62.5%;
  }

  body {
    background: ${(props) => props.theme['gray-50']};
    /* color: ${(props) => props.theme['gray-300']}; */
    -webkit-font-smoothing: antialiased;
   
  }

  body, button, input, textarea {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 1.6rem;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ul {
    list-style: none;
  }
  a {
    text-decoration: none;
  }


`
