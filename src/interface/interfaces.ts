import { IAgoraRTCRemoteUser, IDataChannelConfig, UID } from "agora-rtc-react";

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

export interface IVideoMeetListeners {
    onUserJoined: (user: IAgoraRTCRemoteUser) => void
    onUserLeft: (user: IAgoraRTCRemoteUser, reason: string) => void
    onUserPublished: (user: IAgoraRTCRemoteUser, mediaType: IMediaType, config?: IDataChannelConfig | undefined) => void
    onUserUnpublished: (user: IAgoraRTCRemoteUser, mediaType: IMediaType, config?: IDataChannelConfig | undefined) => void

}
export type IMediaType = "audio" | "video" | "datachannel"
export interface IVideoConnectionConfig {
    appId: string
    channelName: string
    token: string
    uid: UID
}

