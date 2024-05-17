import AgoraRTC from "agora-rtc-sdk-ng"

const APP_ID = "0ca21cacdc1141198e7b58f13c4fa147";
const TOKEN = null;

const agoraRTCManager = async (eventsCallback) => {
    let agoraEngine = null;
    const setupAgoraEngine = () => {
        agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });
    };

    await setupAgoraEngine();

    const getAgoraEngine = async () => {
        return agoraEngine;
    };

    agoraEngine.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event.
        await agoraEngine.subscribe(user, mediaType);
        console.log("subscribe success");
        eventsCallback("user-published", user, mediaType)
    });

    // Listen for the "user-unpublished" event.
    agoraEngine.on("user-unpublished", async (user, mediaType) => {
        await agoraEngine.unsubscribe(user, mediaType);
        console.log(user.uid + "has left the channel");
        eventsCallback("user-unpublished", user, mediaType)
    });

    agoraEngine.on("user-left", async (user) => {
        console.log(user.uid + "has left the channel");
        eventsCallback("user-left", user)
    })

    const join = async (channelName, channelParameters) => {
        let playerId = localStorage.getItem("playerId");
        let agoraUid = Number(localStorage.getItem("gameId") + playerId);
        await agoraEngine.join(
            APP_ID,
            channelName,
            TOKEN,
            agoraUid
        )

        channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        await agoraEngine.publish([
            channelParameters.localAudioTrack
        ]);
    }

    const leave = async (channelParameters) => {
        if(channelParameters.localAudioTrack){
            // Destroy the local audio and video tracks.
            channelParameters.localAudioTrack.close();
            // Remove the containers you created for the local video and remote video.
        }else{
            console.log("already out of channel")
        }
        await agoraEngine.leave();
    };

    return {
        getAgoraEngine,
        join,
        leave
    };
};

export default agoraRTCManager;