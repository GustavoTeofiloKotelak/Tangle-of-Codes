const videoEl = document.querySelector('#my-video');

let stream = null //Inicia a variavel stream que pode ser usada em qualquer lugar
let mediaStream = null //Init mediaStream var for screenShare
const constraints = {
    audio: true, 
    video: true,
}

const getMicAndCamera = async(e) => {
    try{
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        getDevices();
        console.log(stream)
        changeButtons([
            'green', 'blue', 'blue', 'grey', 'grey', 'grey', 'grey', 'grey'
        ])
    }catch(err){
        //user denied access to constrains
        console.log("user denied access to constraints")
        console.log(err)
    }

};

const showMyFeed = e=>{
    console.log("Working")
    if(!stream){
        alert("stream still Loading...")
        return;
    }
    videoEl.srcObject = stream; //this will set our MediaStream to our < video />
     const tracks = stream.getTracks();
     console.log(tracks);
     changeButtons([
        'green', 'green', 'blue', 'blue', 'blue', 'grey', 'grey', 'blue'
    ])
}
const stopMyFeed = e=>{
    if(!stream){
        alert("stream still Loading...")
        return;
    }
    const tracks = stream.getTracks();
    tracks.forEach(track=> {
        // console.log(track)
        track.stop(); //Disassociates the track with the source
    });
    changeButtons([
        'blue', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey'
    ])
}

document.querySelector('#share').addEventListener('click',e=>getMicAndCamera(e))
document.querySelector('#show-video').addEventListener('click',e=>showMyFeed(e))
document.querySelector('#stop-video').addEventListener('click',e=>stopMyFeed(e))
document.querySelector('#change-size').addEventListener('click',e=>changeVideoSize(e))
document.querySelector('#start-record').addEventListener('click',e=>startRecording(e))
document.querySelector('#stop-record').addEventListener('click',e=>stopRecording(e))
document.querySelector('#play-record').addEventListener('click',e=>playRecording(e))
document.querySelector('#share-screen').addEventListener('click',e=>shareScreen(e))

document.querySelector('#audio-input').addEventListener('change', e=>changeAudioInput(e))
document.querySelector('#audio-output').addEventListener('change', e=>changeAudioOutput(e))
document.querySelector('#video-input').addEventListener('change', e=>changeVideo(e))

