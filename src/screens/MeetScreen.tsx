import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { tokenGenerator } from "../AgoraTokenGenerator";
import { ChatComponent } from "../components/ChatComponent";
import { ErrorComponent } from "../components/ErrorComponent";
import Loader from "../components/Loader";
import { MeetVideoComponent } from "../components/VideoMeetComponent";
import { IChatConnectionConfig, ITokenResponse, IVideoConnectionConfig, SetupState } from "../interface/interfaces";

const useMeet = () => {
    const [tokensRetrivedStatus, setTokenStatus] = useState<SetupState>('loading');
    const location = useLocation()
    const pathValues = location.pathname.split('/')
    const channelName = pathValues[pathValues.length - 1]
    let username: string = String(localStorage.getItem('username'))


    const videoConfig = useRef<IVideoConnectionConfig>({
        appId: "",
        channelName: "",
        token: "",
        uid: ""
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
            uid: username,
            channelName
        }

        chatConfig.current = {
            appId: response.appId,
            token: response.tokens.rtmToken,
            uid: username,
            channelName
        }
        setTokenStatus(status)
    }
    useEffect(() => {
        if (tokensRetrivedStatus === 'loading') {
            try {
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
        chatConfig: chatConfig.current
    }
}

export const MeetScreen = () => {
    const { tokensRetrivedStatus, videoConfig, chatConfig } = useMeet()
    //make sure to set the current user details in the sessionStore before rendering the meet screen
    if (tokensRetrivedStatus === 'loading') {
        return <Loader />
    } else if (tokensRetrivedStatus === 'error') {
        return <ErrorComponent message="Error in joining meet. Please try again" />
    }


    console.log('forwarding configs', videoConfig, chatConfig, tokensRetrivedStatus)

    return <>
        <ChatComponent
            config={chatConfig} />
        <MeetVideoComponent
            config={videoConfig} />
    </>
}