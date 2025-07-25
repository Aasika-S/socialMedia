import React,{useRef} from 'react'
import './register.css'
import axios from "axios";
import {useNavigate,Link} from 'react-router-dom'


export default function Register() {
    const email=useRef()
    const password=useRef()
    const passwordAgain=useRef()
    const username=useRef()
    const navigate=useNavigate()
    const client_server=process.env.REACT_APP_CLIENT_SERVER

     const handleClick=async (e)=>{
        e.preventDefault() //Page wont refresh
        if(passwordAgain.current.value!==password.current.value){
            password.current.setCustomValidity("Passwords don't match")
        }
        else{
            const user={
                username:username.current.value,
                email:email.current.value,
                password:password.current.value
            }
            try{
                await axios.post(client_server+'api/auth/register',user)
                navigate('/login')    

            }catch(err){
                console.log(err)
            }
            
        }
      }  

  return (
    <div className='login'>
        <div className="loginwrap">
            <div className="loginleft">
                <h3 className="loginlogo">B'daySocial</h3>
                <span className="logindesc">Connect with friends and the world around you on B'daySocial</span>
            </div>
            <div className="loginright">
                <form className="loginbox" onSubmit={handleClick}>
                    <input placeholder="Username" required ref={username} className="logininput" />
                    <input placeholder="Email" type='email' required ref={email} className="logininput" />
                    <input placeholder="Password" type='password' required ref={password} className="logininput" />
                    <input placeholder="Password again" type='password' required ref={passwordAgain} className="logininput" />
                    <button className='loginbutton' type='submit'>Sign Up</button>
                <Link to='/login' className='loginbtn'>
                    <button className='loginregisterbutton'>Log into your account</button>
                </Link>
                </form>
            </div>
        </div>
      
    </div>
  )
}
