
import { localService } from "../../service/localService";
import { USER_LOGIN, USER_SIGNUP } from "../contant/userContant";
import { userService } from "../../service/userService";

export const setLoginAction = (value) => {
    return {
        type : USER_LOGIN,
        payload: value,
    }
};

export const setSignUpAction = (value) => {
    return {
        type : USER_SIGNUP,
        payload: value,
    }
};

export const setUserInfo = (userInfo) => ({
    type: 'SET_USER_INFO',
    payload: userInfo,
  });

export const setLoginActionService = (value,onCompleted)=>{
    return(dispatch) => {
        userService.postLogin(value)
                .then((res) => {
            console.log(res);
            dispatch({
                type: USER_LOGIN,
                payload: res.data.content,
            });
            localService.set(res.data.content);
            onCompleted();
        }).catch((err) => {
            console.log(err);
        });
    }
}


export const setSignUpActionService = (value,onCompleted)=>{
    return(dispatch) => {
        userService.postSignUp(value)
                .then((res) => {
            console.log(res);
            dispatch({
                type: USER_SIGNUP,
                payload: res.data.content,
            });
            localService.set(res.data.content);
            onCompleted();
        }).catch((err) => {
            console.log(err);
        });
    }
}
