import AgoraRTC from "agora-rtc-sdk-ng"
import config from "./config.json";

const APP_ID = "f4ddb18335fb41e5a06d3f86f686060b";
const TOKEN = "84b6ef731de847b7b626bb26725e94a9";

let channelParameters = {
    // A variable to hold a local audio track.
    localAudioTrack: null,
    // A variable to hold a remote audio track.
    remoteAudioTrack: null,
    // A variable to hold the remote user id.s
    remoteUid: null,
};

const agoraRTCManager = async (eventsCallback) => {
    let agoraEngine = null;
    const setupAgoraEngine = () => {
        agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });
    };

    setupAgoraEngine();

    const getAgoraEngine = () => {
        return agoraEngine;
    };

    const join = async (channelname) => {
        await agoraEngine.join(
            APP_ID,
            channelname,
            TOKEN
        )

        channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        await getAgoraEngine.publish([
            channelParameters.localAudioTrack
        ]);
    }
};

