import AgoraRTC from "agora-rtc-sdk-ng"

const APP_ID = "f4ddb18335fb41e5a06d3f86f686060b";
const TOKEN = "84b6ef731de847b7b626bb26725e94a9";

const agoraRTCManager = async (eventsCallback) => {
    let agoraEngine = null;
    const setupAgoraEngine = () => {
        agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });
    };

    setupAgoraEngine();

    const getAgoraEngine = () => {
        return agoraEngine;
    };

    agoraEngine.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event.
        await agoraEngine.subscribe(user, mediaType);
        console.log("subscribe success");
        eventsCallback("user-published", user, mediaType)
    });

    // Listen for the "user-unpublished" event.
    agoraEngine.on("user-unpublished", (user) => {
        console.log(user.uid + "has left the channel");
    });

    const join = async (channelName, channelParameters) => {
        await agoraEngine.join(
            APP_ID,
            channelName,
            TOKEN
        )

        channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        await getAgoraEngine.publish([
            channelParameters.localAudioTrack
        ]);
    }

    const leave = async (channelParameters) => {
        // Destroy the local audio and video tracks.
        channelParameters.localAudioTrack.stop();
        channelParameters.localAudioTrack.close();
        // Remove the containers you created for the local video and remote video.
        await agoraEngine.leave();
    };

    return {
        getAgoraEngine,
        join,
        leave
    };
};

export default agoraRTCManager();