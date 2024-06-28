
import { ArrowLeft, ArrowRight } from 'phosphor-react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { ConvictContext, useConvict } from '../../context/ConvictContext'
import { useContext, useEffect, useState } from 'react'

import { ConvictContainer, ConvictDetailsContainer, CrimesContainer, ImposedMeasureContainer, ProfileInfo, Relevance, StatusAndRelevanceContainer, VisitsObsContainer,  } from './styles'
import api from '../api'

export function ConvictPage() {
  const navigate = useNavigate()

  const handleBack = (id:any) => {
    navigate(`/dashboard/lista-apenados`)
  }
  const handleEditar = () => {
    navigate(`/dashboard/editar-apenado/${id}`)
  }


  const { id } = useParams<{ id: string }>()

  const [apenado, setApenado] = useState<any>({});

  useEffect(() => {
    api
      .get('/api/apenado/'+id)
      .then((response) => {
        setApenado(response.data)
      })
      .catch((error) => {
        console.error('Error fetching apenados:', error)
      });
  }, []);


  if (!apenado) {
    return <div>Apenado não encontrado</div>
  }
  const nomes = apenado.nome?.split(' ');
  return (
    <ConvictContainer>
      <h1>Perfil do Indivíduo</h1>


      <ConvictDetailsContainer>

        <header style={{display:'flex'}}>

        <button onClick={handleBack}>
            <ArrowLeft size={32} />
            Voltar
          </button>
          <button style={{marginLeft: 'auto'}} onClick={handleEditar}>
            Editar
            <ArrowRight size={32} />
          </button>
        </header>

        <ProfileInfo>

        {<span>{nomes&&nomes.length>0?(nomes[0][0] + (nomes.length>1?nomes[1][0] : nomes[0][1])):''}</span>}

          <div>
            <h1>{apenado.nome} </h1><br />
            <span>{`${(apenado.rua)?apenado.rua+', ':''} ${(apenado.numero)?apenado.numero+', ':''} ${(apenado.complemento)?apenado.complemento+', ':''}`}</span><br />
            <span>{`${(apenado.cep)?apenado.cep+', ':''} ${(apenado.municipio)?apenado.municipio+', ':''} ${(apenado.estado)?apenado.estado+', ':''} `}</span>
          </div>

       </ProfileInfo>


       <StatusAndRelevanceContainer>
        <div>
          <p>
            <strong>STATUS:</strong> <span>{apenado.situacao?'ATIVO':'INATIVO'}</span>
          </p>

          <p><strong>Início de Pena:</strong> {apenado.data_inicio?new Date(apenado.data_inicio).toLocaleDateString():''}</p>
          <p><strong>Fim de Pena:</strong> {apenado.data_fim?new Date(apenado.data_fim).toLocaleDateString():''}</p>
        </div>

        <Relevance>

          <span style={{display:apenado.relevancia==1?'initial':'none'}}>Baixa</span>
          <span style={{display:apenado.relevancia==2?'initial':'none'}}>Média</span>
          <span style={{display:apenado.relevancia>=3?'initial':'none'}}>Alta</span>
          
        </Relevance>

       </StatusAndRelevanceContainer>


       <ImposedMeasureContainer>
        <header>
          <h3>Medida Imposta</h3>
        </header>

        <p>
          {apenado.medida_imposta}
        </p>
       </ImposedMeasureContainer>
       <CrimesContainer>
        <header>
          <h3>Crimes</h3>
        </header>

        <ul>

          {apenado.crimes?apenado.crimes.map((crime,index) => (
            <li key={index}>{(crime.data_ocorrido?new Date(crime.data_ocorrido).toLocaleDateString()+' - ':'')+crime.descricao}</li>
          )):null}
          
        </ul>
       </CrimesContainer>
       <VisitsObsContainer>
        <header>
          <h3>Visitas</h3>
        </header>

      
        <ul>
        {apenado.visitas && apenado.visitas.length>0 && apenado.visitas?
                    apenado.visitas?.sort((a, b) => b.id - a.id)
                  .map((visita,index) => (
                    <li key={index}>
                      {'ID: ' +
                        visita.id +
                        ' - Usuario: ' +
                        visita.matricula_usuario +
                        ' - Em casa: ' +
                        (visita.estava_em_casa ? 'Sim' : 'Não') +
                        ' - Data: ' +
                        (visita.data_visita?new Date(visita.data_visita).toLocaleDateString()+' - ':'') +
                        ' - Observação: ' +
                        visita.observacao}{' '}
                    </li>))
                    
                : 'Nenhuma visita registrada.'}       
        </ul>
       </VisitsObsContainer>

      </ConvictDetailsContainer>

     
    </ConvictContainer>
  )
}
