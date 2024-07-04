import { Socket, io as createSocketConnection } from "socket.io-client";
import { ENPOINTS } from "../constants/apiEndpoints";

class TranslatorServices {
    userUid: string
    mediaRecorder: MediaRecorder;
    socket: Socket;
    audioPacket: string;
    languageCode: string

    constructor(socketEndPoint: string, stream: MediaStream, userUid: string, languageCode: string, onTranscript: (uid: string, transcript: string) => void) {
        this.userUid = userUid
        this.languageCode = languageCode
        this.mediaRecorder = new MediaRecorder(stream)
        this.socket = createSocketConnection(socketEndPoint, {
            query: {
                languageCode,
                userUid
            }
        })
        this.audioPacket = ''
        this.mediaRecorder.addEventListener('stop', this.restartRecording)
        this.startRecording()
        this.setTranslationListeners(onTranscript)
    }

    startRecording = () => {
        if (this.mediaRecorder.state !== 'recording') {
            this.mediaRecorder.addEventListener('dataavailable', this.onHandleAudioData)
            this.mediaRecorder.start(4000)
        } else {
            this.mediaRecorder.stop()
        }
    }

    restartRecording = () => {
        this.startRecording()
    }

    setTranslationListeners = (onTranscript: (uid: string, transcript: string) => void) => {
        this.socket.on('translationData', (translatedData: string, speakerId: string) => {
            //it may be possible that translatedData may only be available in string in that case parse the json
            onTranscript(speakerId, translatedData)
        })
    }


    onHandleAudioData = (audioRecordEventEvent: any) => {
        this.mediaRecorder.removeEventListener('dataavailable', this.onHandleAudioData)
        this.mediaRecorder.stop()
        this.sendAudioChunk(audioRecordEventEvent.data)
    }

    sendAudioChunk = (audioData: any) => {
        const audioChunks: BlobPart[] = [audioData]
        const audioBlob = new Blob(audioChunks);
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string
            const audioBase64 = result.split(',')[1];
            this.socket.emit('audioStream', audioBase64);
        };
        reader.readAsDataURL(audioBlob);
    }
}

let masterStream: MediaStream
export const TmpAsync = async (userUid: string, languageCode: string, onTranscript: (uid: string, transcription: string) => void) => {
    masterStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    new TranslatorServices(
        ENPOINTS.BASE_URL,
        masterStream,
        userUid,
        languageCode,
        onTranscript
    )
}

// at any time this socket will keep on reciving the translated text from someone // it should contain the following type