import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Endereco {
  cep: string
  estado: string
  complemento: string
  numero: string
  municipio: string
  logradouro: string
}

interface Apenado {
  nome: string
  endereco: Endereco
  relevancia: string
  dataInicio: string
  dataFim: string
  situacao: string
  medidaImposta: string
  crimes: string[]
  observacoesVisita: string[]
  foto: string
}

interface ConvictContextProps {
  apenados: Apenado[]
  setApenados: React.Dispatch<React.SetStateAction<Apenado[]>>
}

export const ConvictContext = createContext({} as ConvictContextProps)

interface ConvictProviderProps {
  children: ReactNode
}

export function ConvictProvider({ children }: ConvictProviderProps) {
  const [apenados, setApenados] = useState<Apenado[]>([
    {
      nome: 'João Silva',
      endereco: {
        cep: '12345-678',
        estado: 'SP',
        complemento: 'Apto 101',
        numero: '123',
        municipio: 'São Paulo',
        logradouro: 'Rua das Flores',
      },
      relevancia: 'Alta',
      dataInicio: '01/01/2023',
      dataFim: '01/01/2025',
      situacao: 'Ativo',
      medidaImposta: 'Prisão domiciliar',
      crimes: ['Chefe de Quadrilha', 'Estelionato'],
      observacoesVisita: ['Não pode receber visitas nas terças-feiras', 'Apenas familiares diretos'],
      foto: 'https://github.com/Butewbr.png',
    },
    {
      nome: 'Fernando, mas não o Futila',
      endereco: {
        cep: '98765-432',
        estado: 'RJ',
        complemento: 'Casa 10',
        numero: '456',
        municipio: 'Rio de Janeiro',
        logradouro: 'Avenida Brasil',
      },
      relevancia: 'Média',
      dataInicio: '15/02/2023',
      dataFim: '15/02/2024',
      situacao: 'Ativo',
      medidaImposta: 'Regime semiaberto',
      crimes: ['Tráfico de Drogas'],
      observacoesVisita: ['Visitas permitidas aos finais de semana'],
      foto: 'https://github.com/Futila.png',
    },
    // Adicione os demais apenados com detalhes aqui
  ])

  return (
    <ConvictContext.Provider value={{ apenados, setApenados }}>
      {children}
    </ConvictContext.Provider>
  )
}

export function useConvict() {
  const context = useContext(ConvictContext)
  if (!context) {
    throw new Error('useConvict must be used within a ConvictProvider')
  }
  return context
}