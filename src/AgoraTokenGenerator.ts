import axios from "axios";
import { SetupState } from "./interface/interfaces";
import { ITokenResponse } from "./interface/interfaces";

class AgoraTokenHelper {
    isOccupied: boolean = false
    GenerateTokenForUserID = async (
        userId: string, channelName: string = '',
        onComplete: (status: SetupState, response: ITokenResponse) => void
    ) => {
        if (this.isOccupied) return
        this.isOccupied = true
        try {
            console.log('attempt to get token')
            const response = await axios.get(`http://localhost:3013/getToken`, {
                params: {
                    userId,
                    channelName
                }
            })
            console.log(response.data)
            onComplete('success', response.data)
        }

        catch (e) {
            console.log("Error in retriving tokens")
            onComplete('error', {
                appid: "",
                tokens: {
                    rtmToken: "",
                    rtcToken: ""
                }
            })
        }

        this.isOccupied = false
    }
}

const tokenGenerator = new AgoraTokenHelper()
export { tokenGenerator }