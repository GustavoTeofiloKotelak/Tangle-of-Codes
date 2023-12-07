window.onload = () => {
    document.getElementById('start-button').onclick = () => {
        init();
    }
    document.getElementById('stop-button').onclick = () => {
        stop();
    }
}


async function init() {
    stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });
    document.getElementById("video").srcObject = stream;
    const peer = createPeer();
    stream.getTracks().forEach(track => peer.addTrack(track, stream));
    peer.addTransceiver("audio", { direction: "sendrecv" })
    document.getElementById('stop-button').disabled = false;
}

function stop() {
    stream.getTracks().forEach(track => track.stop()); // Para todos os tracks da stream
    document.getElementById("video").srcObject = null; // Remove a stream do vídeo
    document.getElementById('stop-button').disabled = true; // Desabilita o botão de parar
 
}

function createPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls:[
                    'stun:stun.l.google.com:19302',
                    'stun:stun1.l.google.com:19302'
                  ]
            }

        ]
    });
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
}

async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };

    const { data } = await axios.post('/broadcast', payload); // Use '/broadcast' para o index
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e => console.log(e));
}
function handleTrackEvent(e) {
    document.getElementById("video").srcObject = e.streams[0];
    document.getElementById("audio").srcObject = e.streams[0];
    console.log(e)
};