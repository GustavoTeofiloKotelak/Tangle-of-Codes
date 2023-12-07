document.addEventListener('DOMContentLoaded', function() {
    const socket = io();
    let peerConnection = new wrtc.RTCPeerConnection();
  
    document.getElementById('toggleButton').addEventListener('click', toggleMicrophone);

    let audioStream;
    let audioContext;

    async function toggleMicrophone() {
        if (!audioStream) {
            try {
                audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(audioStream);

                // Evento para enviar áudio para o servidor
                source.onaudioprocess = (e) => {
                    const left = e.inputBuffer.getChannelData(0);
                    socket.emit('audio', encodePCMtoOpus(left));
                }

                // Envia a oferta (offer) para o servidor
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                socket.emit('offer', offer);
            } catch (err) {
                console.error('Erro ao acessar o microfone:', err);
            }
        } else {
            audioStream.getTracks().forEach(track => track.stop());
            audioStream = null;
            audioContext.close();
            audioContext = null;
        }
    }

    // Função para codificar áudio PCM para Opus
    function encodePCMtoOpus(leftChannel) {
        const buffer = new ArrayBuffer(leftChannel.length * 2);
        const view = new DataView(buffer);
        for (let i = 0; i < leftChannel.length; i++) {
            view.setInt16(i * 2, leftChannel[i] * 0x7FFF, true);
        }
        return buffer;
    }
});

