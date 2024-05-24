import express from 'express';
import pg from 'pg';
import conn from '../db-conn.json';
import SQL from 'sql-template-strings';

// Configura as credenciais de acesso ao banco de dados
const pool = new pg.Pool(conn);

const routes = express.Router();

const query_pessoa_id = 'SELECT * FROM "Pessoa" WHERE id = $1';

function getAltPenalQuery(
  has_id_pessoa: boolean,
  has_id_ap: boolean,
  has_visitas: boolean
) {
  const conditions = [];
  if (has_id_pessoa) {
    conditions.push(`a.id_pessoa=?`);
  }
  if (has_id_pessoa) {
    conditions.push(`a.id=?`);
  }
  const query = `
    SELECT a.*${
      !has_id_pessoa
        ? `,b.nome,b.cpf,b.tel_ddi,b.tel_ddd,b.tel_num,b.relevancia`
        : ``
    },c.info_geo,c.logradouro,c.numero,c.complemento,c.cep,c.municipio,c.estado,array_agg(f.nome) AS crimes
    ${has_visitas ? `,array_agg(g) AS visitas` : ``}
    FROM "AltPenal" a
    INNER JOIN "Pessoa" b ON b.id=a.id_pessoa
    INNER JOIN "Endereco" c ON (c.id=a.id_endereco AND c.id_pessoa=b.id)
    LEFT JOIN (SELECT d.id, d.id_alt_penal, e.nome FROM "Crime" d
    INNER JOIN "TipoCrime" e ON e.id=d.id_tipo_crime) AS f ON f.id_alt_penal=a.id
    ${has_visitas ? `LEFT JOIN "Visita" g ON g.id_alt_penal=a.id` : ``}
    ${conditions.length > 0 ? `WHERE ` + conditions.join('AND') : ``}
    GROUP BY a.id,b.id,c.id,c.info_geo,c.logradouro,c.numero,c.complemento,c.estado,c.cep,c.estado,c.municipio
    ORDER BY a.id DESC`;
  return query;
}

// Define a rota para cadastrar um novo cadastro
routes.post('/alt-penal', async (req, res) => {
  const {
    id,
    nome,
    cpf,
    relevancia,
    tel_ddi,
    tel_ddd,
    tel_num,
    endereco,
    vara,
    num_autos,
    data_inicio,
    data_fim,
    medida_imposta,
    situacao
  } = req.body;
  const query_look = 'SELECT * FROM "Pessoa" WHERE cpf = $1';
  let id_pessoa;
  const id_endereco = Number(endereco);
  try {
    const result = await pool.query(query_look, [cpf]);
    if (result.rows.length === 0) {
      const query_ins_pessoa =
      'INSERT INTO "Pessoa" (nome, relevancia, cpf, tel_ddi, tel_ddd, tel_num) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
      const result_pessoa = await pool.query(query_ins_pessoa, [
      nome,
      relevancia,
      cpf,
      tel_ddi,
      tel_ddd,
      tel_num
      ]);
      if (result_pessoa.rows.length === 0) {
      throw new Error('Erro ao cadastrar pessoa');
      } else {
      id_pessoa = result_pessoa.rows[0].id;
      }
    } else {
      id_pessoa = Number(result.rows[0].id);
    }

    const query_ins_alt_penal =
      'INSERT INTO "AltPenal" (id_pessoa, id_endereco, vara, num_autos, data_inicio, data_fim, medida_imposta, situacao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    const result_alt_penal = await pool.query(query_ins_alt_penal, [
      id_pessoa,
      id_endereco,
      Number(vara),
      num_autos,
      data_inicio,
      data_fim,
      medida_imposta,
      String(Boolean(situacao))
    ]);
    res.send('Cadastro cadastrado com sucesso');
  } catch (err) {
    if (typeof err === 'string') {
      res.status(500).send(err);
    } else if (err instanceof Error) {
      res.status(500).send(String(err.message));
    }
  }
});

// Define a rota para buscar uma pessoa pelo id
routes.get('/pessoa/:id', function (req, res) {
  const {id} = req.params;
  pool.query(query_pessoa_id, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar cadastro');
    } else if (result.rows.length === 0) {
      res.status(404).send('Cadastro não encontrado');
    } else {
      res.send(result.rows[0]);
    }
  });
});

