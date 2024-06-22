import axios from "axios";
import { localService } from "./localService";

export const BASE_URL="https://system-sales-jewelry.up.railway.app";

const TokenApp = "eyJhbGciOiJIUzUxMiJ9.eyJwaG9uZSI6IjEyMzQ1Njc4OTAiLCJyb2xlcyI6WyJST0xFX0NBU0hJRVJfU1RBRkYiLCJST0xFX1NBTEVTX1NUQUZGIl0sInVzZXJJZCI6MSwiaWF0IjoxNzE3MjI4NjcxLCJleHAiOjE3MTcyMzIyNzF9.CODCR8qh7Jf1813HSXs7lZjj3iialbtVBdNqmrC3W3Svw3CXa9UGw_ilJTABqxSQlXZqAcWGQnfeSjfruZt_uQ";


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