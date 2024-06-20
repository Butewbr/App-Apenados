import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConvictsDatasContainer, FormContainer, Pagination } from './styles'

export function ConvictsDatasPage() {
  const [apenados, setApenados] = useState([
    {
      nome: 'João Silva',
      endereco: 'Rua das Flores, 123, São Paulo, SP',
      relevancia: 'Alta',
      dataInicio: '01/01/2023',
      dataFim: '01/01/2025',
      situacao: 'Ativo',
    },
    {
      nome: 'Maria Oliveira',
      endereco: 'Avenida Brasil, 456, Rio de Janeiro, RJ',
      relevancia: 'Média',
      dataInicio: '15/02/2023',
      dataFim: '15/02/2024',
      situacao: 'Ativo',
    },
    {
      nome: 'Carlos Santos',
      endereco: 'Rua da Paz, 789, Belo Horizonte, MG',
      relevancia: 'Baixa',
      dataInicio: '10/03/2022',
      dataFim: '10/03/2023',
      situacao: 'Concluído',
    },
    {
      nome: 'Ana Lima',
      endereco: 'Praça das Nações, 101, Curitiba, PR',
      relevancia: 'Alta',
      dataInicio: '20/04/2023',
      dataFim: '20/04/2025',
      situacao: 'Ativo',
    },
    {
      nome: 'Roberto Costa',
      endereco: 'Avenida Central, 202, Porto Alegre, RS',
      relevancia: 'Média',
      dataInicio: '05/05/2021',
      dataFim: '05/05/2022',
      situacao: 'Concluído',
    },
    {
      nome: 'Luciana Ferreira',
      endereco: 'Rua dos Lírios, 345, Brasília, DF',
      relevancia: 'Alta',
      dataInicio: '01/06/2023',
      dataFim: '01/06/2024',
      situacao: 'Ativo',
    },
    {
      nome: 'Pedro Almeida',
      endereco: 'Avenida das Américas, 678, Fortaleza, CE',
      relevancia: 'Baixa',
      dataInicio: '15/07/2022',
      dataFim: '15/07/2023',
      situacao: 'Concluído',
    },
    {
      nome: 'Juliana Souza',
      endereco: 'Rua das Acácias, 910, Salvador, BA',
      relevancia: 'Média',
      dataInicio: '20/08/2023',
      dataFim: '20/08/2024',
      situacao: 'Ativo',
    },
    {
      nome: 'Marcelo Araújo',
      endereco: 'Avenida Paulista, 112, São Paulo, SP',
      relevancia: 'Alta',
      dataInicio: '05/09/2022',
      dataFim: '05/09/2023',
      situacao: 'Concluído',
    },
    {
      nome: 'Fernanda Silva',
      endereco: 'Rua das Palmeiras, 1314, Rio de Janeiro, RJ',
      relevancia: 'Média',
      dataInicio: '25/10/2023',
      dataFim: '25/10/2024',
      situacao: 'Ativo',
    },
    {
      nome: 'Rafael Lima',
      endereco: 'Avenida Beira Mar, 1516, Recife, PE',
      relevancia: 'Baixa',
      dataInicio: '10/11/2022',
      dataFim: '10/11/2023',
      situacao: 'Concluído',
    },
    {
      nome: 'Patrícia Gomes',
      endereco: 'Rua das Mangueiras, 1718, Florianópolis, SC',
      relevancia: 'Alta',
      dataInicio: '15/12/2023',
      dataFim: '15/12/2024',
      situacao: 'Ativo',
    },
    {
      nome: 'Thiago Mendes',
      endereco: 'Avenida Ipiranga, 1920, Porto Alegre, RS',
      relevancia: 'Média',
      dataInicio: '01/01/2022',
      dataFim: '01/01/2023',
      situacao: 'Concluído',
    },
    {
      nome: 'Beatriz Nunes',
      endereco: 'Rua das Hortênsias, 2122, Manaus, AM',
      relevancia: 'Baixa',
      dataInicio: '10/02/2023',
      dataFim: '10/02/2024',
      situacao: 'Ativo',
    },
    {
      nome: 'Ricardo Carvalho',
      endereco: 'Avenida das Nações, 2324, Curitiba, PR',
      relevancia: 'Alta',
      dataInicio: '20/03/2022',
      dataFim: '20/03/2023',
      situacao: 'Concluído',
    },
    {
      nome: 'Sandra Pereira',
      endereco: 'Rua das Laranjeiras, 2526, Belo Horizonte, MG',
      relevancia: 'Média',
      dataInicio: '30/04/2023',
      dataFim: '30/04/2024',
      situacao: 'Ativo',
    },
    {
      nome: 'Fábio Souza',
      endereco: 'Avenida do Contorno, 2728, Fortaleza, CE',
      relevancia: 'Baixa',
      dataInicio: '15/05/2022',
      dataFim: '15/05/2023',
      situacao: 'Concluído',
    },
    {
      nome: 'Gabriela Barbosa',
      endereco: 'Rua das Oliveiras, 2930, Salvador, BA',
      relevancia: 'Alta',
      dataInicio: '25/06/2023',
      dataFim: '25/06/2024',
      situacao: 'Ativo',
    },
    {
      nome: 'Rodrigo Ferreira',
      endereco: 'Avenida das Flores, 3132, Brasília, DF',
      relevancia: 'Média',
      dataInicio: '05/07/2022',
      dataFim: '05/07/2023',
      situacao: 'Concluído',
    },
    {
      nome: 'Larissa Oliveira',
      endereco: 'Rua das Acácias, 3334, São Paulo, SP',
      relevancia: 'Baixa',
      dataInicio: '15/08/2023',
      dataFim: '15/08/2024',
      situacao: 'Ativo',
    },
  ])

  const [busca, setBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(5)
  const navigate = useNavigate()
  const handleBuscaChange = (event) => {
    setBusca(event.target.value)
  }

  const handleItensPorPaginaChange = (event) => {
    setItensPorPagina(Number(event.target.value))
    setPaginaAtual(1) // Reset to first page whenever items per page changes
  }
  const apenadosFiltrados = apenados.filter(
    (apenado) =>
      apenado.nome.toLowerCase().includes(busca.toLowerCase()) ||
      apenado.endereco.toLowerCase().includes(busca.toLowerCase()) ||
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
                <td>{apenado.endereco}</td>
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
