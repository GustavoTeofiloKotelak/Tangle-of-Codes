const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');

const app = express();
const proxy = httpProxy.createProxyServer({});

// Carregar os certificados SSL
const options = {
  key: fs.readFileSync('/home/opx/monitoramento/certificado/certificado.key'),
  cert: fs.readFileSync('/home/opx/monitoramento/certificado/certificado.crt')
};

const server = require('https').createServer(options, app); // Usar 'https' ao invés de 'http'

server.listen(3000, () => {
    console.log('Servidor rodando em https://localhost:3000'); // Usar https ao invés de http
});

const io = new Server(server);

app.get('/video', (req, res) => {
    proxy.web(req, res, { target: 'http://localhost:8081/?action=stream' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

io.on('connection', (socket) => {
    console.log('Um cliente se conectou');

    socket.on('audio', (data) => {
        console.log('Áudio recebido:', data);
    });
});



