import './sidebar.css'
import {RssFeed,HelpOutline,WorkOutline,Event,School,Chat,Bookmark,Group} from "@mui/icons-material";
import Close from '../closefriends/Close';
import {useEffect,useState} from 'react'
import axios from 'axios'


export default function Sidebar() {

  const [allUsers, setAllUsers] = useState([]);
  const client_server=process.env.REACT_APP_CLIENT_SERVER

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get(client_server+"api/users/all");
        setAllUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch all users:", err);
      }
    };
    fetchAllUsers();
  }, []);

  return (
    <div className='sidebar'>
      <div className="sidebarwrap">
          <ul className="sidebarlist">
            <li className="sidebarlistitem">
              <RssFeed className="sidebaricon"/>
              <span className="sidebarlistitemtext">Feed</span>  
            </li>
            <li className="sidebarlistitem">
              <HelpOutline className="sidebaricon"/>
              <span className="sidebarlistitemtext">Questions</span>  
            </li>
            <li className="sidebarlistitem">
              <Chat className="sidebaricon"/>
              <span className="sidebarlistitemtext">Chats</span>  
            </li>
            <li className="sidebarlistitem">
              <Group className="sidebaricon"/>
              <span className="sidebarlistitemtext">Groups</span>  
            </li>
            <li className="sidebarlistitem">
              <Bookmark className="sidebaricon"/>
              <span className="sidebarlistitemtext">Bookmark</span>  
            </li>
            <li className="sidebarlistitem">
              <WorkOutline className="sidebaricon"/>
              <span className="sidebarlistitemtext">Jobs</span>  
            </li>
            <li className="sidebarlistitem">
              <Event className="sidebaricon"/>
              <span className="sidebarlistitemtext">Events</span>  
            </li>
            <li className="sidebarlistitem">
              <School className="sidebaricon"/>
              <span className="sidebarlistitemtext">Courses</span>  
            </li>
          </ul>
          <button className='sidebarbutton'>Show more</button>
          <hr className='sidebarHr' />
          <ul className="sidebarFriendlist">
          {allUsers.length > 0 ? (
              allUsers.map(u => (
                <Close key={u._id} user={u} />
              ))
              ):(
              <p>Loading users...</p>
            )}
          </ul>
      </div>
    </div>
  )
}
