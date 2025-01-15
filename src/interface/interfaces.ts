import { AgoraChat } from "agora-chat";
import { ICameraVideoTrack } from "agora-rtc-react";
import { IAgoraRTCRemoteUser, IDataChannelConfig, UID } from "agora-rtc-react";
import { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

export interface IMessage {
    timestamp: Date;
    userId: string;
    text: string;
    targetUserId?: string;
    type: "text" | "audio" | "img" | "file"
    file?: AgoraChat.FileObj | AgoraChat.ImgMsgBody | AgoraChat.AudioMsgBody | AgoraChat.FileMsgBody,
    fileUrl?: string
}

export type SetupState = 'loading' | 'success' | 'error'

export interface ITokenResponse {
    appId: string;
    tokens: {
        rtmToken: string;
        rtcToken: string;
        chatToken: string,
        chatRoomId: string
    };
    uid: string,
    appkey: string
}

export interface IChatEvent {
    channelType: "STREAM" | "MESSAGE"
    channelName: string
    topicName: string
    messageType: "STRING" | "BINARY"
    customType: any
    publisher: string
    message: string
    publishTime: string
}

export interface IChatMeetListeners {
    onMessage: (event: IChatEvent) => void
    onPresence: (event: IChatEvent) => void
}

export interface IChatConnectionConfig {
    uid: string
    token: string
    appId: string
    channelName: string
    chatRoomId: string
    appkey: string
}
interface ISpeaker {
    uid: number
    level: number
}
export interface IVideoMeetListeners {
    onUserJoined: (user: IAgoraRTCRemoteUser) => void
    onUserLeft: (user: IAgoraRTCRemoteUser, reason: string) => void
    onUserPublished: (user: IAgoraRTCRemoteUser, mediaType: IMediaType, config?: IDataChannelConfig | undefined) => void
    onUserUnpublished: (user: IAgoraRTCRemoteUser, mediaType: IMediaType, config?: IDataChannelConfig | undefined) => void
    onVolumnIndicator: (speakers: ISpeaker[]) => void
    onStreamMessage: (uid: number, payload: Uint8Array) => void
}

export type IMediaType = "audio" | "video" | "datachannel"
export interface IVideoConnectionConfig {
    appId: string
    channelName: string
    token: string
    uid: UID
    language: string
}

export interface IUidPlayerMapItem {
    uid: Number
    videoTrack: ICameraVideoTrack | undefined
    audioTrack: IMicrophoneAudioTrack | undefined
    transcript: string[]
}

export type IUidPlayerMap = IUidPlayerMapItem[]

export type ITranscript = {
    uid: string
    text: string
    timestamp: Date
    spokenWords?: boolean
}
// import { voice2voiceTranslator } from "../services/voice2VoiceTranslationService";
export type AudioSuppresstionTimer = {
    timeoutId: NodeJS.Timeout;
    uid: string;
};
export interface TranslationConfigs {
    userVolume: number;
    botVolume: number;
    dynamicVolume: boolean;
    isTranslationActive: boolean
}
export interface IPopupItem {
    id:number
    title: string;
    description: string;
}
export interface IAgoraChatConnectionConfig {
    uid: string
    token: string
    appId: string
    channelName: string
}


export interface IChatListeners {
    onTextMessage: (msg: AgoraChat.TextMsgBody) => void,
    onAudioMessage: (msg: AgoraChat.AudioMsgBody) => void,
    onImageMessage: (msg: AgoraChat.ImgMsgBody) => void,
    onFileMessage: (msg: AgoraChat.FileMsgBody) => void
}
