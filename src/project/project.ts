import AgoraRTM from 'agora-rtm-sdk'
// import AgoraRTC, { CameraVideoTrackInitConfig } from 'agora-rtc-sdk-ng'


const tempToken = ''
const APP_ID = ""
const token = ''
const uid = ''
const channelName = 'mainchatroom'


export async function setUpProject(c: string = '') {
  // const client = AgoraRTC.createClient({
  //     codec: 'h264',
  //     mode: 'live'
  // })

  // await client.join('6a0d0b12f6074aad818c99ff9355d444', 'main', null)

  // const videoTrack = AgoraRTC.createCameraVideoTrack()
  // console.log(await AgoraRTC.getCameras())
  // setUpChat()
}

export async function loginUserByUserName(userName: string) {
  //this function should take input only username create a unique id and get the token for the userId, 
  //after successful login this function should return a success object with the following data
  //: userId
  //: userName
  //: sessionToken
  //: 
}


export const initWithUserNameAndToken = async (uid: string, token: string, onComplete: (status: boolean) => void) => {
  await setUpChat(uid, token)
  onComplete(false)
}

let signalingEngine: any

export async function setUpChat(uid: string, token: string) {

  signalingEngine = new AgoraRTM.RTM(APP_ID, uid, { token, logLevel: 'none', });
  signalingEngine.addEventListener('message', (eventArgs: any) => {
    console.log(`${eventArgs.publisher}: ${eventArgs.message}`);
  })


  // const channelObj = await signalingEngine.subscribe(channelName)

  await signalingEngine.logout();
  try {
    await signalingEngine.login();
    await subscribe()
    console.log('-------successfully loged in ')
  } catch (err) {
    console.log({ err }, '-----------error occurs at login.');
  }

}

const subscribe = async () => {
  const channelName = 'mainchatroom'
  try {
    const subscribeOptions = {
      withMessage: true,
      withPresence: true,
      withMetadata: true,
      withLock: true,
    };
    await signalingEngine.subscribe(channelName, subscribeOptions);
  } catch (error) {
    console.log(error);
  }
};

export const sendMessage = (message: string) => {
  signalingEngine.publish('mainchatroom', message)
}

// async function getCamaras() {
//     AgoraRTC.getDevices()
//     const camara = await AgoraRTC.getCameras()
//     const frontCamara = camara[0]
// }

