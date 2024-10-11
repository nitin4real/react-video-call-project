import { useCallback, useRef, useState } from "react";
import { WavRecorder, WavStreamPlayer } from "../lib/wavtools";

export const useTranslation = () => {
    // create recorder and player here return a control to play pause maybe
    // expose start the controller here
    const socketConnection = useRef()
    const wavRecorderRef = useRef<WavRecorder>(
        new WavRecorder({ sampleRate: 24000 })
    );
    const wavStreamPlayerRef = useRef<WavStreamPlayer>(
        new WavStreamPlayer({ sampleRate: 24000 })
    );
    const client: any = null // :TODO this should be a backend socket

    const [isConnected, setIsConnected] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const recordWindow = useCallback(async () => {
        const wavRecorder = wavRecorderRef.current;
        // either start a setInterval of 2 seconds or as soon as the wavRecorder Goes to a really low volumn send stuff
        // another way is to tell open ai to use voice activity detection -> server_vad -> Keep a button on the screen to switch among these
        await wavRecorder.record((data) => client.appendInputAudio(data.mono));
        setInterval(() => {
            client.createResponse();
        }, 3000);
    }, []);

    /**
     * Connect to conversation:
     * WavRecorder taks speech input, WavStreamPlayer output, client is API client
     */
    const connectConversation = useCallback(async () => {
        const wavRecorder = wavRecorderRef.current;
        const wavStreamPlayer = wavStreamPlayerRef.current;
        await wavRecorder.begin();
        // await wavStreamPlayer.connect();
        setIsConnected(true);
    }, []);

    /**
     * Disconnect and reset conversation state
     */

    const disconnectConversation = useCallback(async () => {
        setIsConnected(false);
        const wavRecorder = wavRecorderRef.current;
        await wavRecorder.end();

        const wavStreamPlayer = wavStreamPlayerRef.current;
        await wavStreamPlayer.interrupt();
    }, []);


    return {

    };
};
