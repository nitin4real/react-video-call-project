import AC, { AgoraChat } from 'agora-chat';
import { IChatConnectionConfig, IChatListeners, IChatMeetListeners, ITranslatedMessage } from '../interface/interfaces';
import { getFileType } from '../utils/appUtils';
import { getLanguageISOCodeByName } from '../constants/languageCodes';
export class ChatModel {

    chatConnection: AgoraChat.Connection
    joinedChannelRoomId: string;
    isActive: boolean
    userLanguage?: string

    constructor(config: IChatConnectionConfig) {
        this.isActive = false
        this.joinedChannelRoomId = config.chatRoomId
        this.userLanguage = config.language
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
            onTextMessage: async (msg: AgoraChat.TextMsgBody) => {
                const translatedMessage: ITranslatedMessage = {
                    text: '',
                    srcLanguage: ''
                }
                try {
                    const userLanguage = this.userLanguage ? getLanguageISOCodeByName(this.userLanguage) : this.userLanguage
                    // if user langauge has a - then split it and get the first part
                    const translationResponse: any = await this.chatConnection.translateMessage({
                        text: msg.msg,
                        languages: [userLanguage ?? 'en']
                    })
                    const translation: AgoraChat.TranslationResult = translationResponse?.data[0]
                    let targetUserLanguage = translation?.detectedLanguage?.language
                    if (targetUserLanguage && targetUserLanguage.includes('-')) {
                        targetUserLanguage = targetUserLanguage.split('-')[0]
                    }
                    // console.log('TranslationAttempt', 'Translated Message',
                    //     translation?.translations[0]?.text,
                    //     targetUserLanguage,
                    //     userLanguage, this.userLanguage
                    // )
                    translatedMessage.text = translation?.translations[0]?.text
                    translatedMessage.srcLanguage = targetUserLanguage
                } catch (e) {
                    console.error( 'Error in translating message', e)
                }
                listeners.onTextMessage(msg, translatedMessage)
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

    sendFiles = async (file: AgoraChat.FileObj, targetUserId: string) => {
        if (this.isActive === false) {
            return
        }
        try {
            const fileExt = file.filetype
            const fileType = getFileType(fileExt)
            this.chatConnection.send(
                AC.message.create(
                    {
                        type: fileType,
                        file: file,
                        to: targetUserId ? targetUserId : this.joinedChannelRoomId,
                        chatType: targetUserId ? 'singleChat' : 'chatRoom',
                        filename: file.filename
                    }
                ))
        } catch (e) {
            console.log('Error Occured while sending message')
        }
    }
}