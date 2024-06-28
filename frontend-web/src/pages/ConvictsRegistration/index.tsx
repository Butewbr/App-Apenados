/* eslint-disable prettier/prettier */
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
import { useEffect, useState } from 'react';
import api from '../api'
import { useParams } from 'react-router-dom';

export function ConvictsRegistrationPage() {
  const { id } = useParams<{ id: string }>()

  const [altPenal, setAltPenal] = useState<any>({
    vara: '',
    numeroAutos: '',
    dataInicio: '',
    dataFim: '',
    medidaImposta: '',
  });
  const [apenado, setApenado] = useState<any>({
    nome: '',
    cpf: '',
    telefone: '',
    relevancia: '',
  });
  const [endereco, setEndereco] = useState<any>({
    cep: '',
    estado: '',
    complemento: '',
    numero: '',
    municipio: '',
    rua: '',
    latitude: '',
    longitude: '',
  });
  const [crimes, setCrimes] = useState([
    {
      descricao: '',
      dataOcorrido: '',
    },
    ]);

    useEffect(() => {
      if(id){
        api
          .get('/api/apenado/'+id)
          .then((response) => {  
            const res = response.data
            setAltPenal({
              id_altpenal: res.id_altpenal,
              vara: res.vara,
              numeroAutos: res.num_autos,
              dataInicio: res.data_inicio?new Date(res.data_inicio).toISOString().split('T')[0]:'',
              dataFim: res.data_fim?new Date(res.data_fim).toISOString().split('T')[0]:'',
              medidaImposta: res.medida_imposta,
            });
            setApenado({
              id_apenado: res.id_apenado,
              nome: res.nome,
              cpf: res.cpf,
              telefone: res.telefone,
              relevancia: res.relevancia,
            });
            setEndereco({
              id_endereco: res.id_endereco,
              cep: res.cep,
              estado: res.estado,
              complemento: res.complemento,
              numero: res.numero,
              municipio: res.municipio,
              rua: res.rua,
              latitude:  res.info_geo.coordinates[1],
              longitude: res.info_geo.coordinates[0],
            });
            if(res.crimes && res.crimes.length>0){
              setCrimes(res.crimes.map((crime:any) => {crime = {...crime, dataOcorrido: new Date(crime.data_ocorrido).toISOString().split('T')[0]}; return crime;}))
            }
          })
          .catch((error) => {
            console.error('Error fetching apenados:', error)
          });
      }
    }, []);

    const handleCrimeChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCrimes((prevCrimes) => {
      const updatedCrimes = [...prevCrimes];
      updatedCrimes[index] = {
      ...updatedCrimes[index],
      [name]: value,
      };
      return updatedCrimes;
    });
    };

    const handleAddCrime = () => {
    setCrimes((prevCrimes) => [...prevCrimes, { descricao: '', dataOcorrido: '' }]);
    };

    const handleRemoveCrime = (index: number) => {
    setCrimes((prevCrimes) => {
      const updatedCrimes = [...prevCrimes];
      updatedCrimes.splice(index, 1);
      return updatedCrimes;
    });
    };       

    
    const handleAltPenalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setAltPenal((prevAltPenal) => ({
        ...prevAltPenal,
        [id]: value,
      }));
    };
    
    const handleApenadoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setApenado((prevApenado) => ({
        ...prevApenado,
        [id]: value,
      }));
    };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEndereco((prevEndereco) => ({
      ...prevEndereco,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/add_apenado', {
        altPenal,
        apenado,
        endereco,
        crimes
      });
      console.log('Data sent successfully:', response.data);
      alert('Cadastrado com sucesso!');
      setAltPenal({
        vara: '',
        numeroAutos: '',
        dataInicio: '',
        dataFim: '',
        medidaImposta: '',
      });
      setApenado({
        nome: '',
        cpf: '',
        telefone: '',
        relevancia: '',
      });
      setEndereco({
        cep: '',
        estado: '',
        complemento: '',
        numero: '',
        municipio: '',
        rua: '',
        latitude: '',
        longitude: '',
      });
      setCrimes([
        {
          descricao: '',
          dataOcorrido: '',
        },
        ]);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const handleGeocode = async () => {

    try {
      const address = [endereco.rua||'',endereco.numero||'',endereco.municipio||'',endereco.estado||'',endereco.cep||''].filter(t=>t).join(',');
      const response = await fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=667e663a8a194398484093hco040e6d`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setEndereco((prevEndereco) => ({
          ...prevEndereco,
          latitude: lat,
          longitude: lon,
        }));
      } else {
        alert('No results found');
      }
    } catch (error) {
      alert('Error geocoding address:');
      console.error('Error geocoding address:', error);
    }
  };

    return (
      <ConvictsRegistrationContainer>
      <h1>Cadastro de indivíduos</h1>
      <FormContainer onSubmit={handleSubmit}>
        <fieldset>
        <FieldsetWrapper>
          <legend>Informações Penais</legend>

          <InformationAcessWrapper>
          <div>
            <label htmlFor="vara">Vara</label>
            <Input type="text" id="vara" value={altPenal.vara} onChange={handleAltPenalChange} />
          </div>
          <div>
            <label htmlFor="numeroAutos">Nº Autos</label>
            <Input type="number" id="numeroAutos" value={altPenal.numeroAutos} onChange={handleAltPenalChange} />
          </div>
          <div>
            <label htmlFor="dataInicio">Data Início</label>
            <Input type="date" id="dataInicio" value={altPenal.dataInicio} onChange={handleAltPenalChange} />
          </div>
          <div>
            <label htmlFor="dataFim">Data Fim</label>
            <Input type="date" id="dataFim" value={altPenal.dataFim} onChange={handleAltPenalChange} />
          </div>
          <div>
            <label htmlFor="medidaImposta">Medida Imposta</label>
            <Textarea id="medidaImposta" value={altPenal.medidaImposta} onChange={handleAltPenalChange} />
          </div>
          </InformationAcessWrapper>
        </FieldsetWrapper>
        </fieldset>

        <fieldset>
        <FieldsetWrapper>
          <legend>Dados Pessoais</legend>

          <InformationAcessWrapper>
          <div>
            <label htmlFor="nome">Nome completo</label>
            <Input type="text" id="nome" value={apenado.nome} onChange={handleApenadoChange} />
          </div>

          <div>
            <label htmlFor="cpf">CPF</label>
            <Input type="number" id="cpf" value={apenado.cpf} onChange={handleApenadoChange} />
          </div>
          <div>
            <label htmlFor="telefone">Telefone</label>
            <Input type="tel" id="telefone" value={apenado.telefone} onChange={handleApenadoChange} />
          </div>
          
        <div>
          <label htmlFor="relevancia">Relevância</label>

          <Select id="relevancia" value={apenado.relevancia} onChange={handleApenadoChange}>
            <option value="1">Baixa</option>
            <option value="2">Media</option>
            <option value="3">Alta</option>
          </Select>
          </div>
          </InformationAcessWrapper>
        </FieldsetWrapper>
        </fieldset>

        <fieldset>
        <FieldsetWrapper>
          <legend>Endereço</legend>

          <InformationAcessWrapper>
          <div>
            <label htmlFor="rua">Rua</label>

            <Input type="text" id="rua" value={endereco.rua} onChange={handleEnderecoChange} />
          </div>
          <div>
            <label htmlFor="numero">Número</label>

            <Input type="number" id="numero" value={endereco.numero} onChange={handleEnderecoChange} />
          </div>
          <div>
            <label htmlFor="complemento">Complemento</label>

            <Input type="text" id="complemento" value={endereco.complemento} onChange={handleEnderecoChange} />
          </div>
          <div>
            <label htmlFor="municipio">Munícipio</label>

            <Input type="text" id="municipio" value={endereco.municipio} onChange={handleEnderecoChange} />
          </div>
          <div>
            <label htmlFor="estado">Estado</label>

            <Input type="text" id="estado" value={endereco.estado} onChange={handleEnderecoChange} />
          </div>
          <div>
            <label htmlFor="cep">CEP</label>

            <Input type="number" id="cep" value={endereco.cep} onChange={handleEnderecoChange} />
          </div>


          </InformationAcessWrapper>
        </FieldsetWrapper>

        </fieldset>
        <fieldset>
        <FieldsetWrapper>
          
          <legend>Localização</legend>

          <InformationAcessWrapper>
            
          <ButtonSaveInformation onClick={handleGeocode} type='button' style={{height:'initial'}}>
        Geocode
        </ButtonSaveInformation>
          <div>
            <label htmlFor="latitude">Latitude</label>

            <Input type="text" id="latitude" value={endereco.latitude} onChange={handleEnderecoChange} />
          </div>
          <div>
            <label htmlFor="longitude">Longitude</label>

            <Input type="text" id="longitude" value={endereco.longitude} onChange={handleEnderecoChange} />
          </div>
          </InformationAcessWrapper>
        </FieldsetWrapper>
        </fieldset>

        {/* VERIFICAR SE POMOS USAR JÁ UM ENDEREÇO DO BANCO DE DADOS */}
        {/* <strong>Usar um endereço já cadastrado</strong> */}

      <fieldset>
      <FieldsetWrapper>
      <legend>Crimes</legend>

      {crimes.map((crime, index) => (
        <InformationAcessWrapper key={index}>
        <div>
          <label htmlFor={`crime-${index}`}>Crime</label>
          <Input
          type="text"
          id={`crime-${index}`}
          name="descricao"
          value={crime.descricao}
          onChange={(e) => handleCrimeChange(index, e)}
          />
        </div>
        <div>
          <label htmlFor={`dataOcorrido-${index}`}>Data do Ocorrido</label>
          <Input
          type="date"
          id={`dataOcorrido-${index}`}
          name="dataOcorrido"
          value={crime.dataOcorrido}
          onChange={(e) => handleCrimeChange(index, e)}
          />
        </div>
        {index > 0 && (
          <button type="button" onClick={() => handleRemoveCrime(index)}>
          Remover Crime
          </button>
        )}
        </InformationAcessWrapper>
      ))}

      <button type="button" onClick={handleAddCrime}>
        Adicionar Crime
      </button>
      </FieldsetWrapper>
    </fieldset>

        <ButtonSaveInformation type="submit">
        SALVAR INFORMAÇÕES
        </ButtonSaveInformation>
      </FormContainer>
      </ConvictsRegistrationContainer>
    );
  }
