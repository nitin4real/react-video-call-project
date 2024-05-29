import { ConnectionService } from "./ConnectionService";

class ConnectionController {
    isConnectionEstablished: boolean
    connectionService: ConnectionService

    constructor() {
        this.isConnectionEstablished = false
        this.connectionService = new ConnectionService()
    }

    resetConnection() {
        this.isConnectionEstablished = false
        this.connectionService.logoutChat()
    }

    loginUser = (userName, onComplete: (isSuccess: boolean) => void) => {
        //convert userName to unique user ID
        // get user token and use it to login using the connection service 
        // this.connectionService.initWithUserNameAndToken()
        // onSuccess update the SessionStore with the currentuser and token
        // handle session expire by updating the token in session store
    }

    getTokenForUserLogin = (userId) => {

    }
}

export const connectionController = new ConnectionController()