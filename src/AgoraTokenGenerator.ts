import axios from "axios";

export const GenerateTokenForUserID = async (userId: string, channelName: string = '') => {
    try {
        console.log('attempt to get token')
        const response = await axios.get(`https://nitinsingh.in:3012/getToken`,{
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