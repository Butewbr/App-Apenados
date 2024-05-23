import {
  FormContainer,
  ConvictsRegistrationContainer,
  Select,
  FieldsetWrapper,
  InformationAcessWrapper,
  Input,
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
            <legend>Dados Pessoais</legend>

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
                <Input type="number" id="confirmar-senha" />
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
                <label htmlFor="sobrenome">Sobrenome</label>
                <Input type="text" id="sobrenome" />
              </div>
              <div>
                <label htmlFor="cpf">CPF</label>
                <Input type="number" id="confirmar-senha" />
              </div>
            </InformationAcessWrapper>
          </FieldsetWrapper>
        </fieldset>
      </FormContainer>
    </ConvictsRegistrationContainer>
  )
}
