import { UserData } from "../classes/userDataClass"

class SessionStore {
  currentUser: UserData
  sessionToken: string

  constructor() {
    this.sessionToken = ''
    this.currentUser = new UserData()
  }

  setSessionToken = (sessionToken: string) => {
    this.sessionToken = sessionToken
  }

  setCurrentUser = (userData: UserData) => {
    this.currentUser = userData
  }

}

export const sessionStore = new SessionStore()

//maintain all the users