const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const webrtc = require("wrtc");
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('C:/Users/OPX Dev/testeTransmissaoDeVideo/webrtc-one-to-many/certificados/certificado.key'),
    cert: fs.readFileSync('C:/Users/OPX Dev/testeTransmissaoDeVideo/webrtc-one-to-many/certificados/certificado.crt')
};

// Inicialize senderStream como uma matriz vazia
let senderStream = [];

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/consumer", async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls:[
                    'stun:stun.l.google.com:19302',
                    'stun:stun1.l.google.com:19302'
                  ]
            }
        ]
    });
    peer.ontrack = (e) => handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);

    senderStream.forEach(stream => {
        stream.getTracks().forEach(track => {
            peer.addTransceiver(track, { streams: [stream] });
        });
    });

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    };
    res.json(payload);
});

app.post('/broadcast', async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                            urls:[
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302'
            ]
            }
        ]
    });
    peer.ontrack = (e) => handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);

    senderStream.forEach(stream => {
        stream.getTracks().forEach(track => {
            peer.addTransceiver(track, { streams: [stream] });
        });
    });

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    };
    res.json(payload);
});

function handleTrackEvent(e, peer) {
    const newStream = e.streams[0];

    if (newStream) {
        const existingStream = senderStream.find(stream => stream.id === newStream.id);

        if (!existingStream) {
            senderStream.push(newStream);
        }

        // Exibir apenas a última stream recebida
        console.log("Sender Stream:", senderStream);
    }
}

https.createServer(options, app).listen(443, () => {
    console.log('Server is Running in 443');
});
