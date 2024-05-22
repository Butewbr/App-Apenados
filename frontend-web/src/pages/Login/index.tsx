import {
  FormContainer,
  LoginButton,
  LoginPageContainer,
  PoliceManImage,
  RecoveryPassword,
  FormInput,
  FormLabel,
} from './styles'

import policemanImg from '../../assets/policeman.svg'
import pmLogo from '../../assets/pm-logo.svg'
import { useNavigate } from 'react-router-dom'

export function LoginPage() {
  const navigate = useNavigate()

  function handleLogin() {
    // fazer a implementação do login, verificar usuário e senha
    navigate('/dashboard')
  }
  return (
    <LoginPageContainer>
      <div>
        <FormContainer action="">
          <h2>Login</h2>
          <div>
            <FormLabel htmlFor="user">User</FormLabel>
            <FormInput
              type="text"
              id="user"
              placeholder="Entre com o seu nome de usuário"
            />
          </div>

          <div>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormInput
              type="text"
              id="password"
              placeholder="Entre com a sua palavra-passe"
            />
          </div>

          <RecoveryPassword href="#">Recuperar senha?</RecoveryPassword>

          <LoginButton onClick={handleLogin}>Login</LoginButton>
          <img src={pmLogo} alt="" />
        </FormContainer>
        <PoliceManImage src={policemanImg} alt="Policeman" />
      </div>
    </LoginPageContainer>
  )
}
