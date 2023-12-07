document.addEventListener('DOMContentLoaded', function() {
    let audioStream;
    let audioContext;
    let audioDestination;

    const toggleButton = document.getElementById('toggleButton');
    const audioIcon = document.getElementById('audioIcon');

    toggleButton.addEventListener('click', toggleMicrophone);

    function toggleMicrophone() {
        if (audioStream) {
            const audioTracks = audioStream.getAudioTracks();
            if (audioTracks.length > 0) {
                audioTracks[0].enabled = !audioTracks[0].enabled;

                if (audioTracks[0].enabled) {
                    toggleButton.innerText = 'MIC ON';
                    audioIcon.classList.remove('fa-volume-off');
                    audioIcon.classList.add('fa-volume-up');
                } else {
                    toggleButton.innerText = 'MIC OFF';
                    audioIcon.classList.remove('fa-volume-up');
                    audioIcon.classList.add('fa-volume-off');
                }
            }
        }
    }

    navigator.mediaDevices.getUserMedia({ audio: true})
        .then(stream => {
            audioStream = stream;

            audioContext = new AudioContext();
            audioDestination = audioContext.destination;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(audioDestination);

            // Desabilita imediatamente o áudio
            stream.getAudioTracks().forEach(track => {
                track.enabled = false;
            });
        })
        .catch(error => console.error('Erro ao acessar o microfone:', error));
});
