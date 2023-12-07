let mediaRecorder;
let recordedBlobs;

const startRecording = () => {
    if(!stream){   //You can use  Media Stream
        alert("No current feed");
        return
    }
    console.log("Start Recording")
    recordedBlobs = [];  // an array to hold the blobs for playback
    mediaRecorder = new MediaRecorder(stream) //make a mediaRecorder from the constructor
    mediaRecorder.ondataavailable = e=> {
        //ondataavailable will run the strem ends, or stopped, or we specifically ask for it
        console.log("Data is avaible for the media recorder")
        recordedBlobs.push(e.data)
    
    }
    mediaRecorder.start();
    changeButtons([
        'green', 'green', 'blue', 'blue', 'green', 'blue', 'grey', 'blue'
    ])
}


const stopRecording = () => {
    if(!mediaRecorder){
        alert("Please record before stopping!")
        return
    }
    console.log("Stop Recording")
    mediaRecorder.stop();
    changeButtons([
        'green', 'green', 'blue', 'blue', 'green', 'green', 'blue', 'blue'
    ])


}


const playRecording = () => {
    if(!recordedBlobs){
        alert("No recording saved")
        return
    }
    console.log("Play Recording")
    const superBuffer = new Blob(recordedBlobs) //superBuffer is a super buffer of our array of blobs
    const recordedVideoEl = document.querySelector('#other-video');
    recordedVideoEl.src = window.URL.createObjectURL(superBuffer);
    recordedVideoEl.controls = true;
    recordedVideoEl.play();
    changeButtons([
        'green', 'green', 'blue', 'blue', 'green', 'green', 'green', 'blue'
    ])

}
