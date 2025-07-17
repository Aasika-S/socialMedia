const router = require("express").Router();
const Message = require("../models/Message.js");

//add
 router.post("/", async (req, res) => {
    const newmsg=new Message(req.body)

    try{
        const savedmsg=await newmsg.save()
        res.status(200).json(savedmsg)
    }catch(e){
        res.status(500).json(e)
    }

})

//get all msgs in conv
router.get("/:conversationId", async (req, res) => {
    try{
        const messages=await Message.find({
            conversationId:req.params.conversationId,
        })
        res.status(200).json(messages)
    }catch(e){
        res.status(500).json(e)
    }
})

module.exports = router;
