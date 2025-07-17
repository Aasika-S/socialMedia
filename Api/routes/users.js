const router=require("express").Router()
const bcrypt=require("bcrypt")
const User=require("../models/User.js")

//update user
router.put("/:id/",async (req,res)=>{
    if(req.body.userId==req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt=await bcrypt.genSalt(10)
                req.body.password=await bcrypt.hash(req.body.password,salt)
            }catch(e){
               return res.status(500).json(e)
            }

        }
        try{
            const user=await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            })
            res.status(200).json("Account updated")
        }
        catch(e){
            return res.status(500).json(e); 
        }

    }else{
        return res.status(403).json("Can update only your acc")
    }
})

//delete user
 router.delete("/:id/", async (req, res) => {
   if (req.body.userId == req.params.id || req.body.isAdmin) {
     try {
       const user = await User.findByIdAndDelete({_id:req.params.id});
       res.status(200).json("Account deleted successfully");
     } catch (e) {
       return res.status(500).json(e);
     }
   } else {
     return res.status(403).json("Can delete only your account");
   }
 });

//get user
router.get("/", async (req, res) =>{
  const userId=req.query.userId
  const username=req.query.username

    try{
        const user= userId? 
        await User.findById(userId ):
        await User.findOne({username:username})
        const {password,updatedAt, ...other}=user._doc //doc carries all obj
        res.status(200).json(other)
    }catch(err){
        res.status(500).json(err)
    }
})

//get All users
router.get("/all", async (req,res)=>{
  try {
    const users = await User.find({});
    const usersData = users.map((user) => {
      const { password, updatedAt, ...other } = user._doc;
      return other;
    });
    res.status(200).json(usersData);
  } catch (err) {
    res.status(500).json(err);
  }
})

//follow user
router.put("/:id/follow", async (req, res) =>{
    if(req.body.userId!==req.params.id){
        try{
            const user=await User.findById(req.params.id)
            const currUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currUser.updateOne({$push:{following:req.params.id}})
                res.status(200).json("User followed")
            }
            else{
                res.status(403).json("Already following user")
            }
        }catch(e){
            res.status(500).json(e)
        }
    }
    else{
        res.status(403).json("Cant follow yourself")
    }

})

//fetch all followers of a user
router.get("/friends/:userId", async (req, res) =>{
    try{
      const user=await User.findById(req.params.userId)
      const friends=await Promise.all(
        user.following.map((friendId)=>{
          return User.findById(friendId)
        })
      )
      let friendList=[]
      friends.map((friend)=>{
        const {_id,username,profilepic}=friend
        friendList.push({_id,username,profilepic})
      })
      res.status(200).json(friendList)
      
    }catch(e){
        res.status(500).json(e)
    }
})

//unfollow user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("User unfollowed");
      } else {
        res.status(403).json("You dont following user");
      }
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.status(403).json("Cant unfollow yourself");
  }
});



// router.get("/",(req,res)=>{
//     res.send("Hey its user route")
// })

module.exports=router