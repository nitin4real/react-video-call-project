import { useState } from "react"
import { ErrorComponent } from "../components/ErrorComponent"
import Loader from "../components/Loader"
import { IUidPlayerMap, IVideoConnectionConfig } from "../interface/interfaces"
import { MeetControls } from "./MeetControls"
import { VideoTrackView } from "./VideoTrackView"
import { useVideoMeet } from "../hooks/useVideoMeet"

export const VideoMeet = ({ config, onDisconnect }: { config: IVideoConnectionConfig, onDisconnect: () => void }) => {
    const { videoSetupState, setMeetStatus, currentSpeakerUid, uidPlayerMap, handleDisconnectClick } = useVideoMeet(config, onDisconnect)
    const [mode, setMode] = useState<'spotlight' | 'grid'>('grid');

    if (videoSetupState === 'loading') {
        return <Loader />
    } else if (videoSetupState === 'error') {
        return <ErrorComponent message="Error In Loading Video Meet" />
    }
    const containerStyle = mode === 'grid' ? 'video-container-grid' : 'video-container'
    return (
        <div className="video-meet">
            <MeetControls setMeetStatus={setMeetStatus} mode={mode} setMode={setMode} handleDisconnectClick={handleDisconnectClick} />
            <div className={`${containerStyle} ${mode}`}>
                {mode === 'spotlight'
                    ? <SpotlightView uidPlayerMap={uidPlayerMap} currentSpeakerUid={currentSpeakerUid} />
                    : <GridView uidPlayerMap={uidPlayerMap} currentSpeakerUid={currentSpeakerUid} />}
            </div>
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
                    <VideoTrackView isSpeaking={false} username={video.uid} key={index} track={video.videoTrack} />
                </div>
            )
            }
        </div>
        {spotlight ?
            <div key={currentSpeakerUid.toString()} className="spotlight">
                <VideoTrackView isSpeaking={true} username={currentSpeakerUid} key={currentSpeakerUid} track={spotlight.videoTrack} />
            </div> : <></>
        }
    </div>

}

const GridView = ({ uidPlayerMap, currentSpeakerUid }: { uidPlayerMap: IUidPlayerMap, currentSpeakerUid: Number }) => {
    return <>
        {uidPlayerMap.map((video, index) => (
            <div key={index} className="grid-video">
                <VideoTrackView isSpeaking={currentSpeakerUid == video.uid} username={video.uid} key={index} track={video.videoTrack} />
            </div>
        ))}
    </>
}
