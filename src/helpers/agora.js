import AgoraRTC from "agora-rtc-sdk-ng"
import config from "./config.json";
import { createClient } from "agora-rtc-sdk-ng/esm";

const APP_ID = "f4ddb18335fb41e5a06d3f86f686060b";
const TOKEN = "84b6ef731de847b7b626bb26725e94a9";
const RTC_UID = 1;
const ROOM_ID = "main";


let audioTracks = {
    localAudioTrack: null,
    remoteAudioTracks: {},
};

let rtcClient;

const initRtc = async () => {
    rtcClient = createClient({mode:"rtc",codec:"vp8"});

    await rtcClient.join(APP_ID,ROOM_ID,TOKEN,RTC_UID);

    audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await rtcClient.publish(audioTracks.localAudioTrack);

    rtcClient.on("user-joined",handleUserJoined);
    rtcClient.on("user-published",handleUserPublished);
    rtcClient.on("user-left",handleUserLeft);
}

const handleUserJoined = async (user) => {

}

const handleUserPublished = async (user, mediaType) => {
    await  rtcClient.subscribe(user, mediaType);

    if (mediaType === "audio"){
        audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack]
        user.audioTrack.play();
    }
}

const handleUserLeft = async (user) => {
    delete audioTracks.remoteAudioTracks[user.uid]
}


let joinVoice = document.getElementById("joinVoice");
const enterRoom = async(e) => {
    e.preventDefault();
    initRtc();
}
joinVoice.addEventListener("submit",enterRoom);

document.getElementById("leaveVoice").addEventListener("submit",leaveRoom);
let leaveRoom = async () => {
    audioTracks.localAudioTrack.stop()
    audioTracks.localAudioTrack.close()

    rtcClient.unpublish();
    rtcClient.leave();
}

