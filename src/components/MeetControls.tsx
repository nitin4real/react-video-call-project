import { useState } from "react";
import disconnectImg from '../images/phone.png'
import videoOn from '../images/videoon.png'
import videoOff from '../images/videooff.png'
import mute from '../images/mute.png'
import unmute from '../images/record.png'

export const MeetControls = ({ setMeetStatus, setMode, mode, handleDisconnectClick }: any) => {
    const [audio, setAudio] = useState<'on' | 'off'>('on');
    const [video, setVideo] = useState<'on' | 'off'>('on');

    const micImage = audio === 'on' ?  unmute : mute
    const camaraImage = video === 'on' ? videoOn : videoOff

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


    return <div className="control-buttons">
        <img height={30} width={30} src={micImage} alt="Audio" onClick={handleAudioClick}/>
        <img height={30} width={30} src={camaraImage} alt="Video" onClick={handleVideoClick} />
        <button onClick={handleStateClick}>Change View to {mode === 'grid' ? 'spotlight' : 'grid'}</button>
        <img height={30} width={30} src={disconnectImg} alt="Disconnect" onClick={handleDisconnectClick} />
    </div>;
};
