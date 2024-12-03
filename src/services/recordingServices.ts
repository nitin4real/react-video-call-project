import axios from "axios";
import { ENPOINTS } from "../constants/apiEndpoints";

export class RecordingServices {
    public static async startRecording(channelName: string): Promise<any> {
        const startResposne =  await axios.get(`${ENPOINTS.BASE_URL}/startRecording`, {
            params: {
                channelName
            }
        });
        if(startResposne.status === 200) {
            return startResposne.data.status;
        }
    }

    public static async stopRecording(channelName: string): Promise<any> {
        const stopResposne =  await axios.get(`${ENPOINTS.BASE_URL}/stopRecording`, {
            params: {
                channelName
            }
        });
        if(stopResposne.status === 200) {
            return stopResposne.data.status;
        }
    }

    public static async isRecording(channelName: string): Promise<boolean> {
        const stopResposne =  await axios.get(`${ENPOINTS.BASE_URL}/isRecordingRunning`, {
            params: {
                channelName
            }
        });
        if(stopResposne.status === 200) {
            return stopResposne.data.isRecordingRunning === 'true';
        } else {
            return false;
        }
    }
}