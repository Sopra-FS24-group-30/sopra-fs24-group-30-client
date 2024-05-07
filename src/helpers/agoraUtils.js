import agoraManager from "./agoraManager";

let channelParameters = {
    // A variable to hold a local audio track.
    localAudioTrack: null,
    // A variable to hold a remote audio track.
    remoteAudioTrack: {}
};

const handleVSDKEvents = (eventName, ...args) => {
    let id = args[0].uid;
    switch (eventName) {
        case "user-published":
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            channelParameters.remoteAudioTrack[id] = args[0].audioTrack;
            // Play the remote audio track. No need to pass any DOM element.
            channelParameters.remoteAudioTrack[id].play();
            break;
    }
};

const { join, leave, getAgoraEngine} = await agoraManager(
    handleVSDKEvents
);

// Get an instance of the Agora Engine from the manager
const agoraEngine = await getAgoraEngine();

const joinVoice = async (channelName) => {
    let lobbyId = localStorage.getItem("gameId")
    // Join a channel.
    let name = lobbyId + channelName;
    try{
        await join(name, channelParameters);
    } catch (e){

    }
    console.log("publish success!");
};

const toggleChannel = async (inTeam, team) => {
    await leaveVoice();
    console.log("successfully left voice");
    if(inTeam){
        await joinVoice("main");
    }
    else if (team === "odd"){
        await joinVoice("odd");
    }else{
        await joinVoice("even");
    }
}

const adjustVolume = async (userId, newVolume) => {
    channelParameters.remoteAudioTrack[userId].setVolume(newVolume);
}

const setMuted = (muted) => {
    if(channelParameters.localAudioTrack){
        if(muted){
            channelParameters.localAudioTrack.setEnabled(false);

        }else{
            channelParameters.localAudioTrack.setEnabled(true);
        }

    }
}

// Listen to the Leave button click event.
const leaveVoice = async () =>  {
    // Leave the channel
    try{
        await leave(channelParameters);
    }catch(e){
        //could not leave channel
        setTimeout(() => leaveVoice(),5000);
    }

    console.log("You left the channel");
};




export {joinVoice, leaveVoice, adjustVolume, toggleChannel, setMuted};