import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConvictContext } from '../../context/ConvictContext'
import { ConvictsDatasContainer, FormContainer, Pagination } from './styles'

export function ConvictsDatasPage() {


  const [busca, setBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(5)


  const navigate = useNavigate()

  const { apenados } = useContext(ConvictContext)

  
  const handleBuscaChange = (event: any) => {
    setBusca(event.target.value)
  }

  const handleItensPorPaginaChange = (event: any) => {
    setItensPorPagina(Number(event.target.value))
    setPaginaAtual(1) // Reset to first page whenever items per page changes
  }
  const apenadosFiltrados = apenados.filter(
    (apenado) =>
      apenado.nome.toLowerCase().includes(busca.toLowerCase()) ||
      apenado.endereco.logradouro.toLowerCase().includes(busca.toLowerCase()) ||
      apenado.relevancia.toLowerCase().includes(busca.toLowerCase()) ||
      apenado.dataInicio.includes(busca) ||
      apenado.dataFim.includes(busca) ||
      apenado.situacao.toLowerCase().includes(busca.toLowerCase()),
  )

  const indexUltimoApenado = paginaAtual * itensPorPagina
  const indexPrimeiroApenado = indexUltimoApenado - itensPorPagina
  const apenadosPaginados = apenadosFiltrados.slice(
    indexPrimeiroApenado,
    indexUltimoApenado,
  )

  const totalPaginas = Math.ceil(apenadosFiltrados.length / itensPorPagina)


  const handleRowClick = (id:any) => {
    navigate(`/dashboard/lista-apenados/${id}`)
  }
  return (
    <ConvictsDatasContainer>
      <h1>Indivíduos</h1>

      <FormContainer action="">
        <header>
          <div>
            <label htmlFor="mostrar">Mostrar</label>
            <select
              name="quantidade"
              id="quantidade"
              value={itensPorPagina}
              onChange={handleItensPorPaginaChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Buscar"
            value={busca}
            onChange={handleBuscaChange}
          />
        </header>

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Endereço</th>
              <th>Relevância</th>
              <th>Data Início</th>
              <th>Data Fim</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {apenadosPaginados.map((apenado, index) => (
              <tr key={index} onClick={() => handleRowClick(index)} style={{cursor: 'pointer'}} >
                <td>{apenado.nome}</td>
                <td>{`${apenado.endereco.logradouro}, ${apenado.endereco.numero}, ${apenado.endereco.municipio}, ${apenado.endereco.estado}, ${apenado.endereco.cep}, ${apenado.endereco.complemento}`}</td>
                <td>{apenado.relevancia}</td>
                <td>{apenado.dataInicio}</td>
                <td>{apenado.dataFim}</td>
                <td>{apenado.situacao}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination>
          <button
            type="button"
            onClick={() => setPaginaAtual(paginaAtual - 1)}
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>
          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => setPaginaAtual(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
          >
            Próxima
          </button>
        </Pagination>
      </FormContainer>
    </ConvictsDatasContainer>
  )
}
