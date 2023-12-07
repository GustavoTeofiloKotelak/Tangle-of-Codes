const express = require('express');
const https = require('https');
const fs = require('fs');
const SocketService = require('./SocketService');

const app = express();

// Carregando os certificados
const options = {
    key: fs.readFileSync('C:/Users/OPX Dev/api-p2p-video-chat/certificados/certificado.key'),
    cert: fs.readFileSync('C:/Users/OPX Dev/api-p2p-video-chat/certificados/certificado.crt')
  }

class App {
  constructor(port) {
    this.port = port ? port : 3000;
    this.server = https.createServer(options, app);
    this.socketService = new SocketService(this.server);
  }

  start() {
    app.get('/health', (req, res) => {
      res.send({
        status: 'UP'
      });
    });

    app.use(express.static('public'));

    this.server.listen(this.port, () => {
      console.log(`server up at port: ${this.port}`);
    });
  }
}

module.exports = (port) => {
  return new App(port);
}
