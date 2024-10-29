import { useState } from "react"
import { ErrorComponent } from "../components/ErrorComponent"
import Loader from "../components/Loader"
import { IUidPlayerMap, IVideoConnectionConfig } from "../interface/interfaces"
import { MeetControls } from "./MeetControls"
import { VideoTrackView } from "./VideoTrackView"
import { useVideoMeet } from "../hooks/useVideoMeet"
import { userDataStore } from "../store/UserDataStore"
import { TranscriptPanel } from "./TranscriptPanel"

export const VideoMeet = ({ config, onDisconnect }: { config: IVideoConnectionConfig, onDisconnect: () => void }) => {
    const { videoSetupState, setMeetStatus, currentSpeakerUid, uidPlayerMap, handleDisconnectClick, transcript, completeTranscript } = useVideoMeet(config, onDisconnect)
    const [mode, setMode] = useState<'spotlight' | 'grid'>('grid');
    const [showTranscript, setShowTranscript] = useState(false)
    if (videoSetupState === 'loading') {
        return <Loader />
    } else if (videoSetupState === 'error') {
        return <ErrorComponent message="Error In Loading Video Meet" />
    }
    const containerStyle = mode === 'grid' ? 'video-container-grid' : 'video-container'
    const reversedMessages = [...transcript].reverse()
    return (
        <>
            <div className="video-meet">
                <div className={'video-container-grid'}>
                    <GridView uidPlayerMap={uidPlayerMap} currentSpeakerUid={currentSpeakerUid} />
                </div>
                <MeetControls setMeetStatus={setMeetStatus} mode={mode} setMode={setMode} handleDisconnectClick={handleDisconnectClick} />
            </div>
            <div className="transcript-pane">
                <TranscriptPanel transcript={transcript} currentUserId={String(config.uid)} completeTranscript={completeTranscript} />
            </div>
        </>

    );
};



const GridView = ({ uidPlayerMap, currentSpeakerUid }: { uidPlayerMap: IUidPlayerMap, currentSpeakerUid: Number }) => {

    return <>
        {uidPlayerMap.map((video, index) => (
            <div key={index} className="grid-video">
                <VideoTrackView isSpeaking={currentSpeakerUid == video.uid} key={index} userData={video} />
            </div>
        ))}
    </>
}
