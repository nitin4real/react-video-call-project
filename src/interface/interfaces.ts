import { ICameraVideoTrack } from "agora-rtc-react";
import { IAgoraRTCRemoteUser, IDataChannelConfig, UID } from "agora-rtc-react";
import { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

export interface IMessage {
    timestamp: Date;
    userId: string;
    text: string;
}

export type SetupState = 'loading' | 'success' | 'error'

export interface ITokenResponse {
    appId: string;
    tokens: {
        rtmToken: string;
        rtcToken: string;
    };
    uid: string
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

}
export type IMediaType = "audio" | "video" | "datachannel"
export interface IVideoConnectionConfig {
    appId: string
    channelName: string
    token: string
    uid: UID
}
export interface IUidPlayerMapItem {
    uid: Number
    videoTrack: ICameraVideoTrack | undefined
    audioTrack: IMicrophoneAudioTrack | undefined
}

export type IUidPlayerMap = IUidPlayerMapItem[]