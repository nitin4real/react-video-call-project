import AgoraRTC, { IAgoraRTCRemoteUser, IDataChannelConfig } from "agora-rtc-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { videoController } from "../controllers/videoController";
import { IMediaType, IVideoConnectionConfig, IVideoMeetListeners, SetupState } from "../interface/interfaces";
import { IUidPlayerMapItem } from "../interface/interfaces";
import { userDataStore } from "../store/UserDataStore";
import { Socket, io } from "socket.io-client";

export const useVideoMeet = (config: IVideoConnectionConfig, onDisconnect: () => void) => {
    const [videoSetupState, setVideoSetupState] = useState<SetupState>('loading');
    const [currentSpeakerUid, setCurrentSpeakerUid] = useState<Number>(Number(config.uid));
    const [uidPlayerMap, setUidPlayerMap] = useState<IUidPlayerMapItem[]>([]);
    const navigate = useNavigate();

    const pushInUidPlayerMap = (uid: Number) => {
        setUidPlayerMap((currentMap) => {
            return [
                ...currentMap,
                {
                    uid,
                    videoTrack: undefined,
                    audioTrack: undefined
                }
            ];
        });
    };

    const removeUserFromMap = (uid: Number) => {
        setUidPlayerMap((currentMap) => {
            return currentMap.filter((value) => {
                return value.uid != uid;
            });
        });
    };

    const addVideoTrackToMap = (uid: Number, videoTrack: any) => {
        setUidPlayerMap((currentMap) => {
            return currentMap.map((singleMapping) => {
                if (singleMapping.uid == uid) {
                    return {
                        uid,
                        videoTrack,
                        audioTrack: singleMapping.audioTrack
                    };
                } else return singleMapping;
            });
        });
    };

    const removeVideoTrackFromMap = (uid: Number) => {
        setUidPlayerMap((currentMap) => {
            return currentMap.map((singleMapping: any) => {
                if (singleMapping.uid == uid) {
                    singleMapping?.videoTrack?.close();
                    return {
                        uid,
                        videoTrack: undefined,
                        audioTrack: singleMapping.audioTrack
                    };
                } else return singleMapping;
            });
        });
    };

    const addAudioTrackToMap = (uid: Number, audioTrack: any) => {
        setUidPlayerMap((currentMap) => {
            return currentMap.map((singleMapping) => {
                if (singleMapping.uid == uid) {
                    return {
                        uid,
                        videoTrack: singleMapping.videoTrack,
                        audioTrack
                    };
                } else return singleMapping;
            });
        });
    };

    const removeAudioTrackFromMap = (uid: Number) => {
        setUidPlayerMap((currentMap) => {
            return currentMap.map((singleMapping) => {
                if (singleMapping.uid == uid) {
                    singleMapping?.audioTrack?.close();

                    return {
                        uid,
                        videoTrack: singleMapping.videoTrack,
                        audioTrack: undefined
                    };
                } else return singleMapping;
            });
        });
    };

    const handleDisconnectClick = () => {
        setVideoStatus(false);
        setAudioStatus(false);
        onDisconnect();
        navigate(-1);
    };

    const listenersRef = useRef<IVideoMeetListeners>({
        onUserJoined: (user: IAgoraRTCRemoteUser): void => {
            userDataStore.registerUser(String(user?.uid))
            pushInUidPlayerMap(Number(user?.uid));
        },
        onUserLeft: (user: IAgoraRTCRemoteUser, reason: string): void => {
            removeUserFromMap(Number(user?.uid));
        },
        onUserPublished: async (user: IAgoraRTCRemoteUser, mediaType: IMediaType, config?: IDataChannelConfig | undefined) => {
            await videoController.subscribeToRemoteUser(user, mediaType);
            if (mediaType === 'video') {
                addVideoTrackToMap(Number(user?.uid), user?.videoTrack);
            } else if (mediaType === 'audio') {
                user?.audioTrack?.play();
                addAudioTrackToMap(Number(user?.uid), user?.audioTrack);
            }
        },
        onUserUnpublished: (user: IAgoraRTCRemoteUser, mediaType: IMediaType, config?: IDataChannelConfig | undefined): void => {
            if (mediaType === 'video') {
                removeVideoTrackFromMap(Number(user?.uid));
            } else if (mediaType === 'audio') {
                removeAudioTrackFromMap(Number(user?.uid));
            }
        },
        onVolumnIndicator: (speakers) => {
            speakers?.forEach(speaker => {
                console.log(speaker.level, speaker?.level > 100);
                if (speaker?.uid && speaker?.level > 40) {
                    setCurrentSpeakerUid(speaker.uid);
                }
            });
        }
    });

    const onCompleteCallback = (status: SetupState) => {
        setVideoSetupState(status);
    };

    useEffect(() => {
        if (videoSetupState === 'loading')
            videoController.setupVideoWithToken(config, listenersRef.current, onCompleteCallback);
        else if (videoSetupState === 'success') {
            pushInUidPlayerMap(Number(config?.uid));
            setVideoStatus(true);
            setAudioStatus(true);
        }
        return () => { };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoSetupState]);


    const setAudioStatus = (state: boolean) => {
        if (state === true) {
            AgoraRTC.createMicrophoneAudioTrack().then(
                (track) => {
                    addAudioTrackToMap(Number(config.uid), track);
                    videoController.setAudioStatus(true, track);
                }
            ).catch(e => console.log('errrr'));
        } else {
            removeAudioTrackFromMap(Number(config.uid));
        }
    };

    const setVideoStatus = (state: boolean) => {
        if (state === true) {
            AgoraRTC.createCameraVideoTrack().then(
                (track) => {
                    addVideoTrackToMap(Number(config.uid), track);
                    videoController.setCamaraStatus(true, track);
                }
            ).catch(e => console.log('errrr'));
        } else {
            const selfVideoTrack = uidPlayerMap.find((item) => item.uid === Number(config.uid))?.videoTrack;
            if (selfVideoTrack) {
                videoController.setCamaraStatus(false, selfVideoTrack);
            }
            removeVideoTrackFromMap(Number(config.uid));
        }
    };

    const [recording, setRecording] = useState(true);
    const [transcript, setTranscript] = useState('');
    const streaming = useRef(false)
    const socket = useRef(io('http://localhost:3013')).current
    useEffect(() => {

        let mediaRecorder: MediaRecorder | null = null;
        let audioChunks: BlobPart[] = [];
        const handleData = (e: any) => {
            audioChunks.push(e.data);
            // console.log('eventdata from handle data',e.data)
            // return
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string
                const audioBase64 = result.split(',')[1];
                // console.log('eventdata from handle data',result)
                // return
                // console.log('audio slice', new Date().toTimeString())
                // console.log('audio slice ---', audioBase64)
                socket?.emit('audioStream', audioBase64);
            };
            reader.readAsDataURL(audioBlob);
            audioChunks = [];
        };

        if (!recording) {
            console.log('maybe the stream is created twice -- ', recording)
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.start(5000);
                    mediaRecorder.addEventListener('dataavailable', handleData);
                });
        } else if (mediaRecorder) {
            (mediaRecorder as MediaRecorder).stop();
        }

        return () => {
            if (mediaRecorder) {
                mediaRecorder.removeEventListener('dataavailable', handleData);
            }
        };
    }, [recording]);

    // useEffect(() => {
    //     socket.on('transcription', (data) => {
    //         setTranscript(prev => `${prev} ${data}`);
    //     });

    //     return () => {
    //         socket.off('transcription');
    //     };
    // }, []);


    const setMeetStatus = (mediaType: IMediaType, status: boolean) => {
        if (mediaType === 'audio') {
            setRecording(status)
            setAudioStatus(status);
        } else if (mediaType === 'video') {
            setVideoStatus(status);
        }
    };

    return {
        videoSetupState,
        setMeetStatus,
        currentSpeakerUid,
        uidPlayerMap,
        handleDisconnectClick
    };
};
