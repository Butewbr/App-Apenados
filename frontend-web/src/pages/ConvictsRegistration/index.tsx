import {
  FormContainer,
  ConvictsRegistrationContainer,
  Select,
  FieldsetWrapper,
  InformationAcessWrapper,
  Input,
  ButtonSaveInformation,
} from './styles'

export function ConvictsRegistrationPage() {
  return (
    <ConvictsRegistrationContainer>
      <h1>Cadastro de PMs</h1>
      <FormContainer>
        <fieldset>
          <FieldsetWrapper>
            <legend>Informações de acesso</legend>

            <InformationAcessWrapper>
              <div>
                <label htmlFor="matricula">Matrícula</label>
                <Input type="text" id="matricula" />
              </div>
              <div>
                <label htmlFor="senha">Senha</label>
                <Input type="password" id="senha" />
              </div>
              <div>
                <label htmlFor="confirmar-senha">Confirmar senha</label>
                <Input type="password" id="confirmar-senha" />
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
                <Input type="text" id="nome" />
              </div>
              <div>
                <label htmlFor="sobrenome">Sobrenome</label>
                <Input type="text" id="sobrenome" />
              </div>
              <div>
                <label htmlFor="cpf">CPF</label>
                <Input type="number" id="cpf" />
              </div>
              <div>
                <label htmlFor="telefone">Telefone</label>
                <Input type="tel" id="telefone" />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <Input type="email" id="email" />
              </div>
            </InformationAcessWrapper>
          </FieldsetWrapper>
        </fieldset>

        <fieldset>
          <FieldsetWrapper>
            <legend>Dados Profissionais</legend>

            <InformationAcessWrapper>
              <div>
                <label htmlFor="nome">Cargo</label>

                <Select id="cargo">
                  <option value="1">Cargo 1</option>
                  <option value="2">Cargo 2</option>
                  <option value="3">Cargo 3</option>
                </Select>
              </div>
              <div>
                <label htmlFor="unidade-policial">Unidade Policial</label>

                <Select id="unidade-policial">
                  <option value="1">Unidade 1</option>
                  <option value="2">Unidade 2</option>
                  <option value="3">Unidade 3</option>
                </Select>
              </div>
              <div>
                <label htmlFor="situacao">Situação</label>

                <Select id="situacao">
                  <option value="1">situacao 1</option>
                  <option value="2">situacao 2</option>
                  <option value="3">situacao 3</option>
                </Select>
              </div>
            </InformationAcessWrapper>
          </FieldsetWrapper>
        </fieldset>

        <ButtonSaveInformation>SALVAR INFORMAÇÕES</ButtonSaveInformation>
      </FormContainer>
    </ConvictsRegistrationContainer>
  )
}
