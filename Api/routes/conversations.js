const router = require("express").Router();
const Conversation = require("../models/Conversation.js");

//new conv
router.post("/", async (req, res) => {
    const newConvo=new Conversation({
        members:[req.body.senderId,req.body.receiverId],        
    })
    try{
        const savedConvo=await newConvo.save();
        res.status(200).json(savedConvo);

    }catch(e){
        res.status(500).json(e)
    }
})

//get convo of user
router.get("/:userId", async (req, res) => {
    try{
        const conversation=await Conversation.find({
            members:{$in:[req.params.userId]},
        });
        res.status(200).json(conversation);
    }catch(e){  
        console.log(e)
        res.status(500).json(e);
    }
}
)

//get convo includes 2 userID
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try{
        const conversation=await Conversation.findOne({
            members:{$all:[req.params.firstUserId,req.params.secondUserId]},
        });
        res.status(200).json(conversation);
    }catch(e){
        res.status(500).json(e)
    }
})





module.exports =router