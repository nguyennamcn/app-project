import { localService } from "../../service/localService";
import { SET_USER_INFO, USER_LOGIN } from "../contant/userContant";


const initialState = {
    userInfo: localService.get(),
};

let userReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_USER_INFO:
            return {
                ...state,
                userInfo: payload,
            };
        case USER_LOGIN: {
            return { ...state, userInfo: payload };
        }
        default:
            return state;
    }
}

export default userReducer;