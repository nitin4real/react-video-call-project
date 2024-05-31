import AgoraRTC, { IAgoraRTCRemoteUser, IDataChannelConfig, ILocalTrack, UID } from "agora-rtc-react"
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
    const [selfVideo, setSelfVideo] = useState<ILocalTrack>()
    const [selfAudio, setSelfAudio] = useState<ILocalTrack>()

    const addVideoStream = (newVideo: IVideoMeetElement) => {
        //add checks for multiple users with same id, ignore em
        setVideoElementList((currentVideoList) => {
            if (currentVideoList.find((videlElement) => {
                return videlElement.user.uid === newVideo.user.uid
            })) {
                return currentVideoList
            }

            return [...currentVideoList, newVideo]
        })
    }

    const removeVideoStream = (uid: UID) => {
        setVideoElementList((currentVideoList) => {
            return currentVideoList.filter((videoElement) => {
                if (uid === videoElement.user.uid) return false
                return true
            })
        })
    }

    const listenersRef = useRef<IVideoMeetListeners>({
        onUserJoined: (user: IAgoraRTCRemoteUser): void => {
            console.log('onUserJoined', user)
        },
        onUserLeft: (user: IAgoraRTCRemoteUser, reason: string): void => {
            console.log('onUserLeft', user)
        },
        onUserPublished: async (user: IAgoraRTCRemoteUser, mediaType: IMediaType, config?: IDataChannelConfig | undefined) => {
            await videoController.subscribeToRemoteUser(user, mediaType)
            if (mediaType === 'video') {
                const videoElement: IVideoMeetElement = {
                    user,
                    element: user.videoTrack as any
                }
                addVideoStream(videoElement)
            } else if (mediaType === 'audio') {
                user.audioTrack?.play()
            }
            console.log('onUserPublished', user)
        },
        onUserUnpublished: (user: IAgoraRTCRemoteUser, mediaType: IMediaType, config?: IDataChannelConfig | undefined): void => {
            if (mediaType === 'video') {
                removeVideoStream(user.uid)
            }
        }
    })

    const onCompleteCallback = (status: SetupState) => {
        setVideoSetupState(status)
    }
    // videoController.setMuteStatus(false,)

    useEffect(() => {
        if (videoSetupState === 'loading')
            videoController.setupVideoWithToken(config, listenersRef.current, onCompleteCallback)
        else if (videoSetupState === 'success') {
            AgoraRTC.createCameraVideoTrack().then(
                (track) => {
                    const emptyUser: any = { uid: 'self' }

                    const videlElement: IVideoMeetElement = {
                        element: track,
                        user: emptyUser
                    }
                    addVideoStream(videlElement)
                    setSelfVideo(track)
                    setVideoStatus(false)
                }
            ).catch(e => console.log('errrr'))

            AgoraRTC.createMicrophoneAudioTrack().then(
                (track) => {
                    setSelfAudio(track)
                    setAudioStatus(false)
                }
            ).catch(e => console.log('errrr'))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoSetupState])

    const setAudioStatus = (state: boolean) => {
        if (selfAudio) {
            videoController.setMuteStatus(state, selfAudio)
        }
    }

    const setVideoStatus = (state: boolean) => {
        if (selfVideo) {
            videoController.setCamaraStatus(state, selfVideo)
        }
    }

    const setMeetStatus = (mediaType: IMediaType, status: boolean) => {
        if (mediaType === 'audio') {
            setAudioStatus(status)
        } else if (mediaType === 'video') {
            setVideoStatus(status)
        }
    }

    return {
        videoSetupState,
        videoElementList,
        setMeetStatus,
    }
}

export const MeetVideoComponent = ({
    config
}: {
    config: IVideoConnectionConfig
}) => {
    //start video service show loader for the process duration
    const { videoSetupState, videoElementList, setMeetStatus } = useVideoMeet(config)
    if (videoSetupState === 'loading') {
        return <Loader />
    } else if (videoSetupState === 'error') {
        return <ErrorComponent message="Error In Loading Video Meet" />
    }
    return <>
        {
            videoElementList.map((item, index) => {
                return <VideoTrackView key={index} track={item.element} username={item.user?.uid} />
            })
        }
        <VideoControls setMeetStatus={setMeetStatus} />
    </>
}


const VideoTrackView = ({ track, username }: any) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            track.play(videoRef.current);
        }

        return () => {
            track.stop();
        };
    }, [track]);

    return <div style={{ borderWidth: 2, borderColor: 'red', borderStyle: 'dashed' }}>
        <div>{username}</div>
        <video ref={videoRef} autoPlay />;
    </div>
};

const VideoControls = ({ setMeetStatus }: { setMeetStatus: (mediaType: IMediaType, status: boolean) => void }) => {
    const [audioMuted, setAudioMuted] = useState(true);
    const [videoMuted, setVideoMuted] = useState(true);

    // const setMeetStatus = (mediaType: IMediaType, status: boolean) => {
    //     if (mediaType === 'audio') {
    //         setAudioStatus(status)
    //     } else if (mediaType === 'video') {
    //         setVideoStatus(status)
    //     }
    // }
    const toggleAudio = () => {
        setMeetStatus('audio', audioMuted)
        setAudioMuted(!audioMuted)
    };

    const toggleVideo = () => {
        setMeetStatus('video', videoMuted)
        setVideoMuted(!videoMuted);
    };

    useEffect(() => {
        // This is just to reflect initial state

    }, []);

    return (
        <div>
            <button onClick={toggleAudio}>
                {audioMuted ? 'Unmute Audio' : 'Mute Audio'}
            </button>
            <button onClick={toggleVideo}>
                {videoMuted ? 'Turn Video On' : 'Turn Video Off'}
            </button>
        </div>
    );
};
