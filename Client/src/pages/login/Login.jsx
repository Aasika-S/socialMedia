import React,{useRef,useContext} from 'react'
import './login.css'
import {loginCall} from '../../apiCalls'
import { AuthContext } from '../../context/AuthContext'
import { CircularProgress } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Login(){
  const email=useRef()
  const password=useRef()
  const {user,isFetching,error,dispatch}=useContext(AuthContext)
//   const navigate=useNavigate()

  
  const handleClick=(e)=>{
    e.preventDefault() //Page wont refresh
    console.log(email.current.value)
    loginCall({email:email.current.value,password:password.current.value},dispatch)
  }  
  console.log(user);
  
  return (
    <div className="login">
      <div className="loginwrap">
        <div className="loginleft">
          <h3 className="loginlogo">B'daySocial</h3>
          <span className="logindesc">
            Connect with friends and the world around you on B'daySocial
          </span>
        </div>
        <div className="loginright">
          <form className="loginbox" onSubmit={handleClick}>
            <input placeholder="Email" type="email" className="logininput" ref={email}/>
            <input
              placeholder="Password"
              type="password"
              required
              minLength={6}
              className="logininput"
              ref={password}
            />
            <button disabled={isFetching} className="loginbutton">{isFetching ? <CircularProgress color='white' size={'20px'}/> : "Login"}</button>
            <span className="loginforgot">Forgot Password?</span>
          <Link to={'/register'} className='loginbtn'>
                <button className="loginregisterbutton">{isFetching ? <CircularProgress color='white' size={'20px'}/> : "Register now"}</button>
          </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
