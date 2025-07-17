const router=require("express").Router()
const Post=require("../models/Post.js")
const User=require("../models/User.js")



//create post
router.post("/",async (req,res)=>{
    const newPost= new Post(req.body)
    try{
        const savedPost=await newPost.save()
        res.status(200).json(savedPost)    
    }catch(e){
        res.status(500).json(e)
    }
})

//update post
router.put("/:id", async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if(post.userId===req.body.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("Post updated")
        }else{
            return res.status(403).json("Can update only your post")
        }
    }catch(e){
        res.status(500).json(e)
    }
})

//delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted");
    } else {
      return res.status(403).json("Can delete only your post");
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

//like/unlike post
router.put("/:id/like", async (req, res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("Post liked")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("Post disliked")
        }
    }catch(e){
        res.status(500).json(e)
    }

})


//get post
router.get("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch(e){
        res.status(500).json(e)
    }
})


//get timeline posts (All posts by an user)
router.get("/timeline/:userId",async (req,res)=>{
    try{     
        const currUser=await User.findById(req.params.userId) 
        const userPosts=await Post.find({userId:currUser._id})
        const friendPosts= await Promise.all(
            currUser.following.map((friendId)=>{
                return Post.find({userId:friendId})
            }))
            res.status(200).json(userPosts.concat(...friendPosts))
    }catch(e){
        res.status(500).json("Catch block")
    }
})

//Get all posts by user only
router.get("/profile/:username",async (req,res)=>{
    try{  
        const user=await User.findOne({username:req.params.username})
        if (!user) return res.status(404).json("User not found");
        const posts=await Post.find({userId:user._id})
        res.status(200).json(posts)    

    }catch(e){
        res.status(500).json(e)
    }
})



module.exports=router