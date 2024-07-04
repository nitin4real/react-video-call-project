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
    const latestWords = userData.transcript.at(-1)
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


    return <div className="video-component" style={{ backgroundColor: isSpeaking ? '#4caf50' : 'white' }}>
        {isVideoDisabled
            ? <div className="video-alt-container">
                <img src={dummyUser} alt={String(username)} />
            </div>
            :
            <video style={{ maxHeight: 500, objectFit: 'contain' }} ref={videoRef} autoPlay />
        }
        <p>{latestWords}</p>
        <p>{fullUserName}</p>
    </div>;
};
