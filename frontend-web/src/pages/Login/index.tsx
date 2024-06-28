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
import { useState } from 'react'
import api from '../api'

export function LoginPage() {
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')

  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      localStorage.setItem('usuario', '')
      const formData = new FormData()
      formData.append('matricula', userName)
      formData.append('password', password)
      const response = await api.post('/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario))
      navigate('/dashboard')
    } catch (error) {
      alert('Usuário ou senha errado, verifique e tente novamente')
    }
  };
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
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Entre com o seu nome de usuário"
            />
          </div>

          <div>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormInput
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entre com a sua palavra-passe"
            />
          </div>

          <RecoveryPassword href="#">Recuperar senha?</RecoveryPassword>

          <LoginButton type="button" onClick={handleLogin}>Login</LoginButton>
          <img src={pmLogo} alt="" />
        </FormContainer>
        <PoliceManImage src={policemanImg} alt="Policeman" />
      </div>
    </LoginPageContainer>
  )
}
