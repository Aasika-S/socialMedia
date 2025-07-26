const router = require("express").Router();
const User=require("../models/User.js")
const bcrypt=require("bcrypt")

//Register
// router.get("/register", async (req, res) => {
//   const user= await new User({
//     username:"john",
//     email:"john@gmail.com",
//     password:"123456"
//   })
//   await user.save()
//   res.send("ok")
// });
router.post("/register", async (req, res) => { 
  try{
    //hash the password
    const salt=await bcrypt.genSalt(10)
    const hashedpw=await bcrypt.hash(req.body.password,salt)

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedpw,
    });

    //Save user to db and respond
    const user= await newUser.save()
    res.status(200).json(user)
  }catch(err){
    console.log(err)
  }
});

router.post('/login',async (req,res)=>{
    try{
        const user= await User.findOne({email:req.body.email});
        if(!user) return res.status(404).json("User not found")

        const validpw=await bcrypt.compare(req.body.password,user.password)
        if(!validpw) return res.status(400).json("Wrong password")

        res.status(200).json(user)

    }catch(e){
       res.status(500).json(e)
    }
})

module.exports = router;
