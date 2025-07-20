const express= require('express')
const cors=require("cors")

const app=express()
const mongoose= require('mongoose')
const dotenv= require('dotenv')
const helmet= require('helmet')
const morgan= require('morgan')
const mongodb=require('mongodb')
const multer=require("multer")
const path=require("path")


const userRoute=require("./routes/users.js")
const authRoute=require("./routes/auth.js")
const postRoute=require("./routes/posts.js")
const conversationRoute=require("./routes/conversations.js")
const messageRoute=require("./routes/messages.js")

dotenv.config()
console.log("hi")
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to DB"))
  .catch((e) => console.log(e));

  app.use("/images",cors(
    {
      origin:process.env.REACT_APP_MAIN_SERVER,
      credentials:true
    }
  ),express.static(path.join(__dirname,"public/images")))

  //middleware
  app.use(express.json())
  app.use(helmet());
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  app.use(cors(
    {
      origin:process.env.REACT_APP_MAIN_SERVER,
      credentials:true
    }
  ))
  app.use(morgan("common"))
  app.use("/api/users",userRoute)
  app.use("/api/auth",authRoute)
  app.use("/api/posts",postRoute)
  app.use("/api/conversations", conversationRoute);
  app.use("/api/messages",messageRoute)

  const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,"public/images")
    },
    filename:(req,file,cb)=>{
      cb(null,req.body.name)
    }
  })

  const upload=multer({storage})
  app.post("/api/upload",upload.single("file"),async (req,res)=>{
    try{
      return res.status(200).json("File uploaded successfully")
    }catch(e){
      console.log(e)
      return res.status(500).json("Upload failed");
    }
  })
  

  app.get("/",(req,res)=>{
    res.send("Welcome to homepage")
  })
  app.get("/users",(req,res)=>{
    res.send("Welcome to USers page")
  })


const PORT = process.env.REACT_APP_SERVER_PORT || 8800;
  
app.listen(PORT,()=>{
    console.log("Backend server running")
})
