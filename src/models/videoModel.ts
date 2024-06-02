import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ILocalTrack } from "agora-rtc-react"
import { IMediaType, IVideoConnectionConfig, IVideoMeetListeners } from "../interface/interfaces"

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

    resetServices = async () => {
        try {
            await this.videoEngine.leave()
            this.joined = false
        } catch (e) {
            console.log('A Error Occured. (While Leaving Video Services)')
        }
    }

    joinChannel = async (config: IVideoConnectionConfig) => {
        if (this.joined) {
            await this.resetServices()
        }
        try {
            await this.videoEngine.join(
                config.appId,
                config.channelName,
                config.token,
                Number(config.uid)
            )
            this.videoEngine.enableAudioVolumeIndicator()
            this.joined = true
        } catch (e) {
            console.log('A Error Occured. (While Joining Video Services).')
        }
    }

    setListeners = (listeners: IVideoMeetListeners) => {
        this.videoEngine.on('user-joined', listeners.onUserJoined)
        this.videoEngine.on('user-left', listeners.onUserLeft)
        this.videoEngine.on('user-published', listeners.onUserPublished)
        this.videoEngine.on('user-unpublished', listeners.onUserUnpublished)
        this.videoEngine.on('volume-indicator',listeners.onVolumnIndicator)
    }

    subscribe = (remoteUser: IAgoraRTCRemoteUser, mediaType: IMediaType) => {
        return this.videoEngine.subscribe(remoteUser, mediaType)
    }

    publishVideo = (videoTrack: ILocalTrack) => {
        return this.videoEngine.publish(videoTrack)
    }

    publishAudio = (audioTrack: ILocalTrack) => {
        return this.videoEngine.publish(audioTrack)
    }

    unpublishVideo = (videoTrack: ILocalTrack) => {
        return this.videoEngine.unpublish(videoTrack)
    }

    unpublishAudio = (audioTrack: ILocalTrack) => {
        return this.videoEngine.unpublish(audioTrack)
    }

    setMuteStatus = (isActive: boolean) => {

    }

    setCamaraStatus = (isActive: boolean) => {

    }

}
