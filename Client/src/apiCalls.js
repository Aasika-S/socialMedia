import axios from "axios"

export const loginCall= async (userCreds,dispatch)=>{
    const client_server = process.env.REACT_APP_CLIENT_SERVER;
    dispatch({type:"LOGIN_START"})
    try{
        const res = await axios.post(
          client_server + "api/auth/login",
          userCreds
        );
        dispatch({type:"LOGIN_SUCCESS",payload:res.data})
    }catch(err){
        dispatch({type:"LOGIN_FAILURE",payload:err})
    }
}