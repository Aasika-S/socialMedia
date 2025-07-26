import React from 'react'
import Chris from './chris.jpg'
import './conversation.css'
import { useState,useEffect } from 'react'
import axios from 'axios'


export default function Conversation({conversation,currentUser}) {
const [user,setUser]=useState(null) 

const PF=process.env.REACT_APP_PUBLIC_FOLDER
const client_server = process.env.REACT_APP_CLIENT_SERVER;



useEffect(()=>{
  const friendId=conversation.members.find((m)=>m!==currentUser._id)
  const getUser= async ()=>{
    try{
      const res=await axios.get(client_server+"api/users?userId="+friendId)
      console.log(res.data)
      setUser(res.data)
    }catch(e){
      console.log(e)
    }
  }
  getUser()
},[conversation?.members, currentUser?._id])


  return (
    <div className="conversation">
      <img className="conversationimg" src={user?.profilepic?user?.profilepic:PF+'people/noprofile.png'} alt="hmm" />
      <span className="conversationName">{user?.username || "Loading..."}</span>
    </div>
  );
}
