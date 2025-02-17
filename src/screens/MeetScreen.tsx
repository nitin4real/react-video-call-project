import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChatComponent } from "../components/ChatComponent";
import { ErrorComponent } from "../components/ErrorComponent";
import Loader from "../components/Loader";
import { VideoMeet } from "../components/VideoMeetComponent";
import { chatController } from "../controllers/chatController";
import { videoController } from "../controllers/videoController";
import { IChatConnectionConfig, ITokenResponse, IVideoConnectionConfig, SetupState } from "../interface/interfaces";
import { userDataStore } from "../store/UserDataStore";
import { tokenGenerator } from "../utils/AgoraTokenGenerator";
import { strings } from "../contants/strings";

const useMeet = () => {
    const [tokensRetrivedStatus, setTokenStatus] = useState<SetupState>('loading');
    const [showChat, setShowChat] = useState(false)
    const location = useLocation()
    const pathValues = location.pathname.split('/')
    const language = pathValues[pathValues.length - 1]
    const channelName = pathValues[pathValues.length - 2]
    let username: string = String(localStorage.getItem('username'))
    let voiceId: string = String(localStorage.getItem('voiceId')) || 'ash'
    const isRecorder = location.search.split('=')[1] === 'recorder'
    const [userIdList, setUserIdList] = useState<string[]>([])
    const disconnectAllConnections = () => {
        videoController.resetController()
        chatController.resetController()
    }

    const videoConfig = useRef<IVideoConnectionConfig>({
        uid: "",
        token: "",
        appId: "",
        channelName: "",
        language
    })

    const chatConfig = useRef<IChatConnectionConfig>({
        uid: "",
        token: "",
        appId: "",
        channelName: "",
        chatRoomId: "",
        appkey: "",
    })

    while (!username) {
        username = prompt('Enter Your name') || ''
        localStorage.setItem('username', username)
    }

    const onComplete = (status: SetupState, response: ITokenResponse) => {
        if (response.tokens.rtcToken === '' || response.tokens.chatToken === '' || response.appId === '') {
            console.error('Error in getting tokens')
            setTokenStatus('error')
            return
        }
        videoConfig.current = {
            appId: response.appId,
            token: response.tokens.rtcToken,
            uid: response.uid,
            channelName,
            language
        }

        chatConfig.current = {
            appId: response.appId,
            // token: response.tokens.rtmToken,
            token: response.tokens.chatToken,
            uid: response.uid,
            channelName,
            chatRoomId: response.tokens.chatRoomId,
            appkey: response.appkey,
            language
        }
        if (response.uid === strings.recorderID) {
            userDataStore.setIsRecorder(true)
        } else {
            userDataStore.setChannelName(channelName)
            userDataStore.setCurrentUserName(String(username))
            userDataStore.registerUser(String(response.uid), channelName)
        }
        console.log('got the new tokens')
        setTokenStatus(status)
    }

    useEffect(() => {
        if (tokensRetrivedStatus === 'loading') {
            try {
                console.log('getting the new tokens')
                tokenGenerator.GenerateTokenForUserID(username, channelName, language, isRecorder, voiceId, onComplete)
            } catch (e) {
                console.log("Error in generating tokens")
            }
        }
    }, [tokensRetrivedStatus])

    const updateUserList = (userId: string, active: boolean) => {
        if (active) {
            if (userIdList.includes(userId)) return
            setUserIdList((currentList) => [...currentList, userId])
        } else {
            setUserIdList((currentList) => currentList.filter((id) => id !== userId))
        }
    }
    const toggleShowChat = () => {
        setShowChat((current) => !current)
    }

    return {
        channelName,
        username,
        tokensRetrivedStatus,
        videoConfig: videoConfig.current,
        chatConfig: chatConfig.current,
        disconnectAllConnections,
        updateUserList,
        userIdList,
        showChat,
        toggleShowChat
    }
}

export const MeetScreen = () => {
    const { tokensRetrivedStatus, videoConfig, chatConfig, disconnectAllConnections, updateUserList, userIdList, showChat, toggleShowChat } = useMeet()

    if (tokensRetrivedStatus === 'loading') {
        console.log('onloading - meetscreen')
        return <Loader />
    } else if (tokensRetrivedStatus === 'error') {
        return <ErrorComponent message="Error in joining meet. Please try again" />
    }  

    return <div className="full-screen-container">
        <div className="video-pane">
            <VideoMeet onDisconnect={disconnectAllConnections} config={videoConfig} updateUserList={updateUserList} toggleShowChat={toggleShowChat} showChat={showChat} />
        </div>
        {
            <div className="right-pane" style={{ display: showChat ? 'block' : 'none' }}>
                <ChatComponent config={chatConfig} userIdList={userIdList} />
            </div>
        }
    </div>
}