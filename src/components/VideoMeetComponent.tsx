import AgoraRTC, { IAgoraRTCRemoteUser, ICameraVideoTrack, IDataChannelConfig, ILocalTrack, UID } from "agora-rtc-react"
import { useEffect, useRef, useState } from "react"
import { ErrorComponent } from "../components/ErrorComponent"
import Loader from "../components/Loader"
import { videoController } from "../controllers/videoController"
import { IMediaType, IVideoConnectionConfig, IVideoMeetListeners, SetupState } from "../interface/interfaces"
import { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"

interface IVideoMeetElement {
    user: IAgoraRTCRemoteUser
    element: ILocalTrack
}
interface IUidPlayerMap {
    uid: Number,
    videoTrack: ICameraVideoTrack | undefined
    audioTrack: IMicrophoneAudioTrack | undefined
}

const useVideoMeet = (config: IVideoConnectionConfig) => {
    const [videoSetupState, setVideoSetupState] = useState<SetupState>('loading');
    const [currentSpeakerUid, setCurrentSpeakerUid] = useState<Number>(-1)
    const [uidPlayerMap, setUidPlayerMap] = useState<IUidPlayerMap[]>([])

    const pushInUidPlayerMap = (uid: Number) => {
        setUidPlayerMap((currentMap) => {
            return [
                ...currentMap,
                {
                    uid,
                    videoTrack: undefined,
                    audioTrack: undefined
                }
            ]
        })
    }

    const removeUserFromMap = (uid: Number) => {
        setUidPlayerMap((currentMap) => {
            return currentMap.filter((value) => {
                return value.uid != uid
            })
        })
    }

    const addVideoTrackToMap = (uid: Number, videoTrack: any) => {
        setUidPlayerMap((currentMap) => {
            return currentMap.map((singleMapping) => {
                if (singleMapping.uid == uid) {
                    return {
                        uid,
                        videoTrack,
                        audioTrack: singleMapping.audioTrack
                    }
                } else return singleMapping
            })
        })
    }

    const removeVideoTrackFromMap = (uid: Number) => {
        setUidPlayerMap((currentMap) => {
            return currentMap.map((singleMapping: any) => {
                if (singleMapping.uid == uid) {
                    singleMapping?.videoTrack?.close()
                    return {
                        uid,
                        videoTrack: undefined,
                        audioTrack: singleMapping.audioTrack
                    }
                } else return singleMapping
            })
        })
    }

    const addAudioTrackToMap = (uid: Number, audioTrack: any) => {
        setUidPlayerMap((currentMap) => {
            return currentMap.map((singleMapping) => {
                if (singleMapping.uid == uid) {
                    return {
                        uid,
                        videoTrack: singleMapping.videoTrack,
                        audioTrack
                    }
                } else return singleMapping
            })
        })
    }

    const removeAudioTrackFromMap = (uid: Number) => {
        setUidPlayerMap((currentMap) => {
            return currentMap.map((singleMapping) => {
                if (singleMapping.uid == uid) {
                    singleMapping?.audioTrack?.close()

                    return {
                        uid,
                        videoTrack: singleMapping.videoTrack,
                        audioTrack: undefined
                    }
                } else return singleMapping
            })
        })
    }


    const listenersRef = useRef<IVideoMeetListeners>({
        onUserJoined: (user: IAgoraRTCRemoteUser): void => {
            pushInUidPlayerMap(Number(user?.uid))
        },
        onUserLeft: (user: IAgoraRTCRemoteUser, reason: string): void => {
            removeUserFromMap(Number(user?.uid))
        },
        onUserPublished: async (user: IAgoraRTCRemoteUser, mediaType: IMediaType, config?: IDataChannelConfig | undefined) => {
            await videoController.subscribeToRemoteUser(user, mediaType)
            if (mediaType === 'video') {
                addVideoTrackToMap(Number(user?.uid), user?.videoTrack)
            } else if (mediaType === 'audio') {
                user?.audioTrack?.play()
                addAudioTrackToMap(Number(user?.uid), user?.audioTrack)
            }
        },
        onUserUnpublished: (user: IAgoraRTCRemoteUser, mediaType: IMediaType, config?: IDataChannelConfig | undefined): void => {
            if (mediaType === 'video') {
                removeVideoTrackFromMap(Number(user?.uid))
            } else if (mediaType === 'audio') {
                removeAudioTrackFromMap(Number(user?.uid))
            }
        },
        onVolumnIndicator: (speakers) => {
            speakers?.forEach(speaker => {
                console.log(speaker.level, speaker?.level > 100)
                if (speaker?.uid && speaker?.level > 40) {
                    setCurrentSpeakerUid(speaker.uid)
                }
            })
        }
    })

    const onCompleteCallback = (status: SetupState) => {
        setVideoSetupState(status)
    }

    useEffect(() => {
        if (videoSetupState === 'loading')
            videoController.setupVideoWithToken(config, listenersRef.current, onCompleteCallback)
        else if (videoSetupState === 'success') {
            pushInUidPlayerMap(Number(config?.uid))
            setVideoStatus(true)
            setAudioStatus(true)
        }
        return () => { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoSetupState])


    const setAudioStatus = (state: boolean) => {
        if (state === true) {
            AgoraRTC.createMicrophoneAudioTrack().then(
                (track) => {
                    addAudioTrackToMap(Number(config.uid), track)
                    videoController.setAudioStatus(true, track)
                }
            ).catch(e => console.log('errrr'))
        } else {
            removeAudioTrackFromMap(Number(config.uid))
        }
    }

    const setVideoStatus = (state: boolean) => {
        if (state === true) {
            AgoraRTC.createCameraVideoTrack().then(
                (track) => {
                    addVideoTrackToMap(Number(config.uid), track)
                    videoController.setCamaraStatus(true, track)
                }
            ).catch(e => console.log('errrr'))
        } else {
            const selfVideoTrack = uidPlayerMap.find((item) => item.uid === Number(config.uid))?.videoTrack
            if (selfVideoTrack) {
                videoController.setCamaraStatus(false, selfVideoTrack)
            }
            removeVideoTrackFromMap(Number(config.uid))
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
        setMeetStatus,
        currentSpeakerUid,
        uidPlayerMap
    }
}

export const MeetVideoComponent = ({
    config
}: {
    config: IVideoConnectionConfig
}) => {

    const { videoSetupState, setMeetStatus, currentSpeakerUid, uidPlayerMap } = useVideoMeet(config)
    if (videoSetupState === 'loading') {
        return <Loader />
    } else if (videoSetupState === 'error') {
        return <ErrorComponent message="Error In Loading Video Meet" />
    }

    return <>
        <div className={`video-grid video-grid-${uidPlayerMap.length}`}>
            {uidPlayerMap.map(({ uid, videoTrack }, index) => (
                <div key={index} className="video-container">
                    <VideoTrackView isSpeaking={currentSpeakerUid == uid} key={index} track={videoTrack} />
                </div>
            ))}
        </div>
        <VideoControls setMeetStatus={setMeetStatus} />
    </>
}


const VideoTrackView = ({ track, username, isSpeaking }: any) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            track?.play(videoRef.current);
        }

        return () => {
            track?.stop();
        };
    }, [track]);

    return <div style={{ borderWidth: 2, borderColor: isSpeaking ? 'yellow' : 'red', borderStyle: 'dashed' }}>
        <div>{username}</div>
        <video ref={videoRef} autoPlay />;
    </div>
};

const VideoControls = ({ setMeetStatus }: { setMeetStatus: (mediaType: IMediaType, status: boolean) => void }) => {
    const [audioMuted, setAudioMuted] = useState(false);
    const [videoMuted, setVideoMuted] = useState(false);

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
