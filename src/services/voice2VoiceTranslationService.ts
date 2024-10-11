import { Socket, io as createSocketConnection } from "socket.io-client";
import { WavRecorder, WavStreamPlayer } from "../lib/wavtools";
let dummyI = 0;
class Voice2VoiceTranslator {
    wavRecorder: WavRecorder = new WavRecorder({ sampleRate: 24000 })
    wavPlayer: WavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 })
    socket: Socket | undefined;
    languageCode: string
    isServiceActive: boolean
    recorderIntervalRef?: NodeJS.Timer

    constructor() {
        this.languageCode = ''
        this.isServiceActive = false
    }

    initTranslationServices = (
        socketEndPoint: string,
        userUid: string,
        channelName: string,
        languageCode: string,
        onTranscript: (uid: string, transcript: string) => void
    ) => {
        this.languageCode = languageCode
        this.socket = createSocketConnection(socketEndPoint, {
            query: {
                languageCode,
                userUid,
                channelName
            }
        })
        this.startMicAndSpeaker()
    }

    startMicAndSpeaker = async () => {
        await this.wavRecorder.begin()
        await this.wavPlayer.connect()
        this.socket?.on('translatedAudio', (audio, eventId) => {
            dummyI++
            if(dummyI%2){ // Temp Solution for multiple response on socket. May get fixed on release mode
                return
            }
            this.wavPlayer.add16BitPCM(new Int16Array(audio));
        });
    }

    stopTranslationService = async () => {
        if (this.isServiceActive === false) return
        this.isServiceActive = false
        this.mute()
        await this.wavRecorder.end();
        this.wavPlayer.interrupt();
        this.socket?.disconnect()
    }

    mute = async () => {
        try {
            this.isServiceActive = false
            await this.wavRecorder.pause();
            if (this.recorderIntervalRef)
                clearInterval(this.recorderIntervalRef)
        } catch (e: any) {
            console.log('Error in mute')
        }
    }
    unmute = async () => {
        await this.startMicAndSpeaker()
        await this.wavRecorder.record((data) => {
            this.socket?.emit('audioData', data.mono); // append this to open ai client on backend
        }); // send to socket
        // either use timer or when voice frequency goes down. Figure it out later. for now let it run on timer.
        this.recorderIntervalRef = setInterval(() => {
            this.socket?.emit('createResponse')
        }, 8000)
        this.isServiceActive = true
        // this.startRecording()
    }

    startRecording = () => {
        if (this.isServiceActive === false) return
        if (this.wavRecorder.getStatus() !== 'recording') {
            this.unmute()
        }
    }


}

// export const TmpAsync = async (userUid: string, channelName: string, languageCode: string, onTranscript: (uid: string, transcription: string) => void) => {}
export const voice2voiceTranslator = new Voice2VoiceTranslator()
