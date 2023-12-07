
const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const { connect } = require('http2');
app.use(express.static(__dirname))


// Carregando os certificados

const key = fs.readFileSync('C:/Users/OPX Dev/Courses/Course-WRTC/MasteringWebRTCCourse/signalingPeerConnection/certificados/certificado.key');
const cert = fs.readFileSync('C:/Users/OPX Dev/Courses/Course-WRTC/MasteringWebRTCCourse/signalingPeerConnection/certificados/certificado.crt');

// we changed our express setup so we can use https
const expressServer = https.createServer({key, cert}, app);
//create our socketio server
const io = socketio(expressServer);
expressServer.listen(8181);

//offer will contain {}
const offers = [
    //offererUserName
    //offer
    //offerIceCandidates
    //answererUserNames
    //answer
    //answererIceCandidates
];
const connectedSockets= [
    //username, socketId
]

io.on('connection',(socket)=>{
    // console.log("Someone has connected")
    const userName = socket.handshake.auth.userName;
    const password = socket.handshake.auth.password;

    if(password !== "x"){
        socket.disconnect(true);
        return;
    }
    connectedSockets.push({
        socketId: socket.id,
        userName
    })

    socket.on('newOffer', newOffer=>{
        offers.push({
            offererUserName: userName,
            offer: newOffer,
            offerIceCandidates: [],
            answererUserNames: null,
            answer: null,
            answererIceCandidates: []
        })
        // console.log(newOffer.sdp.slice(50))
        //send out to all connected sockets EXCEPT the Caller
        socket.broadcast.emit('newOfferAwaiting',offers.slice(-1))
    })

    socket.on('sendIceCandidateToSignalingServer',iceCandidateObj=>{
        const { didIOffer, iceUsername, iceCandidate } = iceCandidateObj;
        // console.log(iceCandidate);
        if(didIOffer){
            const offerInOffers = offers.find(o=>o.offererUserName === iceUsername);
            if(offerInOffers){
                offerInOffers.offerIceCandidates.push(iceCandidate)
                //come back to This...
                //if the answerer ir already here, emit the iceCandidates to that user
            }
        }
        console.log(offers)
    })

})




console.log("Server is running on port 8181")