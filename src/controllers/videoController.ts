import { IAgoraRTCRemoteUser, ILocalTrack } from "agora-rtc-react"
import { IMediaType, IVideoConnectionConfig, IVideoMeetListeners, SetupState } from "../interface/interfaces"
import { VideoModel } from "../models/videoModel"

class VideoController {
    private videoModel: VideoModel | undefined
    isControllerAvailable: boolean = true

    resetController = async () => {
        await this.videoModel?.resetServices()
        this.videoModel = undefined
    }

    setupVideoWithToken = async (
        config: IVideoConnectionConfig,
        listeners: IVideoMeetListeners,
        onCompleteCallback: (status: SetupState) => void) => {
        if (!this.isControllerAvailable) return
        this.isControllerAvailable = false
        try {
            await this.setUpVideo(config, listeners)
            onCompleteCallback('success')
        } catch (e) {
            onCompleteCallback('error')
        }
        this.isControllerAvailable = true
    }

    setUpVideo = async (config: IVideoConnectionConfig, listeners: IVideoMeetListeners) => {
        this.videoModel = new VideoModel()
        try {
            this.videoModel.setListeners(listeners)
            await this.videoModel.joinChannel(config)
            //set self video
        } catch (e) {
            console.log('Error in video Setup')
        }
    }

    subscribeToRemoteUser = async (remoteUser: IAgoraRTCRemoteUser, mediaType: IMediaType) => {
        try {
            await this.videoModel?.subscribe(remoteUser, mediaType)
            console.log('Subscribed to user for', mediaType)
        } catch (e) {
            console.log('Error In Subscribing to remote user')
        }
    }

    publishFeed = async (feed: ILocalTrack) => {
        try {
            if (feed.trackMediaType === 'audio') {
                await this.videoModel?.publishAudio(feed)
            } else if (feed.trackMediaType === 'video') {
                await this.videoModel?.publishVideo(feed)
            }
        } catch (e) {
            console.log('Error publishing feed')
        }
    }

    setAudioStatus = async (isActive: boolean, audioTrack: ILocalTrack) => {
        try {
            if (isActive) {
                await this.videoModel?.publishAudio(audioTrack)
            } else {
                await this.videoModel?.unpublishAudio(audioTrack)
            }
        } catch (e) {
            console.log('Error in mute')
        }
    }

    setCamaraStatus = async (isActive: boolean, videoTrack: ILocalTrack) => {
        try {
            if (isActive) {
                await this.videoModel?.publishVideo(videoTrack)
            } else {
                await this.videoModel?.unpublishVideo(videoTrack)
            }
        } catch (e) {
            console.log('Error in Switching camara')
        }
    }

}

const videoController = new VideoController()
export { videoController }
