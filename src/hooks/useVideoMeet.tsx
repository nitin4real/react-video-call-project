import AgoraRTC, { IAgoraRTCRemoteUser, IDataChannelConfig } from "agora-rtc-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ENPOINTS } from "../constants/apiEndpoints";
import { videoController } from "../controllers/videoController";
import { IMediaType, IUidPlayerMapItem, IVideoConnectionConfig, IVideoMeetListeners, SetupState, ITranscript } from "../interface/interfaces";
import { userDataStore } from "../store/UserDataStore";
// import { voice2voiceTranslator } from "../services/voice2VoiceTranslationService";

export const useVideoMeet = (config: IVideoConnectionConfig, onDisconnect: () => void) => {
    const [videoSetupState, setVideoSetupState] = useState<SetupState>('loading');
    const [currentSpeakerUid, setCurrentSpeakerUid] = useState<Number>(Number(config.uid));
    const [uidPlayerMap, setUidPlayerMap] = useState<IUidPlayerMapItem[]>([]);
    const [transcript, setTranscript] = useState<ITranscript[]>([])
    const navigate = useNavigate();
    const location = useLocation()

    const pushInUidPlayerMap = (uid: Number) => {
        setUidPlayerMap((currentMap) => {
            return [
                ...currentMap,
                {
                    uid,
                    videoTrack: undefined,
                    audioTrack: undefined,
                    transcript: []
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
                        ...singleMapping,
                        videoTrack
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
                        ...singleMapping,
                        videoTrack: undefined,
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
                        ...singleMapping,
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
                        ...singleMapping,
                        audioTrack: undefined
                    };
                } else return singleMapping;
            });
        });
    };

    const handleDisconnectClick = () => {
        setVideoStatus(false);
        setAudioStatus(false);
        // voice2voiceTranslator.stopTranslationService()
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
            // MARK: Only subscribe to users ignore the bots with 8 digit uid
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
                // console.log(speaker.level, speaker?.level > 100);
                if (speaker?.uid && speaker?.level > 40) {
                    setCurrentSpeakerUid(speaker.uid);
                }
            });
        },
        onStreamMessage: (uid, payload) => {
            // convert Uint8Array to string
            const decoder = new TextDecoder();
            const str = decoder.decode(payload);
            console.log(uid, str);  // Output: "Hello"
            const data = str.split('|')
            const transcriptionDataStr = atob(data[data.length - 1]);
            const transcriptionData = JSON.parse(transcriptionDataStr);
            //  2 cases "response.audio_transcript.done" "conversation.item.input_audio_transcription.completed" 
            console.log(
                transcriptionData.transcript,
                uid,
                transcriptionData.type
            );
            setTranscript((transcript) => {
                return [
                    ...transcript,
                    {
                        uid: String(uid),
                        text: transcriptionData.transcript,
                        timestamp: new Date()
                    }
                ]
            })
        }
    })

    const onCompleteCallback = (status: SetupState) => {
        setVideoSetupState(status);
    };

    const onTranslationRecived = (uid: string, transcriptText: string) => {
        setUidPlayerMap((uidPlayerMap) => {
            const speakerNodeIndex = uidPlayerMap.findIndex((user) => {
                return String(user.uid) === String(uid)
            })
            if (speakerNodeIndex !== -1 && transcriptText.trim()) {
                setTranscript((transcript) => {
                    return [
                        ...transcript,
                        {
                            uid: String(uid),
                            text: transcriptText,
                            timestamp: new Date()
                        }
                    ]
                })
                uidPlayerMap[speakerNodeIndex].transcript.push(transcriptText)
                return [...uidPlayerMap]
            }
            return uidPlayerMap
        })
    }

    useEffect(() => {
        if (videoSetupState === 'loading')
            videoController.setupVideoWithToken(config, listenersRef.current, onCompleteCallback);
        else if (videoSetupState === 'success') {
            const userUid = config.uid
            const pathValues = location?.pathname?.split('/')
            const languageCode = pathValues[pathValues.length - 1]
            const channelName = pathValues[pathValues.length - 2]
            pushInUidPlayerMap(Number(config?.uid));
            if (languageCode !== '') {
                // voice2voiceTranslator.initTranslationServices(
                //     ENPOINTS.BASE_URL,
                //     userUid.toString(),
                //     channelName,
                //     languageCode,
                //     onTranslationRecived
                // )
            }
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
            // voice2voiceTranslator.unmute()
        } else {
            // voice2voiceTranslator.mute()
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


    const setMeetStatus = (mediaType: IMediaType, status: boolean) => {
        if (mediaType === 'audio') {
            setAudioStatus(status);
        } else if (mediaType === 'video') {
            setVideoStatus(status);
        }
    };

    return {
        transcript,
        videoSetupState,
        setMeetStatus,
        currentSpeakerUid,
        uidPlayerMap,
        handleDisconnectClick
    };
};
