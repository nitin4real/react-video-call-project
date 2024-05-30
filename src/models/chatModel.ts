import AgoraRTM, { RTMClient } from 'agora-rtm-sdk'
import { IChatConnectionConfig, IChatMeetListeners } from '../interface/interfaces'

export class ChatModel {

    chatEngine: RTMClient
    joinedChannelName: string

    constructor(config: IChatConnectionConfig) {
        this.joinedChannelName = config.channelName
        this.chatEngine = new AgoraRTM.RTM(
            config.appId,
            config.uid,
            {
                token: config.token,
                logLevel: 'none',
            }
        )
    }

    resetServices = async () => {
        try {
            await this.chatEngine?.unsubscribe(this.joinedChannelName)
            this.joinedChannelName = ''
        } catch (e) {
            console.log('A Error Occured. (While Leaving Chat Services)', e)
        }
    }

    joinChannel = async (config: IChatConnectionConfig) => {
        if (this.joinedChannelName) {
            await this.resetServices()
        }

        try {
            await this.chatEngine.login()
            const subscribeOptions = {
                withMessage: true,
                withPresence: true,
                withMetadata: true,
                withLock: true,
            }
            await this.chatEngine.subscribe(
                config.channelName,
                subscribeOptions
            )
            this.joinedChannelName = config.channelName
        } catch (e) {
            console.log('A Error Occured. (While Joining Chat Services).', e)
        }
    }

    setListeners = (listeners: IChatMeetListeners) => {
        this.chatEngine?.on('message', listeners.onMessage)
        this.chatEngine?.on('pesence', listeners.onPresence)
    }

    sendMessage = async (message: string) => {
        try {
            await this.chatEngine?.publish(this.joinedChannelName, message)
        } catch (e) {
            console.log('Error Occured while sending message')
        }
    }
}


