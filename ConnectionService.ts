import AgoraRTM, { RTMClient } from 'agora-rtm-sdk'
const APP_ID = ""

export class ConnectionService {

    signalingEngine: RTMClient

    constructor() {

    }

    initWithUserNameAndToken = async (uid: string, token: string, onComplete: (status: boolean) => void) => {
        this.signalingEngine = new AgoraRTM.RTM(APP_ID, uid, { token, logLevel: 'none', })
        await this.setUpChat()
        onComplete(false)
    }

    resetConnection = () => {
        this.logoutChat()
    }

    setUpChat = async () => {
        try {
            await this.signalingEngine.login()
            await this.subscribeToMeetingChannel()
            console.log('-------successfully loged in ')
        } catch (err) {
            console.log({ err }, '-----------error occurs at login.')
        }
    }

    logoutChat = async () => {
        try {
            await this.signalingEngine.logout()
        } catch (e) {
            console.log('error in logging out the current user from singaling engine')
        }
    }

    setupSignalListeners = (callBacks) => {
        this.signalingEngine.addEventListener('message', (eventArgs: any) => {
            console.log(`${eventArgs.publisher}: ${eventArgs.message}`)
        })
    }

    subscribeToMeetingChannel = async () => {
        const channelName = 'mainchatroom'
        try {
            const subscribeOptions = {
                withMessage: true,
                withPresence: true,
                withMetadata: true,
                withLock: true,
            }
            await this.signalingEngine.subscribe(channelName, subscribeOptions)
        } catch (error) {
            console.log(error)
        }
    }

    sendMessage = async (message: string) => {
        await this.signalingEngine.publish('mainchatroom', message)
    }
}