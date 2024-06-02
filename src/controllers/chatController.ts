import { IChatConnectionConfig, IChatMeetListeners, SetupState } from "../interface/interfaces"
import { ChatModel } from "../models/chatModel"

class ChatController {
    chatModel: ChatModel | undefined
    isControllerAvailable: boolean = true

    resetController = async () => {
        await this.chatModel?.resetServices()
        this.chatModel = undefined
    }

    setupChatWithToken = async ( // token generation should be done in the main meet component
        config: IChatConnectionConfig,
        listeners: IChatMeetListeners,
        onCompleteCallback: (status: SetupState) => void) => {
        if (!this.isControllerAvailable) return
        this.isControllerAvailable = false
        try {
            await this.setUpChat(config, listeners)
            onCompleteCallback('success')
        } catch (e) {
            onCompleteCallback('error')
        }
        this.isControllerAvailable = true
    }

    setUpChat = async (config: IChatConnectionConfig, listeners: IChatMeetListeners) => {
        this.chatModel = new ChatModel(config)
        try {
            await this.chatModel.joinChannel(config)
            this.chatModel.setListeners(listeners)
        } catch (e) {
            console.log('Error in chat Setup')
        }
    }

    sendMessage = async (message: string) => {
        try {
            this.chatModel?.sendMessage(message)
        } catch (e) {
            console.log('Error In sending message')
        }
    }
}

const chatController = new ChatController()
export { chatController }
