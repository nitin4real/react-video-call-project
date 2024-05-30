import AgoraRTC, { IAgoraRTCRemoteUser, IDataChannelConfig, ILocalTrack } from "agora-rtc-react"
import { useEffect, useRef, useState } from "react"
import { ErrorComponent } from "../components/ErrorComponent"
import Loader from "../components/Loader"
import { videoController } from "../controllers/videoController"
import { IMediaType, IVideoConnectionConfig, IVideoMeetListeners, SetupState } from "../interface/interfaces"

interface IVideoMeetElement {
    user: IAgoraRTCRemoteUser
    element: ILocalTrack
}

const useVideoMeet = (config: IVideoConnectionConfig) => {
    const [videoSetupState, setVideoSetupState] = useState<SetupState>('loading');
    const [videoElementList, setVideoElementList] = useState<IVideoMeetElement[]>([])

    const listeners: IVideoMeetListeners = {
        onUserJoined: (user: IAgoraRTCRemoteUser): void => {
            console.log('onUserJoined', user)
        },
        onUserLeft: (user: IAgoraRTCRemoteUser, reason: string): void => {
            console.log('onUserLeft', user)
        },
        onUserPublished: (user: IAgoraRTCRemoteUser, mediaType: IMediaType, config?: IDataChannelConfig | undefined): void => {
            videoController.subscribeToRemoteUser(user, mediaType)
            if (mediaType === 'video') {
                const videoElement = {
                    user,
                    element: user.videoTrack
                }
                setVideoElementList([...videoElementList,])

            }
            console.log('onUserPublished', user)
        },
        onUserUnpublished: (user: IAgoraRTCRemoteUser, mediaType: IMediaType, config?: IDataChannelConfig | undefined): void => {
            console.log('onUserUnpublished', user)
        }
    }

    const onCompleteCallback = (status: SetupState) => {
        setVideoSetupState(status)
    }

    useEffect(() => {
        if (videoSetupState === 'loading')
            videoController.setupVideoWithToken(config, listeners, onCompleteCallback)
        else if (videoSetupState === 'success') {
            AgoraRTC.createCameraVideoTrack().then(
                (track) => {
                    const emptyUser: any = null

                    const videlElement: IVideoMeetElement = {
                        element: track,
                        user: emptyUser
                    }
                    setVideoElementList([...videoElementList, videlElement])
                    videoController.publishFeed(track)
                }
            ).catch(e => console.log('errrr'))
            //add self
            //here run a async function, pass it a video element ask, for permissions and all add that video element here only in next line
            // videoController.publishFeed()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoSetupState])

    return {
        videoSetupState,
        videoElementList
    }
}

export const MeetVideoComponent = ({
    config
}: {
    config: IVideoConnectionConfig
}) => {
    //start video service show loader for the process duration
    const { videoSetupState, videoElementList } = useVideoMeet(config)
    if (videoSetupState === 'loading') {
        return <Loader />
    } else if (videoSetupState === 'error') {
        return <ErrorComponent message="Error In Loading Video Meet" />
    }
    return <>
        {
            videoElementList.map((item) => {
                return <VideoTrackView track={item.element} />
            })
        }
    </>
}


const VideoTrackView = ({ track }: any) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            track.play(videoRef.current);
        }

        return () => {
            track.stop();
        };
    }, [track]);

    return <video ref={videoRef} autoPlay />;
};
