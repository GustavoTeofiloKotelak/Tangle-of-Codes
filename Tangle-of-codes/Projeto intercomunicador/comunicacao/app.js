const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

const options = {
  key: fs.readFileSync(path.join(__dirname, './certificados/certificado.key')),
  cert: fs.readFileSync(path.join(__dirname, './certificados/certificado.crt'))
};

app.use(express.static(path.join(__dirname, 'public')));

//app.get('/', (req, res) => {
//  res.sendFile(path.join(__dirname, 'public', 'index.html'));
//});

https.createServer(options, app).listen(443, () => {
  console.log('Servidor rodando em https://localhost');
});




