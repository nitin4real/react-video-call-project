import { useEffect, useRef } from "react";
import dummyUser from '../images/user5.png'
export const VideoTrackView = ({ track, username, isSpeaking }: any) => {
    const videoRef = useRef(null);
    const isVideoDisabled = !track
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
            ? <img src={dummyUser} alt={username} />
            :
            <video ref={videoRef} autoPlay />
        }
        <p>{username}</p>
    </div>;
};
