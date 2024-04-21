import agoraManager from "./agoraManager";

let channelParameters = {
    // A variable to hold a local audio track.
    localAudioTrack: null,
    // A variable to hold a remote audio track.
    remoteAudioTrack: null,
    // A variable to hold a remote video track.
    remoteUid: null,
};

const handleVSDKEvents = (eventName, ...args) => {
    switch (eventName) {
    case "user-published":
        // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
        channelParameters.remoteAudioTrack = args[0].audioTrack;
        // Play the remote audio track. No need to pass any DOM element.
        channelParameters.remoteAudioTrack.play();

    }
};

const { join, leave, getAgoraEngine} = await agoraManager(
    handleVSDKEvents
);

// Get an instance of the Agora Engine from the manager
const agoraEngine = await getAgoraEngine();

const joinVoice = async function () {
    // Join a channel.
    await join("main", channelParameters);
    console.log("publish success!");
};
// Listen to the Leave button click event.
const leaveVoice = async function () {
    // Leave the channel
    await leave(channelParameters);
    console.log("You left the channel");
    // Refresh the page for reuse
    window.location.reload();
};

const foo = async () => {}

export {foo, joinVoice, leaveVoice};