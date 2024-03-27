/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import app from './app';
import express_config from '../express-port-config.json';

// Inicia o servidor na porta 3000
app.listen(express_config.port, function () {
  console.log(
    `Servidor iniciado na porta ` +
      String(express_config.port) +
      `: http://localhost:` +
      String(express_config.port) +
      `/`
  );
});
