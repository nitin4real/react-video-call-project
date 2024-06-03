import { useEffect, useRef } from "react";
import dummyUser from '../images/user5.png'
import { userDataStore } from "../store/UserDataStore";
export const VideoTrackView = ({ track, username, isSpeaking }: any) => {
    const videoRef = useRef(null);
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
                <img src={dummyUser} alt={username} />
            </div>
            :
            <video style={{ maxHeight: 500, objectFit: 'contain' }} ref={videoRef} autoPlay />
        }
        <p>{fullUserName}</p>
    </div>;
};
