import axios from "axios";

export default () => {

    const authenticateUser = (body: any) => {
        return axios.post('', body)
    }

}