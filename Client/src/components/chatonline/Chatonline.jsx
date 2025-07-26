import React from 'react'
import './chatonline.css'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'



export default function Chatonline({onlineUsers=[],currentId,setCurrentChat}) {
  const [friends,setFriends]=useState([])
  const [onlinefriends,setOnlinefriends]=useState([])
  const PF= process.env.REACT_APP_PUBLIC_FOLDER
  const client_server = process.env.REACT_APP_CLIENT_SERVER;



  useEffect(() => {
    const getFriends = async () => {
      if (!currentId) {
        setFriends([]);
        return;
      }
      try {
        const res = await fetch(`${client_server}api/users/friends/${currentId}`);
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        const data = await res.json();
        setFriends(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching friends for Chatonline:', err);
        setFriends([]); // Set to empty array on error to prevent .map crash
      }
    };
    getFriends();
  }, [currentId, client_server]);

  useEffect(()=>{
    if (friends && onlineUsers) {
      setOnlinefriends(friends.filter((f) => onlineUsers.includes(f._id)));
    } else {
      setOnlinefriends([]); // fallback when one of them is empty
    }
  },[friends,onlineUsers])
  console.log("IMMMM",onlineUsers)

  const handleClick=async (user)=>{
    try{
      const res = await axios.get(
        `${client_server}api/conversations/find/${currentId}/${user?._id}`
      );
      setCurrentChat(res.data);
    }catch(e){
      console.log(e)
    }
  
  }
  
  return (
    <div className="chatonline">
      {friends.map((o) => (
        <div className="chatonlinefriend" onClick={() => handleClick(o)} key={o?._id}>
          <div className="chatonlineimgcont">
            <img src={o?.profilepic?PF+o?.profilepic:PF+"people/noprofile.png"} alt="" className="chatonlineimg" />
            <div className="chatonlinebadge"></div>
          </div>
          <span className="chatonlinename">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
