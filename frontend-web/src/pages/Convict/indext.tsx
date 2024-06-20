
import { ArrowLeft } from 'phosphor-react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { ConvictContext, useConvict } from '../../context/ConvictContext'
import { useContext } from 'react'

import { ConvictContainer, ConvictDetailsContainer, CrimesContainer, ImposedMeasureContainer, ProfileInfo, Relevance, StatusAndRelevanceContainer, VisitsObsContainer,  } from './styles'

export function ConvictPage() {
  const navigate = useNavigate()

  const handleBack = (id:any) => {
    navigate(`/dashboard/lista-apenados`)
  }


  const { id } = useParams<{ id: string }>()
  const { apenados } = useContext(ConvictContext)

  console.log({
    id, apenados
  })

  const apenado = apenados.find((a, idx) => {
    if (idx === Number(id)){
      return a
    }
  })
  console.log("==>", apenado)

  if (!apenado) {
    return <div>Apenado não encontrado</div>
  }

  return (
    <ConvictContainer>
      <h1>Perfil do Indivíduo</h1>


      <ConvictDetailsContainer>

        <header>

          <button onClick={handleBack}>
            <ArrowLeft size={32} />
            Voltar
          </button>
        </header>

        <ProfileInfo>

          <img src={apenado.foto} alt="" />

          <div>
            <h1>{apenado.nome} </h1><br />
            <span>Rua dos Condenados, 001 - Jardim das Avenidas</span><br />
            <span>CEP: 88906-660, Araranguá - Santa Catarina</span>
          </div>

       </ProfileInfo>


       <StatusAndRelevanceContainer>
        <div>
          <p>
            <strong>STATUS:</strong> <span>{apenado.situacao}</span>
          </p>

          <p><strong>Início de Pena:</strong> {apenado.dataInicio}</p>
          <p><strong>Fim de Pena:</strong> {apenado.dataFim}</p>
        </div>

        <Relevance>

          <span>Baixa</span>
          <span>Média</span>
          <span>Alta</span>
          
        </Relevance>

       </StatusAndRelevanceContainer>


       <ImposedMeasureContainer>
        <header>
          <h3>Medida Imposta</h3>
        </header>

        <p>
          {apenado.medidaImposta}
        </p>
       </ImposedMeasureContainer>
       <CrimesContainer>
        <header>
          <h3>Crimes</h3>
        </header>

        <ul>

          {apenado.crimes.map((crime) => (
            <li key={crime}>{crime}</li>
          ))}
          
        </ul>
       </CrimesContainer>
       <VisitsObsContainer>
        <header>
          <h3>Observações de visita</h3>
        </header>

      
        <ul>
        {apenado.observacoesVisita.map((obs) => (
            <li key={obs}>{obs}</li>
          ))}        
        </ul>
       </VisitsObsContainer>

      </ConvictDetailsContainer>

     
    </ConvictContainer>
  )
}
