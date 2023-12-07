document.addEventListener('DOMContentLoaded', function() {
    let audioStream;
    let speaker;
    const toggleButton = document.getElementById('toggleButton');
    const audioIcon = document.getElementById('audioIcon');
  //  const videoElement = document.getElementById('videoElement');

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

    navigator.mediaDevices.getUserMedia({ audio: true})//, video: true })
        .then(stream => {
            // Desabilita imediatamente o áudio
            stream.getAudioTracks().forEach(track => {
                track.enabled = false;
            });

            audioStream = stream;
            toggleButton.disabled = false;

            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(audioContext.destination);

            speaker = audioContext.createMediaStreamDestination();
            source.connect(speaker);

          // Se você tem o ID do dispositivo USB, você pode usar algo como:
          // const usbSpeaker = audioContext.createMediaStreamDestination();
          // source.connect(usbSpeaker);

          // Adicionar um botão para reproduzir o áudio
          //  const playButton = document.getElementById('playButton');
          //  playButton.addEventListener('click', playAudio);
        })
        .catch(error => console.error('Erro ao acessar o microfone/video:', error));

  function playAudio() {
      if (audioContext && speaker) {
          // Criar um novo elemento de áudio
          const audioElement = new Audio();
          
          // Definir a fonte do áudio como a saída do contexto de áudio
          audioElement.srcObject = speaker.stream;

          // Reproduzir o áudio
          audioElement.play();
      }
  }

    
});

///////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    let audioStream;

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
            // Desabilita imediatamente o áudio
            stream.getAudioTracks().forEach(track => {
                track.enabled = false;
            });

            audioStream = stream;

            // Inicia a reprodução automaticamente
            playAudio();
        })
        .catch(error => console.error('Erro ao acessar o microfone:', error));

    function playAudio() {
        if (audioStream) {
            // Criar um novo elemento de áudio
            const audioElement = new Audio();
            
            // Definir a fonte do áudio como a transmissão do microfone
            audioElement.srcObject = audioStream;

            // Reproduzir o áudio
            audioElement.play();
        }
    }
});
/////////////////////////////////////////////////////////////////////////////////


document.addEventListener('DOMContentLoaded', function() {
    let audioStream;
    let audioContext;
    let audioDestination;

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
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

            // Adicione aqui a lógica para o botão de mutar/desmutar, se necessário
        })
        .catch(error => console.error('Erro ao acessar o microfone:', error));
});

///////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    let audioStream;
    let audioContext;
    let source;
    let audioElement = new Audio();

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

                    // Se o microfone foi ligado, iniciar a reprodução do áudio
                    if (!audioElement.srcObject) {
                        audioElement.srcObject = audioStream;
                        audioElement.play();
                    }
                } else {
                    toggleButton.innerText = 'MIC OFF';
                    audioIcon.classList.remove('fa-volume-up');
                    audioIcon.classList.add('fa-volume-off');

                    // Se o microfone foi desligado, parar a reprodução do áudio
                    if (audioElement.srcObject) {
                        audioElement.pause();
                        audioElement.srcObject = null;
                    }
                }
            }
        }
    }

    navigator.mediaDevices.getUserMedia({ audio: true})
        .then(stream => {
            stream.getAudioTracks().forEach(track => {
                track.enabled = false;
            });

            audioStream = stream;
            toggleButton.disabled = false;

            audioContext = new AudioContext();
            source = audioContext.createMediaStreamSource(stream);
            source.connect(audioContext.destination);
        })
        .catch(error => console.error('Erro ao acessar o microfone:', error));
});
