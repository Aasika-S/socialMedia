import React from 'react'
import './close.css'
import { Add, Remove } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";



export default function Close({user}) {
  const PF=process.env.REACT_APP_PUBLIC_FOLDER
  const client_server = process.env.REACT_APP_CLIENT_SERVER;
  const [friends,setFriends]=useState([])
  const {user:currentUser,dispatch}=useContext(AuthContext)
  const [followed,setFollowed]=useState(currentUser.following.includes(user?._id))
  
    useEffect(()=>{
      setFollowed(currentUser.following.includes(user?._id))
      console.log("FOLLOWED?????",followed)
      console.log("Curr user",currentUser._id)
      console.log("Curr userame",currentUser.username)
      console.log("Following List:", currentUser.following);
      console.log("User ID:", currentUser?._id);
    },[currentUser,user])
  
    const handleClick=async ()=>{
      try{
        if(followed){
          await axios.put(`${client_server}api/users/${user._id}/unfollow`,{userId:currentUser._id})
          dispatch({type:"UNFOLLOW",payload:user._id})
        }
        else{
          await axios.put(`${client_server}api/users/${user._id}/follow`, {
            userId: currentUser._id,
          });
          dispatch({ type: "FOLLOW", payload: user._id });
        }
  
         const res = await axios.get(
           `${client_server}api/users?userId=${currentUser._id}`
         );
         dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  
        
      }catch(e){
        console.log(e)
      }
      setFollowed(!followed);
    
    }
  
    useEffect(() => {
      const getFriends = async () => {
        try {
          const friends = await axios.get(
            `${client_server}api/users/friends/${user._id}`
          );
          setFriends(friends.data);
        } catch (err) {
          console.log(err);
        }
      };
      if (user && user._id) {
        getFriends();
      }
    }, [user]);
  return (
    <li className="sidebarfriend">
      <div className="nameFollow">
        <img
          src={
            user.profilepic ? user.profilepic : PF + "people/noprofile.png"
          }
          alt=""
          className="sidebarfriendImg"
        />

        <span className="sidebarfriendname">{user.username}</span>
        <button className="rightbarfollowbutton" onClick={handleClick}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <Remove /> : <Add />}
        </button>
      </div>
    </li>
  );
}
