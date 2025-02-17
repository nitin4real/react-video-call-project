import axios from "axios";
import { ENPOINTS } from "../constants/apiEndpoints";

interface StringMap {
    [key: string]: string;
}

class UserDataStore {
    isSelfRecorder: boolean
    uidMap: StringMap
    currentUserName: string
    channelName: string

    constructor() {
        this.isSelfRecorder = false
        this.uidMap = {}
        this.currentUserName = ""
        this.channelName = ""
    }

    setChannelName = (name: string) => {
        this.channelName = name
    }

    setIsRecorder = (status: boolean) => {
        this.isSelfRecorder = status
    }

    setCurrentUserName = (name: string) => {
        this.currentUserName = name
    }

    getCurrentUserName = (): string => {
        return this.currentUserName
    }

    registerUser = async (uid: String, channelName: String) => {
        if (this.uidMap.uid) {
            return
        }
        try {
            const response = await axios.get(`${ENPOINTS.BASE_URL}/getUserName`, {
                params: {
                    uid,
                    channelName
                },
            })

            const name = response.data.userName
            if (name)
                this.uidMap[`${uid}`] = name
            else
                this.uidMap[`${uid}`] = "user"
        }

        catch (e) {
            console.log("Error in retriving tokens")
        }
    }

    userLeft = async (uid: String, channelName: String) => {
        try {
            const response = await axios.post(`${ENPOINTS.BASE_URL}/user_left`, {
                user_id: uid,
                channel_name: channelName
            })
        }

        catch (e) {
            console.log("Error in user left api")
        }
    }


    getUserName = (uid: String): String => {
        return this.uidMap[`${uid}`]
    }
}

export const userDataStore = new UserDataStore()