import axios from "axios";
import { localService } from "./localService";

export const BASE_URL="https://check-production-d237.up.railway.app";

const TokenApp = "";


export const configHeader = () => {
    return{
        TokenApp: TokenApp,
        Authorization: "bearer" + localService.get()?.accessToken,
        // ? là optional chaining
    }   
}

export const https=axios.create({
    baseURL: BASE_URL,
    headers: configHeader(),
})