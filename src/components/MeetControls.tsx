import { useState } from "react";
import videoOn from '../images/videoon.png'
import videoOff from '../images/videooff.png'
import mute from '../images/mute.png'
import unmute from '../images/record.png'
import { InfoComponent } from "./Info";

export const MeetControls = ({ setMeetStatus, setMode, mode, handleDisconnectClick }: any) => {
    const [audio, setAudio] = useState<'on' | 'off'>('on');
    const [video, setVideo] = useState<'on' | 'off'>('on');

    const micImage = audio === 'on' ? unmute : mute
    const camaraImage = video === 'on' ? videoOn : videoOff
    const isVideoOn = video === 'on' ? true : false

    const handleAudioClick = () => {
        if (audio === 'off') {
            setAudio('on');
            setMeetStatus('audio', true);
        } else {
            setAudio('off');
            setMeetStatus('audio', false);
        }
    };

    const handleVideoClick = () => {
        if (video === 'off') {
            setVideo('on');
            setMeetStatus('video', true);
        } else {
            setVideo('off');
            setMeetStatus('video', false);
        }
    };

    const handleStateClick = () => {
        if (mode === 'grid') {
            setMode('spotlight');
        } else {
            setMode('grid');
        }
    };


    return <div className="control-buttons-wrapper">
        <div className="control-buttons-container">
            <button onClick={handleAudioClick} className="round-btn">
                <img height={30} width={30} src={micImage} alt="Audio" />
            </button>
            <button onClick={handleVideoClick} className="round-btn">
                <img height={isVideoOn ? 40 : 30} width={isVideoOn ? 40 : 30} src={camaraImage} alt="Video" />
            </button>
            <InfoComponent />
            {/* <button onClick={handleStateClick}>Change View to {mode === 'grid' ? 'spotlight' : 'grid'}</button> */}
            <button className="leave-btn" onClick={handleDisconnectClick}>
                Leave
            </button>
        </div>

    </div>;
};
