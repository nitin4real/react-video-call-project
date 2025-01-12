import axios from "axios";
import { ENPOINTS } from "../constants/apiEndpoints";
import { ITokenResponse, SetupState } from "../interface/interfaces";

class AgoraTokenHelper {
    isOccupied: boolean = false
    GenerateTokenForUserID = async (
        userId: string, channelName: string = '', language: string = '', isRecorder: boolean = false,
        onComplete: (status: SetupState, response: ITokenResponse) => void
    ) => {
        if (this.isOccupied) return
        this.isOccupied = true
        try {
            const response = await axios.get(`${ENPOINTS.BASE_URL}/getToken`, {
                params: {
                    userId,
                    channelName,
                    language,
                    isRecorder
                },
            })
            onComplete('success', response.data)
        }

        catch (e) {
            console.log("Error in retriving tokens")
            onComplete('error', {
                appId: "",
                tokens: {
                    rtmToken: "",
                    rtcToken: "",
                    chatToken: "",
                    chatRoomId: "",
                },
                uid: "",
                appkey: ""
            })
        }

        this.isOccupied = false
    }
}

const tokenGenerator = new AgoraTokenHelper()
export { tokenGenerator };
