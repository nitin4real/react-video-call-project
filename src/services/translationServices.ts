import { Socket, io as createSocketConnection } from "socket.io-client";

class TranslatorServices {
    mediaRecorder: MediaRecorder | undefined;
    socket: Socket | undefined;
    audioPacket: string;
    languageCode: string
    audioStream: MediaStream | undefined
    isServiceActive: boolean

    constructor() {
        this.audioPacket = ''
        this.languageCode = ''
        this.isServiceActive = false
    }

    initTranslationServices = (socketEndPoint: string, userUid: string, channelName: string, languageCode: string, onTranscript: (uid: string, transcript: string) => void) => {
        this.languageCode = languageCode
        this.socket = createSocketConnection(socketEndPoint, {
            query: {
                languageCode,
                userUid,
                channelName
            }
        })
        this.setTranslationListeners(onTranscript)
    }

    stopTranslationService = () => {
        if (this.isServiceActive === false) return
        this.isServiceActive = false
        this.mute()
        this.socket?.disconnect()
    }

    mute = () => {
        this.isServiceActive = false
        this.mediaRecorder?.stop()
        let tracks = this.audioStream?.getTracks();
        tracks?.forEach((track) => {
            track.stop();
        });
    }

    unmute = async () => {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        this.audioStream = audioStream
        this.mediaRecorder = new MediaRecorder(audioStream)
        this.mediaRecorder.addEventListener('stop', this.restartRecording)
        this.isServiceActive = true
        this.startRecording()
    }

    startRecording = () => {
        if (this.isServiceActive === false) return
        if (this.mediaRecorder?.state !== 'recording') {
            this.mediaRecorder?.addEventListener('dataavailable', this.onHandleAudioData)
            this.mediaRecorder?.start(4000)
        } else {
            this.mediaRecorder?.stop()
        }
    }

    restartRecording = () => {
        if (this.isServiceActive === false) return
        this.startRecording()
    }

    setTranslationListeners = (onTranscript: (uid: string, transcript: string) => void) => {
        this.socket?.on('translationData', (translatedData: string, speakerId: string) => {
            onTranscript(speakerId, translatedData)
        })
    }


    onHandleAudioData = (audioRecordEventEvent: any) => {
        if (this.isServiceActive === false) return
        this.mediaRecorder?.removeEventListener('dataavailable', this.onHandleAudioData)
        this.mediaRecorder?.stop()
        this.sendAudioChunk(audioRecordEventEvent.data)
    }

    sendAudioChunk = (audioData: any) => {
        const audioChunks: BlobPart[] = [audioData]
        const audioBlob = new Blob(audioChunks);
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string
            const audioBase64 = result.split(',')[1];
            this.socket?.emit('audioStream', audioBase64);
        };
        reader.readAsDataURL(audioBlob);
    }
}

// let masterStream: MediaStream
export const TmpAsync = async (userUid: string, channelName: string, languageCode: string, onTranscript: (uid: string, transcription: string) => void) => {
    // masterStream = await navigator.mediaDevices.getUserMedia({ audio: true })
}
export const translator = new TranslatorServices()
