
import { ArrowLeft } from 'phosphor-react'
import { useNavigate } from 'react-router-dom'
import { ConvictContainer, ConvictDetailsContainer, CrimesContainer, ImposedMeasureContainer, ProfileInfo, Relevance, StatusAndRelevanceContainer, VisitsObsContainer,  } from './styles'

export function ConvictPage() {
  const navigate = useNavigate()

  const handleBack = (id:any) => {
    navigate(`/dashboard/lista-apenados`)
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

          <img src="https://github.com/Futila.png" alt="" />

          <div>
            <h1>Willian Carlos Pereira </h1><br />
            <span>Rua dos Condenados, 001 - Jardim das Avenidas</span><br />
            <span>CEP: 88906-660, Araranguá - Santa Catarina</span>
          </div>

       </ProfileInfo>


       <StatusAndRelevanceContainer>
        <div>
          <p>
            <strong>STATUS:</strong> <span>ATIVO</span>
          </p>

          <p><strong>Início de Pena:</strong> 01/01/2023</p>
          <p><strong>Fim de Pena:</strong> 01/01/2123</p>
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
        Willian Carlos Pereira, condenado por chefiar uma quadrilha e praticar estelionato, recebeu liberdade condicional com restrições. Ele deve residir na Rua dos Condenados, 001 - Jardim das Avenidas, Araranguá, Santa Catarina, e recolher-se das 20:00 às 06:00. O sentenciado tem permissão para trabalhar, comprovando sua ocupação, e pode sair por até 4 horas diárias, mediante autorização prévia, para atividades essenciais. É obrigado a manter contato regular com seu agente de condicional. O descumprimento resultará na revogação da condicional.

        </p>
       </ImposedMeasureContainer>
       <CrimesContainer>
        <header>
          <h3>Crimes</h3>
        </header>

        <ul>
          <li>Chefe de Quadrilha</li>
          <li>Estelionato</li>
          <li>Tráfico de Armas</li>
        </ul>
       </CrimesContainer>
       <VisitsObsContainer>
        <header>
          <h3>Observações de visita</h3>
        </header>

      
        <ul>
          <li>19/02/2023 - As 21:30 do dia em questão, não se encontrava em sua residência.</li>
        
        </ul>
       </VisitsObsContainer>

      </ConvictDetailsContainer>

     
    </ConvictContainer>
  )
}
