import AgoraRTM, { RTMClient } from 'agora-rtm-sdk'
import AgoraRTC, { CameraVideoTrackInitConfig, IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'


const tempToken = ''
const APP_ID = ""
const token = ''
const uid = ''
const channelName = 'mainchatroom'


export async function loginUserByUserName(userName: string) {
  //this function should take input only username create a unique id and get the token for the userId, 
  //after successful login this function should return a success object with the following data
  //: userId
  //: userName
  //: sessionToken
  //: 
}


export const initWithUserNameAndToken = async (uid: string, tokens: { rtcToken: string, rtmToken: string }, appId: string, onComplete: (status: boolean) => void) => {
  await setUpChat(uid, tokens.rtmToken, appId)
  await setUpVideo(uid, tokens.rtcToken, appId)
  onComplete(false)
}

const AgoraRTCManager = async (eventsCallback: any) => {
  let agoraEngine = null;
  // Setup done in later steps
};

const setUpVideo = async (uid: string, token: string, appId: string) => {
  let channelParameters = {
    // A variable to hold a local audio track.
    localAudioTrack: null,
    // A variable to hold a local video track.
    localVideoTrack: null,
    // A variable to hold a remote audio track.
    remoteAudioTrack: null,
    // A variable to hold a remote video track.
    remoteVideoTrack: null,
    // A variable to hold the remote user id.s
    remoteUid: null,
  };
  const client = AgoraRTC.createClient({
    codec: 'h264',
    mode: 'live'
  })
  client.setClientRole('host')

  await join(client, {
    appId,
    channelName,
    token,
    uid
  })

  const eventsCallback = (type: string, user: IAgoraRTCRemoteUser, mediaType: string) => {
    console.log(type, user, mediaType)
  }

  client.on("user-published", async (user, mediaType) => {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await client.subscribe(user, mediaType);
    console.log("subscribe success");
    eventsCallback("user-published", user, mediaType)
  });

  // Listen for the "user-unpublished" event.
  client.on("user-unpublished", (user) => {
    console.log(user.uid + "has left the channel");
  });


  console.log('---setting up video', token, uid, appId)
}

const join = async (agoraEngine: IAgoraRTCClient, config: any) => {
  var videoElement = document.createElement('video');
  var videoElement2 = document.createElement('video');

  videoElement.setAttribute('width', '640');
  videoElement.setAttribute('height', '360');
  videoElement.setAttribute('controls', 'controls');

  videoElement2.setAttribute('width', '640');
  videoElement2.setAttribute('height', '360');
  videoElement2.setAttribute('controls', 'controls');

  let channelParameters: any

  try {
    channelParameters = {
      localAudioTrack: await AgoraRTC.createMicrophoneAudioTrack(),
      localVideoTrack: await AgoraRTC.createCameraVideoTrack()
    }

    await agoraEngine.join(
      config.appId,
      config.channelName,
      config.token,
      config.uid
    );
    await agoraEngine.publish([
      channelParameters.localAudioTrack,
      channelParameters.localVideoTrack,
    ]);
  } catch (e) {
    console.log('error ---', e)
  }
  // Create a local audio track from the audio sampled by a microphone.
  // Create a local video track from the video captured by a camera.
  // channelParameters.localVideoTrack =
  // Append the local video container to the page body.

  // videoElement
  // videoElement2

  const videoArray = [videoElement, videoElement2]
  const videoGorup: any = document.getElementById('video-group')
  videoArray.forEach((elemnt) => {
    videoGorup.append(elemnt);
  })


  // Publish the local audio and video tracks in the channel.
  // Play the local video track.

  channelParameters.localVideoTrack.play(videoElement);
};

export async function setUpProject(c: string = '') {



  // const videoTrack = AgoraRTC.createCameraVideoTrack()
  // console.log(await AgoraRTC.getCameras())
  // setUpChat()
}

let signalingEngine: RTMClient

export async function setUpChat(uid: string, token: string, appId: string) {

  signalingEngine = new AgoraRTM.RTM(appId, uid, { token, logLevel: 'none', });
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

