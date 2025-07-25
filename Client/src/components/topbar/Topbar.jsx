import './topbar.css'
import {Search,Person,Chat,Notifications} from '@mui/icons-material'
import {Link} from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Logout } from "../../context/AuthActions";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Topbar() {

  // ... inside your component function
  const { user,dispatch } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const handleLogout = () => {
    dispatch(Logout());
    navigate('/login'); 
  };

  const PF=process.env.REACT_APP_PUBLIC_FOLDER
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <span className="logo">B'daySocial</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchBar">
          <Search className="searchIcon" />
          <input
            placeholder="search for friends, posts or videos"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarlink">HomePage</span>
          <span className="topbarlink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Link
              to={"/messenger"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Chat />
            </Link>
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        {
          <Link to={"/login"}>
            <button className="topbarLoginButton" onClick={handleLogout}>
              Logout
            </button>
          </Link>
        }
        <Link to={"/profile/" + user.username}>
          <img
            src={
              user.profilepic
                ? PF + user.profilepic
                : PF + "people/noprofile.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
