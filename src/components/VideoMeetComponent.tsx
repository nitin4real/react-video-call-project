import { useState } from "react"
import { ErrorComponent } from "../components/ErrorComponent"
import Loader from "../components/Loader"
import { IUidPlayerMap, IVideoConnectionConfig } from "../interface/interfaces"
import { MeetControls } from "./MeetControls"
import { VideoTrackView } from "./VideoTrackView"
import { useVideoMeet } from "../hooks/useVideoMeet"
import { userDataStore } from "../store/UserDataStore"

export const VideoMeet = ({ config, onDisconnect }: { config: IVideoConnectionConfig, onDisconnect: () => void }) => {
    const { videoSetupState, setMeetStatus, currentSpeakerUid, uidPlayerMap, handleDisconnectClick, transcript } = useVideoMeet(config, onDisconnect)
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
        <div className="video-meet">
            <MeetControls setMeetStatus={setMeetStatus} mode={mode} setMode={setMode} handleDisconnectClick={handleDisconnectClick} />
            <div className={`${containerStyle} ${mode}`}>
                {mode === 'spotlight'
                    ? <SpotlightView uidPlayerMap={uidPlayerMap} currentSpeakerUid={currentSpeakerUid} />
                    : <GridView uidPlayerMap={uidPlayerMap} currentSpeakerUid={currentSpeakerUid} />}
            </div>
            <button onClick={() => setShowTranscript(st => !st)}>{showTranscript ? 'Hide' : 'Show'} Transcript</button>

            {showTranscript ? <div className="transcript-container">
                {reversedMessages.map((message) => {
                    const fullUserName = userDataStore.getUserName(String(message.uid))
                    return <div key={`${message.uid}-${message.timestamp}`} className="transcript-message">
                        <span className="transcript-message-user">
                            {`${fullUserName}:`}
                        </span>
                        <span className="transcript-message-text">
                            {message.text}
                        </span>
                    </div>
                })}
            </div> :
                <></>
            }
        </div>
    );
};


const SpotlightView = ({ uidPlayerMap, currentSpeakerUid }: { uidPlayerMap: IUidPlayerMap, currentSpeakerUid: Number }) => {

    const sideViewItems = uidPlayerMap.filter((viewItem) => {
        return viewItem.uid !== currentSpeakerUid
    })

    const spotlight = uidPlayerMap.find((viewItem) => {
        return viewItem.uid == currentSpeakerUid
    })
    return <div style={{}}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            {sideViewItems.map((video, index) =>
                <div key={index} className="side-video">
                    <VideoTrackView isSpeaking={false} key={index} userData={video} />
                </div>
            )
            }
        </div>
        {spotlight ?
            <div key={currentSpeakerUid.toString()} className="spotlight">
                <VideoTrackView isSpeaking={true} key={String(currentSpeakerUid)} userData={spotlight} />
            </div> : <></>
        }
    </div>

}

const GridView = ({ uidPlayerMap, currentSpeakerUid }: { uidPlayerMap: IUidPlayerMap, currentSpeakerUid: Number }) => {

    return <>
        {uidPlayerMap.map((video, index) => (
            <div key={index} className="grid-video">
                <VideoTrackView isSpeaking={currentSpeakerUid == video.uid} key={index} userData={video} />
            </div>
        ))}
    </>
}
