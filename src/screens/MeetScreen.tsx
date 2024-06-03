import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { tokenGenerator } from "../utils/AgoraTokenGenerator";
import { ChatComponent } from "../components/ChatComponent";
import { ErrorComponent } from "../components/ErrorComponent";
import Loader from "../components/Loader";
import { VideoMeet } from "../components/VideoMeetComponent";
import { IChatConnectionConfig, ITokenResponse, IVideoConnectionConfig, SetupState } from "../interface/interfaces";
import { videoController } from "../controllers/videoController";
import { chatController } from "../controllers/chatController";
import { userDataStore } from "../store/UserDataStore";

const useMeet = () => {
    const [tokensRetrivedStatus, setTokenStatus] = useState<SetupState>('loading');
    const location = useLocation()
    const pathValues = location.pathname.split('/')
    const channelName = pathValues[pathValues.length - 1]
    let username: string = String(localStorage.getItem('username'))

    const disconnectAllConnections = () => {
        videoController.resetController()
        chatController.resetController()
    }

    const videoConfig = useRef<IVideoConnectionConfig>({
        uid: "",
        token: "",
        appId: "",
        channelName: "",
    })

    const chatConfig = useRef<IChatConnectionConfig>({
        uid: "",
        token: "",
        appId: "",
        channelName: ""
    })

    while (!username) {
        username = prompt('Enter Your name') || ''
        localStorage.setItem('username', username)
    }

    const onComplete = (status: SetupState, response: ITokenResponse) => {
        videoConfig.current = {
            appId: response.appId,
            token: response.tokens.rtcToken,
            uid: response.uid,
            channelName
        }

        chatConfig.current = {
            appId: response.appId,
            token: response.tokens.rtmToken,
            uid: response.uid,
            channelName
        }
        userDataStore.setCurrentUserName(String(username))
        userDataStore.registerUser(String(response.uid))
        console.log('got the new tokens')
        setTokenStatus(status)
    }

    useEffect(() => {
        if (tokensRetrivedStatus === 'loading') {
            try {
                console.log('getting the new tokens')
                tokenGenerator.GenerateTokenForUserID(username, channelName, onComplete)
            } catch (e) {
                console.log("Error in generating tokens")
            }
        }
    }, [tokensRetrivedStatus])

    return {
        channelName,
        username,
        tokensRetrivedStatus,
        videoConfig: videoConfig.current,
        chatConfig: chatConfig.current,
        disconnectAllConnections
    }
}

export const MeetScreen = () => {
    const { tokensRetrivedStatus, videoConfig, chatConfig, disconnectAllConnections } = useMeet()

    if (tokensRetrivedStatus === 'loading') {
        console.log('onloading - meetscreen')
        return <Loader />
    } else if (tokensRetrivedStatus === 'error') {
        return <ErrorComponent message="Error in joining meet. Please try again" />
    }
    console.log('onsucess - meetscreen')

    return <div className="full-screen-container">
        <div className="left-pane">
            <VideoMeet onDisconnect={disconnectAllConnections} config={videoConfig} />
        </div>
        <div className="right-pane">
            <ChatComponent config={chatConfig} />
        </div>
    </div>
}