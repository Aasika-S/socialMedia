import React from 'react'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from "../../components/rightbar/Rightbar";
import './profile.css'
import { useEffect, useState } from "react";
import axios from "axios";
import {useParams} from 'react-router'

export default function Profile() {
  const PF=process.env.REACT_APP_PUBLIC_FOLDER
  const client_server = process.env.REACT_APP_CLIENT_SERVER;
  const [user,setUser]=useState({})
  const [post,setPost]=useState({})
  const username=useParams().username
  

    useEffect(()=>{
        const fetchUser=async ()=>{
        const res = await axios.get(`${client_server}api/users?username=${username}`);
        setUser(res.data)
        }
        fetchUser()
      },[username])

  return (
    <div>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profilecover">
              <img
                src={
                  user.coverpic ? PF + user.coverpic : PF + "posts/post4.jpg"
                }
                alt=""
                className="profileCoverImg"
              />
              <img
                src={
                  user.profilepic
                    ? user.profilepic
                    : PF + "people/noprofile.png"
                }
                alt=""
                className="profileUsrImg"
              />
            </div>
            <div className="profileinfo">
              <h4 className="profilename">{user.username}</h4>
              <span className="profiledesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            {/* profile in rb indicates that this is the rightbar in profile page */}
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
