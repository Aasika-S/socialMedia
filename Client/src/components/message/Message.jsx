import React, { useState } from 'react'
import './message.css'
import Chris from '../conversations/chris.jpg'
import {format} from 'timeago.js'
import axios from 'axios'
import { useEffect } from 'react'


export default function Message({message,own}) {
  const PF=process.env.REACT_APP_PUBLIC_FOLDER
  const client_server = process.env.REACT_APP_CLIENT_SERVER;
  const [sender,setSender]=useState(null)

  useEffect(()=>{
    const getSender = async () => {
      try {
        const res = await axios.get(
          client_server+"api/users?userId=" + message.sender
        );
        setSender(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getSender();
  }, [message.sender])

  return (
    <div className={own ? "message own" : "message"}>
      <div className="msgtop">
        <img
          className="msgimg"
          src={
            sender?.profilepic
              ? PF + sender.profilepic
              : PF + "people/noprofile.png"
          }
          alt=""
        />
        <p className="msgtext">{message.text}</p>
      </div>
      <div className="msgbottom">{format(message.createdAt)}</div>
    </div>
  );
}
