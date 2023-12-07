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
        video: false,
        audio: true,
    });
    document.getElementById("video").srcObject = stream;
    const peer = createPeer();
    stream.getTracks().forEach(track => peer.addTrack(track, stream));
    peer.addTransceiver("video", { direction: "recvonly" })
    peer.addTransceiver("audio", { direction: "sendrecv" })
    document.getElementById('stop-button').disabled = false;
}

function stop() {
    document.getElementById("video").srcObject = null; 
    document.getElementById("audio").srcObject = null; 
    document.getElementById('stop-button').disabled = true
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

    const { data } = await axios.post('/consumer', payload); // Use '/consumer' para o viewer
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e => console.log(e));
}
function handleTrackEvent(e) {
    console.log("Received track event:", e);

    // Exibir apenas a última stream recebida
    const videoElement = document.getElementById("video");
    const audioElement = document.getElementById("audio");

    // Adicionar a nova stream ao elemento de vídeo
    if (videoElement.srcObject !== e.streams[0]) {
        videoElement.srcObject = e.streams[0];
    }

    // Adicionar a nova stream ao elemento de áudio
    if (audioElement.srcObject !== e.streams[0]) {
        audioElement.srcObject = e.streams[0];
    }

    console.log("Viewer Streams:", viewerStreams);
}