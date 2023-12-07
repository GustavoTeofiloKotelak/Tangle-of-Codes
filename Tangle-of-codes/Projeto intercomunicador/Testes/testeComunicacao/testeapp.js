const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();
const wrtc = require('wrtc');// Módulo wrtc para WebRTC em Node.js

app.use(express.static('testePublic'));

const options = {
    key: fs.readFileSync(path.join(__dirname, './certificados/certificado.key')),
    cert: fs.readFileSync(path.join(__dirname, './certificados/certificado.crt'))
  };

app.use(express.static(path.join(__dirname, 'testePublic')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'testePublic', 'testeindex.html'));
});


const httpsServer = https.createServer(options, app);

const io = require('socket.io')(httpsServer);


io.on('connection', (socket) => {
    console.log('a user connected');

    let peerConnection = new wrtc.RTCPeerConnection(); // Criação de uma nova conexão Peer

    // Evento para lidar com o ICE Candidate enviado pelo cliente
    socket.on('ice-candidate', (iceCandidate) => {
        peerConnection.addIceCandidate(new wrtc.RTCIceCandidate(iceCandidate));
    });

    // Evento para lidar com a oferta (offer) enviada pelo cliente
    socket.on('offer', async (offer) => {
        await peerConnection.setRemoteDescription(new wrtc.RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('answer', answer);
    });

    // Evento para lidar com a resposta (answer) enviada pelo cliente
    socket.on('answer', (answer) => {
        peerConnection.setRemoteDescription(new wrtc.RTCSessionDescription(answer));
    });

    // Evento para lidar com o áudio enviado pelo cliente
    socket.on('audio', (data) => {
        // Reproduz o áudio diretamente nos alto-falantes do servidor
        const speaker = new wrtc.Speaker();
        speaker.write(Buffer.from(data, 'base64'));
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        peerConnection.close();
    });
});

httpsServer.listen(443, () => {
    console.log('Servidor rodando em https://localhost');
});
