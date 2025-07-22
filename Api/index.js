const express= require('express')
const cors=require("cors")

const app=express()
const mongoose= require('mongoose')
const dotenv= require('dotenv')
const helmet= require('helmet')
const morgan= require('morgan')
const mongodb=require('mongodb')
const multer=require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const path=require("path")


const userRoute=require("./routes/users.js")
const authRoute=require("./routes/auth.js")
const postRoute=require("./routes/posts.js")
const conversationRoute=require("./routes/conversations.js")
const messageRoute=require("./routes/messages.js")

dotenv.config()
console.log("hi")

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to DB"))
  .catch((e) => console.log(e));

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

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "socialmedia", // You can name this folder whatever you want in Cloudinary
      public_id: (req, file) => req.body.name, // Use the name from the request body
    },
  });

  const upload=multer({storage: storage})
  app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
      // req.file.path contains the URL of the uploaded image on Cloudinary
      return res.status(200).json({message: "File uploaded successfully", url: req.file.path})
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
