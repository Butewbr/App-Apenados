// Importa os módulos necessários
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import cors_config from '../cors-config.json';

// Cria a aplicação Express
const app = express();

app.use(cors(cors_config));

// Configura o middleware para analisar o corpo das solicitações HTTP
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(routes);

export default app;
