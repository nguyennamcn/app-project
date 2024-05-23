import axios from "axios";
import { BASE_URL, configHeader } from "./config"

export const userService = {
    postLogin :(loginForm)=>{
        return axios({
            url: `${BASE_URL}/api/v1/users/login`,
            method: "POST",
            headers: configHeader(),
            data: loginForm,
        })
    },
    postSignUp :(signUpForm)=>{
        return axios({
            url: `${BASE_URL}/login`,
            method: "POST",
            headers: configHeader(),
            data: signUpForm,
        })
    }
}