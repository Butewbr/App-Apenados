import styled from 'styled-components'

export const ConvictsRegistrationContainer = styled.div`
  margin: 42px auto 0;
  /* max-width: 1100px; */
  width: 90%;
`

export const FormContainer = styled.form`
  background: #fff;
  margin-top: 2rem;

  padding: 64px;

  border-radius: 8px 8px 0 0;

  display: flex;
  flex-direction: column;
  gap: 48px;

  fieldset {
    border: none;
  }

  fieldset legend {
    color: #7d7d7d;
    font-weight: bold;
    text-transform: uppercase;
  }
`

export const FieldsetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const InformationAcessWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;

  > div {
    display: flex;
    flex-direction: column;
    color: ${(props) => props.theme['gray-300']};
  }
`

export const Input = styled.input`
  height: 35px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme['green-300']};
`

export const Select = styled.select`
  height: 35px;
  border-radius: 8px;
  border-color: ${(props) => props.theme['green-300']};
`

export const ButtonSaveInformation = styled.button`
  background: ${(props) => props.theme['green-300']};
  color: ${(props) => props.theme.white};
  border: none;
  height: 35px;
  border-radius: 8px;

  cursor: pointer;
`
