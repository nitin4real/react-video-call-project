import { IChatConnectionConfig, IChatListeners, IChatMeetListeners, SetupState } from "../interface/interfaces"
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
        listeners: IChatListeners,
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

    setUpChat = async (config: IChatConnectionConfig, listeners: IChatListeners) => {
        this.chatModel = new ChatModel(config)
        try {
            this.chatModel.setListeners(listeners)
            await this.chatModel.joinChannel(config)
        } catch (e) {
            console.log('Error in chat Setup')
        }
    }

    sendMessage = async (message: string, targetUserId: string) => {
        try {
            this.chatModel?.sendMessage(message, targetUserId)
        } catch (e) {
            console.log('Error In sending message')
        }
    }
}

const chatController = new ChatController()
export { chatController }
