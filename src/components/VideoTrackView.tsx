import { useEffect, useRef } from "react";
import dummyUser from '../images/user5.png'
import { userDataStore } from "../store/UserDataStore";
import { IUidPlayerMapItem } from "../interface/interfaces";

type VideoTrackProps = {
    userData: IUidPlayerMapItem
    isSpeaking: boolean
}

export const VideoTrackView = ({ userData, isSpeaking }: VideoTrackProps) => {
    const videoRef = useRef(null);
    const username = userData.uid
    const track = userData.videoTrack
    const audioTrack = userData.audioTrack
    const latestWords1 = userData.transcript.at(-1)
    // const latestWords0 = userData.transcript.at(-2)
    const isVideoDisabled = !track
    const fullUserName = userDataStore.getUserName(String(username))

    useEffect(() => {
        if (videoRef.current) {
            track?.play(videoRef.current);
        }

        return () => {
            track?.stop();
        };
    }, [track]);

    return <div className="video-component" style={{ backgroundColor: isSpeaking ? '#8ddbff' : 'white' }}>
        {/* <button onClick={() => {audioTrack?.setVolume(0)}}>Mute</button>
        <button onClick={() => {audioTrack?.setVolume(100)}}>Unmute</button> */}
        {isVideoDisabled
            ? <div className="video-alt-container">
                <img src={dummyUser} alt={String(username)} />
            </div>
            :
            <video style={{ maxHeight: 500, objectFit: 'contain' }} ref={videoRef} autoPlay />
        }
        {/* {latestWords0 ? <div className="transcript-subtitle">{latestWords0}</div> : <></>} */}
        {latestWords1 ? <div className="transcript-subtitle">{latestWords1}</div> : <></>}
        <p>{fullUserName} - {String(username)}</p>
    </div>;
};
