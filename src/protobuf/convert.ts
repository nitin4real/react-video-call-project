import ProtoBuf from './SttMessage.js';
export interface ITextstream {
    dataType: "transcribe" | "translate"
    culture: string
    uid: string | number
    startTextTs: number
    textTs: number
    time: number
    durationMs: number
    words: any[]
    trans?: any[]
}

export const convertProtobufToTextStream = (payload: any) => {
    const textstream = ProtoBuf.Agora.SpeechToText.lookup("Text").decode(payload) as ITextstream
    return textstream
}