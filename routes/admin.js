const router=require('express').Router()
require('dotenv').config()
const jwt=require('jsonwebtoken')
let Admin=require('../models/admin.model')
let User=require('../models/user.model')
router.post('/adminSignup',async(req,res) =>{
    const {email,password}=req.body
    const admin=new Admin({
        email: email,
        password: password,
        approvals: []
    })
    admin.save()
    .then(()=>{
    token=jwt.sign({userId: admin._id},process.env.jwtKey)
    res.json({token})})
    .catch(err=>res.status(400).json("Error: "+err))
})

router.route('/adminSignin').post(async(req,res) =>{
    const users=await User.find()
    const {email,password}=req.body
    if(!email || !password){
        return res.status(422).send("Error: Wrong email or password!")
    }
    const admin=await Admin.findOne({email})
    if(!admin){
        return res.status(422).send("Error: Wrong email or password!")
    }
    admin.comparePassword(password).then(()=>{
        token=jwt.sign({userId: admin._id},process.env.jwtKey)
        res.json({token,users})
    }).catch((err)=>res.status(422).send("Error: Wrong email or password!"))
});

router.route('/approveUser').post(async(req,res) =>{
    const {_id}=req.body
    const user=await User.findById(_id)
    if(user){
    await user.updateOne({approved: true})
    res.json("User Approved")
    }
});

module.exports=router;