import React,{useContext,useRef,useState} from 'react'
import './share.css'
import {PermMedia,Label,Room,EmojiEmotions} from '@mui/icons-material'
import { AuthContext } from '../../context/AuthContext';
import axios from "axios"
import { Cancel } from '@mui/icons-material';

export default function Share() {
  const {user}=useContext(AuthContext)
  const PF=process.env.REACT_APP_PUBLIC_FOLDER
  const client_server = process.env.REACT_APP_CLIENT_SERVER;
  const desc=useRef() //use current to extract
  const [file,setFile]=useState(null)

  const submitHandler=async (e)=>{
    e.preventDefault()
    const newPost={
      userId:user._id,
      desc:desc.current.value
    }
    if(file){
      const data=new FormData()
      const filename=Date.now()+file.name
      data.append("name",filename)
      data.append("file",file)
      newPost.img=filename
      try{
        await axios.post(client_server+'api/upload',data)
      }catch(e){
        console.log(e)
      }
    }
    try{
      await axios.post(client_server+'api/posts',newPost)
      window.location.reload()
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="share">
      <div className="sharewrap">
        <div className="sharetop">
          <img
            className="shareprofileimg"
            src={user.profilepic?PF+user.profilepic:PF+'people/noprofile.png'}
            alt=""
          />
          <input
            placeholder={`Whats in ur mind ${user.username}?`}
            type="text"
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {
          file && (
            <div className='shareimgcontainer'>
              {/* Allows creating pseudo url to show image before upload */}
                <img className="shareimg" src={URL.createObjectURL(file)} alt="" />
                <Cancel className="sharecancel" onClick={()=>setFile(null)} />
            </div>
          )
        }
        <form className="sharebottom" onSubmit={submitHandler}>
          <div className="shareoptions">
            <label htmlFor='file' className="shareoption">
              <PermMedia htmlColor="tomato" className="shareicon" />
              <span className="shareoptiontext">Photo or Video</span>
              <input style={{display:'none'}} type="file" id='file' accept='.png,.jpg,.jpeg' onChange={(e)=>setFile(e.target.files[0])} />
            </label>
            <div className="shareoption">
              <Label htmlColor="blue" className="shareicon" />
              <span className="shareoptiontext">Tag</span>
            </div>
            <div className="shareoption">
              <Room htmlColor="green" className="shareicon" />
              <span className="shareoptiontext">Location</span>
            </div>
            <div className="shareoption">
              <EmojiEmotions htmlColor="goldenrod" className="shareicon" />
              <span className="shareoptiontext">Feelings</span>
            </div>
          </div>
          <button className="sharebutton" type='submit'>Share</button>
        </form>
      </div>
    </div>
  );
}
