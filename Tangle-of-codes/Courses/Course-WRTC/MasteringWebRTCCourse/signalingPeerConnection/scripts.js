const userName = "Teofilo-"+Math.floor(Math.random()*1000000)
const password = "x";
document.querySelector('#user-name').innerHTML = userName;

const socket = io.connect('https://localhost:8181/',{
    auth: {
        userName,password
    }
})

const localVideoEl = document.querySelector('#local-video');
const remoteVideoEl = document.querySelector('#remote-video'); 

let localStream; //a var to hold the local video stream
let remoteStream; //a var to hold the remote video stream
let peerConnection; //the peerConnection that the two clients use to talk
let didIOffer = false;


let peerConfiguration = {
    iceServers:[
        {
            urls:[
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302'
            ]
        }
    ]
}

//when a client initiates a call
const call = async e=> {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        //audio: true, 
    });
    localVideoEl.srcObject = stream;
    localStream = stream;

    //peerConnection is all set with our STUN servers sent over
    await createPeerConnection();

    //create offer Time
    try{
        console.log("Creating Offer")
        const offer = await peerConnection.createOffer();
        console.log(offer)
        peerConnection.setLocalDescription(offer);
        didIOffer = true;
        socket.emit('newOffer',offer); //send offer to signalingServer
    

    }catch(err){
        console.log(err)
    }


    console.log("Calling")
}


const createPeerConnection = () =>{
    return new Promise(async(resolve, reject)=>{
        //RTCPeerConection is the thing that crcleaeates the connection
        //we can pass a config object, and that config object can contain stun servers
        //which will fetch us ICE Candidates
        peerConnection = new RTCPeerConnection(peerConfiguration)

        localStream.getTracks().forEach(track=>{
            peerConnection.addTrack(track, localStream);
        })

        peerConnection.addEventListener('icecandidate', e=> {
            console.log('...... Ice Candidate Found!.....')
            console.log(e)
            if(e.candidate){
                socket.emit('sendIceCandidateToSignalingServer',{
                    iceCandidate: e.candidate,
                    iceUserName: userName,
                    didIOffer,
                
                })
            }
        })
        resolve();
    })
}



document.querySelector('#call').addEventListener('click', call)
