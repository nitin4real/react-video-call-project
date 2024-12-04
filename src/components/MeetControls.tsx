import { useState } from "react";
import videoOn from '../images/videoon.png'
import videoOff from '../images/videooff.png'
import mute from '../images/mute.png'
import unmute from '../images/record.png'
import recActive from '../images/rec_active.png'
import recDeactive from '../images/rec_deactive.png'
import { InfoComponent } from "./Info";
import { AdvSettingComponent } from "./AdvSettingComponent";
import { IPopupItem, TranslationConfigs } from "../interface/interfaces";
import { RecordingServices } from "../services/recordingServices";
import { userDataStore } from "../store/UserDataStore";
export enum RecorderStatus {
    STARTED = 'STARTED',
    STOPPED = 'STOPPED',
    ALREADY_RECORDING = 'ALREADY RECORDING',
    ERROR = 'ERROR'
}

const RecordMeetingComponent = ({
    isRecording,
    addPopup
}: {
    isRecording: boolean, 
    addPopup: (popup: IPopupItem) => void
}) => {
    return (
        <button onClick={() => {
            if (!isRecording) {
                addPopup({
                    id: -1,
                    title: 'Recording',
                    description: 'Hold on, Starting Recording...'
                })
                RecordingServices.startRecording(userDataStore.channelName).then((status: RecorderStatus) => {
                    if (status === RecorderStatus.ERROR) {
                        addPopup({
                            id: -1,
                            title: 'Recording',
                            description: 'Error in Start Recording'
                        })
                    }
                })
            } else {
                addPopup({
                    id: -1,
                    title: 'Recording',
                    description: 'Hold on, Stopping Recording...'
                })
                RecordingServices.stopRecording(userDataStore.channelName).then((status: RecorderStatus) => {
                    if (status === RecorderStatus.ERROR) {
                        addPopup({
                            id: -1,
                            title: 'Recording',
                            description: 'Error in Stop Recording'
                        })
                    }
                })
            }
        }} className="round-btn">
            <img height={30} width={30} src={isRecording ? recActive : recDeactive} alt={`${isRecording ? 'recording' : 'record'}`} />
        </button>
    )
}

export const MeetControls = ({ setMeetStatus, setMode, mode, handleDisconnectClick, updateCurrentVolume, currentVolume, isRecording, addPopup }: {
    setMeetStatus: (type: 'audio' | 'video', value: boolean) => void,
    setMode: (mode: 'spotlight' | 'grid') => void,
    mode: 'spotlight' | 'grid',
    handleDisconnectClick: () => void,
    updateCurrentVolume: (config: TranslationConfigs) => void,
    currentVolume: React.MutableRefObject<TranslationConfigs>,
    isRecording: boolean,
    addPopup: (popup: IPopupItem) => void
}) => {
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
            {/* <InfoComponent /> */}
            <RecordMeetingComponent addPopup={addPopup} isRecording={isRecording}/>
            <AdvSettingComponent
                currentVolume={currentVolume}
                setAudioVolume={updateCurrentVolume} />
            {/* <button onClick={handleStateClick}>Change View to {mode === 'grid' ? 'spotlight' : 'grid'}</button> */}
            <button className="leave-btn" onClick={handleDisconnectClick}>
                Leave
            </button>
        </div>

    </div>;
};
