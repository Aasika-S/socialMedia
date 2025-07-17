import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversations/conversation'
import Message from '../../components/message/Message'
import Chatonline from '../../components/chatonline/Chatonline'
import { AuthContext } from '../../context/AuthContext'
import { useContext,useState,useEffect, useRef } from 'react'
import axios from 'axios'
import {io} from 'socket.io-client'
 

export default function Messenger() {
   const [conversations,setConversations] = useState([]) 
   const [currentChat, setCurrentChat] = useState(null);
   const [messages, setMessages] = useState([]); 
   const [newmessage,setNewmessage]=useState("")
   const [arrivalmessage,setArrivalmessage]=useState("")
   const [onlineUsers,setOnlineUsers]=useState([])
   const [sidebarUserList, setSidebarUserList] = useState([]); // To store details for sidebar (followers + followings)
   const socket = useRef();
   const {user} = useContext(AuthContext)
   const scrollRef=useRef()
   const PF = process.env.REACT_APP_PUBLIC_FOLDER;
   const client_server = process.env.REACT_APP_CLIENT_SERVER;
   const socket_server = process.env.REACT_APP_SOCKET_SERVER;


  useEffect(()=>{
    socket.current=io(socket_server)
    socket.current.on("getMessage", (data) => {
      setArrivalmessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      })
    });

    return () => {
      socket.current.disconnect();
    };
  },[]) 

  useEffect(() => {
    arrivalmessage &&
      currentChat?.members.includes(arrivalmessage.sender) &&
      setMessages((prev) => [...prev, arrivalmessage]);

  }, [arrivalmessage,currentChat]);

  useEffect(()=>{
    socket.current.emit("addUser",user?._id)
    socket.current.on("getUsers",(users)=>{
      setOnlineUsers(user.following.filter(f=>users.some(u=>u.userId===f)))
    })
  },[user])

  // Fetch details of users for the sidebar (followers and followings)
  useEffect(() => {
    const getSidebarUsers = async () => {
      if (!user || (!user.following?.length && !user.followers?.length)) {
        setSidebarUserList([]);
        return;
      }

      let followingDetails = [];
      let followerDetails = [];

      try {
        // Fetching details for users current user is FOLLOWING
        if (user.following && user.following.length > 0) {
          followingDetails = await Promise.all(
            user.following.map(async (followingId) => {
              if (followingId === user._id) return null; // Avoid fetching self
              const res = await axios.get(`${client_server}api/users?userId=${followingId}`);
              return res.data;
            })
          );
          followingDetails = followingDetails.filter(u => u); // Filter out nulls
        }

        // Fetching details for users who are FOLLOWERS of the current user
        if (user.followers && user.followers.length > 0) {
          followerDetails = await Promise.all(
            user.followers.map(async (followerId) => {
              if (followerId === user._id) return null; // Avoid fetching self
              const res = await axios.get(`${client_server}api/users?userId=${followerId}`);
              return res.data;
            })
          );
          followerDetails = followerDetails.filter(u => u); // Filter out nulls
        }

        // Combine and deduplicate
        const combinedUsers = [...followingDetails, ...followerDetails];
        const uniqueUsers = combinedUsers.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t._id === value._id // Assuming each user object has a unique _id
          ))
        );
        setSidebarUserList(uniqueUsers);

      } catch (e) {
        console.error("Error fetching sidebar user details:", e);
        setSidebarUserList([]);
      }
    };
    if (user?._id) { getSidebarUsers(); }
  }, [user]); // Rerun if user object (especially user.following) changes

   useEffect(()=>{
    const getConvos=async ()=>{
      if (!user?._id) return;
        try{
            const res = await axios.get(
              client_server+"api/conversations/" + user._id
            );
            setConversations(Array.isArray(res.data) ? res.data : []);
        }catch(e){
            console.error("Error fetching conversations:", e);
            setConversations([]);
        }
    }
    getConvos()
   },[user._id])

   useEffect(()=>{
    const getMessages=async ()=>{
        try{
            const res=await axios.get(client_server+"api/messages/"+currentChat?._id)
            setMessages(res.data)
        } catch(e) {
            // If currentChat._id is undefined (e.g. for a new chat), this might fail.
            // Set messages to empty if chat is new or ID is invalid.
            console.log(e) 
            setMessages([]);
        }
    } 
    getMessages()
   },[currentChat?._id])

  const handleSubmit= async (e)=>{
    e.preventDefault()
    if (!newmessage.trim()) return;

    let conversationToUse = currentChat;

    // If currentChat is a temporary object for a new chat, create the actual conversation first
    if (currentChat && currentChat.isNew && currentChat.otherUser) {
      try {
        const createRes = await axios.post(client_server+"api/conversations", {
          senderId: user._id,
          receiverId: currentChat.otherUser._id,
        });
        conversationToUse = createRes.data; // This is the actual new conversation object
        setCurrentChat(conversationToUse); // Update currentChat to the real one
        // Add to or update the main conversations list
        setConversations(prevConvos => {
          const existingIndex = prevConvos.findIndex(c => c._id === conversationToUse._id);
          if (existingIndex > -1) {
            const updatedConvos = [...prevConvos];
            updatedConvos[existingIndex] = conversationToUse;
            return updatedConvos;
          }
          return [...prevConvos, conversationToUse];
        });
      } catch (err) {
        console.error("Error creating new conversation:", err);
        return;
      }
    }

    if (!conversationToUse || !conversationToUse._id) {
      console.error("No valid conversation selected or created to send message.");
      return;
    }

    const message={
        sender:user._id,
        text:newmessage,
        conversationId:conversationToUse._id,
        profilepic:user.profilepic
    }

    const receiverId = conversationToUse.members.find((m) => m !== user._id);
    if (!receiverId) {
        console.error("Could not determine receiver ID for socket message.");
        return;
    }

    socket.current.emit("sendMessage",{
      senderId:user._id,
      receiverId: receiverId,
      text:newmessage,
      profilepic:user.profilepic
    })

    try{
        const res=await axios.post(client_server+"api/messages",message)
        setMessages([...messages,res.data])
        setNewmessage("")
    }catch(e){
        console.log(e)
    }
  } 
  
  const handleSelectUserForChat = async (selectedUser) => {
    try {
      const res = await axios.get(`${client_server}api/conversations/find/${user._id}/${selectedUser._id}`);
      if (res.data && res.data._id) { // Found existing conversation
        setCurrentChat(res.data);
      } else { // No existing conversation, set up for a new one
        setCurrentChat({ isNew: true, otherUser: selectedUser, members: [user._id, selectedUser._id] });
        setMessages([]); // Clear messages for a new chat
      }
    } catch (err) {
      console.error("Error finding or setting up conversation:", err);
      // Optionally, set currentChat to null or show an error
      setCurrentChat(null);
      setMessages([]);
    }
  };

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({
      behavior:"smooth"
    },[messages.text])
  })

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatmenu">
          <div className="chatmenuwrap">
            <input
              placeholder="Search for friends"
              className="chatmenuinput"
              type="text"
            />

            {sidebarUserList.map((sidebarUser) => (
              <div
                key={sidebarUser._id}
                onClick={() => handleSelectUserForChat(sidebarUser)}
                className={`messengerSidebarItem ${
                  currentChat &&
                  ((currentChat.isNew && currentChat.otherUser?._id === sidebarUser._id) ||
                    (!currentChat.isNew && currentChat.members?.includes(sidebarUser._id) && sidebarUser._id !== user._id))
                    ? "selected"
                    : ""
                }`} 
              >
                {/* Display user info directly, not using Conversation component here as it expects a conversation object */}
                <img
                  className="messengerSidebarItemImg"
                  src={
                    sidebarUser.profilepic
                      ? PF + sidebarUser.profilepic
                      : PF + "people/noprofile.png"
                  }
                  alt={sidebarUser.username}
                />
                <span className="messengerSidebarItemName">{sidebarUser.username}</span>
              </div>
            ))}

            {/* You could also list existing conversations separately if desired */}
          </div>
        </div>
        <div className="chatbox">
          <div className="chatboxwrap">
            {
                currentChat? (<>
                
             
            <div className="chatboxtop">
                {messages.map((m)=>(
                    <div ref={scrollRef}>
                    <Message message={m} own={m.sender==user._id} key={m._id}/>
                    </div>

                ))}
              
            </div>
            <div className="chatboxbottom">
              <textarea
                placeholder="write something.."
                className="chatmessageinput"
                onChange={(e)=>setNewmessage(e.target.value)}
                value={newmessage}
              ></textarea>
              <button 
                onClick={handleSubmit} 
                className="chatsubmitbtn"
                disabled={!currentChat || !newmessage.trim()} // Disable if no chat selected or message empty
              >Send</button>
            </div>
            </>) : (<span className='noconvotext'>Open a conversation</span>)}
          </div>
        </div>
        <div className="chatonline">
          <div className="chatonlinewrap">
            <Chatonline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
          </div>
        </div>
      </div>
    </>
  );
}
