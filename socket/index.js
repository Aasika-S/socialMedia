const {Server}=require('socket.io');
const dotenv = require("dotenv");
dotenv.config()

const PORT = process.env.REACT_APP_SOCKET_PORT || 8900;
const io = new Server(PORT, {
  cors: {
    origin: process.env.REACT_APP_MAIN_SERVER,
  },
});

let users=[]

const addUser=(userId,socketId)=>{
    !users.some((user)=>user.userId===userId)&&
    users.push({userId,socketId});
}
const removeUser=(socketId)=>{
    users=users.filter((user)=>user.socketId!==socketId);
}
const getUser=(userId)=>{
    return users.find((user)=>user.userId===userId);
}



io.on("connection",(socket)=>{
    //when user connects
    console.log("a user connected");

    //after every conn taking userId and socketId
    socket.on("addUser",(userId)=>{
        addUser(userId,socket.id);
        io.emit("getUsers",users); 
    })

    //send and get message
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        const user = getUser(receiverId);
        // If the user is found (i.e., online), send them the message in real-time.
        if (user) {
            io.to(user.socketId).emit("getMessage",{
                senderId,
                text,
            });
        }
    })


    //when user disconnects
    socket.on("disconnect",()=>{
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers",users);
    })
})
