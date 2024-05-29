import axios from "axios";

export const GenerateTokenForUserID = async (userId: string, channelName: string = '') => {
    try {
        const response = await axios.get(`http://192.168.63.114:3020/getToken`,{
            params: {
                userId
            }
        })
        console.log(response.data)
        return response.data
    }
    catch (e) {
        console.log(e)
        return ''
    }
}