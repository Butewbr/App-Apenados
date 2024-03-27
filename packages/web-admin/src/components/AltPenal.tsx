import {useState, useEffect} from 'react';
import api from '@ronda-penal/axios-config';

function AltPenal() {
  const [nome, setNome] = useState('');
  const [cpf, setCPF] = useState('');
  const [relevancia, setRelevancia] = useState('');
  const [telDDI, setTelDDI] = useState('');
  const [telDDD, setTelDDD] = useState('');
  const [telNumero, setTelNumero] = useState('');
  const [endereco, setEndereco] = useState('');
  const [enderecos, setEnderecos] = useState([]);
  const [vara, setVara] = useState('');
  const [numAutos, setNumAutos] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [medidaImposta, setMedidaImposta] = useState('');
  const [crimes, setCrimes] = useState('');
  const [situacao, setSituacao] = useState(false);

  useEffect(() => {
    api
      .get('/pessoa-cpf/' + cpf)
      .then(response => {
        setNome(response.data.nome);
        setTelDDI(response.data.tel_ddi);
        setTelDDD(response.data.tel_ddd);
        setTelNumero(response.data.tel_num);

        api
          .get('/endereco-pessoa/' + response.data.id)
          .then(response => {
            setEnderecos(response.data);
            if (response.data.length > 0) {
              setEndereco(response.data[0].id);
            }
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }, [cpf]);

  const handleSubmit = (event: {preventDefault: () => void}) => {
    event.preventDefault();
    const novaAltPenal = {
      nome: nome,
      cpf: cpf,
      relevancia: relevancia,
      tel_ddi: telDDI,
      tel_ddd: telDDD,
      tel_num: telNumero,
      endereco: endereco,
      vara: vara,
      num_autos: numAutos,
      data_inicio: dataInicio,
      data_fim: dataFim,
      medida_imposta: medidaImposta,
      crimes: crimes.split(',').map(e => e.trim()),
      situacao: situacao
    };

    api
      .post('/alt-penal', novaAltPenal)
      .then(() => window.location.reload())
      .catch(error => console.log(error));
  };

  return (
    <div className="page-outter-c">
      <div className="page-title-c">
        <h2>Cadastro de Alternativas Penais</h2>
      </div>
      <div className="page-content-c">
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
          <label htmlFor="cpf">CPF:</label>
          <input
            type="text"
            id="cpf"
            value={cpf}
            onChange={e => setCPF(e.target.value)}
          />
          <label htmlFor="relevancia">Relevância:</label>
          <input
            type="text"
            id="relevancia"
            value={relevancia}
            onChange={e => setRelevancia(e.target.value)}
          />
          <label htmlFor="telDDI">Tel. DDI:</label>
          <input
            type="text"
            id="telDDI"
            value={telDDI}
            onChange={e => setTelDDI(e.target.value)}
          />
          <label htmlFor="telDDD">Tel. DDD:</label>
          <input
            type="text"
            id="telDDD"
            value={telDDD}
            onChange={e => setTelDDD(e.target.value)}
          />
          <label htmlFor="telNumero">Tel. Número:</label>
          <input
            type="text"
            id="telNumero"
            value={telNumero}
            onChange={e => setTelNumero(e.target.value)}
          />
          <label htmlFor="endereco">Enderecos:</label>
          <select
            name="endereco"
            id="endereco"
            onChange={e => {
              setEndereco(
                e.target.options[e.target.options.selectedIndex].value
              );
            }}>
            {enderecos.map((e: any) => (
              <option key={e.id} value={e.id}>
                {e.logradouro +
                  ' ' +
                  e.numero +
                  ', ' +
                  e.complemento +
                  ', ' +
                  e.municipio +
                  ' - ' +
                  e.estado}
              </option>
            ))}
          </select>
          <label htmlFor="vara">Vara:</label>
          <input
            type="text"
            id="vara"
            value={vara}
            onChange={e => setVara(e.target.value)}
          />
          <label htmlFor="numAutos">Nº Autos:</label>
          <input
            type="text"
            id="numAutos"
            value={numAutos}
            onChange={e => setNumAutos(e.target.value)}
          />
          <label htmlFor="dataInicio">Data Início:</label>
          <input
            type="text"
            id="dataInicio"
            value={dataInicio}
            onChange={e => setDataInicio(e.target.value)}
          />
          <label htmlFor="dataFim">Data Fim:</label>
          <input
            type="text"
            id="dataFim"
            value={dataFim}
            onChange={e => setDataFim(e.target.value)}
          />
          <label htmlFor="medidaImposta">Medida Imposta:</label>
          <input
            type="text"
            id="medidaImposta"
            value={medidaImposta}
            onChange={e => setMedidaImposta(e.target.value)}
          />
          <label htmlFor="crimes">Crimes:</label>
          <input
            type="text"
            id="crimes"
            value={crimes}
            onChange={e => setCrimes(e.target.value)}
          />
          <label htmlFor="situacao">Situação:</label>
          <input
            type="checkbox"
            id="situacao"
            checked={situacao}
            onChange={e => setSituacao(e.target.checked)}
          />
          <input type="submit" value="Cadastrar" />
        </form>
      </div>
    </div>
  );
}

export default AltPenal;
