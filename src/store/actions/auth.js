import * as actionTypes from './actionTypes'
import axios from 'axios'

export const authStart = () =>{
    return{
        type: actionTypes.AUTH_START
    }
}

export const authSuccess =(idToken, userId) =>{
    return {
        type: actionTypes.AUTH_SUCCESS,
       idToken: idToken,
       userId: userId,
 
    };
}

export const authFail = (error) =>{
 
    return{
        type: actionTypes.AUTH_FAIL,
        error: error,
    }
   
}
export const logout = () =>{
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('userId')
    return {
        type: actionTypes.AUTH_LOGOUT 
    }
}

export  const checkAutTimeout = (expirationTime) =>{
    return dispatch =>{
        setTimeout(()=>{
            dispatch(logout())
        }, expirationTime * 1000)
    }
}

export const auth = (email, password, isSignup) => {
    return dispatch =>{
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true,

        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAxmde381Rd9S9xOYPHyqFzBh1S_ZJBnqk';
        if(!isSignup){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAxmde381Rd9S9xOYPHyqFzBh1S_ZJBnqk';
        }
  
        
        axios.post(url, authData )
        .then(response=>{
            const expirationDate= new Date (new Date().getTime() + response.data.expiresIn * 1000) 
          localStorage.setItem('token', response.data.idToken)
          localStorage.setItem('expiration',expirationDate)
          localStorage.setItem('userId',response.data.localId)
          dispatch(authSuccess(response.data.idToken, response.data.localId)),
          dispatch(checkAutTimeout(response.data.expiresIn))

          
        })
        .catch(error=>{
         
          dispatch(authFail(error.response.data.error))
         
        })


        dispatch(authStart());
    };
}

export const setAuthRedirectPath = (path) =>{
    return{
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path,
    }
}

export const authCheckState = ()=>{
    return dispatch=>{
        const token = localStorage.getItem('token');
        if(!token) {
            dispatch(logout())
        }else{
            const expiration = new Date(localStorage.getItem('expiration'))
            if(expiration <= new Date()){
                dispatch(logout())
         
            
            }else{
               
                const userId = localStorage.getItem('userId')
                dispatch(authSuccess(token, userId))
                dispatch(checkAutTimeout((expiration.getTime() - new Date().getTime())/1000))
            }
        }
        
        }  
    
}