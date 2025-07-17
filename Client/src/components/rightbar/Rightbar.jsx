import React, { useEffect,useState,useContext} from 'react'
import './rightbar.css'
import { Users } from "../../dummyData";
import Online from '../online/Online';
import Profile from '../../pages/profile/Profile';
import axios from "axios"
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {Add,Remove} from '@mui/icons-material'

export default function Rightbar({user}) {
  const [friends,setFriends]=useState([])
  const PF=process.env.REACT_APP_PUBLIC_FOLDER
  const client_server = process.env.REACT_APP_CLIENT_SERVER;
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
        await axios.put(`${client_server}api/users/${user._id}/follow`,{ userId: currentUser._id });
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
  const HomeRightbar=()=>{
    return (
      <>
        <div className="birthdaycontainer">
          <img src="/assets/people/gift.jpg" alt="" className="birthdayimg" />
          <span className="birthdaytext">
            <b>Pola foster</b> and <b>3 others</b> have a birthday today
          </span>
        </div>
        <img className="rightbarad" src="/assets/people/adv.jpg" alt="" />
        <h4 className="rightbartitle">Online Friends</h4>
        <ul className="rightbarfriendlist">
          {Users.map((u) => (
            <Online user={u} key={u.id} />
          ))}
        </ul>
      </>
    );
  }
  const ProfileRightbar=()=>{
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarfollowbutton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarinfo">
          <div className="rightbarinfoitem">
            <span className="rightbarinfokey">City:</span>
            <span className="rightbarinfovalue">{user.city}</span>
          </div>
          <div className="rightbarinfoitem">
            <span className="rightbarinfokey">From:</span>
            <span className="rightbarinfovalue">{user.from}</span>
          </div>
          <div className="rightbarinfoitem">
            <span className="rightbarinfokey">Relationship:</span>
            <span className="rightbarinfovalue">{user.relationship}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rbfollowings">
          {friends.map((friend) => (
            <Link
              to={`/profile/${friend.username}`}
              key={friend._id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="rbfollowing">
                <img
                  src={
                    friend.profilepic
                      ? PF + friend.profilepic
                      : PF + "people/noprofile.png"
                  }
                  alt=""
                  className="rbfollowingimg"
                />
                <span className="rbfollowingname">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  }
  return (
    <div className="rightbar">
      <div className="rightbarwarp">
        {user ? <ProfileRightbar/> : <HomeRightbar/>}
      </div>
    </div>
  );
}
