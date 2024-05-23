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
        case "user-unpublished":
            if(channelParameters.remoteAudioTrack[id]){
                channelParameters.remoteAudioTrack[id].stop();
                delete channelParameters.remoteAudioTrack[id];
            }
            break;
        case "user-left":
            if(channelParameters.remoteAudioTrack[id]){
                channelParameters.remoteAudioTrack[id].stop();
                delete channelParameters.remoteAudioTrack[id];
            }
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
    if(inTeam){
        try{
            await joinVoice("main");
        }catch (error){
            //add logging here
        }

    }
    else if (team === "odd"){
        try{
            await joinVoice("odd");
        }catch (error){
            //add logging here
        }
    }
    else{
        try{
            await joinVoice("even");
        }catch (error){
            //add logging here
        }

    }
}

const adjustVolume = async (userId, newVolume) => {
    if(channelParameters.remoteAudioTrack[userId]){
        channelParameters.remoteAudioTrack[userId].setVolume(newVolume);
    }
}

const setMuted = (alreadyMuted) => {
    if(channelParameters.localAudioTrack){
        if(alreadyMuted){
            channelParameters.localAudioTrack.setEnabled(true);
        }else{
            channelParameters.localAudioTrack.setEnabled(false);
        }

    }
}

// Listen to the Leave button click event.
const leaveVoice = async () =>  {
    // Leave the channel
    try{
        await leave(channelParameters);
        for(let trackId in channelParameters.remoteAudioTrack){
            channelParameters.remoteAudioTrack[trackId].stop();
            delete channelParameters.remoteAudioTrack[trackId];
        }
    }catch(e){
        //could not leave channel
        setTimeout(() => leaveVoice(),5000);
    }

    console.log("You left the channel");
};

export {joinVoice, leaveVoice, adjustVolume, toggleChannel, setMuted};