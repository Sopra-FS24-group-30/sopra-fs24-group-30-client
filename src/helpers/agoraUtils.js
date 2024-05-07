import agoraManager from "./agoraManager";

let channelParameters = {
    // A variable to hold a local audio track.
    localAudioTrack: null,
    // A variable to hold a remote audio track.
    //TODO: change remote audiotrack to hold individual tracks with id as key => can access for volume control
    remoteAudioTrack: {},
};

const handleVSDKEvents = (eventName, ...args) => {
    let id = args[0].uid;
    switch (eventName) {
        case "user-published":
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            channelParameters.remoteAudioTrack[2] = args[0].audioTrack;
            // Play the remote audio track. No need to pass any DOM element.
            channelParameters.remoteAudioTrack[2].play();
            break;
    }
};

const { join, leave, getAgoraEngine} = await agoraManager(
    handleVSDKEvents
);

// Get an instance of the Agora Engine from the manager
const agoraEngine = await getAgoraEngine();

//TODO: change channelname for teamvoice
const joinVoice = async (channelName) => {
    let lobbyId = localStorage.getItem("gameId")
    // Join a channel.
    let name = lobbyId + channelName;
    try{
        await join(name, channelParameters);
    } catch (e){
        console.log("could not join the voice channel");
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
            console.log("hello");
            console.log(channelParameters.localAudioTrack);
            console.log("hello");

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
        console.log("could not leave the channel")
        console.log("due to error");
        console.log(e);
        console.log(localStorage.getItem("userId"))
    }

    console.log("You left the channel");
};




export {joinVoice, leaveVoice, adjustVolume, toggleChannel, setMuted};