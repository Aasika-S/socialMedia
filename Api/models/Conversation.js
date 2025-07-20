const mongoose=require("mongoose") 

const ConverationSchema= new mongoose.Schema({
    members:{
        type:Array,
    },
},   
{timestamps:true}
)

module.exports=mongoose.model("Conversation",ConverationSchema)