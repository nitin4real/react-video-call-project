import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, IDataChannelConfig, ILocalTrack, UID } from "agora-rtc-react"

export class VideoModel {

    videoEngine: IAgoraRTCClient
    joined: boolean

    constructor() {
        this.videoEngine = AgoraRTC.createClient({
            codec: 'h264',
            mode: 'live',
            role: 'host'
        })
        this.joined = false
    }

    resetServices = () => {
        try {
            this.videoEngine.leave()
            this.joined = false
        } catch (e) {
            console.log('A Error Occured. (While Leaving Video Services)', e)
        }
    }

    joinChannel = async (config: IConnectionConfig) => {
        try {
            await this.videoEngine.join(
                config.appId,
                config.channelName,
                config.token,
                config.uid
            )
            this.joined = true
        } catch (e) {
            console.log('A Error Occured. (While Joining Video Services).', e)
        }
    }

    setListeners = (listeners: IVideoMeetListeners) => {
        this.videoEngine.on('user-joined', listeners.onUserJoined)
        this.videoEngine.on('user-left', listeners.onUserLeft)
        this.videoEngine.on('user-published', listeners.onUserPublished)
        this.videoEngine.on('user-unpublished', listeners.onUserUnpublished)
    }

    publishVideo = (videoTrack: ILocalTrack) => {//these 4 return a promise handle them
        this.videoEngine.publish(videoTrack)
    }

    publishAudio = (audioTrack: ILocalTrack) => {
        this.videoEngine.publish(audioTrack)
    }

    unpublishVideo = (videoTrack: ILocalTrack) => {
        this.videoEngine.unpublish(videoTrack)
    }

    unpublishAudio = (audioTrack: ILocalTrack) => {
        this.videoEngine.unpublish(audioTrack)
    }



    setMuteStatus = (isActive: boolean) => {

    }

    setCamaraStatus = (isActive: boolean) => {

    }

}

export interface IConnectionConfig {
    appId: string,
    channelName: string,
    token: string,
    uid: UID
}

export interface IVideoMeetListeners {
    onUserJoined: (user: IAgoraRTCRemoteUser) => void
    onUserLeft: (user: IAgoraRTCRemoteUser, reason: string) => void,
    onUserPublished: (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video" | "datachannel", config?: IDataChannelConfig | undefined) => void,
    onUserUnpublished: (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video" | "datachannel", config?: IDataChannelConfig | undefined) => void

}

//identify each user using UID only create and assign a uid on time of login