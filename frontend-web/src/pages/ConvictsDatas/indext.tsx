import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConvictContext } from '../../context/ConvictContext'
import { ConvictsDatasContainer, FormContainer, Pagination } from './styles'
import api from '../api'

export function ConvictsDatasPage() {


  const [busca, setBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(5)


  const navigate = useNavigate()

  const [apenados, setApenados] = useState<any>([]);

  useEffect(() => {
    api
      .get('/api/apenados')
      .then((response) => {
        setApenados(response.data)
      })
      .catch((error) => {
        console.error('Error fetching apenados:', error)
      });
  }, []);


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
      apenado.endereco.rua.toLowerCase().includes(busca.toLowerCase()) ||
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

  const handleRowClick = (id: any) => {
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
              <th>ID</th>
              <th>Nome</th>
              <th>Endereço</th>
              <th>Relevância</th>
              <th>Data Início</th>
              <th>Data Fim</th>
            </tr>
          </thead>
          <tbody>
            {apenadosPaginados.map((apenado, index) => (
              <tr key={apenado.id} onClick={() => handleRowClick(apenado.id)} style={{cursor: 'pointer'}} >
                <td>{apenado.id}</td>
                <td>{apenado.nome}</td>
                <td>{`${(apenado.rua)?apenado.rua+', ':''} ${(apenado.numero)?apenado.numero+', ':''} ${(apenado.municipio)?apenado.municipio+', ':''} ${(apenado.estado)?apenado.estado+', ':''} ${(apenado.cep)?apenado.cep+', ':''} ${(apenado.complemento)?apenado.complemento+', ':''}`}</td>
                <td>{apenado.relevancia}</td>
                <td>{apenado.data_inicio?new Date(apenado.data_inicio).toLocaleDateString():''}</td>
                <td>{apenado.data_fim?new Date(apenado.data_fim).toLocaleDateString():''}</td>
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
