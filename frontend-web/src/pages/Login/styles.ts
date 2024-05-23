import styled from 'styled-components'

export const LoginPageContainer = styled.div`
  min-height: 100vh;
  padding: 10rem 0;

  background: ${(props) => props.theme['green-300']};

  display: flex;
  align-items: center;
  justify-content: center;

  > div {
    max-width: 1120px;
    /* width: 100%; */

    background: ${(props) => props.theme.white};
    border-radius: 0.8rem;

    padding: 6rem;
    display: flex;
    gap: 2.8rem;
    align-items: center;
    justify-content: center;
  }
`

export const FormContainer = styled.form`
  background: white;
  box-shadow: -4px 4px 25px 1px rgba(0, 0, 0, 0.6);
  border-radius: 2rem;
  width: 55.9rem;
  display: flex;
  flex-direction: column;

  padding: 5rem 4rem;

  h2 {
    margin-bottom: 2rem;
    ${(props) => props.theme['gray-400']};
  }

  > div {
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }

  > div + div {
    margin-top: 5rem;
  }

  > img {
    width: 23rem;
    height: 7.9rem;
    margin-top: 3rem;
    align-self: center;
  }
`

export const FormInput = styled.input`
  height: 5rem;
  padding-inline: 1.8rem;
  border-radius: 1.5rem;
  border: 0.3rem solid ${(props) => props.theme['gray-200']};
  color: ${(props) => props.theme['gray-200']};
  font-weight: 500;

  &::placeholder {
    color: ${(props) => props.theme['gray-200']};
    font-weight: 700;
  }
`

export const FormLabel = styled.label`
  color: ${(props) => props.theme['gray-400']};
  font-weight: 700;
  font-size: 2rem;
`

export const RecoveryPassword = styled.a`
  display: block;
  margin-top: 1rem;
  color: ${(props) => props.theme['green-300']};
  align-self: flex-end;
`

export const LoginButton = styled.button`
  background: ${(props) => props.theme['green-300']};
  height: 5rem;
  border: none;
  border-radius: 1.5rem;
  color: ${(props) => props.theme.white};
  font-weight: 700;
  text-transform: uppercase;
  margin-top: 3rem;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }
`

export const PoliceManImage = styled.img`
  width: 40rem;
  height: 40rem;
`
