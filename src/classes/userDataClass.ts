
export class UserData {
  userName: string
  userImage: string
  userId: string

  constructor(userId = '', userName = 'Guest', userImage = '') {
    this.userId = userId
    this.userName = userName
    this.userImage = userImage
  }

  setUserName = (userName: string) => {
    this.userName = userName
  }

  setUserImage = (userImage: string) => {
    this.userImage = userImage
  }

  setUserId = (userId: string) => {
    this.userId = userId
  }
}
