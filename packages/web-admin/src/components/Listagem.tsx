import {useState, useEffect} from 'react';
import axios from 'axios';

function Listagem() {
  const [pena, setPena] = useState([]);

  const instance = axios.create({
    baseURL: 'http://localhost:3000/'
  });

  useEffect(() => {
    instance
      .get('/alt-penal')
      .then(response => setPena(response.data))
      .catch(error => console.log(error));
  }, []);

  const formatDate = (d: string | number | Date) => {
    const date = new Date(d);
    return (
      date.getDate().toString().padStart(2, '0') +
      '/' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      date.getFullYear().toString().padStart(4, '0')
    );
  };

  return (
    <>
      <div className="page-outter-c">
        <div className="page-title-c">
          <h2>Lista de Cadastros de Alternativas Penais</h2>
        </div>
        <div className="page-content-c">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Relevância</th>
                  <th>Tel. DDI</th>
                  <th>Tel. DDD</th>
                  <th>Tel. Número</th>
                  <th>Logradouro</th>
                  <th>Número</th>
                  <th>Complemento</th>
                  <th>CEP</th>
                  <th>Município</th>
                  <th>Estado</th>
                  <th>Vara</th>
                  <th>N. Autos</th>
                  <th>Data Início</th>
                  <th>Data Fim</th>
                  <th>Medida Imposta</th>
                  <th>Crimes</th>
                  <th>Situação</th>
                </tr>
              </thead>
              <tbody>
                {pena.map((p: any) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nome}</td>
                    <td style={{whiteSpace: 'nowrap'}}>
                      {p.cpf
                        .toString()
                        .replace(
                          /([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})/,
                          '$1.$2.$3-$4'
                        )}
                    </td>
                    <td>{p.relancia}</td>
                    <td>{p.tel_ddi}</td>
                    <td>{p.tel_ddd}</td>
                    <td style={{whiteSpace: 'nowrap'}}>
                      {p.tel_num
                        .toString()
                        .replace(/([0-9]{3,})([0-9]{3})/, '$1-$2')}
                    </td>
                    <td>{p.logradouro}</td>
                    <td>{p.numero}</td>
                    <td>{p.complemento}</td>
                    <td style={{whiteSpace: 'nowrap'}}>
                      {p.cep
                        .toString()
                        .padStart(8, '0')
                        .replace(/([0-9]{5})([0-9]{3})/, '$1-$2')}
                    </td>
                    <td>{p.municipio}</td>
                    <td>{p.estado}</td>
                    <td>{p.vara}</td>
                    <td>{p.num_autos}</td>
                    <td>{formatDate(p.data_inicio)}</td>
                    <td>{formatDate(p.data_fim)}</td>
                    <td>{p.medida_imposta}</td>
                    <td>{p.crimes.join(', ')}</td>
                    <td>{p.situacao ? 'Ativo' : 'Inativo'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Listagem;
