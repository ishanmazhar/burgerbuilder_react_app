import * as actionTypes from './actionTypes';
import axios from 'axios';
import jwt_decode from 'jwt-decode'; 

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        payload: {
            token: token,
            userId: userId, 
        }
    }
}

export const authLoading = isLoading => {
    return {
        type: actionTypes.AUTH_LOADING,
        payload: isLoading,
    }
}

export const authFailed = errMsg => {
    return {
        type: actionTypes.AUTH_FAILED,
        payload: errMsg,
    }
}


// FOR FIREBASE AUTH

// export const auth = (email, password, mode) => dispatch => {
//     dispatch(authLoading(true));
//     const authData = {
//         email: email,
//         password: password, 
//         returnSecureToken: true, 
//     }

//     let authUrl = null;
//     if(mode === "Sign Up") {
//         authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
//     } else {
//         authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
//     }

//     const API_KEY = "AIzaSyBbUFp9mIbSM9YD3kD_J9CwN6fswZ4bDNU"; 

//     axios.post(authUrl + API_KEY, authData)
//         .then(response => {
//             dispatch(authLoading(false)); 
//             localStorage.setItem('token', response.data.idToken);
//             localStorage.setItem('userId', response.data.localId);
//             const expirationTime = new Date(new Date().getTime() + response.data.expiresIn * 1000); 
//             localStorage.setItem('expirationTime', expirationTime); 
//             dispatch(authSuccess(response.data.idToken, response.data.localId));
//         })
//         .catch(err => {
//             dispatch(authLoading(false)); 
//             console.log(err.response); 
//             dispatch(authFailed(err.response.data.error.message));
//         })
// }


// FOR BURGER-BUILDER-API AUTH

export const auth = (email, password, mode) => dispatch => {
    dispatch(authLoading(true));
    const authData = {
        email: email,
        password: password, 
    }

    let url = process.env.REACT_APP_BACKEND_URL;
    let authUrl = null;
    if(mode === "Sign Up") {
        authUrl = `${url}/user`;
    } else {
        authUrl = `${url}/user/auth`;
    }
    axios.post(authUrl, authData)                   
        .then(response => {
            dispatch(authLoading(false)); 
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.user._id);
            let decoded = jwt_decode(response.data.token); 
            const expirationTime = new Date(decoded.exp * 1000); // conversion to mili sec
            localStorage.setItem('expirationTime', expirationTime); 
            dispatch(authSuccess(response.data.token, response.data.user._id));
        })
        .catch(err => {
            dispatch(authLoading(false)); 
            console.log(err.response); 
            dispatch(authFailed(err.response.data));
        })
}




export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userId'); 
    return {
        type: actionTypes.AUTH_LOGOUT,
    }
}

export const authCheck = () => dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Logout
        dispatch(logout());  
    } else {
        const expirationTime = new Date(localStorage.getItem('expirationTime')); 
        if (expirationTime <= new Date()) {
            // Logout 
            dispatch(logout());  
        } else {
            const userId = localStorage.getItem('userId'); 
            dispatch(authSuccess(token, userId)); 
        }
    }
}
