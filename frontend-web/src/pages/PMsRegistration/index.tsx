import { useState } from 'react'
import {
  FormContainer,
  ConvictsRegistrationContainer,
  Select,
  FieldsetWrapper,
  InformationAcessWrapper,
  Input,
  ButtonSaveInformation,
} from './styles'
import api from '../api'

export function PMsRegistrationPage() {
  const [usuario, setUsuario] = useState({
    matricula: '',
    senha: '',
    confirmarSenha: '',
    nome: '',
    cpf: '',
    telefone: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target
    setUsuario((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post('/register', usuario)
      console.log('Data sent successfully:', response.data)
      alert('Cadastrado com sucesso!')
      setUsuario({
        matricula: '',
        senha: '',
        confirmarSenha: '',
        nome: '',
        cpf: '',
        telefone: '',
      })
    } catch (error) {
      console.error('Error sending data:', error)
    }
  }
  return (
    <ConvictsRegistrationContainer>
      <h1>Cadastro de PMs</h1>
      <FormContainer autoComplete="off" onSubmit={handleSubmit}>
        <fieldset>
          <FieldsetWrapper>
            <legend>Informações de acesso</legend>

            <InformationAcessWrapper>
              <div>
                <label htmlFor="matricula">Matrícula</label>
                <Input
                  autoComplete="new-password"
                  type="text"
                  id="matricula"
                  value={usuario.matricula}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="senha">Senha</label>
                <Input
                  autoComplete="new-password"
                  type="password"
                  id="senha"
                  value={usuario.senha}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="confirmarSenha">Confirmar senha</label>
                <Input
                  type="password"
                  id="confirmarSenha"
                  value={usuario.confirmarSenha}
                  onChange={handleChange}
                />
              </div>
            </InformationAcessWrapper>
          </FieldsetWrapper>
        </fieldset>

        <fieldset>
          <FieldsetWrapper>
            <legend>Dados Pessoais e contato</legend>

            <InformationAcessWrapper>
              <div>
                <label htmlFor="nome">Nome</label>
                <Input
                  type="text"
                  id="nome"
                  value={usuario.nome}
                  onChange={handleChange}
                />
              </div>
              {/* <div>
                <label htmlFor="sobrenome">Sobrenome</label>
                <Input type="text" id="sobrenome" value={usuario.sobrenome} onChange={handleChange} />
              </div> */}
              <div>
                <label htmlFor="cpf">CPF</label>
                <Input
                  type="number"
                  id="cpf"
                  value={usuario.cpf}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="telefone">Telefone</label>
                <Input
                  type="tel"
                  id="telefone"
                  value={usuario.telefone}
                  onChange={handleChange}
                />
              </div>
              {/* <div>
                <label htmlFor="email">Email</label>
                <Input type="email" id="email" value={usuario.email} onChange={handleChange} />
              </div> */}
            </InformationAcessWrapper>
          </FieldsetWrapper>
        </fieldset>

        <fieldset>
          <FieldsetWrapper style={{ display: 'none' }}>
            <legend>Dados Profissionais</legend>

            <InformationAcessWrapper>
              <div>
                <label htmlFor="nome">Cargo</label>

                <Select
                  id="cargo"
                  value={usuario.cargo}
                  onChange={handleChange}
                >
                  <option value="1">Cargo 1</option>
                  <option value="2">Cargo 2</option>
                  <option value="3">Cargo 3</option>
                </Select>
              </div>
              <div>
                <label htmlFor="unidade-policial">Unidade Policial</label>

                <Select
                  id="unidade-policial"
                  value={usuario.unidadePolicial}
                  onChange={handleChange}
                >
                  <option value="1">Unidade 1</option>
                  <option value="2">Unidade 2</option>
                  <option value="3">Unidade 3</option>
                </Select>
              </div>
              <div>
                <label htmlFor="situacao">Situação</label>

                <Select
                  id="situacao"
                  value={usuario.situacao}
                  onChange={handleChange}
                >
                  <option value="1">situacao 1</option>
                  <option value="2">situacao 2</option>
                  <option value="3">situacao 3</option>
                </Select>
              </div>
            </InformationAcessWrapper>
          </FieldsetWrapper>
        </fieldset>

        <ButtonSaveInformation type="submit">
          SALVAR INFORMAÇÕES
        </ButtonSaveInformation>
      </FormContainer>
    </ConvictsRegistrationContainer>
  )
}
