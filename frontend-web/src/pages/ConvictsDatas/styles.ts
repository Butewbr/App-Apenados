import styled from 'styled-components'

export const ConvictsDatasContainer = styled.div`
  margin: 42px auto 0;
  /* max-width: 1100px; */
  width: 90%;
`

export const FormContainer = styled.form`
  header {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;

    input {
      flex: 1;
    }
  }

  table {
    margin-top: 1rem;
    width: 100%;
    border-collapse: collapse;
    background-color: #ffffff;
  }
  th,
  td {
    border: 1px solid #000;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
`

export const Pagination = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
`
