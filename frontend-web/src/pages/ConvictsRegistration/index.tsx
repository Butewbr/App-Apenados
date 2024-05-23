import {
  FormContainer,
  ConvictsRegistrationContainer,
  Select,
  FieldsetWrapper,
  InformationAcessWrapper,
  Input,
  ButtonSaveInformation,
  Textarea,
  CrimeRegistered,
} from './styles'

export function ConvictsRegistrationPage() {
  return (
    <ConvictsRegistrationContainer>
      <h1>Cadastro de indivíduos</h1>
      <FormContainer>
        <fieldset>
          <FieldsetWrapper>
            <legend>Informações Penais</legend>

            <InformationAcessWrapper>
              <div>
                <label htmlFor="vara">Vara</label>
                <Input type="text" id="vara" />
              </div>
              <div>
                <label htmlFor="numero-autos">Nº Autos</label>
                <Input type="number" id="numero-autos" />
              </div>
              <div>
                <label htmlFor="data-inicio">Data Início</label>
                <Input type="date" id="data-inicio" />
              </div>
              <div>
                <label htmlFor="data-fim">Data Fim</label>
                <Input type="date" id="data-fim" />
              </div>
              <div>
                <label htmlFor="medida-imposta">Medida Imposta</label>
                <Textarea id="medida-imposta" />
              </div>

              <div>
                <label htmlFor="nome">Situação 1</label>

                <Select id="cargo">
                  <option value="1">Situação 1</option>
                  <option value="2">Situação 2</option>
                  <option value="3">Situação 3</option>
                </Select>
              </div>
            </InformationAcessWrapper>
          </FieldsetWrapper>
        </fieldset>

        <fieldset>
          <FieldsetWrapper>
            <legend>Dados Pessoais e contato</legend>

            <InformationAcessWrapper>
              <div>
                <label htmlFor="nome">Nome completo</label>
                <Input type="text" id="nome" />
              </div>

              <div>
                <label htmlFor="cpf">CPF</label>
                <Input type="number" id="cpf" />
              </div>
              <div>
                <label htmlFor="telefone">Telefone</label>
                <Input type="tel" id="telefone" />
              </div>
            </InformationAcessWrapper>
          </FieldsetWrapper>
        </fieldset>

        <fieldset>
          <FieldsetWrapper>
            <legend>Endereço</legend>

            <InformationAcessWrapper>
              <div>
                <label htmlFor="cep">CEP</label>

                <Input type="number" id="cep" />
              </div>
              <div>
                <label htmlFor="estado">Estado</label>

                <Input type="text" id="estado" />
              </div>
              <div>
                <label htmlFor="complemento">Complemento</label>

                <Input type="text" id="complemento" />
              </div>
              <div>
                <label htmlFor="numero">Número</label>

                <Input type="number" id="numero" />
              </div>

              <div>
                <label htmlFor="municipio">Munícipio</label>

                <Input type="text" id="municipio" />
              </div>

              <div>
                <label htmlFor="logradouro">Logradouro</label>

                <Input type="text" id="logradouro" />
              </div>
            </InformationAcessWrapper>
          </FieldsetWrapper>

          {/* VERIFICAR SE POMOS USAR JÁ UM ENDEREÇO DO BANCO DE DADOS */}
          {/* <strong>Usar um endereço já cadastrado</strong> */}
        </fieldset>

        <fieldset>
          <FieldsetWrapper>
            <legend>Crimes</legend>

            <InformationAcessWrapper>
              <div>
                <label htmlFor="crime">Crime</label>

                <Input type="text" id="crime" />
              </div>
              <div>
                <label htmlFor="relevancia">Relevância</label>

                <Select id="relevancia">
                  <option value="1">Situação 1</option>
                  <option value="2">Situação 2</option>
                  <option value="3">Situação 3</option>
                </Select>
              </div>
            </InformationAcessWrapper>

            <strong>Selecionar Crime já cadastrado</strong>
            <CrimeRegistered>
              <label htmlFor="crime-registrado">Crime</label>

              <Select id="crime-registrado">
                <option value="">
                  Selecione um crime já cadastrado no banco de dados
                </option>
                <option value="1">Situação 1</option>
                <option value="2">Situação 2</option>
                <option value="3">Situação 3</option>
              </Select>
            </CrimeRegistered>
          </FieldsetWrapper>

          {/* VERIFICAR SE POMOS USAR JÁ UM ENDEREÇO DO BANCO DE DADOS */}
          {/* <strong>Usar um endereço já cadastrado</strong> */}
        </fieldset>

        <ButtonSaveInformation>SALVAR INFORMAÇÕES</ButtonSaveInformation>
      </FormContainer>
    </ConvictsRegistrationContainer>
  )
}
