import './feed.css'
import Share from '../share/Share'
import Post from '../post/Post'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

// import {Users,Posts} from '../../dummyData'

export default function Feed({username}) {
  const [posts,setPosts]=useState([])
  const [text,setText]=useState("")
  const {user}=useContext(AuthContext)
  const PF=process.env.REACT_APP_PUBLIC_FOLDER
  const client_server = process.env.REACT_APP_CLIENT_SERVER;

  // [] used in useEffect so that its rendered only once
  // [text] useEffect runs when text modified
  useEffect(()=>{
    const fetchPosts=async ()=>{
    const res = username
      ? await axios.get(
          client_server + "api/posts/profile/" + username
        )
      : await axios.get(client_server + "api/posts/timeline/" + user._id);
        setPosts(res.data.sort((p1,p2)=>{
          return new Date(p2.createdAt)-new Date(p1.createdAt)
        }))
        if(posts.length===0){
          const commonPosts = await axios.get(
            client_server + "api/posts/profile/Random"
          );
          setPosts(commonPosts.data)
        }
        console.log("Length data here",posts.length)
    }
    fetchPosts()
  },[username,user._id])
 
  return (
    <div className="feed">
      <div className="feedwrap">
        {(!username || username == user.username) && <Share />}
        {posts.map((p) => (
          <Post post={p} key={p._id} />
        ))}
      </div>
    </div>
  );
}
