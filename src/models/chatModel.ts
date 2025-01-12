import AC, { AgoraChat } from 'agora-chat';
import { IChatConnectionConfig, IChatListeners, IChatMeetListeners } from '../interface/interfaces';
export class ChatModel {

    chatConnection: AgoraChat.Connection
    joinedChannelRoomId: string;
    isActive: boolean

    constructor(config: IChatConnectionConfig) {
        this.isActive = false
        this.joinedChannelRoomId = config.chatRoomId
        this.chatConnection = new AC.connection(
            {
                appKey: config.appkey
            } as AgoraChat.ConnectionParameters
        )
    }

    resetServices = async () => {
        this.isActive = false

    }

    joinChannel = async (config: IChatConnectionConfig) => {
        this.isActive = false
        if (this.joinedChannelRoomId) {
            await this.resetServices()
        }
        try {
            this.chatConnection.addEventHandler("connection&message", {
                onConnected: () => {
                    this.chatConnection.joinChatRoom({
                        roomId: config.chatRoomId,
                    })
                    this.isActive = true
                },
                onError: (err) => {
                    console.log('Error in joining chat room', err)
                }
            })
            await this.chatConnection.open({
                accessToken: config.token,
                user: config.uid
            })
        } catch (e) {
            console.log('A Error Occured. (While Joining Chat Services).', e)
        }
    }

    setListeners = (listeners: IChatListeners) => {
        this.chatConnection.addEventHandler("message", {
            onTextMessage: (msg) => {
                listeners.onTextMessage(msg)
            },
            onAudioMessage: (msg) => {
                listeners.onAudioMessage(msg)
            },
            onImageMessage: (msg) => {
                listeners.onImageMessage(msg)
            },
            onFileMessage: (msg: AgoraChat.FileMsgBody) => {
                listeners.onFileMessage(msg)
            }
        })
    }

    sendMessage = async (message: string, targetUserId: string) => {
        if (this.isActive === false) {
            return
        }
        try {
            if (targetUserId) {
                this.chatConnection.send(
                    AC.message.create(
                        {
                            type: 'txt',
                            msg: message,
                            to: targetUserId,
                            chatType: 'singleChat',
                        }
                    ))
            } else {
                this.chatConnection.send(
                    AC.message.create({
                        type: 'txt',
                        msg: message,
                        to: this.joinedChannelRoomId,
                        chatType: 'chatRoom',
                    })
                )

            }
        } catch (e) {
            console.log('Error Occured while sending message')
        }
    }
}


