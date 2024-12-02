import AgoraRTC, { IAgoraRTCRemoteUser, IDataChannelConfig } from "agora-rtc-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ENPOINTS } from "../constants/apiEndpoints";
import { videoController } from "../controllers/videoController";
import { IMediaType, IUidPlayerMapItem, IVideoConnectionConfig, IVideoMeetListeners, SetupState, ITranscript, AudioSuppresstionTimer, TranslationConfigs } from "../interface/interfaces";
import { userDataStore } from "../store/UserDataStore";
import { getBotData } from "../utils/botCode";
import { testingConfigs } from "../configs/testingConfigs";
export const useVideoMeet = (config: IVideoConnectionConfig, onDisconnect: () => void) => {
    const [videoSetupState, setVideoSetupState] = useState<SetupState>('loading');
    const [currentSpeakerUid, setCurrentSpeakerUid] = useState<Number>(-1);
    const [uidPlayerMap, setUidPlayerMap] = useState<IUidPlayerMapItem[]>([]);
    const [transcript, setTranscript] = useState<ITranscript[]>([])
    const completeTranscript = useRef<ITranscript[]>([])
    const navigate = useNavigate();
    const location = useLocation()
    const audioSuppressionTimers = useRef<AudioSuppresstionTimer[]>([])
    const transcriptionIntrimData = useRef<Map<String, Array<String | undefined>>>(new Map())
    const translationConfigRef = useRef<TranslationConfigs>({
        userVolume: testingConfigs.audioSuppressionVolumeLevel,
        botVolume: 100,
        dynamicVolume: false,
        isTranslationActive: true
    })


    const updateVolume = useCallback((updatedConfig: TranslationConfigs) => {
        if(translationConfigRef.current.dynamicVolume !== updatedConfig.dynamicVolume) {
            translationConfigRef.current.dynamicVolume = updatedConfig.dynamicVolume
        }
        translationConfigRef.current = updatedConfig
        setUidPlayerMap((uidPlayerMap) => {
            return uidPlayerMap.map((user) => {
                if (user.audioTrack && String(user.uid).length === 8) {
                    if(updatedConfig.isTranslationActive) {
                    user.audioTrack.setVolume(updatedConfig.botVolume)
                    } else {
                        user.audioTrack.setVolume(0)
                    }
                } else if (user.audioTrack) {
                    if(updatedConfig.isTranslationActive) {
                    user.audioTrack.setVolume(updatedConfig.userVolume)
                    } else {
                        user.audioTrack.setVolume(100)
                    }
                }
                return user
            })
        })
    }, [uidPlayerMap])

    const handleIncompleteTranscript = (totalDataChunks: number, currentDataChunkNumber: number, dataChunk: String, itemId: String): string => {
        if (transcriptionIntrimData.current.has(itemId)) {
            const currentData = transcriptionIntrimData.current.get(itemId)
            if (currentData) {
                currentData[currentDataChunkNumber - 1] = dataChunk
                // if all the values then make a string and return
                let totalChunksCollected = 0
                currentData.forEach((dataChunk, index) => {
                    if (dataChunk !== undefined) {
                        totalChunksCollected += 1
                    }
                })
                if (totalChunksCollected === totalDataChunks) {
                    // remove the item from the map
                    transcriptionIntrimData.current.delete(itemId)
                    return currentData.join('')
                }
                transcriptionIntrimData.current.set(itemId, currentData)
                return ''
            }
        } else {
            const data = new Array(totalDataChunks)
            data[currentDataChunkNumber - 1] = dataChunk
            transcriptionIntrimData.current.set(itemId, data)
            return ''
        }
        return ''
    }

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
            userDataStore.registerUser(String(user?.uid), config.channelName)
            pushInUidPlayerMap(Number(user?.uid));
        },
        onUserLeft: (user: IAgoraRTCRemoteUser, reason: string): void => {
            removeUserFromMap(Number(user?.uid));
        },
        onUserPublished: async (user: IAgoraRTCRemoteUser, mediaType: IMediaType, channelConfig?: IDataChannelConfig | undefined) => {
            if (String(user?.uid).length > 4) {
                const botData = getBotData(String(user?.uid))
                if (botData.targetLangName !== config.language || botData.speakerUID === config.uid || botData.srcLangName === config.language) {
                    return
                }
            }
            await videoController.subscribeToRemoteUser(user, mediaType);
            // MARK: Only subscribe to users ignore the bots with 8 digit uid
            if (mediaType === 'video') {
                if (String(user?.uid).length > 4) return
                addVideoTrackToMap(Number(user?.uid), user?.videoTrack);
            } else if (mediaType === 'audio') {
                // do not play audio for all the bots only those who speak your language
                if(user?.uid == config.uid) {
                    return
                }
                if(String(user?.uid).length == 4) {
                    user.audioTrack?.setVolume(translationConfigRef.current.userVolume)
                }
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
                if (String(speaker?.uid).length > 4 && speaker?.level > 30) {
                    const botData = getBotData(String(speaker?.uid))
                    setUidPlayerMap((uidPlayerMap) => {
                        const masterSpeakerNode = uidPlayerMap.find((user) => {
                            return String(user.uid) === String(botData.speakerUID)
                        })
                        if (masterSpeakerNode && translationConfigRef.current.dynamicVolume) {
                            masterSpeakerNode.audioTrack?.setVolume(translationConfigRef.current.userVolume)
                            // check if this user has a timer already
                            const timoutObj = audioSuppressionTimers.current.find((item) => String(item.uid) === String(speaker.uid))
                            const timerID = setTimeout(() => {
                                masterSpeakerNode.audioTrack?.setVolume(100)
                                audioSuppressionTimers.current = audioSuppressionTimers.current.filter((item) => String(item.uid) !== String(speaker.uid))
                            }, 6000);
                            if (!!timoutObj) {
                                clearTimeout(timoutObj?.timeoutId)
                                timoutObj.timeoutId = timerID
                            } else {
                                audioSuppressionTimers.current.push({
                                    timeoutId: timerID,
                                    uid: String(speaker.uid)
                                })
                            }
                        }
                        return uidPlayerMap
                    })
                    setCurrentSpeakerUid(Number(botData.speakerUID));
                } else {
                    let currentSpeakerUIDLocal: Number = -1
                    setCurrentSpeakerUid((currentSpeakerUID) => {
                        currentSpeakerUIDLocal = currentSpeakerUID
                        return currentSpeakerUID
                    });
                    if (speaker?.uid && speaker?.level > 40) {
                        setCurrentSpeakerUid(speaker.uid);
                    } else if (currentSpeakerUIDLocal === speaker?.uid) {
                        setCurrentSpeakerUid(-1);
                    }
                }
            });
        },
        onStreamMessage: (uid, payload) => {
            // convert Uint8Array to string
            try {
                const decoder = new TextDecoder();
                const str = decoder.decode(payload);
                // console.log(uid, str);
                const data = str.split('|')
                const itemId = data[0]
                const currentDataChunkNumber = Number(data[1])
                const totalDataChunks = Number(data[2]);
                let chatMessageStr = ''
                if (totalDataChunks > 1) {
                    const incompleteTranscript = handleIncompleteTranscript(totalDataChunks, currentDataChunkNumber, data[3], itemId)
                    if (incompleteTranscript !== '') {
                        // console.log('incompleteTranscript', incompleteTranscript)
                        chatMessageStr = atob(incompleteTranscript)
                    } else {
                        return
                    }
                } else {
                    chatMessageStr = atob(data[3]);
                }
                const chatMessage = JSON.parse(chatMessageStr);
                const botData = getBotData(String(uid))
                if (chatMessage.type === 'session.updated') {
                    // according to uid and languages it is decided if bot is ready. 
                    // console.log('chatMessage', chatMessage)
                    if (botData.targetLang === botData.srcLang && String(botData.speakerUID) === String(config.uid)) {
                        // console.log('Your transcription is live now')
                    } else if (botData.targetLangName === config.language) {
                        // console.log('Your Translation and transcriptions is live now', userDataStore.getUserName(botData.speakerUID))
                    }
                }
                //  2 cases "response.audio_transcript.done" "conversation.item.input_audio_transcription.completed" 
                if (chatMessage.type === 'response.audio_transcript.done' || chatMessage.type === 'response.text.done') {
                    completeTranscript.current.push({
                        uid: String(botData.speakerUID),
                        text: chatMessage.type === 'response.text.done' ? chatMessage.text : chatMessage.transcript,
                        timestamp: new Date(),
                        spokenWords: chatMessage.type === 'response.text.done'
                    })
                }
                if (botData.speakerUID === config.uid && chatMessage.type === 'response.text.done') {
                    onTranslationRecived(botData.speakerUID, chatMessage.text)
                } else if (botData.targetLangName === config.language && (chatMessage.type === 'response.audio_transcript.done')) {
                    onTranslationRecived(botData.speakerUID, chatMessage.transcript)
                }
            } catch (error) {
                console.error('Error processing stream message:', error);
            }
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
        handleDisconnectClick,
        completeTranscript,
        updateCurrentVolume: updateVolume,
        currentVolume: translationConfigRef
    };
};
