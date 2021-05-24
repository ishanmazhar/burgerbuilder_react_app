import * as actionTypes from './actionTypes';
import axios from 'axios';

export const auth = (email, password, mode) => dispatch => {
    const authData = {
        email: email,
        password: password, 
        returnSecureToken: true, 
    }

    let authUrl = null;
    if(mode === "Sign Up") {
        authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
    } else {
        authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
    }
    const API_KEY = "AIzaSyBbUFp9mIbSM9YD3kD_J9CwN6fswZ4bDNU"; 
    axios.post(authUrl + API_KEY, authData) 
    .then(response => console.log(response))
}