routes.get('/pessoa-cpf/:cpf', function (req, res) {
  const {cpf} = req.params;
  // res.send(JSON.stringify(req.params));
  const query = 'SELECT * FROM "Pessoa" WHERE cpf = $1';
  pool.query(query, [cpf], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar cadastro');
    } else if (result.rows.length === 0) {
      res.status(404).send('Cadastro não encontrado');
    } else {
      res.send(result.rows[0]);
    }
  });
});

routes.get('/endereco-pessoa/:id', function (req, res) {
  const {id} = req.params;
  const query =
    'SELECT * FROM "Endereco" WHERE id_pessoa = $1 ORDER BY data_ins DESC';
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar cadastro');
    } else if (result.rows.length === 0) {
      res.status(404).send('Cadastro não encontrado');
    } else {
      res.send(result.rows);
    }
  });
});

// Define a rota para listar todos as pessoas
routes.get('/pessoa', function (req, res) {
  const query = 'SELECT * FROM "Pessoa"';
  pool.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar cadastros');
    } else {
      res.send(result.rows);
    }
  });
});

// Define a rota para listar todos os cadastros de alternativas penais acompanhados de principais informações
routes.get('/alt-penal', function (req, res) {
  const query = getAltPenalQuery(false, false, false);
  //console.log({query: query});
  pool.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar cadastros');
    } else {
      res.send(result.rows);
    }
  });
});

routes.get('/ap-vis-pessoa/', async (req, res) => {
  const query_ap = getAltPenalQuery(false, false, true);
  console.log(query_ap);
  try {
    const result_ap = await pool.query(query_ap);
    const ret_result_ap = result_ap.rows.length !== 0 ? result_ap.rows : [];
    res.send(ret_result_ap);
  } catch (err) {
    if (typeof err === 'string') {
      res.status(500).send(err);
    } else if (err instanceof Error) {
      res.status(500).send(String(err.message));
    }
  }
});

routes.get('/ap-vis-pessoa/:id', async (req, res) => {
  const query_ap = getAltPenalQuery(true, false, true);
  const {id} = req.params;
  try {
    const result_pessoa = await pool.query(query_pessoa_id, [id]);
    if (result_pessoa.rows.length === 0) {
      throw new Error('Nenhuma pessoa corresponde ao id informado');
    } else {
      const result_ap = await pool.query(query_ap, [id]);
      const ret_result_ap =
        result_pessoa.rows.length !== 0 ? result_ap.rows : [];
      res.send({
        pessoa: result_pessoa.rows[0],
        ap_vis: ret_result_ap
      });
    }
  } catch (err) {
    if (typeof err === 'string') {
      res.status(500).send(err);
    } else if (err instanceof Error) {
      res.status(500).send(String(err.message));
    }
  }
});

routes.post('/vis', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {id_alt_penal, observacao} = req.body;
  try {
    const query_ins_visita =
      'INSERT INTO "Visita" (id_alt_penal, observacao) VALUES ($1, $2)';
    const result_visita = await pool.query(query_ins_visita, [
      Number(id_alt_penal),
      observacao
    ]);
    res.send('Visita cadastrada com sucesso');
  } catch (err) {
    if (typeof err === 'string') {
      res.status(500).send(err);
    } else if (err instanceof Error) {
      res.status(500).send(String(err.message));
    }
  }
});

routes.get('/ap-vis/:id', async (req, res) => {
  const query_ap = getAltPenalQuery(false, true, true);
  const {id} = req.params;
  try {
    const result_ap = await pool.query(query_ap, [id]);
    if (result_ap.rows.length === 0) {
      throw new Error('Nenhuma alternativa penal corresponde ao id informado');
    } else {
      res.send(result_ap.rows[0]);
    }
  } catch (err) {
    if (typeof err === 'string') {
      res.status(500).send(err);
    } else if (err instanceof Error) {
      res.status(500).send(String(err.message));
    }
  }
});

export default routes;
