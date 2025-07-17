export const LoginStart=(userCreds)=>({
    type:"LOGIN_START",
})
export const LoginSuccess=(user)=>({
    type:"LOGIN_SUCCESS",
    payload:user, //goes to reducer
})
export const LoginFailure=(error)=>({
    type:"LOGIN_FAILURE",
    payload:error, //goes to reducer
})
export const Follow=(userId)=>({
    type:"FOLLOW",
    payload:userId,
})
export const Unfollow=(userId)=>({
    type:"UNFOLLOW",
    payload:userId,
})
export const Logout = () => ({
  type: "LOGOUT",
});
