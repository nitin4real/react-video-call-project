import { useEffect, useRef } from "react";

export const VideoTrackView = ({ track, username, isSpeaking }: any) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            track?.play(videoRef.current);
        }

        return () => {
            track?.stop();
        };
    }, [track]);

    return <div className="video-component" style={{ backgroundColor: isSpeaking ? '#4caf50' : 'white' }}>
        <video ref={videoRef} autoPlay />
        <p>{username}</p>
    </div>;
};
