const AuthReducer=(state,action)=>{
    switch (action.type) {
      case "LOGIN_START":
        return {
          user: null,
          isFetching: true,
          error: false,
        };
      case "LOGIN_SUCCESS":
        localStorage.setItem("user", JSON.stringify(action.payload));
        return {
          user: action.payload,
          isFetching: false,
          error: false,
        };
      case "LOGIN_FAILURE":
        localStorage.removeItem("user");
        return {
          user: null,
          isFetching: false,
          error: action.payload,
        };
      case "LOGOUT": 
        localStorage.removeItem("user");
        return {
          user: null,
          isFetching: false,
          error: false,
        };
      case "FOLLOW":
        return {
          ...state, //fetch prev state
          user: {
            ...state.user,
            following: [...state.user.following, action.payload],
          },
        };
      case "UNFOLLOW":
        return {
          ...state, //fetch prev state
          user: {
            ...state.user,
            following: state.user.following.filter((f) => f !== action.payload),
          },
        };
      default:
        return state;
    }
}

export default AuthReducer;