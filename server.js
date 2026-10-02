const http = require('http');
const { handleRequest } = require('./routes');

function app(req, res) {
  handleRequest(req, res);
}

function startServer(port = Number(process.env.PORT) || 3000) {
  const server = http.createServer(app);

  function listenOn(nextPort) {
    server.once('error', (error) => {
      if (error && error.code === 'EADDRINUSE' && nextPort !== 0 && !process.env.PORT) {
        console.warn(`Porta ${nextPort} ocupada. Tentando porta efêmera...`);
        listenOn(0);
        return;
      }

      console.error('Erro ao iniciar servidor:', error);
      process.exitCode = 1;
    });

    server.listen(nextPort, () => {
      const actualPort = server.address().port;
      console.log(`Servidor rodando em http://localhost:${actualPort}`);
    });
  }

  listenOn(port);
  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.startServer = startServer;
