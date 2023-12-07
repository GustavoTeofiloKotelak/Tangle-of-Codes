window.onload = () => {
    document.getElementById('start-button').onclick = () => {
        init();
    }
    document.getElementById('stop-button').onclick = () => {
        stop();
    }
}

async function init() {
    const peer = createPeer();
    peer.addTransceiver("video", { direction: "recvonly" })
    peer.addTransceiver("audio", { direction: "recvonly" })
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
                urls: "stun:stun.stunprotocol.org"
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

    const { data } = await axios.post('/consumer', payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e => console.log(e));
}

function handleTrackEvent(e) {
    document.getElementById("video").srcObject = e.streams[0];
    document.getElementById("audio").srcObject = e.streams[0];
};