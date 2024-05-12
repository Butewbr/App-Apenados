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

export function LoginPage() {
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

          <LoginButton>Login</LoginButton>
          <img src={pmLogo} alt="" />
        </FormContainer>
        <PoliceManImage src={policemanImg} alt="Policeman" />
      </div>
    </LoginPageContainer>
  )
}
