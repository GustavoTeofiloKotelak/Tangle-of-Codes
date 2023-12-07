let APP_ID =  'ef850cf050c8474e8c05accb3330148f'

let peerConnention
let localStream;
let remoteStream;

let uid = String(Math.floor(Math.random() * 10000))
let token = null;
let client;


let servers = {
    iceServers:[
        {
            urls:['stun:stun1.1.google.com.193021','stun:stun2.1.google.com.193021']
        }
    ]
}

let init = async () => {
    client = await AgoraRTM.createInstance(APP_ID)
    await client.login({uid, token})

    const channel = client.createChannel('main')
    channel.join()

    channel.on('MemberJoined', handlePeerJoined)
    client.on('MessageFromPeer', handleMessageFromPeer)

    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    document.getElementById('user-1').srcObject = localStream
}

let handlePeerJoined = async (MemberId) => {
    console.log('A new peer has joined this room', MemberId)

    createOffer(MemberId)

}

let handleMessageFromPeer = async (message, MemberId) => {
    message = JSON.parse(message.text)
    console.log('Message:', message)

    if(message.type === 'offer'){
        if(!localStream){
            localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
            document.getElementById('user-1').srcObject = localStrea
        }

        document.getElementById('offer-sdp').value = JSON.stringify(message.offer)
        createAnswer(MemberId)
    }

    if(message.type === 'answer'){
        document.getElementById('answer-sdp').value = JSON.stringify(message.answer)
        addAnswer()
    }

    if(message.type === 'candidate'){
        if(peerConnention){
            peerConnention.addIceCandidate(message.candidate)
        }
    }

}

let createPeerConnection = async (sdpType, MemberId) => {
    peerConnention = new RTCPeerConnection(servers)

    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = remoteStream

    localStream.getTracks().forEach((track) => {
        peerConnention.addTrack(track, localStream)
    })

    peerConnention.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }

    peerConnention.onicecandidate = async (event) => {
        if (event.candidate){
            document.getElementById(sdpType).value = JSON.stringify(peerConnention.localDescription)
            client.sendMessageToPeer({text:JSON.stringify({'type':'candidate', 'candidate': event.candidate})}, MemberId)
        }
    }

}

let createOffer = async (MemberId) => {
    createPeerConnection('offer-sdp', MemberId)

    let offer = await peerConnention.createOffer()
    await peerConnention.setLocalDescription(offer)

    document.getElementById('offer-sdp').value = JSON.stringify(offer)
    client.sendMessageToPeer({text:JSON.stringify({'type':'offer', 'offer': offer})}, MemberId)
}

let createAnswer = async (MemberId) => {
    createPeerConnection('answer-sdp', MemberId)
    let offer = document.getElementById('offer-sdp').value
    if(!offer) return alert('Masqueico, Retrieve offer from peer first...')

    offer = JSON.parse(offer)
    await peerConnention.setRemoteDescription(offer)

    let answer = await peerConnention.createAnswer()
    await peerConnention.setLocalDescription(answer)

    document.getElementById('answer-sdp').value = JSON.stringify(answer)
    client.sendMessageToPeer({text:JSON.stringify({'type':'answer', 'answer': answer})}, MemberId)


}

let addAnswer = async () => {
    let answer = document.getElementById('answer-sdp').value
    if(!answer) return alert('Masqueico, Retrieve answer from peer first...')

    answer = JSON.parse(answer)

    if(!peerConnention.currentRemoteDescription){
        peerConnention.setRemoteDescription(answer)
    }
}

init()

// document.getElementById('create-offer').addEventListener('click', createOffer)
// document.getElementById('create-answer').addEventListener('click', createAnswer)
// document.getElementById('add-answer').addEventListener('click', addAnswer)

//https://www.youtube.com/watch?v=8I2axE6j204