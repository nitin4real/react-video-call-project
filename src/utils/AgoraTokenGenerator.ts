import axios from "axios";
import { SetupState } from "../interface/interfaces";
import { ITokenResponse } from "../interface/interfaces";
class AgoraTokenHelper {
    isOccupied: boolean = false
    GenerateTokenForUserID = async (
        userId: string, channelName: string = '',
        onComplete: (status: SetupState, response: ITokenResponse) => void
    ) => {
        if (this.isOccupied) return
        this.isOccupied = true
        try {
            const response = await axios.get(`https://nitinsingh.in:3012/getToken`, {
                params: {
                    userId,
                    channelName
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
                    rtcToken: ""
                },
                uid: ""
            })
        }

        this.isOccupied = false
    }
}

const tokenGenerator = new AgoraTokenHelper()
export { tokenGenerator }