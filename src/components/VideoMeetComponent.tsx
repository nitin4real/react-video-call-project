import { useState } from "react"
import { ErrorComponent } from "../components/ErrorComponent"
import Loader from "../components/Loader"
import { IUidPlayerMap, IVideoConnectionConfig } from "../interface/interfaces"
import { MeetControls } from "./MeetControls"
import { VideoTrackView } from "./VideoTrackView"
import { useVideoMeet } from "../hooks/useVideoMeet"
import { userDataStore } from "../store/UserDataStore"
import { TranscriptPanel } from "./TranscriptPanel"
import background1 from '../images/backgrounds/background1.jpg'
import background2 from '../images/backgrounds/background2.jpg'
import background3 from '../images/backgrounds/background3.jpg'
import background4 from '../images/backgrounds/background4.jpg'
import background5 from '../images/backgrounds/background5.jpg'
import { MeetHeader } from "./MeetHeader"
import { PopupView } from "./PopupView"
const backgroundImages = [background1, background2, background3, background4, background5]

export const VideoMeet = ({ config, onDisconnect }: { config: IVideoConnectionConfig, onDisconnect: () => void }) => {
    const { videoSetupState,
        setMeetStatus,
        currentSpeakerUid,
        uidPlayerMap,
        handleDisconnectClick,
        transcript,
        completeTranscript,
        updateCurrentVolume,
        currentVolume,
        isRecording,
        popups,
        closePopup,
        addPopup
    } = useVideoMeet(config, onDisconnect)
    const [mode, setMode] = useState<'spotlight' | 'grid'>('grid');
    const [showTranscript, setShowTranscript] = useState(false)
    if (videoSetupState === 'loading') {
        return <Loader />
    } else if (videoSetupState === 'error') {
        return <ErrorComponent message="Error In Loading Video Meet" />
    }
    const userId = Number(config.uid)
    const randomBg = userId % 5 + 1
    const imageIndex = randomBg >= 0 && randomBg < 5 ? randomBg : 0
    const randomBackground = backgroundImages[imageIndex]
    const backgroundStyle = {
        backgroundImage: `url(${randomBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
        color: 'red',
        borderRadius: '15px',
        margin: '5px',
    };

    const containerStyle = mode === 'grid' ? 'video-container-grid' : 'video-container'
    const reversedMessages = [...transcript].reverse()

    return (
        <>
            <div className="video-meet">
                <MeetHeader />
                <div className="background-image" style={backgroundStyle}>
                    <div className={'video-container-grid'}>
                        <PopupView popups={popups} closePopup={closePopup} />
                        <GridView uidPlayerMap={uidPlayerMap} currentSpeakerUid={currentSpeakerUid} />
                    </div>
                </div>
                <MeetControls
                    isRecording={isRecording}
                    setMeetStatus={setMeetStatus}
                    mode={mode}
                    currentVolume={currentVolume}
                    setMode={setMode}
                    addPopup={addPopup}
                    handleDisconnectClick={handleDisconnectClick}
                    updateCurrentVolume={updateCurrentVolume} />
            </div>
            <div className="transcript-pane">
                <TranscriptPanel transcript={transcript} currentUserId={String(config.uid)} completeTranscript={completeTranscript} />
            </div>
        </>

    );
};



const GridView = ({ uidPlayerMap, currentSpeakerUid }: { uidPlayerMap: IUidPlayerMap, currentSpeakerUid: Number }) => {
    return <>
        {uidPlayerMap.map((video, index) => {
            return String(video.uid).length === 4 ?
                <div key={index} className="grid-video">
                    <VideoTrackView isSpeaking={currentSpeakerUid == video.uid} key={index} userData={video} />
                </div>
                : <></>
        }
        )}
    </>
}

function BackgroundImageComponent() {
    const style = {
        backgroundImage: 'url("path/to/your-image.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
    };

    return <div style={style}>Your content here</div>;
}

export default BackgroundImageComponent;
