import axios from "axios";
import Constant from "../constant/Constant";
import AuthenticateUserDto from "../Model/AuthenticateUserDto";


export default class HttpService {

    headers: any = {
        'Content-Type': 'application/json'
    }

    public authenticateUser(body: AuthenticateUserDto): any {
        // return axios.post(Constant.BASE_URL + Constant.AUTHENTICATE_USER, JSON.stringify(body))
        return axios({
            method: 'post',
            url: Constant.BASE_URL + Constant.AUTHENTICATE_USER,
            data: JSON.stringify(body),
            headers: this.headers
        })
    }

}