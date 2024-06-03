import axios from "axios";

interface StringMap {
    [key: string]: string;
}

class UserDataStore {
    uidMap: StringMap
    currentUserName: string

    constructor() {
        this.uidMap = {}
        this.currentUserName = ""
    }

    setCurrentUserName = (name: string) => {
        this.currentUserName = name
    }

    getCurrentUserName = (): string => {
        return this.currentUserName
    }

    registerUser = async (uid: String) => {
        if (this.uidMap.uid) {
            return
        }
        try {
            const response = await axios.get(`https://nitinsingh.in:3012/getUserName`, {
                params: {
                    uid
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

    getUserName = (uid: String): String => {
        return this.uidMap[`${uid}`]
    }
}

export const userDataStore = new UserDataStore()