import { createContext, useReducer } from "react"
import AuthReducer from "./AuthReducer"

const storedUser = localStorage.getItem("user");
let initialUser = null;
try {
  initialUser = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  console.error("Failed to parse user from localStorage", error);
  localStorage.removeItem("user"); // Clear invalid data
  initialUser = null;
}

const INITIAL_STATE = {
  // user:{
  //     _id: "67fd2842d95b8ae50ccfc118",
  //     username:"Test",
  //     email:"test@gmail.com",
  //     password:"$2b$10$.NITnMTRCjx3.P/mfira8.PxDKQap/3Ush4y83FHOd3.0OGuQnneK",
  //     profilepic:"",
  //     coverpic:"",
  //     followers:[],
  //     following:[]
  // },
  user: initialUser,
  isFetching: false,
  error: false,
};

export const AuthContext=createContext(INITIAL_STATE)

export const AuthContextProvider=({children})=>{
    const [state,dispatch]=useReducer(AuthReducer,INITIAL_STATE)

    return(
        <AuthContext.Provider value={{user:state.user,isFetching:state.isFetching,error:state.error,dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}
