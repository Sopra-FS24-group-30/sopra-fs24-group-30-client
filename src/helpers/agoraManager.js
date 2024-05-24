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
        try{
            await agoraEngine.subscribe(user, mediaType);
        }catch(error){
            //add logging for errors here
        }
                eventsCallback("user-published", user, mediaType)
    });

    // Listen for the "user-unpublished" event.
    agoraEngine.on("user-unpublished", async (user, mediaType) => {
        try{
            await agoraEngine.unsubscribe(user, mediaType);
        }catch (error){
            //add error logging here
        }

                eventsCallback("user-unpublished", user, mediaType)
    });

    agoraEngine.on("user-left", async (user) => {
                eventsCallback("user-left", user)
    })

    const join = async (channelName, channelParameters) => {
        let playerId = localStorage.getItem("playerId");
        let agoraUid = Number(localStorage.getItem("gameId") + playerId);
        try{
            await agoraEngine.join(
                APP_ID,
                channelName,
                TOKEN,
                agoraUid
            )
        }catch (error){
            //add logging for errors here
        }

        channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        try{
            await agoraEngine.publish([
                channelParameters.localAudioTrack
            ]);
        }catch(error){
            //add logging for errors here
        }
    }

    const leave = async (channelParameters) => {
        if(channelParameters.localAudioTrack){
            // Destroy the local audio and video tracks.
            channelParameters.localAudioTrack.close();
            delete channelParameters.localAudioTrack;
            // Remove the containers you created for the local video and remote video.
        }else{
                    }
        try{
            await agoraEngine.leave();
        }catch (error){
            //add error logging here
        }

    };

    return {
        getAgoraEngine,
        join,
        leave
    };
};

export default agoraRTCManager;