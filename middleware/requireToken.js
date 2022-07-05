const jwt=require('jsonwebtoken')
require('dotenv').config()
let User=require('../models/user.model')

module.exports=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
        return res.status(401).send("You must be logged in!")
    }
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,process.env.jwtKey,async (err,payload)=>{
        if(err){
        return res.status(401).send("You must be logged in!")   
        }
        const {userId}=payload
        const user=await User.findById(userId)
        req.user=user
        next()
    })
}