


const shareScreen = async() =>{

    const options = {
        video: true,
        audio: false,
        surfaceSwitching: 'include', //Include/Exclude NOT TRUE OR FALSE
    }
    
    try{
        mediaStream = await navigator.mediaDevices.getDisplayMedia()        
    }catch(err){
        console.log(err)
    }


    //We dont Handle all button paths. To do so, you'd need to check the DOM or use a UI framework.
    changeButtons([
        'green', 'green', 'blue', 'blue', 'green', 'green', 'green', 'green'
    ])
}