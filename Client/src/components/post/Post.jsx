import React from "react";
import "./post.css";
import { MoreVert, ThumbUp, Favorite } from "@mui/icons-material";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import {format} from 'timeago.js'
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


export default function Post({ post }) {
  const PF=process.env.REACT_APP_PUBLIC_FOLDER
  const client_server = process.env.REACT_APP_CLIENT_SERVER;
  const [like,setLike]=useState(post.likes.length)
  const [isliked,setisLiked]=useState(false) //initially nothing liked
  const [user,setUser]=useState({})
  const {user:currentUser}=useContext(AuthContext)
  // const [posts,setPosts]=useState([])
  useEffect(()=>{
    setisLiked(post.likes.includes(currentUser._id))
  },[currentUser._id,post.likes])
  useEffect(()=>{
      const fetchUser=async ()=>{
      const res = await axios.get(`${client_server}api/users?userId=${post.userId}`);
      setUser(res.data)
      }
      fetchUser()
    },[post.userId])

  const likeHandler=()=>{
    try{
      axios.put(`${client_server}api/posts/${post._id}/like`,{userId:currentUser._id})
    }catch(err){
      console.log(err)
    }
    setLike(isliked?like-1:like+1)
    setisLiked(!isliked)
    // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  }
  return (
    <div className="post">
      <div className="postwrap">
        <div className="posttop">
          <div className="posttopleft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postprofileimg"
                src={user.profilepic?PF+user.profilepic:PF+'people/noprofile.png'}
                alt="profile"
              />
            </Link>
            <span className="postuname">
              {user.username}
            </span>
            <span className="postdate">{format(post.createdAt)}</span>
          </div>
          <div className="posttopright">
            <MoreVert />
          </div>
        </div>
        <div className="postcenter">
          <span className="posttext">{post?.desc}</span>
          <img className="postimg" src={post.img} alt="" />
        </div>
        <div className="postbottom">
          <div className="postbottomleft">
            <ThumbUp
              className="likeicon"
              htmlColor="blue"
              onClick={likeHandler}
            />
            <Favorite
               className="likeicon"
              htmlColor="tomato"
              onClick={likeHandler}
            />
            <span className="postlikecounter">{like} people liked it</span>
          </div>
          <div className="postbottomright">
            <span className="postcommenttext">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
